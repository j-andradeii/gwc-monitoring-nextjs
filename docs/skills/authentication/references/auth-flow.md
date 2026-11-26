# Auth flow (as built, 2026-11-21)

`{api}` = `config.api.url` (`NEXT_PUBLIC_API_URL`, e.g. `…/api/v1`). Every `{api}` call carries
`X-ACCESS-TOKEN` + `X-ACCESS` (see `security`) and `credentials: 'include'`.

## API routes used (gwc-monitoring-service)

| Call in this app | API route | Guard | Notes |
|---|---|---|---|
| `apiClient.post('auth', { email, password }, { target: 'api' })` | `POST /api/v1/auth` | public, throttled 5/min | password AES-encrypted; sets both cookies; body `{ data: { access_token, refresh_token }, statusCode }` |
| `apiClient.get('self', { target: 'api' })` | `GET /api/v1/self` (alias `auth/self`) | JWT | body `{ data: SelfInformationDto, statusCode }` |
| `apiClient.post('auth/logout', {}, { target: 'api' })` | `POST /api/v1/auth/logout` | JWT | clears both cookies |
| `refreshToken()` → `POST {app}/auth/refresh` | should be `POST /api/v1/auth/refresh` | public | **drift**: wrong base URL today |

## Cookies (set by the API, never by this app)

| Cookie | Max age | Path | Flags |
|---|---|---|---|
| `ACCESS_TOKEN` | 15 min | `/` | `HttpOnly; Secure; SameSite=None` (production) / `Lax` |
| `REFRESH_TOKEN` | 7 days | `/api/v1/auth` | same |

`CONST.ACCESS_TOKEN` / `CONST.REFRESH_TOKEN` in `core/constants.ts` are these names; only `middleware.ts`
reads `ACCESS_TOKEN` (presence only).

## Error bodies

API errors: `{ data: null, statusCode, error }`. Login failures: 401 `error: 'Invalid credentials'`;
missing/invalid JWT: 401 `error: 'Unauthorized'`; refresh failures: 400 `Refresh token not provided` / 401
`Invalid or expired refresh token`. `apiClient.handleErrorResponse` reads `message` (drift) so these surface as
`'An error occurred'`; the sign-in page shows its own generic copy.

## Sequences

**Sign-in** (`app/(auth)/signin/page.tsx`)
1. `useRedirectIfAuthenticated()` → store already authenticated → `router.push(ROUTES.DASHBOARD)`.
2. Submit → `loginSchema` passes → `login(data)` → `authService.authenticate`.
3. `encrypt(password.trim())` → `POST {api}/auth` → on `response.data`, `getSelf()`.
4. `getSelf` → `GET {api}/self` → `storage.set('AUTHENTICATED_USER', …)` + `setUserInfo(data)` → `true`.
5. `router.push(returnUrl)` where `returnUrl` is the `?returnUrl=` param only if it starts with `/` and not `//`.
6. Failure → `authenticate` throws `Error(message)` → page shows "We could not sign you in…".

**Guarded page** (`guards/AuthGuard.tsx`)
1. If store has no user but `AUTHENTICATED_USER` exists → hydrate the store from it.
2. If `!isAuthenticated` → `getSelf()`; failure → `router.push(redirectTo = ROUTES.SIGNIN)`.
3. If `roles` given and the user's `church_campus_staff.role` isn't in it → `router.push(ROUTES.DASHBOARD)`.
4. While checking → `<PageSpinner label="Authenticating..." />`.

**401 on an `{api}` call** (`services/api-client.ts`)
1. Body `message === 'Expired JWT Token'` or `error === 'Unauthorized'` → `handleTokenRefresh` → `refreshToken()`;
   ok → retry the original request once; fail → `store.logout()`, `window.location.href = '/signin'`, throw
   `{ message: 'Session expired. Please login again.', status: 401 }`.
2. Any other 401 on a non-auth URL (`isAuthUrl`: contains `auth` or `token`) → same sign-out.

**Logout** (`authService.logout`, `Header` menu "Logout")
`POST {api}/auth/logout` (errors ignored) → `useUserStore.logout()` (removes `AUTHENTICATED_USER`, resets
state) → `window.location.href = '/signin'`.

## Storage keys

| Key | Written by | Holds |
|---|---|---|
| `user-storage` | Zustand `persist` in `user.store.ts` | `{ user, isAuthenticated }` |
| `AUTHENTICATED_USER` (`CONST.AUTHENTICATED_USER`) | `getSelf` | the `/self` profile JSON (duplicate) |
| `sidebar-storage` | `sidebar.store.ts` | `{ isCollapsed }` |

## Roles

`ChurchRole` (`models/enums`): `STAFF`, `MEMBER`, `PASTOR`, `SENIOR_PASTOR`, `PRIMARY`.
`useAuth`: `isStaffOrAbove` = STAFF/PASTOR/SENIOR_PASTOR · `isPastorOrAbove` = PASTOR/SENIOR_PASTOR ·
`isSeniorPastor` = SENIOR_PASTOR.

## Platform admin portal (spec 006)

A second, separate session flow for `/platform-admin` (platform admins of the API only):

1. `/platform-admin/signin` clears `usePlatformAdminStore` on mount, validates with `loginSchema`.
2. `platformAdminService.signIn`: `encrypt(password)` → `POST {api}/auth` → `GET {api}/platform/tenants`
   (`PlatformAdminGuard` on the API). 200 → result cached under `QUERY_KEYS.platformTenants()`, store
   `setSignedIn(email)` → `router.replace(ROUTES.PLATFORM_ADMIN)`. 403 (at login or on the check) → `POST
   auth/logout`, store cleared, "This account does not have platform admin access."; anything else → the generic
   "We could not sign you in…". `/self` is never called (a platform admin may have no church profile).
3. `(protected)/platform-admin/layout.tsx`: `<PlatformAdminGuard>` (store flag, `useSyncExternalStore` for
   hydration; none → `router.replace('/platform-admin/signin')`) + `<PlatformAdminShell>`.
4. A 403 from `usePlatformTenants` later → `platformAdminService.signOut()`; a 401 → `apiClient` with
   `signInPath: '/platform-admin/signin'`. Header "Sign out" → `signOut()` (logout API, store cleared, full
   navigation to the portal sign-in).

Storage key `platform-admin-storage` → `{ email, isAuthenticated }`. Both admins share the API's cookies: signing
into one replaces the other's session in the same browser.
