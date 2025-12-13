/**
 * Member Validation Schemas
 */

import { z } from 'zod';
import { Gender, CivilStatus, Affiliation, ContactInfoType, SocialMediaType } from '../enums';

// Member address schema
export const memberAddressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
});

// Member contact schema
export const memberContactSchema = z.object({
  contactInfoType: z.nativeEnum(ContactInfoType),
  number: z.string().min(1, 'Contact number is required'),
});

// Member social schema
export const memberSocialSchema = z.object({
  social_media_type: z.nativeEnum(SocialMediaType),
  username: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
});

// Personal information step schema
export const personalInfoSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters'),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),
  birthdate: z.string().optional(),
  gender: z.nativeEnum(Gender).optional(),
  civil_status: z.nativeEnum(CivilStatus).optional(),
  affiliation: z.nativeEnum(Affiliation).optional(),
  photo_url: z.string().optional(),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

// Contact information step schema
export const contactInfoSchema = z.object({
  member_addresses: z.array(memberAddressSchema).optional(),
  member_contacts: z.array(memberContactSchema).optional(),
  member_socials: z.array(memberSocialSchema).optional(),
});

export type ContactInfoFormData = z.infer<typeof contactInfoSchema>;

// Invited by step schema
export const invitedBySchema = z.object({
  invited_by: z.string().optional(),
});

export type InvitedByFormData = z.infer<typeof invitedBySchema>;

// Cell leader step schema
export const cellLeaderSchema = z.object({
  cell_leader: z.string().optional(),
});

export type CellLeaderFormData = z.infer<typeof cellLeaderSchema>;

// Full member creation schema
export const memberCreationSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters'),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  middle_name: z.string().optional(),
  suffix_name: z.string().optional(),
  email: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),
  mobile_number: z.string().optional(),
  birthdate: z.union([z.date(), z.string()]).optional(),
  gender: z.nativeEnum(Gender).optional(),
  civil_status: z.nativeEnum(CivilStatus).optional(),
  affiliation: z.nativeEnum(Affiliation).optional(),
  photo_url: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  occupation: z.string().optional(),
  company: z.string().optional(),
  notes: z.string().optional(),
  member_addresses: z.array(memberAddressSchema).optional(),
  member_contacts: z.array(memberContactSchema).optional(),
  member_socials: z.array(memberSocialSchema).optional(),
  invited_by: z.string().optional(),
  cell_leader: z.string().optional(),
  church_campus_id: z.string().optional(),
});

export type MemberCreationFormData = z.infer<typeof memberCreationSchema>;

// Member search/filter schema
export const memberFilterSchema = z.object({
  search: z.string().optional(),
  gender: z.nativeEnum(Gender).optional(),
  civil_status: z.nativeEnum(CivilStatus).optional(),
  affiliation: z.nativeEnum(Affiliation).optional(),
});

export type MemberFilterFormData = z.infer<typeof memberFilterSchema>;
