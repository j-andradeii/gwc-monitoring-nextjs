# Feature Specification: Sign-in wait countdown on 429

**Issue**: none · **Branch**: `MIGRATION-TO-TANSTACK` · **Created**: 2026-11-28 · **Status**: Implemented

## Overview
`POST {api}/auth` is throttled to 5 attempts per minute. Today a 429 shows the generic "We could not sign you
in…" message. This change has `/signin` read the API's `Retry-After` header, tell the user how many seconds to
wait, count down, and keep the Sign in button disabled until the wait ends.

## Source (verbatim)
> in 'gwc-monitoring-nextjs' http://localhost:3100/signin  show the wait for n amount times if received 429 error from 'gwc-monitoring-service'

## User Scenarios & Acceptance
### Story 1 — Too many attempts (Priority: P1)
1. **Given** the API answered 429 with `Retry-After: 42`, **When** the sign-in request fails, **Then** the page
   shows "Too many sign-in attempts. Please wait 42 seconds before trying again." and the button reads
   "Try again in 42s", disabled.
2. **Given** the countdown is running, **When** a second passes, **Then** both numbers go down by one.
3. **Given** the countdown reaches 0, **When** it ends, **Then** the notice disappears and the button is
   "Sign in" again.

## Requirements
- **FR-001** `ApiError` gains `retryAfter?: number` (seconds), filled from the `Retry-After` header on a 429 — derived
- **FR-002** `authService.authenticate` rethrows a 429 `ApiError` as is (status + `retryAfter` kept); other errors keep today's behaviour — derived
- **FR-003** `/signin` shows the wait notice with a live countdown and disables the submit button and fields until it ends
- **FR-004** Without a readable header (missing, not a number, or not exposed by CORS) the wait is 60 seconds, the login throttle window — derived
- **FR-005** Copy lives in `Messages`; the fallback in `CONST` — derived
- **FR-006** Screen readers hear the notice once, not every second — derived
- **FR-007** Skills updated: `api-client` (`ApiError.retryAfter`), `authentication` (429 on sign-in) — derived

## Edge Cases
- `Retry-After` missing or unreadable → 60 s fallback (FR-004) — reading `parseRetryAfter`, M002.
- `Retry-After` as an HTTP date (RFC 9110 allows it) → converted to seconds — reading.
- Submitting again during the wait → button disabled; `onSubmit` also returns early — reading, M001.
- Reloading the page during the wait clears the countdown; the API still answers 429 and restarts it — accepted (Out of Scope).

## Rules & skills check
- Skills read: `coding-style`, `authentication` (+ `references/auth-flow.md`), `api-client`, `ui-ux` (+ `references/surfaces.md` sign-in). `forms`: no schema or `Form*` change.
- Sign-in still goes through `useAuth().login` → `authService.authenticate`; messages stay generic (no raw API text, rule 9).
- `apiClient` stays the only API caller; the loading counter is untouched.
- UI reuses `.signin-error` and `.signin-submit` (no new colours or classes; `pi-clock` icon); `sr-only` for the one-time announcement.
- Needs gwc-monitoring-service spec 021 (`exposedHeaders: ['Retry-After']`) for the exact number; without it the fallback applies.

## Out of Scope
The platform admin sign-in (`/platform-admin/signin`); keeping the countdown across reloads; 429 handling on other pages.

## Success Criteria
SC-001 `pnpm run lint` · SC-002 `npx tsc --noEmit` · SC-003 `pnpm run build` exit 0 · SC-004 every FR built and
verified · SC-005 the owner sees the countdown after 6 quick failed sign-ins

## Assumptions & Open Questions
- 60 s fallback = the API's `@Throttle({ default: { limit: 5, ttl: 60000 } })` on `POST /auth`.
