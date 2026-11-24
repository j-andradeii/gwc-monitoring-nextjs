# Feature Specification: Admin dashboard layout refresh

**Issue**: none · **Branch**: `MIGRATION-TO-TANSTACK` · **Created**: 2026-11-22 · **Status**: Implemented with gaps

## Overview
Makes the `(protected)` admin (shell + dashboard + member pages) more modern, clear and direct, in the admin's
existing theme (navy chrome, the site gold, Inter, `--admin-*` tokens). The shell drops controls that do nothing
or show fake data, nothing links to a page that doesn't exist, the sidebar moves from inline styles to scoped CSS
with keyboard access and a mobile drawer header, and the dashboard shows real profile data instead of
placeholders. Gold text and gold surfaces meet AA. The `ui-ux` skill records the refreshed admin surface, and
"stay consistent with the current theming" becomes a standing rule.

## Source (verbatim)
"right now I want you to enhance the 'src/app/(protected)' dashboard layout with more modern, clear; direct;
design; update the ui/ux skill with the enhancement; but be consistent with the current theming (make it always a
standing rule)"

## User Scenarios & Acceptance
### Story 1 — A clear shell (Priority: P1)
1. **Given** a signed-in staff member on any admin page, **When** the page loads, **Then** the header shows the
   brand and their name and role in words ("Senior Pastor", not `SENIOR_PASTOR`), the sidebar shows their campus,
   highlights the current page and opens its group, and every control on screen does something.

### Story 2 — No dead ends (Priority: P1)
1. **Given** a menu item or quick action whose page isn't built, **When** it is shown, **Then** it reads "Soon"
   and is not a link; every link goes to an existing page.

### Story 3 — Works on a phone (Priority: P1)
1. **Given** a 540px-wide screen, **When** the menu opens, **Then** a drawer slides in with its own title bar and
   close button, the page behind is dimmed, and the content uses the full width.

### Story 4 — Theme stays consistent (Priority: P1)
1. **Given** any later UI task, **When** a session reads `CLAUDE.md` or the `ui-ux` skill, **Then** a standing
   rule tells it to reuse the current theme (tokens, fonts, surface golds, radii, shadows, motion) and not invent a
   new one.

## Requirements
- **FR-001** Admin tokens (`--admin-*`) move from `.admin-dashboard` to the admin shell scope (`.admin-layout`, and
  `.admin-user-menu` for the portaled menu) so header, sidebar, footer and pages share them; the admin gold is the
  landing warm gold (`--admin-gold: var(--color-primary)`, `--admin-gold-fill` = the `.landing-btn-primary`
  gradient); `--admin-gold-ink: #7f652d` for gold-coloured text and focus rings on light (AA); text tokens are dark
  (`--admin-text-muted: #4b5563`).
- **FR-002** Header: brand mark + "Gateway Church" / "Campus Admin" wordmark; sidebar toggle; user button with
  initials (white on the gold fill), name and formatted role; user menu with a name/campus header and "Sign out".
  The search button, the bell with a hard-coded "3", and the no-op Profile/Settings items are removed.
- **FR-003** Sidebar: one navigation source (`src/components/layout/admin-navigation.ts`) with an `available` flag;
  CSS classes in `src/styles/admin-sidebar.css` (no inline styles, no JS hover state); groups are `<button
  aria-expanded>`; links set `aria-current="page"`; the group holding the current page opens itself; unavailable
  items show a "Soon" pill and aren't links; campus card at the top; "View website" link at the bottom; on mobile a
  drawer title bar with a close button.
- **FR-004** Breadcrumbs: scoped CSS classes instead of inline styles, rendered at the top of the page content,
  hidden when there is only one crumb; the debug `console.log` and unused variable go.
- **FR-005** Admin footer: one slim line (copyright, "Campus Admin", version), no links to missing pages, styles in
  `admin-layout.css` instead of styled-jsx.
- **FR-006** Dashboard: page header with campus eyebrow, greeting, today's date; primary action "View members" →
  `ROUTES.CHURCH_MEMBERS` (the "Export" no-op and the "Add Member" link to a missing page go); four stat cards in
  theme colours only (antique gold, navy, purple, burgundy) with "—" values and an honest "Not connected yet" caption;
  "Quick actions" as a list where only built pages link; an "Your account" card from the `/self` profile; a compact
  activity empty state.
