# Components and shared styles (checked against the CSS 2026-11-21)

Line numbers drift; search the class. Values are the live declarations, trimmed to what matters.
Reuse these before writing new CSS.

## Landing foundations (`src/styles/landing.css`)

| Class | What it gives |
|---|---|
| `.landing-page` | page root: Inter, `--text-primary`, `--background-main`, 15px / lh 1.65, antialiased |
| `.landing-container` | `max-width: 1100px; margin: 0 auto; padding: 0 24px` (20px ≤ 767px) |
| `.section-label` | eyebrow: inline-flex, 12px / 800 / 2.5px, uppercase, gold, `::before` 20×2px gold dash |
| `.section-label-light` | same on dark bands: 11px / 700, `rgba(255,255,255,0.85)`, white-50% dash |
| `.section-alternate-bg` | `background: var(--color-ivory)` for the next section in a stack |
| `.section-dark` (globals) | navy background + white text |
| `.section-black` (globals) | black background + white text |
| `.animate-on-scroll` → `.animate-visible` | fade-up reveal (20px, 0.5s), toggled by `ScrollAnimationProvider`; reduced motion shows it at once |
| `.heading-tight` / `.heading-tighter` (globals) | -1.5px / -1.8px tracking |
| `.page-title`, `.section-title`, `.label` (globals) | admin headings: `text-2xl md:text-3xl` extrabold / `text-xl` bold / `text-sm` medium |
| `.container-custom`, `.section-padding`, `.card-hover` (globals) | Tailwind compositions for admin/general pages |

## Cards

### `.premium-glass-card` — default premium content card
```css
.premium-glass-card { background: rgba(255,255,255,0.85); backdrop-filter: blur(12px); border-radius: 24px;
  border: 1px solid rgba(212,168,75,0.20); box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  transition: all 0.5s cubic-bezier(0.4,0,0.2,1); position: relative; overflow: hidden; }
.premium-glass-card::before { /* shine */ background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%); }
.premium-glass-card::after  { /* 4px bottom bar */ background: linear-gradient(90deg, var(--primary-gold-accent), #f9d976);
  transform: scaleX(0); transform-origin: left; transition: transform 0.4s ease; }
.premium-glass-card:hover   { transform: translateY(-12px); background: #fff; border-color: #fff;
  box-shadow: 0 24px 60px rgba(212,168,75,0.15), 0 12px 24px rgba(0,0,0,0.06); }
```
Blur drops to 8px ≤ 768px; the lift is cancelled under reduced motion.

### `.premium-stat-card` — dark glass stat tile
`background: rgba(26,39,68,0.85); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1)`;
hover `rgba(26,39,68,0.95)` + `0 24px 60px rgba(0,0,0,0.3)`. White text.

### `.process-step-card` — the WIN · CONSOLIDATE · DISCIPLE · SEND cards
Rendered by `ProcessSteps` (`components/landing/MissionSection.tsx`), reused on About (`VisionMission`).
- White, `border-radius: 20px`, `padding: 40px 24px 32px` (24/16/36px ≤ 768px), `border: 1px solid rgba(0,0,0,0.12)`,
  layered shadow with a faint gold layer, `transition: all 0.5s cubic-bezier(0.4,0,0.2,1)`, content top-aligned
  (`flex-direction: column`) so icons line up across cards.
- `.step-number`: 36px gold-gradient circle (`#d4a84b → #d97706`) pinned at `top: -16px`, centered.
- `.step-icon`: 64px rounded square (`16px`), gold 10% tint, gold icon. On card hover it **morphs to a circle**
  with the gold gradient, white icon, `scale(1.1)`, gold shadow — the "living icon".
- `.step-title`: 20px / 800 / 0.5px uppercase (16px ≤ 768px).
- Card hover: `translateY(-8px)` + deeper layered shadow with a gold glow.
- `.step-connector` arrows between cards; hidden ≤ 1024px.
The philosophy behind these: frosted/white material, UPPERCASE 800 titles, tactile lift + warm gold glow,
icons that react, generous padding, top alignment.

