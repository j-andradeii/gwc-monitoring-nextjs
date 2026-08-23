/**
 * Google Sheets plumbing for Life Class enrollments (GATEWAY LIFECLASS sheet).
 *
 * Mirrors lib/giving-confirmation-sheet.ts: the authenticated client and the
 * proof-cell format come from lib/event-registration-sheet rather than being
 * copied — one service account, one place to fix them. The proof cell is the
 * one thing this sheet has to wrap rather than reuse verbatim; see
 * `buildLifeclassProofCell`.
 *
 * Unlike every other sheet in this app, the LIFECLASS spreadsheet started out
 * empty, so this module also OWNS the tab: it creates ENROLLEES and writes the
 * header row on first use (see `ensureLifeclassSheet`). Nobody has to prepare
 * the spreadsheet by hand before the form goes live.
 *
 * Node-only (googleapis + service-account credentials) — never import from a
 * Client Component.
 */

export { getSheetsClient, PROOF_UPLOAD_FAILED_NOTE } from './event-registration-sheet';
import { buildProofCell } from './event-registration-sheet';
import type { SheetsApi } from './event-registration-sheet';
export type { SheetsApi } from './event-registration-sheet';

/**
 * The owner-supplied Sheet ID is hardcoded as a fallback so the route still
 * writes rows when GOOGLE_SPREAD_SHEET_LIFECLASS_ENROLLEES isn't set in the
 * Vercel environment; the env var wins when present.
 *
 * Deliberate, not laziness: a missing env var previously made the G12-events
 * route degrade to a silent `success: true` with no row ever written.
 */
export const LIFECLASS_ENROLLMENT_SPREADSHEET_ID =
  process.env.GOOGLE_SPREAD_SHEET_LIFECLASS_ENROLLEES || '1ig5U9BSj4wIaFz-aIvzHjXqFlCc6bgfNnYQtTsPr0zI';

/** Only one tab today; kept as a function so a future split stays a one-liner. */
export function resolveLifeclassSheetTab(): string {
  return 'ENROLLEES';
}

/**
 * Column layout — A–I. ALL-CAPS to match the SOD enrollees sheet, so staff
 * reading both see the same header style.
 *
 * A DATE SUBMITTED · B FIRST NAME · C LAST NAME · D EMAIL
 * E MOBILE NUMBER · F BIRTHDAY · G CELL LEADER · H CATEGORY
 * I PROOF OF PAYMENT · J AMOUNT PAID
 */
export const LIFECLASS_SHEET_HEADERS = [
  'DATE SUBMITTED',
  'FIRST NAME',
  'LAST NAME',
  'EMAIL',
  'MOBILE NUMBER',
  'BIRTHDAY',
  'CELL LEADER',
  'CATEGORY',
  'PROOF OF PAYMENT',
  'AMOUNT PAID',
] as const;

const LAST_COLUMN_LETTER = 'J';

/** Wrap in single quotes so a tab name with spaces stays valid A1 notation. */
export const lifeclassSheetRangeForTab = (tab: string) => `'${tab}'!A:${LAST_COLUMN_LETTER}`;

export interface LifeclassRowValues {
  /** Asia/Manila submission time. */
  timestamp: string;
  givenName: string;
  surname: string;
  email: string;
  /** Already formatted for the sheet — see `formatMobileCell`. */
  mobileNumber: string;
  /** Already formatted for the sheet — see `formatBirthdayCell`. */
  birthday: string;
  cellLeader: string;
  category: string;
  /** Already-formatted cell: a proof formula, the failed-upload note, or ''. */
  proofCell: string;
  /** '' when the enrollee skipped the optional amount. */
  amountSent: string;
}

export function buildLifeclassRow({
  timestamp,
  givenName,
  surname,
  email,
  mobileNumber,
  birthday,
  cellLeader,
  category,
  proofCell,
  amountSent,
}: LifeclassRowValues): string[] {
  return [
    timestamp, // A  DATE SUBMITTED
    givenName, // B  FIRST NAME
    surname, // C  LAST NAME
    email, // D  EMAIL
    mobileNumber, // E  MOBILE NUMBER
    birthday, // F  BIRTHDAY
    cellLeader, // G  CELL LEADER
    category, // H  CATEGORY
    proofCell, // I  PROOF OF PAYMENT
    amountSent, // J  AMOUNT PAID
  ];
}

/**
 * Birthdays go in as TEXT, prefixed with an apostrophe: `USER_ENTERED` would
 * otherwise coerce "12/7/2013" into a date serial that reads as a number to
 * anyone scanning the column. Formatted in Asia/Manila — the client posts a UTC
 * ISO string, so the local zone avoids an off-by-one day for PH enrollees.
 */
export function formatBirthdayCell(birthdate: Date | undefined): string {
  if (!birthdate) return '';
  return `'${birthdate.toLocaleDateString('en-US', { timeZone: 'Asia/Manila' })}`;
}

