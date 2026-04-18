# GWC Monitoring — Full-Context Design System

> Authoritative design-system reference for the **gwc-monitoring-nextjs** project (Gateway Worship Centre).
> Generated from the actual source: `src/app/globals.css`, `src/styles/landing.css`, `src/styles/signin.css`, `src/styles/vip-form.css`, and the component library under `src/components/`.
>
> Design language: **Premium, sanctuary-inspired, warm-glass modern** — frosted glass cards, bold uppercase headlines, tactile hover "lift + gold glow", and a warm-gold / navy / royal-purple / burgundy palette drawn from worship-sanctuary ambience.

---

## 0. Stack Context

| Layer | Technology |
|---|---|
| Framework | **Next.js 16** (App Router) + **React 19** |
| Styling | **Tailwind CSS v4** (inline `@theme`) + hand-authored CSS (`landing.css` ~11k LOC) |
| UI Kit | **PrimeReact 10.9** + **PrimeIcons 7** (overridden to match brand tokens) |
| Fonts | **Inter** (variable, weights 100–900) via `--font-inter` / `--font-sans` |
| Server state | **TanStack Query v5** (`src/hooks/queries/`, `src/hooks/mutations/`, `QueryProvider`) |
| Client state | **Zustand 5** — only `user`, `loading`, `breadcrumbs`, `sidebar` stores |
| Forms | **React Hook Form 7** + **Zod 4** (`z.date({ message })`, NOT `required_error`) |
| Charts | Chart.js 4 + react-chartjs-2 |
| Testing | Playwright 1.58 |

**Style file layout**
```
src/app/globals.css              # Tokens (:root), @theme inline, PrimeReact overrides, base utilities
src/styles/landing.css           # ~11k LOC of public-page components (glass cards, heroes, sections)
src/styles/signin.css            # Auth screens
src/styles/vip-form.css          # VIP/inquiry form variant
src/components/forms/styles/     # form-input.css (FormInput styling)
```

---

## 1. Design Philosophy

Three pillars power every surface:

1. **Glassmorphism** — frosted translucence (`backdrop-filter: blur(12px)`) on cards, headers, nav, badges, and indicators. Content feels suspended above warm cream.
2. **Bold Typography** — Inter **800+** weight, **UPPERCASE** headlines, tight negative letter-spacing (`-1.5px` / `-1.8px`). Headlines dominate; body copy is 15px / weight 500 for readability.
3. **Dynamic Motion** — every interactive element lifts (`translateY(-2px → -12px)`), glows gold, and reveals a gradient bottom-bar on hover. Transitions run on `cubic-bezier(0.4, 0, 0.2, 1)` at 0.25s–0.5s.

### Sanctuary Palette Motivation
- **Warm Gold (`#d4a84b`)** — stage lighting, primary accent, all interactive gold glow
- **Deep Navy (`#1a2744`)** — depth & reverence, footer, dark sections
- **Royal Purple (`#4a3c6e`)** — secondary accent lighting
- **Rich Burgundy (`#6b2c3a`)** — alert / accent
- **Soft Cream (`#f5f0e6`)** — main page background; welcoming warmth

---

## 2. Color Tokens (source of truth: `globals.css` lines 12–100)

### 2.1 Brand — Warm Gold
| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#d4a84b` | Primary accent, gradients, interactive accents |
| `--color-primary-light` | `#e5c47a` | Hover/glow states |
| `--color-primary-dark` | `#b8923f` | Active/pressed states, emphasized text |
| `--primary-gold-accent` | `#d4a84b` | Alias used throughout `landing.css` |

### 2.2 Secondary — Royal Purple
| Token | Hex |
|---|---|
| `--color-secondary` | `#4a3c6e` |
| `--color-secondary-light` | `#6b5a8e` |
| `--color-secondary-dark` | `#352a52` |
| `--color-purple` | `#4a3c6e` |

### 2.3 Accent — Rich Burgundy
| Token | Hex |
|---|---|
| `--color-accent` | `#6b2c3a` |
| `--color-accent-light` | `#8e4a5a` |
| `--color-accent-dark` | `#4d1f2a` |
| `--color-burgundy` | `#6b2c3a` |

