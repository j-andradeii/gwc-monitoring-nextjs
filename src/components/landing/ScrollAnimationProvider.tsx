'use client';

import { useEffect, useRef, ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';

interface ScrollAnimationProviderProps {
  children: ReactNode;
}

export function ScrollAnimationProvider({ children }: ScrollAnimationProviderProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const pathname = usePathname();
  const [hash, setHash] = useState('');

  // Track hash changes
  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);

    // Set initial hash
    updateHash();

    // Listen for hash changes
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, []);

  // Handle scroll on route/hash change - either to hash section or to top
  useEffect(() => {
    const currentHash = window.location.hash;

    if (currentHash) {
      // If there's a hash, scroll to that element
      const scrollToHash = () => {
        const element = document.querySelector(currentHash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      // Delay to ensure DOM is ready after navigation
      const timeoutId = setTimeout(scrollToHash, 100);
      return () => clearTimeout(timeoutId);
    } else {
      // No hash - scroll to top (with iOS Safari fix)
      const scrollToTop = () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      };

      scrollToTop();
      const timeoutId = setTimeout(scrollToTop, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [pathname, hash]);

  useEffect(() => {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (!animatedElements.length) return;

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
          observerRef.current?.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach((element) => {
      observerRef.current?.observe(element);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return <>{children}</>;
}
