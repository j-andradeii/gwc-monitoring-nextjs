/**
 * Next.js Middleware
 *
 * Handles route protection and authentication checks
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CONST, ROUTES } from '@/core/constants';

/**
 * Protected routes that require authentication
 */
const PROTECTED_ROUTES = [
  '/church-campus-admin',
];

/**
 * Auth routes - redirect to dashboard if already authenticated
 */
const AUTH_ROUTES = [
  '/signin',
  '/signup',
  '/forgot-password',
];

/**
 * Public routes - no authentication required
 */
const PUBLIC_ROUTES = [
  '/',
  '/sermon-notes',
  '/about',
  '/contact',
];

/**
 * Check if path matches any pattern
 */
const matchesRoute = (path: string, routes: string[]): boolean => {
  return routes.some((route) => {
    if (route === '/') return path === '/';
    return path === route || path.startsWith(route + '/');
  });
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookies
  const token = request.cookies.get(CONST.ACCESS_TOKEN)?.value;
  const isAuthenticated = !!token;

  // Check if it's a protected route
  if (matchesRoute(pathname, PROTECTED_ROUTES)) {
    if (!isAuthenticated) {
      // Redirect to signin with return URL
      const signinUrl = new URL(ROUTES.SIGNIN, request.url);
      signinUrl.searchParams.set('returnUrl', pathname);
      return NextResponse.redirect(signinUrl);
    }
  }

  // Check if it's an auth route and user is already authenticated
  if (matchesRoute(pathname, AUTH_ROUTES)) {
    if (isAuthenticated) {
      // Redirect to dashboard
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
    }
  }

  // Continue to the route
  return NextResponse.next();
}

/**
 * Configure which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|images|api).*)',
  ],
};
