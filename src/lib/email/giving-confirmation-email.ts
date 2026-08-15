/**
 * Giving confirmation emails (Ways to Give → "Send your giving confirmation").
 *
 * Two messages come out of one submission:
 *   1. the sower's confirmation — an emailed copy of the receipt shown on the
 *      confirmation screen (same reference number and timestamp), so someone who
 *      closes the tab without screenshotting still has their reference; and
 *   2. the pastor's notification — that somebody has sown, with the amount, the
 *      note they left, and a link to the receipt image. Addressed to
 *      PASTOR_ADMIN_NOTIFY_EMAIL, which is NOT the ADMIN_NOTIFY_EMAIL the event
 *      emails notify: what someone gave goes to a narrower audience than an
 *      event sign-up does.
 *
 * The sower's copy is CONDITIONAL. Email is optional on this form (the giving
 * form is deliberately the shortest on the site), so most submissions will send
 * the admin message alone. That is not a failure state and is never logged as
 * one — see `sendGivingConfirmationEmails`.
 *
 * Same components as the event pair in ./event-registration-email.ts, so all
 * three read as messages from one church rather than three systems.
 */

import {
  GOLD_DARK,
  MONO,
  MUTED,
  NAVY,
  SANS,
  SUCCESS,
  callout,
  detailRows,
  escapeHtml,
  footer,
  header,
  referenceCard,
  shell,
} from './components';
import { dispatchEmails, isEmailAddress, type OutgoingMessage } from './send';

export interface GivingEmailData {
  referenceNumber: string;
  /** Asia/Manila submission time — the same string the receipt shows. */
  timestamp: string;
  /** The sower's name, as typed. */
  fullName: string;
  /** Bare number string as normalised by the schema ("1500.5"), not display text. */
  amount: string;
  /** Optional on the form — the sower's copy only goes out when this is here. */
  email?: string;
  /** The sower's own optional note (sheet column E). */
  notes?: string;
  /** Blob URL of the uploaded receipt. Admin copy only — never sent to the sower. */
  proofUrl?: string;
}

/** "1500.5" → "₱1,500.50". Falls back to the raw text if it isn't a number. */
function formatPeso(amount: string): string {
  const value = Number(amount);
  if (!Number.isFinite(value) || amount.trim() === '') return amount;
  return `₱${value.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** A note is free text from a textarea — escape it, then keep its line breaks. */
function multilineHtml(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, '<br>');
}

// ── Sower confirmation ─────────────────────────────────────────────────────

export function buildSowerEmail(data: GivingEmailData) {
  const name = data.fullName.trim() || 'Friend';
  const amount = formatPeso(data.amount);

  // The amount is deliberately NOT in the subject: subject lines surface on
  // lock screens and in shoulder-surfable notification previews, and what
  // someone gave is between them and the church.
  const subject = `We received your giving confirmation (${data.referenceNumber})`;
  const preheader = `Reference ${data.referenceNumber}. Our team will check it against your gift.`;

  // Word for word the confirmation screen's opening line — the email is meant
  // to be the same artefact, not a second telling of it.
  const lead = `<strong style="color:${NAVY};">${escapeHtml(name)}</strong>, we've received your giving confirmation. Our team will check it against your gift.`;

  const html = shell(
    subject,
    preheader,
    [
      header('Thank You!', lead),
      referenceCard(data.referenceNumber, data.timestamp),
      detailRows([
        ['Sower', escapeHtml(name)],
        ['Amount', `<strong style="color:${NAVY};">${escapeHtml(amount)}</strong>`],
        ['Your note', data.notes ? multilineHtml(data.notes) : ''],
      ]),
      callout(
        'booked',
        `<strong>Your receipt is in.</strong> Nothing further is needed from you — our finance team verifies every gift against the receipt you sent. Keep reference <strong style="font-family:${MONO};">${escapeHtml(
          data.referenceNumber
        )}</strong> in case you ever need to ask about this gift.`
      ),
      `        <tr>
          <td class="gwc-pad" style="padding:22px 40px 0 40px;font-family:${SANS};">
            <div style="font-size:13px;line-height:1.7;color:${MUTED};">
              <strong style="color:${NAVY};">Keep your reference number.</strong> Save this email or note down
              <strong style="font-family:${MONO};color:${NAVY};">${escapeHtml(data.referenceNumber)}</strong> — it's how we find your gift if you ever need to follow up.
            </div>
          </td>
        </tr>`,
      footer(
        `Thank you for your generosity.<br>
         You're receiving this because this address was entered on the giving confirmation form. Questions? Just reply to this email.`
      ),
    ].join('\n')
  );

  const text = [
    'THANK YOU — GIVING CONFIRMATION RECEIVED',
    '',
    `${name}, we've received your giving confirmation. Our team will check it against your gift.`,
    '',
    `Reference No.: ${data.referenceNumber}`,
    data.timestamp ? `Submitted: ${data.timestamp}` : '',
    `Amount: ${amount}`,
    data.notes ? `Your note: ${data.notes}` : '',
    '',
    'Nothing further is needed from you — our finance team verifies every gift against the receipt you sent.',
    '',
    `Keep your reference number ${data.referenceNumber} — it's how we find your gift if you ever need to follow up.`,
    '',
    'Gateway Church · Cebu',
  ]
    .filter((line) => line !== '')
    .join('\n');

  return { subject, html, text };
}

