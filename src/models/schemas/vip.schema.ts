import { z } from 'zod';

export const vipFormSchema = z.object({
    familyName: z.string().min(1, 'Family name is required'),
    firstName: z.string().min(1, 'First name is required'),
    birthdate: z.union([z.date(), z.null()]).refine((val) => val !== null, {
        message: 'Birthdate is required',
    }),
    socialMedia: z.string().min(1, 'Social media handle is required'),
    contactNumber: z.string().min(1, 'Contact number is required'),
    whoInvitedYou: z.string().min(1, 'Please tell us who invited you'),
});

export type VipFormData = z.infer<typeof vipFormSchema>;
