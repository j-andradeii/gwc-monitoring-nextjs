/**
 * Shared building blocks for this app's transactional emails.
 *
 * Every message we send is the same artefact seen twice: the receipt on the
 * confirmation screen, and a copy of it in an inbox. These pieces — the shell,
 * the reference card, the registrants list — are what keep the two looking
 * alike, and what keep the registration email (./event-registration-email.ts)
 * and the proof-of-payment email (./event-proof-email.ts) looking like each
 * other.
 *
 * The markup is deliberately table-and-inline-styles: Gmail strips <head>
 * styles on some clients and Outlook ignores modern layout entirely. Colours
 * are the brand tokens from DESIGN.md — gold #d4a84b, navy #1a2744, cream
 * #f5f0e6 — with the contrast rule enforced: navy on gold, white on navy,
 * never white on gold.
 */

import { siteMetadata } from '@/data/site-metadata';

// ── Brand tokens (mirrors lib/registration-receipt.ts, which draws the saved
//    receipt image — the email and the PNG should read as the same artefact).
export const NAVY = '#1a2744';
export const GOLD = '#d4a84b';
export const GOLD_DARK = '#b8923f';
export const GOLD_TINT = '#f7eeda';
export const CREAM = '#f5f0e6';
export const IVORY = '#faf8f3';
export const MUTED = '#6b7a90';
export const BORDER = '#e3dccc';
export const HAIRLINE = '#eef0f4';
export const SUCCESS = '#15803d';
export const SUCCESS_TINT = '#edf6ef';

// Inter isn't available to mail clients; fall back to the platform UI stack.
export const SANS =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
export const MONO = "'SFMono-Regular',Consolas,'Courier New',monospace";

/**
 * Names and event titles are registrant-supplied and land inside markup — a
 * last name of `<script>` must not become one.
 */
export function escapeHtml(value: string): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Link back to the event page. `hash` targets a section on it — pass
 * `event-complete` for someone who still owes a proof of payment, and leave it
 * off for someone who is done and just wants the event details.
 *
 * `reference` rides along as `?ref=` and prefills the reference field of the
 * "Complete your registration" panel on arrival, so the button in the email is
 * the whole journey: land on the event, land on the panel, field already
 * filled (see EventRegistrationSection, which reads the param).
 */
export function eventUrl(eventSlug: string, hash?: string, reference?: string): string {
  const base = siteMetadata.siteUrl.replace(/\/$/, '');
  const query = reference ? `?ref=${encodeURIComponent(reference)}` : '';
  return `${base}/events/${encodeURIComponent(eventSlug)}${query}${hash ? `#${hash}` : ''}`;
}

/**
 * Outer document. `preheader` is the grey line inboxes show next to the
 * subject — left unset it fills with whatever text comes first, which here
 * would be the "GATEWAY CHURCH" wordmark.
 */
