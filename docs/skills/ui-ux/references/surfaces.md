# Page surfaces (checked against the CSS 2026-11-21)

Each surface has its own stylesheet and class prefix. Stay inside the prefix when you change one.

## Stylesheet → surface map

| Stylesheet | Imported by | Surface |
|---|---|---|
| `src/app/globals.css` | `app/layout.tsx` (after the PrimeReact theme, `primereact.min.css`, `primeicons.css`) | everything: tokens, Tailwind, PrimeReact overrides, toasts, scrollbar, iOS zoom fix |
| `src/styles/landing.css` (~20k lines) | `(public)/layout.tsx`, `app/page.tsx`, sign-in and form clients | all public pages |
| `src/styles/sermon-detail.css` | `(public)/layout.tsx` | `/sermon-notes/[slug]` reader + video lightbox |
| `src/styles/vip-form.css` | `VipFormClient`, `SodEnrollmentClient`, `LifeclassEnrollmentClient`, `EventRegistrationSection`, `GivingConfirmationSection` | public forms |
| `src/styles/signin.css` | `app/(auth)/signin/page.tsx` | sign-in |
| `src/styles/admin-layout.css` | `components/layout/AdminLayout.tsx` | admin tokens, scaffold, breadcrumbs, footer |
| `src/styles/admin.css` | `components/layout/Header.tsx` | admin header + user menu |
| `src/styles/admin-sidebar.css` | `components/layout/Sidebar.tsx` | admin sidebar + mobile drawer |
| `src/styles/admin-dashboard.css` | `church-campus-admin/page.tsx`, `components/admin/*` | admin page content |
| `src/components/forms/styles/form-input.css` | every `Form*` component | form fields |
| `src/components/landing/styles/poster-hero.css` | `PosterHero.tsx` | poster hero |
| `quill/dist/quill.snow.css` | `LyricFormatterClient.tsx` | lyric editor |

`landing.css` and `sermon-detail.css` load together in `(public)/layout.tsx`; a class defined in both can flip
between SSR and client navigation. Use unique prefixes (`.sermon-reader-grid`, not `.sermon-grid`).

## Sermon reader (`sermon-detail.css`, prefix `sermon-` / reader classes)

- **Reading progress:** `.reading-progress` (fixed, 3px, navy 6%, `z-index: 1100`) + `.reading-progress__fill`
  (`width: var(--progress)`, gold gradient, gold glow).
- **Hero — photographic, not brand-coloured.** `.sermon-hero`: `background: rgb(var(--hero-scrim))`
  (`14, 12, 16`), `padding: calc(70px + 48px) 0 72px` (`+32px … 48px` ≤ 768px), white text. The sermon's own
  artwork is the backdrop: `.sermon-hero__backdrop` (`inset: -60px`) + `.sermon-hero__backdrop-img`
  (`blur(34px) saturate(1.25)`, `scale(1.06)`, `aria-hidden`, `alt=""`, low quality). `::before` stacks a
  horizontal scrim `0.90 → 0.84 → 0.55`, a vertical vignette (`0.30` top / `0.35` bottom) and a faint gold pool at
  84%/24%. **Never lighten the scrim under the type column** (left ~45% stays ≥ 0.80) — measured on white artwork
  it gives white text 11.3:1 and gold 5.1:1.
- Hero parts: `.sermon-hero__layout` (grid `1fr 320px`, gap 48px; one column ≤ 1023px), `.sermon-hero__eyebrow`
  (glass gold pill, 11px / 800 / 2.2px, `--color-primary-light`), `.sermon-hero__title` (`clamp(40px, 5vw, 64px)`,
  800, -2px, uppercase, `text-wrap: balance`), `.sermon-hero__title em` (Fraunces italic 500, sentence case,
  `--color-primary-light`), `.sermon-hero__artwork` (16:10, 18px radius, deep shadow + gold ring). With a
  `videoUrl` the artwork shows a corner "▶ Watch" pill and opens `.video-lightbox` (16:9, or 9:16
  `--vertical` for Shorts). Keep the pill in the corner; don't cover the title on the art.
- **Body:** `.sermon-body` (white, `56px 0 80px`), `.sermon-reader-grid` (`minmax(0,1fr) 340px`, gap 56px; one
  column ≤ 1023px), `.sermon-reader-grid__aside` (sticky `top: 90px`; static ≤ 1023px).
- **Tabs:** `.sermon-tab` (14px / 700, `--color-muted`), `[aria-selected='true']` gold-dark text + 3px gold
  underline; panels fade in with `sermonFadeUp`.
- **Prose:** `.prose` 18px / 500 / lh 1.75, `--text-primary`; `.prose .callout` = Fraunces italic pull quote,
  purple 4px left border, purple→burgundy 6% tint, `0 12px 12px 0` radius.
- **Section heads:** `.section-head__num` (26px gold-dark numeral over a 2px gold rule), `.section-head__kicker`
  (11px / 800 / 2.5px uppercase), `.section-head__title` (26px / 800 / -0.8px; 22px ≤ 768px);
  `.section-head--unnumbered` drops the numeral; `.section-subitems` repeat it smaller.
