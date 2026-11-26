/**
 * Platform Admin Service
 *
 * Sign-in and sign-out for the platform admin portal (/platform-admin). The API decides who is a platform
 * admin: after the normal login, `GET platform/tenants` answers 200 only for a login in identity.platform_admin
 * (403 `Platform admin only` otherwise). A refused login is signed out again so no session is left behind.
 */

import { apiClient, type ApiError } from './api-client';
import { encrypt } from '@/core/crypto';
import { ROUTES } from '@/core/constants';
import { queryClient } from '@/lib/query-client';
import { QUERY_KEYS } from '@/lib/query-keys';
import { usePlatformAdminStore } from '@/stores/platform-admin.store';
import type { AuthenticatedTokenResponse, LoginCredentials } from '@/models/auth.types';
import type { PlatformTenantListResponseDto } from '@/models/platform-admin.types';

/** Why a sign-in failed: the page picks the copy, never the API's raw message. */
export type PlatformSignInFailure = 'invalid-credentials' | 'not-platform-admin';

export class PlatformSignInError extends Error {
  constructor(public readonly reason: PlatformSignInFailure) {
    super(reason);
    this.name = 'PlatformSignInError';
  }
}

/** Options every portal call passes: the external API, and the portal's own sign-in page on session expiry. */
export const PLATFORM_API_OPTIONS = {
  target: 'api',
  signInPath: ROUTES.PLATFORM_ADMIN_SIGNIN,
} as const;

export const fetchPlatformTenants = () =>
  apiClient.get<PlatformTenantListResponseDto>('platform/tenants', PLATFORM_API_OPTIONS);

const isForbidden = (error: unknown) => (error as ApiError | undefined)?.status === 403;

/** Clears the API cookies (errors ignored) and the portal's local state. */
const clearSession = async (): Promise<void> => {
  try {
    await apiClient.post('auth/logout', {}, PLATFORM_API_OPTIONS);
  } catch {
    // the local state is cleared either way
  }
  usePlatformAdminStore.getState().clear();
  queryClient.removeQueries({ queryKey: QUERY_KEYS.platformTenants() });
};

/**
 * Logs in, then checks platform-admin access. Resolves when the login is a platform admin (the tenant list is
 * cached for the directory); throws PlatformSignInError otherwise.
 */
export const signIn = async (credentials: LoginCredentials): Promise<void> => {
  const email = credentials.email.trim();
  try {
    const encryptedPassword = await encrypt(credentials.password.trim());
    const response = await apiClient.post<AuthenticatedTokenResponse>(
      'auth',
      { email, password: encryptedPassword },
      PLATFORM_API_OPTIONS
    );
    if (!response.data) throw new Error('No tokens');
  } catch (error) {
    // 403 at login: a valid login with no church access and no platform-admin grant
    if (isForbidden(error)) throw new PlatformSignInError('not-platform-admin');
    throw new PlatformSignInError('invalid-credentials');
  }

  try {
    const tenants = await fetchPlatformTenants();
    queryClient.setQueryData(QUERY_KEYS.platformTenants(), tenants);
  } catch (error) {
    await clearSession();
    throw new PlatformSignInError(
      isForbidden(error) ? 'not-platform-admin' : 'invalid-credentials'
    );
  }

  usePlatformAdminStore.getState().setSignedIn(email);
};

/** Header "Sign out", and a 403 from the directory (access revoked): full reset to the portal's sign-in. */
export const signOut = async (): Promise<void> => {
  await clearSession();
  if (typeof window !== 'undefined') {
    window.location.href = ROUTES.PLATFORM_ADMIN_SIGNIN;
  }
};

export const platformAdminService = { signIn, signOut, fetchPlatformTenants };
