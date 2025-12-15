/**
 * Toast Component
 *
 * Toast notification system using PrimeReact Toast
 */

'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { Toast as PrimeToast } from 'primereact/toast';
import { useApiEventStore, ApiEventStatus, type ApiEvent } from '@/stores/event.store';

export type ToastSeverity = 'success' | 'info' | 'warn' | 'error';

export interface ToastMessage {
  severity: ToastSeverity;
  summary: string;
  detail?: string;
  life?: number;
  sticky?: boolean;
  closable?: boolean;
}

/**
 * Global toast reference for imperative calls
 */
let globalToastRef: PrimeToast | null = null;

/**
 * Show toast message imperatively
 */
export const showToast = (message: ToastMessage) => {
  if (globalToastRef) {
    globalToastRef.show({
      severity: message.severity,
      summary: message.summary,
      detail: message.detail,
      life: message.life || 3000,
      sticky: message.sticky,
      closable: message.closable !== false,
    });
  }
};

/**
 * Show success toast
 */
export const showSuccess = (summary: string, detail?: string) => {
  showToast({ severity: 'success', summary, detail });
};

/**
 * Show error toast
 */
export const showError = (summary: string, detail?: string) => {
  showToast({ severity: 'error', summary, detail, life: 5000 });
};

/**
 * Show warning toast
 */
export const showWarning = (summary: string, detail?: string) => {
  showToast({ severity: 'warn', summary, detail });
};

/**
 * Show info toast
 */
export const showInfo = (summary: string, detail?: string) => {
  showToast({ severity: 'info', summary, detail });
};

/**
 * Clear all toasts
 */
export const clearToasts = () => {
  if (globalToastRef) {
    globalToastRef.clear();
  }
};

export interface ToastProviderProps {
  /** Position of toast notifications */
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
    | 'center';
  /** Children components */
  children?: React.ReactNode;
}

/**
 * Toast Provider Component
 * Renders the toast container and listens to API events
 */
export function ToastProvider({
  position = 'top-right',
  children,
}: ToastProviderProps) {
  const toastRef = useRef<PrimeToast>(null);
  const { subscribe } = useApiEventStore();

  // Set global ref
  useEffect(() => {
    if (toastRef.current) {
      globalToastRef = toastRef.current;
    }
    return () => {
      globalToastRef = null;
    };
  }, []);

  // Handle API events
  const handleApiEvent = useCallback((event: ApiEvent | null) => {
    if (!event || !event.toast || !toastRef.current) return;

    let severity: ToastSeverity = 'info';

    switch (event.status) {
      case ApiEventStatus.COMPLETED:
        severity = 'success';
        break;
      case ApiEventStatus.ERROR:
        severity = 'error';
        break;
      case ApiEventStatus.IN_PROGRESS:
        severity = 'info';
        break;
      default:
        severity = 'info';
    }

    toastRef.current.show({
      severity,
      summary: event.title || (severity === 'success' ? 'Success' : 'Error'),
      detail: event.message,
      life: severity === 'error' ? 5000 : 3000,
    });
  }, []);

  // Subscribe to all API events
  useEffect(() => {
    const unsubscribe = subscribe(handleApiEvent);
    return () => {
      unsubscribe();
    };
  }, [subscribe,  ]);

  return (
    <>
      <PrimeToast ref={toastRef} position={position} />
      {children}
    </>
  );
}

/**
 * Standalone Toast Component
 * Use when you need a separate toast instance
 */
export function Toast({
  position = 'top-right',
}: {
  position?: ToastProviderProps['position'];
}) {
  const toastRef = useRef<PrimeToast>(null);

  return <PrimeToast ref={toastRef} position={position} />;
}

export default ToastProvider;
