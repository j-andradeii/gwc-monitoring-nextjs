# Checklist: AI-spec workflow and project skills

**Spec**: [spec.md](spec.md) · **Run**: 2026-11-21 23:40 · **Pre-run HEAD**: `bb54f31` · **Status**: Implemented

Pre-run `git status --short`: clean.

Format: `- [ ] ID [FR-00n] description — path · verified by <test path | check | manual — what to check>`

## Implementation
- [x] T001 [FR-001, FR-009] task order, skills import, spec workflow + templates, external-side-effects rule — `CLAUDE.md` · verified by reading the file
- [x] T002 [FR-002] skills index, combinations, how to use — `docs/skills/README.md` · verified by reading the file
- [x] T003 [FR-003] coding-style skill — `docs/skills/coding-style/SKILL.md` · verified by reading
- [x] T004 [FR-003, FR-004] security skill + `references/env-keys.md` — `docs/skills/security/` · verified by reading
- [x] T005 [FR-003, FR-004] authentication skill + `references/auth-flow.md` — `docs/skills/authentication/` · verified by reading
- [x] T006 [FR-003, FR-004] api-client skill + `references/endpoint-map.md` — `docs/skills/api-client/` · verified by reading
- [x] T007 [FR-003, FR-004] routing skill + `references/route-map.md` — `docs/skills/routing/` · verified by reading
- [x] T008 [FR-003] zustand skill — `docs/skills/zustand/SKILL.md` · verified by reading
- [x] T009 [FR-003, FR-004] forms skill + `references/form-components.md` — `docs/skills/forms/` · verified by reading
- [x] T010 [FR-003, FR-005] adding-sermons skill — `docs/skills/adding-sermons/SKILL.md` · verified by reading
- [x] T011 [FR-003, FR-005] ui-ux skill — `docs/skills/ui-ux/SKILL.md` · verified by reading
- [x] T012 [FR-008] interface gains `slug` + `hideChurchName`; series table lists all seven series — `src/data/ADDING_SERMONS.md` · verified by `grep -n "slug\|hideChurchName" src/data/ADDING_SERMONS.md` and comparing with `src/data/sermons.ts`
- [x] T014 [FR-008] `--text-heading` / `--text-secondary` values match `src/app/globals.css` — `DESIGN.md` · verified by `grep -n "text-heading\|text-secondary" DESIGN.md src/app/globals.css`
- [x] T013 [FR-006] specs index + this folder — `docs/specs/README.md`, `docs/specs/001-ai-spec-workflow-skills/` · verified by reading

## Verification
- [x] V001 `pnpm run lint` exits 0 (0 errors, 32 warnings — same as the baseline before the change)
- [x] V002 `npx tsc --noEmit` exits 0
- [x] V003 `pnpm run build` — n/a, docs only (every changed or new path is `*.md`, checked with `git status --short`)
- [x] V004 every skill's "Checklist before shipping" commands run against `src`: pub/sub grep empty; sermon id/slug duplicates none; `isFeatured: true` count 1; no `process.env` in client folders; diff-based greps n/a (no `src/` code changed — only `src/data/ADDING_SERMONS.md`)
- [x] V005 [FR-008] every path in every "Where things live" / "Files" table exists (`test -e` loop over 435 backticked paths; only hits are template names and files named as absent: `error.tsx`, `loading.tsx`, `not-found.tsx`, `proxy.ts`)
- [x] V006 [FR-007] no secrets or personal data in `docs/` or `CLAUDE.md` (grep for the two X-ACCESS fallback values, the spreadsheet IDs, `@gmail`, email domains, `BLOB_READ_WRITE_TOKEN=`: no matches)

## Manual checks
- [ ] M001 open a new Claude Code session in `gwc-monitoring-nextjs`, confirm `CLAUDE.md` loads `docs/skills/README.md`
- [ ] M002 owner reads "Legacy and drift" in `api-client`, `authentication` and `security` and decides which items become tasks

## Gap list
None.
