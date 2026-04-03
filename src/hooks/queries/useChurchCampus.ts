import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';
import { QUERY_KEYS } from '@/lib/query-keys';
import type {
  ChurchCampusResponseDto,
  ChurchCampusStaffListResponseDto,
} from '@/models/church.types';

export const useChurchCampus = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.churchCampus(id),
    queryFn: () =>
      apiClient.get<ChurchCampusResponseDto>(`church-campuses/${id}`),
    enabled: !!id,
  });
};

export const useChurchCampusStaffs = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.churchCampusStaffs(id),
    queryFn: () =>
      apiClient.get<ChurchCampusStaffListResponseDto>(
        `church-campuses/${id}/staffs`
      ),
    enabled: !!id,
  });
};
