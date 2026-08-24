/**
 * Life Class transactional email.
 *
 * Two moments, four messages:
 *   - enrollment received  → enrollee gets their reference number, staff get a
 *     heads-up (`sendLifeclassEnrollmentEmails`)
 *   - proof of payment in  → enrollee gets a receipt for that payment, staff
 *     get the image (`sendLifeclassProofEmails`)
 *
 * The enrollee copy exists mainly to carry the REFERENCE NUMBER out of the
 * browser. It is the only way back into the enrollment — the "Already
 * enrolled?" panel on the enrollment page takes it — and a confirmation screen
 * someone closes is not somewhere a number survives.
 *
 * Built from the same pieces as the G12 event emails (./components.ts) so the
 * two read as one family. Nothing here throws: by the time it runs the row is
 * already on the sheet, so a bounced address must never surface as a failed
 * enrollment (see ./send.ts).
 *
 * Node-only — never import from a Client Component.
 */

import { siteMetadata } from '@/data/site-metadata';
import {
  GOLD_DARK,
  MONO,
  MUTED,
  NAVY,
  SANS,
  button,
  callout,
  detailRows,
  escapeHtml,
  footer,
  header,
  receiptImage,
  referenceCard,
  shell,
} from './components';
import { dispatchEmails, isEmailAddress, type OutgoingMessage } from './send';

/** Where the "Already enrolled?" panel lives. */
const ENROLLMENT_PATH = '/events/lifeclass-enrollment';

/**
 * Deep link back to the panel with the reference already filled in, mirroring
 * `eventUrl`'s `?ref=` contract: the client reads the param on arrival, opens
 * the panel and seeds the field, so the button in the email is the whole
 * journey rather than an instruction to go and find something.
 */
function enrollmentUrl(reference?: string): string {
  const base = siteMetadata.siteUrl.replace(/\/$/, '');
  const query = reference ? `?ref=${encodeURIComponent(reference)}` : '';
  return `${base}${ENROLLMENT_PATH}${query}${reference ? '#lifeclass-complete' : ''}`;
}

export interface LifeclassEnrollmentEmailData {
  referenceNumber: string;
  timestamp: string;
  name: string;
  email: string;
  mobileNumber?: string;
  birthday?: string;
  cellLeader?: string;
  category?: string;
  /** Rendered as-is, e.g. `PHP 500`. */
  fee: string;
  /** True when the enrollment form already carried a proof image. */
  proofProvided: boolean;
  amountSent?: string;
  proofUrl?: string;
}

export interface LifeclassProofEmailData {
  referenceNumber: string;
  /** When THIS payment landed, not when they enrolled. */
  timestamp: string;
  name: string;
  email: string;
  mobileNumber?: string;
  cellLeader?: string;
  proofUrl: string;
  /** Amount on this upload, as typed. */
  amount?: string;
  /** Running total across every payment logged so far. */
  totalPaid?: string;
  /** 1 for the first payment against this reference, 2 for the next, … */
  paymentNumber: number;
}

const plainLines = (lines: Array<string | false | undefined>): string =>
  lines.filter(Boolean).join('\n');

/* ── Enrollment received ─────────────────────────────────────────────── */

