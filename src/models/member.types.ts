/**
 * Member Types
 */

import {
  Gender,
  CivilStatus,
  Affiliation,
  ContactInfoType,
  ContactInfoPriorityType,
  SocialMediaType,
} from './enums';

// Cell group
export interface CellGroupDto {
  id: string;
  name: string;
}

// Basic member DTO
export interface MemberDto {
  id: string;
  church_id?: string;
  church_campus_id?: string;
  auth_id?: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  suffix_name?: string;
  email?: string;
  mobile_number?: string;
  birthdate?: string;
  photo?: string;
  photo_url?: string;
  gender?: Gender | string;
  civil_status?: CivilStatus | string;
  affiliation?: Affiliation | string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  country?: string;
  occupation?: string;
  company?: string;
  notes?: string;
  cell_group?: CellGroupDto;
  // Relationships (matches Angular DTOs)
  invited_by?: MemberDto;
  cell_leader?: MemberDto;
  created_at?: string;
  updated_at?: string;
}

// Member address
export interface MemberAddressDto {
  id?: string;
  street?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
}

export interface MemberAddressCreationDto {
  street?: string;
  city?: string;
}

// Member contact
export interface MemberContactDto {
  id?: string;
  contact_info_type: ContactInfoType;
  contact_info_priority_type?: ContactInfoPriorityType;
  number: string;
}

export interface MemberContactCreationDto {
  contactInfoType: ContactInfoType;
  number: string;
}

// Member social
export interface MemberSocialDto {
  id?: string;
  social_media_type: SocialMediaType;
  username?: string;
  name?: string;
  email?: string;
}

export interface MemberSocialCreationDto {
  social_media_type: SocialMediaType;
  username?: string;
  name?: string;
  email?: string;
}

// Full member creation DTO
export interface MemberCreationDto {
  first_name: string;
  last_name: string;
  email?: string;
  birthdate?: string;
  photo_url?: string;
  gender?: Gender;
  civil_status?: CivilStatus;
  affiliation?: Affiliation;
  member_addresses?: MemberAddressCreationDto[];
  member_contacts?: MemberContactCreationDto[];
  member_socials?: MemberSocialCreationDto[];
  invited_by?: string;
  cell_leader?: string;
}

// Full member with relations
export interface MemberFullDto extends MemberDto {
  member_addresses?: MemberAddressDto[];
  member_contacts?: MemberContactDto[];
  member_socials?: MemberSocialDto[];
  invited_by_member?: MemberDto;
  cell_leader_member?: MemberDto;
}

// Member list response
export interface MemberListDto {
  members: MemberDto[];
  total: number;
}

// API response wrappers
export interface MemberResponseDto {
  statusCode: number;
  data: MemberDto;
}

export interface MemberListResponseDto {
  statusCode: number;
  data: MemberDto[];
  total: number;
}

// Member filter options
export interface MemberFilterOptions {
  search?: string;
  gender?: Gender;
  affiliation?: Affiliation;
  civil_status?: CivilStatus;
}

// Pagination params (matches Angular member service)
export interface MemberPaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  search?: string;
  gender?: Gender | string; // Filter by gender (for men/women network pages)
  affiliation?: Affiliation | string;
  civil_status?: CivilStatus | string;
}
