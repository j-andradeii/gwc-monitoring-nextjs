# Feature Specification: Remove the Playwright step from the deploy workflow

**Issue**: none · **Branch**: `MIGRATION-TO-TANSTACK` · **Created**: 2026-11-24 · **Status**: Implemented

## Overview

`.github/workflows/deploy.yml` runs a `test` job ("Run Playwright Tests") before every production deploy. Its
test step was already commented out, so the job only installs Chromium and uploads an empty
`playwright-report`, and `deploy` waits for it. This removes the Playwright job and the `needs: test` link, so a
merged PR goes straight to the Vercel deploy job.

## Source (verbatim)

> in '.github/workflows/deploy.yml' remove the playwright tests step

## User Scenarios & Acceptance

### Story 1 — Deploy without the Playwright job (Priority: P1)
1. **Given** a PR merged into `master` or `staging`, **When** the workflow runs, **Then** only the `deploy` job
   runs, with no Playwright browser install or report upload, and it deploys as before.

## Requirements

- **FR-001** The workflow has no Playwright test step, browser install or report upload.
- **FR-002** `deploy` no longer `needs: test`. — derived (the job it waited on is gone)
- **FR-003** The `deploy` job, triggers and env are unchanged.
- **FR-004** `e2e/`, `playwright.config.*` and `pnpm test:e2e` stay; only CI stops running them. — derived

## Edge Cases

- A dangling `needs: test` would make GitHub reject the workflow → covered by FR-002 and the YAML check (V005).

## Rules & skills check

- Skills: no `docs/skills` skill covers CI workflows; `coding-style` is for `src/` and isn't touched.
- External side effects: Claude doesn't push, merge or deploy; the first real run is an owner check (M001).
- Skills to update: none (no skill mentions the workflow).

## Out of Scope

- The commented-out old `jobs:` block at the end of the file.
- Deleting the Playwright specs or dependency.

## Success Criteria

- SC-001 `pnpm run lint` · SC-002 `npx tsc --noEmit` · SC-003 `pnpm run build` exit 0
- SC-004 every FR built and verified
- SC-005 the workflow parses as YAML with one job, `deploy`, and no `needs`

## Assumptions & Open Questions

- "The playwright tests step" is read as the whole Playwright job: its test step was already commented out, and the
  rest of the job only exists to support it.
