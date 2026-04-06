import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';
import { QUERY_KEYS } from '@/lib/query-keys';
import { buildQueryString } from '@/core/utils';
import type { MemberListResponseDto, MemberPaginationParams } from '@/models/member.types';

export const useMembers = (params: MemberPaginationParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.members(params as unknown as Record<string, unknown>),
    queryFn: () => {
      const queryString = buildQueryString({
        page: params.page,
        pageSize: params.pageSize,
        sortBy: params.sortBy,
        sortDirection: params.sortDirection,
        search: params.search,
        gender: params.gender,
        affiliation: params.affiliation,
        civil_status: params.civil_status,
      });
      const endpoint = `members${queryString ? `?${queryString}` : ''}`;
      return apiClient.get<MemberListResponseDto>(endpoint);
    },
    enabled: true,
  });
};
