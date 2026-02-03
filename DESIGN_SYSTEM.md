# Gateway Church Design System

A comprehensive design system for the Gateway Church Next.js project, inspired by a premium, modern "Transformation Church" aesthetic with sanctuary-inspired color palette.

---

## 1. Design Philosophy

### The "Premium Modern" Vibe
Our design language is built on three core pillars:
1.  **Glassmorphism**: We use frosted glass (`backdrop-filter: blur(12px)`) to create depth and lightness. Content feels suspended.
2.  **Bold Typography**: Headlines are **UPPERCASE** and **Extra-Bold (800+)** to command attention.
3.  **Dynamic Motion**: Every interaction has a tactile "lift" and "glow" to make the site feel alive.

### Sanctuary-Inspired Aesthetic
Colors are drawn from worship sanctuary ambiance:
- Warm gold lighting (primary accent)
- Deep navy for depth and reverence
- Royal purple for accent lighting
- Soft cream for welcoming warmth

---

## 2. Color Palette

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

### Background Colors
| Name | Variable | Hex | Usage |
|------|----------|-----|-------|
| **Deep Navy** | `--color-navy` | `#1a2744` | Dark backgrounds, footer |
| **Darker Navy** | `--color-navy-dark` | `#151e32` | Footer gradient end |
| **Soft Cream** | `--color-cream` | `#f5f0e6` | Main background |
| **Ivory** | `--color-ivory` | `#faf8f3` | Light accent areas |
| Surface | `--color-surface` | `#ffffff` | Card bases |

### Semantic Colors
| Name | Variable | Hex | Usage |
|------|----------|-----|-------|
| **Success** | `--color-success` | `#22C55E` | Positive states |
| Success Light | `--color-success-light` | `#4ADE80` | Success backgrounds |
| Success Dark | `--color-success-dark` | `#16A34A` | Success emphasis |
| **Warning** | `--color-warning` | `#d4a84b` | Warning states (uses gold) |
| **Error** | `--color-error` | `#6b2c3a` | Error states (uses burgundy) |
| **Info** | `--color-info` | `#4a3c6e` | Info states (uses purple) |

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
| Soft Shadow | `--shadow-color-soft` | `rgba(26, 39, 68, 0.06)` | Resting state shadows |
| Medium Shadow | `--shadow-color-medium` | `rgba(26, 39, 68, 0.1)` | Elevated shadows |
| Gold Glow | `--gold-shadow-hover` | `rgba(212, 168, 75, 0.25)` | Hover accent glow |

### Dark Mode Colors
Applied automatically via `@media (prefers-color-scheme: dark)`:
| Name | Light | Dark |
|------|-------|------|
| Background | `#f5f0e6` | `#1A1A2E` |
| Foreground | `#0d1424` | `#F5F5F5` |
| Muted | `#374151` | `#9CA3AF` |
| Border | `#e8e3d9` | `#374151` |
| Surface | `#ffffff` | `#1F2937` |

---

## 3. Typography

### Font Family
- **Primary**: `'Inter', sans-serif` (variable weights 100-900)
- **Display**: Same as primary for consistency
- **Fallback**: `system-ui, -apple-system, sans-serif`

### Hierarchy
| Element | Size | Weight | Letter-Spacing | Style | Usage |
|---------|------|--------|----------------|-------|-------|
| **Hero Title** | `56px` | **800** | **-1.8px** | **UPPERCASE** | Main landing page impact |
| **Campaign Title** | `52px` | **800** | **-1.8px** | **UPPERCASE** | Arise & Build sections |
| **Section Title** | `32-36px` | **800** | **-1.5px** | **UPPERCASE** | Major section headers |
| **Card Title** | `24px` | **800** | **-0.5px** | **UPPERCASE** | Card Headers |
| **Step Title** | `20px` | **700** | **-0.5px** | **UPPERCASE** | Process steps |
| Body Copy | `15px` | 500 | Normal | Regular | High readability text |
| **Section Label** | `11-12px` | **900** | **2.5px** | **UPPERCASE** | Category labels |
| Meta Text | `12-13px` | 500 | Normal | Regular | Secondary info |

