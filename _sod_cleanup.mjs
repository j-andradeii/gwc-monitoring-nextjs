import { readFileSync, existsSync } from 'node:fs';

// --- Load env from .env.local then .env (without printing any secret) ---
function loadEnv(p) {
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let [, k, v] = m;
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (process.env[k] === undefined) process.env[k] = v;
  }
}
loadEnv('.env.local');
loadEnv('.env');

const TEST_GIVEN = 'IPhone';
const TEST_SURNAME = 'PlaywrightTest';

// --- 1) Delete the orphan proof blob(s) I created ---
try {
  const { list, del } = await import('@vercel/blob');
  const { blobs } = await list({ prefix: 'sod-proofs/PlaywrightTest', token: process.env.BLOB_READ_WRITE_TOKEN });
  if (!blobs.length) console.log('BLOB: no PlaywrightTest proof blobs found');
  for (const b of blobs) {
    await del(b.url, { token: process.env.BLOB_READ_WRITE_TOKEN });
    console.log('BLOB deleted:', b.pathname);
  }
} catch (e) {
  console.log('BLOB cleanup error:', e.message);
}

// --- 2) Delete the exact junk row from the ENROLLEES sheet ---
try {
  const { google } = await import('googleapis');
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ENROLLEES_ID || '1Ao-sETldYrk4LgzOGWwtn3jZzK4hnFlcqdtOm18XBOU';

  // Find ENROLLEES sheetId
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const tab = meta.data.sheets.find((s) => s.properties.title === 'ENROLLEES');
  if (!tab) throw new Error('ENROLLEES tab not found');
  const sheetId = tab.properties.sheetId;

  // Read column B (givenName) + C (surname) to locate the junk row precisely.
  const resp = await sheets.spreadsheets.values.get({ spreadsheetId, range: 'ENROLLEES!A:C' });
  const rows = resp.data.values || [];
  const matches = [];
  rows.forEach((r, i) => {
    if ((r[1] || '').trim() === TEST_GIVEN && (r[2] || '').trim() === TEST_SURNAME) matches.push(i); // 0-based
  });
  console.log('SHEET: matching junk rows (0-based indices):', matches.length ? matches.join(', ') : 'none');

  // Delete bottom-up so indices stay valid; only the precise matches.
  for (const idx of matches.sort((a, b) => b - a)) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{
          deleteDimension: { range: { sheetId, dimension: 'ROWS', startIndex: idx, endIndex: idx + 1 } },
        }],
      },
    });
    console.log('SHEET row deleted at index', idx, '(spreadsheet row', idx + 1, ')');
  }
  if (!matches.length) console.log('SHEET: nothing to delete');
} catch (e) {
  console.log('SHEET cleanup error:', e.message);
}

console.log('cleanup done');
