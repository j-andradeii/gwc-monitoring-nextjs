/**
 * Church Service
 *
 * Thin wrappers around apiClient for church operations.
 * State management and caching is handled by TanStack Query hooks
 * in src/hooks/queries/.
 */

import { apiClient } from './api-client';
import { ChurchDto, ChurchListResponseDto } from '@/models/church.types';

/**
 * Get all churches
 */
export const getChurches = (): Promise<ChurchListResponseDto> =>
  apiClient.get<ChurchListResponseDto>('churches', { target: 'api' });

/**
 * Get single church by ID
 */
export const getChurchById = (
  id: string
): Promise<{ statusCode: number; data: ChurchDto }> =>
  apiClient.get<{ statusCode: number; data: ChurchDto }>(`churches/${id}`, {
    target: 'api',
  });

// Export as service object
export const churchService = {
  getChurches,
  getChurchById,
};
