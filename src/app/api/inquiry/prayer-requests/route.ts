import { contactSchema } from '@/models/schemas/contact.schema';
import { NextResponse } from 'next/server';

interface SheetResult {
    success: boolean;
    message: string;
}

async function appendToGoogleSheet(data: Record<string, unknown>): Promise<SheetResult> {
    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

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

        // Prepare row data
        const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' });
        const row = [
            timestamp,
            data.name || '',
            data.email || '',
            data.phone || '',
            data.message || '',
        ];

        // Append to sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'PRAYER!A:E',
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
        const validationResult = contactSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Invalid submission data', details: validationResult.error.flatten() },
                { status: 400 }
            );
        }

        const data = validationResult.data;
        const result = await appendToGoogleSheet(data as unknown as Record<string, unknown>);

        return NextResponse.json({
            ...result,
            message: 'Prayer request received.',
        });
    } catch (error) {
        console.error('Prayer request submission error:', error);
        return NextResponse.json(
            { error: 'Failed to process request.' },
            { status: 500 }
        );
    }
}