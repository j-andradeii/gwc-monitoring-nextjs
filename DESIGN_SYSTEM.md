# Gateway Church Design System

A comprehensive design system for the Gateway Church Next.js project, inspired by a premium, modern "Transformation Church" aesthetic.

---

## 1. Design Philosophy

### The "Premium Modern" Vibe
Our design language is built on three core pillars:
1.  **Glassmorphism**: We use frosted glass (`backdrop-filter: blur(12px)`) to create depth and lightness. Content feels suspended.
2.  **Bold Typography**: Headlines are **UPPERCASE** and **Extra-Bold (800+)** to command attention.
3.  **Dynamic Motion**: Every interaction has a tactile "lift" and "glow" to make the site feel alive.

---

## 2. Color Palette

### Primary Colors
| Name | Variable | Hex | Usage |
|------|----------|-----|-------|
| **Warm Gold** | `--color-primary` | `#d4a84b` | Primary accent, gradients, highlights |
| Gold Light | `--color-primary-light` | `#e5c47a` | Hover states, subtle glows |
| Gold Dark | `--color-primary-dark` | `#b8923f` | Active states, text emphasis |

### Secondary Colors
| Name | Variable | Hex | Usage |
|------|----------|-----|-------|
| **Deep Navy** | `--color-navy` | `#1a2744` | Backgrounds, heavy text |
| **Darker Navy**| `--color-navy-dark` | `#151e32` | Footer backgrounds |
| **Rich Burgundy**| `--color-accent` | `#6b2c3a` | Alerts, warnings |

### Neutral Colors
| Name | Variable | Hex | Usage |
|------|----------|-----|-------|
| **Soft Cream** | `--color-cream` | `#f5f0e6` | Warm backgrounds |
| Surface | `--color-surface` | `#ffffff` | Card bases |
| Glass | `--color-glass` | `rgba(255, 255, 255, 0.85)` | Glassmorphism base |

---

## 3. Typography

### Font Family
- **Primary**: `'Inter', sans-serif` (variable weights 100-900)

### Hierarchy
| Element | Size | Weight | Letter-Spacing | Style | Usage |
|---------|------|--------|----------------|-------|-------|
| **Hero Title** | `56px+` | **800** | **-1.8px** | **UPPERCASE** | Main landing page impact |
| **Section Title**| `32-36px` | **800** | **-1.5px** | **UPPERCASE** | Major section headers |
| **Card Title** | `24px` | **800** | **-0.5px** | **UPPERCASE** | Card Headers |
| Body Copy | `15px` | 500 | Normal | Regular | High readability text |

### Letter-Spacing Variables
```css
--letter-spacing-tight: -1.5px;   /* Section headers */
--letter-spacing-tighter: -1.8px; /* Hero titles */
--letter-spacing-normal: -0.5px;  /* Card titles */
```

---

## 4. Components

### Premium Glass Cards
The standard container for substantial content.
```css
.premium-glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

.premium-glass-card:hover {
  transform: translateY(-12px); /* The "Lift" */
  background: #ffffff;
  box-shadow: 0 24px 60px rgba(212, 168, 75, 0.15); /* The "Gold Glow" */
}
```

### Pill Buttons
Buttons are fully rounded for a modern, friendly feel.
```css
.landing-btn {
  border-radius: 50px; /* Full Pill */
  padding: 14px 32px;
  font-weight: 600;
  text-transform: uppercase;
}
```

### Border Buttons (High-Contrast Style)
For high-contrast sections, use border-heavy buttons with hover inversions.
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

**Variants:**
| Class | Default | Hover |
|-------|---------|-------|
| `.landing-btn-border` | Navy outline | Solid navy |
| `.landing-btn-border-light` | White outline | Solid white |
| `.landing-btn-border-gold` | Gold outline | Solid gold |
| `.landing-btn-solid-dark` | Solid navy | Navy outline |
| `.landing-btn-solid-gold` | Solid gold | Gold outline |

### Dynamic Icons
Icons live in a container that morphs shape on interaction.
- **Rest**: Rounded Square (`border-radius: 20px`)
- **Hover**: Circle (`border-radius: 50%`)
- **Motion**: `transform: rotate(-10deg) scale(1.1)`

---

## 5. Shadows & Effects

| Name | value | Usage |
|------|-------|-------|
| **Soft Shadow** | `0 4px 24px rgba(0,0,0,0.06)` | Resting state for cards |
| **Gold Glow** | `0 24px 60px rgba(212, 168, 75, 0.15)` | Hover state accent |
| **Progress Bar**| Gradient `linear-gradient(90deg, Gold, LightGold)` | Bottom of cards on hover |

---

## 6. Layout Principles
1.  **Top Alignment**: In grids, always use `justify-content: flex-start` to keep icons/titles aligned across cards of varying height.
2.  **Generous Spacing**: Use `40px` padding inside cards to avoid cramping.
3.  **Consistent Gap**: Use `24px` gap throughout flex/grid systems for modular spacing.
4.  **Responsive**: Cards stack to 1 column on mobile, maintaining their internal padding and hierarchy.

---

## 7. High-Contrast Sections

### Dark Section Backgrounds
For impactful dark sections, use the navy or black background with white text.
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
}

.service-detail-item:hover {
  border-color: rgba(212, 168, 75, 0.4);
}
```

---

## 8. CSS Variables Reference

### Colors
```css
--color-primary: #d4a84b;         /* Warm Gold */
--color-navy: #1a2744;            /* Deep Navy */
--color-navy-dark: #151e32;       /* Darker Navy */
--color-cream: #f5f0e6;           /* Soft Cream */
--color-contrast-dark: #000000;   /* Pure Black */
--color-contrast-light: #ffffff;  /* Pure White */
--color-glass: rgba(255, 255, 255, 0.85);
```

### Typography
```css
--letter-spacing-tight: -1.5px;
--letter-spacing-tighter: -1.8px;
--letter-spacing-normal: -0.5px;
```
