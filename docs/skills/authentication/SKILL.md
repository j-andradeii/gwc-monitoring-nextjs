---
name: authentication
description: |
  Authentication in gwc-monitoring-nextjs: sign-in through auth.service.ts (AES-encrypted password,
  httpOnly cookies set by gwc-monitoring-service), the /self profile in useUserStore, AuthGuard / RoleGuard /
  withAuth / withRole, the useAuth hook and its role helpers, 401 → refresh → sign-out in apiClient, logout,
  and the returnUrl redirect.

  Use when: touching the sign-in page, logout, AuthGuard or RoleGuard, useAuth, useUserStore, roles, the
  /self call, session expiry or token refresh, or protecting a new admin page.

  Keywords: signin, login, logout, authenticate, getSelf, self, SelfInformationDto, useUserStore,
  AuthGuard, RoleGuard, withAuth, withRole, useAuth, useRequireAuth, useRedirectIfAuthenticated, hasRole,
  ChurchRole, SENIOR_PASTOR, PASTOR, STAFF, returnUrl, refresh, 401, ACCESS_TOKEN, REFRESH_TOKEN
---

# Authentication: sign-in, session, guards, roles

The API owns the session: it sets `ACCESS_TOKEN` (15 min) and `REFRESH_TOKEN` (7 days) as httpOnly cookies.
The app never sees a token. What the app keeps is the **profile** from `GET /self` (`SelfInformationDto`), used
for the header, sidebar and role checks.

```
/signin ─ useAuth().login ─▶ authService.authenticate
            encrypt(password) ─▶ POST {api}/auth {email, password}   (API sets both cookies)
            ─▶ getSelf(): GET {api}/self ─▶ useUserStore.setUserInfo + localStorage AUTHENTICATED_USER
         ─▶ router.push(returnUrl | ROUTES.DASHBOARD)
/church-campus-admin/** ─ layout: <AuthGuard> ─ store says authenticated? render : getSelf() ok? render : push(/signin)
any {api} call ─ 401 ─▶ apiClient: refresh → retry, or store.logout() + window.location = /signin
Header "Logout" ─▶ authService.logout: POST {api}/auth/logout (API clears cookies) ─▶ store.logout() ─▶ /signin
```

## Files in this skill

| File | What | Load when |
|---|---|---|
| `SKILL.md` | Rules, decision guide, file map, drift, checklist | Always |
| `references/auth-flow.md` | Step-by-step flows, API routes and cookie table, error messages, storage keys | Touching sign-in, refresh, logout or guards |

## The rules

1. **Sign-in goes through `authService.authenticate` only** (via `useAuth().login`). It trims, encrypts the
   password with `encrypt()` and posts `{ email, password }` to `auth` with `target: 'api'`, then calls
   `getSelf()`. *Why:* the API decrypts the password with the shared scheme and sets the cookies on that response.
2. **The current user comes from `useUserStore`** (`user`, `isAuthenticated`, selectors `selectUser`,
   `selectUserRole`, `selectMember`) or `useAuth()` in components. Outside React use
   `useUserStore.getState()`. *Why:* one source for the profile; tokens are not available to JS.
3. **Every admin page lives under `src/app/(protected)/church-campus-admin/`**, whose layout wraps children in
   `<AuthGuard>` and `<AdminLayout>`. A new protected area outside it gets its own layout with `<AuthGuard>`.
   *Why:* `middleware.ts` does not protect `/church-campus-admin` today (see drift); the guard does.
4. **Role checks:** page-level → `<AuthGuard roles={[...]}>` or `withAuth(Component, { roles })`;
   section-level → `<RoleGuard allowedRoles={[...]}>` or `withRole`; logic → `useAuth().hasRole([...])`,
   `isStaffOrAbove()`, `isPastorOrAbove()`, `isSeniorPastor()`. Use `ChurchRole` values from
   `@/models/enums`, not new string literals. *Why:* roles come from `church_campus_staff.role` and the helpers
   already encode the hierarchy.
5. **Client role checks are UX, not security.** The API must enforce the same rule on its route. *Why:* the
   store is in `localStorage` and editable.
6. **Sign-out is `useAuth().logout` / `authService.logout`** — it calls the API to clear the cookies, then
   `useUserStore.logout()` (removes `AUTHENTICATED_USER`, resets state), then a full navigation to `/signin`.
   Don't just clear the store. *Why:* the cookies would survive and middleware would bounce `/signin` to the
   dashboard.
7. **Redirect targets are internal paths only.** Keep the sign-in page's check: `returnUrl` must start with
   `/` and not with `//`, else `ROUTES.DASHBOARD`. *Why:* open-redirect protection.
8. **Expired sessions are handled once, in `apiClient`** (401 → refresh → retry, else sign-out). Hooks and
   components don't catch 401 themselves. *Why:* one behaviour for every call (`api-client`).
9. **Login errors shown to users are generic** (`Messages.MESSAGE_INVALID_CREDENTIALS` or the sign-in page's
   copy); never echo the API's raw error. *Why:* no account enumeration.

## Decision guide