### 2.4 Semantic
| Token | Hex | Notes |
|---|---|---|
| `--color-success` | `#22C55E` | Also `-light: #4ADE80`, `-dark: #16A34A` |
| `--color-warning` | `#d4a84b` | Gold = warning |
| `--color-error` | `#6b2c3a` | Burgundy = error |
| `--color-info` | `#4a3c6e` | Purple = info |
| `--velvet` | `#DA4453` | Used for invalid-state borders on inputs |

### 2.5 Surfaces & Text
| Token | Hex / Value |
|---|---|
| `--color-background` / `--color-cream` / `--background-main` | `#f5f0e6` |
| `--color-ivory` | `#faf8f3` |
| `--color-surface` / `--background-section` | `#ffffff` |
| `--color-foreground` / `--text-primary` | `#0d1424` |
| `--text-heading` | `#020617` |
| `--text-secondary` | `#1e293b` |
| `--color-muted` | `#1f2937` |
| `--color-border` | `#c8bfa8` |
| `--border-color-light` | `#ddd5c4` |

### 2.6 Dark / Navy Surfaces
| Token | Hex |
|---|---|
| `--color-navy` | `#1a2744` |
| `--color-navy-dark` | `#151e32` |
| `--footer-background` | `#1a2744` |

### 2.7 Glass & Contrast
| Token | Value |
|---|---|
| `--color-glass` | `rgba(255, 255, 255, 0.85)` |
| `--color-glass-dark` | `rgba(26, 39, 68, 0.85)` |
| `--color-contrast-dark` | `#000000` |
| `--color-contrast-light` | `#ffffff` |
| `--header-background` | `rgba(245, 240, 230, 0.95)` |

### 2.8 Shadow Tokens
| Token | Value |
|---|---|
| `--shadow-color-soft` | `rgba(26, 39, 68, 0.14)` |
| `--shadow-color-medium` | `rgba(26, 39, 68, 0.22)` |
| `--gold-shadow-hover` | `rgba(212, 168, 75, 0.25)` |

### 2.9 Dark Mode (auto via `prefers-color-scheme`)
| Token | Light | Dark |
|---|---|---|
| `--color-background` | `#f5f0e6` | `#1A1A2E` |
| `--color-foreground` | `#0d1424` | `#F5F5F5` |
| `--color-muted` | `#1f2937` | `#9CA3AF` |
| `--color-border` | `#c8bfa8` | `#374151` |
| `--color-surface` | `#ffffff` | `#1F2937` |

---

## 3. Typography

### Fonts
```css
--font-sans: var(--font-inter), 'Inter', system-ui, -apple-system, sans-serif;
--font-display: var(--font-inter), 'Inter', system-ui, sans-serif;
```
`Inter` is loaded once as a CSS variable (`--font-inter`) and reused for body + headings.

### Hierarchy
| Role | Size | Weight | Tracking | Transform |
|---|---|---|---|---|
| Hero Title | 56px | 800 | −1.8px | UPPERCASE |
| Campaign Title (Arise & Build) | 52px | 800 | −1.8px | UPPERCASE |
| Section Title | 32–36px | 800 | −1.5px | UPPERCASE |
| Card Title | 24px | 800 | −0.5px | UPPERCASE |
| Step Title | 20px | 700 | −0.5px | UPPERCASE |
| Section Label (eyebrow) | 11–12px | 800–900 | +2.5px | UPPERCASE |
| Body | 15px | 500 | normal | regular |
| Meta | 12–13px | 500 | normal | regular |

### Tracking Tokens
```css
--letter-spacing-tight: -1.5px;    /* section headers */
--letter-spacing-tighter: -1.8px;  /* hero / campaign */
--letter-spacing-normal: -0.5px;   /* card titles */
```
Utility classes: `.heading-tight`, `.heading-tighter`.

### Line-Heights
| Context | LH |
|---|---|
| Hero | 1.05 |
| Subhead | 1.1–1.2 |
| Tight | 1.5 |
| Body | 1.6–1.7 |

### Responsive Scaling
| Element | Desktop | Tablet | Mobile |
|---|---|---|---|
| Hero H1 | 56px | 42px | 32px |
| Campaign H2 | 52px | 42px | 36px |
| Section H2 | 36px | 32px | 28px |
| Card H3 | 24px | 22px | 20px |
| Body | 15px | 15px | 14px |

---

## 4. Layout System

### Layout Tokens
```css
--sidebar-width: 280px;
--sidebar-collapsed-width: 80px;
--header-height: 64px;
```

