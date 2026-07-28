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

export const eventRegistrationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  cellLeader: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  socialMedia: z
    .array(
      z.object({
        platform: z.string().min(1, 'Platform is required'),
        handle: z.string().min(1, 'Handle is required'),
      })
    )
    .min(1, 'At least one social media handle is required'),
  // Group registration — the registrant paid for more than one slot.
  registerMultiple: z.boolean().optional(),
  // Stays empty when registering alone. The UI clears it whenever
  // `registerMultiple` is unticked so half-filled rows can't block submission.
  additionalRegistrants: z.array(additionalRegistrantSchema),
});

export type AdditionalRegistrantData = z.infer<typeof additionalRegistrantSchema>;
export type EventRegistrationData = z.infer<typeof eventRegistrationSchema>;
