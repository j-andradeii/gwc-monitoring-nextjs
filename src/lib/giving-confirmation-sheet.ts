/**
 * Google Sheets plumbing for giving confirmations (Ways to Give page).
 *
 * Mirrors lib/event-registration-sheet.ts, but writes to the GIVING sheet with
 * its own five-column layout. The authenticated client itself (`getSheetsClient`)
 * and the proof-cell format are imported from that module rather than copied —
 * one service account, one cell format, one place to fix them.
 *
 * Node-only (googleapis + service-account credentials) — never import from a
 * Client Component.
 */

import { randomInt } from 'node:crypto';

export { getSheetsClient, buildProofCell, PROOF_UPLOAD_FAILED_NOTE } from './event-registration-sheet';
import type { SheetsApi } from './event-registration-sheet';
export type { SheetsApi } from './event-registration-sheet';

/**
 * The owner-supplied Sheet ID is hardcoded as a fallback so the route still
 * writes rows when GOOGLE_SPREAD_SHEET_GATEWAY_GIVING isn't set in the Vercel
 * environment; the env var wins when present.
 *
 * This is deliberate, not laziness: a missing env var previously made the
 * G12-events route degrade to a silent `success: true` with no row ever
 * written, and nobody noticed for days.
 */
export const GIVING_CONFIRMATION_SPREADSHEET_ID =
  process.env.GOOGLE_SPREAD_SHEET_GATEWAY_GIVING || '1nkKapxcYTEvxL5UnMmJGEQ3YDnl3GLBhaGJnY2Fw7mE';

/** Only one tab today; kept as a function so a future split stays a one-liner. */
export function resolveGivingSheetTab(): string {
  return 'GIVING';
}

/**
 * Wrap in single quotes so tab names with spaces stay valid A1 notation.
 * Ranges are built per call in `appendGivingRow` (it needs an explicit row
 * number), so this is only the shape the columns occupy.
 */
export const givingSheetRangeForTab = (tab: string) => `'${tab}'!A:G`;

/**
 * Column layout — A–G.
 *   A Timestamp (Asia/Manila)   B Full Name   C Reference No.
 *   D Proof of Payment (=HYPERLINK(IMAGE()))  E Notes (from the giver, optional)
 *   F Email (optional — may be blank)         G Amount (bare number)
 *
 * E used to be a permanently blank column reserved for staff; it now carries
 * the giver's own optional note. Nothing the app writes ever touches H onward,
 * so that is where a staff-only column belongs.
 *
 * Email and Amount are appended at the end rather than slotted next to the
 * name because rows already in the sheet were written under the A–E layout:
 * inserting a column mid-row would leave every historical row's staff notes
 * sitting under a new header. New rows simply start filling columns the old
 * ones leave blank.
 */
export interface GivingRowValues {
  timestamp: string;
  fullName: string;
  referenceNumber: string;
  /** Already-formatted cell: a proof formula, the failed-upload note, or ''. */
  proofCell: string;
  /** The giver's optional note — '' when they left it blank. */
  notes: string;
  /** Optional on the form — '' when the giver skipped it. */
  email: string;
  /**
   * Digits only, already stripped of "₱" and thousands separators by the
   * schema. Written bare so `valueInputOption: USER_ENTERED` lands it as a
   * NUMBER — the column has to be summable, and "₱1,500" would land as text.
   * Format the column as currency in the sheet itself, not here.
   */
  amount: string;
}

export function buildGivingRow({
  timestamp,
  fullName,
  referenceNumber,
  proofCell,
  notes,
  email,
  amount,
}: GivingRowValues): string[] {
  return [
    timestamp, // A  Timestamp
    fullName, // B  Full Name
    referenceNumber, // C  Reference No.
    proofCell, // D  Proof of Payment
    notes, // E  Notes — the giver's own, '' when not given
    email, // F  Email — optional, '' when not given
    amount, // G  Amount — bare number so the column sums
  ];
}

/**
 * Grows the tab by `extraRows` when a write would land past the last grid row.
 * Only ever called on the rare submission that runs off the end of the sheet.
 */
