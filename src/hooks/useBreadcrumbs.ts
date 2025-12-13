/**
 * useBreadcrumbs Hook
 *
 * Custom hook for managing breadcrumb navigation
 */

'use client';

import { useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useBreadcrumbsStore, type BreadcrumbItem } from '@/stores/breadcrumbs.store';
import { ROUTES } from '@/core/constants';

/**
 * Route to breadcrumb label mapping
 */
const ROUTE_LABELS: Record<string, string> = {
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.CHURCH_DETAIL]: 'Church Detail',
  [ROUTES.CHURCH_INFO]: 'Church Info',
  [ROUTES.PASTORAL_STAFFS]: 'Pastoral Staffs',
  [ROUTES.CHURCH_CONFIG]: 'Church Config',
  [ROUTES.CHURCH_MEMBERS]: 'Church Members',
  [ROUTES.MEN_NETWORK]: 'Men Network',
  [ROUTES.WOMEN_NETWORK]: 'Women Network',
  [ROUTES.CREATE_MEMBER]: 'Create Member',
  [ROUTES.CHURCH_CAMPAIGNS]: 'Campaigns',
};

/**
 * Generate breadcrumbs from pathname
 */
const generateBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  // Always start with home/dashboard for admin routes
  if (pathname.startsWith('/church-campus-admin')) {
    breadcrumbs.push({
      label: 'Home',
      url: ROUTES.DASHBOARD,
      icon: 'pi pi-home',
    });
  }

  let currentPath = '';

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;

    // Skip the base admin segment
    if (segment === 'church-campus-admin') {
      continue;
    }

    // Check if this is a dynamic segment (UUID or ID)
    const isDynamicSegment = /^[0-9a-f-]{36}$/.test(segment) || /^\d+$/.test(segment);

    if (isDynamicSegment) {
      // For dynamic segments, use a generic label or skip
      breadcrumbs.push({
        label: 'Details',
        url: currentPath,
      });
    } else {
      // Use mapped label or format segment
      const label =
        ROUTE_LABELS[currentPath] ||
        segment
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

      breadcrumbs.push({
        label,
        url: currentPath,
      });
    }
  }

  return breadcrumbs;
};

/**
 * Hook for automatic breadcrumb management based on route
 */
export const useBreadcrumbs = (customBreadcrumbs?: BreadcrumbItem[]) => {
  const pathname = usePathname();
  const { items, setItems, addItem, clearItems } = useBreadcrumbsStore();

  // Auto-generate breadcrumbs on route change
  useEffect(() => {
    if (customBreadcrumbs) {
      setItems(customBreadcrumbs);
    } else {
      const generated = generateBreadcrumbs(pathname);
      setItems(generated);
    }
  }, [pathname, customBreadcrumbs, setItems]);

  return {
    breadcrumbs: items,
    setBreadcrumbs: setItems,
    addBreadcrumb: addItem,
    clearBreadcrumbs: clearItems,
  };
};

/**
 * Hook for manually setting breadcrumbs
 */
export const useSetBreadcrumbs = () => {
  const { setItems, addItem, clearItems } = useBreadcrumbsStore();

  const setPageBreadcrumbs = useCallback(
    (items: BreadcrumbItem[]) => {
      setItems(items);
    },
    [setItems]
  );

  const appendBreadcrumb = useCallback(
    (item: BreadcrumbItem) => {
      addItem(item);
    },
    [addItem]
  );

  return {
    setPageBreadcrumbs,
    appendBreadcrumb,
    clearBreadcrumbs: clearItems,
  };
};

/**
 * Hook for page-specific breadcrumb configuration
 * Usage: usePageBreadcrumbs('Member Details', { icon: 'pi pi-user' })
 */
export const usePageBreadcrumbs = (
  pageLabel: string,
  options?: { icon?: string; replace?: boolean }
) => {
  const pathname = usePathname();
  const { setItems, addItem, items } = useBreadcrumbsStore();

  useEffect(() => {
    if (options?.replace) {
      // Replace all with just home and this page
      setItems([
        {
          label: 'Home',
          url: ROUTES.DASHBOARD,
          icon: 'pi pi-home',
        },
        {
          label: pageLabel,
          url: pathname,
          icon: options.icon,
        },
      ]);
    } else {
      // Append to existing
      const generated = generateBreadcrumbs(pathname);
      // Replace last item with custom label
      if (generated.length > 0) {
        generated[generated.length - 1] = {
          label: pageLabel,
          url: pathname,
          icon: options?.icon,
        };
      }
      setItems(generated);
    }
  }, [pathname, pageLabel, options?.icon, options?.replace, setItems]);

  return items;
};

// Re-export types
export type { BreadcrumbItem };
