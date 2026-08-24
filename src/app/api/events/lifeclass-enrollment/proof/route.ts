import { NextResponse, after } from 'next/server';
import { readProofBlob, uploadProofToBlob } from '@/lib/event-proof-upload';
import { sendLifeclassProofEmails } from '@/lib/email/lifeclass-enrollment-email';
import {
  LIFECLASS_ENROLLMENT_SPREADSHEET_ID,
  appendLifeclassPaymentRow,
  attachProofToLifeclassRow,
  buildLifeclassProofCell,
  findLifeclassEnrollments,
  getSheetsClient,
  readLifeclassPayments,
  resolveLifeclassPaymentsTab,
  resolveLifeclassSheetTab,
  sumAmounts,
  type LifeclassRowMatch,
  type SheetsApi,
} from '@/lib/lifeclass-enrollment-sheet';
import { LIFECLASS_REFERENCE_PATTERN } from '@/models/schemas/lifeclass.schema';

export const runtime = 'nodejs';

/**
 * "Already enrolled?" — proof of payment sent after the fact.
 *
 * Enrollment itself does not require a proof (see ../route.ts), so an enrollee
 * can reserve their slot, pay later, then come back with the reference number
 * from their confirmation screen or email:
 *
 *   GET  ?lookup=…   → the enrollment that reference (or email) names
 *   POST (multipart: lookup, proofOfPayment, amountSent)
 *                    → appends a row to the PAYMENTS tab and points the
 *                      enrollee's ENROLLEES row at the new image
 *
 * Only the name and payment status are returned — never the contact details
 * stored alongside them — so a guessed reference can't be turned into a source
 * of emails or phone numbers. See `summarize`, which picks its response field
 * by field for exactly that reason.
 *
 * UPLOADING MORE THAN ONCE IS THE POINT. Unlike the G12 events flow, which
 * overwrites the single proof cell, every upload here appends its own PAYMENTS
 * row, so an enrollee can settle the fee in parts (or re-send a clearer
 * screenshot) and staff keep the whole history. Column J of ENROLLEES carries
 * the running total, column I links to the most recent image.
 */

/** Anything shorter can only be a typo; keeps junk away from a full sheet read. */
const MIN_LOOKUP_LENGTH = 5;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ResolvedEnrollment {
  sheets: SheetsApi;
  tab: string;
  paymentsTab: string;
  match: LifeclassRowMatch;
  /** More than one row shares the looked-up email. */
  ambiguous: boolean;
}

/**
 * Shared GET/POST preamble: work out what was typed, get a Sheets client, and
 * find the row. Returns a ready-to-send NextResponse on any failure so both
 * handlers answer identically.
 *
 * One field accepts either a reference number or the email someone enrolled
 * with. Enrollments made before reference numbers existed have an empty column
 * K, so email is the only way in for them — asking people which kind of thing
 * they are holding would be a worse form than working it out here.
 */
async function resolveEnrollment(
  rawLookup: string
): Promise<ResolvedEnrollment | { error: NextResponse }> {
  const lookup = String(rawLookup ?? '').trim();

  if (lookup.length < MIN_LOOKUP_LENGTH) {
    return {
      error: NextResponse.json(
        { error: 'Enter your reference number, or the email address you enrolled with.' },
        { status: 400 }
      ),
    };
  }

  const isEmail = EMAIL_PATTERN.test(lookup);

  // A reference is only treated as one when it matches the issued format;
  // anything else that isn't an email is rejected before a sheet read, so a
  // stray word can't cost a full-column fetch.
  if (!isEmail && !LIFECLASS_REFERENCE_PATTERN.test(lookup.toUpperCase())) {
    return {
      error: NextResponse.json(
        {
          error:
            'That doesn’t look like a reference number (LC-000000-XXXXX). Check your confirmation email, or enter the email address you enrolled with.',
        },
        { status: 400 }
      ),
    };
  }

  let sheets: SheetsApi | null;
  try {
    sheets = getSheetsClient();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'MODULE_NOT_FOUND') {
      sheets = null;
    } else {
      throw error;
    }
  }

  if (!sheets) {
    return {
      error: NextResponse.json(
        {
          error:
            'We can’t look up enrollments right now. Please message us and we’ll sort it out.',
        },
        { status: 503 }
      ),
    };
  }

  const tab = resolveLifeclassSheetTab();
  const matches = await findLifeclassEnrollments(
    sheets,
    LIFECLASS_ENROLLMENT_SPREADSHEET_ID,
    tab,
    isEmail ? { email: lookup } : { referenceNumber: lookup.toUpperCase() }
  );

  if (matches.length === 0) {
    return {
      error: NextResponse.json(
        {
          error: isEmail
            ? 'We couldn’t find an enrollment for that email address. Check the spelling, or try your reference number.'
            : 'We couldn’t find that reference number. Please check it against your confirmation email and try again.',
        },
        { status: 404 }
      ),
    };
  }

  // An email can match more than one enrollment (someone who enrolled twice, a
  // parent using their address for a child). Take the most recent — the last
  // row written — and tell the client, which asks for the reference number
  // instead of guessing on their behalf.
  const match = matches[matches.length - 1];

  return {
    sheets,
    tab,
    paymentsTab: resolveLifeclassPaymentsTab(),
    match,
    ambiguous: matches.length > 1,
  };
}

