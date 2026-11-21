# Checklist: Admin dashboard layout refresh

**Spec**: [spec.md](spec.md) · **Run**: 2026-11-22 · **Pre-run HEAD**: `e3b2254` · **Status**: Implemented with gaps

Pre-run `git status --short`: clean.

Format: `- [ ] ID [FR-00n] description — path · verified by <test path | check | manual — what to check>`

## Implementation
- [x] T001 [FR-001, FR-005] shell tokens, footer, breadcrumb placement, mobile padding — `src/styles/admin-layout.css` · verified by screenshots (V006)
- [x] T002 [FR-004, FR-005] breadcrumbs in page, drawer state passed to sidebar — `src/components/layout/AdminLayout.tsx` · verified by tsc + screenshots
- [x] T003 [FR-002] header markup — `src/components/layout/Header.tsx` · verified by tsc + screenshots
- [x] T004 [FR-001, FR-002, FR-009] header + user menu styles — `src/styles/admin.css` · verified by screenshots
- [x] T005 [FR-003] navigation source — `src/components/layout/admin-navigation.ts` · verified by tsc + reading
- [x] T006 [FR-003] sidebar markup — `src/components/layout/Sidebar.tsx` · verified by tsc + screenshots (open group, Soon pills, drawer)
- [x] T007 [FR-003, FR-009] sidebar styles — `src/styles/admin-sidebar.css` · verified by screenshots
- [x] T008 [FR-004] breadcrumbs — `src/components/layout/Breadcrumbs.tsx` · verified by tsc + screenshot of a member page
- [x] T009 [FR-005] admin footer — `src/components/layout/Footer.tsx` · verified by tsc + screenshots
- [x] T010 [FR-007] shared page parts — `src/components/admin/AdminPageHeader.tsx`, `AdminComingSoon.tsx`, `index.ts` · verified by tsc
- [x] T011 [FR-006, FR-009] dashboard styles — `src/styles/admin-dashboard.css` · verified by screenshots
- [x] T012 [FR-006] dashboard page — `src/app/(protected)/church-campus-admin/page.tsx` · verified by tsc + screenshots
- [x] T013 [FR-007] member pages — `src/app/(protected)/church-campus-admin/church-members/page.tsx`, `men-network/page.tsx`, `women-network/page.tsx` · verified by tsc + screenshot
- [x] T014 [FR-008] `formatEnumLabel` — `src/core/utils.ts` · verified by tsc + header screenshot ("Senior Pastor")
- [x] T015 [FR-010, FR-011] ui-ux skill — `docs/skills/ui-ux/SKILL.md`, `DESIGN.md`, `references/surfaces.md`, `references/tokens.md` · verified by reading + class check
- [x] T016 [FR-011] standing rule — `CLAUDE.md` · verified by reading
- [x] T017 [FR-012] `components/admin` listed — `docs/skills/coding-style/SKILL.md` · verified by reading
- [x] T018 [FR-001] specs index row — `docs/specs/README.md` · verified by reading
- [x] T019 [FR-003] idempotent `expandItem` — `src/stores/sidebar.store.ts` · verified by tsc + men-network screenshot (group open)
- [x] T020 [FR-014] memory — `~/.claude-work/…/memory/gwc-ui-theme-consistency.md`, `MEMORY.md` (outside the repo) · verified by reading

## Verification
- [x] V001 `pnpm run lint` exits 0 — 31 warnings (baseline 32: the `Breadcrumbs.tsx` unused-variable warning is gone), none in touched files
- [x] V002 `npx tsc --noEmit` exits 0
- [ ] V003 `pnpm run build` exits 0
- [x] V004 skill checklists (`ui-ux`, `coding-style`) run against the diff: no new hex outside token definitions, no inline `style=` in the refreshed admin files, no `console.log` — all hold for this change (see the gap-list note on `men-network/page.tsx`)
- [x] V005 every link target in `admin-navigation.ts` with `available: true` exists as a page; every class named in the updated skill exists in `src/**/*.css`
- [x] V006 screenshots after the last edit: dashboard, men-network page, mobile drawer at 1440px and 540px (placeholder profile, `/self` mocked, other off-host requests aborted)
- [x] V007 contrast of new text/surface pairs computed ≥ 4.5:1 (text) / ≥ 3:1 (icons, large text), except the owner-accepted white-on-gold components (FR-009)

## Manual checks
- [ ] M001 owner signs in with a real account and checks the shell, menu and sign-out
- [ ] M002 owner confirms dropping search / notifications / Profile / Settings / Export / footer links

## Gap list
- V003 — `pnpm run build` not run — the owner's `next dev` (port 3100, pid 16191) was running from this repo and a build writes the same `.next` folder; lint and tsc pass and the dev server compiled every changed page for the screenshots — owner runs `pnpm run build`
- Note (not a gap in this change) — `men-network/page.tsx` has an inline `style={{ height: '2000px !important' }}` added by the owner during the run; left as is (React drops `!important` values, so it has no effect) — owner removes it or keeps it
