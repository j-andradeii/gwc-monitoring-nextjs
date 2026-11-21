---
name: ui-ux
description: |
  The single styling reference for gwc-monitoring-nextjs. Use it to look up anything about how the app looks:
  brand tokens and their live values, typography (Inter + Fraunces), contrast rules, PrimeReact lara-light-blue
  overrides, buttons, cards, dialogs, toasts, forms, heroes, the sermon reader, sign-in, public forms, the admin
  shell, motion, accessibility, page-scoped CSS, and visual verification at desktop and ~540px. DESIGN.md in
  this folder holds the conventions; references/ hold tokens, components and page surfaces.

  Use when: changing anything a user sees — a page, section, component, CSS, colour, spacing, typography,
  dialog, toast, button, form styling, animation, image or responsive layout; implementing a design or
  screenshot; reviewing UI; answering "what colour / class / size do we use for X?".

  Keywords: design system, DESIGN.md, globals.css, landing.css, sermon-detail.css, vip-form.css, signin.css,
  admin.css, tokens, --color-primary, gold, navy, purple, burgundy, cream, ivory, velvet, contrast, WCAG,
  PrimeReact, lara, p-button, p-dialog, p-toast, Tailwind v4, @theme, premium-glass-card, process-step-card,
  landing-btn, section-label, animate-on-scroll, PageHero, PosterHero, sermon-hero, Fraunces, Inter,
  responsive, 540px, prefers-reduced-motion, focus-visible, antique gold, admin-dash
---

# UI/UX: the styling reference

This folder replaces the old root `DESIGN.md`, `DESIGN_SYSTEM.md`, `DESIGN_SYSTEM_CONTEXT.md` and
`MISSION_CARD_DESIGN.md`. Every value was checked against the CSS on 2026-11-21. When a value here disagrees with
`src/app/globals.css` or `src/styles/*.css`, the CSS wins and this folder is fixed in the same change.

## Files in this skill

| File | What | Load when |
|---|---|---|
| `SKILL.md` | Rules, decision guide, file map, drift, checklist | Always |
| `DESIGN.md` | Conventions: design language, contrast, status surfaces, PrimeReact buttons, dialogs, radios/switches, Tailwind gotchas, forms + iOS zoom, scoping, section alternation, layout, motion/a11y, images, visual check | Every UI task |
| `references/tokens.md` | Every `:root` token with its value, dark mode, `@theme` bridge, scoped tokens, typography scale, radius/spacing, shadows, motion, breakpoints | Picking a colour, size, shadow, duration or breakpoint |
| `references/components.md` | Landing foundations, cards, buttons, header/nav/footer, heroes, form styling, PrimeReact overrides, toasts, scrollbar, React UI components | Building or restyling a section or component |
| `references/surfaces.md` | Stylesheet → surface map; sermon reader, sign-in, public forms, admin shell + dashboard | Working on one of those pages |

## The rules

1. **Colours come from tokens** (`var(--color-…)`, the landing aliases, or bridged Tailwind names), never new hex.
   Missing colour → add a token to `globals.css` first. *Why:* one palette; dark-mode neutrals live there.
2. **Contrast is the #1 rule:** every coloured surface sets background **and** text/icon colour together; dark
   surfaces → white, **gold → navy**; AA 4.5:1 / 3:1. *Why:* the most common defect here (`DESIGN.md` "Contrast").
3. **Reuse before inventing:** `.premium-glass-card`, `.process-step-card`, the `.landing-btn` family,
   `.section-label`, `.landing-container`, `.animate-on-scroll`, `PageHero` / `PosterHero`, `LandingHeader` /
   `LandingFooter`, `ui/Button`, `cards/*`, the `Form*` components (`references/components.md`). *Why:* they already
   handle mobile, motion and contrast.
4. **Scope page CSS** under a unique page-root class; portaled styles (dialogs, toasts, dropdown panels) go in
   `globals.css` with a unique prefix; admin uses `admin-*`. *Why:* `landing.css` is ~20k lines and shares the
   cascade with `sermon-detail.css`.
5. **PrimeReact is re-themed, not left on lara:** buttons, dialogs, radios and switches follow `DESIGN.md`.
   *Why:* lara is blue, cramped, and partly reset by Tailwind preflight.
6. **Status feedback uses the global toasts** (`showSuccess` / `showError` …) and their solid semantic colours.
7. **Typography:** Inter for UI (headlines uppercase 800 with negative tracking, body ≥ 500); Fraunces italic only
   for editorial emphasis. *Why:* the two loaded fonts; others aren't.
8. **Public vs admin:** warm gold `#d4a84b` on public pages, antique gold `#c0a067` in the admin. *Why:* two
   deliberate surfaces.
9. **Motion with fallbacks:** durations from `references/tokens.md`; every new animation has a
   `prefers-reduced-motion` fallback in its own sheet; hover lifts off on `hover: none`. *Why:* there is no global
   reset.
10. **Accessibility:** semantic elements, `aria-label` on icon-only buttons, visible `:focus-visible`, ≥ 44px
    touch targets, alt text; inputs stay ≥ 16px on touch (iOS zoom). *Why:* public church site, mostly phones.
11. **Responsive:** use the sheet's existing `max-width` breakpoints (768px main); no horizontal scroll; check ~540px.
12. **Verify visually:** dev server on 3100 (check `lsof -i :3100`), screenshots at desktop and ~540px after the
    last edit. *Why:* lint and tsc can't see contrast or spacing.
