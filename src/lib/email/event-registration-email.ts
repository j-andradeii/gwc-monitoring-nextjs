/**
 * Paid-event registration emails.
 *
 * Two messages come out of one submission:
 *   1. the registrant's confirmation — an emailed copy of the receipt shown on
 *      the confirmation screen (same reference number, timestamp and names), so
 *      someone who navigates away without screenshotting still has their
 *      reference number; and
 *   2. the admin notification — everything staff need to match the payment.
 *
 * A group registration sends ONE registrant email, to the primary registrant.
 * The additional registrants only supply names (see the event-registration
 * schema) — there is no address to send to, and the one payment, one reference
 * number and one receipt all belong to the person who paid.
 *
 * When the proof of payment arrives later instead, the pair in
 * ./event-proof-email.ts goes out — same components, different copy.
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

export interface RegistrationEmailData {
  eventTitle: string;
  eventDate: string;
  eventSlug: string;
  referenceNumber: string;
  /** Asia/Manila submission time — the same string the receipt shows. */
  timestamp: string;
  /** Primary registrant first, then everyone covered by the same payment. */
  names: string[];
  /** Drives every "reserved vs. booked" branch in the copy. */
  proofProvided: boolean;
  email?: string;
  phone?: string;
  cellLeader?: string;
  socialMedia?: Array<{ platform: string; handle: string }>;
  /** Blob URL of the uploaded proof — admin copy only. */
  proofUrl?: string;
}

// ── Registrant confirmation ────────────────────────────────────────────────

