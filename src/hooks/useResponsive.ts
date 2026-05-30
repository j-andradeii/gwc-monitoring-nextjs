/**
 * useResponsive Hook
 *
 * Custom hook for responsive design utilities
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Breakpoint definitions (matching Tailwind defaults)
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

type BreakpointKey = keyof typeof BREAKPOINTS;

/**
 * Get current window width safely
 */
const getWindowWidth = (): number => {
  if (typeof window === 'undefined') {
    return 0;
  }
  return window.innerWidth;
};

/**
 * Hook to track window dimensions
 */
export const useWindowSize = () => {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
};

/**
 * Hook to check if viewport matches a breakpoint
 */
export const useBreakpoint = (breakpoint: BreakpointKey) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const checkBreakpoint = () => {
      setMatches(getWindowWidth() >= BREAKPOINTS[breakpoint]);
    };

    checkBreakpoint();

    window.addEventListener('resize', checkBreakpoint);
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, [breakpoint]);

  return matches;
};

/**
 * Hook to get current breakpoint name
 */
export const useCurrentBreakpoint = (): BreakpointKey | 'xs' => {
  const [breakpoint, setBreakpoint] = useState<BreakpointKey | 'xs'>('xs');

  useEffect(() => {
    const getBreakpoint = (): BreakpointKey | 'xs' => {
      const width = getWindowWidth();

      if (width >= BREAKPOINTS['2xl']) return '2xl';
      if (width >= BREAKPOINTS.xl) return 'xl';
      if (width >= BREAKPOINTS.lg) return 'lg';
      if (width >= BREAKPOINTS.md) return 'md';
      if (width >= BREAKPOINTS.sm) return 'sm';
      return 'xs';
    };

    const handleResize = () => {
      setBreakpoint(getBreakpoint());
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
};

/**
 * Hook to check if device is mobile
 */
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(getWindowWidth() < BREAKPOINTS.md);
    };

    checkMobile();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

/**
 * Hook to check if device is tablet
 */
export const useIsTablet = () => {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkTablet = () => {
      const width = getWindowWidth();
      setIsTablet(width >= BREAKPOINTS.md && width < BREAKPOINTS.lg);
    };

    checkTablet();

    window.addEventListener('resize', checkTablet);
    return () => window.removeEventListener('resize', checkTablet);
  }, []);

  return isTablet;
};

/**
 * Hook to check if device is desktop
 */
export const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(getWindowWidth() >= BREAKPOINTS.lg);
    };

    checkDesktop();

    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  return isDesktop;
};

/**
 * Hook for responsive values
 * Returns different values based on current breakpoint
 */
export const useResponsiveValue = <T>(values: {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
  default: T;
}): T => {
  const breakpoint = useCurrentBreakpoint();

  const getValue = useCallback((): T => {
    // Check from largest to smallest
    if (breakpoint === '2xl' && values['2xl'] !== undefined) return values['2xl'];
    if (
      (breakpoint === '2xl' || breakpoint === 'xl') &&
      values.xl !== undefined
    )
      return values.xl;
    if (
      (breakpoint === '2xl' || breakpoint === 'xl' || breakpoint === 'lg') &&
      values.lg !== undefined
    )
      return values.lg;
    if (
      (breakpoint === '2xl' ||
        breakpoint === 'xl' ||
        breakpoint === 'lg' ||
        breakpoint === 'md') &&
      values.md !== undefined
    )
      return values.md;
    if (
      (breakpoint === '2xl' ||
        breakpoint === 'xl' ||
        breakpoint === 'lg' ||
        breakpoint === 'md' ||
        breakpoint === 'sm') &&
      values.sm !== undefined
    )
      return values.sm;
    if (values.xs !== undefined) return values.xs;
    return values.default;
  }, [breakpoint, values]);

  return getValue();
};

/**
 * Hook for media query matching
 */
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Defer initial state read to avoid synchronous setState-in-effect
    handler({ matches: mediaQuery.matches } as MediaQueryListEvent);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

/**
 * Combined responsive hook with all utilities
 */
export const useResponsive = () => {
  const windowSize = useWindowSize();
  const currentBreakpoint = useCurrentBreakpoint();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();

  return {
    windowSize,
    currentBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    breakpoints: BREAKPOINTS,
  };
};
