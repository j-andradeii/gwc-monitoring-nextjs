# GWC Design Conventions

The practical rules for styling this app. Part of the `ui-ux` skill (`docs/skills/ui-ux/`); values live in
`references/tokens.md`, reusable classes in `references/components.md`, per-page styles in
`references/surfaces.md`. Updated 2026-11-21 against `src/app/globals.css` and `src/styles/*.css`.

The recurring failures here come from **overriding PrimeReact's `lara-light-blue` theme halfway** — setting a
background but not the text/icon colour, or accepting lara's blue, cramped defaults. Follow these to avoid
low-contrast, off-brand or cramped UI.

> Tokens: `src/app/globals.css` `:root`. Public styles: `src/styles/landing.css` (page-scoped). `globals.css` is
> imported **after** the PrimeReact theme in `src/app/layout.tsx`, so its overrides win at equal specificity.

## Design language

- **Premium modern, sanctuary-inspired:** warm gold light (`#d4a84b`) on navy depth (`#1a2744`), royal purple
  (`#4a3c6e`) and burgundy (`#6b2c3a`) accents, cream (`#f5f0e6`) and ivory (`#faf8f3`) bands.
- **Glass for elevation**, not decoration (`blur(12px)` over white 85%): cards, header, nav, badges.
- **Bold type:** headlines UPPERCASE, 800, negative tracking (Inter). **Fraunces serif italic** only for
  reverent/editorial emphasis (sermon title `em`, callouts, scripture, big numerals).
- **Tactile motion:** cards lift 8–12px with a warm gold glow or a gold bottom bar; buttons lift 2px.
- **Two surfaces, one language:** public = cream + warm gold + glass; admin = dark navy chrome + muted
  **antique gold** `#c0a067`. Don't mix the golds.

## Brand tokens (quick table)

| Purpose | Token | Value |
|---|---|---|
| Primary / gold accent | `--color-primary` | `#d4a84b` |
| Gold text on white / hover dark | `--color-primary-dark` | `#b8923f` |
| Navy (depth, headers, dark bands) | `--color-navy` | `#1a2744` |
| Purple (secondary / info) | `--color-secondary` | `#4a3c6e` |
| Burgundy (accent / error) | `--color-error` | `#6b2c3a` |
| Cream (warm light band) | `--color-cream` | `#f5f0e6` |
| Ivory (alternate band) | `--color-ivory` | `#faf8f3` |
| Invalid field border | `--velvet` | `#DA4453` |
| Heading / body text | `--text-heading`, `--text-primary`, `--text-secondary` | `#000` |

Semantic status surfaces: **success** green `#15803d`, **error** burgundy `#6b2c3a`, **info** purple `#4a3c6e`,
**warn** gold `#d4a84b`. Use tokens, never new hex values; if a colour is missing, add a token first.
Tailwind can use the bridged names (`bg-primary`, `text-secondary`, …); navy/cream/ivory aren't bridged →
`bg-[var(--color-navy)]`.

## Contrast

**The #1 rule: never put text on a background of the same or near tone.** Every coloured surface declares
BOTH its `background` AND its text/icon `color` together — don't set one and inherit the other.

- Aim for WCAG AA: ≥ 4.5:1 body text, ≥ 3:1 large/bold text.
- **Dark** surface (navy, burgundy, purple, dark green) → **white** text and white icons.
- **Gold** surface (`#d4a84b`) → **navy** (`#1a2744`) text and navy icons. White-on-gold is ≈ 1.9:1 — never.
- Mid-tone "light" tints (`--color-error-light` `#8e4a5a`, `--color-accent-light`) are not safe with dark or
  white text — don't use them as text backgrounds.
- Gold as **text** on white: use `--color-primary-dark` or large bold text.
- Photographic heroes (sermon reader, sermon slides) carry contrast with a scrim: keep the scrim under the type
  column at ≥ 0.80 (see `references/surfaces.md`).
- Known exception to fix, not copy: `.landing-btn-primary` and `.btn-primary` put white text on gold.

## Status surfaces

Toasts, badges, alerts: solid semantic background + explicit text and icon colour. Global in `globals.css`
(`.p-toast …`):

- success → `#15803d` bg, white text/icons
- error → burgundy bg, white text/icons
- info → purple bg, white text/icons
- warn → gold bg, **navy** text/icons

