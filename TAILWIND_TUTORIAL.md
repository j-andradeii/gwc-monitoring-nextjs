# Tailwind CSS Comprehensive Tutorial & Reference

## Table of Contents

1. [Core Concepts](#1-core-concepts)
2. [Layout & Container](#2-layout--container)
3. [Spacing (Padding & Margin)](#3-spacing-padding--margin)
4. [Responsive Design](#4-responsive-design)
5. [Flexbox](#5-flexbox)
6. [Grid](#6-grid)
7. [Typography](#7-typography)
8. [Colors & Backgrounds](#8-colors--backgrounds)
9. [Borders & Rings](#9-borders--rings)
10. [Shadows & Effects](#10-shadows--effects)
11. [Sizing (Width & Height)](#11-sizing-width--height)
12. [Positioning](#12-positioning)
13. [State Variants (Hover, Focus, Active)](#13-state-variants)
14. [Dark Mode](#14-dark-mode)
15. [Transitions & Animations](#15-transitions--animations)
16. [Custom Values & Arbitrary Properties](#16-custom-values--arbitrary-properties)
17. [Real-World Component Examples](#17-real-world-component-examples)

---

## 1. Core Concepts

Tailwind CSS is a **utility-first** CSS framework. Instead of writing custom CSS, you compose designs using small, single-purpose classes directly in your HTML/JSX.

### Traditional CSS vs Tailwind

```css
/* Traditional CSS */
.card {
  max-width: 80rem;
  margin-left: auto;
  margin-right: auto;
  padding: 2rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

```html
<!-- Tailwind CSS equivalent -->
<div class="max-w-7xl mx-auto p-8 bg-white rounded-lg shadow-md">
  <!-- content -->
</div>
```

### How Utility Classes Map to CSS

| Tailwind Class | CSS Property                              |
| -------------- | ----------------------------------------- |
| `max-w-7xl`    | `max-width: 80rem` (1280px)               |
| `mx-auto`      | `margin-left: auto; margin-right: auto`   |
| `px-4`         | `padding-left: 1rem; padding-right: 1rem` |
| `py-8`         | `padding-top: 2rem; padding-bottom: 2rem` |
| `bg-white`     | `background-color: #ffffff`               |
| `rounded-lg`   | `border-radius: 0.5rem`                   |
| `shadow-md`    | `box-shadow: 0 4px 6px -1px ...`         |

---

## 2. Layout & Container

### The Container Pattern: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8`

This is the **most common layout pattern** in Tailwind. Let's break it down piece by piece:

```
max-w-7xl  → Caps the content width at 1280px (80rem)
mx-auto    → Centers the container horizontally
px-4       → 16px horizontal padding (mobile default)
sm:px-6    → 24px horizontal padding at ≥640px
lg:px-8    → 32px horizontal padding at ≥1024px
py-8       → 32px vertical padding (all breakpoints)
```

#### Visual Representation

```
┌─────────────────── Viewport (full width) ───────────────────┐
│                                                              │
│   ┌─── max-w-7xl (1280px) centered with mx-auto ────┐       │
│   │                                                   │      │
│   │  px-4 (mobile) / sm:px-6 / lg:px-8               │      │
│   │  ┌─────────────────────────────────────┐          │      │
│   │  │                                     │ py-8     │      │
│   │  │         Your Content Here           │          │      │
│   │  │                                     │ py-8     │      │
│   │  └─────────────────────────────────────┘          │      │
│   │                                                   │      │
│   └───────────────────────────────────────────────────┘      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### Full Example

```jsx
{/* Page-level layout wrapper */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
  <p className="mt-2 text-gray-600">Welcome back, user.</p>

  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Cards go here */}
  </div>
</div>
```

### Max-Width Scale

| Class        | Max-Width | Pixels |
| ------------ | --------- | ------ |
| `max-w-xs`   | 20rem     | 320px  |
| `max-w-sm`   | 24rem     | 384px  |
| `max-w-md`   | 28rem     | 448px  |
| `max-w-lg`   | 32rem     | 512px  |
| `max-w-xl`   | 36rem     | 576px  |
| `max-w-2xl`  | 42rem     | 672px  |
| `max-w-3xl`  | 48rem     | 768px  |
| `max-w-4xl`  | 56rem     | 896px  |
| `max-w-5xl`  | 64rem     | 1024px |
| `max-w-6xl`  | 72rem     | 1152px |
| `max-w-7xl`  | 80rem     | 1280px |
| `max-w-full` | 100%      | -      |

### Built-in Container Class

Tailwind also has a `container` class, but `max-w-7xl mx-auto` is more explicit and preferred:

```html
<!-- Using container (auto breakpoints) -->
<div class="container mx-auto px-4">...</div>

<!-- Using max-w (explicit control — preferred) -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">...</div>
```

---

## 3. Spacing (Padding & Margin)

### Spacing Scale

Tailwind uses a consistent spacing scale where `1 unit = 0.25rem (4px)`.

| Class  | Value   | Pixels |
| ------ | ------- | ------ |
| `p-0`  | 0       | 0px    |
| `p-px` | 1px     | 1px    |
| `p-0.5`| 0.125rem| 2px    |
| `p-1`  | 0.25rem | 4px    |
| `p-2`  | 0.5rem  | 8px    |
| `p-3`  | 0.75rem | 12px   |
| `p-4`  | 1rem    | 16px   |
| `p-5`  | 1.25rem | 20px   |
| `p-6`  | 1.5rem  | 24px   |
| `p-8`  | 2rem    | 32px   |
| `p-10` | 2.5rem  | 40px   |
| `p-12` | 3rem    | 48px   |
| `p-16` | 4rem    | 64px   |
| `p-20` | 5rem    | 80px   |
| `p-24` | 6rem    | 96px   |
| `p-32` | 8rem    | 128px  |
| `p-40` | 10rem   | 160px  |
| `p-48` | 12rem   | 192px  |
| `p-56` | 14rem   | 224px  |
| `p-64` | 16rem   | 256px  |

### Padding Directions

```
p-{n}   → all sides          padding: {value}
px-{n}  → horizontal (x)     padding-left + padding-right
py-{n}  → vertical (y)       padding-top + padding-bottom
pt-{n}  → top                padding-top
pr-{n}  → right              padding-right
pb-{n}  → bottom             padding-bottom
pl-{n}  → left               padding-left
ps-{n}  → inline-start       padding-inline-start (LTR = left)
pe-{n}  → inline-end         padding-inline-end (LTR = right)
```

### Margin Directions (Same pattern)

```
m-{n}   → all sides
mx-{n}  → horizontal
my-{n}  → vertical
mt-{n}  → top
mr-{n}  → right
mb-{n}  → bottom
ml-{n}  → left
ms-{n}  → inline-start
me-{n}  → inline-end
```

### Special Margin Values

```html
<!-- Auto margin — used for centering -->
<div class="mx-auto">Centered horizontally</div>
<div class="ml-auto">Pushed to the right</div>

<!-- Negative margins -->
<div class="-mt-4">Pulls element up by 1rem</div>
<div class="-mx-4">Extends beyond parent padding</div>
```

### Practical Example: Spacing Composition

```jsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {/* Section header with bottom margin */}
  <div className="mb-8">
    <h1 className="text-2xl font-bold">Settings</h1>
    <p className="mt-1 text-sm text-gray-500">Manage your preferences.</p>
  </div>

  {/* Cards with gap between them */}
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow">Card 1</div>
    <div className="bg-white p-6 rounded-lg shadow">Card 2</div>
    <div className="bg-white p-6 rounded-lg shadow">Card 3</div>
  </div>
</div>
```

### Space Between (`space-x` / `space-y`)

Adds margin between child elements (not on the first/last):

```html
<!-- Vertical spacing between children -->
<div class="space-y-4">
  <div>Item 1</div>  <!-- no margin-top -->
  <div>Item 2</div>  <!-- margin-top: 1rem -->
  <div>Item 3</div>  <!-- margin-top: 1rem -->
</div>

<!-- Horizontal spacing between children -->
<div class="flex space-x-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

---

## 4. Responsive Design

Tailwind is **mobile-first**. Base classes apply to all screen sizes. Prefixed classes apply at that breakpoint **and above**.

### Breakpoints

| Prefix | Min-Width | CSS                        |
| ------ | --------- | -------------------------- |
| (none) | 0px       | Default (mobile)           |
| `sm:`  | 640px     | `@media (min-width: 640px)`  |
| `md:`  | 768px     | `@media (min-width: 768px)`  |
| `lg:`  | 1024px    | `@media (min-width: 1024px)` |
| `xl:`  | 1280px    | `@media (min-width: 1280px)` |
| `2xl:` | 1536px    | `@media (min-width: 1536px)` |

### How `px-4 sm:px-6 lg:px-8` Works

```
Phone (0–639px):     px-4  → padding-left/right: 1rem  (16px)
Tablet (640–1023px): px-6  → padding-left/right: 1.5rem (24px)
Desktop (1024px+):   px-8  → padding-left/right: 2rem  (32px)
```

### Responsive Layout Example

```jsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {/* Stack on mobile, 2 columns on tablet, 3 on desktop */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
      <h3 className="text-lg sm:text-xl font-semibold">Card Title</h3>
      <p className="mt-2 text-sm sm:text-base text-gray-600">
        Description text that adjusts size.
      </p>
    </div>
    {/* More cards... */}
  </div>
</div>
```

### Common Responsive Patterns

```html
<!-- Hide/show at breakpoints -->
<div class="hidden sm:block">Visible on tablet+</div>
<div class="block sm:hidden">Visible on mobile only</div>

<!-- Responsive text alignment -->
<h1 class="text-center sm:text-left">Centered on mobile, left on tablet+</h1>

<!-- Responsive flex direction -->
<div class="flex flex-col sm:flex-row gap-4">
  <div>Stacked on mobile</div>
  <div>Side by side on tablet+</div>
</div>

<!-- Responsive width -->
<div class="w-full sm:w-1/2 lg:w-1/3">
  Responsive width
</div>
```

---

## 5. Flexbox

### Flex Container

```html
<!-- Basic flex row -->
<div class="flex">...</div>

<!-- Flex column -->
<div class="flex flex-col">...</div>

<!-- Flex with wrapping -->
<div class="flex flex-wrap">...</div>

<!-- Inline flex -->
<div class="inline-flex">...</div>
```

### Justify Content (Main Axis)

```html
<div class="flex justify-start">      <!-- items at start (default) -->
<div class="flex justify-center">     <!-- items centered -->
<div class="flex justify-end">        <!-- items at end -->
<div class="flex justify-between">    <!-- space between items -->
<div class="flex justify-around">     <!-- space around items -->
<div class="flex justify-evenly">     <!-- equal space between -->
```

### Align Items (Cross Axis)

```html
<div class="flex items-start">        <!-- top aligned -->
<div class="flex items-center">       <!-- vertically centered -->
<div class="flex items-end">          <!-- bottom aligned -->
<div class="flex items-stretch">      <!-- stretch to fill (default) -->
<div class="flex items-baseline">     <!-- align text baselines -->
```

### Flex Item Properties

```html
<!-- Grow/shrink -->
<div class="flex-1">         <!-- flex: 1 1 0% — grow and shrink equally -->
<div class="flex-auto">      <!-- flex: 1 1 auto -->
<div class="flex-initial">   <!-- flex: 0 1 auto (default) -->
<div class="flex-none">      <!-- flex: none — don't grow or shrink -->

<!-- Grow only -->
<div class="grow">           <!-- flex-grow: 1 -->
<div class="grow-0">         <!-- flex-grow: 0 -->

<!-- Shrink only -->
<div class="shrink">         <!-- flex-shrink: 1 -->
<div class="shrink-0">       <!-- flex-shrink: 0 (prevent shrinking) -->

<!-- Order -->
<div class="order-first">   <!-- order: -9999 -->
<div class="order-last">    <!-- order: 9999 -->
<div class="order-1">       <!-- order: 1 -->
```

### Gap (Works with Flex and Grid)

```html
<div class="flex gap-4">         <!-- 1rem gap all directions -->
<div class="flex gap-x-4">      <!-- 1rem horizontal gap -->
<div class="flex gap-y-2">      <!-- 0.5rem vertical gap -->
```

### Practical Flex Examples

```jsx
{/* Navbar */}
<nav className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
  <div className="flex items-center gap-2">
    <img src="/logo.svg" className="h-8 w-8" alt="Logo" />
    <span className="text-xl font-bold">Brand</span>
  </div>
  <div className="hidden sm:flex items-center gap-6">
    <a href="#" className="text-gray-700 hover:text-gray-900">Home</a>
    <a href="#" className="text-gray-700 hover:text-gray-900">About</a>
    <a href="#" className="text-gray-700 hover:text-gray-900">Contact</a>
  </div>
</nav>

{/* Centered content (vertical + horizontal) */}
<div className="flex items-center justify-center min-h-screen">
  <div className="text-center">
    <h1 className="text-4xl font-bold">Centered</h1>
  </div>
</div>

{/* Sidebar layout */}
<div className="flex min-h-screen">
  <aside className="w-64 flex-none bg-gray-800 text-white p-4">
    Sidebar (fixed width)
  </aside>
  <main className="flex-1 p-8">
    Main content (fills remaining space)
  </main>
</div>

{/* Push item to end */}
<div className="flex items-center gap-4">
  <span>Logo</span>
  <span>Nav Item</span>
  <button className="ml-auto">Login</button> {/* Pushed to right */}
</div>
```

---

## 6. Grid

### Grid Container

```html
<div class="grid grid-cols-3">           <!-- 3 equal columns -->
<div class="grid grid-cols-12">          <!-- 12-column grid -->
<div class="grid grid-rows-3">           <!-- 3 equal rows -->
```

### Responsive Grid Columns

```html
<!-- Most common pattern: stack → 2 cols → 3 cols -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>
```

### Grid Column/Row Span

```html
<!-- Span multiple columns -->
<div class="col-span-2">Takes up 2 columns</div>
<div class="col-span-full">Full width row</div>

<!-- Start/end positions -->
<div class="col-start-1 col-end-3">Columns 1-2</div>
<div class="col-start-2 col-span-3">Start at 2, span 3</div>

<!-- Row span -->
<div class="row-span-2">Tall item spanning 2 rows</div>
```

### Grid Template with Custom Sizes

```html
<!-- Sidebar + main content -->
<div class="grid grid-cols-[250px_1fr] gap-6">
  <aside>Fixed 250px sidebar</aside>
  <main>Flexible main</main>
</div>

<!-- Header + content + footer -->
<div class="grid grid-rows-[auto_1fr_auto] min-h-screen">
  <header>Auto height header</header>
  <main>Fills remaining space</main>
  <footer>Auto height footer</footer>
</div>
```

### Practical Grid Examples

```jsx
{/* Dashboard grid */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {/* Stats row */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    <div className="bg-white p-6 rounded-lg shadow">
      <p className="text-sm text-gray-500">Total Users</p>
      <p className="text-3xl font-bold">1,234</p>
    </div>
    <div className="bg-white p-6 rounded-lg shadow">
      <p className="text-sm text-gray-500">Revenue</p>
      <p className="text-3xl font-bold">$12,345</p>
    </div>
    <div className="bg-white p-6 rounded-lg shadow">
      <p className="text-sm text-gray-500">Orders</p>
      <p className="text-3xl font-bold">567</p>
    </div>
    <div className="bg-white p-6 rounded-lg shadow">
      <p className="text-sm text-gray-500">Conversion</p>
      <p className="text-3xl font-bold">3.2%</p>
    </div>
  </div>

  {/* Main content area */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
      Chart area (wider)
    </div>
    <div className="bg-white p-6 rounded-lg shadow">
      Activity feed (sidebar)
    </div>
  </div>
</div>

{/* Photo gallery */}
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
  <img className="aspect-square object-cover rounded" src="..." alt="" />
  <img className="aspect-square object-cover rounded col-span-2 row-span-2" src="..." alt="" />
  <img className="aspect-square object-cover rounded" src="..." alt="" />
  {/* ... */}
</div>
```

---

## 7. Typography

### Font Size

| Class       | Size     | Line Height |
| ----------- | -------- | ----------- |
| `text-xs`   | 0.75rem  | 1rem        |
| `text-sm`   | 0.875rem | 1.25rem     |
| `text-base` | 1rem     | 1.5rem      |
| `text-lg`   | 1.125rem | 1.75rem     |
| `text-xl`   | 1.25rem  | 1.75rem     |
| `text-2xl`  | 1.5rem   | 2rem        |
| `text-3xl`  | 1.875rem | 2.25rem     |
| `text-4xl`  | 2.25rem  | 2.5rem      |
| `text-5xl`  | 3rem     | 1           |
| `text-6xl`  | 3.75rem  | 1           |
| `text-7xl`  | 4.5rem   | 1           |
| `text-8xl`  | 6rem     | 1           |
| `text-9xl`  | 8rem     | 1           |

### Font Weight

```html
<p class="font-thin">       <!-- 100 -->
<p class="font-extralight"> <!-- 200 -->
<p class="font-light">      <!-- 300 -->
<p class="font-normal">     <!-- 400 -->
<p class="font-medium">     <!-- 500 -->
<p class="font-semibold">   <!-- 600 -->
<p class="font-bold">       <!-- 700 -->
<p class="font-extrabold">  <!-- 800 -->
<p class="font-black">      <!-- 900 -->
```

### Text Color

```html
<p class="text-gray-500">     <!-- Gray, medium intensity -->
<p class="text-gray-900">     <!-- Near black -->
<p class="text-blue-600">     <!-- Blue -->
<p class="text-red-500">      <!-- Red -->
<p class="text-green-700">    <!-- Dark green -->
<p class="text-white">        <!-- White -->
<p class="text-black">        <!-- Black -->
```

### Text Alignment & Decoration

```html
<p class="text-left">Left aligned</p>
<p class="text-center">Centered</p>
<p class="text-right">Right aligned</p>
<p class="text-justify">Justified</p>

<p class="underline">Underlined</p>
<p class="line-through">Strikethrough</p>
<p class="no-underline">No underline</p>
<p class="uppercase">UPPERCASE</p>
<p class="lowercase">lowercase</p>
<p class="capitalize">Capitalized</p>
<p class="italic">Italic</p>
<p class="not-italic">Not italic</p>
```

### Line Height & Letter Spacing

```html
<p class="leading-none">    <!-- line-height: 1 -->
<p class="leading-tight">   <!-- line-height: 1.25 -->
<p class="leading-snug">    <!-- line-height: 1.375 -->
<p class="leading-normal">  <!-- line-height: 1.5 -->
<p class="leading-relaxed"> <!-- line-height: 1.625 -->
<p class="leading-loose">   <!-- line-height: 2 -->

<p class="tracking-tighter"> <!-- letter-spacing: -0.05em -->
<p class="tracking-tight">   <!-- letter-spacing: -0.025em -->
<p class="tracking-normal">  <!-- letter-spacing: 0 -->
<p class="tracking-wide">    <!-- letter-spacing: 0.025em -->
<p class="tracking-wider">   <!-- letter-spacing: 0.05em -->
<p class="tracking-widest">  <!-- letter-spacing: 0.1em -->
```

### Text Overflow & Wrapping

```html
<!-- Truncate with ellipsis (single line) -->
<p class="truncate">This very long text will be truncated with...</p>

<!-- Multi-line truncation -->
<p class="line-clamp-2">Clamp to 2 lines...</p>
<p class="line-clamp-3">Clamp to 3 lines...</p>

<!-- Word break -->
<p class="break-words">Break long words</p>
<p class="break-all">Break anywhere</p>

<!-- Whitespace -->
<p class="whitespace-nowrap">No wrapping</p>
<p class="whitespace-pre">Preserve whitespace</p>
```

### Practical Typography Example

```jsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {/* Page header */}
  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
    Dashboard Overview
  </h1>
  <p className="mt-2 text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl">
    Monitor your application performance and track key metrics
    across all your services.
  </p>

  {/* Section */}
  <h2 className="mt-10 text-xl font-semibold text-gray-800">
    Recent Activity
  </h2>
  <p className="mt-1 text-sm text-gray-500">
    Last updated 5 minutes ago
  </p>

  {/* Content with various text styles */}
  <div className="mt-4 space-y-3">
    <p className="text-base text-gray-700 leading-relaxed">
      Regular paragraph text with comfortable reading line height.
    </p>
    <p className="text-sm text-gray-500 italic">
      A subtle note or caption.
    </p>
    <p className="text-xs uppercase tracking-wider font-semibold text-gray-400">
      Category Label
    </p>
  </div>
</div>
```

---

## 8. Colors & Backgrounds

### Color Palette (Default)

Each color has shades from `50` (lightest) to `950` (darkest):

```
slate    → Cooler gray
gray     → Neutral gray
zinc     → Warm gray
neutral  → True neutral
stone    → Warmest gray
red      → Red
orange   → Orange
amber    → Amber/gold
yellow   → Yellow
lime     → Lime green
green    → Green
emerald  → Emerald
teal     → Teal
cyan     → Cyan
sky      → Sky blue
blue     → Blue
indigo   → Indigo
violet   → Violet
purple   → Purple
fuchsia  → Fuchsia
pink     → Pink
rose     → Rose
```

### Shade Scale Example (Blue)

| Class         | Hex       | Use Case                 |
| ------------- | --------- | ------------------------ |
| `blue-50`     | `#eff6ff` | Light backgrounds        |
| `blue-100`    | `#dbeafe` | Hover backgrounds        |
| `blue-200`    | `#bfdbfe` | Active backgrounds       |
| `blue-300`    | `#93c5fd` | Borders                  |
| `blue-400`    | `#60a5fa` | Icons, secondary text    |
| `blue-500`    | `#3b82f6` | Primary buttons          |
| `blue-600`    | `#2563eb` | Hover buttons            |
| `blue-700`    | `#1d4ed8` | Active buttons           |
| `blue-800`    | `#1e40af` | Dark mode text           |
| `blue-900`    | `#1e3a8a` | Dark mode headings       |
| `blue-950`    | `#172554` | Darkest shade            |

### Applying Colors

```html
<!-- Text color -->
<p class="text-blue-600">Blue text</p>

<!-- Background color -->
<div class="bg-blue-50">Light blue background</div>

<!-- Border color -->
<div class="border border-blue-300">Blue border</div>

<!-- Ring (focus outline) color -->
<input class="ring-2 ring-blue-500" />

<!-- Placeholder color -->
<input class="placeholder-gray-400" placeholder="Search..." />

<!-- Divide color (between children) -->
<div class="divide-y divide-gray-200">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Opacity Modifiers

```html
<!-- Background with opacity -->
<div class="bg-black/50">50% black overlay</div>
<div class="bg-blue-500/75">75% opaque blue</div>
<div class="bg-white/90">90% opaque white</div>

<!-- Text with opacity -->
<p class="text-gray-900/80">80% opaque text</p>

<!-- Border with opacity -->
<div class="border border-gray-500/20">Subtle border</div>
```

### Gradient Backgrounds

```html
<!-- Linear gradient -->
<div class="bg-gradient-to-r from-blue-500 to-purple-500">
  Left to right gradient
</div>

<!-- With via (middle) color -->
<div class="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
  Three-stop gradient
</div>

<!-- Gradient directions -->
<div class="bg-gradient-to-t">   <!-- bottom to top -->
<div class="bg-gradient-to-b">   <!-- top to bottom -->
<div class="bg-gradient-to-l">   <!-- right to left -->
<div class="bg-gradient-to-r">   <!-- left to right -->
<div class="bg-gradient-to-tr">  <!-- to top-right -->
<div class="bg-gradient-to-br">  <!-- to bottom-right -->
<div class="bg-gradient-to-bl">  <!-- to bottom-left -->
<div class="bg-gradient-to-tl">  <!-- to top-left -->
```

---

## 9. Borders & Rings

### Border Width

```html
<div class="border">        <!-- 1px all sides -->
<div class="border-0">      <!-- 0px -->
<div class="border-2">      <!-- 2px -->
<div class="border-4">      <!-- 4px -->
<div class="border-8">      <!-- 8px -->

<!-- Single side -->
<div class="border-t">      <!-- top only -->
<div class="border-r-2">    <!-- right 2px -->
<div class="border-b">      <!-- bottom only -->
<div class="border-l-4">    <!-- left 4px -->
```

### Border Radius

```html
<div class="rounded-none">   <!-- 0 -->
<div class="rounded-sm">     <!-- 0.125rem -->
<div class="rounded">        <!-- 0.25rem -->
<div class="rounded-md">     <!-- 0.375rem -->
<div class="rounded-lg">     <!-- 0.5rem -->
<div class="rounded-xl">     <!-- 0.75rem -->
<div class="rounded-2xl">    <!-- 1rem -->
<div class="rounded-3xl">    <!-- 1.5rem -->
<div class="rounded-full">   <!-- 9999px (pill/circle) -->

<!-- Per-corner -->
<div class="rounded-t-lg">       <!-- top-left + top-right -->
<div class="rounded-r-lg">       <!-- top-right + bottom-right -->
<div class="rounded-b-lg">       <!-- bottom-left + bottom-right -->
<div class="rounded-tl-lg">      <!-- top-left only -->
<div class="rounded-br-none">    <!-- bottom-right: 0 -->
```

### Ring (Focus Outline)

Rings are box-shadows used as focus indicators — they don't affect layout:

```html
<!-- Ring width -->
<div class="ring-1">          <!-- 1px ring -->
<div class="ring-2">          <!-- 2px ring -->
<div class="ring-4">          <!-- 4px ring -->
<div class="ring">            <!-- 3px ring (default) -->

<!-- Ring color -->
<input class="focus:ring-2 focus:ring-blue-500 focus:outline-none" />

<!-- Ring offset (gap between element and ring) -->
<button class="focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  Button
</button>
```

### Divide (Borders Between Children)

```html
<div class="divide-y divide-gray-200">
  <div class="py-4">Item 1</div>
  <div class="py-4">Item 2</div>  <!-- border-top between items -->
  <div class="py-4">Item 3</div>
</div>

<div class="flex divide-x divide-gray-200">
  <div class="px-4">Col 1</div>
  <div class="px-4">Col 2</div>
  <div class="px-4">Col 3</div>
</div>
```

---

## 10. Shadows & Effects

### Box Shadow

```html
<div class="shadow-sm">     <!-- Small shadow -->
<div class="shadow">        <!-- Default shadow -->
<div class="shadow-md">     <!-- Medium shadow -->
<div class="shadow-lg">     <!-- Large shadow -->
<div class="shadow-xl">     <!-- Extra large shadow -->
<div class="shadow-2xl">    <!-- Largest shadow -->
<div class="shadow-inner">  <!-- Inset shadow -->
<div class="shadow-none">   <!-- No shadow -->
```

### Opacity

```html
<div class="opacity-0">    <!-- Invisible -->
<div class="opacity-25">   <!-- 25% -->
<div class="opacity-50">   <!-- 50% -->
<div class="opacity-75">   <!-- 75% -->
<div class="opacity-100">  <!-- Fully visible -->
```

### Blur & Filters

```html
<!-- Backdrop blur (glassmorphism) -->
<div class="backdrop-blur-sm">   <!-- Slight blur -->
<div class="backdrop-blur-md">   <!-- Medium blur -->
<div class="backdrop-blur-lg">   <!-- Large blur -->

<!-- Element blur -->
<div class="blur-sm">
<div class="blur-md">

<!-- Glassmorphism card example -->
<div class="bg-white/30 backdrop-blur-lg rounded-xl border border-white/20 p-6 shadow-lg">
  Frosted glass card
</div>
```

---

## 11. Sizing (Width & Height)

### Width

```html
<!-- Fixed widths (same scale as spacing) -->
<div class="w-0">       <!-- 0px -->
<div class="w-1">       <!-- 0.25rem -->
<div class="w-4">       <!-- 1rem -->
<div class="w-8">       <!-- 2rem -->
<div class="w-16">      <!-- 4rem -->
<div class="w-32">      <!-- 8rem -->
<div class="w-64">      <!-- 16rem -->
<div class="w-96">      <!-- 24rem -->

<!-- Percentage widths -->
<div class="w-1/2">     <!-- 50% -->
<div class="w-1/3">     <!-- 33.333% -->
<div class="w-2/3">     <!-- 66.667% -->
<div class="w-1/4">     <!-- 25% -->
<div class="w-3/4">     <!-- 75% -->
<div class="w-1/5">     <!-- 20% -->
<div class="w-full">    <!-- 100% -->

<!-- Viewport widths -->
<div class="w-screen">  <!-- 100vw -->

<!-- Special -->
<div class="w-auto">    <!-- auto -->
<div class="w-fit">     <!-- fit-content -->
<div class="w-min">     <!-- min-content -->
<div class="w-max">     <!-- max-content -->
```

### Height

```html
<div class="h-8">        <!-- 2rem -->
<div class="h-16">       <!-- 4rem -->
<div class="h-64">       <!-- 16rem -->
<div class="h-full">     <!-- 100% -->
<div class="h-screen">   <!-- 100vh -->
<div class="h-dvh">      <!-- 100dvh (dynamic viewport height — mobile-friendly) -->
<div class="h-auto">     <!-- auto -->
<div class="h-fit">      <!-- fit-content -->

<!-- Min/max height -->
<div class="min-h-screen">   <!-- min-height: 100vh -->
<div class="min-h-full">     <!-- min-height: 100% -->
<div class="max-h-96">       <!-- max-height: 24rem -->
<div class="max-h-screen">   <!-- max-height: 100vh -->
```

### Aspect Ratio

```html
<div class="aspect-square">  <!-- 1:1 -->
<div class="aspect-video">   <!-- 16:9 -->
<div class="aspect-auto">    <!-- auto -->
```

---

## 12. Positioning

### Position Types

```html
<div class="static">     <!-- Default -->
<div class="relative">   <!-- Relative to normal position -->
<div class="absolute">   <!-- Relative to nearest positioned ancestor -->
<div class="fixed">      <!-- Relative to viewport -->
<div class="sticky">     <!-- Sticks on scroll -->
```

### Inset (Top, Right, Bottom, Left)

```html
<div class="absolute top-0 left-0">       <!-- Top-left corner -->
<div class="absolute top-0 right-0">      <!-- Top-right corner -->
<div class="absolute bottom-0 left-0">    <!-- Bottom-left corner -->
<div class="absolute inset-0">            <!-- Fill entire parent -->
<div class="absolute inset-x-0 top-0">   <!-- Full width at top -->
<div class="absolute inset-y-0 right-0"> <!-- Full height at right -->
```

### Z-Index

```html
<div class="z-0">     <!-- z-index: 0 -->
<div class="z-10">    <!-- z-index: 10 -->
<div class="z-20">    <!-- z-index: 20 -->
<div class="z-30">    <!-- z-index: 30 -->
<div class="z-40">    <!-- z-index: 40 -->
<div class="z-50">    <!-- z-index: 50 -->
<div class="z-auto">  <!-- z-index: auto -->
```

### Overflow

```html
<div class="overflow-auto">       <!-- Scrollbar when needed -->
<div class="overflow-hidden">     <!-- Clip overflow -->
<div class="overflow-scroll">     <!-- Always show scrollbar -->
<div class="overflow-visible">    <!-- Show overflow -->
<div class="overflow-x-auto">    <!-- Horizontal scroll only -->
<div class="overflow-y-auto">    <!-- Vertical scroll only -->
```

### Practical Position Examples

```jsx
{/* Sticky header */}
<header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <nav>...</nav>
  </div>
</header>

{/* Overlay / modal backdrop */}
<div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
  <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
    <h2>Modal Title</h2>
  </div>
</div>

{/* Badge on avatar */}
<div className="relative inline-block">
  <img className="h-12 w-12 rounded-full" src="..." alt="" />
  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
</div>

{/* Floating action button */}
<button className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 flex items-center justify-center">
  +
</button>
```

---

## 13. State Variants

### Hover, Focus, Active

```html
<!-- Hover -->
<button class="bg-blue-500 hover:bg-blue-600">Hover me</button>
<a class="text-gray-600 hover:text-gray-900 hover:underline">Link</a>

<!-- Focus -->
<input class="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none" />

<!-- Focus-visible (keyboard focus only) -->
<button class="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none">
  Only shows ring on keyboard focus
</button>

<!-- Active (while clicking) -->
<button class="bg-blue-500 hover:bg-blue-600 active:bg-blue-700">Click</button>

<!-- Disabled -->
<button class="bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed" disabled>
  Disabled
</button>
```

### Group & Peer Variants

```html
<!-- Group hover: style a child when hovering the parent -->
<div class="group rounded-lg border p-4 hover:bg-gray-50 cursor-pointer">
  <h3 class="font-bold group-hover:text-blue-600">Title</h3>
  <p class="text-gray-500 group-hover:text-gray-700">Description</p>
</div>

<!-- Peer: style an element based on a sibling's state -->
<input class="peer" type="checkbox" id="toggle" />
<label class="peer-checked:text-blue-600" for="toggle">
  Checked label turns blue
</label>
```

### First, Last, Odd, Even

```html
<ul>
  <li class="first:pt-0 last:pb-0 py-4 border-b last:border-0">Item</li>
</ul>

<!-- Striped table rows -->
<tr class="even:bg-gray-50 odd:bg-white">
```

### Form States

```html
<!-- Required -->
<input class="required:border-red-500" required />

<!-- Invalid -->
<input class="invalid:border-red-500 invalid:text-red-600" />

<!-- Placeholder shown -->
<input class="placeholder-shown:border-gray-300" />

<!-- Read-only -->
<input class="read-only:bg-gray-100" readonly />
```

---

## 14. Dark Mode

Tailwind supports dark mode with the `dark:` prefix.

### Configuration

In `tailwind.config.js`:

```js
module.exports = {
  darkMode: 'class',  // or 'media' for system preference
}
```

### Usage

```html
<!-- Switches based on <html class="dark"> -->
<div class="bg-white dark:bg-gray-900">
  <h1 class="text-gray-900 dark:text-white">Title</h1>
  <p class="text-gray-600 dark:text-gray-400">Description</p>
</div>
```

### Complete Dark Mode Example

```jsx
<div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
      Dashboard
    </h1>

    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Card Title
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Card description goes here.
        </p>
        <button className="mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">
          Action
        </button>
      </div>
    </div>
  </div>
</div>
```

---

## 15. Transitions & Animations

### Transition Properties

```html
<!-- Transition all properties -->
<div class="transition-all duration-300 ease-in-out">

<!-- Specific properties -->
<div class="transition-colors duration-200">    <!-- color changes -->
<div class="transition-opacity duration-150">   <!-- opacity changes -->
<div class="transition-shadow duration-200">    <!-- shadow changes -->
<div class="transition-transform duration-300"> <!-- transform changes -->
```

### Duration

```html
<div class="duration-75">    <!-- 75ms -->
<div class="duration-100">   <!-- 100ms -->
<div class="duration-150">   <!-- 150ms (fast) -->
<div class="duration-200">   <!-- 200ms (default feel) -->
<div class="duration-300">   <!-- 300ms (smooth) -->
<div class="duration-500">   <!-- 500ms (slow) -->
<div class="duration-700">   <!-- 700ms -->
<div class="duration-1000">  <!-- 1000ms -->
```

### Easing

```html
<div class="ease-linear">     <!-- linear -->
<div class="ease-in">         <!-- ease-in -->
<div class="ease-out">        <!-- ease-out -->
<div class="ease-in-out">     <!-- ease-in-out -->
```

### Transform & Scale

```html
<!-- Scale on hover -->
<div class="transition-transform duration-200 hover:scale-105">
  Grows 5% on hover
</div>

<!-- Translate -->
<div class="hover:-translate-y-1 transition-transform">
  Moves up on hover
</div>

<!-- Rotate -->
<div class="hover:rotate-6 transition-transform">
  Rotates on hover
</div>
```

### Built-in Animations

```html
<div class="animate-spin">     <!-- Continuous rotation -->
<div class="animate-ping">     <!-- Radar ping effect -->
<div class="animate-pulse">    <!-- Gentle pulse (loading) -->
<div class="animate-bounce">   <!-- Bouncing effect -->
```

### Practical Transition Examples

```jsx
{/* Interactive card with hover effects */}
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6
                transition-all duration-200
                hover:shadow-md hover:-translate-y-0.5 hover:border-gray-300
                cursor-pointer">
  <h3 className="font-semibold">Hoverable Card</h3>
  <p className="text-gray-500 mt-1">Subtle lift and shadow on hover</p>
</div>

{/* Button with transition */}
<button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium
                   transition-all duration-200
                   hover:bg-blue-700 hover:shadow-lg
                   active:bg-blue-800 active:scale-[0.98]
                   focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                   disabled:bg-gray-300 disabled:cursor-not-allowed">
  Submit
</button>

{/* Loading skeleton with pulse */}
<div className="animate-pulse space-y-4">
  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
</div>

{/* Notification dot with ping */}
<span className="relative flex h-3 w-3">
  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
</span>
```

---

## 16. Custom Values & Arbitrary Properties

### Arbitrary Values (Square Bracket Notation)

When Tailwind's default scale doesn't have what you need:

```html
<!-- Custom widths -->
<div class="w-[350px]">Exactly 350px wide</div>
<div class="w-[calc(100%-2rem)]">Calc expression</div>

<!-- Custom colors -->
<div class="bg-[#1a1a2e]">Custom hex color</div>
<div class="text-[rgb(59,130,246)]">Custom RGB</div>

<!-- Custom spacing -->
<div class="p-[13px]">13px padding</div>
<div class="mt-[10vh]">10vh top margin</div>

<!-- Custom font-size -->
<p class="text-[22px]">Custom 22px text</p>

<!-- Custom grid columns -->
<div class="grid grid-cols-[200px_1fr_100px]">Custom grid template</div>

<!-- Custom media query -->
<div class="min-[900px]:grid-cols-3">Custom breakpoint at 900px</div>
```

### Arbitrary Properties

For CSS properties with no Tailwind utility:

```html
<div class="[clip-path:circle(50%)]">Clipped to circle</div>
<div class="[writing-mode:vertical-lr]">Vertical text</div>
```

### CSS Variables

```html
<div class="bg-[var(--brand-color)]">Using CSS variable</div>
<div style={{ '--brand-color': '#3b82f6' }} class="bg-[var(--brand-color)]">
  Dynamic color
</div>
```

---

## 17. Real-World Component Examples

### Full Page Layout

```jsx
<div className="min-h-screen bg-gray-50">
  {/* Sticky Navigation */}
  <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold text-gray-900">Logo</span>
          <div className="hidden md:flex items-center gap-6">
            <a className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors" href="#">Dashboard</a>
            <a className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors" href="#">Projects</a>
            <a className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors" href="#">Settings</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-500 hover:text-gray-700">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <img className="h-8 w-8 rounded-full ring-2 ring-gray-200" src="/avatar.jpg" alt="User" />
        </div>
      </div>
    </div>
  </nav>

  {/* Page Content */}
  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Page header */}
    <div className="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <p className="mt-1 text-sm text-gray-500">
          A list of all projects in your account.
        </p>
      </div>
      <button className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        New Project
      </button>
    </div>

    {/* Content area */}
    <div className="mt-8">
      {/* ... */}
    </div>
  </main>
</div>
```

### Card Component

```jsx
<div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden
                transition-all duration-200 hover:shadow-md hover:border-gray-300">
  {/* Card image */}
  <div className="aspect-video bg-gray-100">
    <img className="w-full h-full object-cover" src="..." alt="" />
  </div>

  {/* Card body */}
  <div className="p-5">
    <div className="flex items-center gap-2 mb-2">
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Active
      </span>
      <span className="text-xs text-gray-500">3 days ago</span>
    </div>

    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
      Card Title Goes Here
    </h3>
    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
      A brief description that might be long so we clamp it to two lines
      for consistent card heights across the grid.
    </p>

    {/* Card footer */}
    <div className="mt-4 flex items-center justify-between">
      <div className="flex -space-x-2">
        <img className="h-6 w-6 rounded-full ring-2 ring-white" src="..." alt="" />
        <img className="h-6 w-6 rounded-full ring-2 ring-white" src="..." alt="" />
        <img className="h-6 w-6 rounded-full ring-2 ring-white" src="..." alt="" />
      </div>
      <a className="text-sm font-medium text-blue-600 hover:text-blue-700" href="#">
        View details →
      </a>
    </div>
  </div>
</div>
```

### Form Component

```jsx
<form className="max-w-lg mx-auto space-y-6">
  {/* Text input */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      Full Name
    </label>
    <input
      type="text"
      className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm
                 placeholder-gray-400
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none
                 transition-colors duration-200"
      placeholder="John Doe"
    />
  </div>

  {/* Email with error state */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      Email Address
    </label>
    <input
      type="email"
      className="w-full rounded-lg border border-red-300 px-3.5 py-2.5 text-sm
                 text-red-900 placeholder-red-300
                 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
      placeholder="you@example.com"
      value="invalid-email"
    />
    <p className="mt-1.5 text-sm text-red-600">
      Please enter a valid email address.
    </p>
  </div>

  {/* Select */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      Country
    </label>
    <select className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none
                       transition-colors duration-200">
      <option>United States</option>
      <option>Canada</option>
      <option>United Kingdom</option>
    </select>
  </div>

  {/* Textarea */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      Message
    </label>
    <textarea
      rows={4}
      className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm
                 placeholder-gray-400 resize-none
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none
                 transition-colors duration-200"
      placeholder="Write your message..."
    />
  </div>

  {/* Checkbox */}
  <div className="flex items-start gap-3">
    <input
      type="checkbox"
      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600
                 focus:ring-2 focus:ring-blue-500/20"
    />
    <label className="text-sm text-gray-600">
      I agree to the <a className="text-blue-600 hover:underline" href="#">terms</a> and{' '}
      <a className="text-blue-600 hover:underline" href="#">privacy policy</a>.
    </label>
  </div>

  {/* Submit button */}
  <button
    type="submit"
    className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold
               hover:bg-blue-700 active:bg-blue-800
               focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
               transition-colors duration-200 shadow-sm"
  >
    Submit
  </button>
</form>
```

### Table Component

```jsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Role
          </th>
          <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        <tr className="hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center gap-3">
              <img className="h-8 w-8 rounded-full" src="..." alt="" />
              <div>
                <div className="text-sm font-medium text-gray-900">Jane Cooper</div>
                <div className="text-sm text-gray-500">jane@example.com</div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            Admin
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
            <a className="text-blue-600 hover:text-blue-900 font-medium" href="#">
              Edit
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

### Alert / Notification Component

```jsx
{/* Success */}
<div className="rounded-lg border border-green-200 bg-green-50 p-4">
  <div className="flex items-start gap-3">
    <svg className="h-5 w-5 text-green-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
    <div>
      <h3 className="text-sm font-semibold text-green-800">Success</h3>
      <p className="mt-1 text-sm text-green-700">
        Your changes have been saved successfully.
      </p>
    </div>
  </div>
</div>

{/* Error */}
<div className="rounded-lg border border-red-200 bg-red-50 p-4">
  <div className="flex items-start gap-3">
    <svg className="h-5 w-5 text-red-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
    <div>
      <h3 className="text-sm font-semibold text-red-800">Error</h3>
      <p className="mt-1 text-sm text-red-700">
        Something went wrong. Please try again.
      </p>
    </div>
  </div>
</div>

{/* Warning */}
<div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
  <div className="flex items-start gap-3">
    <svg className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
    <div>
      <h3 className="text-sm font-semibold text-amber-800">Warning</h3>
      <p className="mt-1 text-sm text-amber-700">
        Your trial expires in 3 days.
      </p>
    </div>
  </div>
</div>

{/* Info */}
<div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
  <div className="flex items-start gap-3">
    <svg className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
    <div>
      <h3 className="text-sm font-semibold text-blue-800">Info</h3>
      <p className="mt-1 text-sm text-blue-700">
        A new version is available. Refresh to update.
      </p>
    </div>
  </div>
</div>
```

### Badge / Tag Component

```jsx
{/* Solid badges */}
<span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700">Default</span>
<span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700">Blue</span>
<span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-700">Green</span>
<span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-700">Red</span>
<span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-700">Amber</span>
<span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-700">Purple</span>

{/* Badge with dot indicator */}
<span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20">
  <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
  Online
</span>

{/* Badge with remove button */}
<span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
  React
  <button className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-blue-200 transition-colors">
    ×
  </button>
</span>
```

---

## Quick Reference: Class Naming Convention

```
{property}{side?}{-breakpoint?}{-size/value}

Examples:
  p-4          → padding: 1rem
  px-4         → padding-left/right: 1rem
  sm:px-6      → @media ≥640px: padding-left/right: 1.5rem
  hover:bg-blue-600 → on hover: background-color: blue-600
  dark:text-white    → in dark mode: color: white
  focus:ring-2       → on focus: ring-width: 2px
```

### Axis Notation

```
{property}     → all sides
{property}x    → left + right (horizontal)
{property}y    → top + bottom (vertical)
{property}t    → top
{property}r    → right
{property}b    → bottom
{property}l    → left
{property}s    → inline-start (logical)
{property}e    → inline-end (logical)
```

---

## The Golden Pattern

The container pattern you'll use on nearly every page:

```html
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <!-- Your content here -->
</div>
```

This gives you:
- **Constrained width** that doesn't stretch on ultra-wide screens
- **Centered** horizontally on the page
- **Responsive padding** that adapts to screen size
- **Consistent vertical rhythm** with `py-8`

Use it as the outermost wrapper for page content, inside your header/nav/footer sections, and anywhere you want consistent, readable content width.
