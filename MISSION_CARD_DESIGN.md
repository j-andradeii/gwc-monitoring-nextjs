# Mission Card Design Philosophy

This document outlines the core design principles behind the modernized "Mission Section" cards (WIN, CONSOLIDATE, DISCIPLE, SEND). These cards represent a premium, modern aesthetic designed to feel tactile, interactive, and aligned with a "Transformation Church" style vibe.

## 1. Core Material: "Frosted Glass" (Glassmorphism)
Instead of a flat white card, we use a sophisticated glass-like material that acts as a lens for the content.

- **Base Layer**: Semi-transparent white (`rgba(255, 255, 255, 0.85)`).
- **Blur**: A heavy backdrop blur (`12px`) softens whatever is behind it, creating depth.
- **Border**: A subtle, translucent white border (`rgba(255, 255, 255, 0.6)`) defines the edges without being harsh.
- **Effect**: The card feels lighter than air, suspended on the page.

## 2. Typography: Bold & Instructional
The text hierarchy is built to command attention and convey strength.

- **Titles ("WIN", "SEND")**:
  - **Weight**: Extra Bold (`800`).
  - **Case**: **UPPERCASE**. This creates a "stamp" like effect, making the keywords unforgettable.
  - **Spacing**: Slight letter-spacing (`0.5px`) adds breathability to the heavy font.
- **Body**: Medium weight (`500`) with generous line-height (`1.7`) for high readability.

## 3. Dynamic Iconography: "The Soul"
The icons are not static images; they are living elements that react to the user.

- **Container**: Large `72px` touch-target size.
- **Shape Shifting**: Starts as a **Rounded Square** (`20px` radius) and morphs into a **Circle** (`50%` radius) on hover.
- **Color Transition**:
  - *Rest*: Subtle gold tint background, gold icon.
  - *Active*: Vibrant gold gradient background, white icon.
- **Movement**: A playful tilt (`-10deg`) and scale (`1.1x`) makes the card feel organic and responsive.

## 4. Tactile Feedback (Hover States)
The user should "feel" the interaction.

- **Lift**: A significant vertical rise (`-12px`) simulates user pick-up.
- **Gold Glow**: The shadow isn't just dark; it has a **gold tint** (`rgba(212, 168, 75, 0.15)`), radiating warmth.
- **Progress Bar**: An elegant gold gradient line slides in at the bottom (`scaleX(1)`), subtly suggesting "progress" or "action".

## 5. Structural Consistency
- **Alignment**: Content is always **Top-Aligned** (`flex-start`). This ensures that in a row of cards, all icons stay perfectly level with each other, regardless of how long the description text is.
- **Padding**: Generous `40px` padding on desktop (reduced to `24px` on mobile) prevents the content from feeling cramped.

---

### Technical Implementation Checklist
When replicating this design, ensure these properties are present:

```css
.card {
  /* Glass Base */
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  
  /* Interaction Props */
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
}

.card:hover {
  /* The Lift */
  transform: translateY(-12px);
  /* The Warm Glow */
  box-shadow: 0 24px 60px rgba(212, 168, 75, 0.15);
}
```
