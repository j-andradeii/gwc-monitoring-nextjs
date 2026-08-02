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
 * The markup is deliberately table-and-inline-styles: Gmail strips <head>
 * styles on some clients and Outlook ignores modern layout entirely. Colours
 * are the brand tokens from DESIGN.md — gold #d4a84b, navy #1a2744, cream
 * #f5f0e6 — with the contrast rule enforced: navy on gold, white on navy,
 * never white on gold.
 */

import { siteMetadata } from '@/data/site-metadata';
import { isEmailAddress, sendEmail } from './send';

// ── Brand tokens (mirrors lib/registration-receipt.ts, which draws the saved
//    receipt image — the email and the PNG should read as the same artefact).
const NAVY = '#1a2744';
const GOLD = '#d4a84b';
const GOLD_DARK = '#b8923f';
const GOLD_TINT = '#f7eeda';
const CREAM = '#f5f0e6';
const IVORY = '#faf8f3';
const MUTED = '#6b7a90';
const BORDER = '#e3dccc';
const HAIRLINE = '#eef0f4';
const SUCCESS = '#15803d';
const SUCCESS_TINT = '#edf6ef';

// Inter isn't available to mail clients; fall back to the platform UI stack.
const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const MONO = "'SFMono-Regular',Consolas,'Courier New',monospace";

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

/**
 * Names and event titles are registrant-supplied and land inside markup — a
 * last name of `<script>` must not become one.
 */
function escapeHtml(value: string): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Where the registrant goes to finish paying (or to re-read the details). */
function eventUrl(eventSlug: string): string {
  const base = siteMetadata.siteUrl.replace(/\/$/, '');
  return `${base}/events/${encodeURIComponent(eventSlug)}#event-complete`;
}

/**
 * Outer document. `preheader` is the grey line inboxes show next to the
 * subject — left unset it fills with whatever text comes first, which here
 * would be the "GATEWAY CHURCH" wordmark.
 */
