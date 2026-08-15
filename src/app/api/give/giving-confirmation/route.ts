import { NextResponse, after } from 'next/server';
import { givingConfirmationSchema } from '@/models/schemas/giving-confirmation.schema';
import { readProofBlob, uploadProofToBlob } from '@/lib/event-proof-upload';
import { sendGivingConfirmationEmails } from '@/lib/email/giving-confirmation-email';
import {
  GIVING_CONFIRMATION_SPREADSHEET_ID,
  PROOF_UPLOAD_FAILED_NOTE,
  appendGivingRow,
  buildProofCell,
  generateGivingReference,
  getSheetsClient,
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
 * One row per submission, columns A–G on the GIVING tab:
 *   A Timestamp · B Full Name · C Reference No. · D Proof · E Notes (giver)
 *   F Email (optional) · G Amount
 *
 * Two emails go out after the row is written (see lib/email/giving-confirmation-email.ts):
 * a copy of the receipt to the sower — only when they left an address, since the
 * field is optional — and a "somebody has sown" notification to
 * PASTOR_ADMIN_NOTIFY_EMAIL. Both are best-effort; the confirmation screen and
 * its saveable receipt image remain the sower's primary copy.
 */

interface SheetResult {
  success: boolean;
  message: string;
}

interface AppendParams {
  fullName: string;
  /** '' when the giver left the optional field blank. */
  email: string;
  /** Bare number string, normalised by the schema. */
  amount: string;
  /** The giver's own optional note — '' when left blank. */
  notes: string;
  proofUrl: string;
  proofProvided: boolean;
  /** Asia/Manila submission time — the same value the giver sees. */
  timestamp: string;
  referenceNumber: string;
}

async function appendToGivingSheet({
  fullName,
  email,
  amount,
  notes,
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

    // Writes an explicit A:G range on the next free row — see `appendGivingRow`
    // for why `values.append` cannot be used here (it shifted rows to column G).
    await appendGivingRow(sheets, GIVING_CONFIRMATION_SPREADSHEET_ID, sheetTab, {
      timestamp,
      fullName,
      referenceNumber,
      proofCell,
      email,
      amount,
      notes,
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
      email: String(formData.get('email') ?? ''),
      amount: String(formData.get('amount') ?? ''),
      notes: String(formData.get('notes') ?? ''),
    });

    if (!validationResult.success) {
      // Hand back the first issue's own message so the giver is told which box
      // to fix, rather than a blanket "check the form". The name's message is
      // the fallback because it's the field most likely to be missing.
      const [firstIssue] = validationResult.error.issues;

      return NextResponse.json(
        {
          error: firstIssue?.message ?? 'Please type your full name.',
          details: validationResult.error.issues,
        },
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
      email: validationResult.data.email ?? '',
      amount: validationResult.data.amount,
      notes: validationResult.data.notes ?? '',
      proofUrl,
      proofProvided,
      timestamp,
      referenceNumber,
    });

    // An emailed copy of the receipt for the sower (only when they gave an
    // address — the field is optional) plus a heads-up for staff. Deferred with
    // `after` so a slow mail API doesn't hold up the confirmation screen, and
    // best-effort: the row is already on the sheet, so a send failure is logged,
    // never surfaced as a failed submission.
    after(async () => {
      try {
        await sendGivingConfirmationEmails({
          referenceNumber,
          timestamp,
          fullName: validationResult.data.fullName,
          amount: validationResult.data.amount,
          email: validationResult.data.email,
          notes: validationResult.data.notes,
          proofUrl,
        });
      } catch (emailError) {
        console.error('[giving-confirmation] email dispatch failed:', emailError);
      }
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