### Other cards
| Class | Shape | Hover |
|---|---|---|
| `.sermon-card` | white, 20px radius, `0 2px 12px rgba(0,0,0,0.10)`, 1px border | `translateY(-8px)` + `0 16px 40px …0.08, 0 0 0 1px rgba(212,168,75,0.2)` |
| `.ministry-card` | 12px radius, `aspect-ratio: 4/3`, layered shadow with gold, image card | `translateY(-8px) scale(1.01)`; 4px gold bottom bar |
| `.event-card` | **horizontal row**: flex, gap 20px, `padding: 18px 22px`, 10px radius, `1px solid var(--border-color)` | gold border + `translateX(4px)` |
| `.event-grid-card` | grid card for the events page; title 20px / 600 | — |
| `.bento-item` | gallery tile, 8px radius (4px mobile), `0 4px 24px rgba(0,0,0,0.06)` | premium transition |
| `.service-info-card` | white, `2px solid var(--color-navy)`, 12px radius, `28px 24px` | inverts to navy, `translateY(-4px)` |
| `.service-detail-item` | glass row on dark: `rgba(255,255,255,0.05)`, `1px solid rgba(255,255,255,0.15)`, 8px | gold border, `translateY(-2px)` |
| `.vm-card` | Vision/Mission cards (About), 14px radius, staggered entrance (`--vm-index`) | icon tilts and rounds |

React card components (`src/components/cards`): `CardDiv` (`padding: none|small|medium|large`, shadow/border/hover
flags, keyboard-accessible `onClick`), `CardDivTitle`, `MemberCard` / `MemberListItem`, `ScriptureCard`,
`StatsWidget` / `StatsGrid` (Tailwind classes, `trend: up|down|neutral`).

## Buttons

### Landing pills (`landing.css`) — public CTAs
Base `.landing-btn`: inline-flex, gap 10px, `padding: 14px 32px`, `2px solid transparent`, `border-radius: 50px`,
14px / 600 / 0.8px uppercase, `transition: all 0.25s ease`.

| Modifier | Rest | Hover |
|---|---|---|
| `.landing-btn-primary` | gold gradient `#d4a84b → #c9973f`, **white text** (drift, see DESIGN.md), gold shadow | reversed gradient, stronger glow |
| `.landing-btn-outline` | transparent, gold text + border | solid gold |
| `.landing-btn-border` | transparent, navy text + 2px navy border, `12px 28px`, 700 | solid navy, white text |
| `.landing-btn-solid-dark` | navy fill, white text | transparent, navy text |
| `.landing-btn-light` | white fill, gold text (on dark bands) | white glow |
| `.landing-btn-light-outline` | white 8% glass, white text + 40% border | solid white |
| `.btn-arrow-gold` | gold gradient arrow button | stronger glow; `.arrow-icon` slides |

Primary CTA → `.landing-btn-primary` (gold); secondary → `.landing-btn-border` / `.landing-btn-solid-dark` (navy).

### Utility buttons (`globals.css`, Tailwind `@apply`) — admin/general
`.btn-primary` (`bg-primary text-white`, drift on contrast), `.btn-secondary` (purple), `.btn-outline`, `.btn-ghost`,
`.link`; high-contrast `.btn-contrast` (black → inverts), `.btn-contrast-outline`, `.btn-contrast-light`,
`.btn-gold-border` (gold outline). All `rounded-lg px-4 py-2.5` or `px-6 py-3` uppercase bold for contrast ones.

### Surface buttons
`.sermon-btn` + `--gold` / `--outline` / `--ghost` / `--block` (reader, see `surfaces.md`), `.vip-submit-button`
(slate), `.signin-submit`.

