import { NextResponse } from 'next/server';
import { randomInt } from 'node:crypto';
import { put } from '@vercel/blob';
import { eventRegistrationSchema } from '@/models/schemas/event-registration.schema';
import { SOD_PROOF_MAX_BYTES } from '@/models/schemas/sod.schema';
import { resolveImageMime } from '@/lib/image-mime';

export const runtime = 'nodejs';

/**
 * Generic paid-event registration route (any event with `has_payment: true`).
 * Every paid event submits here and rows are distinguished by the Event Name
 * and Event Date columns written ahead of the registrant's details.
 *
 * A submission may cover a group: the primary registrant plus any number of
 * additional registrants (names only). Each person becomes its own sheet row
 * and every row carries the same proof-of-payment image and the same reference
 * number (column M), since one payment covers the whole group.
 *
 * The owner-supplied target Sheet ID is hardcoded as a fallback so the route
 * still writes even when GOOGLE_SPREADSHEET_G12_EVENTS isn't set in the Vercel
 * environment; the env var wins when present. (Without this fallback, a missing
 * env var silently hit the "not configured" branch below and returned a FALSE
 * `success: true` — the registrant saw "successful" but nothing reached the
 * sheet. Same pattern as the SOD enrollees route.)
 */
const SPREADSHEET_ID =
  process.env.GOOGLE_SPREADSHEET_G12_EVENTS || '1RZRZAV0s3X-zoq_lxfx7uLspSk7XtdrEigYmz2SZEew';

/**
 * Map event slug → Google Sheets tab name.
 * Tab names with spaces must be single-quoted in A1 notation.
 */
function resolveSheetTab(eventSlug: string): string {
  switch (String(eventSlug ?? '').trim()) {
    case 'g12-campus-rev-cebu-2026':
      return 'CAMPUS REVOLUTION';
    default:
      return 'CAMPUS REVOLUTION';
  }
}

// Wrap in single quotes so tab names with spaces are valid A1 notation.
const sheetRangeForTab = (tab: string) => `'${tab}'!A:M`;

// Ambiguous characters (0/O, 1/I) are left out so references stay readable when
// a registrant reads theirs out over the phone or copies it from a screenshot.
const REFERENCE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

/**
 * One reference number per payment. Every registrant covered by the same
 * submission (and therefore the same proof of payment) shares it, so staff can
 * match a group of sheet rows back to a single payment.
 */
function generateReferenceNumber(manilaParts: { year: string; month: string; day: string }): string {
  let suffix = '';
  for (let i = 0; i < 5; i += 1) {
    suffix += REFERENCE_ALPHABET[randomInt(REFERENCE_ALPHABET.length)];
  }
  return `GWC-${manilaParts.year}${manilaParts.month}${manilaParts.day}-${suffix}`;
}

/** Date parts in Asia/Manila — the timezone every other sheet value uses. */
function manilaDateParts(date: Date): { year: string; month: string; day: string } {
  const [month, day, year] = date
    .toLocaleDateString('en-US', {
      timeZone: 'Asia/Manila',
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    })
    .split('/');

  return { year, month, day };
}

interface SheetResult {
  success: boolean;
  message: string;
}

interface AdditionalRegistrant {
  firstName: string;
  lastName: string;
}

/**
 * Guarantee the proof image is stored as WebP. The client already converts
 * most uploads (canvas), but that is best-effort — older browsers, decode
 * errors, and HEIC photos can slip through as the original format. This
 * re-encodes server-side with sharp (lazy import) as a safety net.
 */
async function ensureWebp(
  inputBuffer: Buffer,
  originalMime: string
): Promise<{ buffer: Buffer; mime: string; ext: string }> {
  if (originalMime === 'image/webp') {
    return { buffer: inputBuffer, mime: 'image/webp', ext: 'webp' };
  }

  try {
    const sharp = (await import('sharp')).default;
    const webpBuffer = await sharp(inputBuffer).rotate().webp({ quality: 90 }).toBuffer();
    return { buffer: webpBuffer, mime: 'image/webp', ext: 'webp' };
  } catch (conversionError) {
    console.error('Server-side WebP conversion failed; storing original:', conversionError);
    const ext = (originalMime.split('/')[1] || 'png').split('+')[0].replace('jpeg', 'jpg');
    return { buffer: inputBuffer, mime: originalMime, ext };
  }
}

