# Checklist: UI/UX skill as the single styling reference

**Spec**: [spec.md](spec.md) · **Run**: 2026-11-21 · **Pre-run HEAD**: `bb54f31` · **Status**: Implemented with gaps

Pre-run `git status --short`: spec 001's uncommitted work (`M DESIGN.md`, `M src/data/ADDING_SERMONS.md`,
`?? CLAUDE.md`, `?? docs/skills/`, `?? docs/specs/`). T lines below are judged against that state.

Format: `- [ ] ID [FR-00n] description — path · verified by <test path | check | manual — what to check>`

## Implementation
- [x] T001 [FR-001] entry point rewritten (rules, decision guide, file index, drift, checklist) — `docs/skills/ui-ux/SKILL.md` · verified by reading
- [x] T002 [FR-002] new conventions doc — `docs/skills/ui-ux/DESIGN.md` · verified by reading + V005
- [x] T003 [FR-003] tokens reference — `docs/skills/ui-ux/references/tokens.md` · verified by the token-diff script (V005)
- [x] T004 [FR-004] components reference — `docs/skills/ui-ux/references/components.md` · verified by the class-existence script (V005)
- [x] T005 [FR-005] surfaces reference — `docs/skills/ui-ux/references/surfaces.md` · verified by the class-existence script (V005)
- [x] T006 [FR-006] root design docs deleted — `DESIGN.md`, `DESIGN_SYSTEM.md`, `DESIGN_SYSTEM_CONTEXT.md`, `MISSION_CARD_DESIGN.md` · verified by `git status --short` (` D` lines)
- [x] T007 [FR-007] §10 styling section replaced by a pointer — `src/data/PROJECT_ANALYSIS.md` · verified by `git diff --stat` + reading
- [x] T008 [FR-008] references updated — `CLAUDE.md`, `docs/skills/README.md` · verified by reading
- [x] T009 [FR-008] comment-only edits — `src/app/globals.css`, `src/styles/landing.css`, `src/styles/vip-form.css`, `src/styles/admin-dashboard.css`, `src/components/landing/give/WaysToGiveTabs.tsx`, `src/lib/email/components.ts` · verified by `git diff -U0` showing only comment lines changed
- [x] T010 [FR-001] specs index row — `docs/specs/README.md` · verified by reading

## Verification
- [x] V001 `pnpm run lint` exits 0 (0 errors, 32 warnings — same as baseline)
- [x] V002 `npx tsc --noEmit` exits 0
- [ ] V003 `pnpm run build` exits 0
- [x] V004 `ui-ux` "Checklist before shipping" run against the diff: no new hex in `src` declarations; every changed `src` code line is a comment (grep for non-comment `+`/`-` lines returned none); no UI change, so no screenshots needed
- [x] V005 token check: no mismatch between `references/tokens.md` / `DESIGN.md` and `globals.css` `:root`; class check: every `.class` in the skill exists in `src/**/*.css` except names documented as removed and the `admin-dash-btn-*` / `sod-upload-*` wildcards
- [x] V006 [FR-008, SC-005] `grep -rnE "DESIGN(_SYSTEM(_CONTEXT)?)?\.md|MISSION_CARD_DESIGN|DESIGN_SYSTEM §"` outside `docs/specs/` and `docs/skills/ui-ux/` finds only `docs/skills/ui-ux/…` paths and the historical spec text; [FR-009] secrets grep empty

## Manual checks
- [ ] M001 owner decides on `TAILWIND_TUTORIAL.md` (keep or delete)
- [ ] M002 owner updates the user-level `~/.claude/skills/gwc-nextjs-patterns` skill, which still points at `DESIGN_SYSTEM.md`

## Gap list
- V003 — `pnpm run build` not run — the owner's `next dev` (port 3100) was running from this repo and a build writes the same `.next` folder; the source diff is comment-only, and lint + tsc pass — owner runs `pnpm run build` (or Claude, once the dev server is stopped)
