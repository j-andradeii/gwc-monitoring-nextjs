import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { eventRegistrationSchema } from '@/models/schemas/event-registration.schema';
import { SOD_PROOF_MAX_BYTES } from '@/models/schemas/sod.schema';
import { resolveImageMime } from '@/lib/image-mime';

export const runtime = 'nodejs';

/**
 * G12 Campus Revolution (and future campus events) spreadsheet.
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
const sheetRangeForTab = (tab: string) => `'${tab}'!A:J`;

interface SheetResult {
  success: boolean;
  message: string;
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

async function appendToGoogleSheet(
  data: Record<string, unknown>,
  eventSlug: string,
  proofUrl: string,
  proofProvided: boolean
): Promise<SheetResult> {
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

    // Timestamp in Asia/Manila timezone.
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' });

    // Birthdate — formatted as local US string for readability.
    let birthdateStr = '';
    if (data.birthdate) {
      const bd = new Date(data.birthdate as string | number | Date);
      birthdateStr = bd.toLocaleDateString('en-US');
    }

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

    // Column order: A–J
    const row = [
      timestamp,                // A  Timestamp
      data.firstName || '',     // B  First Name
      data.lastName || '',      // C  Last Name
      data.cellLeader || '',    // D  Cell Leader
      birthdateStr,             // E  Birthdate
      data.email || '',         // F  Email
      data.phone || '',         // G  Phone
      socialMedia,              // H  Social Handles
      data.amountSent || '',    // I  Amount Sent
      proofCell,                // J  Proof of Payment (=IMAGE)
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetRangeForTab(sheetTab),
      valueInputOption: 'USER_ENTERED',
      // Force every submission onto a fresh row that starts at column A.
      // Without INSERT_ROWS, append's default OVERWRITE mode mis-detects the
      // "table": the isolated =HYPERLINK/=IMAGE() cell in the last column (J),
      // separated from the rest by empty optional cells, makes the next row
      // anchor at that column (J) instead of A. INSERT_ROWS inserts a brand-new
      // row and writes the values from the range's first column (A).
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [row],
      },
    });

    return { success: true, message: `Added to Google Sheets (${sheetTab})` };
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

    const birthdateRaw = formData.get('birthdate');
    const fields = {
      firstName: String(formData.get('firstName') ?? ''),
      lastName: String(formData.get('lastName') ?? ''),
      cellLeader: String(formData.get('cellLeader') ?? ''),
      birthdate: birthdateRaw ? new Date(String(birthdateRaw)) : undefined,
      email: String(formData.get('email') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      socialMedia,
      amountSent: String(formData.get('amountSent') ?? ''),
    };

    const validationResult = eventRegistrationSchema.safeParse(fields);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid submission data', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const eventSlug = String(formData.get('eventSlug') ?? '');

    // Handle proof of payment upload.
    const proof = formData.get('proofOfPayment');
    const proofProvided = proof instanceof Blob && proof.size > 0;

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

    const result = await appendToGoogleSheet(
      validationResult.data as unknown as Record<string, unknown>,
      eventSlug,
      proofUrl,
      proofProvided
    );

    return NextResponse.json({
      ...result,
      message: 'Registration received successfully',
    });
  } catch (error) {
    console.error('Campus Revolution registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process registration' },
      { status: 500 }
    );
  }
}
