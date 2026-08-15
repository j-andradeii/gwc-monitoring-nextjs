import { NextResponse } from 'next/server';
import { givingConfirmationSchema } from '@/models/schemas/giving-confirmation.schema';
import { readProofBlob, uploadProofToBlob } from '@/lib/event-proof-upload';
import {
  GIVING_CONFIRMATION_SPREADSHEET_ID,
  PROOF_UPLOAD_FAILED_NOTE,
  buildGivingRow,
  buildProofCell,
  generateGivingReference,
  getSheetsClient,
  givingSheetRangeForTab,
  resolveGivingSheetTab,
} from '@/lib/giving-confirmation-sheet';

// googleapis + sharp are Node-only.
export const runtime = 'nodejs';

/**
 * Giving confirmation (Ways to Give → "Send your giving confirmation").
 *
 * The giver has already sent their gift through one of the channels on the same
 * tab; this records WHO gave and the photo of their receipt so the finance team
 * can match it. Both the name and the image are required — a row without a
 * proof would be nothing but a name.
 *
 * One row per submission, columns A–E on the GIVING tab:
 *   A Timestamp · B Full Name · C Reference No. · D Proof · E Notes (staff)
 *
 * No email is sent and no email is collected: the confirmation screen (and the
 * saveable receipt image) is the giver's copy.
 */

interface SheetResult {
  success: boolean;
  message: string;
}

interface AppendParams {
  fullName: string;
  proofUrl: string;
  proofProvided: boolean;
  /** Asia/Manila submission time — the same value the giver sees. */
  timestamp: string;
  referenceNumber: string;
}

async function appendToGivingSheet({
  fullName,
  proofUrl,
  proofProvided,
  timestamp,
  referenceNumber,
}: AppendParams): Promise<SheetResult> {
  const sheetTab = resolveGivingSheetTab();

  try {
    const sheets = getSheetsClient();

    if (!sheets) {
      // Distinctive + greppable in the Vercel logs: an unconfigured service
      // account is the one failure mode that otherwise looks like success.
      console.warn(
        '[giving-confirmation] Google Sheets client unavailable — NO ROW WRITTEN. ' +
          'Check GOOGLE_SHEETS_CLIENT_EMAIL / GOOGLE_SHEETS_PRIVATE_KEY in the environment. ' +
          `Spreadsheet: ${GIVING_CONFIRMATION_SPREADSHEET_ID}, reference: ${referenceNumber}`
      );
      return { success: true, message: 'Logged locally (Google Sheets not configured)' };
    }

    const proofCell = proofUrl
      ? buildProofCell(proofUrl)
      : proofProvided
        ? PROOF_UPLOAD_FAILED_NOTE
        : '';

    await sheets.spreadsheets.values.append({
      spreadsheetId: GIVING_CONFIRMATION_SPREADSHEET_ID,
      range: givingSheetRangeForTab(sheetTab),
      valueInputOption: 'USER_ENTERED',
      // Force every submission onto a fresh row starting at column A. Without
      // INSERT_ROWS, append's default OVERWRITE mode mis-detects the "table":
      // the isolated =HYPERLINK/=IMAGE() cell anchors the next row at that
      // column instead of A.
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [buildGivingRow({ timestamp, fullName, referenceNumber, proofCell })],
      },
    });

    return { success: true, message: `Added to Google Sheets (${sheetTab})` };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'MODULE_NOT_FOUND') {
      console.warn('[giving-confirmation] googleapis not installed — NO ROW WRITTEN.');
      return { success: true, message: 'Logged locally (googleapis not installed)' };
    }
    console.error('[giving-confirmation] Google Sheets error:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const validationResult = givingConfirmationSchema.safeParse({
      fullName: String(formData.get('fullName') ?? ''),
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Please type your full name.', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    // The photo of the receipt is the whole point of this form — a submission
    // without one is rejected rather than recorded as an unverifiable name.
    const proof = formData.get('proofOfPayment');
    const proofProvided = proof instanceof Blob && proof.size > 0;

    if (!proofProvided) {
      return NextResponse.json(
        { error: 'Please attach a photo or screenshot of your giving receipt.' },
        { status: 400 }
      );
    }

    const proofFile = await readProofBlob(proof as Blob);
    if (!proofFile.ok) {
      return NextResponse.json({ error: proofFile.error }, { status: 400 });
    }

    // Generated before the write so the giver still gets a reference number and
    // timestamp when Google Sheets isn't configured.
    const submittedAt = new Date();
    const timestamp = submittedAt.toLocaleString('en-US', { timeZone: 'Asia/Manila' });
    const referenceNumber = generateGivingReference(submittedAt);

    // Best-effort upload: if Blob storage fails the row is still written (with
    // a follow-up note in column D) rather than losing the submission.
    let proofUrl = '';
    try {
      proofUrl = await uploadProofToBlob(
        proofFile.bytes,
        proofFile.mime,
        referenceNumber,
        'giving-proofs'
      );
    } catch (blobError) {
      console.error('[giving-confirmation] Vercel Blob upload failed:', blobError);
    }

    const result = await appendToGivingSheet({
      fullName: validationResult.data.fullName,
      proofUrl,
      proofProvided,
      timestamp,
      referenceNumber,
    });

    return NextResponse.json({
      ...result,
      referenceNumber,
      timestamp,
      message: 'Giving confirmation received successfully',
    });
  } catch (error) {
    console.error('[giving-confirmation] error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process your giving confirmation' },
      { status: 500 }
    );
  }
}
