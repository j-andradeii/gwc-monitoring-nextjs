/**
 * Shared Google Sheets plumbing for paid-event registrations.
 *
 * Two routes talk to the same sheet and must agree on the tab, the column
 * layout, and how a proof-of-payment cell is written:
 *   - POST /api/events/event-registration        → appends the registration rows
 *   - GET/POST /api/events/event-registration/proof → looks a reference number
 *     back up and fills in the proof column for every row it covers
 *
 * Node-only (googleapis + service-account credentials) — never import from a
 * Client Component.
 */

/**
 * The owner-supplied target Sheet ID is hardcoded as a fallback so the routes
 * still work when GOOGLE_SPREADSHEET_G12_EVENTS isn't set in the Vercel
 * environment; the env var wins when present.
 */
export const EVENT_REGISTRATION_SPREADSHEET_ID =
  process.env.GOOGLE_SPREADSHEET_G12_EVENTS || '1RZRZAV0s3X-zoq_lxfx7uLspSk7XtdrEigYmz2SZEew';

/**
 * Map event slug → Google Sheets tab name.
 * Tab names with spaces must be single-quoted in A1 notation.
 */
export function resolveSheetTab(eventSlug: string): string {
  switch (String(eventSlug ?? '').trim()) {
    case 'g12-campus-rev-cebu-2026':
      return 'CAMPUS REVOLUTION';
    default:
      return 'CAMPUS REVOLUTION';
  }
}

// Wrap in single quotes so tab names with spaces are valid A1 notation.
export const sheetRangeForTab = (tab: string) => `'${tab}'!A:M`;

/**
 * 0-based offsets into a written row (A = 0). Only the columns the code reads
 * back or rewrites are named; the rest are positional in `buildRow`.
 */
export const SHEET_COLUMN = {
  timestamp: 0, // A
  eventTitle: 1, // B
  eventDate: 2, // C
  firstName: 3, // D
  lastName: 4, // E
  referenceNumber: 10, // K
  proofOfPayment: 11, // L
} as const;

/** A1 letters for the cells a late proof of payment rewrites. */
export const TIMESTAMP_COLUMN_LETTER = 'A';
export const PROOF_COLUMN_LETTER = 'L';

/**
 * Proof cell: render the image inline AND make it clickable so staff can open
 * the full-size proof in a new tab. HYPERLINK wraps IMAGE() — the cell shows
 * the thumbnail and links to the original Blob URL for preview.
 */
export function buildProofCell(proofUrl: string): string {
  return `=HYPERLINK("${proofUrl}", IMAGE("${proofUrl}"))`;
}

/** Sentinel written when a registration came in but the Blob upload failed. */
export const PROOF_UPLOAD_FAILED_NOTE = 'Proof upload failed — please follow up';

/** References are compared case- and whitespace-insensitively. */
export function normalizeReferenceNumber(value: string): string {
  return String(value ?? '').trim().toUpperCase();
}

// Minimal surface of the googleapis Sheets client this app actually uses —
// `require('googleapis')` is untyped here, so the shape is declared explicitly
// instead of leaking `any` into the routes.
interface SheetsValuesApi {
  get(params: {
    spreadsheetId: string;
    range: string;
    valueRenderOption?: 'FORMATTED_VALUE' | 'UNFORMATTED_VALUE' | 'FORMULA';
  }): Promise<{ data: { values?: unknown[][] } }>;
  append(params: {
    spreadsheetId: string;
    range: string;
    valueInputOption: string;
    insertDataOption?: string;
    requestBody: { values: unknown[][] };
  }): Promise<unknown>;
  batchUpdate(params: {
    spreadsheetId: string;
    requestBody: {
      valueInputOption: string;
      data: Array<{ range: string; values: unknown[][] }>;
    };
  }): Promise<unknown>;
}

export interface SheetsApi {
  spreadsheets: { values: SheetsValuesApi };
}

/**
 * Build an authenticated Sheets client, or return null when the service
 * account isn't configured (local dev). Throws with `code: 'MODULE_NOT_FOUND'`
 * when googleapis isn't installed — callers treat that the same as unconfigured.
 */
export function getSheetsClient(): SheetsApi | null {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey || !EVENT_REGISTRATION_SPREADSHEET_ID) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { google } = require('googleapis');

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth }) as SheetsApi;
}

