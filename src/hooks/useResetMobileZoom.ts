'use client';

import { useEffect } from 'react';

/**
 * Resets iOS Safari zoom when an input loses focus.
 * When a user taps an input, iOS Safari zooms in if the font size is < 16px.
 * This hook temporarily forces a 1.0 maximum-scale on blur to reset the zoom.
 */
export function useResetMobileZoom() {
  useEffect(() => {
    const handleFocusOut = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT'
      ) {
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta) {
          const originalContent = viewportMeta.getAttribute('content');
          // Force a maximum-scale to zoom out
          viewportMeta.setAttribute(
            'content',
            'width=device-width, initial-scale=1, maximum-scale=1'
          );
          // Restore the original content shortly after so user can manually zoom again if needed
          setTimeout(() => {
            if (originalContent) {
              viewportMeta.setAttribute('content', originalContent);
            }
          }, 300);
        }
      }
    };

    document.addEventListener('focusout', handleFocusOut);
    return () => document.removeEventListener('focusout', handleFocusOut);
  }, []);
}
