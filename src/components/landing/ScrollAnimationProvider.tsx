'use client';

import { useEffect, useRef, ReactNode, useState, useCallback } from 'react';
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
          // Use requestAnimationFrame for smoother scrolling
          requestAnimationFrame(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
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

  // Optimized IntersectionObserver for scroll animations
  useEffect(() => {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (!animatedElements.length) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Immediately show all elements without animation
      animatedElements.forEach((element) => {
        element.classList.add('animate-visible');
      });
      return;
    }

    // Optimized observer options for mobile performance
    const observerOptions: IntersectionObserverInit = {
      root: null,
      // Smaller negative margin triggers earlier, reducing visual pop-in
      rootMargin: '0px 0px -50px 0px',
      // Single threshold is more performant
      threshold: 0.15,
    };

    // Batch DOM updates with requestAnimationFrame for smoother performance
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const elementsToAnimate: Element[] = [];

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          elementsToAnimate.push(entry.target);
          observerRef.current?.unobserve(entry.target);
        }
      });

      if (elementsToAnimate.length > 0) {
        requestAnimationFrame(() => {
          elementsToAnimate.forEach((element) => {
            element.classList.add('animate-visible');
          });
        });
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, observerOptions);

    // Observe elements
    animatedElements.forEach((element) => {
      observerRef.current?.observe(element);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return <>{children}</>;
}
