import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';
import { QUERY_KEYS } from '@/lib/query-keys';
import type { MemberResponseDto } from '@/models/member.types';

export const useMember = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.member(id),
    queryFn: () =>
      apiClient.get<MemberResponseDto>(`members/${id}`, { target: 'api' }),
    enabled: !!id,
  });
};