### Letter-Spacing Variables
```css
--letter-spacing-tight: -1.5px;   /* Section headers */
--letter-spacing-tighter: -1.8px; /* Hero titles */
--letter-spacing-normal: -0.5px;  /* Card titles */
```

### Line Heights
| Context | Line Height | Usage |
|---------|-------------|-------|
| Hero Headings | `1.05` | Large display text |
| Subheadings | `1.1 - 1.2` | Section titles |
| Body Text | `1.6 - 1.7` | Readable paragraphs |
| Tight Text | `1.5` | Compact layouts |

---

## 4. Components

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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
.step-connector {
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

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

### Pill Buttons
Buttons are fully rounded for a modern, friendly feel.
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

.landing-btn:hover {
  transform: translateY(-2px);
}
```

### Button Variants

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

**Outline Variants:**
```css
.landing-btn-outline {
  background-color: transparent;
  color: #d4a84b;
  border: 2px solid #d4a84b;
}

.landing-btn-outline:hover {
  background-color: #d4a84b;
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(212, 168, 75, 0.25);
}
```

**Border Buttons (High-Contrast Style):**
```css
.landing-btn-border {
  background-color: transparent;
  color: var(--color-navy);
  border: 2px solid var(--color-navy);
  padding: 12px 28px;
  font-weight: 700;
}

.landing-btn-border:hover {
  background-color: var(--color-navy);
  color: #ffffff;
}
```

**Light Buttons (for dark backgrounds):**
```css
.landing-btn-light {
  background-color: #ffffff;
  color: var(--color-primary);
  border: 2px solid #ffffff;
}

.landing-btn-light:hover {
  background-color: transparent;
  color: #ffffff;
}

.landing-btn-light-outline {
  background-color: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  border: 2px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(4px);
}

.landing-btn-light-outline:hover {
  background-color: #ffffff;
  color: var(--color-navy);
  border-color: #ffffff;
}
```

**Arrow Buttons:**
```css
.btn-arrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  font-weight: 600;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.btn-arrow:hover {
  transform: translateY(-2px);
}

.btn-arrow .arrow-icon {
  transition: transform 0.3s ease;
}

.btn-arrow:hover .arrow-icon {
  transform: translateX(4px);
}

.btn-arrow-gold {
  background: linear-gradient(135deg, #d4a84b, #f0b429);
  color: #ffffff;
}

.btn-arrow-white {
  background: #ffffff;
  color: var(--color-navy);
}
```

**Contrast Buttons:**
```css
.btn-contrast {
  background-color: #000000;
  color: #ffffff;
  border: 2px solid #000000;
  padding: 12px 24px;
  font-weight: 700;
  text-transform: uppercase;
}

.btn-contrast:hover {
  background-color: #ffffff;
  color: #000000;
  transform: translateY(-2px);
}

.btn-contrast-outline {
  background-color: transparent;
  color: #000000;
  border: 2px solid #000000;
}

.btn-contrast-outline:hover {
  background-color: #000000;
  color: #ffffff;
}

.btn-contrast-light {
  background-color: #ffffff;
  color: #000000;
  border: 2px solid #ffffff;
}

.btn-contrast-light:hover {
  background-color: transparent;
  color: #ffffff;
}
```

**Button Variant Summary:**
| Class | Default | Hover |
|-------|---------|-------|
| `.landing-btn-primary` | Gold gradient | Reversed gradient + glow |
| `.landing-btn-outline` | Gold outline | Solid gold |
| `.landing-btn-border` | Navy outline | Solid navy |
| `.landing-btn-border-light` | White outline | Solid white |
| `.landing-btn-border-gold` | Gold outline | Solid gold |
| `.landing-btn-light` | Solid white | White outline |
| `.landing-btn-light-outline` | Glass white border | Solid white |
| `.landing-btn-solid-dark` | Solid navy | Navy outline |
| `.landing-btn-solid-gold` | Solid gold | Gold outline |
| `.btn-arrow-gold` | Gold gradient | Lift + arrow slide |
| `.btn-arrow-white` | Solid white | Lift + arrow slide |
| `.btn-contrast` | Solid black | Inverted |
| `.btn-contrast-outline` | Black outline | Solid black |
| `.btn-contrast-light` | Solid white | Inverted |

### Dynamic Icons
Icons live in a container that morphs shape on interaction.
- **Rest**: Rounded Square (`border-radius: 20px`)
- **Hover**: Circle (`border-radius: 50%`)
- **Motion**: `transform: rotate(-10deg) scale(1.1)`

---

## 5. Shadows & Effects

### Box Shadows
| Name | Value | Usage |
|------|-------|-------|
| **Minimal** | `0 1px 0 rgba(0, 0, 0, 0.05)` | Subtle elements |
| **Soft** | `0 4px 24px rgba(0, 0, 0, 0.06)` | Resting state for cards |
| **Medium** | `0 10px 20px rgba(0, 0, 0, 0.06)` | Elevated elements |
| **Heavy** | `0 20px 40px rgba(0, 0, 0, 0.06)` | Hover states |
| **Gold Glow** | `0 24px 60px rgba(212, 168, 75, 0.15)` | Hover state accent |
| **Dropdown** | `0 10px 40px rgba(0, 0, 0, 0.08)` | Floating panels |
| **Image Hover** | `0 20px 50px rgba(0, 0, 0, 0.12)` | Gallery images |

### Progress Bar (Bottom Accent)
```css
.card::after {
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

.card:hover::after {
  transform: scaleX(1);
}
```

### Glassmorphism Effects
| Intensity | Backdrop Filter | Background | Usage |
|-----------|-----------------|------------|-------|
| **Heavy** | `blur(12px)` | `rgba(255, 255, 255, 0.85)` | Main glass cards |
| **Medium** | `blur(10px)` | `rgba(255, 255, 255, 0.5)` | Navigation panels |
| **Light** | `blur(8px)` | `rgba(255, 255, 255, 0.3)` | Overlay elements |
| **Minimal** | `blur(4px)` | `rgba(255, 255, 255, 0.08)` | Subtle glass buttons |

---

## 6. Layout Principles

### Core Rules
1. **Top Alignment**: In grids, always use `justify-content: flex-start` to keep icons/titles aligned across cards of varying height.
2. **Generous Spacing**: Use `40px` padding inside cards to avoid cramping.
3. **Consistent Gap**: Use `24px` gap throughout flex/grid systems for modular spacing.
4. **Responsive**: Cards stack to 1 column on mobile, maintaining their internal padding and hierarchy.

### Layout Variables
```css
--sidebar-width: 280px;
--sidebar-collapsed-width: 80px;
--header-height: 64px;
```

### Container Widths
| Container | Max Width | Padding | Usage |
|-----------|-----------|---------|-------|
| Landing | `1100px` | `24px` | Public pages |
| Admin | `7xl` (80rem) | `16-32px` responsive | Dashboard |
| Content Modal | `700px` | `40px` | Forms, dialogs |

### Section Padding
| Section Type | Desktop | Tablet | Mobile |
|--------------|---------|--------|--------|
| Hero | `120px 0` | `100px 0` | `80px 0` |
| Standard | `70px 0` | `60px 0` | `50px 0` |
| Compact | `50px 0` | `40px 0` | `32px 0` |

---

## 7. High-Contrast Sections

### Dark Section Backgrounds
```css
.section-dark {
  background-color: var(--color-navy);
  color: #ffffff;
}

.section-black {
  background-color: #000000;
  color: #ffffff;
}
```

### Service Info Cards
Cards with border-heavy styling and hover inversions for displaying service times/venues.
```css
.service-info-card {
  background: #ffffff;
  border: 2px solid var(--color-navy);
  border-radius: 12px;
  padding: 28px 24px;
  text-align: center;
}

.service-info-card:hover {
  background: var(--color-navy);
  color: #ffffff;
}
```

### Service Detail Items
For inline service information within dark sections.
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

## 8. Hero & Carousel Sections

### Hero Container
```css
.hero-carousel-section {
  min-height: 75vh;
  position: relative;
  overflow: hidden;
}

/* Mobile: Fixed height to prevent iOS address bar issues */
@media (max-width: 768px) {
  .hero-carousel-section {
    min-height: auto;
    height: 650px;
    contain: strict;
    overflow: clip;
  }
}
```

### Hero Overlay (Multi-layered)
```css
.hero-slide-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg,
    rgba(30, 58, 95, 0.4) 0%,
    rgba(30, 58, 95, 0.55) 50%,
    rgba(30, 58, 95, 0.65) 100%);
}

/* Radial accent overlays */
.hero-slide-bg::before {
  background: radial-gradient(
    ellipse at 20% 30%,
    rgba(240, 180, 41, 0.06) 0%,
    transparent 50%
  ),
  radial-gradient(
    ellipse at 80% 70%,
    rgba(255, 255, 255, 0.03) 0%,
    transparent 40%
  );
}
```

### Hero Badges
```css
.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 16px;
  background: rgba(240, 180, 41, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  font-size: 12px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  border: 1px solid rgba(240, 180, 41, 0.35);
}

/* Campaign variant (purple) */
.hero-badge-campaign {
  background: rgba(124, 58, 237, 0.8);
  border-color: rgba(124, 58, 237, 0.4);
}

/* Sermon variant (cyan) */
.hero-badge-sermon {
  background: rgba(8, 145, 178, 0.25);
  border-color: rgba(8, 145, 178, 0.4);
  color: #67e8f9;
}
```

### Carousel Indicators
```css
.hero-indicators {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  padding: 12px 24px;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(10px);
  border-radius: 30px;
}

.hero-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hero-indicator:hover {
  background: rgba(255, 255, 255, 0.7);
}

.hero-indicator.active {
  width: 32px;
  border-radius: 6px;
  background: var(--color-primary);
}
```

### Hero Navigation Buttons
```css
.hero-nav-btn {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-nav-btn:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  transform: scale(1.08);
}

.hero-nav-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(240, 180, 41, 0.4);
}
```

---

## 9. Navigation & Header

### Landing Header
```css
.landing-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 1000;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
```

### Navigation Link Hover Animation
```css
.nav-links li a {
  position: relative;
  padding: 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-navy);
  transition: color 0.25s ease;
}

