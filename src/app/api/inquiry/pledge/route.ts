import { NextResponse } from 'next/server';
import { gatewayPledgeSchema } from '@/models/schemas/contact.schema';

interface SheetResult {
  success: boolean;
  message: string;
}

async function appendToGoogleSheet(data: any): Promise<SheetResult> {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

  if (!clientEmail || !privateKey || !spreadsheetId) {
    console.log('=== New Pledge Submission ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Data:', JSON.stringify(data, null, 2));
    console.log('============================');
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

    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' });
    const row = [
      timestamp,
      data.name || '',
      data.email || '',
      data.phone || '',
      data.pledgeAmount || '',
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'PLEDGE!A:E',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    });

    return { success: true, message: 'Added to Google Sheets' };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'MODULE_NOT_FOUND') {
      console.log('googleapis not installed. Logging submission locally.');
      console.log('Submission data:', JSON.stringify(data, null, 2));
      return { success: true, message: 'Logged locally (googleapis not installed)' };
    }
    console.error('Google Sheets error:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validationResult = gatewayPledgeSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid submission data', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const result = await appendToGoogleSheet(validationResult.data);

    return NextResponse.json({
      ...result,
      message: 'Pledge received successfully!',
    });
  } catch (error) {
    console.error('Pledge submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process pledge. Please try again or contact us directly.' },
      { status: 500 }
    );
  }
}
