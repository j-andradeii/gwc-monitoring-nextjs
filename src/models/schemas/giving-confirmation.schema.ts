import { z } from 'zod';

/**
 * Giving confirmation — the shortest form on the site on purpose.
 *
 * A giver has already sent their tithe / offering / firstfruits through one of
 * the channels above the form; all we need back is who they are and a photo of
 * the receipt. Anything more would be another reason to give up halfway, and
 * the form is aimed at the least tech-confident member of the congregation.
 *
 * Shared by the client form (which extends it with the image file — a `File`
 * only exists in the browser) and by the route handler, which re-validates the
 * same shape server-side.
 */
export const givingConfirmationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Please type your full name so we know who this gift is from.'),
});

export type GivingConfirmationData = z.infer<typeof givingConfirmationSchema>;