/**
 * Upload the proof image to Vercel Blob and return its public URL.
 */
async function uploadProofToBlob(
  inputBuffer: Buffer,
  originalMime: string,
  lastName: string
): Promise<string> {
  const { buffer, mime, ext } = await ensureWebp(inputBuffer, originalMime);
  const safeBase = `${lastName || 'registrant'}`.replace(/[^a-zA-Z0-9._-]/g, '_');

  const blob = await put(`event-proofs/${safeBase}.${ext}`, buffer, {
    access: 'public',
    addRandomSuffix: true,
    contentType: mime,
  });

  return blob.url;
}

interface AppendParams {
  data: Record<string, unknown>;
  eventSlug: string;
  eventTitle: string;
  eventDate: string;
  proofUrl: string;
  proofProvided: boolean;
  /** Asia/Manila submission time — the same value the registrant sees. */
  timestamp: string;
  /** Shared by every row of this submission. */
  referenceNumber: string;
}

async function appendToGoogleSheet({
  data,
  eventSlug,
  eventTitle,
  eventDate,
  proofUrl,
  proofProvided,
  timestamp,
  referenceNumber,
}: AppendParams): Promise<SheetResult> {
  const sheetTab = resolveSheetTab(eventSlug);
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey || !SPREADSHEET_ID) {
    return { success: true, message: 'Logged locally (Google Sheets not configured)' };
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { google } = require('googleapis');

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Social handles — one "Platform: @handle" per line.
    const socialMedia = Array.isArray(data.socialMedia)
      ? (data.socialMedia as Array<{ platform: string; handle: string }>)
          .filter((s) => s.platform && s.handle)
          .map((s) => `${s.platform}: ${s.handle}`)
          .join('\n')
      : '';

    // Proof cell: render the image inline AND make it clickable so staff can
    // open the full-size proof in a new tab. HYPERLINK wraps IMAGE() — the cell
    // shows the thumbnail and links to the original Blob URL for preview.
    const proofCell = proofUrl
      ? `=HYPERLINK("${proofUrl}", IMAGE("${proofUrl}"))`
      : proofProvided
        ? 'Proof upload failed — please follow up'
        : '';

    // Column order: A–M. Event Name + Event Date lead the registrant details so
    // rows from every paid event can be told apart on the shared sheet.
    const buildRow = (firstName: string, lastName: string, cellLeaderOverride?: string) => [
      timestamp,                // A  Timestamp
      eventTitle || '',         // B  Event Name
      eventDate || '',          // C  Event Date
      firstName,                // D  First Name
      lastName,                 // E  Last Name
      cellLeaderOverride !== undefined ? cellLeaderOverride : (data.cellLeader || ''),    // F  Cell Leader
      '',                       // G  (Birthdate removed — column kept blank to preserve existing sheet alignment)
      data.email || '',         // H  Email
      data.phone || '',         // I  Phone
      socialMedia,              // J  Social Handles
      referenceNumber,          // M  Reference No. (shared by every row of this payment)
      proofCell,                // L  Proof of Payment (=IMAGE)
    ];

    // Group registration: one row per person. The extra registrants only supply
    // their names — contact details, socials, and the proof of payment are copied 
    // from the primary registrant, but the cell leader field is left blank.
    const rows = [
      buildRow(String(data.firstName ?? ''), String(data.lastName ?? '')),
      ...(Array.isArray(data.additionalRegistrants)
        ? (data.additionalRegistrants as AdditionalRegistrant[]).map((registrant) =>
            buildRow(registrant.firstName ?? '', registrant.lastName ?? '', '')
          )
        : []),
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetRangeForTab(sheetTab),
      valueInputOption: 'USER_ENTERED',
      // Force every submission onto a fresh row that starts at column A.
      // Without INSERT_ROWS, append's default OVERWRITE mode mis-detects the
      // "table": the isolated =HYPERLINK/=IMAGE() cell in the last column (L),
      // separated from the rest by empty optional cells, makes the next row
      // anchor at that column (L) instead of A. INSERT_ROWS inserts a brand-new
      // row and writes the values from the range's first column (A).
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: rows,
      },
    });

    return {
      success: true,
      message:
        rows.length > 1
          ? `Added ${rows.length} registrants to Google Sheets (${sheetTab})`
          : `Added to Google Sheets (${sheetTab})`,
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'MODULE_NOT_FOUND') {
      return { success: true, message: 'Logged locally (googleapis not installed)' };
    }
    console.error('Google Sheets error:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Parse social media from JSON string.
    let socialMedia: Array<{ platform: string; handle: string }> = [];
    try {
      socialMedia = JSON.parse(String(formData.get('socialMedia') ?? '[]'));
    } catch {
      socialMedia = [];
    }

    // Extra people covered by this same payment — one sheet row each.
    // Anything malformed degrades to "registering alone" rather than failing.
    let additionalRegistrants: AdditionalRegistrant[] = [];
    try {
      const parsed = JSON.parse(String(formData.get('additionalRegistrants') ?? '[]'));
      if (Array.isArray(parsed)) {
        additionalRegistrants = parsed
          .map((registrant) => ({
            firstName: String(registrant?.firstName ?? '').trim(),
            lastName: String(registrant?.lastName ?? '').trim(),
          }))
          .filter((registrant) => registrant.firstName || registrant.lastName);
      }
    } catch {
      additionalRegistrants = [];
    }

    const fields = {
      firstName: String(formData.get('firstName') ?? ''),
      lastName: String(formData.get('lastName') ?? ''),
      cellLeader: String(formData.get('cellLeader') ?? ''),
      email: String(formData.get('email') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      socialMedia,
      registerMultiple: additionalRegistrants.length > 0,
      additionalRegistrants,
    };

    const validationResult = eventRegistrationSchema.safeParse(fields);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid submission data', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const eventSlug = String(formData.get('eventSlug') ?? '');
    const eventTitle = String(formData.get('eventTitle') ?? '');
    const eventDate = String(formData.get('eventDate') ?? '');

    // Handle proof of payment upload. Payment is required — reject if missing.
    const proof = formData.get('proofOfPayment');
    const proofProvided = proof instanceof Blob && proof.size > 0;

    if (!proofProvided) {
      return NextResponse.json(
        { error: 'Proof of payment is required' },
        { status: 400 }
      );
    }

    let proofUrl = '';
    if (proofProvided) {
      const proofBlob = proof as Blob;

      if (proofBlob.size > SOD_PROOF_MAX_BYTES) {
        return NextResponse.json(
          { error: 'Proof of payment must be 10 MB or smaller' },
          { status: 400 }
        );
      }

      // Sniff magic bytes — never trust multipart Content-Type.
      const proofBytes = Buffer.from(await proofBlob.arrayBuffer());
      const realMime = resolveImageMime(
        proofBytes,
        proofBlob.type || '',
        (proofBlob as File).name || ''
      );

      if (!realMime) {
        return NextResponse.json(
          { error: 'Proof of payment must be an image file' },
          { status: 400 }
        );
      }

      // Upload is best-effort — enrollment is still recorded if Blob upload fails.
      try {
        proofUrl = await uploadProofToBlob(proofBytes, realMime, validationResult.data.lastName);
      } catch (blobError) {
        console.error('Vercel Blob upload failed:', blobError);
      }
    }

    // Generated here (not inside the sheet writer) so the registrant still gets
    // a reference number and timestamp when Google Sheets isn't configured.
    const submittedAt = new Date();
    const timestamp = submittedAt.toLocaleString('en-US', { timeZone: 'Asia/Manila' });
    const referenceNumber = generateReferenceNumber(manilaDateParts(submittedAt));

    const result = await appendToGoogleSheet({
      data: validationResult.data as unknown as Record<string, unknown>,
      eventSlug,
      eventTitle,
      eventDate,
      proofUrl,
      proofProvided,
      timestamp,
      referenceNumber,
    });

    return NextResponse.json({
      ...result,
      referenceNumber,
      timestamp,
      registeredCount: 1 + additionalRegistrants.length,
      message: 'Registration received successfully',
    });
  } catch (error) {
    console.error('Event registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process registration' },
      { status: 500 }
    );
  }
}