- **Blessings:** `.blessings` 2-col grid (1 col ≤ 768px), `.blessing` (white, `--border-color-light`, 20px radius,
  lifts 4px with gold border), `.blessing__num` (48px Fraunces italic, gold 18%, top-right),
  `[data-span='full']` spans both columns.
- **Takeaways:** `.takeaways` (white, 20px radius, soft navy shadow, 4px gold top bar), numbered navy circles.
- **Scripture:** `.scripture-item` (grid `56px 1fr`, 4px gold left border, 8px radius), `.scripture-badge`
  (56px navy gradient, Fraunces italic book code), `.scripture-quote p` (serif, max 72ch), inline `.verse-ref`
  (purple chip, Fraunces italic, fills purple on hover).
- **Aside:** `.aside-card` (white, 20px radius, gold tick on `h4`), `.toc` (white 85% glass,
  `aria-current='location'` item tinted gold), `.speaker` (gold-tint card) + `.speaker__avatar` (48px gold
  gradient initials).
- **Buttons:** `.sermon-btn` (pill, 13px / 700 uppercase) + `--gold` (gradient, white text), `--outline`,
  `--ghost` (navy 4%), `--block`.
- Content switchers that mount later must reveal their cards on mount (`requestAnimationFrame`); the global
  `ScrollAnimationProvider` only observes once.

## Sign-in (`signin.css`, prefix `signin-`)
- `.signin-page`: grid, full height, cream → white → ivory gradient; two columns ≥ 992px
  (`minmax(0, 0.86fr) minmax(540px, 1.14fr)`).
- `.signin-branding` (desktop only): navy panel — gold wash over `#101827 → navy → --color-secondary-dark`, white
  text, `.signin-brand-lockup`, `.signin-eyebrow` (12px / 850 / 2.4px, `--color-primary-light`).
- `.signin-form-container` centers `.signin-form-wrapper`: max 528px, `48px 52px`, 8px radius, white 88% glass,
  sand border, `0 24px 72px rgba(26,39,68,0.12)`, enters with `signinFadeUp`.
- `.signin-access-pill` (gold-tint pill), `.signin-form-kicker` (gold 12px / 850 uppercase).
- Fields: `.signin-field .p-inputtext` / `.p-password input` — min-height 52px, `14px 16px`, 10px radius,
  `--border-color-light`; hover gold 58%; focus gold border + 4px `--gold-shadow-hover` ring.
- `.signin-submit`: full width, min-height 52px, 10px radius, 15px / 850.
- `.signin-error`: `#fef2f2` / `#b91c1c`, `#fecaca` border, 8px radius, `signinShake`.

## Public forms (`vip-form.css`)
- **VIP** (`/events/vip-form`): `.vip-layout-grid` (`350px 1fr`, gap 30px; one column ≤ 992px),
  `.vip-welcome-card` (sticky `top: 100px`, 600px tall, slate `#0f172a → #1e293b` — not the navy token — 30px
  radius, white), `.vip-form-container` (white, 30px radius, `padding: 50px` → `30px 20px` ≤ 640px, heavy shadow,
  12% border).
- Shared parts: `.step-label` (gold 12px / 700 / 2px uppercase), `.form-section`, `.section-title` +
  `.section-number` (30px gold-tint chip), `.form-row` (grid, gap 20px), `.form-error-alert` (`#fff1f2` /
  `#e11d48`, 12px radius), `.vip-submit-button` (slate `#0f172a`, white, 15px radius, lifts on hover),
  `.success-icon-wrapper` (100px gold circle) + `.pulse-ring`.
- SOD / Lifeclass / event registration / giving confirmation scope these under their own page roots
  (`.sod-enrollment-page`, `.event-register-section`, …). On a cream band (`.event-register-section`) the form
  card drops its border and floats on shadow.
- Radios: `.sod-radio-input` — checked (`.p-highlight`) = gold fill + gold border + white dot.
- Upload: `.sod-upload-dropzone` (dashed gold 60%, gold 5% fill, 14px radius, gold-dark text), preview with
  Change / Remove, errors `.sod-radio-error` with `role="alert"`.

## Admin (`admin-layout.css`, `admin.css`, `admin-sidebar.css`, `admin-dashboard.css`; prefix `admin-`)

Navy chrome + the **site's warm gold** (`#d4a84b`, same as the landing pages), light canvas, compact and direct (rules: `DESIGN.md` "Admin surface"; refreshed
in spec 003).

