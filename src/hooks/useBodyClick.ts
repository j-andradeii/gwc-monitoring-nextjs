'use client';

import { useCallback } from 'react';

/**
 * useBodyClick Hook
 *
 * Custom hook for triggering a body click event.
 * Useful for closing dropdowns/popups that listen for outside clicks.
 */
export const useBodyClick = () => {
  const triggerBodyClick = useCallback(() => {
    // Create and dispatch a click event on the document body
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    document.body.dispatchEvent(clickEvent);
  }, []);

  return triggerBodyClick;
};

export default useBodyClick;
