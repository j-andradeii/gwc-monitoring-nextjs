/**
 * PlatformAdminGuard
 *
 * Gate for the platform admin portal (/platform-admin). Renders children only when the portal store says a
 * platform admin signed in; otherwise replaces the URL with the portal's sign-in page. This is UX only: the API
 * enforces PlatformAdminGuard on every /platform route, and a 403 there signs the portal out
 * (usePlatformTenants).
 */

'use client';

import React, { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { PageSpinner } from '@/components/ui/Spinner';
import { ROUTES } from '@/core/constants';
import {
  selectPlatformAdminIsAuthenticated,
  usePlatformAdminStore,
} from '@/stores/platform-admin.store';

const subscribeToHydration = (onChange: () => void) =>
  usePlatformAdminStore.persist.onFinishHydration(onChange);

export function PlatformAdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = usePlatformAdminStore(selectPlatformAdminIsAuthenticated);
  // the persisted store is read on the client only: the server snapshot is "not hydrated" (spinner)
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    () => usePlatformAdminStore.persist.hasHydrated(),
    () => false
  );

  useEffect(() => {
    if (hydrated && !isAuthenticated) router.replace(ROUTES.PLATFORM_ADMIN_SIGNIN);
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated || !isAuthenticated) {
    return <PageSpinner label="Checking access..." />;
  }
  return <>{children}</>;
}

export default PlatformAdminGuard;
