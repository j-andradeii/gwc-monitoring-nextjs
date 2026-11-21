# Tokens, typography, motion (checked against the CSS 2026-11-21)

Source of truth: `src/app/globals.css` `:root`. If a value here and the CSS disagree, the CSS wins — fix this file.

## Colour tokens (`:root`)

### Brand
| Token | Value | Use |
|---|---|---|
| `--color-primary` | `#d4a84b` | warm gold: primary accent, CTAs, highlights |
| `--color-primary-light` | `#e5c47a` | hover, glows, Fraunces `em` on dark heroes |
| `--color-primary-dark` | `#b8923f` | gold **text** on white, active states |
| `--color-secondary` | `#4a3c6e` | royal purple: info, callout border, verse chips |
| `--color-secondary-light` / `-dark` | `#6b5a8e` / `#352a52` | hover / active |
| `--color-accent` | `#6b2c3a` | rich burgundy |
| `--color-accent-light` / `-dark` | `#8e4a5a` / `#4d1f2a` | mid tint (never a text background) / active |

### Semantic
| Token | Base | `-light` | `-dark` |
|---|---|---|---|
| `--color-success` | `#22C55E` | `#4ADE80` | `#16A34A` |
| `--color-warning` | `#d4a84b` (gold) | `#e5c47a` | `#b8923f` |
| `--color-error` | `#6b2c3a` (burgundy) | `#8e4a5a` | `#4d1f2a` |
| `--color-info` | `#4a3c6e` (purple) | `#6b5a8e` | `#352a52` |

Toasts don't use `--color-success`: the success toast is a darker `#15803d` so white text passes (see `DESIGN.md`).

### Neutrals and text
| Token | Value | Note |
|---|---|---|
| `--color-background` | `#f5f0e6` | `body` background |
| `--color-foreground` | `#000` | `body` text |
| `--color-muted` | `#000` | (was slate; now black) |
| `--color-border` | `#c8bfa8` | warm sand |
| `--color-surface` | `#ffffff` | card base |

### Named sanctuary colours
| Token | Value | Use |
|---|---|---|
| `--color-navy` | `#1a2744` | canonical dark surface: footer, dark sections, badges |
| `--color-navy-dark` | `#151e32` | gradient end |
| `--color-purple` / `--color-burgundy` | `#4a3c6e` / `#6b2c3a` | aliases |
| `--color-cream` | `#f5f0e6` | warm light band |
| `--color-ivory` | `#faf8f3` | alternate section band (`.section-alternate-bg`) |
| `--velvet` | `#DA4453` | **invalid field border** (not `--color-error`) |

### Landing / public aliases (used across `landing.css`, `signin.css`, `vip-form.css`)
| Token | Value |
|---|---|
| `--primary-gold-accent` | `#d4a84b` |
| `--background-main` | `#f5f0e6` |
| `--background-section` | `#ffffff` |
| `--text-primary`, `--text-heading`, `--text-secondary` | `#000` (all three) |
| `--border-color` | `#c8bfa8` |
| `--border-color-light` | `#ddd5c4` (hairlines, reader cards) |
| `--button-text-on-gold` | `#ffffff` (drift — gold surfaces need navy text) |
| `--button-text-on-light` | `#d4a84b` |
| `--header-background` | `rgba(245, 240, 230, 0.95)` |
| `--footer-background` | `#1a2744` |

### Glass, contrast, shadow colours
| Token | Value |
|---|---|
| `--color-glass` / `--color-glass-dark` | `rgba(255, 255, 255, 0.85)` / `rgba(26, 39, 68, 0.85)` |
| `--color-contrast-dark` / `--color-contrast-light` | `#000000` / `#ffffff` |
| `--shadow-color-soft` | `rgba(26, 39, 68, 0.14)` |
| `--shadow-color-medium` | `rgba(26, 39, 68, 0.22)` |
| `--gold-shadow-hover` | `rgba(212, 168, 75, 0.25)` (gold glow, 4px focus ring on sign-in) |

### Scoped tokens (not in `:root` of `globals.css`)
| Where | Tokens |
|---|---|
| `components/forms/styles/form-input.css` `:root` | `--form-text-color: #000`, `--form-border-color: #6b7280` |
| `styles/admin-layout.css` `.admin-layout`, `.admin-user-menu` | all admin tokens — see "Admin tokens" below |
| `styles/sermon-detail.css` `.sermon-hero`, `styles/landing.css` `.hero-carousel-section` | `--hero-scrim: 14, 12, 16`, `--hero-gold: 212, 168, 75`, `--hero-ink`, `--hero-rule` (RGB triplets for `rgba(var(--x), a)`) |

