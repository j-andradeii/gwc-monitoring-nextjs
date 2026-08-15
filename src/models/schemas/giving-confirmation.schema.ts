import { z } from 'zod';

/**
 * Giving confirmation — the shortest form on the site on purpose.
 *
 * A giver has already sent their tithe / offering / firstfruits through one of
 * the channels above the form; all we need back is who they are, how much they
 * sent, and a photo of the receipt. Anything more would be another reason to
 * give up halfway — the form is aimed at the least tech-confident member of the
 * congregation.
 *
 * Shared by the client form (which extends it with the image file — a `File`
 * only exists in the browser) and by the route handler, which re-validates the
 * same shape server-side.
 */
/**
 * Reuses the same acceptance rule as every other email field on the site, so a
 * giver who typed an address here and on the event form gets one answer, not two.
 */
const emailRule = z.string().email();

/** Up to 12 digits and at most two centavos — anything past that is a typo. */
const AMOUNT_PATTERN = /^\d{1,12}(\.\d{1,2})?$/;

export const givingConfirmationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Please type your full name so we know who this gift is from.'),
  /**
   * Optional — the confirmation screen is the giver's copy, so nothing is
   * emailed. It's here only so the finance team has a way to reach back if a
   * gift can't be matched to a receipt.
   *
   * Blank (and whitespace-only) passes; anything typed has to be a real
   * address. `.refine` rather than `.or(z.literal(''))` because a union reports
   * the generic "Invalid input" and would swallow the message below.
   */
  email: z
    .string()
    .trim()
    .refine((value) => value === '' || emailRule.safeParse(value).success, {
      message: 'That email doesn’t look complete. Please check it, or leave it blank.',
    })
    .optional(),
  /**
   * The peso amount that was sent.
   *
   * Parsed rather than restricted at the keyboard: a giver copies what their
   * banking app shows them, which is "₱1,500.00" as often as "1500". The
   * transform strips the currency dressing so what reaches the sheet is a bare
   * number Sheets can sum — the form never rejects someone over punctuation.
   */
  /**
   * Optional free text from the giver — which fund the gift is for, a name to
   * credit it under, "sent from my wife's GCash", anything the receipt photo
   * can't say for itself. Lands in the sheet's Notes column.
   *
   * Capped so one pasted essay can't make the sheet row unreadable; the limit
   * is enforced on the textarea too, so it's a backstop, not the first line of
   * defence.
   */
  notes: z
    .string()
    .trim()
    .max(500, 'Please keep your note under 500 characters.')
    .optional(),
  amount: z
    .string()
    .trim()
    .transform((value) => value.replace(/[₱,\s]/g, '').replace(/^php/i, ''))
    .refine((value) => value !== '', {
      message: 'Please type the amount you gave.',
    })
    .refine((value) => AMOUNT_PATTERN.test(value), {
      message: 'Please type the amount in numbers only — for example 1500 or 1500.50.',
    })
    .refine((value) => Number(value) > 0, {
      message: 'The amount has to be more than zero.',
    }),
});

export type GivingConfirmationData = z.infer<typeof givingConfirmationSchema>;