/** One sheet row that shares a reference number with the rest of its group. */
export interface RegistrationRowMatch {
  /** 1-based sheet row — the range read starts at row 1. */
  rowNumber: number;
  name: string;
  eventTitle: string;
  eventDate: string;
  timestamp: string;
  hasProof: boolean;
}

const cellText = (row: unknown[] | undefined, column: number): string =>
  String(row?.[column] ?? '').trim();

/**
 * Every registration row carrying `referenceNumber` (column K). One payment can
 * cover several people, so a match is normally a group of rows.
 *
 * Two reads, because the two things we need want opposite render options:
 *   - FORMATTED_VALUE for anything shown to a human. Timestamps and event dates
 *     are real dates in the sheet, so FORMULA/UNFORMATTED hands back serial
 *     numbers like 46231.497 instead of "7/28/2026 11:55:47".
 *   - FORMULA for the proof column only, because FORMATTED_VALUE renders the
 *     =HYPERLINK(…IMAGE(…)) cell as an empty string, which would make every
 *     already-paid row look unpaid.
 */
export async function findRegistrationsByReference(
  sheets: SheetsApi,
  tab: string,
  referenceNumber: string
): Promise<RegistrationRowMatch[]> {
  const target = normalizeReferenceNumber(referenceNumber);
  if (!target) return [];

  const [displayResponse, proofResponse] = await Promise.all([
    sheets.spreadsheets.values.get({
      spreadsheetId: EVENT_REGISTRATION_SPREADSHEET_ID,
      range: `'${tab}'!A:${PROOF_COLUMN_LETTER}`,
      valueRenderOption: 'FORMATTED_VALUE',
    }),
    sheets.spreadsheets.values.get({
      spreadsheetId: EVENT_REGISTRATION_SPREADSHEET_ID,
      range: `'${tab}'!${PROOF_COLUMN_LETTER}:${PROOF_COLUMN_LETTER}`,
      valueRenderOption: 'FORMULA',
    }),
  ]);

  const rows = displayResponse.data.values ?? [];
  // Both ranges start at row 1, so the two reads line up by index.
  const proofRows = proofResponse.data.values ?? [];
  const matches: RegistrationRowMatch[] = [];

  rows.forEach((row, index) => {
    const cellReference = normalizeReferenceNumber(cellText(row, SHEET_COLUMN.referenceNumber));

    // `includes`, not `===`: reference cells on the live sheet have been hand
    // edited before (e.g. an amount typed in front — "300GWC-260728-U8J9N"),
    // and a registrant holding the right code shouldn't be turned away over
    // someone else's typo. References are fixed-length and can't contain one
    // another, so this can't cross-match two groups.
    if (!cellReference.includes(target)) return;

    const proofCell = cellText(proofRows[index], 0);

    matches.push({
      rowNumber: index + 1,
      name: `${cellText(row, SHEET_COLUMN.firstName)} ${cellText(row, SHEET_COLUMN.lastName)}`.trim(),
      eventTitle: cellText(row, SHEET_COLUMN.eventTitle),
      eventDate: cellText(row, SHEET_COLUMN.eventDate),
      timestamp: cellText(row, SHEET_COLUMN.timestamp),
      // The failed-upload sentinel is text, not a proof — only a formula or a
      // bare URL counts as an image staff can actually open.
      hasProof: proofCell.startsWith('=') || /^https?:\/\//i.test(proofCell),
    });
  });

  return matches;
}

/**
 * Write the same proof image into column L of every row of a group — one
 * payment covers them all, so they all get the same picture — and restamp
 * column A with when the proof arrived.
 *
 * Note that this REPLACES the original registration time in column A: for a
 * pay-later registration the moment that matters to staff is when the payment
 * came in, and that is also the timestamp the registrant now sees on their
 * receipt.
 */
export async function attachProofToRows(
  sheets: SheetsApi,
  tab: string,
  rowNumbers: number[],
  proofUrl: string,
  timestamp: string
): Promise<void> {
  if (rowNumbers.length === 0) return;

  const proofCell = buildProofCell(proofUrl);

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: EVENT_REGISTRATION_SPREADSHEET_ID,
    requestBody: {
      valueInputOption: 'USER_ENTERED',
      data: rowNumbers.flatMap((rowNumber) => [
        {
          range: `'${tab}'!${TIMESTAMP_COLUMN_LETTER}${rowNumber}`,
          values: [[timestamp]],
        },
        {
          range: `'${tab}'!${PROOF_COLUMN_LETTER}${rowNumber}`,
          values: [[proofCell]],
        },
      ]),
    },
  });
}
