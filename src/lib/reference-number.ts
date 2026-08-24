/**
 * Reference numbers for public sign-up flows.
 *
 * A reference is the only way back into a submission: it is printed on the
 * confirmation screen, emailed, and typed back in later to attach a proof of
 * payment to the rows it covers. Format is `<PREFIX>-YYMMDD-XXXXX`.
 *
 * The Life Class enrollment flow uses `LC-`; paid-event registrations use
 * `GWC-` (still generated inline in api/events/event-registration/route.ts —
 * that route predates this module and is left alone rather than refactored
 * mid-season). The prefixes differ on purpose: the two flows read different
 * spreadsheets, so a reference pasted into the wrong lookup should fail its
 * format check rather than 404 with no explanation.
 *
 * Node-only (node:crypto).
 */

import { randomInt } from 'node:crypto';

/**
 * Ambiguous characters (0/O, 1/I) are left out so references stay readable
 * when someone reads theirs out over the phone or copies it off a screenshot.
 * Mirrors REFERENCE_ALPHABET in the event-registration route.
 */
const REFERENCE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

const SUFFIX_LENGTH = 5;

/** Date parts in Asia/Manila — the timezone every sheet value uses. */
export function manilaDateParts(date: Date): { year: string; month: string; day: string } {
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
 * One reference per submission. `randomInt` (not Math.random) because a
 * guessable reference is a way to attach a payment to someone else's row.
 */
export function generateReferenceNumber(prefix: string, date: Date = new Date()): string {
  const { year, month, day } = manilaDateParts(date);

  let suffix = '';
  for (let i = 0; i < SUFFIX_LENGTH; i += 1) {
    suffix += REFERENCE_ALPHABET[randomInt(REFERENCE_ALPHABET.length)];
  }

  return `${prefix}-${year}${month}${day}-${suffix}`;
}

/** References are compared case- and whitespace-insensitively. */
export function normalizeReference(value: unknown): string {
  return String(value ?? '').trim().toUpperCase();
}

/**
 * Does this look like a reference at all? Used to decide whether a lookup
 * should treat the typed value as a reference or as an email address, so the
 * panel can accept either in one field.
 */
export function looksLikeReference(value: string, prefix: string): boolean {
  return new RegExp(`^${prefix}-\\d{6}-[A-Z0-9]{${SUFFIX_LENGTH}}$`).test(normalizeReference(value));
}