- **FR-007** Shared admin page parts in `src/components/admin/` (`AdminPageHeader`, `AdminComingSoon`, barrel), used
  by the dashboard and the three member pages.
- **FR-008** `formatEnumLabel` in `src/core/utils.ts` (`SENIOR_PASTOR` → `Senior Pastor`).
- **FR-009** AA contrast on every new text/surface pair (no `#9ca3af` text, gold text uses `--admin-gold-ink`,
  muted ≥ 7:1) **except** the owner-chosen white on gold components (≈ 2.2–2.6:1, bold labels only, recorded as an
  accepted exception); visible `:focus-visible`; reduced-motion and `hover: none` fallbacks; ≥ 44px touch targets.
- **FR-013** — owner, mid-run: dashboard opens with a navy welcome banner (`.admin-dash-hero`); sidebar text darker
  and bigger (items 15px, sub-items 14.5px, section labels 11.5px black, "Soon" rows dark); sidebar 288px wide.
- **FR-014** — owner, mid-run, "make it a rule": gold components carry white text and icons; documented in the
  `ui-ux` skill, `CLAUDE.md` and memory.
- **FR-015** — owner, mid-run: the admin gold is uniform with the landing pages (one site gold); the "two golds"
  wording is replaced in the skill.
- **FR-010** `ui-ux` skill updated: `SKILL.md` (standing rule 0, admin decision rows, drift), `DESIGN.md` (standing
  rule + "Admin surface" section), `references/surfaces.md` (Admin rewritten), `references/tokens.md` (admin tokens).
- **FR-011** Standing rule "stay consistent with the current theme" in `CLAUDE.md` key rules and the `ui-ux` skill;
  a feedback memory so it holds across sessions.
- **FR-012** — derived: `coding-style` lists `components/admin`; `zustand`/`routing` skills stay true.

## Edge Cases
- Profile without campus/church (older `/self` shapes) → campus card and eyebrow fall back to "Gateway Church" —
  checked by reading the code paths (optional chaining + fallback).
- Long names → truncated with ellipsis in header and sidebar — checked in the 540px screenshot.
- Role-restricted item (`Configuration`, `SENIOR_PASTOR`) → still hidden for other roles (`hasRole`) — code review.
- Expanded state persisted in `useSidebarStore.expandedItems` → current-page group opens even if collapsed before.

## Rules & skills check
Skills read: `ui-ux` (+ `DESIGN.md`, `references/*`), `coding-style`, `routing`, `authentication`, `zustand`.
Rules in range: admin stays under `(protected)` with `AuthGuard` (unchanged); `useUserStore` read through `useAuth`;
no server data added to stores; tokens only, contrast AA, scoped `admin-*` classes, portaled menu styled with its own
class; pages stay client pages under the client admin layout. Skills to update: `ui-ux`, `coding-style`.

## Out of Scope
Wiring real member counts (endpoint names differ from the service — `api-client` drift); building the "Soon" pages;
the `AuthGuard` hydration race (a fresh load calls `/self` before the persisted profile is read); public pages.

## Success Criteria
SC-001 `pnpm run lint` exits 0 with no new warnings · SC-002 `npx tsc --noEmit` exits 0 · SC-003 `pnpm run build`
exits 0 (owner-run if the dev server is up) · SC-004 every FR built and verified · SC-005 screenshots of the
dashboard, a member page and the mobile drawer at 1440px and 540px look right.

## Assumptions & Open Questions
- Removing the search button, fake notification badge, Profile/Settings items, Export button and footer links is
  what "clear; direct" asks for, since none of them work; they can come back when they do.
- Screenshots use a placeholder profile in `localStorage` and a mocked `/self` response; every other request off
  `localhost:3100` is aborted, so no real API is called.

### Run 2026-11-22
Owner messages during the run widened the scope (FR-013 – FR-015): "make it more modern looking and the text darker";
"on the sidebar when selected; make the icon text/font color to white"; "make text darker on the sidebar; make it also
bigger"; "the font color to white on this components; make it a rule" (quick-action icon tile, View members button,
avatar); "make the gold color similar to [the Sign In button]; make it uniform with the landing page colors".
The interim navy-on-gold and deep-antique-gold variants were replaced by the landing gold with white text.
`src/stores/sidebar.store.ts` gained `expandItem` (idempotent) after StrictMode's double effect closed the
auto-opened group.
