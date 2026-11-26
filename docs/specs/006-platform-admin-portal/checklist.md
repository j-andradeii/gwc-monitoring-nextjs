# Checklist: Platform admin portal (read-only tenant directory)

**Spec**: [spec.md](spec.md) · **Run**: 2026-11-26 · **Pre-run HEAD**: `417a8f5d5ec54439165c7a1e0b9c0590f8c24244` · **Status**: Awaiting verification

Format: `- [ ] ID [FR-00n] description — path · verified by <test path | check | manual — what to check>`

## Implementation
- [x] T001 [FR-001] routes — `src/core/constants.ts` · verified by `npx tsc --noEmit`
- [x] T002 [FR-001, FR-002] sign-in page — `src/app/(auth)/platform-admin/signin/page.tsx` · verified by screenshot, M001
- [x] T003 [FR-001, FR-004, FR-007] portal layout + pages — `src/app/(protected)/platform-admin/{layout.tsx,page.tsx,tenants/[tenantId]/page.tsx}` · verified by `pnpm run build`, screenshot, M001
- [x] T004 [FR-002] service — `src/services/platform-admin.service.ts` · verified by `npx tsc --noEmit`, M001, M002
- [x] T005 [FR-003] store — `src/stores/platform-admin.store.ts`, `src/stores/index.ts` · verified by `npx tsc --noEmit`
- [x] T006 [FR-004] guard — `src/guards/PlatformAdminGuard.tsx`, `src/guards/index.ts` · verified by screenshot (redirect)
- [x] T007 [FR-005] query hook + key — `src/hooks/queries/usePlatformTenants.ts`, `src/hooks/queries/index.ts`, `src/lib/query-keys.ts` · verified by `npx tsc --noEmit`
- [x] T008 [FR-006] apiClient `signInPath` — `src/services/api-client.ts` · verified by `npx tsc --noEmit`, reading
- [x] T009 [FR-007] shell + directory components, CSS — `src/components/platform-admin/*`, `src/styles/platform-admin.css` · verified by screenshot
- [x] T010 [FR-008] types, robots — `src/models/platform-admin.types.ts`, `src/app/robots.ts` · verified by `pnpm run build`
- [x] T011 [FR-009] skills — `docs/skills/**` · verified by reading

## Verification
- [x] V001 `pnpm run lint` exit 0 (0 errors, 31 pre-existing warnings; none in new files)
- [x] V002 `npx tsc --noEmit` exit 0
- [x] V003 `pnpm run build` exit 0
- [x] V004 "Checklist before shipping" of every skill read, run against the diff
- [x] V005 `docs/skills/` and this file still true
- [x] V006 UI: screenshots at 1366px and 540px of `/platform-admin/signin` (reached through the guard redirect), `/platform-admin` and `/platform-admin/tenants/t1`, with `platform/tenants` mocked in Playwright (no real API call); no horizontal overflow

## Manual checks
- [ ] M001 owner: with service spec 020 deployed, sign in at `/platform-admin/signin` with a platform admin → directory lists every tenant; open one → churches and campuses show
- [ ] M002 owner: sign in with a church login that is not a platform admin → "This account does not have platform admin access." and no session left (reload `/platform-admin` → back to sign-in)
- [ ] M003 owner: Sign out from the portal header → back to `/platform-admin/signin`

## Gap list
- M001–M003 — real sign-in against the API — needs a real account and service spec 020 deployed (owner-only rule) — owner runs them.

### Run 2026-11-26 (note)
FR-001 named the tenant route helper `ROUTES.PLATFORM_ADMIN_TENANT(id)`; it is built as `platformAdminTenantRoute(id)` next to
`ROUTES` in `src/core/constants.ts` (`ROUTES` is `as const` strings only). Same URL, `/platform-admin/tenants/<id>`.
