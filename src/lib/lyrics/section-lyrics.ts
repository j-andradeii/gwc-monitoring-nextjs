/**
 * Lyric sectioning heuristic.
 *
 * LRCLIB returns raw `plainLyrics` with NO section labels (no "Verse 1 / Chorus").
 * This module infers MultiTracks-style sections so they can be displayed, edited,
 * and exported to ProPresenter as named slide groups.
 *
 * Two strategies, auto-selected:
 *  1. Explicit headers — if the text already contains lines like "[Verse 1]",
 *     "Chorus:", "(Bridge)", we trust and normalise them. This is also how the
 *     PrimeReact editor's (possibly edited) text round-trips back into sections.
 *  2. Heuristic — otherwise, split on blank lines into stanzas; an identical
 *     repeated stanza becomes the Chorus, the remaining stanzas become Verse 1/2/3.
 *
 * The label vocabulary ({@link CanonicalLabels}) is a parameter, so the UI can let
 * users add/rename/remove mappings (e.g. "v" → "Verse", or rename "chorus" output).
 * Nothing here is perfect by design — the editor is the human-in-the-loop fixup.
 */

export interface LyricSection {
  /** Display label, e.g. "Verse 1", "Chorus", "Bridge". */
  label: string;
  /** Lyric lines for the section (never blank). */
  lines: string[];
}

/** Map of normalised keyword (lowercased, de-spaced, `[a-z-]`) → display label. */
export type CanonicalLabels = Record<string, string>;

/**
 * Default section-label vocabulary keyed by a normalised keyword. Editable at
 * runtime via the Lyric Formatter settings modal. The `verse` / `chorus` / `bridge`
 * entries double as the names the heuristic emits, so renaming them flows through
 * to both header detection and auto-sectioning.
 */
export const DEFAULT_CANONICAL_LABELS: CanonicalLabels = {
  intro: 'Intro',
  verse: 'Verse',
  prechorus: 'Pre-Chorus',
  'pre-chorus': 'Pre-Chorus',
  postchorus: 'Post-Chorus',
  'post-chorus': 'Post-Chorus',
  chorus: 'Chorus',
  refrain: 'Refrain',
  bridge: 'Bridge',
  interlude: 'Interlude',
  instrumental: 'Instrumental',
  hook: 'Hook',
  vamp: 'Vamp',
  tag: 'Tag',
  outro: 'Outro',
  ending: 'Ending',
  coda: 'Coda',
  breakdown: 'Breakdown',
  turnaround: 'Turnaround',
};

/** Normalise a user/lyric keyword to the lookup form used by {@link CanonicalLabels}. */
export function normalizeLabelKey(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z-]/g, '');
}

/**
 * If `rawLine` looks like a section header (e.g. "[Verse 1]", "Chorus:", "Bridge"),
 * return the normalised label ("Verse 1", "Chorus", "Bridge"); otherwise null.
 */
export function detectSectionHeader(
  rawLine: string,
  labels: CanonicalLabels = DEFAULT_CANONICAL_LABELS,
): string | null {
  const line = rawLine.trim();
  // Headers are short single tokens — a guard against matching real lyric lines.
  if (!line || line.length > 28) return null;

  // Strip wrapping brackets/parens and any trailing punctuation.
  const inner = line
    .replace(/^[[({]+\s*/, '')
    .replace(/\s*[\])}]+$/, '')
    .replace(/[:.\-–—]+\s*$/, '')
    .trim();

  // "<word(s)> <optional number>" — a trailing repeat count like "x2" is ignored.
  const match = inner.match(/^([A-Za-z][A-Za-z\- ]*?)\s*(\d+)?\s*(?:x\s*\d+)?$/i);
  if (!match) return null;

  const key = normalizeLabelKey(match[1]);
  const canonical = labels[key] ?? labels[key.replace(/-/g, '')];
  if (!canonical) return null;

  const number = match[2];
  return number ? `${canonical} ${number}` : canonical;
}

/** Build sections from text that already contains explicit headers. */
function sectionByExplicitHeaders(
  rawLines: string[],
  labels: CanonicalLabels,
): LyricSection[] {
  const introLabel = labels.intro ?? 'Intro';
  const verseLabel = labels.verse ?? 'Verse';
  const sections: LyricSection[] = [];
  let current: LyricSection | null = null;
  const preface: string[] = [];

  for (const raw of rawLines) {
    const header = detectSectionHeader(raw, labels);
    if (header) {
      // Lines that appeared before the very first header become an "Intro".
      if (!current && preface.length) {
        sections.push({ label: introLabel, lines: [...preface] });
        preface.length = 0;
      }
      current = { label: header, lines: [] };
      sections.push(current);
      continue;
    }

    const line = raw.trim();
    if (!line) continue; // blank lines are separators, not content
    if (current) current.lines.push(line);
    else preface.push(line);
  }

  if (!current && preface.length) {
    sections.push({ label: `${verseLabel} 1`, lines: preface });
  }

  return sections.filter((section) => section.lines.length > 0);
}

