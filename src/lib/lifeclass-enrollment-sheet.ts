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
 * I PROOF OF PAYMENT · J AMOUNT PAID · K REFERENCE NO.
 *
 * K was appended rather than slotted in beside the name so the columns staff
 * already read stay where they are on a sheet that is live;
 * `ensureLifeclassSheet` widens an existing A–J header row in place.
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
  'REFERENCE NO.',
] as const;

const LAST_COLUMN_LETTER = 'K';

/**
 * 0-based offsets into a written row (A = 0), for the columns the proof route
 * reads back or rewrites. The rest stay positional in `buildLifeclassRow`.
 */
export const LIFECLASS_COLUMN = {
  timestamp: 0, // A
  givenName: 1, // B
  surname: 2, // C
  email: 3, // D
  mobileNumber: 4, // E
  cellLeader: 6, // G
  proofOfPayment: 8, // I
  amountPaid: 9, // J
  referenceNumber: 10, // K
} as const;

/** A1 letters for the cells a later proof of payment rewrites. */
export const LIFECLASS_PROOF_COLUMN_LETTER = 'I';
export const LIFECLASS_AMOUNT_COLUMN_LETTER = 'J';

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
  /** `LC-YYMMDD-XXXXX` — how the enrollee gets back to this row later. */
  referenceNumber: string;
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
  referenceNumber,
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
    referenceNumber, // K  REFERENCE NO.
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

