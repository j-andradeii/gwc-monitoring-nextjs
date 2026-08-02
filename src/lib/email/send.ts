/**
 * Resend transport.
 *
 * Resend's REST API is a single JSON POST, so it is called through `fetch`
 * rather than the `resend` SDK — same reasoning as lib/registration-receipt.ts
 * drawing its own canvas instead of pulling in a DOM-to-image library.
 *
 * Nothing here throws. Every message this app sends is a side effect of an
 * action that has ALREADY succeeded (a registration is in the sheet by the time
 * we email about it), so a bounced address or a Resend outage must never turn a
 * recorded registration into a failed request. Failures are logged and reported
 * through the return value instead.
 *
 * Node-only — never import from a Client Component (RESEND_API_KEY is secret).
 *
 * Env:
 *   RESEND_API_KEY      required; without it sending is skipped, not attempted
 *   MAIL_FROM           e.g. `Gateway Church <hello@resend.dev>`
 *   ADMIN_NOTIFY_EMAIL  read by the callers that notify staff
 */

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

/** Resend's shared sandbox sender — works without a verified domain. */
const DEFAULT_FROM = 'Gateway Church <onboarding@resend.dev>';

/** A hung request must not hold a serverless invocation open. */
const REQUEST_TIMEOUT_MS = 10_000;

export interface EmailMessage {
  to: string | string[];
  subject: string;
  html: string;
  /** Always send one: a text/plain part keeps the message out of spam filters. */
  text: string;
  replyTo?: string;
}

export interface EmailResult {
  sent: boolean;
  id?: string;
  error?: string;
}

/**
 * Loose shape check, not validation — Zod already vetted the registrant's
 * address. This exists to drop the empty string the optional Email field
 * submits, which would otherwise be handed to Resend as a recipient.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmailAddress(value: unknown): value is string {
  return typeof value === 'string' && EMAIL_PATTERN.test(value.trim());
}

/** False in local dev / preview environments with no key — callers skip quietly. */
export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendEmail(message: EmailMessage): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return { sent: false, error: 'RESEND_API_KEY is not set' };
  }

  const recipients = (Array.isArray(message.to) ? message.to : [message.to])
    .map((address) => String(address).trim())
    .filter(isEmailAddress);

  if (recipients.length === 0) {
    return { sent: false, error: 'No valid recipient address' };
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.MAIL_FROM || DEFAULT_FROM,
        to: recipients,
        subject: message.subject,
        html: message.html,
        text: message.text,
        ...(isEmailAddress(message.replyTo) ? { reply_to: message.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    const payload = (await response.json().catch(() => ({}))) as {
      id?: string;
      message?: string;
      name?: string;
    };

    if (!response.ok) {
      // Most common cause in practice: sending from an unverified domain to
      // anyone other than the Resend account owner. Surface Resend's own words.
      const error = payload.message || `Resend responded ${response.status}`;
      console.error('Resend send failed:', error);
      return { sent: false, error };
    }

    return { sent: true, id: payload.id };
  } catch (error) {
    console.error('Resend request failed:', error);
    return {
      sent: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