- **Tokens** (`admin-layout.css`, on `.admin-layout` and `.admin-user-menu`): sizes (`--admin-sidebar-width 288px`,
  `--admin-header-height 64px`), golds (`--admin-gold`, `-dark`, `-ink`, `-soft`, `-glow`, `-border`,
  `--admin-gold-fill` / `-fill-hover` = landing button gradient, `--admin-on-gold` white), chrome (`--admin-chrome` gradient, `--admin-chrome-edge`, `--admin-navy`), surfaces
  (`--admin-canvas`, `--admin-surface`, `--admin-border`, `--admin-border-mid`, `--admin-tile`), text
  (`--admin-text-heading/-body #000`, `-muted #4b5563`, `-faint #6b7280` icons only), shadows (`-rest`, `-lift`,
  `-gold`), radii (`--admin-radius-card 14px`, `--admin-radius-control 8px`), motion (`--admin-transition-*`).
- **Scaffold** `.admin-layout`: `.admin-layout-header` (fixed), `.admin-layout-sidebar` (pinned on desktop; on
  mobile `.is-mobile` drawer `min(86vw, 300px)` over a navy scrim `.admin-layout-overlay`; `inert` while closed,
  Escape closes), `.admin-layout-main` (`.is-sidebar-visible` adds the sidebar margin), `.admin-layout-page`
  (max 1240px, `28px 32px 40px`; `18px 16px 32px` ≤ 768px) with `.admin-layout-breadcrumbs` at its top.
- **Breadcrumbs** `.admin-breadcrumbs-*`: muted links that tint gold on hover, bold current crumb, hidden when
  the trail is one crumb.
- **Header** `.admin-header` (`--admin-chrome`, gold hairline bottom border): `.admin-header-menu-toggle`
  (44px hamburger → X), `.admin-header-brand` = `.admin-header-logo` (glass tile, gold border) +
  `.admin-header-wordmark` ("Gateway Church" / gold "CAMPUS ADMIN"), `.admin-header-user` pill (white-on-gold-fill
  `.admin-header-avatar`, name, formatted role; info hidden ≤ 640px).
- **User menu** `.admin-user-menu.p-menu`: `.admin-user-menu-header` (name + role · campus), separator,
  "Sign out" with the danger accent (`#b91c1c` on `#fee2e2`).
- **Sidebar** `.admin-sidebar`: `.admin-sidebar-drawer-bar` (mobile only: chrome bar, "Campus Admin / Menu",
  `.admin-sidebar-close`), `.admin-sidebar-campus` card (navy tile + gold glyph, campus name, church · role),
  `.admin-sidebar-section-label` (11.5px, black), `.admin-sidebar-item` (15px, black — "Soon" items stay dark, the pill carries the state) (link / group `<button aria-expanded>` / `.is-soon` span),
  `.is-active` (gold-soft fill, 3px gold bar, `--admin-gold-fill` icon tile with a white glyph), `.is-active-group`,
  `.admin-sidebar-sublist-wrap` (grid-rows collapse, `inert` when closed) with `.admin-sidebar-subitem`
  (14.5px, dot + label; active = gold-ink), `.admin-sidebar-soon` pill, `.admin-sidebar-footer-link` ("View website").
  Data: `src/components/layout/admin-navigation.ts` (`ADMIN_NAV_SECTIONS`, `available`, `roles`); the group
  holding the current page opens itself (`expandItem` in `useSidebarStore`).
- **Page parts** (`src/components/admin`): `AdminPageHeader` → `.admin-dash-page-header` (`.admin-dash-eyebrow`
  gold-ink, `.admin-dash-title` 28px/800, `.admin-dash-subtitle`, `.admin-dash-header-actions`);
  `AdminComingSoon` → `.admin-dash-panel.admin-dash-coming-soon` ("In development" pill, copy, "Back to
  dashboard"). Pages wrap content in `.admin-dashboard`.
- **Dashboard** (`church-campus-admin/page.tsx`): `.admin-dash-hero` (navy chrome banner with gold + purple
  glows, gold kicker = campus, 30px white greeting, date, primary button), `.admin-dash-stats-grid` of
  `.admin-dash-stat-card` (read-only, 3px tone strip, tones `is-gold|is-navy|is-purple|is-burgundy`, "—" +
  "Not connected yet"), `.admin-dash-grid` (main 1.7fr + side 1fr; one column ≤ 1100px) with
  `.admin-dash-panel` / `.admin-dash-panel-header`: quick actions `.admin-dash-action-list` rows
  (`a.admin-dash-action` with icon that fills gold on hover + arrow, or `.is-soon` + `.admin-dash-soon-pill`),
  "Your account" (`.admin-dash-account`, `.admin-dash-details` dl), activity `.admin-dash-empty-state`.
- **Buttons:** `.admin-dash-btn-primary` (`--admin-gold-fill`, white `--admin-on-gold` text, 700) and
  `.admin-dash-btn-secondary` (white, border, gold-ink on hover).
- **Footer** `.admin-footer`: one line — "© year Gateway Church · Campus Admin" and the version.
- Legacy `.sidebar` / `.main-content` / `.header` utilities in `globals.css` (collapse to `margin-left: 0`
  ≤ 1024px) and `.sidebar-container .section-label { color: #000 !important }` belong to the older sidebar and are
  unused by the admin shell.