/** 0-based column index → A1 letter. Only ever called with single-letter indexes here. */
function columnLetter(index: number): string {
  let n = index;
  let letters = '';
  do {
    letters = String.fromCharCode(65 + (n % 26)) + letters;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return letters;
}

/** Bold row 1 and freeze it. Shared by the create and the widen paths. */
async function boldFreezeHeader(
  sheets: SheetsApi,
  spreadsheetId: string,
  sheetId: number,
  columnCount: number
): Promise<void> {
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
              endColumnIndex: columnCount,
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

/**
 * Create the tab and its header row if they aren't there yet.
 *
 * The spreadsheet ships empty (one blank `Sheet1`), so the first enrollment has
 * to bring its own structure or it lands as thirteen unlabelled columns. Both
 * steps are guarded independently: a tab someone created by hand keeps its
 * position, and headers are only written when row 1 is genuinely blank — never
 * over a row staff have edited.
 *
 * A sheet created before REFERENCE NO. existed already has a populated A–J
 * header row, so the blank-row guard alone would leave column K unlabelled
 * forever. The second branch fills in only the trailing cells that are still
 * empty — it never rewrites a header staff can see.
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

  const existingHeaders = headerRow.data.values?.[0] ?? [];

  if (existingHeaders.length > 0 && existingHeaders.length < LIFECLASS_SHEET_HEADERS.length) {
    const firstMissing = existingHeaders.length;
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `'${tab}'!${columnLetter(firstMissing)}1:${LAST_COLUMN_LETTER}1`,
      valueInputOption: 'RAW',
      requestBody: { values: [LIFECLASS_SHEET_HEADERS.slice(firstMissing) as unknown as string[]] },
    });

    if (sheetId !== undefined) {
      await boldFreezeHeader(sheets, spreadsheetId, sheetId, LIFECLASS_SHEET_HEADERS.length);
    }
  }

  if (existingHeaders.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: headerRange,
      // RAW so a header is never re-interpreted as a formula or a date.
      valueInputOption: 'RAW',
      requestBody: { values: [[...LIFECLASS_SHEET_HEADERS]] },
    });

    if (sheetId !== undefined) {
      // Cosmetic but worth the one call: staff scroll this sheet for months.
      await boldFreezeHeader(sheets, spreadsheetId, sheetId, LIFECLASS_SHEET_HEADERS.length);
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

/* ============================================================================
   Looking an enrollment back up, and recording a payment against it.

   The "Already enrolled?" panel is the second half of the pay-later flow: an
   enrollee who submitted without a proof comes back with their reference
   number (or the email they enrolled with) and sends the image then.
   ========================================================================= */

/**
 * One ENROLLEES row matched by a lookup.
 *
 * `email`, `mobileNumber` and `cellLeader` are SERVER-ONLY. Anyone can try a
 * reference number against the proof route, so nothing here may be echoed back
 * to the client beyond the name — see the route's `summarize`, which picks its
 * response field by field for exactly that reason. They exist so the route can
 * email the enrollee about their own upload.
 */
export interface LifeclassRowMatch {
  /** 1-based sheet row — the range read starts at row 1. */
  rowNumber: number;
  name: string;
  referenceNumber: string;
  timestamp: string;
  hasProof: boolean;
  amountPaid: string;
  email: string;
  mobileNumber: string;
  cellLeader: string;
}

const cellText = (row: unknown[] | undefined, column: number): string =>
  String(row?.[column] ?? '').trim();

/**
 * Find the enrollment(s) a lookup value refers to.
 *
 * Two reads, because the two things we need want opposite render options:
 *   - FORMATTED_VALUE for anything shown to a human. The timestamp is a real
 *     date in the sheet, so FORMULA/UNFORMATTED hands back a serial number
 *     like 46231.497 instead of "8/24/2026 11:35:47".
 *   - FORMULA for the proof column only, because FORMATTED_VALUE renders the
 *     =IFERROR(HYPERLINK(…)) cell as an empty string, which would make every
 *     already-paid row look unpaid.
 *
 * A reference matches at most one row (one enrollee per submission, unlike the
 * G12 events sheet where a whole group shares one). An EMAIL can legitimately
 * match several — someone who enrolled twice, or a parent using their address
 * for a child — so this returns a list either way and the caller decides.
 */
export async function findLifeclassEnrollments(
  sheets: SheetsApi,
  spreadsheetId: string,
  tab: string,
  lookup: { referenceNumber?: string; email?: string }
): Promise<LifeclassRowMatch[]> {
  const targetReference = (lookup.referenceNumber ?? '').trim().toUpperCase();
  const targetEmail = (lookup.email ?? '').trim().toLowerCase();
  if (!targetReference && !targetEmail) return [];

  const [displayResponse, proofResponse] = await Promise.all([
    sheets.spreadsheets.values.get({
      spreadsheetId,
      range: lifeclassSheetRangeForTab(tab),
      valueRenderOption: 'FORMATTED_VALUE',
    }),
    sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${tab}'!${LIFECLASS_PROOF_COLUMN_LETTER}:${LIFECLASS_PROOF_COLUMN_LETTER}`,
      valueRenderOption: 'FORMULA',
    }),
  ]);

  const rows = displayResponse.data.values ?? [];
  // Both ranges start at row 1, so the two reads line up by index.
  const proofRows = proofResponse.data.values ?? [];
  const matches: LifeclassRowMatch[] = [];

  rows.forEach((row, index) => {
    // Row 1 is the header; skip it rather than matching "EMAIL" as an address.
    if (index === 0) return;

    const rowReference = cellText(row, LIFECLASS_COLUMN.referenceNumber).toUpperCase();
    const rowEmail = cellText(row, LIFECLASS_COLUMN.email).toLowerCase();

    // `includes`, not `===`: reference cells on the live G12 sheet have been
    // hand-edited before (an amount typed in front — "300GWC-260728-U8J9N"),
    // and an enrollee holding the right code shouldn't be turned away over
    // someone else's typo. References are fixed-length and can't contain one
    // another, so this can't cross-match two enrollments.
    const hit = targetReference
      ? rowReference.includes(targetReference)
      : Boolean(rowEmail) && rowEmail === targetEmail;

    if (!hit) return;

    const proofCell = cellText(proofRows[index], 0);

    matches.push({
      rowNumber: index + 1,
      name: `${cellText(row, LIFECLASS_COLUMN.givenName)} ${cellText(row, LIFECLASS_COLUMN.surname)}`.trim(),
      referenceNumber: cellText(row, LIFECLASS_COLUMN.referenceNumber),
      timestamp: cellText(row, LIFECLASS_COLUMN.timestamp),
      // The failed-upload sentinel is text, not a proof — only a formula or a
      // bare URL counts as an image staff can actually open.
      hasProof: proofCell.startsWith('=') || /^https?:\/\//i.test(proofCell),
      amountPaid: cellText(row, LIFECLASS_COLUMN.amountPaid),
      email: cellText(row, LIFECLASS_COLUMN.email),
      mobileNumber: cellText(row, LIFECLASS_COLUMN.mobileNumber),
      cellLeader: cellText(row, LIFECLASS_COLUMN.cellLeader),
    });
  });

  return matches;
}

