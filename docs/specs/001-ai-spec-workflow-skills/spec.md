# Feature Specification: AI-spec workflow and project skills

**Issue**: none · **Branch**: `MIGRATION-TO-TANSTACK` · **Created**: 2026-11-21 · **Status**: Implemented

## Overview
Brings the AI-spec workflow of `gwc-monitoring-service` to this repository: a `CLAUDE.md` that fixes the order
of every task and loads the skills index, nine project skills under `docs/skills/` (coding style, security,
authentication, API client + TanStack Query, routing, Zustand, forms, adding sermons, UI/UX), and
`docs/specs/` with one folder per task. The skills describe the code as it is today and list the drift the
code already has, so new work follows the owner's style without copying the known problems.

## Source (verbatim)
"check on 'gwc-monitoring-service' I want to apply the ai ssd spec to 'gwc-monitoring-nextjs'; also create
skill for the security, authentication, apiclient (using of react query), routing, the coding pattern (make it
a skill to follow my coding style), zustand; the zod + react-hook-form + 'src/components/forms'; the adding of
sermon ( @gwc-monitoring-nextjs/src/data/ADDING_SERMONS.md ); ui/ux + DESIGN.md;"

## User Scenarios & Acceptance
### Story 1 — A new session knows the rules (Priority: P1)
1. **Given** a fresh session that reads only `CLAUDE.md`, **When** it gets "add an admin page that lists
   campus staff with an edit form", **Then** the index names `routing`, `authentication`, `api-client`,
   `forms`, `ui-ux` and `coding-style`, and the task leaves a `docs/specs/NNN-<slug>/` folder.

### Story 2 — Adding a sermon follows the content rules (Priority: P1)
1. **Given** pasted sermon notes, **When** a session is asked to add the sermon, **Then** `CLAUDE.md` routes
   it to `adding-sermons`, which points to `src/data/ADDING_SERMONS.md` for the field rules and keeps the
   strict "no added words" content rule and the YouTube `videoUrl` rule.

### Story 3 — Known problems aren't copied (Priority: P2)
1. **Given** a task that touches the API client or auth, **When** the session opens `api-client` or
   `authentication`, **Then** "Legacy and drift" lists what is wrong today (refresh URL, error field, endpoint
   names that differ from the service, middleware coverage, hard-coded fallbacks) so new code doesn't repeat it.

## Requirements
- **FR-001** `CLAUDE.md`: project overview, commands, task order, the `@docs/skills/README.md` import,
  precedence, the spec workflow with `spec.md`/`checklist.md` templates, key rules.
- **FR-002** `docs/skills/README.md`: index table, common combinations, how to use the skills.
- **FR-003** Nine skills, each a `SKILL.md` with frontmatter (Use when / Keywords), rules with *Why*, a
  decision guide or file map, "Legacy and drift", "Checklist before shipping" and related skills:
  `coding-style`, `security`, `authentication`, `api-client`, `routing`, `zustand`, `forms`,
  `adding-sermons`, `ui-ux`.
- **FR-004** `references/` files where a skill needs an inventory: security env keys, auth flow, API endpoint
  map + query keys, route map, form component props.
- **FR-005** `adding-sermons` uses `src/data/ADDING_SERMONS.md` as its reference instead of copying it;
  `ui-ux` uses `DESIGN.md` and `DESIGN_SYSTEM.md` the same way.
- **FR-006** `docs/specs/README.md` and this folder.
- **FR-007** No secret, token, `.env*` value, real name or email in any skill or spec.
- **FR-008** — derived: facts in the skills match the code (paths, signatures, endpoint names); a stale fact
  found in a referenced doc is fixed in the same change (`ADDING_SERMONS.md`: `slug` and `hideChurchName`
  missing from the interface, series table missing five series; `DESIGN.md`: `--text-heading`/`--text-secondary` listed as slate values while `globals.css` sets `#000`).
- **FR-009** — derived: an "external side effects" rule, the frontend analogue of the service's "database
  commands" rule: Claude never deploys, never pulls Vercel env, never runs `scripts/*` or root `_*.mjs`
  scripts, and never submits a form against real Google Sheets / Vercel Blob / Resend credentials.

## Edge Cases
- A skill names a file that doesn't exist → checked by listing every path in "Where things live" (V005).
- A skill's grep check matches doc text instead of code → greps are scoped to `src` (V004).
- The user-level `gwc-nextjs-patterns` skill disagrees with a project skill → the README states that
  `CLAUDE.md` and `docs/skills/` win in this repository.

## Rules & skills check
No project skills existed before this task (it creates them). Structure and wording follow
`gwc-monitoring-service` (`CLAUDE.md`, `docs/skills/*/SKILL.md`, `docs/specs/001-project-skills-spec-workflow/`).
Style facts come from reading the code (`src/services/api-client.ts`, `src/hooks/**`, `src/stores/**`,
`src/components/forms/**`, `src/models/schemas/**`, `src/middleware.ts`, `src/guards/AuthGuard.tsx`,
`src/app/**` layouts and pages), `src/data/TANSTACK_MIGRATION_PLAN.md`, `DESIGN.md`, `DESIGN_SYSTEM.md` and
`src/data/ADDING_SERMONS.md`. API routes on the service side come from its controllers.

## Out of Scope
Fixing the drift the skills list (refresh URL, error field, endpoint names, middleware coverage, hard-coded
fallbacks, unused service files, missing `.env.example`); any change to `src/` code; `.claude/skills` copies
of the skills; CI changes.

## Success Criteria
SC-001 `pnpm run lint` exits 0 · SC-002 `npx tsc --noEmit` exits 0 · SC-003 `pnpm run build` exits 0 (n/a —
docs only) · SC-004 every FR built and verified · SC-005 every path named in a skill exists.

## Assumptions & Open Questions
- "ai ssd spec" means the service's AI spec-driven workflow (`CLAUDE.md` + `docs/skills` + `docs/specs`).
- Skills live in `docs/skills/` and load through `CLAUDE.md`, as in the service, not in `.claude/skills/`.
- The query hooks keep calling `apiClient` inline (the TanStack migration plan's chosen shape); the unused
  `member`/`church`/`church-campus`/`inquiry` service files are recorded as drift, not deleted.
- Open: should the drift items become their own tasks (e.g. `002-api-client-refresh-and-errors`)?

### Run 2026-11-21
Scope addition during the run: `DESIGN.md` token table corrected (FR-008, T014) after checking `globals.css`.
