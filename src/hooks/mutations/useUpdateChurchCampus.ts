import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';
import { QUERY_KEYS } from '@/lib/query-keys';
import type {
  ChurchCampusUpdateDto,
  ChurchCampusResponseDto,
} from '@/models/church.types';

export const useUpdateChurchCampus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: ChurchCampusUpdateDto;
    }) =>
      apiClient.patch<ChurchCampusResponseDto>(`church-campuses/${id}`, data, {
        target: 'api',
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.churchCampus(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.churchCampusStaffs(variables.id),
      });
    },
  });
};
