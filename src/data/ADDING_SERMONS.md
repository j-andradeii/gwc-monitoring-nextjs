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
| `keyPoints` | Array of strings | Main takeaways from sermon |
| `relatedSermons` | Array of sermon IDs | `['1', '5', '8']` |

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
  description: `SERMON TITLE

Main Scripture Reference

---

MAIN POINT 1

Content...

---

MAIN POINT 2

Content...

---

CONCLUSION

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
