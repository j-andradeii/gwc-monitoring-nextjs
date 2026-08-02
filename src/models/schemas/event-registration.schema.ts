import { z } from 'zod';

/**
 * One extra person covered by the same payment. Only the name is collected —
 * every other detail (cell leader, contact info, socials, proof of payment) is
 * copied from the primary registrant when the rows are written to the sheet.
 */
export const additionalRegistrantSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

/**
 * One social handle. Both halves may be blank: the form opens with an empty row
 * and "Add another account" appends another, and now that socials are optional
 * neither may block a submission.
 *
 * A handle typed WITHOUT a platform is still rejected — the sheet writer drops
 * any entry missing either half, so it would otherwise vanish silently.
 */
export const socialMediaEntrySchema = z
  .object({
    platform: z.string(),
    handle: z.string(),
  })
  .refine((entry) => !entry.handle.trim() || entry.platform.trim().length > 0, {
    message: 'Pick a platform for this handle',
    path: ['platform'],
  });

export const eventRegistrationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  cellLeader: z.string().optional(),
  // Required: the confirmation email — the registrant's copy of their reference
  // number — has nowhere to go without it.
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  phone: z.string().optional(),
  // Optional, and may arrive empty. Entries with a blank handle are filtered out
  // when the row is written.
  socialMedia: z.array(socialMediaEntrySchema),
  // Group registration — the registrant paid for more than one slot.
  registerMultiple: z.boolean().optional(),
  // Stays empty when registering alone. The UI clears it whenever
  // `registerMultiple` is unticked so half-filled rows can't block submission.
  additionalRegistrants: z.array(additionalRegistrantSchema),
});

export type AdditionalRegistrantData = z.infer<typeof additionalRegistrantSchema>;
export type SocialMediaEntryData = z.infer<typeof socialMediaEntrySchema>;
export type EventRegistrationData = z.infer<typeof eventRegistrationSchema>;
