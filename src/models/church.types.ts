/**
 * Church Types
 */

import { ChurchCampusType, ChurchRole } from './enums';
import { MemberDto } from './member.types';

// Church DTO
export interface ChurchDto {
  id: string;
  name: string;
  created_at?: string;
  timezone?: string;
}

// Church address
export interface ChurchCampusAddressDto {
  id?: string;
  location_name?: string;
  street?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
}

export interface ChurchCampusAddressCreationDto {
  location_name?: string;
  street?: string;
  city?: string;
  state?: string;
  zip_code?: string;
}

// Church campus DTO
export interface ChurchCampusDto {
  id: string;
  type: ChurchCampusType;
  name?: string;
  reference_id?: string;
  tag_line?: string;
  description?: string;
  address?: string;
  contact_number?: string;
  email?: string;
  church_id?: string;
  church?: ChurchDto;
  addresses?: ChurchCampusAddressDto[];
  created_at?: string;
  updated_at?: string;
}

// Church campus staff DTO
export interface ChurchCampusStaffDto {
  id: string;
  role: ChurchRole;
  member?: MemberDto;
  church_campus?: ChurchCampusDto;
  church_campus_id?: string;
  is_hierarchy_root?: boolean;
  is_active?: boolean;
  created_at?: string;
}

// Church campus staff list
export interface ChurchCampusStaffListDto {
  items: ChurchCampusStaffDto[];
  staffs?: ChurchCampusStaffDto[];
  total: number;
}

// API response wrappers
export interface ChurchResponseDto {
  statusCode: number;
  data: ChurchDto;
}

export interface ChurchListResponseDto {
  statusCode: number;
  data: ChurchDto[];
}

export interface ChurchCampusResponseDto {
  statusCode: number;
  data: ChurchCampusDto;
}

export interface ChurchCampusStaffListResponseDto {
  statusCode: number;
  data: ChurchCampusStaffListDto;
}

// Church campus update DTO
export interface ChurchCampusUpdateDto {
  name?: string;
  tag_line?: string;
  description?: string;
  address?: string;
  contact_number?: string;
  email?: string;
  addresses?: ChurchCampusAddressCreationDto[];
}
