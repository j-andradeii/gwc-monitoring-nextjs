import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';
import { QUERY_KEYS } from '@/lib/query-keys';

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`members/${id}`, { target: 'api' }),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.members() });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.member(id) });
    },
  });
};