.nav-links li a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-primary);
  transition: width 0.25s ease;
}

.nav-links li a:hover::after,
.nav-links li a.active::after {
  width: 100%;
}

.nav-links li a:hover,
.nav-links li a.active {
  color: var(--color-primary);
}
```

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
  backdrop-filter: blur(10px);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  padding: 8px;
}

/* Triangle arrow */
.nav-dropdown-menu::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 50%;
  width: 12px;
  height: 12px;
  background: #ffffff;
  border-left: 1px solid rgba(0, 0, 0, 0.06);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  transform: translateX(-50%) rotate(45deg);
}

.nav-dropdown.dropdown-open .nav-dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

/* Menu items */
.nav-dropdown-menu li a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  color: var(--color-muted);
  font-size: 15px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.25s ease;
}

.nav-dropdown-menu li a:hover {
  background: rgba(212, 168, 75, 0.08);
  color: var(--color-primary);
}

.nav-dropdown-menu li a i {
  font-size: 16px;
  color: var(--color-primary);
  opacity: 0.7;
}

.nav-dropdown-menu li a:hover i {
  opacity: 1;
}
```

---

## 10. Footer

### Landing Footer
```css
.landing-footer {
  background: linear-gradient(180deg,
    var(--color-navy) 0%,
    #151e32 100%);
  color: #ffffff;
  padding: 60px 0 0 0;
  position: relative;
}

/* Subtle gold radial accent */
.landing-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 200px;
  background: radial-gradient(
    ellipse at center top,
    rgba(212, 168, 75, 0.06) 0%,
    transparent 70%
  );
  pointer-events: none;
}

/* Link styling */
.footer-links a {
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  transition: color 0.25s ease;
}

.footer-links a:hover {
  color: var(--color-primary);
}

/* Social buttons */
.footer-social-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.25s ease;
}

.footer-social-btn:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #ffffff;
  transform: translateY(-2px);
}

/* Copyright section */
.footer-bottom {
  padding: 24px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 13px;
}
```