13. **Keep this folder true:** a change to a token, shared class or surface pattern updates the matching file here.

## Decision guide

| Need | Use | Where |
|---|---|---|
| Brand colour in CSS | `var(--color-…)` / `var(--primary-gold-accent)` | `references/tokens.md` |
| Brand colour in Tailwind | `bg-primary`, `text-secondary`, …; navy/cream via `bg-[var(--color-navy)]` | `references/tokens.md` "Tailwind v4 bridge" |
| Content card | `.premium-glass-card` | `references/components.md` "Cards" |
| Numbered step / pillar card | `.process-step-card` via `ProcessSteps` | `components/landing/MissionSection.tsx` |
| Public CTA | `.landing-btn .landing-btn-primary` (secondary `.landing-btn-border`) | `references/components.md` "Buttons" |
| Admin/action button | `ui/Button` or `.admin-dash-btn-*` | `references/components.md`, `references/surfaces.md` |
| Section eyebrow | `.section-label` (`-light` on dark) | `references/components.md` |
| Inner-page hero | `PageHero` (photo) / `PosterHero` (event poster) | `references/components.md` "Heroes" |
| Next section in a stack | `.section-alternate-bg` or `.section-dark` | `DESIGN.md` "Section background alternation" |
| Feedback message | `showSuccess` / `showError` | `components/ui/Toast.tsx` |
| Dialog | PrimeReact `Dialog` + unique `className`, global styles | `DESIGN.md` "Dialogs / modals" |
| Form field | `Form*` components (styled by `form-input.css`) | `forms` skill + `DESIGN.md` "Forms" |
| Public form page layout | `.vip-form-container`, `.form-section`, `.form-row` | `references/surfaces.md` "Public forms" |
| Sermon page change | reader classes in `sermon-detail.css` | `references/surfaces.md` "Sermon reader" |
| Admin page | `.admin-dashboard` + `admin-dash-*`, `--admin-*` tokens | `references/surfaces.md` "Admin" |

## Where things live

| Path | What |
|---|---|
| `docs/skills/ui-ux/` | this skill (`DESIGN.md`, `references/`) |
| `src/app/globals.css` | tokens, dark mode, `@theme inline`, PrimeReact + toast overrides, utilities, scrollbar, iOS zoom fix |
| `src/app/layout.tsx` | fonts and CSS import order |
| `src/styles/landing.css`, `sermon-detail.css`, `vip-form.css`, `signin.css`, `admin.css`, `admin-layout.css`, `admin-dashboard.css` | surface styles |
| `src/components/forms/styles/form-input.css`, `src/components/landing/styles/poster-hero.css` | component styles |
| `src/components/ui/`, `src/components/cards/`, `src/components/landing/`, `src/components/layout/` | reusable UI |
| `src/components/providers/ScrollbarAutoHide.tsx`, `src/components/landing/ScrollAnimationProvider.tsx` | scrollbar and scroll-reveal behaviour |

## Legacy and drift

Don't copy any of these.

- `.landing-btn-primary`, `.btn-arrow-gold` and `.btn-primary` put white text on gold, and `--button-text-on-gold` is `#ffffff` → new gold buttons use navy text; migrating them is a separate task.
- `.vip-welcome-card` / `.vip-submit-button` use slate `#0f172a`/`#1e293b`, not the navy token; `.section-number` and `.hero-badge` use `rgba(240, 180, 41, …)` (a different gold) → new code uses the tokens.
- Inline `style={{ … }}` with hex values in some clients (e.g. `VipFormClient.tsx`) → classes + tokens.
- `<img>` instead of `next/image` (lint warnings in `GiveVideoTestimony.tsx`, `ProjectGallery.tsx`, …) → `next/image` with `sizes`.
- Form wrappers mix `w-100` (custom class in `form-input.css`) with Tailwind `w-full` → new markup uses `w-full`.
- `--color-muted` and all `--text-*` tokens are `#000`; older docs listed slate values → `globals.css` wins.
- Removed classes that old docs still describe: `.floating-input`, `.footer-social-btn` (now `.footer-social a`), `.gpu-accelerated`, `.stats-widget`/`.stats-trend` (StatsWidget uses Tailwind), `.video-aside` (now `.video-lightbox`), the gold sign-in branding (now navy), a navy sermon hero (now photographic) → don't reintroduce them.
- The user-level `~/.claude/skills/gwc-nextjs-patterns` skill still points at the deleted `DESIGN_SYSTEM.md` → this folder wins.

## Checklist before shipping

- [ ] No new hex colours in declarations: `git diff -U0 -- src | grep -E "^\+[^*/]*#[0-9a-fA-F]{3,8}\b"` shows only token definitions in `globals.css`
- [ ] Every new coloured surface sets background + text/icon colour; gold surfaces use navy text
- [ ] New page CSS scoped under a unique root class; portaled styles global with a unique prefix
- [ ] PrimeReact buttons/dialogs/radios follow `DESIGN.md`
- [ ] `:focus-visible`, aria-labels on icon buttons, reduced-motion fallback for new animation
- [ ] Screenshots at desktop and ~540px taken after the last edit
- [ ] A changed token, shared class or surface pattern is updated in this folder

## Related skills

- [`forms`](../forms/SKILL.md): field components and their behaviour
- [`routing`](../routing/SKILL.md): where page CSS is imported
- [`coding-style`](../coding-style/SKILL.md)