// ── Admin notification ─────────────────────────────────────────────────────

export function buildGivingAdminEmail(data: GivingEmailData) {
  const name = data.fullName.trim() || 'Someone';
  const amount = formatPeso(data.amount);

  const subject = `[GIVING] ${amount} — ${name} (${data.referenceNumber})`;

  const html = shell(
    subject,
    `${name} sent a giving confirmation for ${amount}.`,
    [
      header(
        'Someone has sown',
        `<strong style="color:${NAVY};">${escapeHtml(name)}</strong> sent a giving confirmation for <strong style="color:${NAVY};">${escapeHtml(
          amount
        )}</strong>.`
      ),
      referenceCard(data.referenceNumber, data.timestamp),
      detailRows([
        ['Sower', escapeHtml(name)],
        ['Amount', `<strong style="color:${NAVY};">${escapeHtml(amount)}</strong>`],
        ['Email', data.email ? escapeHtml(data.email) : ''],
        ['Note', data.notes ? multilineHtml(data.notes) : ''],
        [
          'Receipt',
          data.proofUrl
            ? `<span style="color:${SUCCESS};font-weight:700;">Uploaded</span> &middot; <a href="${escapeHtml(
                data.proofUrl
              )}" style="color:${GOLD_DARK};">view receipt</a>`
            : `<span style="color:${GOLD_DARK};font-weight:700;">Image upload failed — check the sheet</span>`,
        ],
      ]),
      callout(
        'booked',
        `Recorded on the <strong>GIVING</strong> sheet under reference <strong style="font-family:${MONO};">${escapeHtml(
          data.referenceNumber
        )}</strong>. Verify the amount against the receipt, then note the result in the sheet.`
      ),
      footer(
        `Sent automatically when a giving confirmation is written to the GIVING sheet.${
          data.email ? ' Reply to this email to reach the sower directly.' : ' No email address was given, so there is no one to reply to.'
        }`
      ),
    ].join('\n')
  );

  const text = [
    `SOMEONE HAS SOWN — ${amount}`,
    '',
    `Sower: ${name}`,
    `Amount: ${amount}`,
    `Reference No.: ${data.referenceNumber}`,
    `Submitted: ${data.timestamp}`,
    data.email ? `Email: ${data.email}` : 'Email: (not given)',
    data.notes ? `Note: ${data.notes}` : '',
    data.proofUrl ? `Receipt: ${data.proofUrl}` : 'Receipt: image upload failed — check the sheet',
    '',
    'Recorded on the GIVING sheet. Verify the amount against the receipt, then note the result in the sheet.',
  ]
    .filter((line) => line !== '')
    .join('\n');

  return { subject, html, text };
}

// ── Dispatch ───────────────────────────────────────────────────────────────

/**
 * Fire whichever messages apply. Never throws and never rejects: the row is
 * already on the sheet by the time this runs, so the worst an email failure may
 * do is log.
 *
 * A submission with no email address sends the admin message only — that is the
 * expected path on this form, not a degraded one.
 */
export async function sendGivingConfirmationEmails(data: GivingEmailData): Promise<void> {
  const messages: OutgoingMessage[] = [];

  if (isEmailAddress(data.email)) {
    messages.push({
      audience: 'sower',
      to: data.email.trim(),
      payload: buildSowerEmail(data),
    });
  }

  // PASTOR_ADMIN_NOTIFY_EMAIL, not the ADMIN_NOTIFY_EMAIL the event emails use:
  // giving notifications carry amounts and go to the pastor, deliberately a
  // narrower audience than the general events inbox. Unset means no admin copy.
  const adminAddress = process.env.PASTOR_ADMIN_NOTIFY_EMAIL?.trim();
  if (isEmailAddress(adminAddress)) {
    messages.push({
      audience: 'admin',
      to: adminAddress,
      // Staff replying to the notification should land in the sower's inbox,
      // not the app's no-reply sender. Undefined when none was given.
      replyTo: data.email,
      payload: buildGivingAdminEmail(data),
    });
  }

  await dispatchEmails('Giving confirmation', data.referenceNumber, messages);
}