/**
 * Everything the panel is allowed to see about an enrollment.
 *
 * Field by field ON PURPOSE: spreading the match would leak the email, mobile
 * number and cell leader to anyone who can guess a reference.
 */
function summarize(match: LifeclassRowMatch, paymentCount: number, ambiguous: boolean) {
  return {
    referenceNumber: match.referenceNumber,
    name: match.name,
    enrolledAt: match.timestamp,
    hasProof: match.hasProof,
    amountPaid: match.amountPaid,
    paymentCount,
    ambiguous,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const resolved = await resolveEnrollment(searchParams.get('lookup') ?? '');

    if ('error' in resolved) return resolved.error;

    const payments = resolved.match.referenceNumber
      ? await readLifeclassPayments(
          resolved.sheets,
          LIFECLASS_ENROLLMENT_SPREADSHEET_ID,
          resolved.paymentsTab,
          resolved.match.referenceNumber
        )
      : [];

    return NextResponse.json({
      success: true,
      ...summarize(resolved.match, payments.length, resolved.ambiguous),
    });
  } catch (error) {
    console.error('[lifeclass-enrollment] lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to look that up. Please try again.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const proof = formData.get('proofOfPayment');
    if (!(proof instanceof Blob) || proof.size === 0) {
      return NextResponse.json({ error: 'Proof of payment is required' }, { status: 400 });
    }

    // Locate the row BEFORE uploading so a bad reference doesn't leave an
    // orphaned image sitting in Blob storage.
    const resolved = await resolveEnrollment(String(formData.get('lookup') ?? ''));
    if ('error' in resolved) return resolved.error;

    const { match, sheets, tab, paymentsTab } = resolved;

    // An enrollment predating reference numbers has an empty column K. It can
    // still be found by email, but there is nothing to key a PAYMENTS row to,
    // so the proof goes on the ENROLLEES row alone and the history starts from
    // whatever reference gets issued next.
    const referenceNumber = match.referenceNumber;

    const proofFile = await readProofBlob(proof);
    if (!proofFile.ok) {
      return NextResponse.json({ error: proofFile.error }, { status: 400 });
    }

    let proofUrl: string;
    try {
      proofUrl = await uploadProofToBlob(
        proofFile.bytes,
        proofFile.mime,
        referenceNumber || match.name || 'lifeclass',
        'lifeclass-proofs'
      );
    } catch (blobError) {
      console.error('[lifeclass-enrollment] Vercel Blob upload failed:', blobError);
      return NextResponse.json(
        { error: 'We couldn’t save that image. Please try again in a moment.' },
        { status: 502 }
      );
    }

    const amount = String(formData.get('amountSent') ?? '').trim();
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' });

    // Read the history BEFORE appending so the new row gets the right number
    // and the total includes it exactly once.
    const previousPayments = referenceNumber
      ? await readLifeclassPayments(
          sheets,
          LIFECLASS_ENROLLMENT_SPREADSHEET_ID,
          paymentsTab,
          referenceNumber
        )
      : [];

    const paymentNumber = previousPayments.length + 1;
    const totalPaid = sumAmounts([...previousPayments.map((payment) => payment.amount), amount]);

    if (referenceNumber) {
      await appendLifeclassPaymentRow(sheets, LIFECLASS_ENROLLMENT_SPREADSHEET_ID, paymentsTab, {
        timestamp,
        referenceNumber,
        name: match.name,
        email: match.email,
        amount,
        proofCell: buildLifeclassProofCell(proofUrl),
        paymentNumber,
      });
    }

    await attachProofToLifeclassRow(
      sheets,
      LIFECLASS_ENROLLMENT_SPREADSHEET_ID,
      tab,
      match.rowNumber,
      proofUrl,
      totalPaid
    );

    // Receipt for the enrollee + a heads-up for staff. Deferred with `after` so
    // a slow mail API doesn't hold up the confirmation screen, and best-effort:
    // the sheet is already updated, so a send failure is logged, never
    // surfaced as a failed upload.
    after(async () => {
      try {
        await sendLifeclassProofEmails({
          referenceNumber,
          timestamp,
          name: match.name,
          email: match.email,
          mobileNumber: match.mobileNumber,
          cellLeader: match.cellLeader,
          proofUrl,
          amount,
          totalPaid,
          paymentNumber,
        });
      } catch (emailError) {
        console.error('[lifeclass-enrollment] proof email dispatch failed:', emailError);
      }
    });

    return NextResponse.json({
      success: true,
      ...summarize({ ...match, hasProof: true, amountPaid: totalPaid }, paymentNumber, false),
      timestamp,
      paymentNumber,
      totalPaid,
      message: 'Proof of payment received',
    });
  } catch (error) {
    console.error('[lifeclass-enrollment] proof upload error:', error);
    return NextResponse.json(
      { error: 'Failed to record that proof of payment. Please try again.' },
      { status: 500 }
    );
  }
}
