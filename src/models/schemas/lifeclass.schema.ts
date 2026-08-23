import { z } from 'zod';

/**
 * Life Class enrollment.
 *
 * Shared by the public form — which extends this with the proof-of-payment
 * `File`, since a File only exists in the browser — and by
 * POST /api/events/lifeclass-enrollment, which re-validates the same shape.
 *
 * Deliberately not sod.schema.ts with different labels: Life Class is the
 * entry-point class, so it drops SOD's consolidator / cell-leader "status"
 * checkboxes, which only make sense for someone already leading a cell, and
 * asks for an email instead.
 */

export const LIFECLASS_CATEGORY_OPTIONS = ['Student', 'Working Professional', 'Parent'] as const;

export const lifeclassEnrollmentSchema = z.object({
  surname: z.string().min(1, 'Surname is required'),
  givenName: z.string().min(1, 'Given name is required'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('That email doesn’t look complete. Please check it.'),
  /** Optional — email is the required way to reach an enrollee. */
  mobileNumber: z.string().optional(),
  birthdate: z.date({ message: 'Birthdate is required' }),
  cellLeader: z.string().min(1, 'Cell leader name is required'),
  category: z.enum(LIFECLASS_CATEGORY_OPTIONS, { message: 'Please select your category' }),
  amountSent: z.string().optional(),
});

export type LifeclassEnrollmentData = z.infer<typeof lifeclassEnrollmentSchema>;