### Containers
| Container | Max-width | Padding | Usage |
|---|---|---|---|
| `.landing-container` | 1100px | 0 24px | Public / landing |
| `.container-custom` (Tailwind) | `max-w-7xl` (80rem) | 16 / 24 / 32 px responsive | Admin dashboard |
| `.landing-full-width` | 100% | — | Full-bleed sections |
| Content modal | 700px | 40px | Forms / dialogs |

### Section Padding
| Type | Desktop | Tablet | Mobile |
|---|---|---|---|
| Hero | 120px 0 | 100px 0 | 80px 0 |
| Standard | 70px 0 | 60px 0 | 50px 0 |
| Compact | 50px 0 | 40px 0 | 32px 0 |

### Admin Shell
```css
.sidebar           { width: var(--sidebar-width); transition: width 0.3s; }
.sidebar.collapsed { width: var(--sidebar-collapsed-width); }
.main-content      { margin-left: var(--sidebar-width); min-height: 100vh; }
.header            { left: var(--sidebar-width); height: var(--header-height); position: fixed; }
/* Below 1024px the sidebar becomes a slide-in drawer (transform: translateX(-100%)) */
```

### Layout Principles
1. **Top-align** grid items (`justify-content: flex-start`) so icons/titles align across varying heights.
2. **Generous interior padding** — 40px in primary cards.
3. **24px gap** for flex/grid systems (16px on mobile).
4. **Mobile-first collapse**: cards stack 1-col; grids shrink from 3→2→1.

---

## 5. Component Library

### 5.1 Premium Glass Card
The signature component. Used for every substantial content block on public pages.
```css
.premium-glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  border: 1px solid rgba(212, 168, 75, 0.20);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}
/* Lift + gold glow */
.premium-glass-card:hover {
  transform: translateY(-12px);
  background: #ffffff;
  box-shadow: 0 24px 60px rgba(212, 168, 75, 0.15),
              0 12px 24px rgba(0, 0, 0, 0.06);
  border-color: #ffffff;
}
/* ::before — diagonal sheen; ::after — gold bottom bar, scaleX(0→1) on hover */
```

### 5.2 Premium Stat Card (dark variant)
```css
.premium-stat-card {
  background: rgba(26, 39, 68, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### 5.3 Process Step Card
- White card, radius 20px, padding 32px 24px
- Step number badge: 36px circle, gold gradient, absolute top -16px
- Step icon: 64px rounded-square (radius 16px) that morphs to circle + `rotate(-10deg) scale(1.1)` on hover
- Connectors: 2px gold gradient line with centered icon chip between steps

### 5.4 Event / Sermon / Ministry / Service Cards
| Card | Radius | Hover |
|---|---|---|
| `.event-card` | 24px | `translateY(-8px)` + shadow boost; date badge top-left (navy pill, day+month) |
| `.sermon-card` | 20px | Lift + overlay on thumbnail; duration pill bottom-right |
| `.ministry-card` | 12px, aspect 4/3 | Image `scale(1.08)` + brightness/saturation; navy gradient overlay |
| `.service-info-card` | 12px | Border-heavy; inverts to navy fill on hover |
| `.service-detail-item` | 8px | 5%-white glass; gold border + `scale(1.02)` on hover |

### 5.5 Stats Widget
```
.stats-widget   — 16px radius, flex row, 24px padding, border var(--color-border)
.stats-value    — 28px / 700
.stats-title    — 14px / 500 / muted
.stats-icon-container — 48px circle, 10%-gold background
.stats-trend.up/.down/.neutral — success / error / muted
```

### 5.6 Buttons (Full Catalog)

All landing buttons share:
```css
.landing-btn {
  border-radius: 50px;   /* full pill */
  padding: 14px 32px;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  transition: all 0.25s ease;
}
.landing-btn:hover   { transform: translateY(-2px); }
.landing-btn:hover i { transform: translateX(3px); }
```

| Class | Default | Hover |
|---|---|---|
| `.landing-btn-primary` | Gold gradient (`#d4a84b → #c9973f`) | Reversed gradient + enhanced gold glow |
| `.landing-btn-outline` | Gold outline, transparent | Solid gold fill |
| `.landing-btn-border` | Navy outline | Solid navy |
| `.landing-btn-border-light` | White outline | Solid white → navy text |
| `.landing-btn-border-gold` | Gold outline (heavier weight) | Solid gold |
| `.landing-btn-solid-dark` | Solid navy | Transparent + navy text |
| `.landing-btn-solid-gold` | Solid gold | Transparent + gold text |
| `.landing-btn-light` | Solid white | White w/ larger glow |
| `.landing-btn-light-outline` | 8%-white glass + white border | Solid white |
| `.btn-arrow-gold` | Gold gradient 6px radius | Lift + arrow `translateX(4px)` |
| `.btn-arrow-white` | Solid white, navy text | Lift + arrow slide |
| `.btn-contrast` | Black solid + bold uppercase | Inverted (white/black) |
| `.btn-contrast-outline` | Black outline | Solid black |
| `.btn-contrast-light` | White solid | Transparent + white text |
| `.btn-gold-border` | Gold outline uppercase | Solid gold |

