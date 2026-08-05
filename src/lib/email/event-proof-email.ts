/**
 * Pay-later proof-of-payment emails.
 *
 * The second half of the flow in ./event-registration-email.ts: a registrant
 * who reserved a slot without paying comes back to the "Complete your
 * registration" panel with their reference number and sends the proof. That
 * upload gets the same two messages the original registration did —
 *
 *   1. the registrant's confirmation, so they have written evidence the proof
 *      landed (the panel's receipt screen is gone the moment they close the
 *      tab); and
 *   2. the admin notification, with a link to the image so staff can verify the
 *      amount without opening the sheet.
 *
 * ONE registrant email goes out, to the primary registrant, even when the
 * reference covers a group. The additional rows of a group only exist to hold
 * names — the registration route copies the payer's address onto all of them —
 * so mailing every row would mean sending the same person the same message N
 * times. See `primaryRegistrantEmail`.
 */

import {
  GOLD_DARK,
  MONO,
  MUTED,
  NAVY,
  SANS,
  SUCCESS,
  button,
  callout,
  detailRows,
  escapeHtml,
  eventUrl,
  footer,
  header,
  referenceCard,
  registrantsList,
  shell,
  socialHandlesHtml,
  summarizeNames,
} from './components';
import { dispatchEmails, isEmailAddress, type OutgoingMessage } from './send';

export interface ProofEmailData {
  eventTitle: string;
  eventDate: string;
  eventSlug: string;
  referenceNumber: string;
  /** Asia/Manila time the proof landed — the restamped column A. */
  timestamp: string;
  /** Primary registrant first, then everyone else the reference covers. */
  names: string[];
  /** The primary registrant's address; the only person emailed. */
  email?: string;
  phone?: string;
  cellLeader?: string;
  socialMedia?: Array<{ platform: string; handle: string }>;
  /** Blob URL of the uploaded image — admin copy only. */
  proofUrl?: string;
  /** True when a proof was already on file and this upload replaced it. */
  replacedExisting?: boolean;
}

// ── Registrant confirmation ────────────────────────────────────────────────

