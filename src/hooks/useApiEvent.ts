/**
 * useApiEvent Hook
 *
 * Custom hook for subscribing to API events
 */

'use client';

import { useEffect, useCallback, useRef } from 'react';
import {
  useApiEventStore,
  ApiEventType,
  ApiEventStatus,
  type ApiEvent,
} from '@/stores/event.store';

interface UseApiEventOptions {
  /** Only trigger for specific target IDs */
  targetId?: string;
  /** Only trigger for specific statuses */
  statuses?: ApiEventStatus[];
  /** Auto-unsubscribe when component unmounts (default: true) */
  autoUnsubscribe?: boolean;
}

/**
 * Hook to subscribe to specific API event types
 */
export const useApiEvent = (
  eventType: ApiEventType,
  callback: (event: ApiEvent) => void,
  options: UseApiEventOptions = {}
) => {
  const { subscribe } = useApiEventStore();
  const callbackRef = useRef(callback);
  const { targetId, statuses, autoUnsubscribe = true } = options;

  // Keep callback ref updated
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleEvent = (event: ApiEvent | null) => {
      // Filter out null events and wrong event types
      if (!event || event.type !== eventType) {
        return;
      }

      // Filter by target ID if specified
      if (targetId && event.targetId !== targetId) {
        return;
      }

      // Filter by status if specified
      if (statuses && !statuses.includes(event.status)) {
        return;
      }

      callbackRef.current(event);
    };

    const unsubscribe = subscribe(handleEvent);

    return () => {
      if (autoUnsubscribe) {
        unsubscribe();
      }
    };
  }, [eventType, subscribe, targetId, statuses, autoUnsubscribe]);
};

/**
 * Hook to subscribe to multiple API event types
 */
export const useApiEvents = (
  eventTypes: ApiEventType[],
  callback: (event: ApiEvent) => void,
  options: UseApiEventOptions = {}
) => {
  const { subscribe } = useApiEventStore();
  const callbackRef = useRef(callback);
  const { targetId, statuses, autoUnsubscribe = true } = options;

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleEvent = (event: ApiEvent | null) => {
      // Filter out null events and wrong event types
      if (!event || !eventTypes.includes(event.type)) {
        return;
      }

      if (targetId && event.targetId !== targetId) {
        return;
      }

      if (statuses && !statuses.includes(event.status)) {
        return;
      }

      callbackRef.current(event);
    };

    const unsubscribe = subscribe(handleEvent);

    return () => {
      if (autoUnsubscribe) {
        unsubscribe();
      }
    };
  }, [eventTypes, subscribe, targetId, statuses, autoUnsubscribe]);
};

/**
 * Hook to get event sender function
 */
export const useSendEvent = () => {
  const { sendEvent } = useApiEventStore();
  return sendEvent;
};

/**
 * Hook to track loading state for a specific event type
 */
export const useEventLoading = (eventType: ApiEventType) => {
  const currentEvent = useApiEventStore((state) => state.currentEvent);

  return (
    currentEvent?.type === eventType &&
    currentEvent?.status === ApiEventStatus.IN_PROGRESS
  );
};

/**
 * Hook to get the last event for a specific type
 */
export const useLastEvent = (eventType: ApiEventType) => {
  const currentEvent = useApiEventStore((state) => state.currentEvent);
  return currentEvent?.type === eventType ? currentEvent : null;
};

/**
 * Hook for handling API operation completion
 * Useful for triggering actions after operations complete
 */
export const useOnApiComplete = (
  eventType: ApiEventType,
  onComplete: (event: ApiEvent) => void,
  options: { targetId?: string } = {}
) => {
  useApiEvent(
    eventType,
    (event) => {
      if (
        event.status === ApiEventStatus.COMPLETED ||
        event.status === ApiEventStatus.ERROR
      ) {
        onComplete(event);
      }
    },
    {
      ...options,
      statuses: [ApiEventStatus.COMPLETED, ApiEventStatus.ERROR],
    }
  );
};

/**
 * Hook for handling API operation success
 */
export const useOnApiSuccess = (
  eventType: ApiEventType,
  onSuccess: (event: ApiEvent) => void,
  options: { targetId?: string } = {}
) => {
  useApiEvent(eventType, onSuccess, {
    ...options,
    statuses: [ApiEventStatus.COMPLETED],
  });
};

/**
 * Hook for handling API operation errors
 */
export const useOnApiError = (
  eventType: ApiEventType,
  onError: (event: ApiEvent) => void,
  options: { targetId?: string } = {}
) => {
  useApiEvent(eventType, onError, {
    ...options,
    statuses: [ApiEventStatus.ERROR],
  });
};

// Re-export types for convenience
export { ApiEventType, ApiEventStatus };
export type { ApiEvent };
