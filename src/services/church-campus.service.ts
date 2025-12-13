/**
 * Church Campus Service
 *
 * Handles church campus operations
 */

import { apiClient } from './api-client';
import { useApiEventStore, ApiEventType, ApiEventStatus } from '@/stores/event.store';
import { Messages } from '@/core/messages';
import {
  ChurchCampusDto,
  ChurchCampusResponseDto,
  ChurchCampusStaffListDto,
  ChurchCampusStaffListResponseDto,
  ChurchCampusUpdateDto,
} from '@/models/church.types';

const { sendEvent } = useApiEventStore.getState();

/**
 * Get church campus by ID
 */
export const getChurchCampusById = async (
  id: string
): Promise<ChurchCampusDto | null> => {
  const eventType = ApiEventType.GET_CHURCH_CAMPUS;

  try {
    sendEvent({
      type: eventType,
      status: ApiEventStatus.IN_PROGRESS,
      spinner: true,
      targetId: id,
    });

    const response = await apiClient.get<ChurchCampusResponseDto>(
      `church-campuses/${id}`
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

/**
 * Get church campus staffs
 */
export const getChurchCampusStaffs = async (
  id: string
): Promise<ChurchCampusStaffListDto | null> => {
  const eventType = ApiEventType.GET_CHURCH_CAMPUS_STAFFS;

  try {
    sendEvent({
      type: eventType,
      status: ApiEventStatus.IN_PROGRESS,
      spinner: true,
      targetId: id,
    });

    const response = await apiClient.get<ChurchCampusStaffListResponseDto>(
      `church-campuses/${id}/staffs`
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

/**
 * Update church campus
 */
export const updateChurchCampus = async (
  id: string,
  data: ChurchCampusUpdateDto
): Promise<ChurchCampusDto | null> => {
  const eventType = ApiEventType.UPDATE_CHURCH_CAMPUS;

  try {
    sendEvent({
      type: eventType,
      status: ApiEventStatus.IN_PROGRESS,
      spinner: true,
      targetId: id,
    });

    const response = await apiClient.patch<ChurchCampusResponseDto>(
      `church-campuses/${id}`,
      data
    );

    sendEvent({
      type: eventType,
      status: ApiEventStatus.COMPLETED,
      message: Messages.MESSAGE_CAMPUS_UPDATED,
      toast: true,
      targetId: id,
    });

    return response.data;
  } catch (error) {
    const errorMessage =
      (error as { message?: string })?.message || Messages.MESSAGE_GENERIC_ERROR;

    sendEvent({
      type: eventType,
      status: ApiEventStatus.ERROR,
      title: Messages.HEADER_GENERIC_ERROR,
      message: errorMessage,
      toast: true,
      targetId: id,
    });

    return null;
  }
};

// Export as service object
export const churchCampusService = {
  getChurchCampusById,
  getChurchCampusStaffs,
  updateChurchCampus,
};
