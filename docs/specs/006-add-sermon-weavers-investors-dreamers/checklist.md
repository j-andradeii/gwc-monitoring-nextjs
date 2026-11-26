# Checklist: Add sermon "Wanted: Weavers, Investors, and Dreamers"

**Spec**: [spec.md](spec.md) · **Run**: 2026-11-27 07:25 · **Pre-run HEAD**: `417a8f5` · **Status**: Implemented

Pre-run `git status --short`: clean.

Format: `- [ ] ID [FR-00n] description — path · verified by <test path | check | manual — what to check>`

## Implementation
- [x] T001 [FR-001, FR-002, FR-003, FR-004, FR-006] append sermon id `'46'` — `src/data/sermons.ts` · verified by diff vs source + tsc
- [x] T002 [FR-005] `isFeatured` false on id `'45'`, true on id `'46'` — `src/data/sermons.ts` · verified by `grep -c "isFeatured: true"` = 1
- [x] T003 current highest id / featured id updated to `'46'` — `docs/skills/adding-sermons/SKILL.md` · verified by reading
- [x] T004 specs index row — `docs/specs/README.md` · verified by reading

## Verification
- [x] V001 `pnpm run lint` exits 0
- [x] V002 `npx tsc --noEmit` exits 0
- [x] V003 `pnpm run build` exits 0 and lists `/sermon-notes/wanted-weavers-investors-and-dreamers`
- [x] V004 `adding-sermons` "Checklist before shipping" run against the diff
- [x] V005 `docs/skills/` and `CLAUDE.md` still true
- [x] V006 UI: `n/a — no UI change` (data only; page layout unchanged)

## Manual checks
- [ ] M001 Owner opens `/sermon-notes/wanted-weavers-investors-and-dreamers` after deploy: hero image, sections 01–03, takeaways, scripture tab render

## Evidence (after the last edit, 2026-11-27)
- V001 `pnpm run lint` (via `npx pnpm@9`, `pnpm` isn't on PATH) exit 0: 31 warnings, 0 errors. All pre-existing, since
  the only `src/` change is data.
- V002 `npx tsc --noEmit` exit 0.
- V003 `pnpm run build` exit 0. `/sermon-notes/[slug]` shows 3 paths + 43 more = 46 sermons, and
  `.next/server/app/sermon-notes/wanted-weavers-investors-and-dreamers.html` exists. It contains the Weavers callout
  text.
- V004 adding-sermons checklist:
  - Content fidelity: a script compared every `sections` / `callout` / `keyTakeaways` / `keyPoints` string and
    every `description` line with the pasted notes (markdown removed, whitespace collapsed). Nothing is missing
    except the `---` dividers.
  - Scripture: 2 Corinthians 4:13–18 NKJV copied from Bible Gateway (NKJV), with the cross-reference markers removed.
  - `uniq -d` over ids/slugs: empty. `isFeatured: true` count = 1 (id `'46'`).
  - No `videoUrl` (no link given). `relatedSermons` `'45'` and `'42'` exist. `date` `2026-11-22`.
- V005: the skill's "currently `'45'`" lines are updated to `'46'`. `CLAUDE.md` says "32 warnings pre-exist"; lint
  now reports 31. That was already true before this change (spec 005 recorded 31), so it is noted here and not
  edited.

## Gap list
None. M001 is open for the owner.
