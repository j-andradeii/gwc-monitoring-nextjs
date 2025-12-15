'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface ScrollAnimationProviderProps {
  children: ReactNode;
}

export function ScrollAnimationProvider({ children }: ScrollAnimationProviderProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);

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