### Admin tokens (`src/styles/admin-layout.css`)
| Token | Value | Use |
|---|---|---|
| `--admin-gold` / `--admin-gold-dark` | `var(--color-primary)` `#d4a84b` / `var(--color-primary-dark)` `#b8923f` | the site gold: borders, rules, dots, glyphs on dark |
| `--admin-gold-ink` | `#7f652d` | gold-coloured **text** and focus rings on light (5.5:1 white, 5.1:1 on gold-soft) |
| `--admin-gold-fill` / `--admin-gold-fill-hover` | `linear-gradient(135deg, #d4a84b, #c9973f)` / reversed | gold components — same as `.landing-btn-primary` |
| `--admin-on-gold` | `#ffffff` | text/glyphs on the fill — owner's rule; ≈ 2.2–2.6:1, bold CTA labels only |
| `--admin-gold-soft` / `-glow` / `-border` | `#d4a84b` at 12% / `--gold-shadow-hover` (25%) / 30% | active fills, glows, hairlines |
| `--admin-chrome` / `--admin-chrome-edge` | `linear-gradient(135deg, #0a0a0f, #0d1525, #0d1a2d)` / `#0d1525` | header, drawer bar, dashboard banner |
| `--admin-navy` | `var(--color-navy)` | navy tiles |
| `--admin-canvas` / `--admin-surface` / `--admin-tile` | `#f8f9fa` / `#ffffff` / `#f3f4f6` | page / panels / neutral icon tiles |
| `--admin-border` / `--admin-border-mid` | `#e9ecef` / `#dee2e6` | hairlines / control borders |
| `--admin-text-heading`, `--admin-text-body` | `#000` | headings, body |
| `--admin-text-muted` | `#4b5563` | lightest text colour (7.6:1 white, 7.2:1 canvas) |
| `--admin-text-faint` | `#6b7280` | icons, chevrons, dots only |
| `--admin-shadow-rest` / `-lift` / `-gold` | `0 1px 2px rgba(16,24,40,.05), 0 4px 16px rgba(26,39,68,.06)` / `0 8px 24px rgba(26,39,68,.10), …` / `0 6px 20px rgba(212,168,75,.35)` | panels / hover / gold buttons |
| `--admin-radius-card` / `--admin-radius-control` | `14px` / `8px` | panels and cards / controls |
| `--admin-sidebar-width` / `--admin-header-height` | `288px` / `64px` | shell |
| `--admin-transition-fast` / `-standard` / `-elegant` | `0.2s` / `0.25s` / `0.4s ease` | motion |

### One gold
The admin uses the same warm gold as the public pages (`--admin-gold` aliases `--color-primary`); the older muted
"antique" admin gold (`#c0a067 → #a8894f`) was retired in spec 003 at the owner's request. Gold text on light
surfaces in the admin uses `--admin-gold-ink` (`#7f652d`).

### Dark mode
`@media (prefers-color-scheme: dark)` overrides only the neutrals: `--color-background #1A1A2E`,
`--color-foreground #F5F5F5`, `--color-muted #9CA3AF`, `--color-border #374151`, `--color-surface #1F2937`.
The landing aliases (`--background-main`, `--text-*`) don't change, so public pages stay light; anything styled
with the neutral tokens (`body`, Tailwind `bg-background`, `text-foreground`) follows the OS.

## Tailwind v4 bridge (`@theme inline`)
No `tailwind.config.js`; `globals.css` starts with `@import "tailwindcss"`. Bridged names: `primary`,
`primary-light`, `primary-dark`, `secondary(-light/-dark)`, `accent(-light/-dark)`, `success(-light/-dark)`,
`warning(-light/-dark)`, `error(-light/-dark)`, `info`, `background`, `foreground`, `muted`, `border`, `surface`,
fonts `sans`, `display`. **Not bridged:** `navy`, `cream`, `ivory`, `velvet`, `info-light/-dark`, the landing
aliases → use `bg-[var(--color-navy)]` etc.

## Typography

### Fonts (`src/app/layout.tsx`, `next/font/google`)
| Font | Variable | Weights | Role |
|---|---|---|---|
| Inter | `--font-inter` → `--font-sans` (also `--font-display`, `--font-family-sans-serif`, `--font-family-headings`) | 100–900 | all UI, headings, body (`<body class="font-sans">`) |
| Fraunces | `--font-fraunces` → `--font-serif` | 400/500/600, normal + italic | editorial emphasis only: sermon title `em`, callouts, scripture, big numerals, initials |

### Scale (examples are live selectors)
| Role | Size / weight / tracking | Example |
|---|---|---|
| Hero H1 | 56px / 800 / -1.8px, uppercase, lh 1.05 | `.hero-slide-content h1` |
| Campaign title | 52px / 800 / -1.8px | `.arise-build-title` |
| Sermon hero | `clamp(40px, 5vw, 64px)` / 800 / -2px, uppercase, lh 1.04 | `.sermon-hero__title` |
| Section H2 | 36px / 800 / -1.5px, lh 1.1 | `.about-content h2` |
| Reader section head | 26px / 800 / -0.8px | `.section-head__title` |
| Step / card title | 20px / 800 / 0.5px, uppercase | `.step-title` |
| Eyebrow / label | 11–12px / 800 / 2.5px, uppercase, gold, with 20px dash | `.section-label`, `.section-head__kicker` |
| Body (landing) | 15px / 500 / lh 1.65 | `.landing-page` |
| Body (global) | lh 1.6 / 500 | `body` |
| Reader prose | 18px / 500 / lh 1.75 | `.prose` |
| Admin page title | `text-2xl md:text-3xl` extrabold | `.page-title` |

