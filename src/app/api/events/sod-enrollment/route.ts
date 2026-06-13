import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { sodEnrollmentSchema, SOD_PROOF_MAX_BYTES } from '@/models/schemas/sod.schema';
import { resolveImageMime } from '@/lib/image-mime';

export const runtime = 'nodejs';

/**
 * School of Destiny enrollees spreadsheet.
 * The owner supplied the target spreadsheet; env var wins if provided.
 */
const SPREADSHEET_ID =
  process.env.GOOGLE_SPREADSHEET_ENROLLEES_ID || '1Ao-sETldYrk4LgzOGWwtn3jZzK4hnFlcqdtOm18XBOU';

/**
 * Each enrollment is routed to a tab by the class chosen on the form:
 *   "School of Destiny 1" → SOD-1 tab
 *   "School of Destiny 2" → SOD-2 tab
 * Anything unexpected falls back to ENROLLEES so a submission is never lost.
 *
 * Column order is derived from the enrollment form fields. Set these headers
 * on row 1 of each tab so the appended rows line up:
 *   A Timestamp | B Given Name | C Surname | D Middle Name | E Mobile Number |
 *   F Birthdate | G Cell Leader | H Category | I Class to Enroll | J Status |
 *   K Proof of Payment | L Payment Amount Sent
 */
function resolveSheetTab(classToEnroll: unknown): string {
  switch (String(classToEnroll ?? '').trim()) {
    case 'School of Destiny 1':
      return 'SOD-1';
    case 'School of Destiny 2':
      return 'SOD-2';
    default:
      return 'ENROLLEES';
  }
}

// Wrap in single quotes so tab names with special chars (e.g. the hyphen in
// "SOD-1") are valid A1 notation.
const sheetRangeForTab = (tab: string) => `'${tab}'!A:L`;

interface SheetResult {
  success: boolean;
  message: string;
}

/**
 * Guarantee the proof image is stored as WebP. The client already converts most
 * uploads (canvas), but that is best-effort — older browsers, decode errors, and
 * HEIC photos can slip through as the original format. This re-encodes server-side
 * with sharp so the stored Blob is always WebP for any decodable raster image.
 *
 * sharp is imported LAZILY (inside the try) on purpose: a top-level
 * `import sharp` that fails to load its native binary at runtime (a known
 * sharp + serverless fragility) would crash the whole route and turn every
 * enrollment into a 500. Loading it here means a missing/broken binary simply
 * falls back to storing the client's already-optimized image (WebP on Chrome,
 * JPEG on Safari — both render in the sheet) instead of losing the submission.
 */
async function ensureWebp(
  inputBuffer: Buffer,
  originalMime: string
): Promise<{ buffer: Buffer; mime: string; ext: string }> {
  // Already WebP (e.g. the client conversion succeeded) — no re-encode needed.
  if (originalMime === 'image/webp') {
    return { buffer: inputBuffer, mime: 'image/webp', ext: 'webp' };
  }

  try {
    const sharp = (await import('sharp')).default;
    // .rotate() with no args auto-orients from EXIF before the orientation tag is
    // dropped in the WebP output (important for phone-camera proof photos).
    const webpBuffer = await sharp(inputBuffer).rotate().webp({ quality: 90 }).toBuffer();
    return { buffer: webpBuffer, mime: 'image/webp', ext: 'webp' };
  } catch (conversionError) {
    console.error('Server-side WebP conversion failed; storing original:', conversionError);
    const ext = (originalMime.split('/')[1] || 'png').split('+')[0].replace('jpeg', 'jpg');
    return { buffer: inputBuffer, mime: originalMime, ext };
  }
}

/**
 * Upload the proof image to Vercel Blob and return its public URL (used by the
 * sheet's =IMAGE() cell). Reads `BLOB_READ_WRITE_TOKEN` from the environment —
 * auto-injected on Vercel when the Blob store is linked to the project; add it
 * to `.env.local` (e.g. via `vercel env pull`) for local development.
 */
async function uploadProofToBlob(
  inputBuffer: Buffer,
  originalMime: string,
  surname: string
): Promise<string> {
  const { buffer, mime, ext } = await ensureWebp(inputBuffer, originalMime);
  const safeBase = `${surname || 'enrollee'}`.replace(/[^a-zA-Z0-9._-]/g, '_');

  const blob = await put(`sod-proofs/${safeBase}.${ext}`, buffer, {
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
  const sheetTab = resolveSheetTab(data.classToEnroll);
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
      range: sheetRangeForTab(sheetTab),
      valueInputOption: 'USER_ENTERED',
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

    let proofUrl = '';
    if (proofProvided) {
      const proofBlob = proof as Blob;

      if (proofBlob.size > SOD_PROOF_MAX_BYTES) {
        return NextResponse.json(
          { error: 'Proof of payment must be 10 MB or smaller' },
          { status: 400 }
        );
      }

      // Recover the REAL image type from the bytes — do NOT trust the multipart
      // Content-Type. A file picked with an empty MIME (e.g. a macOS screenshot
      // dragged from its floating thumbnail) is serialized as
      // `application/octet-stream`, which a naive `startsWith('image/')` check
      // would wrongly reject with a 400 ("error in submitting"). Sniffing the
      // magic bytes accepts any genuine image regardless of how it was labelled.
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

      // Upload to Vercel Blob (best-effort — the enrollment is still recorded
      // even if the image upload fails, so no submission is lost).
      try {
        proofUrl = await uploadProofToBlob(proofBytes, realMime, validationResult.data.surname);
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