Admin/utility Tailwind buttons (`globals.css`): `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-ghost` — 8px radius, filled/outlined variants of tokens.

### 5.7 `<Button />` React Component (`src/components/ui/Button.tsx`)
Thin wrapper around PrimeReact `<Button>`. Exposes:
- `variant`: `primary | secondary | success | danger | warning | info | help | text | link | outlined`
- `size`: `small | normal | large` (maps to `p-button-sm` / `p-button-lg`)
- Flags: `loading`, `disabled`, `raised`, `rounded`, `text`, `outlined`, `fullWidth`
- Plus `icon`, `iconPos`, `badge`, `tooltip`
- `IconButton` export for icon-only round buttons

### 5.8 Form Components (`src/components/forms/`)
Every form input follows the same RHF+PrimeReact pattern: `<Controller>` wrapping a PrimeReact input, paired with `<FormError>`. Shared props: `name`, `label`, `placeholder`, `showRequired`, `showLabel`, `className`, `inputClassName`, `labelClassName`, `isFloating`.

| Component | Underlying | Special features |
|---|---|---|
| `FormInput` | `InputText` | integer-only, phone format, digits/spaces/+/-, credit card formatter, paste interception, floating label |
| `FormTextarea` | `InputTextarea` | rows, auto-resize |
| `FormInputNumber` | `InputNumber` | currency / decimals |
| `FormSelect` | `Dropdown` | options, filter |
| `FormCalendar` | `Calendar` | date / range |
| `FormCheckbox` | `Checkbox` | — |
| `FormRadioButton` | `RadioButton` | — |
| `FormPassword` | `Password` | toggle mask |
| `FormSocialMedia` | group input | social-handle prefix icons |
| `FormError` | `<span>` | consistent error styling |

Error integration uses `getNestedError(errors, path)` so dot-paths (`address.street`) work out of the box.

### 5.9 Card Components (`src/components/cards/`)
- **`CardDiv`** — generic white card, `padding: none|small|medium|large`, optional `shadow`, `border`, `hover`, `onClick` (keyboard-accessible).
- **`CardDivTitle`** — card header pairing
- **`MemberCard`**, **`ScriptureCard`**, **`StatsWidget`** — domain-specific

### 5.10 Layout Components (`src/components/layout/`)
`AdminLayout`, `Sidebar`, `Header`, `Footer`, `Breadcrumbs` — wire `useLoadingStore` for `<PageSpinner>` and `useSidebarStore` for collapse state. Keep `useLoadingStore` — `AdminLayout` and `AuthGuard` both depend on it; `api-client` increments/decrements request counts.

### 5.11 UI Primitives (`src/components/ui/`)
- `Button`, `IconButton`
- `Spinner` / `PageSpinner`
- `Toast` — **pure** PrimeReact wrapper. Callers MUST explicitly invoke `showSuccess()` / `showError()` in mutation callbacks (no auto-event-dispatch pattern anymore)
- `DownloadQRButton`

---

## 6. Effects & Shadows

### Shadow Ladder
| Name | Value | Use |
|---|---|---|
| Minimal | `0 1px 0 rgba(0,0,0,0.05)` | Subtle separators |
| Soft | `0 4px 24px rgba(0,0,0,0.06–0.12)` | Card resting state |
| Medium | `0 10px 20px rgba(0,0,0,0.06)` | Elevated / floating |
| Heavy | `0 20px 40px rgba(0,0,0,0.06–0.1)` | Hover elevation |
| Gold Glow | `0 24px 60px rgba(212,168,75,0.15)` | Premium card hover |
| Dropdown | `0 10px 40px rgba(0,0,0,0.08)` | Menus / popovers |
| Image Hover | `0 20px 50px rgba(0,0,0,0.12)` | Gallery |

