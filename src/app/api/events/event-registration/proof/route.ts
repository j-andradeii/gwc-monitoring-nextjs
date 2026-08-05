import { NextResponse, after } from 'next/server';
import { readProofBlob, uploadProofToBlob } from '@/lib/event-proof-upload';
import {
  primaryRegistrantEmail,
  sendProofOfPaymentEmails,
} from '@/lib/email/event-proof-email';
import {
  attachProofToRows,
  findRegistrationsByReference,
  getSheetsClient,
  normalizeReferenceNumber,
  resolveSheetTab,
  type RegistrationRowMatch,
  type SheetsApi,
} from '@/lib/event-registration-sheet';

export const runtime = 'nodejs';

/**
 * "Complete your registration" — proof of payment sent after the fact.
 *
 * Registration itself no longer requires a proof (see ../route.ts), so a
 * registrant can reserve their slot, pay later, then come back with the
 * reference number printed on their receipt:
 *
 *   GET  ?referenceNumber=…&eventSlug=…  → the names that reference covers
 *   POST (multipart: referenceNumber, eventSlug, proofOfPayment)
 *                                        → writes the proof into column L of
 *                                          every row sharing that reference
 *
 * Only names are returned — never the contact details stored alongside them —
 * so a guessed reference can't be turned into a source of emails or phone
 * numbers. Rows are located by column K, which the registration route writes.
 *
 * A successful POST also emails the registrant and staff (lib/email/
 * event-proof-email.ts). The registrant's address comes off the sheet and is
 * only ever used as a recipient — it is never echoed back in the response, so
 * this stays true of the POST as well as the GET.
 */

/** References look like GWC-260730-AB7KX; be lenient but reject obvious noise. */
const MIN_REFERENCE_LENGTH = 5;

interface ResolvedRows {
  sheets: SheetsApi;
  tab: string;
  referenceNumber: string;
  matches: RegistrationRowMatch[];
}

/**
 * Shared GET/POST preamble: validate the reference, get a Sheets client, and
 * find the rows. Returns a ready-to-send NextResponse on any failure so both
 * handlers answer identically.
 */
async function resolveRows(
  rawReference: string,
  eventSlug: string
): Promise<ResolvedRows | { error: NextResponse }> {
  const referenceNumber = normalizeReferenceNumber(rawReference);

  if (referenceNumber.length < MIN_REFERENCE_LENGTH) {
    return {
      error: NextResponse.json(
        { error: 'Enter the reference number from your registration receipt.' },
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
            'We can’t look up reference numbers right now. Please message us and we’ll sort it out.',
        },
        { status: 503 }
      ),
    };
  }

  const tab = resolveSheetTab(eventSlug);
  const matches = await findRegistrationsByReference(sheets, tab, referenceNumber);

  if (matches.length === 0) {
    return {
      error: NextResponse.json(
        {
          error:
            'We couldn’t find that reference number. Please check it against your receipt and try again.',
        },
        { status: 404 }
      ),
    };
  }

  return { sheets, tab, referenceNumber, matches };
}

/** Everything the dialog shows about a reference number. */
function summarize(referenceNumber: string, matches: RegistrationRowMatch[]) {
  return {
    referenceNumber,
    // Every row of a group carries the same event and timestamp; read the first.
    eventTitle: matches[0].eventTitle,
    eventDate: matches[0].eventDate,
    submittedAt: matches[0].timestamp,
    registrants: matches.map((match) => match.name).filter(Boolean),
    hasProof: matches.every((match) => match.hasProof),
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const resolved = await resolveRows(
      searchParams.get('referenceNumber') ?? '',
      searchParams.get('eventSlug') ?? ''
    );

    if ('error' in resolved) return resolved.error;

    return NextResponse.json({
      success: true,
      ...summarize(resolved.referenceNumber, resolved.matches),
    });
  } catch (error) {
    console.error('Registration lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to look up that reference number. Please try again.' },
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

    const eventSlug = String(formData.get('eventSlug') ?? '');

    // Locate the rows BEFORE uploading so a bad reference doesn't leave an
    // orphaned image sitting in Blob storage.
    const resolved = await resolveRows(String(formData.get('referenceNumber') ?? ''), eventSlug);

    if ('error' in resolved) return resolved.error;

    const proofFile = await readProofBlob(proof);
    if (!proofFile.ok) {
      return NextResponse.json({ error: proofFile.error }, { status: 400 });
    }

    let proofUrl: string;
    try {
      proofUrl = await uploadProofToBlob(
        proofFile.bytes,
        proofFile.mime,
        resolved.referenceNumber
      );
    } catch (blobError) {
      console.error('Vercel Blob upload failed:', blobError);
      return NextResponse.json(
        { error: 'We couldn’t save that image. Please try again in a moment.' },
        { status: 502 }
      );
    }

    // Column A is restamped with the moment the payment landed — for a
    // pay-later registration that is the date staff care about, and it's what
    // the registrant's receipt now shows.
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' });

    // Re-uploading replaces whatever was there: a registrant who sent the wrong
    // screenshot needs a way to correct it, and the whole group shares the cell.
    await attachProofToRows(
      resolved.sheets,
      resolved.tab,
      resolved.matches.map((match) => match.rowNumber),
      proofUrl,
      timestamp
    );

    // Receipt for the registrant + a heads-up for staff, mirroring what a
    // registration that arrived with its proof already attached sends (see
    // ../route.ts). Deferred with `after` so a slow mail API doesn't hold up
    // the confirmation screen, and best-effort: the sheet is already updated,
    // so a send failure is logged, never surfaced as a failed upload.
    //
    // `matches` was read before the write, so `hasProof` still describes what
    // was on file BEFORE this upload — that is what tells us it replaced one.
    const primary = resolved.matches[0];
    const replacedExisting = resolved.matches.some((match) => match.hasProof);

    after(async () => {
      try {
        await sendProofOfPaymentEmails({
          eventTitle: primary.eventTitle,
          eventDate: primary.eventDate,
          eventSlug,
          referenceNumber: resolved.referenceNumber,
          timestamp,
          names: resolved.matches.map((match) => match.name).filter(Boolean),
          // One recipient, whatever the reference covers: the person who paid.
          email: primaryRegistrantEmail(resolved.matches),
          phone: primary.phone,
          cellLeader: primary.cellLeader,
          socialMedia: primary.socialMedia,
          proofUrl,
          replacedExisting,
        });
      } catch (emailError) {
        console.error('Proof of payment email dispatch failed:', emailError);
      }
    });

    return NextResponse.json({
      success: true,
      ...summarize(resolved.referenceNumber, resolved.matches),
      hasProof: true,
      // The updated column A, not the original registration time.
      submittedAt: timestamp,
      timestamp,
      updatedCount: resolved.matches.length,
      message: 'Proof of payment received',
    });
  } catch (error) {
    console.error('Registration proof upload error:', error);
    return NextResponse.json(
      { error: 'Failed to record that proof of payment. Please try again.' },
      { status: 500 }
    );
  }
}
