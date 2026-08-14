import { z } from 'zod';

/**
 * One extra person covered by the same payment. Only the name is collected —
 * every other detail (cell leader, contact info, proof of payment) is copied
 * from the primary registrant when the rows are written to the sheet.
 */
export const additionalRegistrantSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

export const eventRegistrationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  cellLeader: z.string().optional(),
  // Required: the confirmation email — the registrant's copy of their reference
  // number — has nowhere to go without it.
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  phone: z.string().optional(),
  // Social handles are no longer collected — column J stays blank on new rows so
  // the sheet's column order is unchanged (see the sheet writer in
  // app/api/events/event-registration/route.ts).
  // Group registration — the registrant paid for more than one slot.
  registerMultiple: z.boolean().optional(),
  // Stays empty when registering alone. The UI clears it whenever
  // `registerMultiple` is unticked so half-filled rows can't block submission.
  additionalRegistrants: z.array(additionalRegistrantSchema),
});

export type AdditionalRegistrantData = z.infer<typeof additionalRegistrantSchema>;
export type EventRegistrationData = z.infer<typeof eventRegistrationSchema>;
