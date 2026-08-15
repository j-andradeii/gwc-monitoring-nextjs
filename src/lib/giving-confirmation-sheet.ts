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

// Wrap in single quotes so tab names with spaces stay valid A1 notation.
export const givingSheetRangeForTab = (tab: string) => `'${tab}'!A:E`;

/**
 * Column layout — A–E.
 *   A Timestamp (Asia/Manila)   B Full Name   C Reference No.
 *   D Proof of Payment (=HYPERLINK(IMAGE()))  E Notes (blank, for staff)
 */
export interface GivingRowValues {
  timestamp: string;
  fullName: string;
  referenceNumber: string;
  /** Already-formatted cell: a proof formula, the failed-upload note, or ''. */
  proofCell: string;
}

export function buildGivingRow({
  timestamp,
  fullName,
  referenceNumber,
  proofCell,
}: GivingRowValues): string[] {
  return [
    timestamp, // A  Timestamp
    fullName, // B  Full Name
    referenceNumber, // C  Reference No.
    proofCell, // D  Proof of Payment
    '', // E  Notes — always blank, reserved for staff
  ];
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
