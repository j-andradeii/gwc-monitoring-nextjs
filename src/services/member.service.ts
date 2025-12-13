/**
 * Member Service
 *
 * Handles member CRUD operations
 */

import { apiClient } from './api-client';
import { useApiEventStore, ApiEventType, ApiEventStatus } from '@/stores/event.store';
import { Messages } from '@/core/messages';
import { buildQueryString } from '@/core/utils';
import {
  MemberDto,
  MemberCreationDto,
  MemberListResponseDto,
  MemberResponseDto,
  MemberPaginationParams,
} from '@/models/member.types';

const { sendEvent } = useApiEventStore.getState();

/**
 * Get paginated list of members
 */
export const getMembers = async (
  params: MemberPaginationParams
): Promise<MemberListResponseDto | null> => {
  const eventType = ApiEventType.GET_MEMBERS;

  try {
    sendEvent({
      type: eventType,
      status: ApiEventStatus.IN_PROGRESS,
      spinner: true,
    });

    const queryParams = buildQueryString({
      page: params.page,
      pageSize: params.pageSize,
      sortBy: params.sortBy,
      sortDirection: params.sortDirection,
      search: params.search,
    });

    const endpoint = `members${queryParams ? `?${queryParams}` : ''}`;
    const response = await apiClient.get<MemberListResponseDto>(endpoint);

    sendEvent({
      type: eventType,
      status: ApiEventStatus.COMPLETED,
    });

    return response;
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
 * Get single member by ID
 */
export const getMemberById = async (id: string): Promise<MemberDto | null> => {
  const eventType = ApiEventType.GET_MEMBER;

  try {
    sendEvent({
      type: eventType,
      status: ApiEventStatus.IN_PROGRESS,
      spinner: true,
      targetId: id,
    });

    const response = await apiClient.get<MemberResponseDto>(`members/${id}`);

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
 * Create new member
 */
export const createMember = async (
  data: MemberCreationDto
): Promise<MemberDto | null> => {
  const eventType = ApiEventType.CREATE_MEMBER;

  try {
    sendEvent({
      type: eventType,
      status: ApiEventStatus.IN_PROGRESS,
      spinner: true,
    });

    const response = await apiClient.post<MemberResponseDto>('members', data);

    sendEvent({
      type: eventType,
      status: ApiEventStatus.COMPLETED,
      message: Messages.MESSAGE_MEMBER_CREATED,
      toast: true,
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
    });

    return null;
  }
};

/**
 * Create cell member
 */
export const createCellMember = async (
  data: MemberCreationDto
): Promise<MemberDto | null> => {
  const eventType = ApiEventType.CREATE_MEMBER;

  try {
    sendEvent({
      type: eventType,
      status: ApiEventStatus.IN_PROGRESS,
      spinner: true,
    });

    const response = await apiClient.post<MemberResponseDto>(
      'members/cell-member',
      data
    );

    sendEvent({
      type: eventType,
      status: ApiEventStatus.COMPLETED,
      message: Messages.MESSAGE_MEMBER_CREATED,
      toast: true,
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
    });

    return null;
  }
};

/**
 * Update existing member
 */
export const updateMember = async (
  id: string,
  data: Partial<MemberCreationDto>
): Promise<MemberDto | null> => {
  const eventType = ApiEventType.UPDATE_MEMBER;

  try {
    sendEvent({
      type: eventType,
      status: ApiEventStatus.IN_PROGRESS,
      spinner: true,
      targetId: id,
    });

    const response = await apiClient.patch<MemberResponseDto>(
      `members/${id}`,
      data
    );

    sendEvent({
      type: eventType,
      status: ApiEventStatus.COMPLETED,
      message: Messages.MESSAGE_MEMBER_UPDATED,
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

/**
 * Delete member
 */
export const deleteMember = async (id: string): Promise<boolean> => {
  const eventType = ApiEventType.DELETE_MEMBER;

  try {
    sendEvent({
      type: eventType,
      status: ApiEventStatus.IN_PROGRESS,
      spinner: true,
      targetId: id,
    });

    await apiClient.delete(`members/${id}`);

    sendEvent({
      type: eventType,
      status: ApiEventStatus.COMPLETED,
      message: Messages.MESSAGE_MEMBER_DELETED,
      toast: true,
      targetId: id,
    });

    return true;
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

    return false;
  }
};

// Export as service object
export const memberService = {
  getMembers,
  getMemberById,
  createMember,
  createCellMember,
  updateMember,
  deleteMember,
};
