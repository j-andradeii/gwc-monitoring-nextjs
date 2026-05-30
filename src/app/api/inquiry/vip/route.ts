import { NextResponse } from 'next/server';
import { vipFormSchema } from '@/models/schemas/vip.schema';

interface SheetResult {
  success: boolean;
  message: string;
}

async function appendToGoogleSheet(data: Record<string, unknown>): Promise<SheetResult> {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_VIP_ID;

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

    // Format Date
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' });

    // Format Name
    const fullName = `${data.firstName || ''} ${data.familyName || ''}`.trim();

    // Format Birthday
    let birthdayStr = '';
    if (data.birthdate) {
      const bd = new Date(data.birthdate as string | number | Date);
      birthdayStr = bd.toLocaleDateString('en-US');
    }

    // Format Socials
    let socialsStr = '';
    if (Array.isArray(data.socialMedia)) {
      socialsStr = data.socialMedia
        .filter((s: { platform?: string; handle?: string }) => s.platform && s.handle)
        .map((s: { platform?: string; handle?: string }) => `${s.platform}: ${s.handle}`)
        .join('\n');
    }

    const row = [
      timestamp,
      fullName,
      data.contactNumber || '',
      socialsStr,
      birthdayStr,
      data.whoInvitedYou || ''
    ];

    // Append to sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'VIP_LISTS!A:F',
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

    const validationResult = vipFormSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid submission data', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    // In a real app, you would save this to a database
    console.log('VIP Registration received:', validationResult.data);

    const result = await appendToGoogleSheet(validationResult.data);

    return NextResponse.json({
      ...result,
      message: 'VIP Registration received successfully'
    });
  } catch (error) {
    console.error('VIP Form submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process registration' },
      { status: 500 }
    );
  }
}