### Glass Intensity
| Level | Backdrop | Background |
|---|---|---|
| Heavy | `blur(12px)` | `rgba(255,255,255,0.85)` |
| Medium | `blur(10px)` | `rgba(255,255,255,0.5)` |
| Light | `blur(8px)` | `rgba(255,255,255,0.3)` |
| Minimal | `blur(4px)` | `rgba(255,255,255,0.08)` |

### Gold Progress Bar (reused across cards)
```css
.card::after {
  content: '';
  position: absolute; bottom: 0; left: 0;
  width: 100%; height: 4px;
  background: linear-gradient(90deg, #d4a84b, #f9d976);
  transform: scaleX(0); transform-origin: left;
  transition: transform 0.4s ease;
}
.card:hover::after { transform: scaleX(1); }
```

---

## 7. Motion & Animation

### Keyframes (from `globals.css`)
`fadeIn`, `fadeOut`, `slideUp`, `slideDown`, `slideInLeft`, `slideInRight`, `spin`, `pulse` — all exposed as utility classes `.animate-*` (0.3s ease-out by default; `.animate-spin` 1s linear infinite; `.animate-pulse` 2s cubic-bezier).

### Transition Standards
| Name | Value | Use |
|---|---|---|
| Fast | `0.2s ease` | icons, underlines |
| Standard | `0.25s ease` | buttons, links, inputs |
| Smooth | `0.3s ease` | dropdowns, menus |
| Elegant | `0.4s ease` | card transforms |
| Premium | `0.5s cubic-bezier(0.4, 0, 0.2, 1)` | glass cards |

### Scroll Reveal
```css
.animate-on-scroll { opacity: 0; transform: translateY(20px); transition: .5s ease-out; will-change: opacity, transform; }
.animate-on-scroll.visible { opacity: 1; transform: translateY(0); }
/* Stagger for grids */
.animate-on-scroll:nth-child(n) { transition-delay: n * 0.05s; }
```
Driven by `<ScrollAnimationProvider>` (`src/components/landing/ScrollAnimationProvider.tsx`) using `IntersectionObserver`.

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
Smooth scroll is enabled **only** above 769px AND when reduced-motion is `no-preference`.

### Performance
- `transform: translate3d(0,0,0)` + `backface-visibility: hidden` for GPU-accelerated elements
- `will-change: opacity, transform` applied *only* to about-to-animate nodes
- `contain: strict; overflow: clip;` on hero section to constrain repaints (also fixes iOS address-bar height issues with `height: 650px` below 768px)

---

## 8. Sectional Patterns

### 8.1 Landing Header
```css
.landing-header {
  position: fixed; top: 0; left: 0; right: 0;
  height: 70px; z-index: 1000;
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
```

### 8.2 Nav Link Underline
Animated gold underline grows `width: 0 → 100%` on hover/active (0.25s ease). Active state also switches text color to `--color-primary`.

### 8.3 Dropdown Menu
White 12px-radius panel, 40px-blur dropdown shadow, triangle arrow via rotated pseudo-element. Items: 12/16 padding, 8px radius, `pi pi-*` icon 16px (opacity 0.7 → 1), hover background `rgba(212,168,75,0.08)`.

### 8.4 Hero & Carousel
- `.hero-carousel-section { min-height: 75vh }`; mobile pinned to `height: 650px` + `contain: strict`
- Layered overlay: linear gradient top→bottom 40→65% navy + radial gold accent at 20%/30% and white wash at 80%/70%
- **Indicators** — pill container with 12px-blur, inactive 12px dot @ 40% white, active 32×12 pill in primary gold
- **Nav buttons** — 50px glass circle; hover → primary gold fill + `scale(1.08)`; focus ring `rgba(240,180,41,0.4)`
- **Badges** — `.hero-badge` (gold), `.hero-badge-campaign` (purple), `.hero-badge-sermon` (cyan) — all `border-radius: 50px` pills with blur

### 8.5 Arise & Build (Campaign Section)
Fixed background (desktop) + 60/70% black gradient + radial gold/white accents; 700px centered content; campaign eyebrow with `letter-spacing: 2.5px`.

### 8.6 Contact / Dark Forms — Floating Labels
```css
.floating-input input {
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  color: #fff;
  padding: 16px 0 8px;
}
/* Label lifts on focus / filled */
.floating-input input:focus + label,
.floating-input input:not(:placeholder-shown) + label {
  top: 0; font-size: 11px; color: var(--color-primary);
}
```

