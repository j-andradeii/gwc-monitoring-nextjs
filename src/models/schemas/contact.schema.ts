import { z } from 'zod';

const baseSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
});

const prayerSchema = baseSchema.extend({
    type: z.literal('prayer'),
    message: z.string().min(1, 'Prayer request is required'),
});

const joinSchema = baseSchema.extend({
    type: z.literal('join'),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    gender: z.string().min(1, 'Gender is required'),
    address: z.string().min(1, 'Address is required'),
    joinReason: z.string().min(1, 'Please tell us why you want to join'),
});

export const contactSchema = z.discriminatedUnion('type', [
    prayerSchema,
    joinSchema,
]);

export type ContactFormData = z.infer<typeof contactSchema>;
