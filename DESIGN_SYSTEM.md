# Gateway Church Design System

A comprehensive design system for the Gateway Church Next.js project, inspired by church sanctuary ambiance.

---

## Color Palette

### Primary Colors

| Name | Variable | Hex | Usage |
|------|----------|-----|-------|
| **Warm Gold** | `--color-primary` | `#d4a84b` | Primary accent, buttons, highlights |
| Gold Light | `--color-primary-light` | `#e5c47a` | Hover states, subtle accents |
| Gold Dark | `--color-primary-dark` | `#b8923f` | Active states, emphasis |

### Secondary Colors

| Name | Variable | Hex | Usage |
|------|----------|-----|-------|
| **Royal Purple** | `--color-secondary` | `#4a3c6e` | Accent lighting, secondary UI |
| **Deep Navy** | `--color-navy` | `#1a2744` | Backgrounds, text, headers |
| **Rich Burgundy** | `--color-accent` | `#6b2c3a` | Accent color, warnings |

### Neutral Colors

| Name | Variable | Hex | Usage |
|------|----------|-----|-------|
| **Soft Cream** | `--color-cream` | `#f5f0e6` | Page backgrounds |
| Ivory | `--color-ivory` | `#faf8f3` | Light sections |
| Surface | `--color-surface` | `#ffffff` | Cards, panels |
| Border | `--color-border` | `#e8e3d9` | Dividers, borders |

### Text Colors

| Name | Variable | Hex |
|------|----------|-----|
| Primary | `--text-primary` | `#1a2744` |
| Secondary | `--text-secondary` | `#4a5568` |
| Muted | `--color-muted` | `#4a5568` |

---

## Typography

### Font Family
```css
--font-sans: 'Lato', system-ui, -apple-system, sans-serif;
--font-display: 'Lato', system-ui, -apple-system, sans-serif;
```

### Type Scale
| Element | Size | Weight |
|---------|------|--------|
| Page Title | 2rem - 3rem | 700 (Bold) |
| Section Title | 1.25rem | 600 (Semibold) |
| Body | 1rem | 400 (Regular) |
| Small/Muted | 0.875rem | 400 |
| Label | 0.75rem | 600 |

---

## Spacing

| Token | Value |
|-------|-------|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |
| 3xl | 64px |

---

## Shadows

```css
--shadow-color-soft: rgba(26, 39, 68, 0.06);
--shadow-color-medium: rgba(26, 39, 68, 0.1);
--gold-shadow-hover: rgba(212, 168, 75, 0.25);
```

| Type | CSS |
|------|-----|
| Soft | `0 4px 20px rgba(0, 0, 0, 0.04)` |
| Medium | `0 10px 40px rgba(0, 0, 0, 0.08)` |
| Heavy | `0 20px 50px rgba(0, 0, 0, 0.12)` |
| Gold Glow | `0 0 0 4px rgba(212, 168, 75, 0.1)` |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| sm | 8px | Small inputs |
| md | 12px | Cards, buttons |
| lg | 16px | Panels |
| xl | 20px | Feature cards |
| 2xl | 24px | Hero elements |
| full | 50px | Pills, tabs |

---

## Components

### Buttons

#### Primary Button
```css
.btn-primary {
  background: var(--color-primary);
  color: #ffffff;
  border-radius: 8px;
  padding: 10px 16px;
}
```

#### Outline Button
```css
.btn-outline {
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
  background: transparent;
}
```

### Cards

```css
.card {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.1);
  border-color: rgba(212, 168, 75, 0.25);
}
```

### Section Labels
```css
.section-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--primary-gold-accent);
}
```

---

## Transitions

| Type | Value |
|------|-------|
| Default | `all 0.3s ease` |
| Smooth | `all 0.35s cubic-bezier(0.4, 0, 0.2, 1)` |
| Quick | `all 0.2s ease` |

---

## Layout

### Container
```css
.landing-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
```

### Header
- Height: 80px
- Background: `rgba(245, 240, 230, 0.95)` with backdrop blur
- Position: Fixed with z-index: 1000

### Footer
- Background: `#1a2744` (Navy)
- Text: White with muted secondary

---

## Responsive Breakpoints

| Name | Width |
|------|-------|
| Mobile | < 768px |
| Tablet | 768px - 1024px |
| Desktop | > 1024px |

---

## Assets

### Logo
- Primary: `/assets/images/gwc-logo-gold.png`
- Location: `public/assets/images/`

### Image Guidelines
- Use `next/image` with `fill` for responsive images
- Add `unoptimized` for external URLs
- Use aspect ratios: 16:9, 4:3, 1:1

---

## Animation Classes

```css
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
.animate-slide-up { animation: slideUp 0.3s ease-out; }
.animate-slide-in-left { animation: slideInLeft 0.3s ease-out; }
.animate-pulse { animation: pulse 2s infinite; }
```

---

## Key Design Principles

1. **Warm & Welcoming** - Use gold accents to convey warmth
2. **Premium Feel** - Clean layouts with generous whitespace
3. **Sanctuary-Inspired** - Deep navy evokes depth and reverence
4. **Accessible** - High contrast text, clear hierarchy
5. **Smooth Interactions** - Subtle hover effects and transitions