---

## 11. Form Styling

### Base Input
```css
.input-base,
.p-inputtext {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  font-size: 15px;
  color: var(--color-foreground);
  background: #ffffff;
  transition: all 0.2s ease;
}

.input-base:focus,
.p-inputtext:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(212, 168, 75, 0.15);
}

.input-base:disabled,
.p-inputtext:disabled {
  background: #f3f4f6;
  opacity: 0.6;
  cursor: not-allowed;
}
```

### Invalid State
```css
.p-invalid,
.p-invalid.p-inputtext {
  border-color: var(--color-error);
}

.p-invalid:focus {
  box-shadow: 0 0 0 3px rgba(107, 44, 58, 0.15);
}
```

### Floating Label Inputs (Contact Form)
```css
.floating-input {
  position: relative;
  margin-bottom: 24px;
}

.floating-input input,
.floating-input textarea {
  width: 100%;
  padding: 16px 0 8px 0;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  color: #ffffff;
  font-size: 15px;
  transition: border-color 0.25s ease;
}

.floating-input input:focus,
.floating-input textarea:focus {
  outline: none;
  border-color: var(--color-navy);
}

.floating-input label {
  position: absolute;
  left: 0;
  top: 16px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 15px;
  transition: all 0.25s ease;
  pointer-events: none;
}

.floating-input input:focus + label,
.floating-input input:not(:placeholder-shown) + label,
.floating-input textarea:focus + label,
.floating-input textarea:not(:placeholder-shown) + label {
  top: 0;
  font-size: 11px;
  color: var(--color-primary);
}
```

