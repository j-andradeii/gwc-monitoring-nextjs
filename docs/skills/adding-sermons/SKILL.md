---
name: adding-sermons
description: |
  Adding, editing or migrating a sermon entry in src/data/sermons.ts (the Sermon interface, id and slug,
  required fields, Modern Reader fields: sections, subItems, blessings, keyTakeaways, scriptureGroups), with
  the strict content rule (the pastor's words only), full NKJV scripture text, the YouTube videoUrl rule,
  the single isFeatured flag, and how the sermon reaches the detail page, the sitemap and static params.
  The full field reference is src/data/ADDING_SERMONS.md.

  Use when: the owner pastes sermon notes, a transcript, a title, a YouTube link or an image URL for a sermon;
  adding a sermon; editing a sermon's content; migrating a legacy sermon to the Modern Reader layout; changing
  the featured sermon or a series name.

  Keywords: sermon, sermons.ts, ADDING_SERMONS, sermon notes, slug, series, seriesDescription, speaker,
  excerpt, description, scriptures, NKJV, keyPoints, keyTakeaways, sections, kicker, callout, unnumbered,
  subItems, blessings, scriptureGroups, subtitle, keyVerse, seriesNumber, videoUrl, YouTube, isFeatured,
  hideChurchName, relatedSermons, Modern Reader
---

# Adding sermons

Sermons are static data: one object per sermon in the `sermons` array of `src/data/sermons.ts`. Adding one
publishes `/sermon-notes/<slug>` (pre-rendered by `generateStaticParams`), adds it to `sitemap.ts`, and lists it
on `/sermon-notes`. **`src/data/ADDING_SERMONS.md` is the field-by-field reference** — read it before writing an
entry; this skill is the short version, the rules that are easy to break, and the checklist.

## Files in this skill

| File | What | Load when |
|---|---|---|
| `SKILL.md` | Rules, decision guide, drift, checklist | Always |
| `src/data/ADDING_SERMONS.md` | Interface, every field, Modern Reader fields, templates, scripture and description formats, YouTube rule | Every sermon task |

## The rules

1. **Content is the pastor's words only.** In `description`, `sections[].paragraphs`, `sections[].callout`,
   `blessings[].text`, `keyTakeaways[]` and `scriptureGroups[].text`: no added, reworded, summarised or
   "smoothed" text, no invented kickers, titles, callouts or takeaways. Allowed: split paragraphs at sentence
   boundaries, `**bold**` / `*italic*` what the source emphasised, move sentences into the right field, fix a
   typo you're certain of. A field the source doesn't support is left out. *Why:* these are a pastor's notes,
   published under his name.
2. **Scripture text is the real NKJV text, looked up — never from the notes and never from memory.** Fetch each
   reference (WebSearch / a Bible site) and copy it; keep the order the sermon cites them. If a verse can't be
   verified, stop and say so (a gap line), don't approximate. *Why:* a misquoted verse is worse than a missing one.
3. **`id` is the next number as a string** (one more than the highest `id`, currently `'45'`) and the entry is
   **appended at the end** of the array. **`slug`** is the kebab-case title, unique. *Why:* related-sermon links
   use ids; URLs use slugs; both must be unique.
4. **Required fields:** `id`, `slug`, `title`, `speaker` (with title: `'Ptr. Jim Baloran'`), `date`
   (`YYYY-MM-DD`), `duration` (`'45 min'`), `series`, `excerpt` (1–2 sentences from the source), `tags`,
   `image` (Vercel Blob URL, usually `…/sermon/<name>.webp`), `scriptures`. *Why:* the list, card, metadata
   and Open Graph tags read them.
5. **`series` / `seriesDescription` are copied verbatim from an existing sermon in that series**
   (`getSermonsBySeries`). A new series is named by the owner. *Why:* series pages group by exact string.
6. **YouTube link → `videoUrl`, pasted exactly as given, placed right after `image`.** Never convert it to an
   embed URL (`src/lib/youtube.ts` does that), never invent one, one per sermon. *Why:* the hero thumbnail plays
   it in a lightbox and the page emits `VideoObject` JSON-LD.
7. **Only one sermon has `isFeatured: true`.** Moving the flag means removing it from the current one (today:
   id `'45'`). *Why:* `getFeaturedSermon` returns the first match.
8. **Guest / missionary speakers get `hideChurchName: true`.** *Why:* drops the "· Gateway Church" suffix.
9. **Modern Reader fields are opt-in and only from source structure**: `sections` (with `unnumbered: true` on
   Introduction / Context so teaching points start at `01`), `subItems` for lettered sub-points, `callout` only
   for a marked "Key Truth" line, `scriptureGroups` with kickers matching section kickers. `subtitle`,
   `keyVerse`, `seriesNumber`, `blessings` only when the source has them. When migrating a legacy sermon keep
   `description` and `keyPoints`. *Why:* the renderer falls back gracefully; fabricated structure is fabricated
   content.
10. **Template literals (backticks) for multi-line `description`**; escape any backtick or `${` in the source.
    *Why:* a stray backtick breaks the whole data file.

## Decision guide

| Source contains | Field |
|---|---|
| Plain notes with `**Heading**` blocks | `description` (+ `keyPoints`) — the parser renders headings |
| "Introduction" + numbered points + lettered sub-points | `sections` (`unnumbered` intro) + `subItems` — ADDING_SERMONS "Sermon id 19 pattern" |
| "Key Truth:" line after a point | that section's `callout` |
| A list of blessings/promises with refs | `sections[].subItems` (inline) or top-level `blessings` (card grid) |
| Split title with an emphasised word | `subtitle: { prefix, italic, suffix }` |
| A main text | `keyVerse` |
| "Sermon 3 of the Worship series" | `seriesNumber: 3` |
| A YouTube / Shorts link | `videoUrl` |

## Where things live

| Path | What |
|---|---|
| `src/data/sermons.ts` | `Sermon` interface, `sermons` array, `getSermonById`, `getSermonBySlug`, `getRelatedSermons`, `getFeaturedSermon`, `getSermonsBySeries`, `getAllSeries` |
| `src/data/ADDING_SERMONS.md` | full reference + templates |
| `src/app/(public)/sermon-notes/[slug]/page.tsx` + `SermonDetailClient.tsx` | detail page (static params, metadata, JSON-LD) |
| `src/app/(public)/sermon-notes/page.tsx` + `SermonNotesClient.tsx` | list page |
| `src/lib/sermon-parser.ts` | `parseSermonSections` (description fallback), `deriveBookBadge`, `slugifySectionId` |
| `src/lib/youtube.ts` | `extractYouTubeId`, `isYouTubeShort`, `getYouTubeEmbedUrl` |
| `src/app/sitemap.ts` | one entry per sermon (`lastModified` = `date`) |
| `src/styles/sermon-detail.css` | detail page styles |

## Legacy and drift

- Many older sermons use `title` in ALL CAPS and only `description` + `keyPoints` → new sermons follow the owner's source casing; migrating old ones is optional and follows ADDING_SERMONS "Migrating Legacy Sermons".
- Several series share one copied `seriesDescription` ("Building a strong foundation of faith…") → copy what the series already uses; changing descriptions is the owner's call.
- `keyPoints` is legacy; prefer `keyTakeaways` for new sermons (renderer uses `keyTakeaways ?? keyPoints`).
- `videoUrl` values appear as both `https://www.youtube.com/shorts/…` and `https://youtube.com/shorts/…` → both work; keep what the owner pasted.

## Checklist before shipping

- [ ] Content fidelity: every sentence in the content fields exists in the source (diff the source against the entry)
- [ ] Every `scriptures[].text` was looked up (NKJV) — note the source checked in the spec
- [ ] `id` and `slug` unique: `grep -oE "^    (id|slug): '[^']+'" src/data/sermons.ts | sort | uniq -d` is empty
- [ ] Exactly one featured: `grep -c "isFeatured: true" src/data/sermons.ts` is `1`
- [ ] `videoUrl` present iff a link was given, pasted as-is, right after `image`
- [ ] `relatedSermons` ids exist; `date` is `YYYY-MM-DD`
- [ ] `npx tsc --noEmit` and `pnpm run build` exit 0 (build pre-renders every slug)
- [ ] Owner checks `/sermon-notes/<slug>` renders (M line) — or Claude screenshots it on a local dev server

## Related skills

- [`routing`](../routing/SKILL.md): static params, metadata, sitemap
- [`ui-ux`](../ui-ux/SKILL.md): only if the sermon page layout changes