### React `Button` (`src/components/ui/Button.tsx`)
PrimeReact wrapper: `variant: primary | secondary | success | danger | warning | info | help | text | link |
outlined`, `size: small | normal | large`, `loading`, `disabled`, `raised`, `rounded`, `text`, `outlined`,
`fullWidth`, `icon`, `iconPos`, `badge`, `tooltip`; plus `IconButton`. Style PrimeReact buttons per `DESIGN.md`
"PrimeReact buttons".

## Header, navigation, footer (`landing.css`)
- `.landing-header`: fixed, `rgba(255,255,255,0.97)`, `blur(12px)` (8px mobile), `0 2px 8px rgba(0,0,0,0.12)`,
  `z-index: 1000`.
- `.nav-links li a`: 16px / 700, `--text-primary`; `::after` 2px gold underline grows `0 → 100%` on hover and
  `.active` (hidden ≤ 767px); hover/active text turns gold. Nav order: Home · About · Ministries · Events ·
  Connect · Give (`LandingHeader.tsx`).
- `.nav-dropdown-menu`: white, 12px radius, `0 10px 40px rgba(0,0,0,0.08)`, `min-width: 180px`, fades and slides
  from `translateY(-10px)`, `z-index: 1001`.
- `.landing-footer`: `linear-gradient(180deg, var(--color-navy) 0%, #151e32 100%)`, white, `padding: 60px 0 0`;
  `::before` faint gold radial at top. `.footer-links a` 13px `rgba(255,255,255,0.55)` → gold;
  `.footer-social a` 36px, 8px radius, white 8% → gold fill + 2px lift; `.footer-bottom` `20px 0`, centered.

## Heroes
- **Home carousel** `.hero-carousel-section`: `min-height: 75vh`; ≤ 768px fixed `height: 650px` with
  `contain: strict; overflow: clip` (prevents iOS address-bar reflow). Slides: `.hero-slide-bg` + `.hero-slide-overlay`
  (soft gold/white radial accents) + `.hero-slide-content` (H1 56px / 800 / -1.8px uppercase, text-shadow).
  Sermon slides without their own background use `.hero-slide-bg--sermon` — the same photographic blurred-artwork
  + scrim treatment as the sermon reader hero (`--hero-scrim`). Controls: `.hero-indicator` (12px dot → 32px gold
  pill when `.active`), `.hero-nav-btn` (50px glass circle; 40px at the bottom on mobile). Badges: `.hero-badge`
  (gold 80%, 12px / 900 uppercase), `.hero-badge-campaign` (purple), `.hero-badge-sermon` (cyan text).
- **`.hero-section`** (internal heroes): background image, `padding: 116px 0 70px`, `min-height: 75vh`, centered;
  `::before` navy-blue gradient overlay `rgba(30,58,95,0.4 → 0.65)`, `::after` gold + cyan radial accents.
  ≤ 767px: fixed 500px band, `contain: strict`.
- **`PageHero`** (`components/landing/PageHero.tsx`) = `.hero-section.page-hero` (`min-height: 64vh`) with corner
  brackets (`.page-hero-frame`, `.page-hero-corner--tl/tr/…`). Props: `badge`, `title`, `titleAccent`, `subtitle`,
  `tagline`, `backgroundImage`, `serviceInfo`, `displayBadge`, `displayDivider`. Don't re-declare its overlay.
- **`PosterHero`** (`components/landing/PosterHero.tsx` + `styles/poster-hero.css`): for event posters — the art
  spans the full width at its own aspect ratio, never cropped or letterboxed. Optional phone-only taller band via
  `--poster-hero-mobile-band-ratio`. Needs a wide crop (e.g. 8:3).

## Forms

### Base field styling
- `globals.css`: `.p-inputtext` = `w-full rounded-lg border border-gray-300 px-4 py-3`; focus `border-primary`
  + `ring-2 ring-primary/20`; disabled `bg-gray-100`. Same for `.p-calendar .p-inputtext`; `.p-dropdown`
  `rounded-lg border-gray-300`, hover `border-primary`, panel `rounded-lg shadow-lg`.
