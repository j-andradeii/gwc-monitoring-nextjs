import { NextResponse, after } from 'next/server';
import { lifeclassEnrollmentSchema } from '@/models/schemas/lifeclass.schema';
import { readProofBlob, uploadProofToBlob } from '@/lib/event-proof-upload';
import { LIFECLASS_FEE, LIFECLASS_REFERENCE_PREFIX } from '@/models/schemas/lifeclass.schema';
import { generateReferenceNumber } from '@/lib/reference-number';
import { sendLifeclassEnrollmentEmails } from '@/lib/email/lifeclass-enrollment-email';
import {
  LIFECLASS_ENROLLMENT_SPREADSHEET_ID,
  PROOF_UPLOAD_FAILED_NOTE,
  appendLifeclassRow,
  buildLifeclassProofCell,
  formatBirthdayCell,
  formatMobileCell,
  getSheetsClient,
  resolveLifeclassSheetTab,
} from '@/lib/lifeclass-enrollment-sheet';
import type { LifeclassEnrollmentData } from '@/models/schemas/lifeclass.schema';

// googleapis + sharp are Node-only.
export const runtime = 'nodejs';

/**
 * Life Class enrollment (public form at /events/lifeclass-enrollment).
 *
 * One row per enrollee on the ENROLLEES tab of the GATEWAY LIFECLASS sheet;
 * the tab and its headers are created on first use by the sheet lib.
 *
 * The proof image is POSTed THROUGH this route as multipart/form-data so it can
 * be uploaded to Vercel Blob server-side and embedded in the sheet with
 * =HYPERLINK(IMAGE(url)). Proof is OPTIONAL: an enrollee who hasn't paid yet is
 * still recorded, and so is one whose image upload fails — losing the
 * enrollment over a picture would be the worse outcome.
 *
 * Every enrollment is issued a REFERENCE NUMBER (`LC-YYMMDD-XXXXX`, column K).
 * It goes back to the browser for the confirmation screen and out by email,
 * because it is the only way back into the row: ./proof/route.ts takes it and
 * attaches a payment to the enrollment it names. See the "Already enrolled?"
 * panel on the enrollment page.
 */

interface SheetResult {
  success: boolean;
  message: string;
}

