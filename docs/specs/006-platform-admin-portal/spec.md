# Feature Specification: Platform admin portal (read-only tenant directory)

**Issue**: none · **Branch**: `MIGRATION-TO-TANSTACK` · **Created**: 2026-11-26 · **Status**: Awaiting verification

## Overview
Adds a separate portal at `/platform-admin` for platform admins of `gwc-monitoring-service` (multi-tenancy, issue
#4 there). It has its own sign-in page (`/platform-admin/signin`) that lets in only logins the API recognises as
platform admins, and a read-only directory of every tenant church organisation with its churches and each church's
campuses. It uses the new `GET /api/v1/platform/tenants` route (service spec 020). Nothing can be edited.

## Source (verbatim)
"with the recent tenant update in 'gwc-monitoring-service' I want you in 'gwc-monitoring-nextjs' to add a new
platform admin portal where I can see the tenant church; just able to view the church and the church campus of each
church only; but have a way to login but make the auth/authorization only for the platform admin"

## User Scenarios & Acceptance
### Story 1 — Platform admin signs in (Priority: P1)
1. **Given** a platform admin login, **When** they submit `/platform-admin/signin`, **Then** the API sets the
   cookies, `GET platform/tenants` returns 200 and they land on `/platform-admin`.
2. **Given** wrong credentials, **When** they submit, **Then** "We could not sign you in. Please check your details
   and try again." and they stay on the page.
### Story 2 — Anyone else is refused (Priority: P1)
1. **Given** a valid church login that is not a platform admin (or a login with no church access), **When** they
   submit, **Then** the session is signed out again (`POST auth/logout`) and "This account does not have platform
   admin access." shows.
2. **Given** no platform-admin session, **When** someone opens `/platform-admin`, **Then** they are sent to
   `/platform-admin/signin`.
3. **Given** the API answers 403 to `platform/tenants` later (access revoked), **Then** the portal signs out and
   returns to `/platform-admin/signin`.
### Story 3 — View tenants, churches, campuses (Priority: P1)
1. **Given** a signed-in platform admin, **When** `/platform-admin` loads, **Then** every tenant shows (name, slug,
   status, church and campus counts) with a search box.
2. **When** they open a tenant (`/platform-admin/tenants/<id>`), **Then** its churches show, each with its campuses
   (type, reference id, tag line, description, established date, addresses). No edit controls anywhere.

## Requirements
- **FR-001** Routes: `/platform-admin/signin` (`(auth)` group), `/platform-admin` and `/platform-admin/tenants/[tenantId]` (`(protected)/platform-admin/`, behind `PlatformAdminGuard`); `ROUTES.PLATFORM_ADMIN`, `PLATFORM_ADMIN_SIGNIN`, `PLATFORM_ADMIN_TENANT(id)`.
- **FR-002** `platformAdminService.signIn`: encrypt password → `POST auth` (`target: 'api'`) → `GET platform/tenants`; 403 → `POST auth/logout`, store cleared, error "not a platform admin". Never calls `/self`.
- **FR-003** `usePlatformAdminStore` (persisted `platform-admin-storage`, `partialize` `{ email, isAuthenticated }`) — the portal's session flag only; no server data, no token.
- **FR-004** `PlatformAdminGuard`: no session → `router.replace(ROUTES.PLATFORM_ADMIN_SIGNIN)`; it does not use `useUserStore`.
- **FR-005** `usePlatformTenants` query hook, `QUERY_KEYS.platformTenants()`; a 403 from it signs the portal out.
- **FR-006** `apiClient` `FetchOptions.signInPath` (default `/signin`): where a failed session refresh sends the browser, so a portal 401 lands on `/platform-admin/signin`.
- **FR-007** UI: portal shell (navy header "Gateway Church · Platform Admin", signed-in email, Sign out), directory page and tenant page using the admin tokens and `admin-dash-*` classes; new CSS scoped `platform-` in `src/styles/platform-admin.css`.
- **FR-008** — derived: `robots.ts` disallows `/platform-admin`; types in `src/models/platform-admin.types.ts`.
- **FR-009** — derived: skills updated (`authentication`, `api-client` endpoint map + keys, `routing` route map, `zustand` store list, `ui-ux` surfaces).

## Edge Cases
- Platform admin without any church membership: the API issues a token without `tid`; the portal never calls tenant routes, so it works (M001).
- Church user who is also a platform admin: allowed (M002).
- Same browser signed into the church admin: signing into the portal replaces the API cookies (one session per API host) — documented, not prevented.
- No tenants → empty state "No tenants yet." (visual check with the API off: error state; owner M001 for data).
- Unknown tenant id in the URL → "Tenant not found" panel with a link back (code path; owner M001).
- API down / network error → error panel with "Try again" (visual check, dev server without API).

## Rules & skills check
- Skills read: `coding-style`, `authentication`, `api-client`, `routing`, `zustand`, `ui-ux`, `security` (no CSP/env change: the API origin is already allowed), `forms` (reuses `loginSchema` + `FormInput`/`FormPassword`).
- Route group + guard: sign-in in `(auth)` (noindex); portal in `(protected)` (noindex) with its own client layout + `PlatformAdminGuard` (authentication rule 3: "a new protected area outside it gets its own layout").
- Client role checks are UX: the API enforces `PlatformAdminGuard` on `GET /api/v1/platform/tenants` (authentication rule 5).
- apiClient: `target: 'api'`, typed envelope, one query key factory; no mutations (read-only), so no invalidation.
- Store vs query: tenants live in TanStack Query only; the store holds `{ email, isAuthenticated }`.
- Login errors are generic for bad credentials (rule 9); the not-a-platform-admin message shows only after the credentials were accepted.
- Design: admin tokens, one gold, white text on gold buttons, dark text; no new hex.
- Page shape: admin-style `'use client'` pages (routing rule 2 admin exception); the sign-in page follows `/signin`.

## Out of Scope
- Any edit, create, suspend or delete (tenants, churches, campuses); members and staff.
- Provisioning tenants from the UI (`POST /api/v1/platform/tenants` exists in the API).
- Fixing the `refreshToken()` base-URL drift.
- Middleware cookie redirects for `/platform-admin`.

## Success Criteria
- SC-001 `pnpm run lint` · SC-002 `npx tsc --noEmit` · SC-003 `pnpm run build` exit 0
- SC-004 every FR built and verified
- SC-005 screenshots of `/platform-admin/signin` and the guard redirect at desktop and ~540px
- SC-006 owner: sign in with a platform admin and with a non-admin against the real API (M lines)

## Assumptions & Open Questions
- The API side is service spec 020 (`gwc-monitoring-service/docs/specs/020-platform-tenant-directory`); it must be deployed before the portal shows data.
- The portal is reached by URL only (no link from the public site or the church admin).

### Run 2026-11-26
Built as planned. The tenant link helper is `platformAdminTenantRoute(id)` (not a `ROUTES` entry). Visual check used a
mocked `platform/tenants` response; real sign-in is the owner's M001–M003.