async function growTab(
  sheets: SheetsApi,
  spreadsheetId: string,
  tab: string,
  targetRow: number
): Promise<void> {
  const meta = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: 'sheets.properties(sheetId,title,gridProperties.rowCount)',
  });
  const properties = meta.data.sheets?.find((s) => s.properties?.title === tab)?.properties;
  const sheetId = properties?.sheetId;
  const rowCount = properties?.gridProperties?.rowCount ?? 0;

  if (sheetId === undefined || targetRow <= rowCount) return;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          appendDimension: {
            sheetId,
            dimension: 'ROWS',
            // A generous block so this costs one call every few hundred gifts.
            length: Math.max(100, targetRow - rowCount),
          },
        },
      ],
    },
  });
}

/**
 * Writes one giving row at an EXPLICIT range, so it always starts at column A.
 *
 * Why not `values.append` (what every other sheet route in this app uses):
 * append does not append to the sheet, it appends to a "logical table" it infers
 * from the range — and it writes starting at the first column of THAT TABLE,
 * not of the range. A giving row has gaps in it (E Notes is always blank, F
 * Email is blank whenever the giver skips it), so the row splits into an A–D
 * block and a lone G block. The heuristic latched onto the trailing block and
 * wrote the NEXT row starting at column G:
 *
 *     row 1   A timestamp · B name · C ref · D proof · E _ · F _ · G 22
 *     row 2   A _ ·  … · F _ · G timestamp · H name · I ref · J proof · M 213
 *
 * `insertDataOption: 'INSERT_ROWS'` was the earlier attempt at this and did not
 * prevent it — INSERT_ROWS controls whether rows are inserted or overwritten,
 * not which column the table is judged to start at.
 *
 * Computing the row and writing `A{n}:G{n}` removes the heuristic from the
 * picture entirely: the range names column A, so the row starts at column A.
 * `USER_ENTERED` is kept so Sheets still parses the timestamp into a real date
 * and the amount into a real number, exactly as before.
 *
 * Trade-off vs. append: two submissions landing in the same instant could
 * compute the same target row, and the second would overwrite the first. That
 * window is a few hundred milliseconds on a form that takes one gift at a time,
 * which is a fair price for rows that are always readable.
 */
export async function appendGivingRow(
  sheets: SheetsApi,
  spreadsheetId: string,
  tab: string,
  values: GivingRowValues
): Promise<void> {
  // A:Z, not A:G — a staff member's note out to the right still counts as a
  // used row, and writing under it beats writing over it.
  const used = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `'${tab}'!A:Z`,
  });
  // values.get drops trailing empty rows, so the length IS the last used row.
  const targetRow = (used.data.values?.length ?? 0) + 1;

  const write = () =>
    sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `'${tab}'!A${targetRow}:G${targetRow}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [buildGivingRow(values)] },
    });

  try {
    await write();
  } catch (error) {
    // Overwhelmingly the "exceeds grid limits" case: the sheet ran out of rows.
    // Grow it and retry once; any other error just surfaces from the retry.
    console.warn('[giving-confirmation] row write failed, growing the tab and retrying:', error);
    await growTab(sheets, spreadsheetId, tab, targetRow);
    await write();
  }
}

// Ambiguous characters (0/O, 1/I) are left out so a reference stays readable
// when a giver reads theirs out over the phone or copies it from a screenshot.
const REFERENCE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

/** Date parts in Asia/Manila — the timezone every other sheet value uses. */
function manilaDateParts(date: Date): { year: string; month: string; day: string } {
  const [month, day, year] = date
    .toLocaleDateString('en-US', {
      timeZone: 'Asia/Manila',
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    })
    .split('/');

  return { year, month, day };
}

/**
 * `GIVE-YYMMDD-XXXXX` — the same shape as an event registration reference
 * (`GWC-…`) with its own prefix, so staff can tell at a glance which sheet a
 * number belongs to. It is what a giver quotes when following up on a gift.
 */
export function generateGivingReference(date: Date = new Date()): string {
  const { year, month, day } = manilaDateParts(date);

  let suffix = '';
  for (let i = 0; i < 5; i += 1) {
    suffix += REFERENCE_ALPHABET[randomInt(REFERENCE_ALPHABET.length)];
  }

  return `GIVE-${year}${month}${day}-${suffix}`;
}
