import { NextResponse } from 'next/server';
import { sodEnrollmentSchema } from '@/models/schemas/sod.schema';

interface SheetResult {
  success: boolean;
  message: string;
}

async function appendToGoogleSheet(data: Record<string, unknown>): Promise<SheetResult> {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_SOD_ID;

  if (!clientEmail || !privateKey || !spreadsheetId) {
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

    // Format full name
    const fullName = `${data.givenName || ''} ${data.surname || ''}`.trim();

    // Format birthdate — in Asia/Manila (same zone as the timestamp; the client
    // posts a UTC ISO string, so this avoids an off-by-one day for PH inquirers)
    // and prefix with an apostrophe so USER_ENTERED stores it as plain text
    // instead of coercing "MM/DD/YYYY" into an unreadable date serial number.
    let birthdayStr = '';
    if (data.birthdate) {
      const bd = new Date(data.birthdate as string | number | Date);
      birthdayStr = `'${bd.toLocaleDateString('en-US', { timeZone: 'Asia/Manila' })}`;
    }

    // Format status array
    const statusStr = Array.isArray(data.status)
      ? (data.status as string[]).join('\n')
      : '';

    const row = [
      timestamp,
      fullName,
      data.middleName || '',
      data.mobileNumber || '',
      birthdayStr,
      data.cellLeader || '',
      data.category || '',
      data.classToEnroll || '',
      statusStr,
    ];

    // Append to sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'SOD_LISTS!A:I',
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
    const body = await request.json();

    // Convert birthdate string to Date object before Zod validation since JSON sends it as ISO string
    if (body.birthdate && typeof body.birthdate === 'string') {
      body.birthdate = new Date(body.birthdate);
    }

    const validationResult = sodEnrollmentSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid submission data', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    console.log('SOD Enrollment received:', validationResult.data);

    const result = await appendToGoogleSheet(validationResult.data as unknown as Record<string, unknown>);

    return NextResponse.json({
      ...result,
      message: 'School of Destiny enrollment received successfully',
    });
  } catch (error) {
    console.error('SOD Enrollment submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process enrollment' },
      { status: 500 }
    );
  }
}