| Situation | Use | Example in this repo |
|---|---|---|
| Protect a new admin page | put it under `(protected)/church-campus-admin/` | `church-campus-admin/church-members/page.tsx` |
| Page only for pastors | `<AuthGuard roles={[ChurchRole.PASTOR, ChurchRole.SENIOR_PASTOR]}>` in that route's layout | — |
| Hide a button/section by role | `<RoleGuard allowedRoles={[...]}>` or `hasRole([...])` | `components/layout/Sidebar.tsx` (`hasRole`) |
| Show the user's name | `useAuth().user?.member` | `components/layout/Header.tsx` |
| Campus/church id for queries | `useAuth().getChurchCampusId()` / `getChurchId()` | — |
| Redirect signed-in users away | `useRedirectIfAuthenticated()` | `app/(auth)/signin/page.tsx` |

## Where things live

| Path | What |
|---|---|
| `src/services/platform-admin.service.ts`, `src/stores/platform-admin.store.ts`, `src/guards/PlatformAdminGuard.tsx`, `src/app/(auth)/platform-admin/signin/page.tsx` | platform admin portal session (spec 006; `references/auth-flow.md` "Platform admin portal") — separate from `useUserStore` |
| `src/services/auth.service.ts` | `authenticate`, `getSelf`, `logout`, `isAuthenticated`, `getUserRole`, `hasRole`, `authService` |
| `src/stores/user.store.ts` | `useUserStore` (persisted as `user-storage`), `SelfInformationDto`/`ChurchCampusStaffDto`/`MemberDto` (duplicated in `models`), selectors |
| `src/hooks/useAuth.ts` | `useAuth`, `useRequireAuth`, `useRedirectIfAuthenticated` |
| `src/guards/AuthGuard.tsx` (+ `index.ts`) | `AuthGuard`, `RoleGuard`, `withAuth`, `withRole` |
| `src/app/(auth)/signin/page.tsx` | sign-in form (`loginSchema`, `FormInput`, `FormPassword`), `returnUrl` check |
| `src/app/(protected)/church-campus-admin/layout.tsx` | `<AuthGuard><AdminLayout showBreadcrumbs>` |
| `src/services/api-client.ts` | 401 handling: `refreshToken`, `handleTokenRefresh`, `isAuthUrl` |
| `src/middleware.ts` | cookie-presence redirects (`PROTECTED_ROUTES`, `AUTH_ROUTES`) |
| `src/models/auth.types.ts`, `src/models/schemas/auth.schema.ts`, `src/models/enums/index.ts` | DTOs, `loginSchema`, `ChurchRole` |
| API side | `gwc-monitoring-service/docs/skills/security/` (`references/auth-flow.md`) |

## Legacy and drift

Don't copy any of these; fixing them is a separate task.

- `refreshToken()` posts to `builAppdUrl('auth/refresh')` (the Next app origin, no such route) instead of the API's `POST /api/v1/auth/refresh` → in practice every 401 signs the user out. A fix uses the API base and `credentials: 'include'` (the refresh cookie's path is `/api/v1/auth` on the API host).
- 401 detection matches `message === 'Expired JWT Token'` (old backend) or `error === 'Unauthorized'` → the service sends `{ data: null, statusCode, error }`; new checks read `error`.
- `middleware.ts` `PROTECTED_ROUTES` is `['/testing']` → `/church-campus-admin` is guarded only client-side. Its cookie check also only sees `ACCESS_TOKEN` when the API shares the site's host (cookies are per host, not per port).
- `AuthGuard` trusts the persisted `isAuthenticated` and skips `/self`; an expired session is only noticed on the next 401.
- The profile is persisted twice: `user-storage` (Zustand `persist`) and `AUTHENTICATED_USER` (`storage.set` in `getSelf`) → new code reads the store only.
- `SelfInformationDto`, `ChurchCampusStaffDto`, `MemberDto` are declared in both `stores/user.store.ts` and `models/` → import from `@/models` in new code.
- `useAuth().login` keeps `router` in its deps and a commented-out redirect (a lint warning) → don't add more.
- `AuthGuard` with `roles` redirects to `ROUTES.DASHBOARD` on a missing role → never put a role-restricted guard on the dashboard itself (redirect loop).

## Checklist before shipping

- [ ] New admin page is under `(protected)/church-campus-admin/` or a layout with `<AuthGuard>`
- [ ] Role checks use `ChurchRole` / `useAuth` helpers; the API enforces the same rule (named in the spec)
- [ ] No token read, stored or logged: `git diff -U0 -- src | grep -iE "^\+.*(access_token|refresh_token|document\.cookie)"` is empty
- [ ] Redirects use internal paths only (`ROUTES.*` or a checked `returnUrl`)
- [ ] Sign-in/out flows checked by hand against a real API by the owner (M line)

## Related skills

- [`security`](../security/SKILL.md): encryption, cookies, CSP
- [`api-client`](../api-client/SKILL.md): 401 handling, `target: 'api'`
- [`zustand`](../zustand/SKILL.md): `useUserStore`
- [`routing`](../routing/SKILL.md): route groups, middleware