### Required Indicator
```css
.form-required {
  color: var(--color-error);
  margin-left: 4px;
}
```

---

## 12. Card Variations

### Event Card
```css
.event-card {
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.4s ease;
}

.event-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.1);
}

/* Date badge */
.event-date-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: var(--color-navy);
  color: #ffffff;
  padding: 8px 12px;
  border-radius: 8px;
  text-align: center;
}

.event-date-badge .day {
  font-size: 20px;
  font-weight: 800;
  line-height: 1;
}

.event-date-badge .month {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
```

### Ministry Card
```css
.ministry-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 4/3;
  min-height: 280px;
  transition: all 0.4s ease;
}

.ministry-card:hover {
  transform: translateY(-8px) scale(1.01);
}

/* Image effect on hover */
.ministry-card:hover img {
  transform: scale(1.08);
  filter: brightness(1.1) saturate(1.2);
}

/* Gradient overlay */
.ministry-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg,
    rgba(26, 39, 68, 0.7) 0%,
    rgba(26, 39, 68, 0.3) 40%,
    transparent 100%);
  transition: all 0.4s ease;
}

.ministry-card:hover::after {
  background: linear-gradient(180deg,
    rgba(26, 39, 68, 0.8) 0%,
    rgba(26, 39, 68, 0.5) 50%,
    rgba(26, 39, 68, 0.2) 100%);
}

/* Content positioned at bottom */
.ministry-card-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 28px;
  background: linear-gradient(0deg,
    rgba(26, 39, 68, 0.8) 0%,
    transparent 100%);
  z-index: 2;
}
```

### Sermon Card
```css
.sermon-card {
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  transition: all 0.4s ease;
}

.sermon-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* Thumbnail overlay with play icon */
.sermon-card-thumbnail {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.sermon-card-thumbnail::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(26, 39, 68, 0.4);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sermon-card:hover .sermon-card-thumbnail::after {
  opacity: 1;
}

/* Duration badge */
.sermon-duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: #ffffff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}
```

### Stats Widget Card
```css
.stats-widget {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid var(--color-border);
}

.stats-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-foreground);
}

.stats-title {
  font-size: 14px;
  color: var(--color-muted);
  font-weight: 500;
  margin-bottom: 4px;
}

.stats-icon-container {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(212, 168, 75, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
}

/* Trend indicator */
.stats-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  margin-top: 8px;
  font-weight: 500;
}

.stats-trend.up { color: var(--color-success); }
.stats-trend.down { color: var(--color-error); }
.stats-trend.neutral { color: var(--color-muted); }
```

---

## 13. Animations & Transitions