/**
 * Point the enrollee's row at their MOST RECENT proof, and update the running
 * total in column J.
 *
 * Deliberately NOT a restamp of column A the way the G12 events sheet does it:
 * every payment is already its own row on the PAYMENTS tab with its own
 * timestamp, so column A can keep meaning "when they enrolled".
 *
 * `amountPaid` is the running total across every payment, not just this one —
 * see `sumAmounts`. Passing '' leaves the cell alone.
 */
export async function attachProofToLifeclassRow(
  sheets: SheetsApi,
  spreadsheetId: string,
  tab: string,
  rowNumber: number,
  proofUrl: string,
  amountPaid: string
): Promise<void> {
  const data: Array<{ range: string; values: unknown[][] }> = [
    {
      range: `'${tab}'!${LIFECLASS_PROOF_COLUMN_LETTER}${rowNumber}`,
      values: [[buildLifeclassProofCell(proofUrl)]],
    },
  ];

  if (amountPaid) {
    data.push({
      range: `'${tab}'!${LIFECLASS_AMOUNT_COLUMN_LETTER}${rowNumber}`,
      values: [[amountPaid]],
    });
  }

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId,
    requestBody: { valueInputOption: 'USER_ENTERED', data },
  });
}

/* ============================================================================
   PAYMENTS tab — the payment history behind "upload proof more than once".

   The ENROLLEES row holds one proof cell, so on its own a second upload could
   only overwrite the first. Every payment also lands here as its own row, which
   is what lets an enrollee pay the PHP 500 in parts (or re-send a clearer
   screenshot) without anything being lost.
   ========================================================================= */

export function resolveLifeclassPaymentsTab(): string {
  return 'PAYMENTS';
}

/**
 * A DATE PAID · B REFERENCE NO. · C NAME · D EMAIL
 * E AMOUNT · F PROOF OF PAYMENT · G PAYMENT NO.
 */
export const LIFECLASS_PAYMENT_HEADERS = [
  'DATE PAID',
  'REFERENCE NO.',
  'NAME',
  'EMAIL',
  'AMOUNT',
  'PROOF OF PAYMENT',
  'PAYMENT NO.',
] as const;

const PAYMENTS_LAST_COLUMN_LETTER = 'G';

export interface LifeclassPaymentValues {
  timestamp: string;
  referenceNumber: string;
  name: string;
  email: string;
  /** '' when the enrollee skipped the optional amount. */
  amount: string;
  proofCell: string;
  /** 1 for the first payment against this reference, 2 for the next, … */
  paymentNumber: number;
}

/** Its own memo — ENROLLEES being verified says nothing about PAYMENTS. */
let paymentsTabVerified = false;

/**
 * Create the PAYMENTS tab and its header row if they aren't there yet.
 * Same shape as `ensureLifeclassSheet`, and the same guard: headers are only
 * written when row 1 is genuinely blank.
 */
