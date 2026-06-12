import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { sodEnrollmentSchema, SOD_PROOF_MAX_BYTES } from '@/models/schemas/sod.schema';

export const runtime = 'nodejs';

/**
 * School of Destiny ENROLLEES sheet.
 * The owner supplied the target spreadsheet + tab; env var wins if provided.
 */
const SPREADSHEET_ID =
  process.env.GOOGLE_SPREADSHEET_ENROLLEES_ID || '1Ao-sETldYrk4LgzOGWwtn3jZzK4hnFlcqdtOm18XBOU';
const SHEET_TAB = 'ENROLLEES';

/**
 * Column order is derived from the enrollment form fields. Set these headers
 * on the ENROLLEES tab (row 1) so the appended rows line up:
 *   A Timestamp | B Given Name | C Surname | D Middle Name | E Mobile Number |
 *   F Birthdate | G Cell Leader | H Category | I Class to Enroll | J Status |
 *   K Proof of Payment | L Payment Amount Sent
 */
const SHEET_RANGE = `${SHEET_TAB}!A:L`;

interface SheetResult {
  success: boolean;
  message: string;
}

/**
 * Upload the proof image to Vercel Blob and return its public URL (used by the
 * sheet's =IMAGE() cell). Reads `BLOB_READ_WRITE_TOKEN` from the environment —
 * auto-injected on Vercel when the Blob store is linked to the project; add it
 * to `.env.local` (e.g. via `vercel env pull`) for local development.
 */
async function uploadProofToBlob(proof: Blob, surname: string): Promise<string> {
  const mime = proof.type || 'image/png';
  const ext = (mime.split('/')[1] || 'png').split('+')[0].replace('jpeg', 'jpg');
  const safeBase = `${surname || 'enrollee'}`.replace(/[^a-zA-Z0-9._-]/g, '_');

  const blob = await put(`sod-proofs/${safeBase}.${ext}`, proof, {
    access: 'public',
    addRandomSuffix: true,
    contentType: mime,
  });

  return blob.url;
}

async function appendToGoogleSheet(
  data: Record<string, unknown>,
  proofUrl: string,
  proofProvided: boolean
): Promise<SheetResult> {
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

    // Format timestamp (Asia/Manila timezone)
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' });

    let birthdayStr = '';
    if (data.birthdate) {
      const bd = new Date(data.birthdate as string | number | Date);
      birthdayStr = bd.toLocaleDateString('en-US');
    }

    const statusStr = Array.isArray(data.status)
      ? (data.status as string[]).join('\n')
      : '';

    // Embed the uploaded proof image inline via =IMAGE() (USER_ENTERED evaluates
    // the formula). Falls back to a note if the Blob upload failed; blank if no
    // proof was provided by the enrollee (proof is optional).
    const proofCell = proofUrl
      ? `=IMAGE("${proofUrl}")`
      : (proofProvided ? 'Proof upload failed — please follow up with the enrollee' : '');

    const row = [
      timestamp,                  // A  Timestamp
      data.givenName || '',       // B  Given Name
      data.surname || '',         // C  Surname
      data.middleName || '',      // D  Middle Name
      data.mobileNumber || '',    // E  Mobile Number
      birthdayStr,                // F  Birthdate
      data.cellLeader || '',      // G  Cell Leader
      data.category || '',        // H  Category
      data.classToEnroll || '',   // I  Class to Enroll
      statusStr,                  // J  Status
      proofCell,                  // K  Proof of Payment (=IMAGE)
      data.amountSent || '',      // L  Payment Amount Sent
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: SHEET_RANGE,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    });

    return { success: true, message: 'Added to Google Sheets' };
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
    // The proof image is sent as multipart/form-data, so the file streams
    // through this route and is uploaded to Vercel Blob server-side.
    const formData = await request.formData();

    let status: string[] = [];
    try {
      status = JSON.parse(String(formData.get('status') ?? '[]'));
    } catch {
      status = [];
    }

    const birthdateRaw = formData.get('birthdate');
    const fields = {
      surname: String(formData.get('surname') ?? ''),
      givenName: String(formData.get('givenName') ?? ''),
      middleName: String(formData.get('middleName') ?? ''),
      mobileNumber: String(formData.get('mobileNumber') ?? ''),
      birthdate: birthdateRaw ? new Date(String(birthdateRaw)) : undefined,
      cellLeader: String(formData.get('cellLeader') ?? ''),
      classToEnroll: String(formData.get('classToEnroll') ?? ''),
      category: String(formData.get('category') ?? ''),
      status,
      amountSent: String(formData.get('amountSent') ?? ''),
    };

    const validationResult = sodEnrollmentSchema.safeParse(fields);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid submission data', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const proof = formData.get('proofOfPayment');
    const proofProvided = proof instanceof Blob && proof.size > 0;

    // Validate only when a proof file was actually sent.
    if (proofProvided) {
      if ((proof as Blob).size > SOD_PROOF_MAX_BYTES) {
        return NextResponse.json(
          { error: 'Proof of payment must be 10 MB or smaller' },
          { status: 400 }
        );
      }
      if (!(proof as Blob).type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Proof of payment must be an image file' },
          { status: 400 }
        );
      }
    }

    // Upload to Vercel Blob (best-effort — the enrollment is still recorded
    // even if the image upload fails, so no submission is lost).
    let proofUrl = '';
    if (proofProvided) {
      try {
        proofUrl = await uploadProofToBlob(proof as Blob, validationResult.data.surname);
      } catch (blobError) {
        console.error('Vercel Blob upload failed:', blobError);
      }
    }

    console.log('SOD Enrollee received:', validationResult.data);

    const result = await appendToGoogleSheet(
      validationResult.data as unknown as Record<string, unknown>,
      proofUrl,
      proofProvided
    );

    return NextResponse.json({
      ...result,
      message: 'School of Destiny enrollment received successfully',
    });
  } catch (error) {
    console.error('SOD Enrollee submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process enrollment' },
      { status: 500 }
    );
  }
}
