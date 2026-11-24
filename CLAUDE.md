# CLAUDE.md

This file guides Claude Code (claude.ai/code) in this repository.

## Project overview

`gwc-monitoring-nextjs` is the Gateway Church Cebu website and the GWC monitoring admin: one Next.js 16 App
Router app (React 19, TypeScript strict, Tailwind v4 + PrimeReact `lara-light-blue`), deployed on Vercel.
Public pages (landing, sermons, events, give, forms) post to its own route handlers in `src/app/api`, which
write to Google Sheets, Vercel Blob and Resend. The admin (`/church-campus-admin`) talks to the external API
`gwc-monitoring-service` (NestJS, `NEXT_PUBLIC_API_URL`) through `src/services/api-client.ts` with httpOnly
cookies and encrypted `X-ACCESS-TOKEN` headers. Server state is TanStack Query v5; client state is Zustand 5;
forms are React Hook Form 7 + Zod 4 + the PrimeReact wrappers in `src/components/forms`.

```
src/
  app/           (public)/ (auth)/ (protected)/  route groups · api/ route handlers · layout.tsx globals.css sitemap.ts robots.ts
  components/    forms/ landing/ layout/ cards/ events/ providers/ ui/
  core/          config.ts constants.ts crypto.ts messages.ts form-message.ts local-storage.ts utils.ts
  data/          sermons.ts events.ts ministries.ts site-metadata.ts …  (static content) + ADDING_SERMONS.md
  guards/        AuthGuard.tsx (AuthGuard, RoleGuard, withAuth, withRole)
  hooks/         queries/ mutations/ useAuth.ts …
  lib/           query-client.ts query-keys.ts youtube.ts *-sheet.ts email/ lyrics/ …  (server + shared helpers)
  models/        *.types.ts enums/ schemas/*.schema.ts
  services/      api-client.ts auth.service.ts (+ unused legacy service files)
  stores/        *.store.ts (Zustand)
  styles/        landing.css sermon-detail.css vip-form.css signin.css admin*.css
  middleware.ts  security headers + cookie redirects
docs/            skills/  specs/
e2e/             Playwright specs (baseURL http://localhost:3100)
```

## Commands

```bash
pnpm run lint        # ESLint (next core-web-vitals + typescript). Exit 0 required; 32 warnings pre-exist (2026-11-21)
npx tsc --noEmit     # type check
pnpm run build       # next build
pnpm dev             # next dev on port 3100 — only one `next dev` may run; check `lsof -i :3100` first
pnpm test:e2e        # Playwright (starts `npm run dev` on 3100 unless one is running)
```

## Every task, in order (Required)

1. **Read the matching skills** (below), before planning.
2. **Plan**, then **write the spec** (below), before the first edit.
3. **Build** it, following the skills you read.
4. **Verify**: `pnpm run lint`, `npx tsc --noEmit`, `pnpm run build`. A UI change also gets a visual check
   (`ui-ux` skill): dev server on 3100, desktop and ~540px width.
5. **Tick the checklist** from evidence.
6. **Report**, naming the spec folder and `Checklist: <x>/<y> ticked, <g> gaps, <m> manual checks open`.

## External side effects: the owner runs them, never Claude (Required)

The route handlers and scripts write to real services with the credentials in `.env` / `.env.local`. Claude
never:

- deploys (`vercel`, `vercel deploy`, `vercel build --prod`) or pulls env (`vercel env pull`, `vercel pull`);
- runs `scripts/*` or the root `_*.mjs` scripts (they read `.env*` and call Google APIs);
- submits a form, or `curl`s an `src/app/api/*` route, while the server has real Google Sheets, Vercel Blob,
  Resend, Gemini or Firecrawl credentials loaded (that appends real sheet rows, uploads blobs, sends email);
- calls the external API (`gwc-monitoring-service`) with a real account.

Instead: give the owner the exact command or click path and what to look for, and continue from what the owner
shares. In a checklist, those checks are **M** lines, never ticked by Claude. Lint, type check, build, a dev
server that only renders pages, and Playwright specs that only navigate stay with Claude.

## Before every task: read the project skills (Required)

Every task starts from the skills in `docs/skills/`. Their index loads with this file:

@docs/skills/README.md

1. **Open the `SKILL.md` of every skill whose "Use when" matches**, before planning, then the
   `references/` files for the parts you'll touch. Every code task opens `coding-style`. A task that
   matches no skill says so in its spec.
2. **Precedence for how to write code: this file > the skills > the user-level `gwc-nextjs-patterns` skill.**
   About what exists, the code wins: a skill or a line of this file that names a missing file or a wrong
   signature is fixed in the same change.
3. **Don't copy the drift.** Each skill's "Legacy and drift" lists what the code does today that new code must
   not repeat. Fixing a drift item is its own task unless the request asks for it.
4. **Run each opened skill's "Checklist before shipping"** against the diff before reporting (V004).
5. **Keep the skills true.** A change to a documented pattern updates its skill in the same change.
6. **Never paste a secret, token, `.env*` value, spreadsheet ID, real name or email** into a skill, spec,
   test or commit.

## Every task leaves a spec: `docs/specs/NNN-<slug>/` (Required)

Every task that changes the repository (feature, fix, refactor, config, content, docs) leaves a folder with two
files: `spec.md`, what was planned, and `checklist.md`, what was proven. Questions and reviews that change
nothing don't. Adding a sermon to `src/data/sermons.ts` is a task too (one short spec per sermon or batch).