lara's per-severity selectors are equally specific, so status overrides use `!important` on
`background`/`color`. Icons may render as SVG — set both `color` and `fill`. Show toasts explicitly with
`showSuccess` / `showError` / `showWarning` / `showInfo` (`components/ui/Toast.tsx`); the wrapper is passive.

## PrimeReact buttons

lara defaults to blue and **jams the icon against the label**. For every styled PrimeReact button:

- Icon gap: `.your-scope .p-button .p-button-icon-left { margin-right: 0.5rem; }`
- On-brand colours: primary = gold bg + **navy** text; outline = navy border + navy text (never lara blue);
  text/link = gold (`--color-primary-dark`).
- Comfortable size: `padding: 0.6rem 1.1rem; border-radius: 8–9px; font-weight: 600`.
- **No fixed `height`** on a button meant to align with inputs — it ends up shorter than the inputs. Match height
  with vertical `padding` and let the row's `align-items` align them.
- Always a hover state; visible `:focus-visible`.

Public CTAs use the `.landing-btn` pill family instead (primary gold, secondary navy `.landing-btn-border` /
`.landing-btn-solid-dark`); admin uses `ui/Button` or the `.admin-dash-btn-*` classes.

## Dialogs / modals

PrimeReact dialogs render in a **portal at `<body>`** — page-scoped styles can't reach them. Style each dialog
globally with a unique class prefix passed via `className` (e.g. `.lf-song-dialog`).

- **Header:** navy bg + white title; the close ✕ must be white:
  `.your-dialog .p-dialog-header .p-dialog-header-icon, .your-dialog .p-dialog-header-close-icon { color: #fff; }`.
- **Header corners:** `.p-dialog` is `rounded-xl` (12px) but lara keeps the header at 6px top radii, so a navy
  header looks clipped. Put `overflow: hidden` on the frame and set the header's top radii to 12px.
- **Header padding:** Tailwind v4 preflight zeroes lara's header padding. Set `padding: 1.25rem 1.5rem` and
  `gap: 0.75rem` on your scoped header; truncate long titles (`min-width: 0; overflow: hidden;
  text-overflow: ellipsis; white-space: nowrap` on `.p-dialog-title`).
- **Content:** real padding (≈ `1.25rem 1.5rem`); long content scrolls **inside** (`max-height: 45vh;
  overflow: auto`), never by growing past the viewport.
- **Footer:** `border-top`, padding, spaced and sized buttons; primary action = gold, on the right.

## Radio buttons and switches

- A PrimeReact `<RadioButton>` renders lara blue when checked. Brand it (reference: `.sod-radio-input` in
  `vip-form.css`): unchecked white box with a navy 45% 2px border; **checked = gold fill + gold border + white
  inner dot**; focus ring `outline: 2px solid var(--color-primary); outline-offset: 2px`.
- The checked class is **`.p-highlight`** — for RadioButton and InputSwitch alike (not `.p-radiobutton-checked`
  / `.p-inputswitch-checked`).
- Labels are clickable (`htmlFor` / `inputId`) and aligned with flex `align-items: center`, not a `top: Npx`
  nudge; don't pin the row to a tiny fixed height (crops the label, shrinks the touch target).
- Brand an InputSwitch "on": `.scope .p-inputswitch.p-highlight .p-inputswitch-slider { background: var(--color-primary) !important; }`.

## PrimeReact + Tailwind gotchas

- **Tailwind v4 preflight resets `::before`/`::after` margins to 0**, breaking PrimeReact parts that centre a
  pseudo-element with margin — the InputSwitch knob overflows as a "notch". Global fix (in `globals.css`):
  `.p-inputswitch .p-inputswitch-slider::before { margin-top: -0.625rem; }`.
- Preflight also zeroes some lara paddings (dialog header) — restate them in your scoped rule.
- Re-theme PrimeReact through tokens (`@apply bg-primary`, `var(--color-*)`), never raw hex.
- Heavy PrimeReact components on server-rendered pages belong in client components.

## Forms

- Field components (`src/components/forms`) are pre-styled by `form-input.css`: black labels (700), darker resting
  border `#6b7280`, gold focus border + `ring-primary/20`, **velvet** `#DA4453` invalid border (not burgundy),
  compact padding inside `.input-container`.
