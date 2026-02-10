/**
 * Next.js Middleware
 *
 * Handles route protection and authentication checks
 * Reads ACCESS_TOKEN from httpOnly cookies (set by backend)
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

/**
 * Route redirects - instant redirects at the edge level
 * Note: /give no longer redirects since we removed tabs and use sectional layout
 */
const ROUTE_REDIRECTS: Record<string, string> = {
  // Empty - no redirects needed currently
};

// Security Headers - Calculated once at module load
const CSP_HEADER = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' blob: data: https://*.vercel-storage.com https://placehold.co https://img.youtube.com https://i.ytimg.com;
  connect-src 'self' https://*.vercel-storage.com;
  font-src 'self' https://fonts.gstatic.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  frame-src 'self' https://www.youtube.com https://youtube.com https://player.vimeo.com;
  upgrade-insecure-requests;
`;

const CONTENT_SECURITY_POLICY_HEADER_VALUE = CSP_HEADER
  .replace(/\s{2,}/g, ' ')
  .trim();

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle instant redirects first (before any other processing)
  if (ROUTE_REDIRECTS[pathname]) {
    return NextResponse.redirect(new URL(ROUTE_REDIRECTS[pathname], request.url));
  }

  // Get token from httpOnly cookies (set by backend)
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
  const response = NextResponse.next();

  // Security Headers


  // 1. Content-Security-Policy (CSP)
  response.headers.set(
    'Content-Security-Policy',
    CONTENT_SECURITY_POLICY_HEADER_VALUE
  );

  // 2. Strict-Transport-Security (HSTS)
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

  // 3. X-Frame-Options
  response.headers.set('X-Frame-Options', 'DENY');

  // 4. X-Content-Type-Options
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // 5. Referrer-Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 6. Permissions-Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  // 7. Cross-Origin-Opener-Policy (COOP)
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');

  return response;
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
    '/((?!_next/static|_next/image|favicon.ico|assets|images|api).*)',
  ],
};