async function appendToLifeclassSheet(
  data: LifeclassEnrollmentData,
  proofUrl: string,
  proofProvided: boolean,
  referenceNumber: string,
  timestamp: string
): Promise<SheetResult> {
  const sheetTab = resolveLifeclassSheetTab();

  try {
    const sheets = getSheetsClient();

    if (!sheets) {
      // Distinctive + greppable in the Vercel logs: an unconfigured service
      // account is the one failure mode that otherwise looks like success.
      console.warn(
        '[lifeclass-enrollment] Google Sheets client unavailable — NO ROW WRITTEN. ' +
          'Check GOOGLE_SHEETS_CLIENT_EMAIL / GOOGLE_SHEETS_PRIVATE_KEY in the environment. ' +
          `Spreadsheet: ${LIFECLASS_ENROLLMENT_SPREADSHEET_ID}`
      );
      return { success: true, message: 'Logged locally (Google Sheets not configured)' };
    }

    const proofCell = proofUrl
      ? buildLifeclassProofCell(proofUrl)
      : proofProvided
        ? PROOF_UPLOAD_FAILED_NOTE
        : '';

    await appendLifeclassRow(sheets, LIFECLASS_ENROLLMENT_SPREADSHEET_ID, sheetTab, {
      timestamp,
      givenName: data.givenName,
      surname: data.surname,
      email: data.email,
      mobileNumber: formatMobileCell(data.mobileNumber ?? ''),
      birthday: formatBirthdayCell(data.birthdate),
      cellLeader: data.cellLeader,
      category: data.category,
      proofCell,
      amountSent: data.amountSent ?? '',
      referenceNumber,
    });

    return { success: true, message: `Added to Google Sheets (${sheetTab})` };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'MODULE_NOT_FOUND') {
      console.warn('[lifeclass-enrollment] googleapis not installed — NO ROW WRITTEN.');
      return { success: true, message: 'Logged locally (googleapis not installed)' };
    }
    console.error('[lifeclass-enrollment] Google Sheets error:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const birthdateRaw = formData.get('birthdate');

    const validationResult = lifeclassEnrollmentSchema.safeParse({
      surname: String(formData.get('surname') ?? ''),
      givenName: String(formData.get('givenName') ?? ''),
      email: String(formData.get('email') ?? ''),
      mobileNumber: String(formData.get('mobileNumber') ?? ''),
      birthdate: birthdateRaw ? new Date(String(birthdateRaw)) : undefined,
      cellLeader: String(formData.get('cellLeader') ?? ''),
      category: String(formData.get('category') ?? ''),
      amountSent: String(formData.get('amountSent') ?? ''),
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid submission data', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const proof = formData.get('proofOfPayment');
    const proofProvided = proof instanceof Blob && proof.size > 0;

    let proofUrl = '';
    if (proofProvided) {
      // Size check + magic-byte MIME sniffing. The multipart Content-Type is not
      // trusted: a macOS screenshot dragged from its floating thumbnail arrives
      // as application/octet-stream and a naive image/* check would 400 it.
      const proofFile = await readProofBlob(proof as Blob);
      if (!proofFile.ok) {
        return NextResponse.json({ error: proofFile.error }, { status: 400 });
      }

      // Best-effort: a failed upload leaves a follow-up note in column L rather
      // than rejecting an enrollment that is otherwise complete.
      try {
        proofUrl = await uploadProofToBlob(
          proofFile.bytes,
          proofFile.mime,
          validationResult.data.surname,
          'lifeclass-proofs'
        );
      } catch (blobError) {
        console.error('[lifeclass-enrollment] Vercel Blob upload failed:', blobError);
      }
    }

    // One reference per enrollment, generated here rather than client-side so
    // it cannot be chosen: it is what authorises a later payment upload onto
    // this row. The timestamp is shared with the sheet so the receipt, the
    // email and column A all say the same thing.
    const submittedAt = new Date();
    const timestamp = submittedAt.toLocaleString('en-US', { timeZone: 'Asia/Manila' });
    const referenceNumber = generateReferenceNumber(LIFECLASS_REFERENCE_PREFIX, submittedAt);

    const result = await appendToLifeclassSheet(
      validationResult.data,
      proofUrl,
      proofProvided,
      referenceNumber,
      timestamp
    );

    // Deferred with `after` so a slow mail API doesn't hold up the confirmation
    // screen, and best-effort: the row is already on the sheet, so a send
    // failure is logged, never surfaced as a failed enrollment.
    const enrollee = validationResult.data;
    after(async () => {
      try {
        await sendLifeclassEnrollmentEmails({
          referenceNumber,
          timestamp,
          name: `${enrollee.givenName} ${enrollee.surname}`.trim(),
          email: enrollee.email,
          mobileNumber: enrollee.mobileNumber,
          birthday: enrollee.birthdate
            ? enrollee.birthdate.toLocaleDateString('en-US', { timeZone: 'Asia/Manila' })
            : '',
          cellLeader: enrollee.cellLeader,
          category: enrollee.category,
          fee: LIFECLASS_FEE,
          proofProvided,
          amountSent: enrollee.amountSent,
          proofUrl,
        });
      } catch (emailError) {
        console.error('[lifeclass-enrollment] email dispatch failed:', emailError);
      }
    });

    return NextResponse.json({
      ...result,
      referenceNumber,
      timestamp,
      message: 'Life Class enrollment received successfully',
    });
  } catch (error) {
    console.error('[lifeclass-enrollment] submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process enrollment' },
      { status: 500 }
    );
  }
}
