'use client';

import { useEffect } from 'react';

/**
 * Adds `is-scrolling` to <html> while the user is actively scrolling (anywhere,
 * including nested scroll containers), and removes it a short moment after
 * scrolling stops. The scrollbar CSS in globals.css keeps the thumb fully
 * transparent at rest and only reveals a thin pill while `is-scrolling` is set —
 * i.e. macOS/iOS-style "thumb only when scrolling", independent of the OS
 * "Show scroll bars" setting. Renders nothing.
 */
export function ScrollbarAutoHide() {
  useEffect(() => {
    const root = document.documentElement;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const onScroll = () => {
      root.classList.add('is-scrolling');
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => root.classList.remove('is-scrolling'), 800);
    };

    // capture:true so scrolls inside any nested scroll container are caught too
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener('scroll', onScroll, { capture: true } as EventListenerOptions);
      if (timer) clearTimeout(timer);
      root.classList.remove('is-scrolling');
    };
  }, []);

  return null;
}

export default ScrollbarAutoHide;