### 8.7 Landing Footer
Navy `#1a2744 → #151e32` gradient, 60px top padding, radial gold accent (60% width, 200px, ellipse top-center). Social buttons 36px circles, 8%-white glass → gold fill + lift on hover. Footer bottom border `rgba(255,255,255,0.1)`.

### 8.8 High-Contrast Sections
```css
.section-dark  { background: var(--color-navy); color: #fff; }
.section-black { background: #000; color: #fff; }
```

---

## 9. PrimeReact Integration Policy

PrimeReact 10 is the underlying UI kit; brand tokens are bolted on top through `globals.css`:

| Component | Override summary |
|---|---|
| `.p-inputtext`, `.p-calendar .p-inputtext` | w-full, rounded-lg, border `gray-300`, focus `border-primary` + `ring-2 ring-primary/20` |
| `.p-dropdown` | rounded-lg, hover `border-primary`; panel has `shadow-lg` |
| `.p-button` | rounded-lg, ring-2 focus; variants mapped to semantic tokens (`primary/secondary/success/danger`) |
| `.p-invalid` | 1px solid `var(--velvet)` border (note: burgundy is error, but **velvet red** `#DA4453` is the invalid-border color in actual use) |
| `.p-datatable` | thead `bg-surface font-semibold`, row bottom `border-border`, hover `bg-surface` |
| `.p-paginator` | transparent, top-border only |
| `.p-dialog` | `rounded-xl shadow-2xl`, header/footer bordered |
| `.p-toast-message-*` | Token-colored light backgrounds with 4px left-border in the semantic hue |
| `.p-card`, `.p-menu`, `.p-panelmenu` | rounded-lg/xl, `border-border`, `shadow-lg` where floating |

**Rule:** never style a PrimeReact internal element with raw hex — always reference `var(--color-*)` / `@apply` token classes. This keeps light/dark mode and future re-theme coherent.

---

## 10. Form Styling Rules

### Base
```css
.input-base, .p-inputtext {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  font-size: 15px;
  background: #fff;
  transition: all 0.2s ease;
}
.input-base:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(212,168,75,0.15); }
.input-base:disabled { background: #f3f4f6; opacity: 0.6; cursor: not-allowed; }
```

### Required / Invalid
```css
.form-required { color: var(--color-error); margin-left: 4px; }
.p-invalid, .p-invalid.p-inputtext { border-color: var(--velvet); }
```

### Zod Gotchas (carry-overs from migration)
- `z.date({ message: '...' })` — **not** `required_error` (Zod v3 syntax is gone)
- `defaultValues` for date fields: use `undefined`, never `null`
- Invalid shows velvet border; `<FormError>` renders text in `var(--color-error)` (burgundy)

---

## 11. Scrollbar

```css
::-webkit-scrollbar        { width: 8px; height: 8px; }
::-webkit-scrollbar-track  { background: #f3f4f6; border-radius: 4px; }
::-webkit-scrollbar-thumb  { background: #d1d5db; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
```

### Sidebar Contrast Patch
`.sidebar-container` labels/icons are hard-set to `#030712 / #111827 / #1f2937 / #374151` with `!important` to ensure legibility regardless of upstream PrimeReact theme changes (lines 706–735 of `globals.css`).

---

## 12. Breakpoints & Grid Behavior

| Breakpoint | Px |
|---|---|
| Mobile-S | 480 |
| Mobile | 768 |
| Tablet | 1024 |
| Desktop | 1024+ |

| Component | Desktop | Tablet | Mobile |
|---|---|---|---|
| Hero | 75vh | 75vh | 650px fixed |
| Sermons | 3-col | 2-col | 1-col |
| Ministries | 2-col | 2-col | 1-col |
| Events | 3-col | 2-col | 1-col |
| Process steps | 7-col + connectors | 2-col | 2-col |
| Footer links | 4-col | 2-col | 1-col |
| Card padding | 32–40px | 24–32px | 20–24px |
| Grid gap | 24px | 24px | 16px |

Admin sidebar below 1024px: `transform: translateX(-100%)`; `.sidebar.open` slides in; main content drops its left margin.

---

## 13. Utility Class Inventory (quick reference)

### Brand / Layout
`container-custom` · `section-padding` · `section-dark` · `section-black` · `landing-container` · `landing-full-width`

