# Gateway Church Design System

A comprehensive design system for the Gateway Church Next.js project, inspired by a premium, modern "Transformation Church" aesthetic with a sanctuary-inspired color palette.

> **Last reviewed:** 2026-06-05 — synced against `globals.css`, `landing.css`, `sermon-detail.css`, `signin.css`, `admin.css`, `admin-layout.css`, `vip-form.css`, and `form-input.css`.

---

## 1. Design Philosophy

### The "Premium Modern" Vibe
Our design language is built on three core pillars:
1.  **Glassmorphism**: We use frosted glass (`backdrop-filter: blur(12px)`) to create depth and lightness. Content feels suspended.
2.  **Bold Typography**: Headlines are **UPPERCASE** and **Extra-Bold (800+)** to command attention, with an italic **Fraunces serif** used for editorial emphasis (sermon reader).
3.  **Dynamic Motion**: Every interaction has a tactile "lift" and "glow" to make the site feel alive.

### Sanctuary-Inspired Aesthetic
Colors are drawn from worship sanctuary ambiance:
- Warm gold lighting (primary accent)
- Deep navy for depth and reverence
- Royal purple for accent lighting
- Soft cream for welcoming warmth

### Two Surfaces, One Language
The system spans two distinct surfaces that share the same tokens but diverge in tone:
- **Public / landing** — warm cream backgrounds, warm gold (`#d4a84b`), glassmorphism, big uppercase Inter.
- **Admin / authenticated** — dark navy chrome with a muted **antique gold** (`#c0a067`), compact and utilitarian.

---

## 2. Foundation & Tech Stack

The design system is implemented on a modern Next.js stack. There is **no `tailwind.config.js`** — Tailwind v4 is configured entirely in CSS.

### Core Framework
| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | **Next.js 16** (App Router) | Route groups: `(public)`, `(auth)`, `(protected)` |
| UI Runtime | **React 19.2** | Server + client components |
| Styling | **Tailwind CSS v4** | `@import "tailwindcss"` + `@theme inline` in `globals.css`; PostCSS plugin `@tailwindcss/postcss`. No config file. |
| Component Library | **PrimeReact 10.9** | Base theme `lara-light-blue` + `primeicons` 7, overridden in `globals.css` |
| Server State | **TanStack Query v5** | `src/hooks/queries/`, `src/hooks/mutations/` |
| Client State | **Zustand 5** | `user`, `loading`, `breadcrumbs`, `sidebar` stores |
| Forms | **React Hook Form 7 + Zod 4** | `AbstractFormComponent` wrappers in `src/components/forms/` |

### Fonts (`next/font/google`)
Two variable fonts are loaded in the root layout and exposed as CSS variables:

| Font | Variable | Weights | Role |
|------|----------|---------|------|
| **Inter** | `--font-inter` → `--font-sans` | 100–900 | All UI, headings, body (default) |
| **Fraunces** | `--font-fraunces` → `--font-serif` | 400 / 500 / 600 (normal + italic) | Editorial emphasis: sermon titles' italic `em`, scripture quotes, pull-quote callouts, large numerals |

```tsx
// src/app/layout.tsx
const inter = Inter({ subsets: ['latin'], weight: ['100'..'900'], variable: '--font-inter', display: 'swap' });
const fraunces = Fraunces({ subsets: ['latin'], weight: ['400','500','600'], style: ['normal','italic'], variable: '--font-fraunces', display: 'swap' });

<html className={`${inter.variable} ${fraunces.variable}`}>
  <body className="font-sans antialiased">
```

### Tailwind v4 Theme Bridge
CSS custom properties are mapped into Tailwind utilities via `@theme inline`, so `bg-primary`, `text-foreground`, `border-border`, `ring-primary/20`, etc. resolve to the same tokens documented below.

```css
@import "tailwindcss";

@theme inline {
  --color-primary: var(--color-primary);
  --color-foreground: var(--color-foreground);
  --color-border: var(--color-border);
  --font-sans: var(--font-sans);
  /* …all brand + semantic colors bridged here… */
}
```

---

### Scoping & Portaled Styles

- **Page styles:** gate everything under a unique page-root class (e.g. `.lyric-formatter-page .…`). Avoid generic class names — cascade-order collisions between the two public stylesheets have caused client-nav bugs. Use a unique prefix.
- **Portaled DOM** (dialogs, toasts, dropdown panels) renders at `<body>` and can't be reached from a page-scoped root — put those styles in `globals.css` with a unique prefix (e.g. `.lf-…`) passed via the component's `className`.
- `globals.css` is imported **after** the PrimeReact theme in `layout.tsx`, so equal-specificity overrides there win.

---

## 3. Color Palette

> Values below are the **source of truth** as defined in `:root` of `globals.css`.

### Contrast — The #1 Rule

