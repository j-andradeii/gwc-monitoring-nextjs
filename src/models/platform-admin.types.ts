/**
 * Platform admin types
 *
 * `GET /api/v1/platform/tenants` (gwc-monitoring-service spec 020): every tenant with its churches and campuses.
 * Read-only; platform admins only.
 */

import type { ApiResponse } from '@/services/api-client';

export interface PlatformCampusAddressDto {
  id: string;
  location_name: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface PlatformChurchCampusDto {
  id: string;
  reference_id: string;
  church_campus_type: string;
  tag_line: string | null;
  description: string | null;
  established_date: string | null;
  addresses: PlatformCampusAddressDto[];
}

export interface PlatformChurchDto {
  id: string;
  name: string;
  timezone: string | null;
  created_at: string;
  church_campuses: PlatformChurchCampusDto[];
}

export type PlatformTenantStatus = 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';

export interface PlatformTenantDto {
  id: string;
  slug: string;
  name: string;
  status: PlatformTenantStatus | string;
  created_at: string;
  churches: PlatformChurchDto[];
}

export type PlatformTenantListResponseDto = ApiResponse<{ tenants: PlatformTenantDto[] }>;