export function buildRegistrantEmail(data: RegistrationEmailData) {
  const names = data.names.filter(Boolean);
  const count = names.length;
  const isGroup = count > 1;
  const primary = names[0] ?? 'Friend';
  // The reference — and the `#event-complete` hash with it — only ride along
  // for someone who still owes a proof: their button is "Upload proof of
  // payment", and it should land on the panel with nothing left to type. A
  // booked registrant's button is "View event details", so it goes to the top
  // of the page; the panel is collapsed behind its "Already Registered?" tab
  // until asked for, so that hash would find nothing on their visit anyway.
  const url = data.proofProvided
    ? eventUrl(data.eventSlug)
    : eventUrl(data.eventSlug, 'event-complete', data.referenceNumber);

  const subject = data.proofProvided
    ? `Your slot is booked — ${data.eventTitle} (${data.referenceNumber})`
    : `Registration received — complete your payment (${data.referenceNumber})`;

  const preheader = data.proofProvided
    ? `Reference ${data.referenceNumber}. ${isGroup ? `All ${count} slots are` : 'Your slot is'} booked.`
    : `Reference ${data.referenceNumber}. Upload your proof of payment to reserve ${isGroup ? `all ${count} slots` : 'your slot'}.`;

  // The lead paragraph is the confirmation screen's opening line, word for word.
  const lead = `<strong style="color:${NAVY};">${escapeHtml(primary)}</strong>, your registration for <strong style="color:${NAVY};">${escapeHtml(data.eventTitle)}</strong>${
    isGroup ? ` — covering <strong style="color:${NAVY};">${count} people</strong> —` : ''
  } is in.${
    data.proofProvided
      ? ` ${isGroup ? 'Your slots are' : 'Your slot is'} reserved.`
      : ' To complete it, use your reference number to upload your proof of payment.'
  }`;

  const statusCallout = data.proofProvided
    ? callout(
        'booked',
        `<strong>${isGroup ? `All ${count} slots are booked.` : 'Your slot is booked.'}</strong> We received your proof of payment${
          isGroup ? ` — the one payment covers every registrant listed above` : ''
        }. Your ${isGroup ? 'slots are' : 'slot is'} confirmed once our team verifies it, and we'll be in touch if anything is missing. Keep reference <strong style="font-family:${MONO};">${escapeHtml(
          data.referenceNumber
        )}</strong> for any follow-up.`
      )
    : callout(
        'pending',
        `<strong>No proof of payment yet — ${isGroup ? 'the slots are' : 'the slot is'} not reserved.</strong> You can complete this any time: pay the registration fee${
          isGroup ? ` for all ${count} registrants in one payment` : ''
        }, then enter reference <strong style="font-family:${MONO};">${escapeHtml(
          data.referenceNumber
        )}</strong> under <em>Complete your registration</em> on the event page and upload your proof. It attaches to ${
          isGroup ? 'every name above' : 'this registration'
        } and reserves ${isGroup ? 'all the slots' : 'your slot'}.`
      );

  const groupNote = isGroup
    ? `        <tr>
          <td class="gwc-pad" style="padding:16px 40px 0 40px;font-family:${SANS};">
            <div style="font-size:13px;line-height:1.65;color:${MUTED};">Everyone above shares this reference number — it covers the one payment ${
              data.proofProvided ? 'you sent' : 'for the whole group'
            }.</div>
          </td>
        </tr>`
    : '';

  const html = shell(
    subject,
    preheader,
    [
      header(data.proofProvided ? 'You’re booked!' : 'Thank You!', lead),
      referenceCard(data.referenceNumber, data.timestamp),
      registrantsList(names),
      groupNote,
      statusCallout,
      button(url, data.proofProvided ? 'View event details' : 'Upload proof of payment'),
      `        <tr>
          <td class="gwc-pad" style="padding:22px 40px 0 40px;font-family:${SANS};">
            <div style="font-size:13px;line-height:1.7;color:${MUTED};">
              <strong style="color:${NAVY};">Keep your reference number.</strong> Save this email or note down
              <strong style="font-family:${MONO};color:${NAVY};">${escapeHtml(data.referenceNumber)}</strong> — it's how we match your payment to your ${
                isGroup ? 'slots' : 'slot'
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
    data.proofProvided ? 'YOU’RE BOOKED' : 'THANK YOU — REGISTRATION RECEIVED',
    '',
    `${primary}, your registration for ${data.eventTitle}${isGroup ? ` — covering ${count} people —` : ''} is in.`,
    '',
    `Reference No.: ${data.referenceNumber}`,
    data.timestamp ? `Submitted: ${data.timestamp}` : '',
    data.eventDate ? `Event date: ${data.eventDate}` : '',
    '',
    count > 1 ? `Registrants (${count}):` : 'Registrant:',
    ...names.map((name, index) => `  ${index + 1}. ${name}`),
    '',
    data.proofProvided
      ? `${isGroup ? `All ${count} slots are booked.` : 'Your slot is booked.'} We received your proof of payment${
          isGroup ? ' — the one payment covers every registrant listed above' : ''
        }. It is confirmed once our team verifies it.`
      : `No proof of payment yet, so ${
          isGroup ? 'the slots are' : 'the slot is'
        } not reserved. Pay the registration fee${
          isGroup ? ` for all ${count} registrants in one payment` : ''
        }, then enter reference ${data.referenceNumber} under "Complete your registration" on the event page and upload your proof to reserve ${
          isGroup ? 'all the slots' : 'your slot'
        }.`,
    '',
    url,
    '',
    `Keep your reference number ${data.referenceNumber} — it's how we match your payment to your ${isGroup ? 'slots' : 'slot'}.`,
    '',
    'Gateway Church · Cebu',
  ]
    .filter((line) => line !== '')
    .join('\n');

  return { subject, html, text };
}

// ── Admin notification ─────────────────────────────────────────────────────

export function buildAdminEmail(data: RegistrationEmailData) {
  const names = data.names.filter(Boolean);
  const count = names.length;

  const subject = `${data.proofProvided ? '[PAID]' : '[AWAITING PROOF]'} ${data.eventTitle} — ${summarizeNames(names)}${
    count > 1 ? ` (${count} slots)` : ''
  }`;

  const details = detailRows([
    ['Event', escapeHtml(data.eventTitle)],
    ['Event date', escapeHtml(data.eventDate)],
    ['Submitted', escapeHtml(data.timestamp)],
    ['Slots', String(count)],
    [
      'Payment',
      data.proofProvided
        ? `<span style="color:${SUCCESS};font-weight:700;">Proof uploaded</span>${
            data.proofUrl
              ? ` &middot; <a href="${escapeHtml(data.proofUrl)}" style="color:${GOLD_DARK};">view proof</a>`
              : ' (image upload failed — check the sheet)'
          }`
        : `<span style="color:${GOLD_DARK};font-weight:700;">Awaiting proof of payment</span>`,
    ],
    ['Email', data.email ? escapeHtml(data.email) : ''],
    ['Phone', data.phone ? escapeHtml(data.phone) : ''],
    ['Cell leader', data.cellLeader ? escapeHtml(data.cellLeader) : ''],
    ['Socials', socialHandlesHtml(data.socialMedia)],
  ]);

  const html = shell(
    subject,
    `${summarizeNames(names)} registered for ${data.eventTitle} — ${
      data.proofProvided ? 'proof uploaded' : 'awaiting proof of payment'
    }.`,
    [
      header(
        'New registration',
        `<strong style="color:${NAVY};">${escapeHtml(names[0] ?? 'Someone')}</strong> registered for <strong style="color:${NAVY};">${escapeHtml(
          data.eventTitle
        )}</strong>${count > 1 ? `, covering <strong style="color:${NAVY};">${count} people</strong>` : ''}.`
      ),
      referenceCard(data.referenceNumber, data.timestamp),
      registrantsList(names),
      details,
      data.proofProvided
        ? callout(
            'booked',
            `Proof of payment is attached to <strong>${count > 1 ? `all ${count} rows` : 'the row'}</strong> sharing reference <strong style="font-family:${MONO};">${escapeHtml(
              data.referenceNumber
            )}</strong>. Verify the amount${count > 1 ? ` (it should cover ${count} registrants)` : ''} and confirm the ${count > 1 ? 'slots' : 'slot'}.`
          )
        : callout(
            'pending',
            `No proof of payment yet — the ${count > 1 ? 'slots are' : 'slot is'} reserved but unconfirmed. The registrant can upload it later against reference <strong style="font-family:${MONO};">${escapeHtml(
              data.referenceNumber
            )}</strong>.`
          ),
      footer(
        `Sent automatically when a registration is written to the events sheet.${
          data.email ? ' Reply to this email to reach the registrant directly.' : ''
        }`
      ),
    ].join('\n')
  );

  const text = [
    `NEW REGISTRATION — ${data.eventTitle}`,
    '',
    `Reference No.: ${data.referenceNumber}`,
    `Submitted: ${data.timestamp}`,
    data.eventDate ? `Event date: ${data.eventDate}` : '',
    `Slots: ${count}`,
    `Payment: ${
      data.proofProvided
        ? `proof uploaded${data.proofUrl ? ` — ${data.proofUrl}` : ' (image upload failed — check the sheet)'}`
        : 'awaiting proof of payment'
    }`,
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
 * Fire both messages. Never throws and never rejects: the registration it
 * describes is already saved, so the worst an email failure may do is log.
 *
 * The address is a required field, so the registrant copy should always go out;
 * the guard is a backstop for rows that reach here from anywhere else.
 */
export async function sendRegistrationEmails(data: RegistrationEmailData): Promise<void> {
  const messages: OutgoingMessage[] = [];

  // One email per submission, addressed to the primary registrant — the
  // additional registrants have names only, and share this person's payment.
  if (isEmailAddress(data.email)) {
    messages.push({
      audience: 'registrant',
      to: data.email.trim(),
      payload: buildRegistrantEmail(data),
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
      payload: buildAdminEmail(data),
    });
  }

  await dispatchEmails('Registration', data.referenceNumber, messages);
}