### Keyframe Animations
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
```

### Animation Utility Classes
```css
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
.animate-fade-out { animation: fadeOut 0.3s ease-out; }
.animate-slide-up { animation: slideUp 0.3s ease-out; }
.animate-slide-down { animation: slideDown 0.3s ease-out; }
.animate-slide-in-left { animation: slideInLeft 0.3s ease-out; }
.animate-slide-in-right { animation: slideInRight 0.3s ease-out; }
.animate-spin { animation: spin 1s linear infinite; }
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
```

### Transition Standards
| Timing | Value | Usage |
|--------|-------|-------|
| **Fast** | `0.2s ease` | Micro-interactions (icons, underlines) |
| **Standard** | `0.25s ease` | Buttons, links, inputs |
| **Smooth** | `0.3s ease` | Dropdowns, menus, tooltips |
| **Elegant** | `0.4s ease` | Card transforms |
| **Premium** | `0.5s cubic-bezier(0.4, 0, 0.2, 1)` | Glass cards, major transitions |

### Scroll Animations
```css
.animate-on-scroll {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
  will-change: opacity, transform;
}

.animate-on-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Staggered delay for grid items */
.animate-on-scroll:nth-child(1) { transition-delay: 0.05s; }
.animate-on-scroll:nth-child(2) { transition-delay: 0.1s; }
.animate-on-scroll:nth-child(3) { transition-delay: 0.15s; }
.animate-on-scroll:nth-child(4) { transition-delay: 0.2s; }
```

---

## 14. Responsive Design

### Breakpoints
| Name | Width | Usage |
|------|-------|-------|
| **Mobile Small** | `480px` | Extra small devices |
| **Mobile** | `768px` | Tablets and below |
| **Tablet** | `1024px` | Larger tablets, small laptops |
| **Desktop** | `1024px+` | Laptops and desktops |

### Grid Adjustments
| Component | Desktop | Tablet | Mobile |
|-----------|---------|--------|--------|
| Hero | 75vh | 75vh | 650px fixed |
| Sermons | 3 columns | 2 columns | 1 column |
| Ministries | 2 columns | 2 columns | 1 column |
| Events | 3 columns | 2 columns | 1 column |
| Process Steps | 7 columns + connectors | 2 columns | 2 columns |
| Footer Links | 4 columns | 2 columns | 1 column |

### Typography Scaling
| Element | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Hero H1 | 56px | 42px | 32px |
| Campaign H2 | 52px | 42px | 36px |
| Section H2 | 36px | 32px | 28px |
| Card H3 | 24px | 22px | 20px |
| Body | 15px | 15px | 14px |

### Spacing Reductions
| Context | Desktop | Mobile |
|---------|---------|--------|
| Section padding | 70-80px | 40-50px |
| Card padding | 32-40px | 20-24px |
| Grid gap | 24px | 16px |

---

## 15. PrimeReact Component Overrides

### Calendar
```css
.p-calendar .p-inputtext {
  @apply w-full rounded-lg border border-gray-300 px-4 py-3;
}

.p-calendar .p-inputtext:focus {
  @apply border-primary ring-2 ring-primary/20;
}
```

### Dropdown
```css
.p-dropdown {
  @apply w-full rounded-lg border border-gray-300;
}

.p-dropdown:not(.p-disabled):hover {
  @apply border-primary;
}

.p-dropdown-panel {
  @apply rounded-lg shadow-lg;
}
```

### DataTable
```css
.p-datatable .p-datatable-thead > tr > th {
  @apply bg-surface font-semibold text-foreground;
}

.p-datatable .p-datatable-tbody > tr {
  @apply border-b border-border;
}

.p-datatable .p-datatable-tbody > tr:hover {
  @apply bg-surface;
}
```

### Dialog
```css
.p-dialog {
  @apply rounded-xl shadow-2xl;
}

.p-dialog .p-dialog-header {
  @apply border-b border-border;
}

.p-dialog .p-dialog-footer {
  @apply border-t border-border;
}
```

### Toast Notifications
```css
.p-toast-message-success {
  background-color: rgba(74, 222, 128, 0.1);
  border-left: 4px solid var(--color-success);
}

.p-toast-message-error {
  background-color: rgba(107, 44, 58, 0.1);
  border-left: 4px solid var(--color-error);
}

.p-toast-message-warn {
  background-color: rgba(212, 168, 75, 0.1);
  border-left: 4px solid var(--color-warning);
}