1. **Write the spec before the first edit**, once the plan is final.
   - Note the pre-run `git rev-parse HEAD` and `git status --short`. The checklist is ticked against them.
   - The folder is `docs/specs/NNN-<slug>/`: `NNN` is one more than the highest number there
     (`ls docs/specs | grep -E '^[0-9]{3}-' | tail -1`, or `001`), `<slug>` is 2–5 kebab-case words.
   - Follow-up work on the same task updates that folder and adds a `### Run YYYY-MM-DD` note.
   - Fill in both templates with every box `[ ]`, and add a row to `docs/specs/README.md` with status `Draft`.
2. **Verify** with the commands above, after the last edit. A docs-only change (every changed path is
   `*.md`) marks the build line `n/a — docs only`; lint and type check still run. A failure in a file the
   change didn't touch is pre-existing: name it in the gap list, don't fix it unless asked.
3. **Tick the checklist from evidence, never from memory.**
   - Tick a **T** line only when its path is in `git diff --name-only <pre-run HEAD>` or new in
     `git status --short`, and its "verified by" holds. A sub-agent's account of its own work isn't evidence.
   - Tick a **V** line only from a check run after the last edit.
   - Leave **M** lines for a person.
   - A line that can't be ticked stays `[ ]` with a gap-list line `ID — what's missing — why — next step`;
     when nothing is missing, the gap list says `None.`
   - Never reword or drop a line to make it pass. If the scope changed, update the spec and add a Run note.
   - Status (both files and the README row): `Implemented` (every T and V ticked), `Awaiting verification`,
     `Implemented with gaps`, or `Failed`.
4. **Report it**: the final message names the folder and gives the checklist count.

What goes in the files: only what the plan and the request support (an empty section says "none"); no
secrets or personal data (use `<token>`, `<email>`); user-facing strings, routes and field names copied
exactly; dates `YYYY-MM-DD`; repo-relative paths. The spec is committed with the code, in the same PR.

`spec.md`:

```
# Feature Specification: <title>

**Issue**: #<n> | none · **Branch**: `<branch>` · **Created**: YYYY-MM-DD · **Status**: Draft

## Overview                 — 2–4 sentences: what changes and why
## Source (verbatim)        — the request or issue text, with secrets and personal data replaced
## User Scenarios & Acceptance
### Story 1 — <title> (Priority: P1)
1. **Given** …, **When** …, **Then** …
## Requirements             — `- **FR-001** <text>` (`— derived` when implied but not said)
## Edge Cases               — each with the test or check that covers it
## Rules & skills check     — the skills read; the rules in range (server vs client component, route group +
                              guard, apiClient target + query keys + invalidation, Zod schema + form wrappers,
                              store vs query, design tokens + contrast, sermon content rule) and how the change
                              keeps them; skills to update
## Out of Scope
## Success Criteria         — SC-001 `pnpm run lint` · SC-002 `npx tsc --noEmit` · SC-003 `pnpm run build`
                              exit 0 · SC-004 every FR built and verified · plus task-specific ones
## Assumptions & Open Questions
```

`checklist.md`:

```
# Checklist: <title>

**Spec**: [spec.md](spec.md) · **Run**: YYYY-MM-DD HH:MM · **Pre-run HEAD**: `<sha>` · **Status**: In progress

Format: `- [ ] ID [FR-00n] description — path · verified by <test path | check | manual — what to check>`

## Implementation   — one T001… line per file created or changed, with the FR(s) it serves
## Verification     — V001 `pnpm run lint` · V002 `npx tsc --noEmit` · V003 `pnpm run build` (each exits 0)
                      · V004 the "Checklist before shipping" of every skill read, run against the diff
                      · V005 `docs/skills/` and this file still true · V006 UI: screenshots at desktop and
                      ~540px (or `n/a — no UI change`) · external side effects: M lines only
## Manual checks    — one M001… line per requirement checked only by hand (form submissions against real
                      services, deploy, role-gated admin flows with a real account)
## Gap list         — "_Filled in after verification._"
```

## Key rules (details in the skills)

- Pages are Server Components that export `metadata` and render one `<Name>Client />` island; `'use client'`
  only where state, effects or PrimeReact need it (`routing`, `coding-style`).
- Server state lives in TanStack Query with `QUERY_KEYS.*()`; every mutation invalidates the keys it changes;
  Zustand holds client/UI state only (`api-client`, `zustand`).
- External-API calls go through `apiClient` with `{ target: 'api' }`; public forms post to `src/app/api/*`
  route handlers that re-validate with the same Zod schema (`api-client`, `security`).
- Forms: Zod schema in `src/models/schemas`, `useForm` + `zodResolver` + `FormProvider`, the `Form*` wrappers,
  `handleSubmit(onSubmit, scrollToError)` (`forms`).
- Admin routes sit under `(protected)` behind `AuthGuard`; the JWT lives in httpOnly cookies set by the API and
  is never read or stored by JS (`authentication`, `security`).
- **Standing rule — stay on the current theme.** Every UI change, however "modern" or "fresh" the request,
  reuses the existing theme: the surface's tokens (public `--color-*` / landing aliases, admin `--admin-*`), Inter +
  Fraunces, the one site gold (`#d4a84b`, public and admin alike), radii, shadows and motion. No new palette, font or
  visual language; a missing value becomes a token first (`ui-ux`, `docs/skills/ui-ux/DESIGN.md` "Standing rule").
- Admin gold components (buttons, avatars, selected/hover tiles, badges) carry **white** text and icons on
  `--admin-gold-fill`; admin text stays dark (`#000`, muted `#4b5563`) (`ui-ux` "Admin surface").
- Colours come from `globals.css` tokens; every coloured surface sets background and text colour together
  (`ui-ux` — the single styling reference: `docs/skills/ui-ux/DESIGN.md` + `references/`).
- Sermon content is the pastor's words only: no added, reworded or summarised text (`adding-sermons`).