export function buildProofRegistrantEmail(data: ProofEmailData) {
  const names = data.names.filter(Boolean);
  const count = names.length;
  const isGroup = count > 1;
  const primary = names[0] ?? 'Friend';
  // They are done with the pay-later panel, so send them to the event itself.
  const url = eventUrl(data.eventSlug);

  const subject = `Proof of payment received — ${data.eventTitle} (${data.referenceNumber})`;

  const preheader = `Reference ${data.referenceNumber}. ${
    isGroup ? `All ${count} slots are` : 'Your slot is'
  } reserved while we verify your payment.`;

  const lead = `<strong style="color:${NAVY};">${escapeHtml(primary)}</strong>, we've received your proof of payment for <strong style="color:${NAVY};">${escapeHtml(
    data.eventTitle
  )}</strong>${
    isGroup ? `, covering <strong style="color:${NAVY};">${count} people</strong>` : ''
  }. ${isGroup ? 'Your slots are' : 'Your slot is'} reserved while our team verifies it.`;

  const statusCallout = callout(
    'booked',
    `<strong>${
      isGroup ? `All ${count} slots are booked.` : 'Your slot is booked.'
    }</strong> ${
      data.replacedExisting
        ? 'This image replaces the proof we had on file for this reference number. '
        : ''
    }Your ${
      isGroup ? 'slots are' : 'slot is'
    } confirmed once our team verifies the payment, and we'll be in touch if anything is missing. Keep reference <strong style="font-family:${MONO};">${escapeHtml(
      data.referenceNumber
    )}</strong> for any follow-up.`
  );

  const groupNote = isGroup
    ? `        <tr>
          <td class="gwc-pad" style="padding:16px 40px 0 40px;font-family:${SANS};">
            <div style="font-size:13px;line-height:1.65;color:${MUTED};">Everyone above shares this reference number — the one payment you sent covers the whole group.</div>
          </td>
        </tr>`
    : '';

  const html = shell(
    subject,
    preheader,
    [
      header('Payment received!', lead),
      referenceCard(data.referenceNumber, data.timestamp, 'Proof received'),
      registrantsList(names),
      groupNote,
      statusCallout,
      button(url, 'View event details'),
      `        <tr>
          <td class="gwc-pad" style="padding:22px 40px 0 40px;font-family:${SANS};">
            <div style="font-size:13px;line-height:1.7;color:${MUTED};">
              <strong style="color:${NAVY};">Sent the wrong screenshot?</strong> Enter
              <strong style="font-family:${MONO};color:${NAVY};">${escapeHtml(data.referenceNumber)}</strong>
              under <em>Complete your registration</em> on the event page again and upload the right one — it replaces this ${
                isGroup ? 'one for every name above' : 'one'
              }.
            </div>
          </td>
        </tr>`,
      footer(
        `${escapeHtml(data.eventTitle)}${data.eventDate ? ` &middot; ${escapeHtml(data.eventDate)}` : ''}<br>
         You're receiving this because this address was used to register for the event above. Questions? Just reply to this email.`
      ),
    ].join('\n')
  );

  const text = [
    'PROOF OF PAYMENT RECEIVED',
    '',
    `${primary}, we've received your proof of payment for ${data.eventTitle}${
      isGroup ? `, covering ${count} people` : ''
    }. ${isGroup ? 'Your slots are' : 'Your slot is'} reserved while our team verifies it.`,
    '',
    `Reference No.: ${data.referenceNumber}`,
    data.timestamp ? `Proof received: ${data.timestamp}` : '',
    data.eventDate ? `Event date: ${data.eventDate}` : '',
    '',
    isGroup ? `Registrants (${count}):` : 'Registrant:',
    ...names.map((name, index) => `  ${index + 1}. ${name}`),
    '',
    data.replacedExisting
      ? 'This image replaces the proof we had on file for this reference number.'
      : '',
    `${
      isGroup ? `All ${count} slots are booked.` : 'Your slot is booked.'
    } It is confirmed once our team verifies the payment.`,
    '',
    url,
    '',
    `Sent the wrong screenshot? Enter ${data.referenceNumber} under "Complete your registration" on the event page again and upload the right one — it replaces this one.`,
    '',
    'Gateway Church · Cebu',
  ]
    .filter((line) => line !== '')
    .join('\n');

  return { subject, html, text };
}

// ── Admin notification ─────────────────────────────────────────────────────

