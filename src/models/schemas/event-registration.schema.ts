import { z } from 'zod';

export const eventRegistrationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  cellLeader: z.string().min(1, 'Cell leader name is required'),
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
  amountSent: z.string().min(1, 'Payment amount sent is required'),
});

export type EventRegistrationData = z.infer<typeof eventRegistrationSchema>;
