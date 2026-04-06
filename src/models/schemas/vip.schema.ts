import { z } from 'zod';

export const vipFormSchema = z.object({
    familyName: z.string().min(1, 'Family name is required'),
    firstName: z.string().min(1, 'First name is required'),
    birthdate: z.date({ message: 'Birthdate is required' }),
    socialMedia: z.array(z.object({
        platform: z.string().min(1, 'Platform is required'),
        handle: z.string().min(1, 'Handle is required')
    })).min(1, 'At least one social media handle is required'),
    contactNumber: z.string().min(1, 'Contact number is required'),
    whoInvitedYou: z.string().min(1, 'Please tell us who invited you'),
});

export type VipFormData = z.infer<typeof vipFormSchema>;