.p-toast-message-info {
  background-color: rgba(74, 60, 110, 0.1);
  border-left: 4px solid var(--color-info);
}
```

---

## 16. Scrollbar Styling

```css
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
```

---

## 17. Performance Optimizations

### GPU Acceleration
Use these properties for smooth animations on mobile:
```css
.gpu-accelerated {
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
}
```

### Will-Change
Only apply to elements that will animate:
```css
.will-animate {
  will-change: opacity, transform;
}
```

### Contain Property
Use on complex sections to limit browser repaints:
```css
.hero-section {
  contain: strict;
  overflow: clip;
}
```

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 18. CSS Variables Reference

### Complete Variables List
```css
:root {
  /* Primary Colors */
  --color-primary: #d4a84b;
  --color-primary-light: #e5c47a;
  --color-primary-dark: #b8923f;

  /* Secondary Colors */
  --color-secondary: #4a3c6e;
  --color-secondary-light: #6b5a8e;
  --color-secondary-dark: #352a52;

  /* Accent Colors */
  --color-accent: #6b2c3a;
  --color-accent-light: #8e4a5a;
  --color-accent-dark: #4d1f2a;

  /* Semantic Colors */
  --color-success: #22C55E;
  --color-success-light: #4ADE80;
  --color-success-dark: #16A34A;
  --color-warning: #d4a84b;
  --color-error: #6b2c3a;
  --color-info: #4a3c6e;

  /* Background Colors */
  --color-background: #f5f0e6;
  --color-foreground: #0d1424;
  --color-muted: #374151;
  --color-border: #e8e3d9;
  --color-border-light: #f0ebe1;
  --color-surface: #ffffff;

  /* Named Colors */
  --color-navy: #1a2744;
  --color-navy-dark: #151e32;
  --color-purple: #4a3c6e;
  --color-burgundy: #6b2c3a;
  --color-cream: #f5f0e6;
  --color-ivory: #faf8f3;

  /* Effect Colors */
  --color-contrast-dark: #000000;
  --color-contrast-light: #ffffff;
  --color-glass: rgba(255, 255, 255, 0.85);
  --color-glass-dark: rgba(26, 39, 68, 0.85);

  /* Shadow Colors */
  --shadow-color-soft: rgba(26, 39, 68, 0.06);
  --shadow-color-medium: rgba(26, 39, 68, 0.1);
  --gold-shadow-hover: rgba(212, 168, 75, 0.25);

  /* Typography */
  --letter-spacing-tight: -1.5px;
  --letter-spacing-tighter: -1.8px;
  --letter-spacing-normal: -0.5px;

  /* Layout */
  --sidebar-width: 280px;
  --sidebar-collapsed-width: 80px;
  --header-height: 64px;
}
```

---

## 19. File Structure Reference

```
/src
  /app
    └── globals.css          # Design tokens, utilities, animations
  /styles
    ├── landing.css          # Landing page components (7400+ lines)
    ├── signin.css           # Authentication page styles
    └── admin.css            # Admin-specific overrides
  /components
    └── forms/styles/
        └── form-input.css   # Form input styling
```

---

## 20. Quick Reference

### Common Class Patterns

**Cards:**
- `.premium-glass-card` - Main glass card
- `.premium-stat-card` - Dark variant
- `.process-step-card` - Step card with number

**Buttons:**
- `.landing-btn-primary` - Gold gradient
- `.landing-btn-outline` - Gold outline
- `.landing-btn-light` - White solid
- `.btn-arrow-gold` - Gold with arrow
- `.btn-contrast` - Black/white contrast

**Sections:**
- `.section-dark` - Navy background
- `.section-black` - Black background

**Typography:**
- `.heading-tight` - -1.5px letter spacing
- `.heading-tighter` - -1.8px letter spacing

**Utilities:**
- `.animate-fade-in` - Fade animation
- `.animate-slide-up` - Slide up animation
- `.container-custom` - Max-width container

### Key Design Decisions
1. Always use `Inter` font with tight letter-spacing for headlines
2. Cards lift 8-12px on hover with gold shadow glow
3. Buttons transform -2px on hover with enhanced shadow
4. Use glassmorphism (12px blur) for floating elements
5. Gold (#d4a84b) is the primary accent for all interactive elements
6. Navy (#1a2744) is the primary dark background
7. All transitions use 0.25s-0.5s timing with ease or cubic-bezier easing
