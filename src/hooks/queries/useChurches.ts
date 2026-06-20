import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';
import { QUERY_KEYS } from '@/lib/query-keys';
import type { ChurchListResponseDto } from '@/models/church.types';

export const useChurches = () => {
  return useQuery({
    queryKey: QUERY_KEYS.churches(),
    queryFn: () => apiClient.get<ChurchListResponseDto>('churches', { target: 'api' }),
  });
};
