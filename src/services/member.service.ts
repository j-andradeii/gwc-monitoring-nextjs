/**
 * Member Service
 *
 * Thin wrappers around apiClient for member CRUD operations.
 * State management and caching is handled by TanStack Query hooks
 * in src/hooks/queries/ and src/hooks/mutations/.
 */

import { apiClient } from './api-client';
import { buildQueryString } from '@/core/utils';
import {
  MemberCreationDto,
  MemberListResponseDto,
  MemberResponseDto,
  MemberPaginationParams,
} from '@/models/member.types';

/**
 * Get paginated list of members
 */
export const getMembers = (
  params: MemberPaginationParams
): Promise<MemberListResponseDto> => {
  const queryParams = buildQueryString({
    page: params.page,
    pageSize: params.pageSize,
    sortBy: params.sortBy,
    sortDirection: params.sortDirection,
    search: params.search,
    gender: params.gender,
    affiliation: params.affiliation,
    civil_status: params.civil_status,
  });

  const endpoint = `members${queryParams ? `?${queryParams}` : ''}`;
  return apiClient.get<MemberListResponseDto>(endpoint, { target: 'api' });
};

/**
 * Get single member by ID
 */
export const getMemberById = (id: string): Promise<MemberResponseDto> =>
  apiClient.get<MemberResponseDto>(`members/${id}`, { target: 'api' });

/**
 * Create new member
 */
export const createMember = (
  data: MemberCreationDto
): Promise<MemberResponseDto> =>
  apiClient.post<MemberResponseDto>('members', data, { target: 'api' });

/**
 * Create cell member
 */
export const createCellMember = (
  data: MemberCreationDto
): Promise<MemberResponseDto> =>
  apiClient.post<MemberResponseDto>('members/cell-member', data, {
    target: 'api',
  });

/**
 * Update existing member
 */
export const updateMember = (
  id: string,
  data: Partial<MemberCreationDto>
): Promise<MemberResponseDto> =>
  apiClient.patch<MemberResponseDto>(`members/${id}`, data, { target: 'api' });

/**
 * Delete member
 */
export const deleteMember = (id: string): Promise<unknown> =>
  apiClient.delete(`members/${id}`, { target: 'api' });

// Export as service object
export const memberService = {
  getMembers,
  getMemberById,
  createMember,
  createCellMember,
  updateMember,
  deleteMember,
};