**Never put text on a background of the same or near tone.** Every coloured surface must declare **both** its `background` **and** its text/icon `color` together — never set one and inherit the other (the most common failure here is overriding PrimeReact's `lara-light-blue` theme halfway).

| Surface | Text + icons | Notes |
|---|---|---|
| **Dark** (navy `#1a2744`, burgundy `#6b2c3a`, purple `#4a3c6e`) | **white** | |
| **Gold** (`#d4a84b`) | **navy** (`#1a2744`) | **White-on-gold ≈ 1.9:1 — fails. Never use it.** |
| **Mid "light" tints** (e.g. `--color-error-light` `#8e4a5a`) | — | Not safe with white *or* dark text — don't use as a text background. |

Targets: WCAG AA — **≥ 4.5:1** body text, **≥ 3:1** large/bold text.

---

### Primary Colors (Warm Gold / Sanctuary Lighting)
| Name | Variable | Hex | Usage |
|------|----------|-----|-------|
| **Warm Gold** | `--color-primary` | `#d4a84b` | Primary accent, gradients, highlights |
| Gold Light | `--color-primary-light` | `#e5c47a` | Hover states, subtle glows |
| Gold Dark | `--color-primary-dark` | `#b8923f` | Active states, text emphasis |

### Secondary Colors (Royal Purple)
| Name | Variable | Hex | Usage |
|------|----------|-----|-------|
| **Royal Purple** | `--color-secondary` | `#4a3c6e` | Secondary accent, info states |
| Purple Light | `--color-secondary-light` | `#6b5a8e` | Hover states |
| Purple Dark | `--color-secondary-dark` | `#352a52` | Active states |

### Accent Colors (Rich Burgundy)
| Name | Variable | Hex | Usage |
|------|----------|-----|-------|
| **Rich Burgundy** | `--color-accent` | `#6b2c3a` | Alerts, warnings, errors |
| Burgundy Light | `--color-accent-light` | `#8e4a5a` | Hover states |
| Burgundy Dark | `--color-accent-dark` | `#4d1f2a` | Active states |

### Semantic Colors (each ships light + dark variants)
| Name | Base | Light | Dark | Usage |
|------|------|-------|------|-------|
| **Success** | `--color-success` `#22C55E` | `#4ADE80` | `#16A34A` | Positive states, toast success |
| **Warning** | `--color-warning` `#d4a84b` | `#e5c47a` | `#b8923f` | Warnings (reuses gold) |
| **Error** | `--color-error` `#6b2c3a` | `#8e4a5a` | `#4d1f2a` | Errors (reuses burgundy) |
| **Info** | `--color-info` `#4a3c6e` | `#6b5a8e` | `#352a52` | Info (reuses purple) |

> The `-light` variants are used directly as **toast background tints** (see §22).

### Neutrals (Sanctuary Tones)
| Name | Variable | Hex | Usage |
|------|----------|-----|-------|
| **Cream Background** | `--color-background` | `#f5f0e6` | App / body background |
| **Foreground** | `--color-foreground` | `#0d1424` | Default text |
| **Muted** | `--color-muted` | `#1f2937` | Secondary text |
| **Border** | `--color-border` | `#c8bfa8` | Default borders (warm sand) |
| Surface | `--color-surface` | `#ffffff` | Card bases |

### Named Sanctuary Colors
| Name | Variable | Hex | Usage |
|------|----------|-----|-------|
| **Deep Navy** | `--color-navy` | `#1a2744` | Dark backgrounds, footer, sermon hero |
| **Darker Navy** | `--color-navy-dark` | `#151e32` | Footer / badge gradient end |
| Purple | `--color-purple` | `#4a3c6e` | Alias of secondary |
| Burgundy | `--color-burgundy` | `#6b2c3a` | Alias of accent |
| **Soft Cream** | `--color-cream` | `#f5f0e6` | Welcoming warmth |
| **Ivory** | `--color-ivory` | `#faf8f3` | Light accent areas |
| **Velvet** | `--velvet` | `#DA4453` | **Invalid form-input border** (`.p-invalid`) |

### Landing / Public Theme Tokens
A dedicated set of aliases drives the public marketing pages and is referenced widely across `landing.css`, `signin.css`, and `vip-form.css`.
| Variable | Value | Usage |
|----------|-------|-------|
| `--primary-gold-accent` | `#d4a84b` | Gold accent on public pages |
| `--background-main` | `#f5f0e6` | Page background |
| `--background-section` | `#ffffff` | Section background |
| `--text-primary` | `#0d1424` | Body text |
| `--text-heading` | `#020617` | Headings (near-black) |
| `--text-secondary` | `#1e293b` | Sub-text / prose |
| `--border-color` | `#c8bfa8` | Borders |
| `--border-color-light` | `#ddd5c4` | Hairline borders, dividers |
| `--button-text-on-gold` | `#ffffff` | Text on gold buttons |
| `--button-text-on-light` | `#d4a84b` | Gold text on light buttons |
| `--header-background` | `rgba(245, 240, 230, 0.95)` | Header glass tint |
| `--footer-background` | `#1a2744` | Footer base |

### Admin "Antique Gold" (distinct from landing gold)
The admin chrome uses a deliberately **muted, brass-like gold** — not the warm landing gold. These are hard-coded in `admin.css` (no token).
| Role | Value |
|------|-------|
| Admin gold (light) | `#c0a067` |
| Admin gold (dark) | `#a8894f` |
| Admin header gradient | `linear-gradient(135deg, #0a0a0f 0%, #0d1525 50%, #0d1a2d 100%)` |
| Admin canvas | `#f8f9fa` |

### Form Input Tokens (`form-input.css`)
| Variable | Value | Usage |
|----------|-------|-------|
| `--form-text-color` | `#242124` | Matte-black input text + labels |
| (placeholder) | `#6b7280` | Input placeholder color |

### Glass & Effect Colors
| Name | Variable | Value | Usage |
|------|----------|-------|-------|
| Glass Light | `--color-glass` | `rgba(255, 255, 255, 0.85)` | Light glassmorphism |
| Glass Dark | `--color-glass-dark` | `rgba(26, 39, 68, 0.85)` | Dark glassmorphism |
| Contrast Dark | `--color-contrast-dark` | `#000000` | Pure black |
| Contrast Light | `--color-contrast-light` | `#ffffff` | Pure white |

### Shadow Colors
| Name | Variable | Value | Usage |
|------|----------|-------|-------|
| Soft Shadow | `--shadow-color-soft` | `rgba(26, 39, 68, 0.14)` | Resting-state shadows |
| Medium Shadow | `--shadow-color-medium` | `rgba(26, 39, 68, 0.22)` | Elevated shadows |
| Gold Glow | `--gold-shadow-hover` | `rgba(212, 168, 75, 0.25)` | Hover accent glow |

### Dark Mode Colors
Applied automatically via `@media (prefers-color-scheme: dark)`:
| Name | Light | Dark |
|------|-------|------|
| Background | `#f5f0e6` | `#1A1A2E` |
| Foreground | `#0d1424` | `#F5F5F5` |
| Muted | `#1f2937` | `#9CA3AF` |
| Border | `#c8bfa8` | `#374151` |
| Surface | `#ffffff` | `#1F2937` |

---

## 4. Typography

### Font Families
- **Sans (default)**: `var(--font-sans)` → `var(--font-inter), 'Inter', system-ui, -apple-system, sans-serif`
- **Serif (editorial)**: `var(--font-serif)` → `var(--font-fraunces), 'Fraunces', Georgia, serif`
- Aliases also exist: `--font-display`, `--font-family-sans-serif`, `--font-family-headings`

### Sans Hierarchy (Inter)
| Element | Size | Weight | Letter-Spacing | Style | Usage |
|---------|------|--------|----------------|-------|-------|
| **Hero Title** | `56px` | **800** | **-1.8px** | **UPPERCASE** | Main landing page impact |
| **Sermon Hero Title** | `clamp(40px, 5vw, 64px)` | **800** | **-2px** | **UPPERCASE** | Sermon reader hero |
| **Campaign Title** | `52px` | **800** | **-1.8px** | **UPPERCASE** | Arise & Build sections |
| **Section Title** | `32-36px` | **800** | **-1.5px** | **UPPERCASE** | Major section headers |
| **Card Title** | `24px` | **800** | **-0.5px** | **UPPERCASE** | Card headers |
| **Step Title** | `20px` | **700** | **-0.5px** | **UPPERCASE** | Process steps |
| Body Copy | `15px` | 500 | Normal | Regular | High-readability UI text |
| Prose (reader) | `18px` | 500 | Normal | Regular | Sermon body, `line-height: 1.75` |
| **Section Label / Eyebrow** | `11-12px` | **800-900** | **2.5px** | **UPPERCASE** | Category labels |
| Meta Text | `12-13px` | 500 | Normal | Regular | Secondary info |

### Serif Usage (Fraunces)
Fraunces is reserved for **editorial / reverent** moments — never for UI chrome. Always italic in these contexts:
| Context | Class | Treatment |
|---------|-------|-----------|
| Title emphasis | `.sermon-hero__title em` | Italic, weight 500, `color: var(--color-primary-light)`, sentence case |
| Pull quote | `.prose .callout` | Italic, 18px, secondary-purple left border |
| Scripture text | `.scripture-quote p` | Italic-free serif, 15.5px, `max-width: 72ch` |
| Inline verse ref | `.verse-ref` | Italic, purple chip |
| Large numerals | `.blessing__num` (48px), `.toc__num`, `.scripture-badge`, `.speaker__avatar` | Italic figures / initials |

### Letter-Spacing Variables
```css
--letter-spacing-tight: -1.5px;   /* Section headers */
--letter-spacing-tighter: -1.8px; /* Hero titles */
--letter-spacing-normal: -0.5px;  /* Card titles */
```
Utility classes: `.heading-tight`, `.heading-tighter`.

### Line Heights
| Context | Line Height | Usage |
|---------|-------------|-------|
| Hero Headings | `1.04 - 1.05` | Large display text |
| Subheadings | `1.1 - 1.2` | Section titles |
| Body Text | `1.6 - 1.7` | Readable paragraphs |
| Reader Prose | `1.75` | Long-form sermon reading |
| Tight Text | `1.5` | Compact layouts |

---

## 5. Components

### Premium Glass Cards
The standard container for substantial content.
```css
.premium-glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.premium-glass-card:hover {
  transform: translateY(-12px); /* The "Lift" */
  background: #ffffff;
  box-shadow: 0 24px 60px rgba(212, 168, 75, 0.15),
              0 12px 24px rgba(0, 0, 0, 0.06); /* The "Gold Glow" */
}

/* Gradient shine overlay */
.premium-glass-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(255, 255, 255, 0) 100%);
  pointer-events: none;
}

/* Bottom accent bar on hover */
.premium-glass-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #d4a84b, #f9d976);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.premium-glass-card:hover::after {
  transform: scaleX(1);
}
```

### Premium Stat Card (Dark Variant)
```css
.premium-stat-card {
  background: rgba(26, 39, 68, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
}

.premium-stat-card:hover {
  background: rgba(26, 39, 68, 0.95);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3);
}
```

### Process Step Cards
```css
.process-step-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 32px 24px;
  position: relative;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  transition: all 0.4s ease;
}

.process-step-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

/* Step number badge */
.step-number {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #d4a84b 0%, #d97706 100%);
  border-radius: 50%;
  color: #ffffff;
  font-weight: 800;
  font-size: 14px;
  position: absolute;
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
}

/* Icon container */
.step-icon {
  width: 64px;
  height: 64px;
  background: rgba(212, 168, 75, 0.1);
  border-radius: 16px;
  margin: 0 auto 16px;
  transition: all 0.3s ease;
}

.process-step-card:hover .step-icon {
  background: rgba(212, 168, 75, 0.15);
  transform: rotate(-10deg) scale(1.1);
}
```

### Step Connectors
```css
.step-connector::before {
  content: '';
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg,
    rgba(212, 168, 75, 0.3) 0%,
    rgba(212, 168, 75, 0.1) 100%);
}

.step-connector i {
  background: #ffffff;
  padding: 4px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: var(--color-primary);
}
```

### Dynamic Icons
Icons live in a container that morphs shape on interaction.
- **Rest**: Rounded Square (`border-radius: 16-20px`)
- **Hover**: Circle (`border-radius: 50%`)
- **Motion**: `transform: rotate(-10deg) scale(1.1)`

---

## 6. Buttons

Buttons come in two families: **landing pill buttons** (rounded, gold) and **Tailwind utility buttons** (`@apply`-based, in `globals.css`).

### Pill Buttons (landing)
```css
.landing-btn {
  border-radius: 50px; /* Full Pill */
  padding: 14px 32px;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  transition: all 0.25s ease;
}

.landing-btn:hover { transform: translateY(-2px); }
```

**Primary Gold Button:**
```css
.landing-btn-primary {
  background: linear-gradient(135deg, #d4a84b 0%, #c9973f 100%);
  color: #ffffff;
  border: none;
  box-shadow: 0 4px 15px rgba(212, 168, 75, 0.25);
}

.landing-btn-primary:hover {
  background: linear-gradient(135deg, #c9973f 0%, #d4a84b 100%);
  box-shadow: 0 6px 20px rgba(212, 168, 75, 0.35);
}
```

> **⚠️ Contrast deviation (known).** `.landing-btn-primary` ships `color:#ffffff` on the gold gradient (`#d4a84b → #c9973f`) ≈ 1.9–2.1:1, which **violates the navy-on-gold contrast rule above**; the Tailwind `.btn-primary` (`bg-primary text-white`) has the same problem. The canonical rule for any gold surface is **navy text** — both are flagged for migration to `color: var(--color-navy)` and are **not** the pattern to copy for new gold buttons.

### Utility Buttons (`globals.css`, Tailwind `@apply`)
| Class | Composition |
|-------|-------------|
| `.btn-primary` | `bg-primary text-white hover:bg-primary-dark`, ring on focus |
| `.btn-secondary` | `bg-secondary text-white hover:bg-secondary-dark` |
| `.btn-outline` | `border-2 border-primary text-primary hover:bg-primary hover:text-white` |
| `.btn-ghost` | `text-primary hover:bg-primary/10` |
| `.link` | `text-primary hover:text-primary-dark hover:underline` |

### High-Contrast Buttons (Favor Church inspired, `globals.css`)
```css
.btn-contrast {            /* solid black → inverts to white on hover */
  background: var(--color-contrast-dark);
  color: var(--color-contrast-light);
  border: 2px solid var(--color-contrast-dark);
  text-transform: uppercase;
  font-weight: 700;
  transition: all 0.25s ease;
}
.btn-contrast:hover { background: var(--color-contrast-light); color: var(--color-contrast-dark); transform: translateY(-2px); }
```
Companions: `.btn-contrast-outline`, `.btn-contrast-light`, `.btn-gold-border` (transparent → gold fill).

### PrimeReact Button Rules

lara defaults to blue and jams the icon against the label. For every styled PrimeReact `<Button>`:

- **Icon gap:** `.scope .p-button .p-button-icon-left { margin-right: 0.5rem; }` (lara leaves none).
- **On-brand colours:** primary = gold bg + **navy** text; outline = **navy** border + navy text (never lara blue); text/link = gold (`--color-primary-dark`).
- **Comfortable size:** `padding: 0.6rem 1.1rem; border-radius: 8–9px; font-weight: 600`.
- **No fixed `height`** on buttons meant to align with inputs — match height via vertical `padding` and let the row's `align-items` align them (a fixed height ends up shorter than the inputs).
- **Always** provide a hover state.

### Button Variant Summary
| Class | Default | Hover |
|-------|---------|-------|
| `.landing-btn-primary` | Gold gradient | Reversed gradient + glow |
| `.landing-btn-outline` | Gold outline | Solid gold |
| `.landing-btn-border` | Navy outline | Solid navy |
| `.landing-btn-light` | Solid white | White outline |
| `.landing-btn-light-outline` | Glass white border | Solid white |
| `.btn-arrow-gold` | Gold gradient | Lift + arrow slide |
| `.btn-contrast` | Solid black | Inverted |
| `.btn-gold-border` | Gold outline | Solid gold |
| `.sermon-btn--gold` | Gold gradient | Lift + gold glow |
| `.sermon-btn--outline` | Gold outline | Solid gold |
| `.sermon-btn--ghost` | Navy 4% tint | Navy 8% tint |

> Arrow buttons (`.btn-arrow`) slide their `.arrow-icon` `translateX(4px)` on hover.

---

## 7. Shadows & Effects

### Box Shadows
| Name | Value | Usage |
|------|-------|-------|
| **Minimal** | `0 1px 0 rgba(0, 0, 0, 0.05)` | Subtle elements |
| **Soft** | `0 4px 24px rgba(0, 0, 0, 0.06)` | Resting state for cards |
| **Medium** | `0 10px 20px rgba(0, 0, 0, 0.06)` | Elevated elements |
| **Heavy** | `0 20px 40px rgba(0, 0, 0, 0.06-0.1)` | Hover states |
| **Gold Glow** | `0 24px 60px rgba(212, 168, 75, 0.15)` | Hover state accent |
| **Dropdown** | `0 10px 40px rgba(0, 0, 0, 0.08)` | Floating panels |
| **Admin Menu** | `0 12px 32px rgba(15, 23, 42, 0.12)` | Admin user dropdown |
| **Image Hover** | `0 20px 50px rgba(0, 0, 0, 0.12)` | Gallery images |

### Progress Bar (Bottom Accent)
```css
.card::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0;
  width: 100%; height: 4px;
  background: linear-gradient(90deg, #d4a84b, #f9d976);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}
.card:hover::after { transform: scaleX(1); }
```

### Glassmorphism Effects
| Intensity | Backdrop Filter | Background | Usage |
|-----------|-----------------|------------|-------|
| **Heavy** | `blur(12px)` | `rgba(255, 255, 255, 0.85)` | Main glass cards |
| **Medium** | `blur(10px)` | `rgba(255, 255, 255, 0.5-0.85)` | Nav panels, TOC card |
| **Light** | `blur(8px)` | `rgba(255, 255, 255, 0.3)` | Overlay elements |
| **Minimal** | `blur(4px)` | `rgba(255, 255, 255, 0.08)` | Subtle glass buttons |

---

## 8. Layout Principles

### Core Rules
1. **Top Alignment**: In grids, use `justify-content: flex-start` to keep icons/titles aligned across cards of varying height.
2. **Generous Spacing**: Use `40px` padding inside major cards to avoid cramping.
3. **Consistent Gap**: Use `24px` gap throughout flex/grid systems for modular spacing.
4. **Responsive**: Cards stack to 1 column on mobile, maintaining internal padding and hierarchy.

### Layout Variables
```css
/* Legacy sidebar utilities (globals.css) */
--sidebar-width: 280px;
--sidebar-collapsed-width: 80px;
--header-height: 64px;

/* Admin shell (admin-layout.css, scoped to .admin-layout) */
--admin-sidebar-width: 260px;
--admin-header-height: 64px;
```

### Container Widths
| Container | Max Width | Padding | Usage |
|-----------|-----------|---------|-------|
| `.landing-container` | `1100px` | `0 24px` | Public landing pages |
| `.container-custom` | `max-w-7xl` (80rem / 1280px) | `px-4 sm:px-6 lg:px-8` | Admin / general |
| Sermon reader grid | `minmax(0, 1fr) 340px` | `56px` gap | Reader + sticky aside |
| VIP form grid | `350px 1fr` | `30px` gap | Welcome card + form |

### Section Padding
| Section Type | Desktop | Tablet | Mobile |
|--------------|---------|--------|--------|
| Hero (`.hero-section`) | `116px 0 70px` | `100px 0` | `80px 0` |
| Standard | `70px 0` | `60px 0` | `50px 0` |
| Compact | `50px 0` | `40px 0` | `32px 0` |
| `.section-padding` (Tailwind) | `py-20` | `py-16` | `py-12` |

### Section Background Alternation
Stacked full-width sections must **alternate background tones** to create visual rhythm and separation — never place two same-coloured sections back-to-back.

| Tone | Token | Hex | Use |
|------|-------|-----|-----|
| Base | `--background-section` | `#ffffff` | Default / primary sections |
| Alternate (light) | `--color-ivory` / `--color-cream` | `#faf8f3` / `#f5f0e6` | The next section in the stack (`.section-alternate-bg`) |
| Alternate (dark) | `--color-navy` / `#000` | `#1a2744` | High-contrast break (`.section-dark` / `.section-black`, §9) |

**Rules:**
1. When a section sits directly after a white (`#ffffff`) section, give it an alternate (ivory/cream or dark) background — and vice-versa.
2. A **card placed on an alternate background floats via elevation (shadow), not a border.** Drop the 1px border and lean on the §7 layered shadow so the card reads as raised against the tint. (Applied example: the paid-event registration section — `.event-register-section` is cream, its `.vip-form-container` is borderless + elevated.)

---

## 9. High-Contrast Sections

### Dark Section Backgrounds
```css
.section-dark  { background: var(--color-navy); color: #ffffff; }
.section-black { background: #000000;            color: #ffffff; }
```

### Service Info Cards
Border-heavy cards with hover inversion for service times / venues.
```css
.service-info-card {
  background: #ffffff;
  border: 2px solid var(--color-navy);
  border-radius: 12px;
  padding: 28px 24px;
  text-align: center;
}
.service-info-card:hover { background: var(--color-navy); color: #ffffff; }
```

### Service Detail Items
```css
.service-detail-item {
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  transition: all 0.3s ease;
}
.service-detail-item:hover {
  border-color: rgba(212, 168, 75, 0.4);
  transform: scale(1.02);
}
```

---

## 10. Hero & Carousel Sections

### Hero Container
```css
.hero-carousel-section { min-height: 75vh; position: relative; overflow: hidden; }

/* Mobile: fixed height to prevent iOS address-bar reflow */
@media (max-width: 768px) {
  .hero-carousel-section { min-height: auto; height: 650px; contain: strict; overflow: clip; }
}
```

### Hero Overlay (Multi-layered)
```css
.hero-slide-bg::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(180deg,
    rgba(30, 58, 95, 0.4) 0%,
    rgba(30, 58, 95, 0.55) 50%,
    rgba(30, 58, 95, 0.65) 100%);
}

.hero-slide-bg::before { /* radial accent overlays */
  background:
    radial-gradient(ellipse at 20% 30%, rgba(240, 180, 41, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(255, 255, 255, 0.03) 0%, transparent 40%);
}
```

### Hero Badges
```css
.hero-badge {
  display: inline-flex; align-items: center;
  padding: 6px 16px;
  background: rgba(240, 180, 41, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  font-size: 12px; font-weight: 900; color: #fff;
  letter-spacing: 1.5px; text-transform: uppercase;
  border: 1px solid rgba(240, 180, 41, 0.35);
}
.hero-badge-campaign { background: rgba(124, 58, 237, 0.8); border-color: rgba(124, 58, 237, 0.4); }   /* purple */
.hero-badge-sermon   { background: rgba(8, 145, 178, 0.25); border-color: rgba(8, 145, 178, 0.4); color: #67e8f9; } /* cyan */
```

### Carousel Indicators & Nav Buttons
```css
.hero-indicator {
  width: 12px; height: 12px; border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
}
.hero-indicator.active { width: 32px; border-radius: 6px; background: var(--color-primary); }

.hero-nav-btn {
  width: 50px; height: 50px; border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  transition: all 0.3s ease;
}
.hero-nav-btn:hover { background: var(--color-primary); border-color: var(--color-primary); transform: scale(1.08); }
.hero-nav-btn:focus { box-shadow: 0 0 0 3px rgba(240, 180, 41, 0.4); }
```

### PageHero (internal pages)
`PageHero` (`src/components/landing/PageHero.tsx`) is the reusable internal-page hero, wrapped thinly per page (`AboutHero`, `ConnectHero`). It inherits the `.hero-section` overlay; do not re-declare the overlay per page.

---

## 11. Navigation & Header (Landing)

### Landing Header
```css
.landing-header {
  position: fixed; inset: 0 0 auto 0;
  height: 70px;
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 1000;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
```

### Nav Link Underline Animation
```css
.nav-links li a { position: relative; padding: 4px 0; font-size: 16px; font-weight: 600; color: var(--color-navy); }
.nav-links li a::after {
  content: ''; position: absolute; bottom: 0; left: 0;
  width: 0; height: 2px; background: var(--color-primary);
  transition: width 0.25s ease;
}
.nav-links li a:hover::after,
.nav-links li a.active::after { width: 100%; }
.nav-links li a:hover, .nav-links li a.active { color: var(--color-primary); }
```
> **Nav order:** Home · About · Ministries · Events · **Connect** · Give. The Connect link sits after Events, before Give (`LandingHeader.tsx`).

### Dropdown Menu
```css
.nav-dropdown-menu {
  position: absolute;
  top: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%) translateY(-10px);
  min-width: 220px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  opacity: 0; visibility: hidden;
  transition: all 0.3s ease;
  padding: 8px;
}
.nav-dropdown-menu::before { /* triangle arrow */
  content: ''; position: absolute; top: -6px; left: 50%;
  width: 12px; height: 12px; background: #fff;
  border-left: 1px solid rgba(0,0,0,0.06);
  border-top: 1px solid rgba(0,0,0,0.06);
  transform: translateX(-50%) rotate(45deg);
}
.nav-dropdown.dropdown-open .nav-dropdown-menu { opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0); }
.nav-dropdown-menu li a:hover { background: rgba(212, 168, 75, 0.08); color: var(--color-primary); }
```

---

## 12. Footer

```css
.landing-footer {
  background: linear-gradient(180deg, var(--color-navy) 0%, #151e32 100%);
  color: #ffffff;
  padding: 60px 0 0 0;
  position: relative;
}
.landing-footer::before { /* subtle gold radial accent */
  content: ''; position: absolute; top: 0; left: 50%;
  transform: translateX(-50%);
  width: 60%; height: 200px;
  background: radial-gradient(ellipse at center top, rgba(212, 168, 75, 0.06) 0%, transparent 70%);
  pointer-events: none;
}
.footer-links a { color: rgba(255, 255, 255, 0.6); font-size: 13px; transition: color 0.25s ease; }
.footer-links a:hover { color: var(--color-primary); }

.footer-social-btn {
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.25s ease;
}
.footer-social-btn:hover { background: var(--color-primary); border-color: var(--color-primary); color: #fff; transform: translateY(-2px); }

.footer-bottom { padding: 24px 0; border-top: 1px solid rgba(255, 255, 255, 0.1); text-align: center; color: rgba(255, 255, 255, 0.4); font-size: 13px; }
```

> **CSS isolation note:** When two stylesheets in `(public)/layout.tsx` define the same class, cascade order can flip between SSR and client nav. Use unique prefixes (e.g. `.sermon-reader-grid`, not `.sermon-grid`).

---

## 13. Form Styling

### PrimeReact Inputs (`globals.css` + `form-input.css`)
```css
.p-inputtext {
  width: 100%;
  border: 1px solid #d1d5db; /* gray-300 */
  border-radius: 0.5rem;     /* rounded-lg */
  padding: 0.75rem 1rem;
  transition: all 0.2s ease;
}
.p-inputtext:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 2px rgba(212, 168, 75, 0.2); /* ring-primary/20 */
}
.p-inputtext:disabled { background: #f3f4f6; cursor: not-allowed; }

/* Input + label text = matte black; placeholder = gray-500 */
.p-inputtext, input, textarea, select { color: #242124; }
input::placeholder { color: #6b7280; }
label { color: #242124; font-weight: 500; }
```

### Invalid State (uses `--velvet`, NOT `--color-error`)
```css
.p-invalid,
.p-invalid.p-inputtext,
.p-invalid .p-inputtext {
  border: 1px solid var(--velvet); /* #DA4453 */
}
```

### Required Indicator
```css
.form-required { color: var(--color-error, #ef4444); margin-left: 4px; }
```

### Password Toggle Alignment
The PrimeReact password show/hide icon is absolutely centered at `right: 12px; top: 50%`. Social-media add/remove buttons (`.form-social-add-btn` / `.form-social-remove-btn`) are text buttons in navy that underline (add) or flush burgundy (remove) on hover.

### Floating Label Inputs (Contact Form, dark sections)
```css
.floating-input input {
  width: 100%;
  padding: 16px 0 8px 0;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  color: #ffffff;
}
.floating-input label {
  position: absolute; left: 0; top: 16px;
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.25s ease;
  pointer-events: none;
}
.floating-input input:focus + label,
.floating-input input:not(:placeholder-shown) + label {
  top: 0; font-size: 11px; color: var(--color-primary);
}
```

> **RHF + Zod gotchas:** use `z.date({ message: '...' })` (Zod 4), default date fields to `undefined` (not `null`), and call `showSuccess()`/`showError()` explicitly in mutation callbacks (the `Toast` wrapper is now passive).

---

### Radio Buttons

A generic PrimeReact `<RadioButton>` renders lara **blue** when checked — off-brand. Brand it gold (the SOD enrollment form is the reference — `.sod-radio-input` in `vip-form.css`). Apply your scope class to the `<RadioButton className="my-radio" …>`:

```css
/* unchecked: white box, navy hairline */
.my-radio .p-radiobutton-box {
  border: 2px solid rgba(26, 39, 68, 0.45);
  background: #fff;
  transition: border-color 0.2s ease, background 0.2s ease;
}
/* checked — .p-highlight is lara's checked class, NOT .p-radiobutton-checked */
.my-radio.p-highlight .p-radiobutton-box {
  background: var(--color-primary);   /* gold */
  border-color: var(--color-primary);
}
.my-radio.p-highlight .p-radiobutton-icon { background: #fff; }  /* inner dot */
/* keyboard focus ring */
.my-radio .p-radiobutton-box:focus-visible,
.my-radio .p-radiobutton-box.p-focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(212, 168, 75, 0.25);
}
```

Rules:
- **Checked = gold fill + gold border + white inner dot.** Never leave it lara blue.
- **Label** is clickable via `htmlFor`/`inputId` and aligned to the control with flex `align-items:center` — not a `position:relative; top:Npx` nudge. Don't pin the row to a tiny fixed `height` (e.g. `20px`): it crops the label and drops the hit area below the 44–48px touch-target guidance.
- **Reduced motion:** drop the box transition under `prefers-reduced-motion`.
- Checked class is **`.p-highlight`** (same gotcha as InputSwitch), not `.p-radiobutton-checked`.

---

## 14. Card Variations

### Event Card
```css
.event-card {
  background: #fff; border-radius: 24px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  overflow: hidden; transition: all 0.4s ease;
}
.event-card:hover { transform: translateY(-8px); box-shadow: 0 24px 48px rgba(0, 0, 0, 0.1); }

.event-date-badge {
  position: absolute; top: 16px; left: 16px;
  background: var(--color-navy); color: #fff;
  padding: 8px 12px; border-radius: 8px; text-align: center;
}
.event-date-badge .day   { font-size: 20px; font-weight: 800; line-height: 1; }
.event-date-badge .month { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
```

### Ministry Card
```css
.ministry-card {
  position: relative; border-radius: 12px; overflow: hidden;
  aspect-ratio: 4/3; min-height: 280px; transition: all 0.4s ease;
}
.ministry-card:hover { transform: translateY(-8px) scale(1.01); }
.ministry-card:hover img { transform: scale(1.08); filter: brightness(1.1) saturate(1.2); }
.ministry-card::after { /* gradient overlay, darkens on hover */
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(26,39,68,0.7) 0%, rgba(26,39,68,0.3) 40%, transparent 100%);
  transition: all 0.4s ease;
}
```

### Sermon Card
```css
.sermon-card {
  background: #fff; border-radius: 20px; overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  transition: all 0.4s ease;
}
.sermon-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); }
.sermon-card-thumbnail { position: relative; aspect-ratio: 16/9; overflow: hidden; }
.sermon-duration { position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.8); color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
```

### Stats Widget Card (admin)
```css
.stats-widget { display: flex; justify-content: space-between; align-items: center; padding: 24px; background: #fff; border-radius: 16px; border: 1px solid var(--color-border); }
.stats-value  { font-size: 28px; font-weight: 700; color: var(--color-foreground); }
.stats-icon-container { width: 48px; height: 48px; border-radius: 50%; background: rgba(212, 168, 75, 0.1); color: var(--color-primary); display: grid; place-items: center; }
.stats-trend.up { color: var(--color-success); }
.stats-trend.down { color: var(--color-error); }
```

### Image Placeholders
When using `placehold.co` with `next/image`, **append an explicit raster extension before `?text=`** (e.g. `.../1000x800/1a2744/d4a84b.png?text=…`). Bare placehold.co URLs serve SVG, which the Next optimizer refuses to process (renders broken). Do **not** enable `dangerouslyAllowSVG`.

---

## 15. Sermon Reader Layout (`sermon-detail.css`)

The sermon-notes detail page (`/sermon-notes/[slug]`) is a long-form **editorial reader**. All values reference GWC tokens — no hard-coded hex. Loaded globally in `(public)/layout.tsx`.

### Reading Progress Bar
```css
.reading-progress { position: fixed; inset: 0 0 auto 0; height: 3px; background: rgba(26, 39, 68, 0.06); z-index: 1100; }
.reading-progress__fill {
  height: 100%;
  width: var(--progress, 0%);
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
  box-shadow: 0 0 12px rgba(212, 168, 75, 0.50);
  transition: width 0.08s linear;
}
```

### Hero (navy)
```css
.sermon-hero { background: var(--color-navy); color: #fff; padding: calc(70px + 40px) 0 64px; }
.sermon-hero__layout { display: grid; grid-template-columns: 1fr 320px; gap: 48px; align-items: center; }
.sermon-hero__eyebrow { font-size: 11px; font-weight: 800; letter-spacing: 2.5px; text-transform: uppercase; color: var(--color-primary); }
.sermon-hero__eyebrow::before { content: ''; width: 28px; height: 1.5px; background: var(--color-primary); } /* leading dash */
.sermon-hero__title { font-size: clamp(40px, 5vw, 64px); font-weight: 800; letter-spacing: -2px; line-height: 1.04; text-transform: uppercase; }
.sermon-hero__title em { /* Fraunces italic emphasis */
  font-family: var(--font-serif); font-style: italic; font-weight: 500; text-transform: none; color: var(--color-primary-light);
}
.sermon-hero__artwork { aspect-ratio: 16/10; border-radius: 18px; box-shadow: 0 30px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08); }
```

### Reader Grid + Sticky Aside
```css
.sermon-body { padding: 56px 0 80px; background: #fff; }
.sermon-reader-grid { display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 56px; align-items: start; }
.sermon-reader-grid__aside { position: sticky; top: 90px; display: flex; flex-direction: column; gap: 20px; }
```

### Tabs (WAI-ARIA underline)
```css
.sermon-tab { padding: 14px 22px 16px; font-weight: 700; color: var(--color-muted); border-radius: 6px 6px 0 0; }
.sermon-tab[aria-selected='true'] { color: var(--color-primary-dark); }
.sermon-tab[aria-selected='true']::after { content: ''; position: absolute; left: 16px; right: 16px; bottom: -1px; height: 3px; background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light)); }
.tab-panel { display: none; }
.tab-panel.is-active { display: block; animation: sermonFadeUp 0.4s ease; }
```

### Prose & Callout
```css
.prose { color: var(--text-secondary); font-size: 18px; line-height: 1.75; font-weight: 500; }
.prose strong { color: var(--text-heading); font-weight: 700; }
.prose .callout { /* Fraunces italic pull quote */
  background: linear-gradient(135deg, rgba(74,60,110,0.06), rgba(107,44,58,0.06));
  border-left: 4px solid var(--color-secondary);
  border-radius: 0 12px 12px 0;
  padding: 18px 22px; margin: 28px 0;
  font-family: var(--font-serif); font-style: italic; font-size: 18px; color: var(--text-heading);
}
```

### Numbered Section Heads
```css
.section-head { display: flex; gap: 18px; margin: 40px 0 20px; }
.section-head__num { /* gold-underlined numeral */
  min-width: 42px; font-size: 26px; font-weight: 700; color: var(--color-primary-dark);
  font-variant-numeric: tabular-nums; border-bottom: 2px solid var(--color-primary);
}
.section-head--unnumbered { gap: 0; } /* intro/context heads drop the numeral */
.section-head__kicker { font-size: 11px; font-weight: 800; letter-spacing: 2.5px; text-transform: uppercase; color: var(--color-primary-dark); }
.section-head__title  { font-size: 26px; font-weight: 800; letter-spacing: -0.8px; color: var(--text-heading); }
```
Nested `.section-subitems > .section-subitem` repeat the pattern at a smaller scale (28px numeral, 1px gold underline).

### Blessings Grid
```css
.blessings { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
.blessing  { background: #fff; border: 1px solid var(--border-color-light); border-radius: 20px; padding: 22px; transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
.blessing:hover { transform: translateY(-4px); border-color: rgba(212,168,75,0.50); box-shadow: 0 16px 32px rgba(212,168,75,0.12); }
.blessing__num { /* giant translucent Fraunces numeral, top-right */
  font-family: var(--font-serif); font-style: italic; font-size: 48px; font-weight: 500;
  color: rgba(212, 168, 75, 0.18); position: absolute; top: 16px; right: 20px;
}
.blessing[data-span='full'] { grid-column: 1 / -1; }
```

### Key Takeaways
```css
.takeaways { background: #fff; border: 1px solid var(--border-color-light); border-radius: 20px; padding: 28px; box-shadow: 0 4px 24px var(--shadow-color-soft); }
.takeaways::before { content: ''; position: absolute; inset: 0 0 auto 0; height: 4px; background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light), var(--color-primary)); }
.takeaways__list .n { /* navy numbered circle */ width: 28px; height: 28px; border-radius: 50%; background: var(--color-navy); color: #fff; font-weight: 700; display: grid; place-items: center; }
```

### Scripture List
```css
.scripture-item {
  display: grid; grid-template-columns: 56px 1fr; gap: 20px;
  background: linear-gradient(180deg, #fff 0%, rgba(248,250,252,0.82) 100%);
  border: 1px solid var(--border-color-light);
  border-left: 4px solid rgba(212, 168, 75, 0.72);
  border-radius: 8px; padding: 22px 24px 22px 20px;
}
.scripture-item:hover { border-color: rgba(212,168,75,0.50); transform: translateY(-2px); box-shadow: 0 16px 32px rgba(26,39,68,0.11); }
.scripture-badge { /* navy gradient, Fraunces italic abbreviation */
  width: 56px; height: 56px; border-radius: 8px;
  background: linear-gradient(135deg, var(--color-navy), var(--color-navy-dark)); color: #fff;
  font-family: var(--font-serif); font-style: italic; font-weight: 800;
}
.scripture-quote p { font-family: var(--font-serif); font-size: 15.5px; line-height: 1.75; max-width: 72ch; }
.verse-ref { /* inline serif italic, purple chip */
  font-family: var(--font-serif); font-style: italic; padding: 2px 10px; border-radius: 6px;
  background: rgba(74, 60, 110, 0.08); color: var(--color-secondary); cursor: help;
}
.verse-ref:hover { background: var(--color-secondary); color: #fff; }
```

### Aside Cards (sticky rail)
```css
.aside-card { background: #fff; border: 1px solid var(--border-color-light); border-radius: 20px; padding: 20px; }
.aside-card h4::before { content: ''; width: 16px; height: 2px; background: var(--color-primary); } /* gold tick */

.toc { background: rgba(255,255,255,0.85); backdrop-filter: blur(10px); border: 1px solid var(--border-color-light); border-radius: 20px; padding: 22px; }
.toc__item a[aria-current='location'] { background: rgba(212,168,75,0.12); color: var(--color-primary-dark); font-weight: 700; }
.toc__num { width: 22px; height: 22px; border-radius: 50%; background: rgba(26,39,68,0.08); font-family: var(--font-serif); font-style: italic; }

.speaker { background: linear-gradient(135deg, rgba(212,168,75,0.08), rgba(212,168,75,0.02)); border: 1px solid rgba(212,168,75,0.15); border-radius: 14px; padding: 14px; }
.speaker__avatar { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark)); font-family: var(--font-serif); color: #fff; }

.event-row:hover { background: rgba(212,168,75,0.06); }
.event-date-badge { background: linear-gradient(135deg, var(--color-navy), var(--color-navy-dark)); color: #fff; } /* navy date chip */
```

### Sermon Buttons & Video
```css
.sermon-btn { padding: 13px 22px; border-radius: 50px; font-size: 13px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; border: 1.5px solid transparent; transition: all 0.25s cubic-bezier(0.4,0,0.2,1); }
.sermon-btn--gold    { background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark)); color: #fff; }
.sermon-btn--gold:hover { transform: translateY(-2px); box-shadow: 0 14px 32px var(--gold-shadow-hover); }
.sermon-btn--outline { border-color: var(--color-primary); color: var(--color-primary-dark); }
.sermon-btn--ghost   { background: rgba(26,39,68,0.04); color: var(--text-heading); }
.sermon-btn--block   { width: 100%; }

.video-aside { border-radius: 14px; overflow: hidden; aspect-ratio: 16/9; background: var(--color-navy-dark); }
```

**Reader breakpoints:** at `≤1023px` the grid collapses to one column and the aside un-sticks; at `≤768px` the hero artwork centers, blessings go single-column, and numerals shrink.

> **Tab-panel animation gotcha:** the global `ScrollAnimationProvider` observes elements once on mount. Content-switcher panels that mount later must reveal their cards on mount (via `requestAnimationFrame`), not via a fresh observer.

---

## 16. Admin Shell (`admin-layout.css` + `admin.css`)

The authenticated area (`(protected)` route group) uses a **dark-chrome, antique-gold** aesthetic — distinct from the warm public gold. All classes are prefixed (`admin-layout-*`, `admin-header-*`, `admin-user-menu`) to prevent global bleed.

### Layout Scaffold (`AdminLayout.tsx`)
```css
.admin-layout {
  --admin-sidebar-width: 260px;
  --admin-header-height: 64px;
  min-height: 100vh;
  background: #f8f9fa;
}
.admin-layout-header  { position: fixed; inset: 0 0 auto 0; height: var(--admin-header-height); z-index: 100; }
.admin-layout-sidebar { position: fixed; left: 0; top: var(--admin-header-height); bottom: 0; width: var(--admin-sidebar-width); transform: translateX(-100%); transition: transform 0.25s ease; z-index: 80; }
.admin-layout-sidebar.is-open { transform: translateX(0); }
.admin-layout-sidebar.is-mobile { top: 0; z-index: 200; }           /* slides over content on mobile */
.admin-layout-main { padding-top: var(--admin-header-height); transition: margin-left 0.25s ease; }
.admin-layout-main.is-sidebar-visible { margin-left: var(--admin-sidebar-width); }
.admin-layout-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 150; } /* mobile scrim */
.admin-layout-breadcrumbs { padding: 12px 24px; background: #fff; border-bottom: 1px solid #e9ecef; }
.admin-layout-page { flex: 1; padding: 24px; }
```

### Admin Header (`Header.tsx`)
```css
.admin-header {
  height: 64px;
  background: linear-gradient(135deg, #0a0a0f 0%, #0d1525 50%, #0d1a2d 100%);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  z-index: 100;
}
.admin-header-logo { /* antique-gold gradient tile */
  width: 40px; height: 40px; border-radius: 10px;
  background: linear-gradient(145deg, #c0a067 0%, #a8894f 100%);
  box-shadow: 0 4px 12px rgba(192, 160, 103, 0.3);
}
.admin-header-action { width: 38px; height: 38px; border-radius: 8px; color: rgba(255,255,255,0.7); }
.admin-header-action:hover { background: rgba(255,255,255,0.06); color: #fff; }
.admin-header-badge  { background: #ef4444; color: #fff; box-shadow: 0 0 0 2px #0d1525; } /* notification count */
```

### Hamburger → X Morph
```css
.admin-header-menu-toggle .line { width: 20px; height: 2px; background: rgba(255,255,255,0.7); transition: transform 0.3s ease, opacity 0.3s ease, background 0.2s ease; }
.admin-header-menu-toggle:hover .line { background: #c0a067; }
.admin-header-menu-toggle.is-open .line:nth-child(1) { transform: translateY(7px) rotate(45deg); background: #c0a067; }
.admin-header-menu-toggle.is-open .line:nth-child(2) { opacity: 0; transform: scaleX(0); }
.admin-header-menu-toggle.is-open .line:nth-child(3) { transform: translateY(-7px) rotate(-45deg); background: #c0a067; }
```

### User Dropdown (`admin-user-menu`)
PrimeReact `Menu`, restyled: white panel, 12px radius, `0 12px 32px rgba(15,23,42,0.12)` shadow. Each item has a `28×28` rounded icon tile (`#f3f4f6` → antique-gold tint on hover). The **last item (logout)** gets a danger accent (`#b91c1c` text, `#fee2e2` icon tile).

> The admin avatar (`.p-avatar`) and logo both use the `#c0a067 → #a8894f` antique-gold gradient. User name is `13px/600` white; role is `11px` capitalized at 50% opacity.

---

## 17. Authentication Page (`signin.css`)

A split-screen layout: a gold **branding panel** (left, desktop-only) and a **form column** (right). Loaded on `(auth)/signin` alongside `landing.css`.

### Split Layout
```css
.signin-page { display: flex; min-height: 100vh; }
.signin-branding { display: none; width: 50%; padding: 60px; color: #fff;
  background: linear-gradient(135deg, var(--primary-gold-accent) 0%, #a8894f 50%, #8b7340 100%); }
.signin-form-container { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 20px; background: var(--background-main); }

@media (min-width: 992px) {
  .signin-branding { display: flex; flex-direction: column; }  /* branding only on desktop */
  .signin-form-container { width: 50%; }
}
```
The branding panel layers two floating radial glows (`::before` / `::after`, animated via `float`) and a faint SVG cross-hatch (`.signin-branding-decor`). The form container has a faint dotted SVG texture in antique gold.

### Feature List (branding)
```css
.signin-feature { display: flex; gap: 20px; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 16px; backdrop-filter: blur(10px); }
.signin-feature:hover { background: rgba(255,255,255,0.15); transform: translateX(5px); }
.signin-feature-icon { width: 54px; height: 54px; border-radius: 14px; background: rgba(255,255,255,0.2); }
```

### Form Inputs
```css
.signin-field .p-inputtext, .signin-field .p-password input {
  width: 100% !important; padding: 14px 16px;
  border: 2px solid var(--border-color); border-radius: 12px; font-size: 15px;
}
.signin-field .p-inputtext:focus {
  border-color: var(--primary-gold-accent);
  box-shadow: 0 0 0 4px var(--gold-shadow-hover);   /* 4px gold ring */
}
.signin-field-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-secondary); }
.signin-field:focus-within .signin-field-icon { color: var(--primary-gold-accent); } /* icon lights up on focus */
```

### Submit, Error & Social
```css
.signin-submit { width: 100%; padding: 16px 24px; border-radius: 12px; overflow: hidden; position: relative; }
.signin-submit::before { /* sheen sweep on hover */ content: ''; position: absolute; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); transition: left 0.5s ease; }
.signin-submit:hover:not(:disabled)::before { left: 100%; }
.signin-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(192, 160, 103, 0.35); }

.signin-error { background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border: 1px solid #fecaca; color: #dc2626; border-radius: 12px; animation: shake 0.5s ease-in-out; }
.signin-divider::before, .signin-divider::after { background: linear-gradient(to right, transparent, var(--border-color), transparent); } /* gradient rule */
.signin-social-btn { border: 2px solid var(--border-color); border-radius: 12px; }
.signin-social-btn.google i { background: linear-gradient(135deg, #4285f4, #ea4335, #fbbc05, #34a853); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
```
The whole `.signin-form-wrapper` enters with a `fadeInUp 0.6s` animation. Mobile (`<992px`) hides the branding panel and shows a centered mobile logo + back-link instead.

---

## 18. VIP Registration Form (`vip-form.css`)

A two-column event registration (`events/vip-form`): a **sticky dark welcome card** + a white form panel. Loaded with `landing.css` + `vip-form.css`.

### Grid & Welcome Card
```css
.vip-layout-grid { display: grid; grid-template-columns: 350px 1fr; gap: 30px; align-items: start; }
.vip-welcome-card {
  position: sticky; top: 100px; height: 600px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); /* slate, NOT navy token */
  border-radius: 30px; padding: 40px; color: #fff;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}
.vip-welcome-card .glass-overlay { position: absolute; inset: 0; background: url(...community.jpg) center/cover; opacity: 0.2; filter: grayscale(100%); }
.icon-badge { width: 50px; height: 50px; border-radius: 15px; background: var(--primary-gold-accent); box-shadow: 0 10px 20px rgba(240, 180, 41, 0.4); }
```

### Form Panel
```css
.vip-form-container { background: #fff; border-radius: 30px; padding: 50px; box-shadow: 0 30px 60px rgba(0,0,0,0.12); border: 1px solid rgba(0,0,0,0.12); }
.step-label { color: var(--primary-gold-accent); font-weight: 700; text-transform: uppercase; letter-spacing: 2px; font-size: 12px; }
.section-number { /* gold-tinted numbered chip per form section */ width: 30px; height: 30px; border-radius: 8px; color: var(--primary-gold-accent); background: rgba(240, 180, 41, 0.1); font-weight: 800; }
.form-row { display: grid; grid-template-columns: 1fr; gap: 20px; }
.form-error-alert { background: #fff1f2; color: #e11d48; border-radius: 12px; }
```

### Submit & Success
```css
.vip-submit-button { width: 100%; background: #0f172a; color: #fff; padding: 18px; border-radius: 15px; box-shadow: 0 10px 20px rgba(15, 23, 42, 0.2); }
.vip-submit-button:hover:not(:disabled) { background: #1e293b; transform: translateY(-2px); box-shadow: 0 15px 30px rgba(15, 23, 42, 0.3); }

.success-icon-wrapper { width: 100px; height: 100px; border-radius: 50%; background: var(--primary-gold-accent); color: #fff; }
.pulse-ring { position: absolute; inset: 0; border-radius: 50%; background: var(--primary-gold-accent); opacity: 0.4; animation: pulse 2s infinite; } /* expanding ring */
```
Responsive: collapses to a single column at `≤992px` (welcome card un-sticks); form rows go single-column at `≤640px`.

---

## 19. Animations & Transitions

### Keyframes (`globals.css`)
`fadeIn`, `fadeOut`, `slideUp`, `slideDown`, `slideInLeft`, `slideInRight`, `spin`, `pulse`.

### Scoped Keyframes
| Animation | File | Use |
|-----------|------|-----|
| `sermonFadeUp` | `sermon-detail.css` | Active tab-panel reveal (opacity + 8px rise) |
| `float` | `signin.css` | Drifting radial glows on branding panel (15–20s) |
| `shake` | `signin.css` | Login error nudge |
| `fadeInUp` | `signin.css` | Form wrapper entrance (0.6s) |
| `pulse` (scale) | `vip-form.css` | Success ring expansion `scale(1)→scale(2)`, fade out |

### Animation Utility Classes
```css
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
.animate-slide-up { animation: slideUp 0.3s ease-out; }
.animate-slide-in-left  { animation: slideInLeft 0.3s ease-out; }
.animate-slide-in-right { animation: slideInRight 0.3s ease-out; }
.animate-spin  { animation: spin 1s linear infinite; }
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
```

### Transition Standards
| Timing | Value | Usage |
|--------|-------|-------|
| **Fast** | `0.2s ease` | Micro-interactions (icons, underlines) |
| **Standard** | `0.25s ease` | Buttons, links, inputs, admin chrome |
| **Smooth** | `0.3s ease` | Dropdowns, menus, tooltips |
| **Elegant** | `0.4s ease` | Card transforms |
| **Premium** | `0.5s cubic-bezier(0.4, 0, 0.2, 1)` | Glass cards, major transitions |

### Scroll Animations
```css
.animate-on-scroll {
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
  will-change: opacity, transform;
}
.animate-on-scroll.visible { opacity: 1; transform: translateY(0); }
/* staggered: nth-child(1..4) → transition-delay 0.05s..0.2s */
```

---

## 20. Responsive Design

### Breakpoints
| Name | Width | Notes |
|------|-------|-------|
| Mobile Small | `480px` | Extra small devices |
| Mobile | `640px / 768px` | `form-row` collapse / hero fixed-height |
| Tablet | `992px / 1024px` | Sidebar off-canvas; signin/vip collapse; reader un-sticks |
| Desktop | `1024px+` | Full multi-column layouts |

### Grid Adjustments
| Component | Desktop | Tablet | Mobile |
|-----------|---------|--------|--------|
| Hero | 75vh | 75vh | 650px fixed |
| Sermons | 3 cols | 2 cols | 1 col |
| Ministries / Events | 2–3 cols | 2 cols | 1 col |
| Process Steps | 7 cols + connectors | 2 cols | 2 cols |
| Sermon reader | content + 340px aside | 1 col | 1 col |
| VIP form | 350px + form | 1 col | 1 col |
| Footer Links | 4 cols | 2 cols | 1 col |

### Typography Scaling
| Element | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Hero H1 | 56px | 42px | 32px |
| Sermon Hero | clamp 40–64px | — | clamp 32–64px |
| Section H2 | 36px | 32px | 28px |
| Card H3 | 24px | 22px | 20px |
| Body | 15px | 15px | 14px |

### Admin Responsiveness
The admin sidebar is **off-canvas by default** and slides in (`transform: translateX(0)`). Below tablet it overlays content (`.is-mobile`, `z-index: 200`) with a dimming scrim (`.admin-layout-overlay`). The legacy `.sidebar`/`.main-content` utilities in `globals.css` collapse `margin-left` to `0` at `≤1024px`.

---

## 21. PrimeReact Component Overrides

> Base theme: **`lara-light-blue`** (imported in `app/layout.tsx`), then overridden in `globals.css`. Library version **PrimeReact 10.9**.

### Inputs, Dropdowns, Buttons
```css
.p-inputtext { @apply w-full rounded-lg border border-gray-300 px-4 py-3 transition-all; }
.p-inputtext:focus { @apply border-primary outline-none ring-2 ring-primary/20; }
.p-dropdown { @apply w-full rounded-lg border border-gray-300; }
.p-dropdown:not(.p-disabled):hover { @apply border-primary; }
.p-button { @apply rounded-lg font-medium transition-all; }
.p-button.p-button-primary { @apply bg-primary hover:bg-primary-dark; }
.p-button.p-button-success { @apply bg-success hover:bg-success-dark; }
.p-button.p-button-danger  { @apply bg-error hover:bg-error-dark; }
```

### DataTable, Dialog, Card, Menu
```css
.p-datatable .p-datatable-thead > tr > th { @apply bg-surface font-semibold text-foreground; }
.p-datatable .p-datatable-tbody > tr { @apply border-b border-border; }
.p-dialog { @apply rounded-xl shadow-2xl; }
.p-card  { @apply rounded-xl border border-border shadow-sm; }
.p-menu  { @apply rounded-lg border border-border shadow-lg; }
.p-steps .p-steps-item.p-highlight .p-steps-number { @apply bg-primary text-white; }
```

### Dialog / Modal

PrimeReact dialogs are **portaled to `<body>`**, so overrides can't live under a page-scoped root — style them globally with a **unique class prefix** passed via the dialog's `className` (e.g. `.lf-song-dialog`).

Anatomy:
- **Header:** navy bg + **white** title. The close ✕ must be **white** — lara leaves it dark on a dark header: `.your-dialog .p-dialog-header .p-dialog-header-icon { color:#fff; }`.
- **Header corner radius must match the dialog frame.** The global override sets `.p-dialog { border-radius:12px }` (`rounded-xl`) but lara keeps the header at `border-top-*-radius: 6px`, so a navy header's corners don't follow the frame and the title looks clipped at the top-left. Fix per dialog: `overflow:hidden` on the frame **and** match the header's top radii to the frame (12px).
- **Restore the header padding — Tailwind v4 preflight zeroes it.** Because `@import "tailwindcss"` (preflight) loads after the lara theme, the header's `padding: 1.5rem` collapses to **0** in this app, so the title jams into the rounded corner and the bar shrinks. Set it explicitly on your scoped header rule — `padding: 1.25rem 1.5rem` (the `1.5rem` horizontal aligns the title with the `1.5rem` content inset) — plus `gap: 0.75rem` so a truncated title never butts the ✕. Truncate long titles with `min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap` on `.p-dialog-title`.
- **Content:** real padding (`≈1.25rem 1.5rem`). Long content scrolls **inside** the dialog (`max-height ≈ 45vh; overflow:auto`), never by growing the dialog past the viewport.
- **Footer / actions:** separate with `border-top`, pad it, size + space the buttons. **Primary action = gold, on the right.**

### InputSwitch & Tailwind v4 Preflight

- Tailwind v4 preflight resets `::before/::after` to `margin:0`, which breaks the InputSwitch knob (it overflows the track as a "notch"). Global fix (already in `globals.css`): `.p-inputswitch .p-inputswitch-slider::before { margin-top:-0.625rem; }`.
- The checked-state class is **`.p-highlight`** (not `.p-inputswitch-checked`). Brand the "on" colour: `.scope .p-inputswitch.p-highlight .p-inputswitch-slider { background: var(--color-primary); }`.

### Toast Notifications (semantic light tints)
```css
.p-toast { opacity: 1; }
.p-toast-message-success { background: var(--color-success-light); border-left: 4px solid var(--color-success); }
.p-toast-message-error   { background: var(--color-error-light);   border-left: 4px solid var(--color-error); }
.p-toast-message-warn    { background: var(--color-warning-light); border-left: 4px solid var(--color-warning); }
.p-toast-message-info    { background: var(--color-info-light);    border-left: 4px solid var(--color-info); }
```

> Whatever the severity background, declare its text/icon colour **explicitly** (icons may render as SVG → set both `color` **and** `fill`). The **warn/gold** toast uses **navy** text + icons — never white (white-on-gold fails contrast).

### Invalid Inputs
```css
.p-invalid, .p-invalid.p-inputtext, .p-invalid .p-inputtext { border: 1px solid var(--velvet); }
```

---

## 22. Scrollbar Styling

```css
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { @apply bg-gray-100 rounded-full; }
::-webkit-scrollbar-thumb { @apply bg-gray-300 rounded-full; }
::-webkit-scrollbar-thumb:hover { @apply bg-gray-400; }
```

---

## 23. Performance & Accessibility

### GPU Acceleration & Containment
```css
.gpu-accelerated { transform: translate3d(0, 0, 0); backface-visibility: hidden; }
.hero-section { contain: strict; overflow: clip; } /* limit repaint on complex sections */
```

### Smooth Scroll (desktop only)
Smooth scroll is **opt-in by viewport** to avoid janky mobile / iOS behavior:
```css
html { scroll-behavior: auto; }
@media (min-width: 769px) and (prefers-reduced-motion: no-preference) {
  html { scroll-behavior: smooth; }
}
```

### Reduced Motion
Both `globals` and `sermon-detail` honor reduced motion:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Focus Visibility
Interactive reader/admin elements use `:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2-3px; }`. The sermon TOC marks the current section with `aria-current="location"`; tabs use `aria-selected`.

---

### Verify Visually (every UI change)

CSS / lint / tsc won't catch contrast or cramped spacing. Run the dev server (`pnpm dev` → **port 3100**; Next 16 allows only one `next dev`) and screenshot with Playwright at **desktop** and a **narrow (~540px)** width before calling any UI change done.

---

## 24. CSS Variables Reference

Complete `:root` block as defined in `globals.css`:
```css
:root {
  /* Primary (Warm Gold) */
  --color-primary: #d4a84b;
  --color-primary-light: #e5c47a;
  --color-primary-dark: #b8923f;

  /* Secondary (Royal Purple) */
  --color-secondary: #4a3c6e;
  --color-secondary-light: #6b5a8e;
  --color-secondary-dark: #352a52;

  /* Accent (Rich Burgundy) */
  --color-accent: #6b2c3a;
  --color-accent-light: #8e4a5a;
  --color-accent-dark: #4d1f2a;

  /* Semantic */
  --color-success: #22C55E; --color-success-light: #4ADE80; --color-success-dark: #16A34A;
  --color-warning: #d4a84b; --color-warning-light: #e5c47a; --color-warning-dark: #b8923f;
  --color-error:   #6b2c3a; --color-error-light:   #8e4a5a; --color-error-dark:   #4d1f2a;
  --color-info:    #4a3c6e; --color-info-light:    #6b5a8e; --color-info-dark:    #352a52;

  /* Neutrals */
  --color-background: #f5f0e6;
  --color-foreground: #0d1424;
  --color-muted: #1f2937;
  --color-border: #c8bfa8;
  --color-surface: #ffffff;

  /* Landing / Public theme */
  --primary-gold-accent: #d4a84b;
  --background-main: #f5f0e6;
  --background-section: #ffffff;
  --text-primary: #0d1424;
  --text-heading: #020617;
  --text-secondary: #1e293b;
  --border-color: #c8bfa8;
  --border-color-light: #ddd5c4;
  --button-text-on-gold: #ffffff;
  --button-text-on-light: #d4a84b;
  --header-background: rgba(245, 240, 230, 0.95);
  --footer-background: #1a2744;
  --shadow-color-soft: rgba(26, 39, 68, 0.14);
  --shadow-color-medium: rgba(26, 39, 68, 0.22);
  --gold-shadow-hover: rgba(212, 168, 75, 0.25);

  /* Named sanctuary colors */
  --color-navy: #1a2744;
  --color-navy-dark: #151e32;
  --color-purple: #4a3c6e;
  --color-burgundy: #6b2c3a;
  --color-cream: #f5f0e6;
  --color-ivory: #faf8f3;
  --velvet: #DA4453;

  /* High-contrast utilities */
  --color-contrast-dark: #000000;
  --color-contrast-light: #ffffff;
  --color-glass: rgba(255, 255, 255, 0.85);
  --color-glass-dark: rgba(26, 39, 68, 0.85);

  /* Typography spacing */
  --letter-spacing-tight: -1.5px;
  --letter-spacing-tighter: -1.8px;
  --letter-spacing-normal: -0.5px;

  /* Layout */
  --sidebar-width: 280px;
  --sidebar-collapsed-width: 80px;
  --header-height: 64px;

  /* Fonts */
  --font-sans: var(--font-inter), 'Inter', system-ui, -apple-system, sans-serif;
  --font-display: var(--font-inter), 'Inter', system-ui, -apple-system, sans-serif;
  --font-family-sans-serif: var(--font-inter), 'Inter', system-ui, sans-serif;
  --font-family-headings: var(--font-inter), 'Inter', system-ui, sans-serif;
  --font-serif: var(--font-fraunces), 'Fraunces', Georgia, serif;
}
```
Scoped additions: `--form-text-color: #242124` (`form-input.css`); `--admin-sidebar-width: 260px`, `--admin-header-height: 64px` (scoped to `.admin-layout`).

---

## 25. File Structure Reference

```
/src
  /app
    ├── layout.tsx              # Root: loads Inter + Fraunces, PrimeReact theme, globals.css, QueryProvider
    ├── globals.css             # Tokens, @theme bridge, PrimeReact overrides, utilities, animations (738 lines)
    ├── page.tsx                # Home (imports landing.css)
    ├── (public)/
    │   ├── layout.tsx          # Imports landing.css + sermon-detail.css
    │   ├── about/ connect/ events/ give/ ministries/ sermon-notes/
    │   └── events/vip-form/    # Imports vip-form.css
    ├── (auth)/signin/          # Imports landing.css + signin.css
    ├── (protected)/            # Admin area (AdminLayout + Header)
    └── api/                    # Route handlers (inquiry, event, churches, campaigns, auth)
  /styles
    ├── landing.css             # Public/landing components (~14,700 lines) — hero, sections, cards, footer, About/Give pages, galleries, dashboards
    ├── sermon-detail.css       # Sermon reader layout (~1,180 lines) — Fraunces serif, reader grid, TOC
    ├── signin.css              # Auth split-screen (~630 lines)
    ├── admin.css               # Admin dark header + user menu (~300 lines)
    ├── admin-layout.css        # Admin scaffold: sidebar/header/overlay (~110 lines)
    └── vip-form.css            # VIP registration 2-col form (~290 lines)
  /components
    ├── layout/                 # AdminLayout.tsx (→ admin-layout.css), Header.tsx (→ admin.css)
    ├── landing/                # PageHero, LandingHeader, per-feature folders (about/, connect/, give/, events/)
    └── forms/styles/
        └── form-input.css      # PrimeReact form input theming (~130 lines)
```

### Stylesheet → Surface Map
| Stylesheet | Imported by | Surface |
|------------|-------------|---------|
| `globals.css` | root `layout.tsx` | Everything (tokens + base) |
| `landing.css` | `(public)/layout.tsx`, `page.tsx`, signin, vip | Public marketing pages |
| `sermon-detail.css` | `(public)/layout.tsx` | `/sermon-notes/[slug]` reader |
| `signin.css` | `(auth)/signin/page.tsx` | Login |
| `vip-form.css` | `events/vip-form/VipFormClient.tsx` | VIP registration |
| `admin-layout.css` | `components/layout/AdminLayout.tsx` | Admin scaffold |
| `admin.css` | `components/layout/Header.tsx` | Admin header |
| `form-input.css` | every `components/forms/Form*.tsx` | Form inputs |

---

## 26. Quick Reference

### Common Class Patterns
**Cards:** `.premium-glass-card` · `.premium-stat-card` · `.process-step-card` · `.event-card` · `.ministry-card` · `.sermon-card` · `.blessing` · `.scripture-item`

**Buttons:** `.landing-btn-primary` (gold gradient) · `.landing-btn-outline` · `.btn-contrast` · `.btn-gold-border` · `.sermon-btn--gold` · `.vip-submit-button` · `.signin-submit`

**Sections:** `.section-dark` (navy) · `.section-black` · `.sermon-hero` (navy reader hero)

**Typography:** `.heading-tight` (-1.5px) · `.heading-tighter` (-1.8px) · `.page-title` · `.section-title` · serif via `var(--font-serif)`

**Surfaces:** `.admin-layout-*` (admin shell) · `.admin-header-*` (admin chrome) · `.signin-*` (auth) · `.vip-*` (VIP form) · `.sermon-*` / `.scripture-*` / `.toc` (reader)

### Key Design Decisions
1. **Two fonts:** Inter for everything; **Fraunces serif (italic)** only for reverent/editorial emphasis in the sermon reader.
2. **Two golds:** warm `#d4a84b` for public; muted antique `#c0a067` for admin chrome.
3. Cards lift `8–12px` on hover with a gold-tinted shadow glow.
4. Buttons translate `-2px` on hover with enhanced shadow.
5. Glassmorphism (`blur(12px)`) for floating/premium elements.
6. Navy `#1a2744` is the canonical dark background; near-black `#020617` for landing headings.
7. Invalid form fields use **velvet `#DA4453`** (not burgundy).
8. Transitions live in the `0.25s–0.5s` range with `ease` or `cubic-bezier(0.4, 0, 0.2, 1)`.
9. Tailwind v4 is **CSS-configured** (`@theme inline`) — there is no `tailwind.config.js`.
10. Motion is gated: smooth-scroll desktop-only, full `prefers-reduced-motion` support.
```
