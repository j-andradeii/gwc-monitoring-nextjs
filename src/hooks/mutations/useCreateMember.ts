import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';
import { QUERY_KEYS } from '@/lib/query-keys';
import type { MemberCreationDto, MemberResponseDto } from '@/models/member.types';

export const useCreateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MemberCreationDto) =>
      apiClient.post<MemberResponseDto>('members', data, { target: 'api' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.members() });
    },
  });
};

export const useCreateCellMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MemberCreationDto) =>
      apiClient.post<MemberResponseDto>('members/cell-member', data, {
        target: 'api',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.members() });
    },
  });
};
