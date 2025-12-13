/**
 * AuthGuard Component
 *
 * Client-side route protection component
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/user.store';
import { useLoadingStore } from '@/stores/loading.store';
import { authService } from '@/services/auth.service';
import { ROUTES, CONST } from '@/core/constants';
import { storage } from '@/core/local-storage';
import { PageSpinner } from '@/components/ui/Spinner';

export interface AuthGuardProps {
  /** Children to render when authenticated */
  children: React.ReactNode;
  /** Required roles (optional) */
  roles?: string[];
  /** Fallback component while checking auth */
  fallback?: React.ReactNode;
  /** Redirect URL if not authenticated */
  redirectTo?: string;
}

/**
 * AuthGuard - Protects routes from unauthenticated access
 */
export function AuthGuard({
  children,
  roles,
  fallback,
  redirectTo = ROUTES.SIGNIN,
}: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useUserStore();
  const { isLoading, setLoading } = useLoadingStore();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setIsChecking(true);

      // Check if we have tokens in storage
      const token = storage.get(CONST.ACCESS_TOKEN);
      const storedUser = storage.get(CONST.AUTHENTICATED_USER);

      if (!token) {
        // No token, redirect to signin
        router.push(redirectTo);
        return;
      }

      // If we have stored user data, restore it
      if (storedUser && !user) {
        try {
          const userData = JSON.parse(storedUser);
          useUserStore.getState().setUserInfo(userData);
        } catch {
          // Invalid stored data, try to fetch
        }
      }

      // If not authenticated, try to get user info
      if (!isAuthenticated) {
        setLoading(true);
        const success = await authService.getSelf(false);
        setLoading(false);

        if (!success) {
          // Failed to get user info, redirect
          router.push(redirectTo);
          return;
        }
      }

      // Check role access
      if (roles && roles.length > 0) {
        const userRole = authService.getUserRole();
        if (!userRole || !roles.includes(userRole)) {
          // User doesn't have required role
          router.push(ROUTES.DASHBOARD);
          return;
        }
      }

      setIsAuthorized(true);
      setIsChecking(false);
    };

    checkAuth();
  }, [isAuthenticated, user, roles, router, redirectTo, setLoading]);

  // Still checking authentication
  if (isChecking || isLoading) {
    return fallback || <PageSpinner label="Authenticating..." />;
  }

  // Not authorized
  if (!isAuthorized) {
    return fallback || <PageSpinner label="Redirecting..." />;
  }

  // Authorized, render children
  return <>{children}</>;
}

/**
 * RoleGuard - Protects routes based on user role
 */
export function RoleGuard({
  children,
  allowedRoles,
  fallback,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
}) {
  const { user } = useUserStore();
  const userRole = user?.church_campus_staff?.role;

  if (!userRole || !allowedRoles.includes(userRole)) {
    return fallback || (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <i className="pi pi-lock text-4xl text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-500">
            You don&apos;t have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * withAuth HOC - Wraps a component with AuthGuard
 */
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: { roles?: string[]; redirectTo?: string }
) {
  return function WithAuthComponent(props: P) {
    return (
      <AuthGuard roles={options?.roles} redirectTo={options?.redirectTo}>
        <WrappedComponent {...props} />
      </AuthGuard>
    );
  };
}

/**
 * withRole HOC - Wraps a component with RoleGuard
 */
export function withRole<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles: string[]
) {
  return function WithRoleComponent(props: P) {
    return (
      <RoleGuard allowedRoles={allowedRoles}>
        <WrappedComponent {...props} />
      </RoleGuard>
    );
  };
}

export default AuthGuard;
