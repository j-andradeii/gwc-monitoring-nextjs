import { apiClient } from '@/services/api-client';

export const submitQuery = (data: unknown) =>
  apiClient.post('/api/inquiry', data);

export const submitPrayerRequest = (data: unknown) =>
  apiClient.post('/api/inquiry/prayer-requests', data);

export const submitCellGroupJoinRequest = (data: unknown) =>
  apiClient.post('/api/inquiry/cell-groups', data);

export const submitEventInquiry = (data: unknown, slug: string) =>
  apiClient.post(`/api/event/${slug}`, data);

export const submitVipForm = (data: unknown) =>
  apiClient.post('/api/inquiry/vip', data);

export const submitGatewayPledge = (data: unknown) =>
  apiClient.post('/api/inquiry/pledge', data);