function shell(title: string, preheader: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(title)}</title>
<style>
  :root { color-scheme: light; supported-color-schemes: light; }
  body { margin:0 !important; padding:0 !important; width:100% !important; background:${IVORY}; }
  table { border-collapse:collapse; }
  img { border:0; outline:none; text-decoration:none; }
  @media only screen and (max-width:620px) {
    .gwc-card { width:100% !important; }
    .gwc-pad { padding-left:24px !important; padding-right:24px !important; }
    .gwc-title { font-size:26px !important; }
    .gwc-code { font-size:20px !important; letter-spacing:0.5px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${IVORY};">
<div style="display:none;font-size:1px;color:${IVORY};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${IVORY};">
  <tr>
    <td align="center" style="padding:32px 12px;">
      <table role="presentation" class="gwc-card" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:#ffffff;border:1px solid ${BORDER};border-radius:20px;overflow:hidden;">
        <tr>
          <td style="height:8px;line-height:8px;font-size:0;background:${GOLD};">&nbsp;</td>
        </tr>
${content}
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

/** Gold wordmark + headline — the receipt image opens the same way. */
function header(headline: string, sublineHtml?: string): string {
  return `        <tr>
          <td class="gwc-pad" style="padding:36px 40px 0 40px;font-family:${SANS};">
            <div style="font-size:12px;font-weight:800;letter-spacing:2.4px;color:${GOLD_DARK};text-transform:uppercase;">Gateway Church</div>
            <h1 class="gwc-title" style="margin:14px 0 0 0;font-size:30px;line-height:1.2;font-weight:800;color:${NAVY};">${escapeHtml(headline)}</h1>
            ${sublineHtml ? `<div style="margin-top:10px;font-size:15px;line-height:1.6;color:${MUTED};">${sublineHtml}</div>` : ''}
          </td>
        </tr>`;
}

/** Small uppercase tracked label — the receipt's section marker. */
function label(text: string): string {
  return `<div style="font-size:11px;font-weight:700;letter-spacing:1.6px;color:${MUTED};text-transform:uppercase;">${escapeHtml(text)}</div>`;
}

/**
 * The reference number, given the weight it has on the confirmation screen:
 * it is the only way back into this registration.
 */
function referenceCard(referenceNumber: string, timestamp: string): string {
  return `        <tr>
          <td class="gwc-pad" style="padding:24px 40px 0 40px;font-family:${SANS};">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${CREAM};border-radius:14px;">
              <tr>
                <td style="padding:20px 24px;">
                  ${label('Reference No.')}
                  <div class="gwc-code" style="margin-top:8px;font-family:${MONO};font-size:26px;font-weight:700;letter-spacing:1px;color:${NAVY};">${escapeHtml(referenceNumber)}</div>
                  ${timestamp ? `<div style="margin-top:10px;font-size:13px;color:${MUTED};">Submitted ${escapeHtml(timestamp)}</div>` : ''}
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
}

/**
 * Everyone this payment covers — always rendered, whether that is one person
 * or ten, so the registrant can check the list is right.
 */
function registrantsList(names: string[]): string {
  const rows = names
    .map(
      (name, index) => `                <tr>
                  <td width="34" valign="top" style="padding:10px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="26" height="26" align="center" valign="middle" style="width:26px;height:26px;background:${GOLD_TINT};border-radius:8px;font-family:${SANS};font-size:12px;font-weight:800;color:${GOLD_DARK};">${index + 1}</td>
                      </tr>
                    </table>
                  </td>
                  <td valign="middle" style="padding:10px 0;font-family:${SANS};font-size:16px;font-weight:600;color:${NAVY};${index < names.length - 1 ? `border-bottom:1px solid ${HAIRLINE};` : ''}">${escapeHtml(name)}</td>
                </tr>`
    )
    .join('\n');

  return `        <tr>
          <td class="gwc-pad" style="padding:26px 40px 0 40px;font-family:${SANS};">
            ${label(names.length > 1 ? `Registrants (${names.length})` : 'Registrant')}
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:6px;">
${rows}
            </table>
          </td>
        </tr>`;
}

/** Coloured callout: gold = something still owed, green = done. */
function callout(tone: 'pending' | 'booked', html: string): string {
  const background = tone === 'pending' ? GOLD_TINT : SUCCESS_TINT;
  const accent = tone === 'pending' ? GOLD : SUCCESS;

  return `        <tr>
          <td class="gwc-pad" style="padding:26px 40px 0 40px;font-family:${SANS};">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${background};border-left:4px solid ${accent};border-radius:10px;">
              <tr>
                <td style="padding:16px 20px;font-size:14px;line-height:1.65;color:${NAVY};">${html}</td>
              </tr>
            </table>
          </td>
        </tr>`;
}

/** Bulletproof button — gold fill, navy text (white on gold fails contrast). */
function button(href: string, text: string): string {
  return `        <tr>
          <td class="gwc-pad" style="padding:26px 40px 0 40px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="background:${GOLD};border-radius:10px;">
                  <a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 28px;font-family:${SANS};font-size:15px;font-weight:700;color:${NAVY};text-decoration:none;">${escapeHtml(text)}</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
}

function footer(noteHtml: string): string {
  return `        <tr>
          <td class="gwc-pad" style="padding:30px 40px 34px 40px;font-family:${SANS};">
            <div style="height:1px;line-height:1px;font-size:0;background:${BORDER};">&nbsp;</div>
            <div style="margin-top:18px;font-size:12px;line-height:1.7;color:${MUTED};">${noteHtml}</div>
            <div style="margin-top:12px;font-size:12px;font-weight:700;letter-spacing:1.4px;color:${GOLD_DARK};text-transform:uppercase;">Gateway Church &middot; Cebu</div>
          </td>
        </tr>`;
}

/** "Alice", "Alice and Ben", "Alice, Ben and 3 others" — for subject lines. */
function summarizeNames(names: string[]): string {
  const [primary, ...rest] = names;
  if (rest.length === 0) return primary;
  if (rest.length === 1) return `${primary} +1`;
  return `${primary} +${rest.length}`;
}

// ── Registrant confirmation ────────────────────────────────────────────────

export function buildRegistrantEmail(data: RegistrationEmailData) {
  const names = data.names.filter(Boolean);
  const count = names.length;
  const isGroup = count > 1;
  const primary = names[0] ?? 'Friend';
  const url = eventUrl(data.eventSlug);

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

  // Escaped per entry, then joined with real <br> tags — escaping the joined
  // string would neuter the separators along with the handles.
  const socials = (data.socialMedia ?? [])
    .filter((entry) => entry?.platform && entry?.handle)
    .map((entry) => escapeHtml(`${entry.platform}: ${entry.handle}`))
    .join('<br>');

  const row = (name: string, value: string) =>
    value
      ? `              <tr>
                <td valign="top" style="padding:8px 0;width:150px;font-family:${SANS};font-size:12px;font-weight:700;letter-spacing:1px;color:${MUTED};text-transform:uppercase;border-bottom:1px solid ${HAIRLINE};">${escapeHtml(name)}</td>
                <td valign="top" style="padding:8px 0;font-family:${SANS};font-size:14px;color:${NAVY};border-bottom:1px solid ${HAIRLINE};">${value}</td>
              </tr>`
      : '';

  const details = `        <tr>
          <td class="gwc-pad" style="padding:24px 40px 0 40px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${[
  row('Event', escapeHtml(data.eventTitle)),
  row('Event date', escapeHtml(data.eventDate)),
  row('Submitted', escapeHtml(data.timestamp)),
  row('Slots', String(count)),
  row(
    'Payment',
    data.proofProvided
      ? `<span style="color:${SUCCESS};font-weight:700;">Proof uploaded</span>${
          data.proofUrl
            ? ` &middot; <a href="${escapeHtml(data.proofUrl)}" style="color:${GOLD_DARK};">view proof</a>`
            : ' (image upload failed — check the sheet)'
        }`
      : `<span style="color:${GOLD_DARK};font-weight:700;">Awaiting proof of payment</span>`
  ),
  row('Email', data.email ? escapeHtml(data.email) : ''),
  row('Phone', data.phone ? escapeHtml(data.phone) : ''),
  row('Cell leader', data.cellLeader ? escapeHtml(data.cellLeader) : ''),
  row('Socials', socials),
]
  .filter(Boolean)
  .join('\n')}
            </table>
          </td>
        </tr>`;

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
 * The registrant copy is skipped when the (optional) Email field was left
 * blank — that is the normal case for someone who only left a phone number.
 */
export async function sendRegistrationEmails(data: RegistrationEmailData): Promise<void> {
  const messages: Array<{ audience: string; to: string; payload: ReturnType<typeof buildRegistrantEmail> }> = [];

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
      payload: buildAdminEmail(data),
    });
  }

  if (messages.length === 0) return;

  const results = await Promise.allSettled(
    messages.map(({ audience, to, payload }) =>
      sendEmail({
        to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
        // Staff replying to the notification should land in the registrant's
        // inbox, not the app's no-reply sender.
        replyTo: audience === 'admin' ? data.email : undefined,
      }).then((result) => ({ audience, result }))
    )
  );

  results.forEach((outcome, index) => {
    const audience = messages[index].audience;

    if (outcome.status === 'rejected') {
      console.error(`Registration ${audience} email threw:`, outcome.reason);
      return;
    }

    if (!outcome.value.result.sent) {
      console.error(
        `Registration ${audience} email not sent (${data.referenceNumber}):`,
        outcome.value.result.error
      );
    }
  });
}