/** Normalised signature of a stanza, for repeat detection. */
function stanzaSignature(lines: string[]): string {
  return lines
    .join('\n')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Build sections by stanza splitting + repeated-block detection. */
function sectionByHeuristic(
  text: string,
  labels: CanonicalLabels,
): LyricSection[] {
  const verseLabel = labels.verse ?? 'Verse';
  const chorusLabel = labels.chorus ?? 'Chorus';
  const bridgeLabel = labels.bridge ?? 'Bridge';

  const stanzas = text
    .split(/\n[ \t]*\n+/)
    .map((block) =>
      block
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
    )
    .filter((block) => block.length > 0);

  if (stanzas.length === 0) return [];

  // No stanza breaks at all: chunk into ~4-line verses so slides stay readable.
  if (stanzas.length === 1) {
    const lines = stanzas[0];
    if (lines.length <= 6) return [{ label: `${verseLabel} 1`, lines }];
    const chunked: LyricSection[] = [];
    let verse = 1;
    for (let i = 0; i < lines.length; i += 4) {
      chunked.push({ label: `${verseLabel} ${verse}`, lines: lines.slice(i, i + 4) });
      verse += 1;
    }
    return chunked;
  }

  const signatures = stanzas.map(stanzaSignature);
  const counts = new Map<string, number>();
  for (const sig of signatures) counts.set(sig, (counts.get(sig) ?? 0) + 1);

  // Name repeated stanzas in order of first appearance: Chorus, then Bridge, ...
  const repeatNames = [chorusLabel, bridgeLabel];
  const repeatedLabels = new Map<string, string>();
  for (const sig of signatures) {
    if ((counts.get(sig) ?? 0) >= 2 && !repeatedLabels.has(sig)) {
      const index = repeatedLabels.size;
      repeatedLabels.set(
        sig,
        index < repeatNames.length ? repeatNames[index] : `${chorusLabel} ${index}`,
      );
    }
  }

  let verseNumber = 0;
  return stanzas.map((lines, index) => {
    const sig = signatures[index];
    const repeated = repeatedLabels.get(sig);
    if (repeated) return { label: repeated, lines };
    verseNumber += 1;
    return { label: `${verseLabel} ${verseNumber}`, lines };
  });
}

/**
 * Split lyrics into labelled sections. Used both for the initial sectioning of
 * LRCLIB `plainLyrics` and for re-parsing the (edited) editor text on export.
 */
export function sectionLyrics(
  plainLyrics: string,
  labels: CanonicalLabels = DEFAULT_CANONICAL_LABELS,
): LyricSection[] {
  const text = (plainLyrics || '')
    .replace(/\r\n?/g, '\n')
    .replace(/ /g, ' ')
    .trim();
  if (!text) return [];

  const rawLines = text.split('\n');
  const hasExplicitHeaders = rawLines.some(
    (line) => detectSectionHeader(line, labels) !== null,
  );

  return hasExplicitHeaders
    ? sectionByExplicitHeaders(rawLines, labels)
    : sectionByHeuristic(text, labels);
}

/**
 * Render sections back to a plain-text block with labels — the inverse of
 * {@link sectionLyrics}. Feeds the editor (as the source for its HTML) and the
 * "Copy" action.
 */
export function formatSections(sections: LyricSection[]): string {
  return sections
    .map((section) => [section.label, ...section.lines].join('\n'))
    .join('\n\n');
}

/**
 * Split a section's lines into slide-sized groups of `linesPerSlide`, sensibly:
 * never strand a lone trailing line — if exactly one line would be left over it is
 * kept with the previous group, so an odd-length section ends with a fuller group.
 * Examples (target 2): 4→[2,2], 5→[2,3], 3→[3], 6→[2,2,2], 7→[2,2,3].
 *
 * Shared by the editor preview and the ProPresenter exporter so they always match.
 */
export function chunkLines(lines: string[], linesPerSlide: number): string[][] {
  const target = Math.max(1, Math.floor(linesPerSlide));
  if (lines.length <= target) return [lines];
  const chunks: string[][] = [];
  let i = 0;
  while (i < lines.length) {
    const remaining = lines.length - i;
    const take = remaining === target + 1 ? remaining : target;
    chunks.push(lines.slice(i, i + take));
    i += take;
  }
  return chunks;
}

/**
 * Render sections to plain text with each section's lines grouped into
 * `linesPerSlide`-line slide groups (a blank line between groups). This is what the
 * editor shows, so the on-screen preview matches the exported slides one-to-one.
 * {@link sectionLyrics} re-parses it cleanly — blank lines are ignored; labels
 * define sections; the exporter re-derives the same groups via {@link chunkLines}.
 */
export function formatSectionsForEditor(
  sections: LyricSection[],
  linesPerSlide: number,
): string {
  return sections
    .map((section) => {
      const body = chunkLines(section.lines, linesPerSlide)
        .map((group) => group.join('\n'))
        .join('\n\n');
      return body ? `${section.label}\n${body}` : section.label;
    })
    .join('\n\n');
}
