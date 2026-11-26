# Feature Specification: Add sermon "Wanted: Weavers, Investors, and Dreamers"

**Issue**: none · **Branch**: `MIGRATION-TO-TANSTACK` · **Created**: 2026-11-27 · **Status**: Implemented

## Overview

Adds sermon id `'46'` to `src/data/sermons.ts`, built from the owner's pasted notes in the Modern Reader layout:
an unnumbered Introduction, three numbered points (Weavers, Investors, Dreamers), an unnumbered Call to Action,
key takeaways, and NKJV scripture for 2 Corinthians 4:13–18. This publishes
`/sermon-notes/wanted-weavers-investors-and-dreamers`. It is the newest sermon, so the featured flag moves to it
from id `'45'`.

## Source (verbatim)

> in src/data/sermons.ts add this new sermon: [pasted sermon notes: "Wanted: Weavers, Investors, and Dreamers
> (Living with Gratitude, Purpose, and Eternity in View)", Key Text: 2 Corinthians 4:13–18, Introduction, points
> 1–3, Key Takeaways, closing quote, Call to Action]; sermon title: Wanted: Weavers, Investors, and Dreamers;
> speaker: 'Ptr. Jim Baloran', speakerRole: 'senior pastor', date: '2026-11-22' image:
> https://gtxngthtpisigkys.public.blob.vercel-storage.com/sermon/wanted_dreamers_weavers_investors.webp; series:
> 'Vision'; use @src/data/ADDING_SERMONS.md

## User Scenarios & Acceptance

### Story 1 — Read the new sermon (Priority: P1)
1. **Given** the site is built, **When** a visitor opens `/sermon-notes/wanted-weavers-investors-and-dreamers`,
   **Then** they see the title, the speaker, 2026-11-22, the key verse `2 Corinthians 4:13–18`, the Introduction,
   points 01–03, the Call to Action, the key takeaways and the scripture tab.
2. **Given** the sermon list `/sermon-notes`, **When** it loads, **Then** the new sermon is listed, and it is the
   featured sermon.

## Requirements

- **FR-001** Append a sermon with `id: '46'`, `slug: 'wanted-weavers-investors-and-dreamers'`, `title: 'Wanted: Weavers, Investors, and Dreamers'`, `speaker: 'Ptr. Jim Baloran'`, `speakerRole: 'senior pastor'`, `date: '2026-11-22'`, `series: 'Vision'`, and the given `image` URL.
- **FR-002** `seriesDescription` copied verbatim from the existing Vision sermons. — derived
- **FR-003** Content fields (`description`, `sections`, `callout`, `keyTakeaways`, `excerpt`) use only the pastor's words, with markdown formatting only.
- **FR-004** `scriptures` / `scriptureGroups` hold the NKJV text of 2 Corinthians 4:13–14, 4:15 and 4:16–18, looked up (Bible Gateway, NKJV).
- **FR-005** `isFeatured: true` moves from id `'45'` to id `'46'`; exactly one featured sermon. — derived (newest sermon has carried the flag)
- **FR-006** No `videoUrl` (no link given); no `subtitle`, `seriesNumber` or `blessings` (the source doesn't have them).

## Edge Cases

- Apostrophes and quotes in the text break single-quoted strings → strings with `'` use double quotes or backticks; checked by `npx tsc --noEmit`.
- Duplicate id/slug → `grep -oE "^    (id|slug): '[^']+'" src/data/sermons.ts | sort | uniq -d` is empty.
- More than one featured sermon → `grep -c "isFeatured: true"` is `1`.

## Rules & skills check

- Skills read: `adding-sermons` (+ `src/data/ADDING_SERMONS.md`). Data-only change, no code, so `coding-style` doesn't apply.
- Sermon content rule: no added, reworded or summarised text. How each source part maps to fields:
  - The parenthetical subtitle and Key Text become the first Introduction paragraphs (same as id `'45'`).
  - Each point's closing one-line maxim becomes that section's `callout` (same as id `'45'`).
  - The closing quote after the takeaways becomes the Call to Action `callout` (same as id `'45'`).
  - The standalone line after point 3 ("God is renewing us day by day…") is the last paragraph of the Dreamers section. It renders before that section's callout.
- Kickers `Weavers` / `Investors` / `Dreamers` and the titles come from the source headings, split at the colon.
- Skills to update: `adding-sermons` SKILL.md names the current highest id (`'45'`) and the featured id. Both become `'46'`.

## Out of Scope

- Uploading the image (the owner gave a Blob URL that already exists).
- Any change to the sermon page layout.

## Success Criteria

- SC-001 `pnpm run lint` · SC-002 `npx tsc --noEmit` · SC-003 `pnpm run build` exit 0
- SC-004 every FR built and verified
- SC-005 the build pre-renders `/sermon-notes/wanted-weavers-investors-and-dreamers`

## Assumptions & Open Questions

- Speaker is `Ptr. Jim Baloran` as the owner specified (the notes say "Ptr. Jimanuel Baloran").
- `duration: '45 min'` is the template default (not given).
- `relatedSermons: ['45', '42']`: the two most recent Ptr. Jim Baloran Vision sermons.