/**
 * The proof cell, with a fallback the other sheets don't need.
 *
 * `=HYPERLINK(url, IMAGE(url))` — the shared format — renders a clickable
 * thumbnail on the G12 events and giving sheets, but evaluates to `#REF!` in
 * THIS spreadsheet: IMAGE() fails here even for a proof URL that renders fine
 * in the other files, so it's a property of the document (owner / sharing /
 * Workspace image-fetch policy), not of the URL or the formula. Verified by
 * writing both into a probe cell.
 *
 * Wrapping it in IFERROR means staff always get something they can click: the
 * thumbnail if IMAGE() ever starts working here, a "View proof" link if not.
 */
export function buildLifeclassProofCell(proofUrl: string): string {
  const thumbnail = buildProofCell(proofUrl).replace(/^=/, '');
  return `=IFERROR(${thumbnail}, HYPERLINK("${proofUrl}", "View proof"))`;
}

/**
 * Mobile numbers go in as TEXT for the same reason, and a sharper one:
 * `USER_ENTERED` reads "09171234567" as a number and drops the leading zero, so
 * the column ends up full of ten-digit numbers nobody can dial. (The SOD sheet
 * shows exactly that.) The apostrophe keeps what the enrollee typed.
 */
export function formatMobileCell(mobileNumber: string): string {
  const trimmed = mobileNumber.trim();
  return trimmed ? `'${trimmed}` : '';
}

/**
 * Per-instance memo. The tab and its header row only need checking once per
 * warm lambda; it's reset whenever a write fails in a way that suggests the tab
 * went away, so a renamed or deleted tab is re-created rather than failing
 * forever on that instance.
 */
let tabVerified = false;

async function findTabId(
  sheets: SheetsApi,
  spreadsheetId: string,
  tab: string
): Promise<number | undefined> {
  const meta = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: 'sheets.properties(sheetId,title)',
  });

  return meta.data.sheets?.find((s) => s.properties?.title === tab)?.properties?.sheetId;
}

/**
 * Create the tab and its header row if they aren't there yet.
 *
 * The spreadsheet ships empty (one blank `Sheet1`), so the first enrollment has
 * to bring its own structure or it lands as thirteen unlabelled columns. Both
 * steps are guarded independently: a tab someone created by hand keeps its
 * position, and headers are only written when row 1 is genuinely blank — never
 * over a row staff have edited.
 */
export async function ensureLifeclassSheet(
  sheets: SheetsApi,
  spreadsheetId: string,
  tab: string
): Promise<void> {
  if (tabVerified) return;

  let sheetId = await findTabId(sheets, spreadsheetId, tab);

  if (sheetId === undefined) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: tab } } }],
      },
    });
    // batchUpdate's reply is untyped in our minimal SheetsApi surface; re-reading
    // the metadata is one cheap call versus widening the interface for one field.
    sheetId = await findTabId(sheets, spreadsheetId, tab);
  }

  const headerRange = `'${tab}'!A1:${LAST_COLUMN_LETTER}1`;
  const headerRow = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: headerRange,
  });

  if ((headerRow.data.values?.[0]?.length ?? 0) === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: headerRange,
      // RAW so a header is never re-interpreted as a formula or a date.
      valueInputOption: 'RAW',
      requestBody: { values: [[...LIFECLASS_SHEET_HEADERS]] },
    });

    if (sheetId !== undefined) {
      // Cosmetic but worth the one call: staff scroll this sheet for months.
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId,
                  startRowIndex: 0,
                  endRowIndex: 1,
                  startColumnIndex: 0,
                  endColumnIndex: LIFECLASS_SHEET_HEADERS.length,
                },
                cell: { userEnteredFormat: { textFormat: { bold: true } } },
                fields: 'userEnteredFormat.textFormat.bold',
              },
            },
            {
              updateSheetProperties: {
                properties: { sheetId, gridProperties: { frozenRowCount: 1 } },
                fields: 'gridProperties.frozenRowCount',
              },
            },
          ],
        },
      });
    }
  }

  tabVerified = true;
}

/**
 * Append one enrollment to the bottom of the tab.
 *
 * `values.append` is safe here (unlike on the GIVING sheet, where it shifted
 * rows sideways) precisely because `ensureLifeclassSheet` guarantees a header
 * row: the "logical table" Sheets infers is anchored at column A by the
 * headers, so a row with blank middle-name / address cells can't be mistaken
 * for a table that starts further right.
 */
export async function appendLifeclassRow(
  sheets: SheetsApi,
  spreadsheetId: string,
  tab: string,
  values: LifeclassRowValues
): Promise<void> {
  await ensureLifeclassSheet(sheets, spreadsheetId, tab);

  const write = () =>
    sheets.spreadsheets.values.append({
      spreadsheetId,
      range: lifeclassSheetRangeForTab(tab),
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [buildLifeclassRow(values)] },
    });

  try {
    await write();
  } catch (error) {
    // "Unable to parse range" is how Sheets reports a tab that isn't there —
    // someone renamed or deleted it after this instance verified it. Rebuild it
    // and retry once. Anything else is a real failure and belongs to the caller.
    if (!/unable to parse range/i.test(String((error as Error)?.message ?? ''))) throw error;

    console.warn('[lifeclass-enrollment] tab missing on write; re-creating and retrying');
    tabVerified = false;
    await ensureLifeclassSheet(sheets, spreadsheetId, tab);
    await write();
  }
}
