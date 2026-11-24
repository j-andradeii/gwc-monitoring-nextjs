# Checklist: Remove the Playwright step from the deploy workflow

**Spec**: [spec.md](spec.md) · **Run**: 2026-11-24 14:13 · **Pre-run HEAD**: `ff94102` · **Status**: Implemented

Pre-run `git status --short`: clean.

Format: `- [ ] ID [FR-00n] description — path · verified by <test path | check | manual — what to check>`

## Implementation
- [x] T001 [FR-001, FR-002, FR-003] drop the Playwright `test` job and `needs: test` — `.github/workflows/deploy.yml` · verified by diff + YAML check
- [x] T002 specs index row — `docs/specs/README.md` · verified by reading

## Verification
- [x] V001 `pnpm run lint` exits 0
- [x] V002 `npx tsc --noEmit` exits 0
- [x] V003 `pnpm run build` exits 0
- [x] V004 "Checklist before shipping": no skill read (none covers CI) — n/a, stated in spec
- [x] V005 [FR-001, FR-002, FR-003] workflow parses; jobs = `deploy` only, no `needs`, no `playwright` text outside comments; deploy steps identical to pre-run
- [x] V006 UI: `n/a — no UI change`
- [x] V007 [FR-004] `e2e/`, Playwright config and `test:e2e` script untouched — `git diff --name-only`

## Manual checks
- [ ] M001 next merged PR into `master`/`staging`: the Actions run shows only `deploy` and it succeeds

## Evidence (after the last edit, 2026-11-24)
- V001 `pnpm run lint` exit 0 (31 warnings, all pre-existing; no `src/` file changed) · V002 `npx tsc --noEmit`
  exit 0 · V003 `pnpm run build` exit 0.
- V005 parsed with the project's YAML parser: jobs = `[deploy]`, `needs` undefined; `deploy` steps, `on` and
  `env` identical to `ff94102`; `playwright` appears 0 times outside comments.
- V007 `git diff --name-only`: `.github/workflows/deploy.yml`, `docs/specs/README.md` only.

## Gap list
None. M001 is open for the owner (first real run after a merge).