### Typography
`heading-tight` · `heading-tighter` · `page-title` · `section-title` · `section-label` · `section-label-light` · `label` · `error-text` · `muted-text`

### Cards
`card` · `card-hover` · `premium-glass-card` · `premium-stat-card` · `process-step-card` · `event-card` · `ministry-card` · `sermon-card` · `service-info-card` · `service-detail-item` · `stats-widget`

### Buttons
`btn-primary` · `btn-secondary` · `btn-outline` · `btn-ghost` · `btn-contrast` · `btn-contrast-outline` · `btn-contrast-light` · `btn-gold-border` · `landing-btn-primary` · `landing-btn-outline` · `landing-btn-light` · `landing-btn-light-outline` · `landing-btn-border` · `landing-btn-border-light` · `landing-btn-border-gold` · `landing-btn-solid-dark` · `landing-btn-solid-gold` · `btn-arrow-gold` · `btn-arrow-white`

### Motion
`animate-fade-in` · `animate-fade-out` · `animate-slide-up` · `animate-slide-down` · `animate-slide-in-left` · `animate-slide-in-right` · `animate-spin` · `animate-pulse` · `animate-on-scroll` (+ `.visible` state)

### Inputs
`input-base` · `floating-input` · `form-required`

---

## 14. Decision Rules (when building new UI)

