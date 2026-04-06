import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';
import { QUERY_KEYS } from '@/lib/query-keys';
import type { MemberCreationDto, MemberResponseDto } from '@/models/member.types';

export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<MemberCreationDto>;
    }) => apiClient.patch<MemberResponseDto>(`members/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.members() });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.member(variables.id),
      });
    },
  });
};
