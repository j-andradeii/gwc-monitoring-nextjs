# Checklist: Sign-in wait countdown on 429

**Spec**: [spec.md](spec.md) · **Run**: 2026-11-28 · **Pre-run HEAD**: `9b930f975e4aa6adfa8d3bbb1e2879c5ac7ab91c` · **Status**: Implemented

Pre-run `git status --short`: clean.

Format: `- [ ] ID [FR-00n] description — path · verified by <test path | check | manual — what to check>`

## Implementation
- [x] T001 [FR-001] `ApiError.retryAfter` + `parseRetryAfter` — `src/services/api-client.ts` · verified by `npx tsc --noEmit`, reading
- [x] T002 [FR-002] rethrow 429 — `src/services/auth.service.ts` · verified by `npx tsc --noEmit`, M001
- [x] T003 [FR-003, FR-004, FR-006] countdown on the page — `src/app/(auth)/signin/page.tsx` · verified by screenshot, M001
- [x] T004 [FR-005] copy + fallback — `src/core/messages.ts`, `src/core/constants.ts` · verified by `npx tsc --noEmit`
- [x] T005 [FR-007] skills — `docs/skills/api-client/SKILL.md`, `docs/skills/authentication/references/auth-flow.md` · verified by reading

## Verification
- [x] V001 `pnpm run lint` exit 0 (0 errors, 31 pre-existing warnings; none in touched files)
- [x] V002 `npx tsc --noEmit` exit 0
- [x] V003 `pnpm run build` exit 0
- [x] V004 "Checklist before shipping" of every skill read, run against the diff
- [x] V005 `docs/skills/` and this file still true
- [x] V006 UI: screenshots at desktop (1400px, `Retry-After: 42` → "Try again in 40s" after 2 s) and 540px (no header → 60 s fallback, "58s"), 429 faked with Playwright `page.route`, no API call
- [x] V007 external side effects: M lines only

## Manual checks
- [ ] M001 owner, API running with service spec 021: on `/signin` enter a wrong password 6 times quickly → notice "Too many sign-in attempts. Please wait N seconds…", button "Try again in Ns" counts down, re-enables at 0
- [ ] M002 owner, API without spec 021 (header not exposed): same steps → countdown starts at 60

## Gap list
None. (M001, M002 stay open for the owner: real API.)