export function buildEnrollmentEnrolleeEmail(data: LifeclassEnrollmentEmailData) {
  const paid = data.proofProvided;

  const body =
    header(
      'You’re enrolled in Life Class',
      `Welcome, <strong style="color:${NAVY};">${escapeHtml(data.name)}</strong> — here is everything you need to keep.`
    ) +
    referenceCard(data.referenceNumber, data.timestamp, 'Enrolled') +
    callout(
      paid ? 'booked' : 'pending',
      paid
        ? `We have your proof of payment. Your slot is confirmed once we verify it — nothing else to do.`
        : `Your slot is reserved. The <strong>${escapeHtml(data.fee)}</strong> fee is still outstanding — send it whenever you are ready and upload your proof with the button below.`
    ) +
    (paid ? '' : button(enrollmentUrl(data.referenceNumber), 'Upload proof of payment')) +
    (data.proofUrl ? receiptImage(data.proofUrl, 'Proof of payment') : '') +
    footer(
      `Keep this reference number — <span style="font-family:${MONO};color:${NAVY};">${escapeHtml(
        data.referenceNumber
      )}</span> — it is how you send your proof of payment later, and you can send it more than once if you pay in parts.`
    );

  return {
    subject: `You’re enrolled in Life Class · ${data.referenceNumber}`,
    html: shell(
      'Life Class enrollment',
      paid
        ? 'Your enrollment and payment are in.'
        : 'Your slot is reserved — here is your reference number.',
      body
    ),
    text: plainLines([
      `You're enrolled in Life Class, ${data.name}.`,
      '',
      `Reference No.: ${data.referenceNumber}`,
      data.timestamp && `Enrolled: ${data.timestamp}`,
      '',
      paid
        ? 'We have your proof of payment. Your slot is confirmed once we verify it.'
        : `Your slot is reserved. The ${data.fee} fee is still outstanding — upload your proof of payment here:`,
      paid ? '' : enrollmentUrl(data.referenceNumber),
      '',
      'Keep your reference number: it is how you send your proof of payment later,',
      'and you can send it more than once if you pay in parts.',
      '',
      'Gateway Church · Cebu',
    ]),
  };
}

export function buildEnrollmentAdminEmail(data: LifeclassEnrollmentEmailData) {
  const body =
    header(
      'New Life Class enrollment',
      `<strong style="color:${NAVY};">${escapeHtml(data.name)}</strong> just enrolled.`
    ) +
    referenceCard(data.referenceNumber, data.timestamp, 'Enrolled') +
    detailRows([
      ['Name', data.name],
      ['Email', data.email],
      ['Mobile', data.mobileNumber ?? ''],
      ['Birthday', data.birthday ?? ''],
      ['Cell leader', data.cellLeader ?? ''],
      ['Category', data.category ?? ''],
      ['Amount sent', data.amountSent ?? ''],
      ['Proof of payment', data.proofProvided ? 'Attached' : 'Not yet sent'],
    ]) +
    (data.proofUrl ? receiptImage(data.proofUrl, 'Proof of payment') : '') +
    footer('Sent automatically by the Life Class enrollment form.');

  return {
    subject: `Life Class enrollment · ${data.name} · ${data.referenceNumber}`,
    html: shell('New Life Class enrollment', `${data.name} enrolled in Life Class.`, body),
    text: plainLines([
      `New Life Class enrollment: ${data.name}`,
      `Reference No.: ${data.referenceNumber}`,
      data.timestamp && `Enrolled: ${data.timestamp}`,
      `Email: ${data.email}`,
      data.mobileNumber && `Mobile: ${data.mobileNumber}`,
      data.cellLeader && `Cell leader: ${data.cellLeader}`,
      data.category && `Category: ${data.category}`,
      data.amountSent && `Amount sent: ${data.amountSent}`,
      `Proof of payment: ${data.proofProvided ? 'Attached' : 'Not yet sent'}`,
      data.proofUrl || '',
    ]),
  };
}

/* ── Proof of payment received ───────────────────────────────────────── */

/** "Payment 2" only once there has been more than one — the first is just "payment". */
const paymentOrdinal = (n: number): string => (n > 1 ? ` (payment ${n})` : '');

export function buildLifeclassProofEnrolleeEmail(data: LifeclassProofEmailData) {
  const body =
    header(
      'Proof of payment received',
      `Thanks, <strong style="color:${NAVY};">${escapeHtml(data.name)}</strong> — we have it.`
    ) +
    referenceCard(data.referenceNumber, data.timestamp, 'Received') +
    callout(
      'booked',
      `Your payment is logged against your enrollment${escapeHtml(
        paymentOrdinal(data.paymentNumber)
      )}. Your slot is confirmed once we verify it.${
        data.totalPaid
          ? ` <span style="color:${MUTED};">Recorded so far: <strong style="color:${NAVY};">${escapeHtml(
              data.totalPaid
            )}</strong>.</span>`
          : ''
      }`
    ) +
    receiptImage(data.proofUrl, 'Proof of payment') +
    footer(
      `Paying in parts? Send the next one the same way — your reference number <span style="font-family:${MONO};color:${NAVY};">${escapeHtml(
        data.referenceNumber
      )}</span> keeps working, and every upload is kept.`
    );

  return {
    subject: `Proof of payment received · ${data.referenceNumber}`,
    html: shell('Proof of payment received', 'We have your Life Class payment.', body),
    text: plainLines([
      `Thanks ${data.name} — we have your proof of payment.`,
      '',
      `Reference No.: ${data.referenceNumber}`,
      data.timestamp && `Received: ${data.timestamp}`,
      data.amount && `Amount: ${data.amount}`,
      data.totalPaid && `Recorded so far: ${data.totalPaid}`,
      '',
      'Your slot is confirmed once we verify it.',
      'Paying in parts? Send the next one the same way — your reference number keeps working.',
      '',
      'Gateway Church · Cebu',
    ]),
  };
}

