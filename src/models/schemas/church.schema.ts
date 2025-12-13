/**
 * Church Validation Schemas
 */

import { z } from 'zod';

// Church campus address schema
export const churchCampusAddressSchema = z.object({
  location_name: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
});

// Church campus update schema
export const churchCampusUpdateSchema = z.object({
  name: z.string().min(1, 'Campus name is required'),
  tag_line: z.string().max(200, 'Tag line cannot exceed 200 characters').optional(),
  description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
  address: z.string().optional(),
  contact_number: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  addresses: z.array(churchCampusAddressSchema).optional(),
});

export type ChurchCampusUpdateFormData = z.infer<typeof churchCampusUpdateSchema>;

// Church info schema
export const churchInfoSchema = z.object({
  name: z.string().min(1, 'Church name is required'),
  timezone: z.string().optional(),
});

export type ChurchInfoFormData = z.infer<typeof churchInfoSchema>;
