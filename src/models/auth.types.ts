/**
 * Authentication Types
 */

import { ChurchCampusStaffDto } from './church.types';
import { MemberDto } from './member.types';

// Authenticated token response
export interface AuthenticatedToken {
  access_token: string;
  refresh_token: string;
}

export interface AuthenticatedTokenResponse {
  statusCode: number;
  data: AuthenticatedToken;
}

// Self information (authenticated user)
export interface SelfInformationDto {
  church_campus_staff: ChurchCampusStaffDto;
  member: MemberDto;
}

export interface SelfInformationResponseDto {
  statusCode: number;
  data: SelfInformationDto;
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Token refresh request
export interface TokenRefreshRequest {
  refresh_token: string;
}
