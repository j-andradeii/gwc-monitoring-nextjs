/**
 * API Event Store
 *
 * Pub/Sub system for API event communication between services and components
 */

import { create } from 'zustand';

// Event status enum
export enum ApiEventStatus {
  DEFAULT = 0,
  IN_PROGRESS = 1,
  COMPLETED = 2,
  ERROR = 3,
}

// Event type enum
export enum ApiEventType {
  DEFAULT = 0,
  AUTHENTICATION = 1,
  GET_AUTHENTICATED_SELF = 2,
  REFRESH_TOKEN = 3,
  CREATE_MEMBER = 4,
  UPDATE_MEMBER = 5,
  DELETE_MEMBER = 6,
  GET_MEMBERS = 7,
  GET_MEMBER = 8,
  GET_CHURCHES = 9,
  GET_CHURCH = 10,
  GET_CHURCH_CAMPUS = 11,
  GET_CHURCH_CAMPUS_STAFFS = 12,
  UPDATE_CHURCH_CAMPUS = 13,
  GET_CAMPAIGNS = 14,
  CREATE_CAMPAIGN = 15,
  UPDATE_CAMPAIGN = 16,
  DELETE_CAMPAIGN = 17,
}

// Event interface
export interface ApiEvent {
  type: ApiEventType;
  status: ApiEventStatus;
  title?: string;
  message?: string;
  spinner?: boolean;
  popup?: boolean;
  toast?: boolean;
  targetId?: string | number;
}

// Subscriber callback type
type EventCallback = (event: ApiEvent | null) => void;

interface ApiEventStore {
  currentEvent: ApiEvent | null;
  subscribers: EventCallback[];
  sendEvent: (event: ApiEvent) => void;
  subscribe: (callback: EventCallback) => () => void;
  clearEvent: () => void;
}

export const useApiEventStore = create<ApiEventStore>((set, get) => ({
  currentEvent: null,
  subscribers: [],

  sendEvent: (event: ApiEvent) => {
    set({ currentEvent: event });
    // Notify all subscribers
    get().subscribers.forEach((callback) => callback(event));
  },

  subscribe: (callback: EventCallback) => {
    set((state) => ({
      subscribers: [...state.subscribers, callback],
    }));

    // Return unsubscribe function
    return () => {
      set((state) => ({
        subscribers: state.subscribers.filter((cb) => cb !== callback),
      }));
    };
  },

  clearEvent: () => set({ currentEvent: null }),
}));

// Helper to create events
export const createApiEvent = (
  type: ApiEventType,
  status: ApiEventStatus,
  options?: Partial<Omit<ApiEvent, 'type' | 'status'>>
): ApiEvent => ({
  type,
  status,
  ...options,
});

// Selectors
export const selectCurrentEvent = (state: ApiEventStore) => state.currentEvent;
export const selectIsLoading = (state: ApiEventStore) =>
  state.currentEvent?.status === ApiEventStatus.IN_PROGRESS;
