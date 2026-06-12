import { z } from 'zod';

export const sodEnrollmentSchema = z.object({
  surname: z.string().min(1, 'Surname is required'),
  givenName: z.string().min(1, 'Given name is required'),
  middleName: z.string().optional(),
  mobileNumber: z.string().min(1, 'Mobile number is required'),
  birthdate: z.date({ message: 'Birthdate is required' }),
  cellLeader: z.string().min(1, 'Cell leader name is required'),
  classToEnroll: z.enum(['School of Destiny 1', 'School of Destiny 2'], { message: 'Please select which class to enroll' }),
  category: z.enum(['Student', 'Working Professional', 'Parent'], { message: 'Please select your category' }),
  status: z.array(z.string()).min(1, 'Please choose at least one status'),
  amountSent: z.string().optional(),
});

export type SodEnrollmentData = z.infer<typeof sodEnrollmentSchema>;

/**
 * Proof-of-payment upload constraints — shared by the client-side file
 * validation and the server route that uploads the image to Google Drive.
 */
export const SOD_PROOF_MAX_BYTES = 10 * 1024 * 1024; // 10 MB
export const SOD_PROOF_ACCEPT = 'image/*';
