# Adding New Sermons

Instructions for adding new sermon entries to `sermons.ts`.

---

## File Location

```
gwc-monitoring-nextjs/src/data/sermons.ts
```

---

## Sermon Interface

```typescript
interface Sermon {
  // Required fields
  id: string;
  title: string;
  speaker: string;
  date: string;
  duration: string;
  series: string;
  excerpt: string;
  tags: string[];
  image: string;
  scriptures: { verse: string; text: string }[];

  // Optional fields
  speakerRole?: string;
  speakerImage?: string;
  seriesDescription?: string;
  description?: string;
  videoUrl?: string;
  audioUrl?: string;
  downloadUrl?: string;
  isFeatured?: boolean;
  keyPoints?: string[];
  relatedSermons?: string[];
}
```

---

## Field Guidelines

### Required Fields

| Field | Format | Example |
|-------|--------|---------|
| `id` | Unique string number | `'13'` (increment from last sermon) |
| `title` | Title case | `'The Power of Prayer'` |
| `speaker` | Full name with title | `'Ptr. Jim Baloran'` |
| `date` | `YYYY-MM-DD` format | `'2026-02-08'` |
| `duration` | Minutes format | `'45 min'` |
| `series` | Series name | `'Faith Foundation'` |
| `excerpt` | 1-2 sentence summary | Brief hook for the sermon |
| `tags` | Array of keywords | `['Prayer', 'Faith', 'Worship']` |
| `image` | Vercel Blob URL | See [Speaker Images](#speaker-images) |
| `scriptures` | Array of verse objects | See [Scriptures Format](#scriptures-format) |

### Optional Fields

| Field | Format | Notes |
|-------|--------|-------|
| `speakerRole` | Lowercase role | `'senior pastor'`, `'guest pastor'` |
| `speakerImage` | URL | Only if different from `image` |
| `seriesDescription` | 1-2 sentences | Description of the series |
| `description` | Multi-line string | Full sermon notes (use template literal) |
| `videoUrl` | YouTube/video URL | Link to video recording |
| `audioUrl` | Audio file URL | Link to audio recording |
| `downloadUrl` | File URL | Downloadable resource |
| `isFeatured` | `true` only | Set on ONE sermon to feature it |
| `keyPoints` | Array of strings | Main takeaways (legacy — prefer `keyTakeaways`) |
| `relatedSermons` | Array of sermon IDs | `['1', '5', '8']` |

---

## Redesigned Layout — Opt-In Fields

The sermon detail page uses a **Modern Reader** layout. All fields below are **optional** — existing sermons fall back gracefully by parsing their `description` markdown. Add these fields to unlock the full modern layout.

> **STRICT CONTENT RULE — applies to every text field below.**
>
> When populating any content-bearing field from pasted sermon notes — `description`, `sections[].paragraphs`, `sections[].callout`, `blessings[].text`, `keyTakeaways[]`, and `scriptureGroups[].text` — **do NOT add, rewrite, summarize, paraphrase, or embellish** the source content.
>
> Permitted actions:
> - Split existing paragraphs at natural sentence boundaries
> - Apply `**bold**` and `*italic*` markdown around words that were emphasized in the source
> - Move existing sentences into the correct structured field (e.g. takeaway sentence → `keyTakeaways`, scripture text → `scriptureGroups`)
> - Fix obvious typos only when certain
>
> NOT permitted:
> - Writing new transitional sentences ("Next, we see that…", "In summary…")
> - Inventing kickers, titles, or headings that were not in the source — only use what the pastor wrote
> - Summarizing a long paragraph into shorter takeaways
> - Adding filler phrases to make a section feel "complete"
> - Rewording for flow or readability
>
> If the pasted content lacks a `kicker`, `title`, `callout`, or `keyTakeaways` entry, **leave the field out** — do not fabricate it. Empty optional fields fall back gracefully.

### Full TypeScript Interface (new fields only)

```typescript
// Append these to the Sermon interface (all optional)
seriesNumber?: number;        // e.g. 7 → renders "Worship Series · Sermon 07"
subtitle?: {
  prefix: string;             // uppercase part before the italic word
  italic: string;             // rendered in Fraunces serif italic
  suffix?: string;            // optional uppercase suffix
};
keyVerse?: string;            // e.g. 'Nehemiah 8:5–6' — shown in hero meta row
sections?: Array<{
  id?: string;                // anchor id (auto-generated if omitted)
  kicker?: string;            // small uppercase label above title (optional — omit for legacy sermons)
  title: string;              // section heading
  paragraphs: string[];       // body paragraphs (supports **bold** and *italic*)
  callout?: string;           // pull-quote rendered in serif italic with purple border
  unnumbered?: boolean;       // set true for Introduction / Context — suppresses the gold number badge and renders as a bullet in the TOC
  subItems?: Array<{          // optional numbered sub-list rendered inline under the section
    title: string;            // sub-item heading (h3)
    ref?: string;             // scripture reference(s) — shown as small uppercase label
    text: string;             // body text (supports **bold** and *italic*)
  }>;
}>;
blessings?: Array<{
  title: string;              // blessing name
  ref: string;                // scripture references (displayed as small label)
  text: string;               // description
}>;
keyTakeaways?: string[];      // numbered card at end of Notes tab
scriptureGroups?: Array<{
  kicker?: string;            // context label e.g. "Blessing 1 · Presence" (optional)
  verse: string;              // reference e.g. "Matthew 18:20"
  text: string;               // scripture text (displayed italic)
}>;
```

---

### Field Explanations

#### `seriesNumber`
Sets the sermon number within a series. Displays in the hero eyebrow as:
```
Worship Series · Sermon 07
```
If omitted, only the series name is shown.

---

#### `subtitle`
Enables the split-italic title treatment in the hero:
```typescript
subtitle: {
  prefix: "God's Blessings for",
  italic: "True",
  suffix: "Worshippers",
}
```
Renders as: `GOD'S BLESSINGS FOR` *True* `WORSHIPPERS`
- The `prefix` and `suffix` render in Inter 800 uppercase
- The `italic` word renders in Fraunces serif italic (gold-light color)
- If `subtitle` is absent, the plain `title` field is used

---

#### `keyVerse`
A single scripture reference shown in the hero meta row alongside speaker, date, and duration. Example:
```typescript
keyVerse: 'Nehemiah 8:5–6'
```

---

#### `sections[]`
The preferred content structure for the Modern Reader layout. Each section renders with:
- A gold numbered badge (01, 02, 03...) — **skipped when `unnumbered: true`**
- An optional uppercase kicker label (e.g. "Introduction", "Main Teaching") — omit `kicker` for legacy sermons
- An h2 heading
- Body paragraphs (support `**bold**` and `*italic*` markdown)
- An optional `callout` pull-quote in Fraunces serif with purple left border

**Numbering convention:** The running counter only advances on teaching points. Set `unnumbered: true` on framing sections (`Introduction`, `Context`, background material) so the first real teaching point still reads as `01`. Unnumbered sections render with no gold badge and appear as a `•` bullet (instead of a number) in the Table of Contents.

**Fallback:** If `sections` is absent, the page parses `description` markdown using `**heading**` convention. Both render correctly — the modern layout is richer, but legacy sermons still display well.

---

#### `sections[].subItems[]`

An optional nested numbered list rendered inline inside a section, after the body paragraphs and before any `callout`. Use this when a section contains a numbered list of teachings (e.g., "5 blessings", "7 principles") and you want them to flow as typographic content rather than a bold card grid.

Each sub-item renders a small gold circle number badge, an h3 title, an optional small-caps scripture reference label, and body text at prose weight.

```typescript
sections: [
  {
    id: 'sec-blessings',
    kicker: 'Main Teaching',
    title: 'Five Blessings for True Worshippers',
    paragraphs: [
      'God responds to sincere worship with His presence and favor.',
    ],
    subItems: [
      {
        title: 'God Promises to Be with His Worshippers',
        ref: 'Matthew 18:20 · Revelation 3:20',
        text: 'One of the greatest blessings of worship is the presence of God.',
      },
      {
        title: 'God Guides and Surrounds Them with His Glory',
        ref: 'Exodus 40:35 · 2 Chronicles 7:1',
        text: 'When the glory of God comes down, blessings follow.',
      },
    ],
  },
]
```

**When to use `subItems` vs top-level `blessings`:**

| Use | When |
|-----|------|
| `sections[].subItems` | The numbered list belongs to a specific section and should read as inline prose content (no card backgrounds, vertical stack, typographic) |
| top-level `blessings` | You want a bold 2-column card grid spanning the full article width — standalone visual treatment outside any section |

---

#### `blessings[]`
A 2-column card grid rendered after the main sections — ideal for "Five Blessings" style lists. Each card shows a large serif italic number, title, scripture reference, and description text.

```typescript
blessings: [
  {
    title: 'God Promises to Be with His Worshippers',
    ref: 'Matthew 18:20 · Revelation 3:20',
    text: 'One of the greatest blessings of worship is the presence of God...',
  },
]
```

The last blessing spans full width if the total count is odd.

---

#### `keyTakeaways[]`
Replaces or supplements `keyPoints`. Renders as a numbered card with a gold top-bar accent at the end of the Notes tab. Prefer `keyTakeaways` over `keyPoints` for new sermons.

```typescript
keyTakeaways: [
  'True worship begins with reverence for God and His Word.',
  'God designed us to live in His presence.',
]
```

---

#### `scriptureGroups[]`
Enhances the Scripture tab with kicker labels showing context. Falls back to `scriptures[]` if absent. The `kicker` field is optional — omit it for legacy sermons or entries that do not have a meaningful context label.

```typescript
scriptureGroups: [
  {
    kicker: 'Key Verse',        // optional — omit if not applicable
    verse: 'Nehemiah 8:5–6',
    text: '"And Ezra opened the book in the sight of all the people…"',
  },
  {
    kicker: 'Blessing 1 · Presence',
    verse: 'Matthew 18:20',
    text: '"For where two or three are gathered together in my name…"',
  },
]
```

The 2-letter book badge (NE, MT, RV, etc.) is auto-derived from the verse book name using a lookup table. Numbered books use a digit prefix: `1 Corinthians` → `1C`.

---

### Fallback Behavior Summary

| Field | Present | Absent |
|-------|---------|--------|
| `sections` | Renders numbered section heads with kicker labels | Parses `description` markdown `**heading**` convention |
| `sections[].unnumbered` | No gold badge; bullet in TOC; running counter skips this section | Section receives the next number in the running counter |
| `sections[].subItems` | Numbered typographic sub-list inside that section | Section renders without sub-list |
| `subtitle` | Split-italic hero title (Fraunces serif italic word) | Plain `title` field in uppercase |
| `keyVerse` | Shown in hero meta row | Meta row omits key verse |
| `blessings` | 2-column blessing cards after sections | No blessing grid |
| `keyTakeaways` | Numbered takeaway card (gold top-bar) | Falls back to `keyPoints` if present |
| `scriptureGroups` | Scripture tab with kicker labels + badges | Falls back to `scriptures[]` (no kickers) |

---

### Migrating Legacy Sermons

Legacy sermons (those with only a `description` markdown string and a `keyPoints` array) can be partially migrated to the Modern Reader format without fabricating any content:

- **`kicker`** — only add a kicker when the source itself marks a labeled grouping (e.g. "Introduction", "Context", numbered "Principle 1 / Point 1" headings). Do not invent labels.
- **`unnumbered`** — if you do add a section whose kicker is `Introduction` or `Context`, set `unnumbered: true` so the running counter starts at `01` on the first teaching point.
- **`callout`** — do NOT add a callout; omit it unless the source notes contain a clearly marked pull-quote (e.g. a "Key Truth" line explicitly called out after each principle).
- **`sections[].title`** — use the `**Heading Text**` verbatim from the description (strip the `**` markers only).
- **`sections[].id`** — slugify the heading text (lowercase, spaces to hyphens, strip punctuation).
- **`sections[].paragraphs`** — the prose that follows each heading, split on blank lines; preserve all existing `**bold**` and `*italic*` markers.
- **Keep `description` and `keyPoints`** — do NOT delete the legacy fields when migrating. They remain as SEO fallback and as a safety net if `sections` is ever removed. Add `keyTakeaways` alongside them (the renderer prefers `keyTakeaways ?? keyPoints`).
- **Skip `sections` entirely** — if the description has no clean `**Heading**` blocks that naturally segment the content, omit `sections` and let the markdown fallback parser render the description.
- **Do NOT add** `seriesNumber`, `subtitle`, `keyVerse`, or `blessings` to legacy sermons — these require source content that does not exist in the legacy notes.
- **`scriptureGroups` IS acceptable** when the sermon has numbered principles/points and you can attach each verse to its principle using the exact same kicker label used on the corresponding section (e.g. `Principle 1 · Preparation`). This reuses the scripture text verbatim from `scriptures[]` — no fabrication, just re-labeling.

---

### Structured Principle/Point Sermons (Sermon id 19 pattern)

When the source sermon follows a repeated "Principle N → Key Moments (a, b, c) → Key Truth" shape (e.g. Acts 16 "Anatomy of a Divine Vision"), map it like this:

| Source element | Field |
|---|---|
| "Introduction" heading + opening paragraphs | `{ kicker: 'Introduction', unnumbered: true, title: ... }` |
| Numbered heading like `**1. The Preparation of the Visionary** (Acts 16:1–5)` | `{ kicker: 'Principle 1 · Preparation', title: 'The Preparation of the Visionary' }` |
| Scripture reference that appears inline after the heading | First paragraph in bold: `'**Acts 16:1–5** — ...'` |
| Lettered sub-moments `**a. The Selection of Timothy**` + prose | Entry in `subItems[]` — strip the `a.` prefix from the title |
| `**Key Truth:** <one-line maxim>` | `callout: '<one-line maxim>'` |
| The companion `scriptures[]` entries | Mirror each entry into `scriptureGroups[]` with `kicker` matching the corresponding section kicker; add a final `{ kicker: 'Follow-up Verse', ... }` for any verse referenced in the Introduction only |

Do not introduce any wording that is not already in the source transcript. The migration is re-structuring, not rewriting.

---

### Full Template for New Sermons (Modern Reader Layout)

```typescript
{
  id: 'NEXT_ID',
  slug: 'your-sermon-slug',
  title: 'Your Sermon Title',
  speaker: 'Ptr. Speaker Name',
  speakerRole: 'senior pastor',
  date: 'YYYY-MM-DD',
  duration: '45 min',
  series: 'Series Name',
  seriesDescription: 'One-two sentence description of the series.',
  isFeatured: false,
  excerpt: 'Brief 1–2 sentence hook for the sermon.',

  // Legacy fallback — still used for SEO description and legacy layout
  description: `**SECTION ONE HEADING**

First paragraph of content.

Second paragraph.

---

**SECTION TWO HEADING**

More content...`,

  tags: ['Tag1', 'Tag2', 'Tag3'],
  image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/your-image.jpg',
  scriptures: [
    { verse: 'Book Chapter:Verse', text: 'Full scripture text (NKJV).' }
  ],
  keyPoints: ['Legacy takeaway 1', 'Legacy takeaway 2'],

  // --- Modern Reader Layout fields (opt-in) ---
  seriesNumber: 1,
  subtitle: {
    prefix: 'Your',
    italic: 'Title',
    suffix: 'Here',
  },
  keyVerse: 'Book Chapter:Verse',
  sections: [
    {
      id: 'sec-intro',
      kicker: 'Introduction',
      title: 'Your Section Title',
      unnumbered: true, // Introduction — no gold badge, no number in TOC
      paragraphs: [
        'First paragraph — supports **bold** and *italic* markdown.',
        'Second paragraph.',
      ],
      callout: 'Optional pull-quote rendered in Fraunces serif with purple border.',
    },
    {
      id: 'sec-context',
      kicker: 'Context',
      title: 'Background / Historical Setting',
      unnumbered: true, // Context — no gold badge, no number in TOC
      paragraphs: ['Framing material that precedes the teaching points.'],
    },
    {
      id: 'sec-main',
      kicker: 'Main Teaching',
      title: 'Your Main Section', // first numbered point — renders as "01"
      paragraphs: ['Content here.'],
    },
  ],
  blessings: [
    {
      title: 'First Blessing Name',
      ref: 'Book Chapter:Verse',
      text: 'Description of this blessing.',
    },
    {
      title: 'Second Blessing Name',
      ref: 'Book Chapter:Verse',
      text: 'Description of this blessing.',
    },
  ],
  keyTakeaways: [
    'First takeaway sentence.',
    'Second takeaway sentence.',
    'Third takeaway sentence.',
  ],
  scriptureGroups: [
    {
      kicker: 'Key Verse',
      verse: 'Book Chapter:Verse',
      text: '"The scripture text here."',
    },
    {
      kicker: 'Main Teaching',
      verse: 'Book Chapter:Verse',
      text: '"Another scripture here."',
    },
  ],
  relatedSermons: ['1', '2'],
},
```

---

### Canonical Example — God's Blessings for True Worshippers

See sermon `id: '21'` in `sermons.ts` for the complete reference implementation using all Modern Reader fields.

---

## Speaker Images

Current speaker images in use:

| Speaker | Image URL |
|---------|-----------|
| Ptr. Jim Baloran | `https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg` |
| Ptr. Rodel Umapas | `https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptr-rodel.jpg` |

For new speakers, upload image to Vercel Blob storage first.

---

## Scriptures Format

1. **Extract all scripture references** mentioned in the sermon content.
2. **Fetch the full text**: Do NOT use the partial text or summary found in the content/notes. You must look up the actual full verse text (NKJV preferred) based on the reference.
3. Use the format below:

```typescript
scriptures: [
  {
    verse: 'John 3:16', // The reference found in content
    // The ACTUAL full text looked up separately, NOT just what was in the notes
    text: 'For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life.'
  },
  {
    verse: 'Romans 8:28',
    text: 'And we know that all things work together for good to those who love God, to those who are the called according to His purpose.'
  }
]
```

**Tips:**
- Use NKJV translation for consistency
- Include the full verse text
- Order scriptures as they appear in the sermon

---

## Description Format

Use template literals for multi-line descriptions:

```typescript
description: `SERMON TITLE

Main Scripture Reference

---

SECTION HEADING

Content here...

---

ANOTHER SECTION

More content...

---

CONCLUSION

Final thoughts and application...`,
```

**Formatting conventions:**
- Use `---` for section dividers
- Use ALL CAPS for main headings
- Use numbered lists: `1.`, `2.`, `3.`
- Use lettered lists: `a.`, `b.`, `c.`
- Include scripture references inline: `(John 3:16)`
- Use quotes for scripture: `"Scripture text here." (Reference)`

**Bold formatting for points:**
Use `**text**` markdown syntax to bold point markers that structure the sermon:
- Section headers/titles: `**SERMON TITLE**`, `**MAIN SECTION**`
- Numbered points: `**1. FIRST POINT**`, `**2. SECOND POINT**`
- Lettered points: `**a.** Point text`, `**(a)** Point text`
- Parenthetical numbers: `**(1)**`, `**(2)**`
- Key headings with colons: `**CONCLUSION:**`, `**APPLICATION:**`

Examples:
```
**1. Called for Greatness** (Genesis 12:1-3)
**a. Burnout disguised as faithfulness**
**(1)** We must sensitively desist...
**FIRST:** GROWS OUT OF BEING DELIVERED
```

**STRICT RULE:** Do NOT add any words, transitional phrases, or filler text to the content. The `description` must strictly follow the provided sermon notes without additions or embellishments. Only format the existing text.

---

## Template

Copy and paste this template:

```typescript
{
  id: 'NEXT_ID',
  title: 'SERMON TITLE',
  speaker: 'Ptr. Speaker Name',
  speakerRole: 'senior pastor',
  date: 'YYYY-MM-DD',
  duration: '45 min',
  series: 'Series Name',
  seriesDescription: 'Description of the series.',
  excerpt: 'Brief 1-2 sentence summary of the sermon.',
  description: `**SERMON TITLE**

Main Scripture Reference

---

**MAIN POINT 1**

Content...

---

**MAIN POINT 2**

Content...

---

**CONCLUSION**

Application...`,
  tags: ['Tag1', 'Tag2', 'Tag3'],
  image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg',
  scriptures: [
    {
      verse: 'Book Chapter:Verse',
      text: 'Full scripture text here.'
    }
  ],
  keyPoints: [
    'First key point',
    'Second key point',
    'Third key point'
  ],
  relatedSermons: ['1', '2'],
},
```

---

## Checklist

Before committing a new sermon:

- [ ] `id` is unique and incremented from the last sermon
- [ ] `date` is in `YYYY-MM-DD` format
- [ ] `excerpt` is concise (1-2 sentences)
- [ ] `tags` are relevant and properly capitalized
- [ ] `scriptures` have both `verse` and `text` fields
- [ ] `keyPoints` summarize main takeaways
- [ ] `relatedSermons` contain valid existing sermon IDs
- [ ] Only ONE sermon has `isFeatured: true` (update previous if needed)
- [ ] No trailing commas causing syntax errors
- [ ] Template literals use backticks (`` ` ``) not quotes
- [ ] Point markers are bolded using `**text**` markdown syntax
- [ ] **Content fidelity**: no words added, rewritten, summarized, or paraphrased in `description`, `sections[].paragraphs`, `sections[].callout`, `blessings[].text`, `keyTakeaways[]`, or `scriptureGroups[].text` — only the pastor's original words appear, with markdown formatting only

---

## Current Series

| Series Name | Description |
|-------------|-------------|
| Faith Foundation | Building a strong foundation of faith through biblical teaching and practical application. |
| Covenant | Understanding the covenant relationship between God and His people. |

When adding a new series, be consistent with `series` and `seriesDescription` across all sermons in that series.

---

## Helper Functions

Available functions in `sermons.ts`:

```typescript
getSermonById(id: string)        // Get single sermon by ID
getRelatedSermons(sermonId: string)  // Get related sermons
getFeaturedSermon()              // Get the featured sermon
getSermonsBySeries(series: string)   // Get all sermons in a series
getAllSeries()                   // Get list of all series names
```
