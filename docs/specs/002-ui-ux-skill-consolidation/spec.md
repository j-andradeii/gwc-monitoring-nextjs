# Feature Specification: UI/UX skill as the single styling reference

**Issue**: none · **Branch**: `MIGRATION-TO-TANSTACK` · **Created**: 2026-11-21 · **Status**: Implemented with gaps

## Overview
Makes `docs/skills/ui-ux/` the one place to look up how this app is styled. The content of `DESIGN.md`,
`DESIGN_SYSTEM.md`, `DESIGN_SYSTEM_CONTEXT.md` and `MISSION_CARD_DESIGN.md` is checked against the CSS as it is
today (`globals.css`, `landing.css`, `sermon-detail.css`, `signin.css`, `vip-form.css`, the admin sheets,
`form-input.css`, `poster-hero.css`) and rewritten into the skill. A new `DESIGN.md` goes inside the skill folder.
The old root docs are deleted, and the styling section of `src/data/PROJECT_ANALYSIS.md` is replaced by a pointer.

## Source (verbatim)
"update the 'docs/skills/ui-ux' with the app current 'DESIGN_SYSTEM.md''DESIGN.md'; so after updated that skill
remove the other DESIGN.md or other .md that has styles information about the problem. i want the ui/ux skill is
the main look up skills for this project styling; also put their the new DESIGN.md;"

## User Scenarios & Acceptance
### Story 1 — One lookup for styling (Priority: P1)
1. **Given** a UI task, **When** a session opens `docs/skills/ui-ux/SKILL.md`, **Then** it finds the rules, the
   new `DESIGN.md`, and references for tokens, components and page surfaces, without any root design doc.

### Story 2 — Values match the app (Priority: P1)
1. **Given** a token or class named in the skill, **When** it is looked up in `src/`, **Then** it exists with
   the value the skill gives (checked by script for tokens and class names).

## Requirements
- **FR-001** `docs/skills/ui-ux/SKILL.md` rewritten as the entry point: rules, decision guide, file map, drift,
  checklist, and an index of the files below.
- **FR-002** `docs/skills/ui-ux/DESIGN.md`: the practical conventions (contrast, status surfaces, PrimeReact
  buttons, dialogs, radios, InputSwitch, Tailwind/PrimeReact gotchas, scoping, section alternation, touch and
  iOS zoom, visual check), updated to the current CSS.
- **FR-003** `references/tokens.md`: every `:root` token with its live value, dark-mode tokens, the
  `@theme inline` bridge list, landing/admin/form tokens, typography, spacing/layout variables, shadows,
  motion, breakpoints.
- **FR-004** `references/components.md`: landing foundations, cards, buttons, header/nav/footer, heroes,
  forms, PrimeReact overrides, toasts, scrollbar, React UI components, with values taken from the CSS.
- **FR-005** `references/surfaces.md`: sermon reader, sign-in, VIP/enrollment forms, admin shell + dashboard,
  and the stylesheet → surface import map.
- **FR-006** Delete `DESIGN.md`, `DESIGN_SYSTEM.md`, `DESIGN_SYSTEM_CONTEXT.md`, `MISSION_CARD_DESIGN.md`
  (all tracked in git, so they can be restored).
- **FR-007** — derived: replace §10 "Comprehensive Styling Patterns" of `src/data/PROJECT_ANALYSIS.md` with
  a pointer to the skill; leave the rest of that file.
- **FR-008** — derived: update every repo reference to the deleted files so nothing points at a missing doc:
  `CLAUDE.md`, `docs/skills/README.md`, and **comment text only** in `src/app/globals.css`,
  `src/styles/landing.css`, `src/styles/vip-form.css`, `src/styles/admin-dashboard.css`,
  `src/components/landing/give/WaysToGiveTabs.tsx`, `src/lib/email/components.ts` (they cite
  `DESIGN.md` / `DESIGN_SYSTEM.md §n`; they now cite `docs/skills/ui-ux/DESIGN.md` sections).
- **FR-009** No secrets or personal data.

## Edge Cases
- A documented class no longer exists → left out, or listed under drift; checked by the class-existence script (V005).
- A documented value differs from the CSS → the CSS value is written; checked by the token diff script (V005).
- `TAILWIND_TUTORIAL.md` is a general Tailwind tutorial with no project tokens → kept; listed as an open question.

## Rules & skills check
Skills read: `ui-ux` (being rewritten), `coding-style` (file names), `routing` (where CSS is imported).
Docs plus comment-only edits in six source files (no selector, declaration or code changes).

## Out of Scope
Changing any style; fixing the contrast drift the skill lists (white text on `.landing-btn-primary`); the
user-level `~/.claude/skills/gwc-nextjs-patterns` skill (outside the repo).

## Success Criteria
SC-001 `pnpm run lint` exits 0 · SC-002 `npx tsc --noEmit` exits 0 · SC-003 `pnpm run build` exits 0 (run, since source files change) · SC-004 every FR built and verified · SC-005 no repo file references a deleted doc.

## Assumptions & Open Questions
- "the problem" in the request means "the project".
- Open: delete `TAILWIND_TUTORIAL.md` too? It has no project-specific styles, so it stays for now.
