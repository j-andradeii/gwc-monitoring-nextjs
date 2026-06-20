/**
 * Church Campus Service
 *
 * Thin wrappers around apiClient for church campus operations.
 * State management and caching is handled by TanStack Query hooks
 * in src/hooks/queries/ and src/hooks/mutations/.
 */

import { apiClient } from './api-client';
import {
  ChurchCampusResponseDto,
  ChurchCampusStaffListResponseDto,
  ChurchCampusUpdateDto,
} from '@/models/church.types';

/**
 * Get church campus by ID
 */
export const getChurchCampusById = (
  id: string
): Promise<ChurchCampusResponseDto> =>
  apiClient.get<ChurchCampusResponseDto>(`church-campuses/${id}`, {
    target: 'api',
  });

/**
 * Get church campus staffs
 */
export const getChurchCampusStaffs = (
  id: string
): Promise<ChurchCampusStaffListResponseDto> =>
  apiClient.get<ChurchCampusStaffListResponseDto>(
    `church-campuses/${id}/staffs`,
    { target: 'api' }
  );

/**
 * Update church campus
 */
export const updateChurchCampus = (
  id: string,
  data: ChurchCampusUpdateDto
): Promise<ChurchCampusResponseDto> =>
  apiClient.patch<ChurchCampusResponseDto>(`church-campuses/${id}`, data, {
    target: 'api',
  });

// Export as service object
export const churchCampusService = {
  getChurchCampusById,
  getChurchCampusStaffs,
  updateChurchCampus,
};
