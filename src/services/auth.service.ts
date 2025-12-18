/**
 * Auth Service
 *
 * Handles authentication operations
 * Uses httpOnly cookies for token management (set by backend)
 */

import { apiClient } from './api-client';
import { useApiEventStore, ApiEventType, ApiEventStatus } from '@/stores/event.store';
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

const { sendEvent } = useApiEventStore.getState();

/**
 * Authenticate user with email and password
 */
export const authenticate = async (
  credentials: LoginCredentials
): Promise<boolean> => {
  const eventType = ApiEventType.AUTHENTICATION;

  try {
    sendEvent({
      type: eventType,
      status: ApiEventStatus.IN_PROGRESS,
      spinner: true,
    });

    // Encrypt password before sending
    const encryptedPassword = await encrypt(credentials.password.trim());

    const response = await apiClient.post<AuthenticatedTokenResponse>('auth', {
      email: credentials.email.trim(),
      password: encryptedPassword,
    });

    if (response.data) {
      // Note: Tokens are stored as httpOnly cookies by the backend
      // No need to store in localStorage or Zustand store

      sendEvent({
        type: eventType,
        status: ApiEventStatus.COMPLETED,
      });

      // Fetch user info (user data still stored in localStorage for quick hydration)
      await getSelf(false);

      return true;
    }

    return false;
  } catch (error) {
    const errorMessage =
      (error as { message?: string })?.message || Messages.MESSAGE_INVALID_CREDENTIALS;

    sendEvent({
      type: eventType,
      status: ApiEventStatus.ERROR,
      title: Messages.HEADER_AUTHENTICATION_FAILED_ERROR,
      message: errorMessage,
      toast: true,
    });

    return false;
  }
};

/**
 * Get authenticated user information
 */
export const getSelf = async (showToast: boolean = true): Promise<boolean> => {
  const eventType = ApiEventType.GET_AUTHENTICATED_SELF;

  try {
    sendEvent({
      type: eventType,
      status: ApiEventStatus.IN_PROGRESS,
      spinner: true,
    });

    const response = await apiClient.get<SelfInformationResponseDto>('self');

    if (response.data) {
      // Store user info
      storage.set(CONST.AUTHENTICATED_USER, JSON.stringify(response.data));

      // Update user store
      const userStore = useUserStore.getState();
      userStore.setUserInfo(response.data);

      sendEvent({
        type: eventType,
        status: ApiEventStatus.COMPLETED,
        toast: showToast,
        message: showToast ? Messages.MESSAGE_LOGIN_SUCCESSFUL : undefined,
      });

      return true;
    }

    return false;
  } catch (error) {
    sendEvent({
      type: eventType,
      status: ApiEventStatus.ERROR,
      title: Messages.HEADER_GENERIC_ERROR,
      message: Messages.MESSAGE_GENERIC_ERROR,
      toast: true,
    });

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
