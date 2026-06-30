# GWC Design Conventions

Practical UI rules for this app. The recurring failures here come from **overriding
PrimeReact's `lara-light-blue` theme halfway** — setting a background but not the
text/icon colour, or accepting lara's blue/cramped defaults. Follow these to avoid
low-contrast, off-brand, or cramped UI.

> Tokens live in `src/app/globals.css` `:root`. Public-page styles live in
> `src/styles/landing.css` (page-scoped). globals.css is imported **after** the
> PrimeReact theme in `src/app/layout.tsx`, so overrides there win at equal specificity.

## Brand tokens

| Purpose | Token | Value |
|---|---|---|
| Primary / gold accent | `--color-primary` | `#d4a84b` |
| Gold (hover / darker) | `--color-primary-dark` | `#b8923f` |
| Navy (depth, headers, dark bands) | `--color-navy` | `#1a2744` |
| Purple (secondary / info) | `--color-secondary` | `#4a3c6e` |
| Burgundy (accent / error) | `--color-error` | `#6b2c3a` |
| Cream (warm light band) | `--color-cream` | `#f5f0e6` |
| Heading text | `--text-heading` | `#020617` |
| Secondary text | `--text-secondary` | `#1e293b` |

Semantic palette: **success** green `#15803d`, **error** burgundy `#6b2c3a`,
**info** purple `#4a3c6e`, **warn** gold `#d4a84b`.

## Contrast (the #1 rule)

**Never put text on a background of the same/near tone.** Every coloured surface
must declare BOTH its `background` AND its text/icon `color` together — don't set one
and inherit the other.

- Aim for WCAG AA: ≥ 4.5:1 for body text, ≥ 3:1 for large/bold text.
- On a **dark** surface (navy, burgundy, purple, dark green) → **white** text + white icons.
- On a **gold** surface (`#d4a84b`) → **navy** (`#1a2744`) text + navy icons. White-on-gold fails contrast — never use it.
- Mid-tone "light" tints (e.g. `--color-error-light` `#8e4a5a`) are NOT safe with either dark or white text — avoid them as text backgrounds.

## Status surfaces (toasts, badges, alerts)

Solid semantic background + explicit text/icon colour. This is global in
`globals.css` (`.p-toast …`):

- success → green bg, white text/icons
- error → burgundy bg, white text/icons
- info → purple bg, white text/icons
- warn → gold bg, **navy** text/icons

Because lara's per-severity selectors are equally specific, status overrides use
`!important` on `background`/`color` (matching the codebase's existing `!important`
overrides). Icons may render as SVG — set both `color` and `fill`.

## PrimeReact buttons

lara defaults to blue and **jams the icon against the label**. For every styled button:

- Add an icon gap: `.your-scope .p-button .p-button-icon-left { margin-right: 0.5rem; }`
- On-brand colours: primary = gold bg + navy text; outline = navy border + navy text (never lara blue); text/link = gold (`--color-primary-dark`).
- Comfortable size: `padding: 0.6rem 1.1rem; border-radius: 8–9px; font-weight: 600`.
- **Do NOT set a fixed `height`** on a button meant to align with inputs — it ends up shorter than the inputs. Match height via vertical `padding` instead and let the row's `align-items` align them.
- Always provide a hover state.

## PrimeReact + Tailwind gotchas

- **Tailwind v4 preflight resets `::before`/`::after` to `margin: 0`**, which breaks any PrimeReact component that centers a pseudo-element via margin — notably the **InputSwitch knob** (it overflows the track and renders as a "notch"). Fix globally: `.p-inputswitch .p-inputswitch-slider::before { margin-top: -0.625rem; }`.
- InputSwitch's checked state class is **`.p-highlight`** (not `.p-inputswitch-checked`). To brand the "on" colour: `.scope .p-inputswitch.p-highlight .p-inputswitch-slider { background: var(--color-primary) !important; }`.

## Dialogs / modals

- Header: navy bg + white title; **the close ✕ must be white** — `.your-dialog .p-dialog-header .p-dialog-header-close-icon { color: #fff; }` (lara leaves it dark on a dark header).
- Content: real padding (`≈1.25rem`). Long lists scroll inside the dialog (`max-height: 45vh; overflow:auto`), not by growing the dialog past the viewport.
- Footer: separate it with `border-top`, give it padding, and space + size the buttons (see Buttons). Primary action = gold, on the right.
- Dialogs/overlays render in a **portal at `<body>`**, so their styles can't live under a page-scoped root — style them globally with a unique class prefix (e.g. `.lf-…`) passed via the component's `className`.

## Scoping

- Page styles: gate everything under a unique page-root class (e.g. `.lyric-formatter-page .…`) appended to `landing.css`. Avoid generic class names (cascade-order collisions between the two public stylesheets have caused client-nav bugs — use a unique prefix).
- Shared component styles that must reach portaled DOM (dialogs, toasts, dropdown panels) go in `globals.css` with a unique prefix.

## Verify visually

CSS/lint/tsc won't catch contrast or cramped spacing. For any UI change, run the dev
server (the team's runs on **port 3100**; Next 16 allows only one `next dev`) and
screenshot with Playwright at both desktop and a narrow (~540px) width before calling
it done.
