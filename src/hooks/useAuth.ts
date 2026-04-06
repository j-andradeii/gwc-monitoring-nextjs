/**
 * useAuth Hook
 *
 * Custom hook for authentication state and actions
 * Note: Tokens are managed via httpOnly cookies (set by backend)
 */

'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/user.store';
import { useLoadingStore } from '@/stores/loading.store';
import { authService } from '@/services/auth.service';
import { ROUTES } from '@/core/constants';
import type { LoginCredentials } from '@/models/auth.types';

/**
 * Authentication hook providing auth state and actions
 */
export const useAuth = () => {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
  } = useUserStore();
  const { isLoading, setLoading } = useLoadingStore();

  /**
   * Login with credentials
   */
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      setLoading(true);
      try {
        const success = await authService.authenticate(credentials);
        // if (success) {
        //   router.push(ROUTES.DASHBOARD);
        // }
        return success;
      } finally {
        setLoading(false);
      }
    },
    [router, setLoading]
  );

  /**
   * Logout and redirect
   */
  const logout = useCallback(() => {
    authService.logout();
  }, []);

  /**
   * Refresh user data
   */
  const refreshUserData = useCallback(async (): Promise<boolean> => {
    return await authService.getSelf();
  }, []);

  /**
   * Check if user has any of the specified roles
   */
  const hasRole = useCallback(
    (roles: string[]): boolean => {
      return authService.hasRole(roles);
    },
    []
  );

  /**
   * Get current user role
   */
  const getUserRole = useCallback((): string | undefined => {
    return authService.getUserRole();
  }, []);

  /**
   * Get user's church campus ID
   */
  const getChurchCampusId = useCallback((): string | undefined => {
    return user?.church_campus_staff?.church_campus?.id;
  }, [user]);

  /**
   * Get user's church ID
   */
  const getChurchId = useCallback((): string | undefined => {
    return user?.church_campus_staff?.church_campus?.church?.id;
  }, [user]);

  /**
   * Check if user is staff level or above
   */
  const isStaffOrAbove = useCallback((): boolean => {
    return hasRole(['STAFF', 'PASTOR', 'SENIOR_PASTOR']);
  }, [hasRole]);

  /**
   * Check if user is pastor level or above
   */
  const isPastorOrAbove = useCallback((): boolean => {
    return hasRole(['PASTOR', 'SENIOR_PASTOR']);
  }, [hasRole]);

  /**
   * Check if user is senior pastor
   */
  const isSeniorPastor = useCallback((): boolean => {
    return hasRole(['SENIOR_PASTOR']);
  }, [hasRole]);

  return {
    // State (tokens are in httpOnly cookies, not exposed to JS)
    user,
    isAuthenticated,
    isLoading,
    // Actions
    login,
    logout,
    refreshUserData,
    // Role helpers
    hasRole,
    getUserRole,
    getChurchCampusId,
    getChurchId,
    isStaffOrAbove,
    isPastorOrAbove,
    isSeniorPastor,
  };
};

/**
 * Hook to require authentication
 * Redirects to signin if not authenticated
 */
export const useRequireAuth = (redirectUrl?: string) => {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();
  const { isLoading } = useLoadingStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectUrl || ROUTES.SIGNIN);
    }
  }, [isAuthenticated, isLoading, router, redirectUrl]);

  return { isAuthenticated, isLoading };
};

/**
 * Hook to redirect authenticated users
 * Useful for signin/signup pages
 */
export const useRedirectIfAuthenticated = (redirectUrl?: string) => {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();
  const { isLoading } = useLoadingStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectUrl || ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, isLoading, router, redirectUrl]);

  return { isAuthenticated, isLoading };
};  
