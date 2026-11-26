import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/query-keys';
import { fetchPlatformTenants, signOut } from '@/services/platform-admin.service';
import type { ApiError } from '@/services/api-client';

/**
 * Every tenant with its churches and campuses (platform admins only). A 403 means the login lost its
 * platform-admin grant: the portal signs out instead of showing an error.
 */
export const usePlatformTenants = () => {
  const query = useQuery({
    queryKey: QUERY_KEYS.platformTenants(),
    queryFn: fetchPlatformTenants,
    // a 403 won't turn into a 200 on retry
    retry: (failureCount, error) => (error as ApiError)?.status !== 403 && failureCount < 1,
  });

  const forbidden = (query.error as ApiError | null)?.status === 403;
  useEffect(() => {
    if (forbidden) void signOut();
  }, [forbidden]);

  return query;
};