export async function ensureLifeclassPaymentsSheet(
  sheets: SheetsApi,
  spreadsheetId: string,
  tab: string
): Promise<void> {
  if (paymentsTabVerified) return;

  let sheetId = await findTabId(sheets, spreadsheetId, tab);

  if (sheetId === undefined) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests: [{ addSheet: { properties: { title: tab } } }] },
    });
    sheetId = await findTabId(sheets, spreadsheetId, tab);
  }

  const headerRange = `'${tab}'!A1:${PAYMENTS_LAST_COLUMN_LETTER}1`;
  const headerRow = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: headerRange,
  });

  if ((headerRow.data.values?.[0]?.length ?? 0) === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: headerRange,
      valueInputOption: 'RAW',
      requestBody: { values: [[...LIFECLASS_PAYMENT_HEADERS]] },
    });

    if (sheetId !== undefined) {
      await boldFreezeHeader(sheets, spreadsheetId, sheetId, LIFECLASS_PAYMENT_HEADERS.length);
    }
  }

  paymentsTabVerified = true;
}

/**
 * Every payment already logged against this reference, oldest first.
 *
 * Reads B:E in one call — the caller needs both the count (for PAYMENT NO.)
 * and the amounts (for the running total), and two reads of the same tab for
 * that would be a wasted round trip.
 */
export async function readLifeclassPayments(
  sheets: SheetsApi,
  spreadsheetId: string,
  tab: string,
  referenceNumber: string
): Promise<Array<{ amount: string }>> {
  const target = referenceNumber.trim().toUpperCase();
  if (!target) return [];

  await ensureLifeclassPaymentsSheet(sheets, spreadsheetId, tab);

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `'${tab}'!B:E`,
    valueRenderOption: 'FORMATTED_VALUE',
  });

  return (response.data.values ?? [])
    .filter((row, index) => index > 0 && String(row?.[0] ?? '').trim().toUpperCase() === target)
    .map((row) => ({ amount: String(row?.[3] ?? '').trim() }));
}

/** Append one payment. Mirrors `appendLifeclassRow`, including the retry. */
export async function appendLifeclassPaymentRow(
  sheets: SheetsApi,
  spreadsheetId: string,
  tab: string,
  values: LifeclassPaymentValues
): Promise<void> {
  await ensureLifeclassPaymentsSheet(sheets, spreadsheetId, tab);

  const write = () =>
    sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `'${tab}'!A:${PAYMENTS_LAST_COLUMN_LETTER}`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [
          [
            values.timestamp, // A  DATE PAID
            values.referenceNumber, // B  REFERENCE NO.
            values.name, // C  NAME
            values.email, // D  EMAIL
            values.amount, // E  AMOUNT
            values.proofCell, // F  PROOF OF PAYMENT
            String(values.paymentNumber), // G  PAYMENT NO.
          ],
        ],
      },
    });

  try {
    await write();
  } catch (error) {
    // "Unable to parse range" is how Sheets reports a tab that isn't there —
    // someone renamed or deleted it after this instance verified it.
    if (!/unable to parse range/i.test(String((error as Error)?.message ?? ''))) throw error;

    console.warn('[lifeclass-enrollment] PAYMENTS tab missing on write; re-creating and retrying');
    paymentsTabVerified = false;
    await ensureLifeclassPaymentsSheet(sheets, spreadsheetId, tab);
    await write();
  }
}

/**
 * Add up what an enrollee has sent so far.
 *
 * Amounts are free text ("500", "PHP 500", "250.00"), so anything without a
 * number in it is skipped rather than counted as zero. Returns '' when nothing
 * parseable was ever entered, which leaves column J untouched.
 */
export function sumAmounts(amounts: string[]): string {
  const numbers = amounts
    .map((amount) => Number(String(amount).replace(/[^0-9.]/g, '')))
    .filter((value) => Number.isFinite(value) && value > 0);

  if (numbers.length === 0) return '';

  const total = numbers.reduce((carry, value) => carry + value, 0);
  // Keep it an integer when it is one — "500" reads better than "500.00".
  return Number.isInteger(total) ? String(total) : total.toFixed(2);
}
