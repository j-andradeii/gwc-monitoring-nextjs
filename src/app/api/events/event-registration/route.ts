import { NextResponse, after } from 'next/server';
import { randomInt } from 'node:crypto';
import { eventRegistrationSchema } from '@/models/schemas/event-registration.schema';
import { readProofBlob, uploadProofToBlob } from '@/lib/event-proof-upload';
import { sendRegistrationEmails } from '@/lib/email/event-registration-email';
import {
  EVENT_REGISTRATION_SPREADSHEET_ID,
  PROOF_UPLOAD_FAILED_NOTE,
  buildProofCell,
  getSheetsClient,
  resolveSheetTab,
  sheetRangeForTab,
} from '@/lib/event-registration-sheet';

export const runtime = 'nodejs';

/**
 * Generic paid-event registration route (any event with `has_payment: true`).
 * Every paid event submits here and rows are distinguished by the Event Name
 * and Event Date columns written ahead of the registrant's details.
 *
 * A submission may cover a group: the primary registrant plus any number of
 * additional registrants (names only). Each person becomes its own sheet row
 * and every row carries the same proof-of-payment image and the same reference
 * number (column K), since one payment covers the whole group.
 *
 * Proof of payment is OPTIONAL — a registrant may reserve their slot first and
 * send the proof later from the "Complete your registration" panel, which
 * fills in column L for every row sharing their reference number (see
 * ./proof/route.ts).
 *
 * Sheet ID, tab resolution and the proof-cell format live in
 * lib/event-registration-sheet.ts because the proof route reads the same rows
 * back and must agree on all three.
 */

// Ambiguous characters (0/O, 1/I) are left out so references stay readable when
// a registrant reads theirs out over the phone or copies it from a screenshot.
const REFERENCE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

/**
 * One reference number per payment. Every registrant covered by the same
 * submission (and therefore the same proof of payment) shares it, so staff can
 * match a group of sheet rows back to a single payment — and so the registrant
 * can attach their proof to that same group later.
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

  try {
    const sheets = getSheetsClient();

    if (!sheets) {
      return { success: true, message: 'Logged locally (Google Sheets not configured)' };
    }

    // Social handles — one "Platform: @handle" per line.
    const socialMedia = Array.isArray(data.socialMedia)
      ? (data.socialMedia as Array<{ platform: string; handle: string }>)
          .filter((s) => s.platform && s.handle)
          .map((s) => `${s.platform}: ${s.handle}`)
          .join('\n')
      : '';

    // Empty when no proof was sent — the registrant can fill it in later with
    // their reference number, which writes this exact cell format.
    const proofCell = proofUrl
      ? buildProofCell(proofUrl)
      : proofProvided
        ? PROOF_UPLOAD_FAILED_NOTE
        : '';

    // Column order: A–L. Event Name + Event Date lead the registrant details so
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
      referenceNumber,          // K  Reference No. (shared by every row of this payment)
      proofCell,                // L  Proof of Payment (=IMAGE, or blank until sent)
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
      spreadsheetId: EVENT_REGISTRATION_SPREADSHEET_ID,
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

    // Proof of payment is optional: a registrant may reserve their slot now and
    // upload the proof later against their reference number. A malformed or
    // oversized file is still rejected — silently dropping it would leave the
    // registrant thinking their payment was recorded.
    const proof = formData.get('proofOfPayment');
    const proofProvided = proof instanceof Blob && proof.size > 0;

    let proofUrl = '';
    if (proofProvided) {
      const proofFile = await readProofBlob(proof as Blob);

      if (!proofFile.ok) {
        return NextResponse.json({ error: proofFile.error }, { status: 400 });
      }

      // Upload is best-effort — registration is still recorded if Blob upload fails.
      try {
        proofUrl = await uploadProofToBlob(
          proofFile.bytes,
          proofFile.mime,
          validationResult.data.lastName
        );
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

    // Emailed copy of the receipt for the registrant + a heads-up for staff.
    // Deferred with `after` so a slow mail API doesn't hold up the confirmation
    // screen, and kept best-effort: the rows are already in the sheet, so a
    // send failure is logged, never surfaced as a failed registration.
    const registrantNames = [
      `${validationResult.data.firstName} ${validationResult.data.lastName}`.trim(),
      ...additionalRegistrants.map((registrant) =>
        `${registrant.firstName} ${registrant.lastName}`.trim()
      ),
    ].filter(Boolean);

    after(async () => {
      try {
        await sendRegistrationEmails({
          eventTitle,
          eventDate,
          eventSlug,
          referenceNumber,
          timestamp,
          names: registrantNames,
          proofProvided,
          email: validationResult.data.email,
          phone: validationResult.data.phone,
          cellLeader: validationResult.data.cellLeader,
          socialMedia: validationResult.data.socialMedia,
          proofUrl,
        });
      } catch (emailError) {
        console.error('Registration email dispatch failed:', emailError);
      }
    });

    return NextResponse.json({
      ...result,
      referenceNumber,
      timestamp,
      registeredCount: 1 + additionalRegistrants.length,
      // The client tailors its confirmation copy on this: without a proof the
      // slot is only reserved until one is sent.
      proofProvided,
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
