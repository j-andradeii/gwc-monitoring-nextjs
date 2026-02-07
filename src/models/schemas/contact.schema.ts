import { z } from 'zod';

const contactInfoSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
});

const baseSchema = contactInfoSchema.extend({
    phone: z.string().min(1, 'Phone number is required'),
});

const prayerSchema = baseSchema.extend({
    type: z.literal('prayer'),
    message: z.string().min(1, 'Prayer request is required'),
});

export const joinSchema = baseSchema.extend({
    type: z.literal('join'),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    gender: z.string().min(1, 'Gender is required'),
    address: z.string().min(1, 'Address is required'),
    joinReason: z.string().min(1, 'Please tell us why you want to join'),
});

export const simpleContactSchema = contactInfoSchema.extend({
    message: z.string().min(1, 'Message is required'),
});

export const contactSchema = z.discriminatedUnion('type', [
    prayerSchema,
    joinSchema,
]);

export type SimpleContactFormData = z.infer<typeof simpleContactSchema>;

export const eventContactSchema = contactInfoSchema.extend({
    phone: z.string().min(1, 'Phone number is required'),
    address: z.string().min(1, 'Address is required'),
    gender: z.string().min(1, 'Gender is required'),
    facebook: z.string().optional(),
    message: z.string().optional(),
});

export type EventContactFormData = z.infer<typeof eventContactSchema>;

export type ContactFormData = z.infer<typeof contactSchema>;