1. **Reach for a token, never a hex literal.** If your hex is missing, add a token to `globals.css` first.
2. **Default card = `.premium-glass-card`.** Only drop the glass for dense admin tables/dashboards where density beats aesthetic.
3. **All interactive gold** — any primary CTA / accent **must** be `#d4a84b`. Secondary CTAs = navy (`.landing-btn-border` / `.landing-btn-solid-dark`).
4. **Hover contract**: every clickable card lifts 8–12px and reveals the gold bottom-bar. Every button lifts 2px.
5. **Headlines are UPPERCASE + 800+ + negative tracking.** Body is sentence case, 500 weight, 1.6–1.7 LH.
6. **Glassmorphism cues depth**, not decoration — use only on elements meant to feel elevated (cards, headers, nav, badges).
7. **Transitions**: 0.25s for buttons/links, 0.4s for cards, 0.5s for premium glass surfaces, cubic-bezier `(0.4, 0, 0.2, 1)` for the premium family.
8. **PrimeReact components** must be re-themed through `@apply` using token classes — never write raw colors in the override.
9. **Dark mode tokens already exist** — do not hard-code light-mode colors. Use semantic tokens (`--color-background`, `--color-foreground`, `--color-surface`).
10. **Reduced-motion must degrade gracefully** — never rely on animation to convey state.
11. **Mobile = single column**, with hero pinned to `650px` (iOS-safe) and grid gap dropped to 16px.
12. **Form errors**: burgundy text via `<FormError>`; invalid input border = `--velvet` (#DA4453), not `--color-error`.

---

## 15. CSS Variables — Consolidated Reference

```css
:root {
  /* Brand — Gold */
  --color-primary: #d4a84b;
  --color-primary-light: #e5c47a;
  --color-primary-dark: #b8923f;
  --primary-gold-accent: #d4a84b;

  /* Secondary — Purple */
  --color-secondary: #4a3c6e;
  --color-secondary-light: #6b5a8e;
  --color-secondary-dark: #352a52;

  /* Accent — Burgundy */
  --color-accent: #6b2c3a;
  --color-accent-light: #8e4a5a;
  --color-accent-dark: #4d1f2a;

  /* Semantic */
  --color-success: #22C55E; --color-success-light: #4ADE80; --color-success-dark: #16A34A;
  --color-warning: #d4a84b; --color-warning-light: #e5c47a; --color-warning-dark: #b8923f;
  --color-error:   #6b2c3a; --color-error-light:   #8e4a5a; --color-error-dark:   #4d1f2a;
  --color-info:    #4a3c6e; --color-info-light:    #6b5a8e; --color-info-dark:    #352a52;
  --velvet:        #DA4453;

  /* Surfaces / text */
  --color-background: #f5f0e6;
  --color-foreground: #0d1424;
  --color-muted: #1f2937;
  --color-border: #c8bfa8;
  --color-surface: #ffffff;
  --background-main: #f5f0e6;
  --background-section: #ffffff;
  --text-primary: #0d1424;
  --text-heading: #020617;
  --text-secondary: #1e293b;
  --border-color: #c8bfa8;
  --border-color-light: #ddd5c4;

  /* Named */
  --color-navy: #1a2744;
  --color-navy-dark: #151e32;
  --color-purple: #4a3c6e;
  --color-burgundy: #6b2c3a;
  --color-cream: #f5f0e6;
  --color-ivory: #faf8f3;

  /* Contrast & Glass */
  --color-contrast-dark: #000000;
  --color-contrast-light: #ffffff;
  --color-glass: rgba(255, 255, 255, 0.85);
  --color-glass-dark: rgba(26, 39, 68, 0.85);

  /* Buttons / chrome */
  --button-text-on-gold: #ffffff;
  --button-text-on-light: #d4a84b;
  --header-background: rgba(245, 240, 230, 0.95);
  --footer-background: #1a2744;

  /* Shadows */
  --shadow-color-soft: rgba(26, 39, 68, 0.14);
  --shadow-color-medium: rgba(26, 39, 68, 0.22);
  --gold-shadow-hover: rgba(212, 168, 75, 0.25);

  /* Typography */
  --letter-spacing-tight: -1.5px;
  --letter-spacing-tighter: -1.8px;
  --letter-spacing-normal: -0.5px;
  --font-sans: var(--font-inter), 'Inter', system-ui, -apple-system, sans-serif;
  --font-display: var(--font-inter), 'Inter', system-ui, sans-serif;

  /* Layout */
  --sidebar-width: 280px;
  --sidebar-collapsed-width: 80px;
  --header-height: 64px;
}
```

---

## 16. File Map

```
src/
├── app/
│   ├── globals.css            ← Tokens, @theme, PrimeReact overrides, base utilities, animations
│   ├── layout.tsx             ← Inter font var wiring, QueryProvider mount, Toast root
│   └── (public|auth|protected)/
├── styles/
│   ├── landing.css            ← Glass cards, hero, sections, cards, footer (~11k LOC)
│   ├── signin.css             ← Auth layouts
│   ├── vip-form.css           ← VIP/inquiry variant
│   └── admin.css              ← Admin overrides (near-empty — admin UI relies on Tailwind + tokens)
└── components/
    ├── ui/       Button · IconButton · Spinner · Toast · DownloadQRButton
    ├── cards/    CardDiv · CardDivTitle · MemberCard · ScriptureCard · StatsWidget
    ├── forms/    FormInput · FormTextarea · FormInputNumber · FormSelect · FormCalendar
    │             FormCheckbox · FormRadioButton · FormPassword · FormSocialMedia · FormError
    ├── layout/   AdminLayout · Sidebar · Header · Footer · Breadcrumbs
    ├── landing/  HeroSection · MissionSection · AboutSection · MinistriesSection
    │             MinistryFeatureSection · SermonsSection · EventsSection · EventsCardGrid
    │             FeaturedEventCard · EventsFilter · ChurchServiceSection
    │             ArtistAndBuildSection · CommunityGallerySection · ContactSection
    │             ConnectFab · JoinEventModal · ShareModal · ScrollAnimationProvider
    │             LandingHeader · LandingFooter · PageHero · InProgressSection
    ├── campaigns/ · church/ · events/ · members/ · public/ · providers/
```

---

## 17. Quick-Start for New Screens

1. **Wrap page** in `<main>` with `bg-background text-foreground font-sans`.
2. **Eyebrow** → `<span class="section-label">Category</span>` (gold dash + 2.5px tracking).
3. **Headline** → `h2.heading-tighter` with `uppercase font-extrabold text-[52px] leading-[1.05]`.
4. **Content block** → `.premium-glass-card` with 40px interior padding.
5. **Primary CTA** → `.landing-btn-primary` (pill); Secondary → `.landing-btn-border`.
6. **Scroll reveal** → add `.animate-on-scroll` + let `ScrollAnimationProvider` toggle `.visible`.
7. **Forms** → `FormProvider` + shared `Form*` components; Zod v4 schema; show errors via `FormError`.
8. **Data** → TanStack Query hook from `src/hooks/queries/`; mutations from `src/hooks/mutations/`; toast in `onSuccess` / `onError`.
9. **Cross-cut state** → Zustand only for `user`, `loading`, `breadcrumbs`, `sidebar`. Everything else → TanStack Query.

---

*This document is generated against current source code. When tokens or utilities change in `globals.css` / `landing.css`, update this file in the same commit.*