export function shell(title: string, preheader: string, content: string): string {
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
export function header(headline: string, sublineHtml?: string): string {
  return `        <tr>
          <td class="gwc-pad" style="padding:36px 40px 0 40px;font-family:${SANS};">
            <div style="font-size:12px;font-weight:800;letter-spacing:2.4px;color:${GOLD_DARK};text-transform:uppercase;">Gateway Church</div>
            <h1 class="gwc-title" style="margin:14px 0 0 0;font-size:30px;line-height:1.2;font-weight:800;color:${NAVY};">${escapeHtml(headline)}</h1>
            ${sublineHtml ? `<div style="margin-top:10px;font-size:15px;line-height:1.6;color:${MUTED};">${sublineHtml}</div>` : ''}
          </td>
        </tr>`;
}

/** Small uppercase tracked label — the receipt's section marker. */
export function label(text: string): string {
  return `<div style="font-size:11px;font-weight:700;letter-spacing:1.6px;color:${MUTED};text-transform:uppercase;">${escapeHtml(text)}</div>`;
}

/**
 * The reference number, given the weight it has on the confirmation screen:
 * it is the only way back into this registration.
 */
export function referenceCard(
  referenceNumber: string,
  timestamp: string,
  timestampLabel = 'Submitted'
): string {
  return `        <tr>
          <td class="gwc-pad" style="padding:24px 40px 0 40px;font-family:${SANS};">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${CREAM};border-radius:14px;">
              <tr>
                <td style="padding:20px 24px;">
                  ${label('Reference No.')}
                  <div class="gwc-code" style="margin-top:8px;font-family:${MONO};font-size:26px;font-weight:700;letter-spacing:1px;color:${NAVY};">${escapeHtml(referenceNumber)}</div>
                  ${timestamp ? `<div style="margin-top:10px;font-size:13px;color:${MUTED};">${escapeHtml(timestampLabel)} ${escapeHtml(timestamp)}</div>` : ''}
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
export function registrantsList(names: string[]): string {
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
export function callout(tone: 'pending' | 'booked', html: string): string {
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
export function button(href: string, text: string): string {
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

export function footer(noteHtml: string): string {
  return `        <tr>
          <td class="gwc-pad" style="padding:30px 40px 34px 40px;font-family:${SANS};">
            <div style="height:1px;line-height:1px;font-size:0;background:${BORDER};">&nbsp;</div>
            <div style="margin-top:18px;font-size:12px;line-height:1.7;color:${MUTED};">${noteHtml}</div>
            <div style="margin-top:12px;font-size:12px;font-weight:700;letter-spacing:1.4px;color:${GOLD_DARK};text-transform:uppercase;">Gateway Church &middot; Cebu</div>
          </td>
        </tr>`;
}

/**
 * A label / value table — the admin copies' "everything staff need" block.
 * Rows with an empty value are dropped, so a caller can list every field it
 * might have without guarding each one.
 */
export function detailRows(entries: Array<[string, string]>): string {
  const rows = entries
    .filter(([, value]) => Boolean(value))
    .map(
      ([name, value]) => `              <tr>
                <td valign="top" style="padding:8px 0;width:150px;font-family:${SANS};font-size:12px;font-weight:700;letter-spacing:1px;color:${MUTED};text-transform:uppercase;border-bottom:1px solid ${HAIRLINE};">${escapeHtml(name)}</td>
                <td valign="top" style="padding:8px 0;font-family:${SANS};font-size:14px;color:${NAVY};border-bottom:1px solid ${HAIRLINE};">${value}</td>
              </tr>`
    )
    .join('\n');

  return `        <tr>
          <td class="gwc-pad" style="padding:24px 40px 0 40px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${rows}
            </table>
          </td>
        </tr>`;
}

/**
 * The uploaded receipt, shown inline and clickable through to the full-size
 * original in a new tab.
 *
 * Staff verify an amount by looking at the image, so making them click into the
 * sheet (or even into a link) to see it is a step too many. Two things carry
 * the click target, deliberately: the image itself, and a text link beneath it.
 * Outlook and several corporate clients block remote images by default, and a
 * blocked <img> takes its wrapping <a> with it — the caption link is what keeps
 * the receipt reachable when that happens.
 *
 * `width` is an attribute as well as CSS because Outlook ignores `max-width`;
 * 480 fits the 600px card once the 40px gutters and the frame's padding are
 * taken out. Height is left to the image so a tall phone screenshot isn't
 * squashed — a receipt that can't be read is worth nothing here.
 */
export function receiptImage(url: string, labelText = 'Receipt'): string {
  const href = escapeHtml(url);

  return `        <tr>
          <td class="gwc-pad" style="padding:26px 40px 0 40px;font-family:${SANS};">
            ${label(labelText)}
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:10px;background:${IVORY};border:1px solid ${BORDER};border-radius:14px;">
              <tr>
                <td align="center" style="padding:14px 14px 10px 14px;">
                  <a href="${href}" target="_blank" rel="noopener noreferrer" style="display:block;text-decoration:none;">
                    <img src="${href}" alt="Proof of payment — open the email's images to view it" width="480" style="display:block;width:100%;max-width:480px;height:auto;border-radius:10px;border:1px solid ${HAIRLINE};">
                  </a>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:0 14px 14px 14px;font-family:${SANS};">
                  <a href="${href}" target="_blank" rel="noopener noreferrer" style="font-size:13px;font-weight:700;color:${GOLD_DARK};text-decoration:underline;">Open full size in a new tab</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
}

/** "Alice", "Alice +1", "Alice +3" — for subject lines. */
export function summarizeNames(names: string[]): string {
  const [primary, ...rest] = names;
  if (rest.length === 0) return primary;
  if (rest.length === 1) return `${primary} +1`;
  return `${primary} +${rest.length}`;
}

/**
 * Social handles as the admin emails render them: escaped per entry, then
 * joined with real <br> tags — escaping the joined string would neuter the
 * separators along with the handles.
 */
export function socialHandlesHtml(
  socialMedia: Array<{ platform: string; handle: string }> | undefined
): string {
  return (socialMedia ?? [])
    .filter((entry) => entry?.platform && entry?.handle)
    .map((entry) => escapeHtml(`${entry.platform}: ${entry.handle}`))
    .join('<br>');
}