export function buildLifeclassProofAdminEmail(data: LifeclassProofEmailData) {
  const body =
    header(
      'Life Class payment received',
      `<strong style="color:${NAVY};">${escapeHtml(data.name)}</strong> sent a proof of payment${escapeHtml(
        paymentOrdinal(data.paymentNumber)
      )}.`
    ) +
    referenceCard(data.referenceNumber, data.timestamp, 'Received') +
    detailRows([
      ['Name', data.name],
      ['Email', data.email],
      ['Mobile', data.mobileNumber ?? ''],
      ['Cell leader', data.cellLeader ?? ''],
      ['Amount', data.amount ?? ''],
      ['Recorded so far', data.totalPaid ?? ''],
      ['Payment no.', String(data.paymentNumber)],
    ]) +
    receiptImage(data.proofUrl, 'Proof of payment') +
    footer(
      `Logged on the PAYMENTS tab of the Life Class sheet. <span style="color:${GOLD_DARK};font-family:${SANS};">Row per payment</span> — the ENROLLEES row links to the most recent one.`
    );

  return {
    subject: `Life Class payment · ${data.name} · ${data.referenceNumber}`,
    html: shell('Life Class payment received', `${data.name} sent a proof of payment.`, body),
    text: plainLines([
      `Life Class payment received: ${data.name}`,
      `Reference No.: ${data.referenceNumber}`,
      data.timestamp && `Received: ${data.timestamp}`,
      `Email: ${data.email}`,
      data.mobileNumber && `Mobile: ${data.mobileNumber}`,
      data.cellLeader && `Cell leader: ${data.cellLeader}`,
      data.amount && `Amount: ${data.amount}`,
      data.totalPaid && `Recorded so far: ${data.totalPaid}`,
      `Payment no.: ${data.paymentNumber}`,
      data.proofUrl,
    ]),
  };
}

/* ── Dispatch ────────────────────────────────────────────────────────── */

function adminMessage(
  payload: { subject: string; html: string; text: string },
  replyTo: string
): OutgoingMessage | null {
  const adminAddress = process.env.ADMIN_NOTIFY_EMAIL?.trim();
  if (!isEmailAddress(adminAddress)) return null;

  return {
    audience: 'admin',
    to: adminAddress,
    // Staff replying to the notification should land in the enrollee's inbox,
    // not the app's no-reply sender.
    replyTo,
    payload,
  };
}

export async function sendLifeclassEnrollmentEmails(
  data: LifeclassEnrollmentEmailData
): Promise<void> {
  const messages: OutgoingMessage[] = [];

  if (isEmailAddress(data.email)) {
    messages.push({
      audience: 'enrollee',
      to: data.email.trim(),
      payload: buildEnrollmentEnrolleeEmail(data),
    });
  }

  const admin = adminMessage(buildEnrollmentAdminEmail(data), data.email);
  if (admin) messages.push(admin);

  await dispatchEmails('Life Class enrollment', data.referenceNumber, messages);
}

export async function sendLifeclassProofEmails(data: LifeclassProofEmailData): Promise<void> {
  const messages: OutgoingMessage[] = [];

  if (isEmailAddress(data.email)) {
    messages.push({
      audience: 'enrollee',
      to: data.email.trim(),
      payload: buildLifeclassProofEnrolleeEmail(data),
    });
  }

  const admin = adminMessage(buildLifeclassProofAdminEmail(data), data.email);
  if (admin) messages.push(admin);

  await dispatchEmails('Life Class payment', data.referenceNumber, messages);
}