export function buildProofAdminEmail(data: ProofEmailData) {
  const names = data.names.filter(Boolean);
  const count = names.length;

  const subject = `${data.replacedExisting ? '[PROOF REPLACED]' : '[PROOF RECEIVED]'} ${
    data.eventTitle
  } — ${summarizeNames(names)}${count > 1 ? ` (${count} slots)` : ''}`;

  const details = detailRows([
    ['Event', escapeHtml(data.eventTitle)],
    ['Event date', escapeHtml(data.eventDate)],
    ['Proof received', escapeHtml(data.timestamp)],
    ['Slots', String(count)],
    [
      'Payment',
      `<span style="color:${SUCCESS};font-weight:700;">${
        data.replacedExisting ? 'Proof replaced' : 'Proof uploaded'
      }</span>${
        data.proofUrl
          ? ` &middot; <a href="${escapeHtml(data.proofUrl)}" style="color:${GOLD_DARK};">view proof</a>`
          : ''
      }`,
    ],
    ['Email', data.email ? escapeHtml(data.email) : ''],
    ['Phone', data.phone ? escapeHtml(data.phone) : ''],
    ['Cell leader', data.cellLeader ? escapeHtml(data.cellLeader) : ''],
    ['Socials', socialHandlesHtml(data.socialMedia)],
  ]);

  const html = shell(
    subject,
    `${summarizeNames(names)} sent a proof of payment for ${data.eventTitle}.`,
    [
      header(
        data.replacedExisting ? 'Proof of payment replaced' : 'Proof of payment received',
        `<strong style="color:${NAVY};">${escapeHtml(
          names[0] ?? 'Someone'
        )}</strong> completed a pay-later registration for <strong style="color:${NAVY};">${escapeHtml(
          data.eventTitle
        )}</strong>${
          count > 1 ? `, covering <strong style="color:${NAVY};">${count} people</strong>` : ''
        }.`
      ),
      referenceCard(data.referenceNumber, data.timestamp, 'Proof received'),
      registrantsList(names),
      details,
      callout(
        'booked',
        `${
          data.replacedExisting
            ? 'This upload <strong>replaced</strong> the proof previously on file. It is now attached'
            : 'The image is attached'
        } to <strong>${
          count > 1 ? `all ${count} rows` : 'the row'
        }</strong> sharing reference <strong style="font-family:${MONO};">${escapeHtml(
          data.referenceNumber
        )}</strong>, and their timestamps have been restamped to when it arrived. Verify the amount${
          count > 1 ? ` (it should cover ${count} registrants)` : ''
        } and confirm the ${count > 1 ? 'slots' : 'slot'}.`
      ),
      footer(
        `Sent automatically when a proof of payment is attached to an existing registration.${
          data.email ? ' Reply to this email to reach the registrant directly.' : ''
        }`
      ),
    ].join('\n')
  );

  const text = [
    `${data.replacedExisting ? 'PROOF OF PAYMENT REPLACED' : 'PROOF OF PAYMENT RECEIVED'} — ${data.eventTitle}`,
    '',
    `Reference No.: ${data.referenceNumber}`,
    `Proof received: ${data.timestamp}`,
    data.eventDate ? `Event date: ${data.eventDate}` : '',
    `Slots: ${count}`,
    `Proof: ${data.proofUrl || '(no link — check the sheet)'}`,
    '',
    count > 1 ? `Registrants (${count}):` : 'Registrant:',
    ...names.map((name, index) => `  ${index + 1}. ${name}`),
    '',
    data.email ? `Email: ${data.email}` : '',
    data.phone ? `Phone: ${data.phone}` : '',
    data.cellLeader ? `Cell leader: ${data.cellLeader}` : '',
    ...(data.socialMedia ?? [])
      .filter((entry) => entry?.platform && entry?.handle)
      .map((entry) => `${entry.platform}: ${entry.handle}`),
  ]
    .filter((line) => line !== '')
    .join('\n');

  return { subject, html, text };
}

// ── Dispatch ───────────────────────────────────────────────────────────────

/**
 * The one address to write to for a reference number, whatever it covers.
 *
 * Rows are in sheet order, so `rows[0]` is the person who registered and paid;
 * the rest are the names they added. The registration route copies the payer's
 * address onto every row of the group, so scanning past a blank first cell
 * still lands on the payer's own address — never on an additional registrant's,
 * because they never supplied one.
 */
export function primaryRegistrantEmail(rows: Array<{ email?: string }>): string | undefined {
  const match = rows.find((row) => isEmailAddress(row.email));
  return match?.email?.trim();
}

/**
 * Fire both messages. Never throws: the proof is already on the sheet by the
 * time this runs, so an email failure is logged and nothing else.
 */
export async function sendProofOfPaymentEmails(data: ProofEmailData): Promise<void> {
  const messages: OutgoingMessage[] = [];

  if (isEmailAddress(data.email)) {
    messages.push({
      audience: 'registrant',
      to: data.email.trim(),
      payload: buildProofRegistrantEmail(data),
    });
  }

  const adminAddress = process.env.ADMIN_NOTIFY_EMAIL?.trim();
  if (isEmailAddress(adminAddress)) {
    messages.push({
      audience: 'admin',
      to: adminAddress,
      // Staff replying to the notification should land in the registrant's
      // inbox, not the app's no-reply sender.
      replyTo: data.email,
      payload: buildProofAdminEmail(data),
    });
  }

  await dispatchEmails('Proof of payment', data.referenceNumber, messages);
}
