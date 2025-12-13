/**
 * Church Service
 *
 * Handles church operations
 */

import { apiClient } from './api-client';
import { useApiEventStore, ApiEventType, ApiEventStatus } from '@/stores/event.store';
import { Messages } from '@/core/messages';
import { ChurchDto, ChurchListResponseDto } from '@/models/church.types';

const { sendEvent } = useApiEventStore.getState();

/**
 * Get all churches
 */
export const getChurches = async (): Promise<ChurchDto[] | null> => {
  const eventType = ApiEventType.GET_CHURCHES;

  try {
    sendEvent({
      type: eventType,
      status: ApiEventStatus.IN_PROGRESS,
      spinner: true,
    });

    const response = await apiClient.get<ChurchListResponseDto>('churches');

    sendEvent({
      type: eventType,
      status: ApiEventStatus.COMPLETED,
    });

    return response.data;
  } catch (error) {
    sendEvent({
      type: eventType,
      status: ApiEventStatus.ERROR,
      title: Messages.HEADER_GENERIC_ERROR,
      message: Messages.MESSAGE_FETCH_ERROR,
      toast: true,
    });

    return null;
  }
};

/**
 * Get single church by ID
 */
export const getChurchById = async (id: string): Promise<ChurchDto | null> => {
  const eventType = ApiEventType.GET_CHURCH;

  try {
    sendEvent({
      type: eventType,
      status: ApiEventStatus.IN_PROGRESS,
      spinner: true,
      targetId: id,
    });

    const response = await apiClient.get<{ statusCode: number; data: ChurchDto }>(
      `churches/${id}`
    );

    sendEvent({
      type: eventType,
      status: ApiEventStatus.COMPLETED,
      targetId: id,
    });

    return response.data;
  } catch (error) {
    sendEvent({
      type: eventType,
      status: ApiEventStatus.ERROR,
      title: Messages.HEADER_GENERIC_ERROR,
      message: Messages.MESSAGE_FETCH_ERROR,
      toast: true,
      targetId: id,
    });

    return null;
  }
};

// Export as service object
export const churchService = {
  getChurches,
  getChurchById,
};
