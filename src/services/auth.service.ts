/**
 * Auth Service
 *
 * Handles authentication operations
 * Uses httpOnly cookies for token management (set by backend)
 */

import { apiClient } from './api-client';
import { useUserStore } from '@/stores/user.store';
import { encrypt } from '@/core/crypto';
import { CONST } from '@/core/constants';
import { storage } from '@/core/local-storage';
import { Messages } from '@/core/messages';
import {
  AuthenticatedTokenResponse,
  SelfInformationResponseDto,
  LoginCredentials,
} from '@/models/auth.types';

/**
 * Authenticate user with email and password
 */
export const authenticate = async (
  credentials: LoginCredentials
): Promise<boolean> => {
  try {
    // Encrypt password before sending
    const encryptedPassword = await encrypt(credentials.password.trim());

    const response = await apiClient.post<AuthenticatedTokenResponse>('auth', {
      email: credentials.email.trim(),
      password: encryptedPassword,
    }, {target: 'api'});

    if (response.data) {
      // Note: Tokens are stored as httpOnly cookies by the backend
      // No need to store in localStorage or Zustand store

      // Fetch user info (user data still stored in localStorage for quick hydration)
      await getSelf();

      return true;
    }

    return false;
  } catch (error) {
    const errorMessage =
      (error as { message?: string })?.message || Messages.MESSAGE_INVALID_CREDENTIALS;

    // Re-throw so the calling component (e.g. useMutation onError) can handle it
    throw new Error(errorMessage);
  }
};

/**
 * Get authenticated user information
 */
export const getSelf = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get<SelfInformationResponseDto>('self');

    if (response.data) {
      // Store user info
      storage.set(CONST.AUTHENTICATED_USER, JSON.stringify(response.data));

      // Update user store
      const userStore = useUserStore.getState();
      userStore.setUserInfo(response.data);

      return true;
    }

    return false;
  } catch {
    return false;
  }
};

/**
 * Logout user
 * Calls backend to clear httpOnly cookies
 */
export const logout = async (): Promise<void> => {
  try {
    // Call backend to clear httpOnly cookies
    await apiClient.post('auth/logout', {});
  } catch {
    // Continue with logout even if API call fails
  }

  // Clear local user data
  const userStore = useUserStore.getState();
  userStore.logout();

  // Redirect to signin
  if (typeof window !== 'undefined') {
    window.location.href = '/signin';
  }
};

/**
 * Check if user is authenticated
 * Note: Actual token validation happens on the server via httpOnly cookies
 */
export const isAuthenticated = (): boolean => {
  const userStore = useUserStore.getState();
  return userStore.isAuthenticated;
};

/**
 * Get current user role
 */
export const getUserRole = (): string | undefined => {
  const userStore = useUserStore.getState();
  return userStore.user?.church_campus_staff?.role;
};

/**
 * Check if user has specific role
 */
export const hasRole = (roles: string[]): boolean => {
  const role = getUserRole();
  return role ? roles.includes(role) : false;
};

// Export as service object for consistency
export const authService = {
  authenticate,
  getSelf,
  logout,
  isAuthenticated,
  getUserRole,
  hasRole,
};