- `form-input.css` (every `Form*` component): labels `--form-text-color` (#000) / 700; inputs black text,
  placeholder gray; inside `.input-container`: compact padding `0.5rem 0.75rem` (`0.65rem` ≤ 640px), darker
  resting border `--form-border-color` (#6b7280), gold focus, velvet invalid. `.form-required` red `*`
  (`margin-left: 4px`). `.disable` = 60% opacity, no pointer events.
- Invalid: `.p-invalid` → `1px solid var(--velvet)` (`#DA4453`); error text `small.p-error` from `FormError`.
- Mobile/touch: every text control is forced to `font-size: 16px !important` (prevents iOS focus zoom; see DESIGN.md).

### Form layouts (`vip-form.css`, shared by VIP, SOD, Lifeclass, event registration, giving confirmation)
`.vip-form-container` (white panel), `.form-section` + `.section-title` (with `.section-number` gold chip),
`.form-row` (grid, gap 20px), `.form-error-alert` (`#fff1f2` / `#e11d48`), radio `.sod-radio-input` (gold when
`.p-highlight`), upload `.sod-upload-*` (dashed gold dropzone), submit `.vip-submit-button`. Details in
`surfaces.md`.

## PrimeReact overrides (`globals.css`, theme `lara-light-blue`)
| Component | Override |
|---|---|
| `.p-button` | `rounded-lg font-medium`, focus `ring-2 ring-primary/20`; `-primary` gold, `-secondary` purple, `-success` green, `-danger` burgundy, `-outlined` transparent 2px |
| `.p-datatable` | thead `bg-surface font-semibold text-foreground`; rows `border-b border-border`, hover `bg-surface` |
| `.p-paginator` | transparent, top border |
| `.p-dialog` | `rounded-xl shadow-2xl`; header `border-b`, footer `border-t` (see DESIGN.md "Dialogs" for padding and colour) |
| `.p-card` / `.p-menu` / `.p-panelmenu` | `rounded-xl` / `rounded-lg`, `border-border`, shadows |
| `.p-steps` active number | `bg-primary text-white` |
| `.p-breadcrumb` | transparent, no border |
| `.p-inputswitch` | knob fix `::before { margin-top: -0.625rem }` |
| `.p-toast` | solid semantic surfaces (below) |

### Toasts (global)
`.p-toast .p-toast-message`: no border, 12px radius, `0 12px 30px rgba(16,24,40,0.22)`; content `1rem 1.1rem`;
summary 700 / 0.95rem; detail 0.85rem. Text and icons white (`color` + SVG `fill`), close hover white 18%.
- success `#15803d` · error `var(--color-error)` · info `var(--color-secondary)` — all with a 5px white-40% left bar
- warn `var(--color-primary)` with **navy** text and icons and a navy-35% left bar

Call `showSuccess` / `showError` / `showWarning` / `showInfo` from `components/ui/Toast.tsx`; `ToastProvider`
must be mounted on the page.

## Scrollbar (global)
Auto-hide overlay style: the thumb is transparent at rest and shows as a thin gray pill
(`rgba(100,100,100,0.6)`) only while `html.is-scrolling` is set by `ScrollbarAutoHide`
(`components/providers/ScrollbarAutoHide.tsx`, mounted in `app/layout.tsx`); Firefox uses `scrollbar-color`.
Don't add an always-visible scrollbar. Horizontal carousels may hide theirs on purpose.

## Other UI primitives (`src/components/ui`)
`Spinner`, `PageSpinner` (admin overlay via `useLoadingStore`), `InlineSpinner`, `ButtonSpinner`,
`DownloadQRButton`, `Toast` / `ToastProvider`. Icons are PrimeIcons (`pi pi-*`; constants in
`ICON_CONSTANTS`, `src/core/constants.ts`).
