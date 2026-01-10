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
- **Primary**: `'Lato', sans-serif`

### Hierarchy
| Element | Size | Weight | Style | Usage |
|---------|------|--------|-------|-------|
| **Hero Title** | `56px+` | **900** | **UPPERCASE** | Main landing page impact |
| **Section Title**| `36px` | **800** | **UPPERCASE** | Major section headers ("MINISTRIES") |
| **Card Title** | `24px` | **800** | **UPPERCASE** | "WIN", "SEND", Card Headers |
| Body Copy | `15px` | 500 | Regular | High readability text |

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
3.  **Responsive**: Cards stack to 1 column on mobile, maintaining their internal padding and hierarchy.