Weights in use: 700 and 800 dominate, then 600, 500; 900 for a few badges. Body text stays ≥ 500.
Tracking tokens: `--letter-spacing-tight -1.5px` (`.heading-tight`), `--letter-spacing-tighter -1.8px`
(`.heading-tighter`), `--letter-spacing-normal -0.5px`.

## Shape and spacing
- **Radius in use:** 8px (most), 12px, 20px, 16px, 50px/999px (pills), 24px (glass cards), 14px, 10px, 6px.
  Pick from these; 24px for premium cards, 20px for reader/sermon cards, 8–12px for controls and small cards.
- **Container:** `.landing-container` `max-width: 1100px; padding: 0 24px` (20px ≤ 767px); admin/general
  `.container-custom` = `max-w-7xl px-4 sm:px-6 lg:px-8`.
- **Section padding:** heroes `116px 0 70px` (`.hero-section`); `.section-padding` = `py-12 md:py-16 lg:py-20`.
  Major cards use ~40px inner padding (24px on mobile); grids use 20–24px gaps.
- **Legacy layout vars** (`:root`): `--sidebar-width 280px`, `--sidebar-collapsed-width 80px`,
  `--header-height 64px` (old `.sidebar`/`.main-content` utilities). The admin shell uses the `--admin-*` vars.

## Shadows (live examples)
| Level | Value | Example |
|---|---|---|
| Resting card | `0 4px 24px rgba(0, 0, 0, 0.12)` | `.premium-glass-card` |
| Light card | `0 2px 12px rgba(0, 0, 0, 0.10)` | `.sermon-card` |
| Layered (step cards) | `0 4px 6px …0.10, 0 10px 20px …0.14, 0 20px 40px rgba(212,168,75,0.08)` | `.process-step-card` |
| Hover + gold glow | `0 24px 60px rgba(212, 168, 75, 0.15), 0 12px 24px rgba(0, 0, 0, 0.06)` | `.premium-glass-card:hover` |
| Floating panel | `0 10px 40px rgba(0, 0, 0, 0.08)` | `.nav-dropdown-menu` |
| Toast | `0 12px 30px rgba(16, 24, 40, 0.22)` | `.p-toast .p-toast-message` |
| Reader card | `0 4px 24px var(--shadow-color-soft)` | `.takeaways` |

Shadow opacity below 0.10 on a resting card reads flat in this design; cards on a tinted band float by shadow,
not by border.

## Motion
| Speed | Value | Use |
|---|---|---|
| fast | `0.2s ease` | icons, underlines, field focus |
| standard | `0.25s ease` | buttons, links, admin chrome |
| smooth | `0.3s ease` | dropdowns, hero controls |
| card | `0.4s cubic-bezier(0.4, 0, 0.2, 1)` | sermon/ministry cards |
| premium | `0.5s cubic-bezier(0.4, 0, 0.2, 1)` | glass and step cards |

- Hover contract: clickable cards lift 8–12px (`translateY`) with a gold glow and/or a 4px gold bottom bar
  (`::after` `scaleX(0 → 1)`); buttons lift 2px.
- Hover lifts are cancelled under `prefers-reduced-motion: reduce` (landing.css) and many components cancel them
  under `@media (hover: none)`.
- Keyframes in `globals.css`: `fadeIn`, `fadeOut`, `slideUp`, `slideDown`, `slideInLeft`, `slideInRight`, `spin`,
  `pulse` (+ `.animate-fade-in/-fade-out/-slide-up/-slide-down/-slide-in-left/-slide-in-right/-spin/-pulse`).
  Scoped keyframes live with their surface (`sermonFadeUp`, `video-lightbox-in`, `signinFadeUp`, `signinShake`,
  `posterHeroFade`, `heroSlideElementIn`, `pageHeroContentIn`, `fadeInUp`, `vm*`, `lf-*`, …) — prefix new ones
  with the surface name.
- Scroll reveal: `.animate-on-scroll` (`opacity 0; translate3d(0, 20px, 0)`, 0.5s) → `.animate-visible`, toggled
  by `ScrollAnimationProvider`; reduced motion shows it immediately.
- Smooth scrolling is desktop-only: `html { scroll-behavior: auto }`, `smooth` only at `min-width: 769px` with
  `prefers-reduced-motion: no-preference`.
- There is **no global** reduced-motion reset; each sheet adds its own `@media (prefers-reduced-motion: reduce)`
  block (landing, sermon-detail, vip-form). New animation brings its own.

## Breakpoints
`max-width: 768px` is the main mobile breakpoint (most rules), then 1024px, 900px, 640px, 480px, 767px; 992px for
sign-in / VIP layouts; 1023px for the sermon reader. Write mobile overrides with `max-width` like the rest of the
sheet you're in, and check ~540px.