- Required mark: `<span className="form-required">*</span>` (via `showRequired`).
- Error text comes from `FormError` (`small.p-error[data-form-error]`); custom groups mark their wrapper with
  `data-form-error` so scroll-to-first-error finds them.
- **iOS zoom:** on touch / ≤ 1024px every text control is forced to `font-size: 16px !important` (Safari zooms
  on focus below 16px and never zooms back). Don't lower it, and don't use `maximum-scale=1` /
  `user-scalable=no` instead (blocks pinch-zoom).

## Scoping

- Page styles sit under a unique page-root class (e.g. `.lyric-formatter-page …`, `.ways-to-give-page …`,
  `.sod-enrollment-page …`) in that page's stylesheet or a labelled section of `landing.css`. No generic class
  names: `landing.css` and `sermon-detail.css` load together and cascade-order collisions have caused
  client-navigation bugs. Use a unique prefix (`.sermon-reader-grid`, not `.sermon-grid`).
- Shared styles that must reach portaled DOM (dialogs, toasts, dropdown panels) go in `globals.css` with a unique
  prefix.
- Admin classes are prefixed `admin-layout-*`, `admin-header-*`, `admin-user-menu`, `admin-dash-*`.
- New keyframes are prefixed with the surface (`sermonFadeUp`, `signinShake`, `lf-spin`).

## Section background alternation

Stacked full-width sections **alternate tones** — never two same-coloured sections back to back.

| Tone | Token | Use |
|---|---|---|
| Base | `--background-section` `#ffffff` | default section |
| Alternate light | `--color-ivory` / `--color-cream` | next section (`.section-alternate-bg`) |
| Alternate dark | `--color-navy` / `#000` | high-contrast break (`.section-dark` / `.section-black`, white text) |

A card on an alternate (tinted) band **floats by elevation, not a border**: drop the 1px border and use the layered
shadow (e.g. `.event-register-section` is cream, its `.vip-form-container` is borderless and elevated).

## Layout

- Container `.landing-container` (1100px, 24px gutters). Grids: 20–24px gaps, items top-aligned
  (`justify-content: flex-start`) so icons and titles line up across cards of different heights.
- Major cards ~40px inner padding (24px on mobile). Mobile is single column.
- Heroes on mobile use a fixed height with `contain: strict; overflow: clip` (650px carousel, 500px inner
  heroes) to avoid iOS address-bar reflow.

## Motion and accessibility

- Durations: 0.2s micro, 0.25s buttons/links, 0.3s menus, 0.4s cards, 0.5s premium glass
  (`cubic-bezier(0.4, 0, 0.2, 1)`).
- Every new animation ships a `@media (prefers-reduced-motion: reduce)` fallback in its own sheet (there is no
  global reset). Never convey state only through animation. Disable hover lifts under `@media (hover: none)`.
- Smooth scroll is desktop-only (≥ 769px, motion allowed) — don't set it globally.
- Semantic elements, `aria-label` on icon-only buttons, visible `:focus-visible` (gold outline, 2–3px offset),
  touch targets ≥ 44px, `alt` on content images (`alt=""` + `aria-hidden` on decorative backdrops).
- The scrollbar is auto-hide (thumb visible only while scrolling, via `ScrollbarAutoHide`); don't add an
  always-on scrollbar.

### Tab-panel animation gotcha
`ScrollAnimationProvider` observes `.animate-on-scroll` elements once, on mount. Panels that mount later (tabs,
content switchers) must reveal their cards on mount (e.g. add `.animate-visible` in a `requestAnimationFrame`),
not by starting a new observer.

## Images

- `next/image` for content (`sizes` on responsive images); the Blob host and `placehold.co` are in
  `next.config.ts` `remotePatterns`.
- With `placehold.co`, add a raster extension before `?text=` (`…/1000x800/1a2744/d4a84b.png?text=…`); bare URLs
  serve SVG, which the optimizer rejects. Don't enable `dangerouslyAllowSVG`.
- Event posters use `PosterHero` (never cropped); scenic photos use `PageHero`.

## Verify visually

CSS, lint and tsc don't catch contrast or cramped spacing. For any UI change, run the dev server (port **3100**;
Next 16 allows only one `next dev` — check `lsof -i :3100` first) and screenshot desktop and a narrow (~540px)
width before calling it done.
