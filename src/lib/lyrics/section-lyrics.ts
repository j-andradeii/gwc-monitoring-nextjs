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
  prechorus: 'PreChorus',
  'pre-chorus': 'PreChorus',
  postchorus: 'PostChorus',
  'post-chorus': 'PostChorus',
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

/**
 * Strip parenthetical ad-libs / backing-vocal asides from lyrics — e.g.
 * "…is my strength (it's more than a feeling)" → "…is my strength" — so the slides
 * show only the lead line. A `(…)` whose content is a real section marker (e.g.
 * "(Chorus)", "(Bridge)") is KEPT so header detection still works. A line that was
 * ONLY an aside is dropped; genuinely blank lines (stanza separators) are preserved.
 */
export function stripAdLibs(
  text: string,
  labels: CanonicalLabels = DEFAULT_CANONICAL_LABELS,
): string {
  return (text || '')
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((rawLine) => {
      const hadContent = rawLine.trim().length > 0;
      const cleaned = rawLine
        // Remove each "(…)" aside — unless its content is itself a section marker.
        .replace(/\(([^)]*)\)/g, (match: string, inner: string) =>
          detectSectionHeader(inner.trim(), labels) ? match : ' ',
        )
        .replace(/[ \t]{2,}/g, ' ') // collapse the gaps left behind
        .replace(/\s+([,.;!?])/g, '$1') // tidy any space stranded before punctuation
        .trim();
      return { hadContent, cleaned };
    })
    // Drop lines that were purely an aside (had content, now empty); keep real blanks.
    .filter((line) => line.cleaned.length > 0 || !line.hadContent)
    .map((line) => line.cleaned)
    .join('\n');
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
 * Split a section's lines into slide-sized groups of AT MOST `linesPerSlide` lines.
 * The delimiter is a HARD maximum — no group ever exceeds it; a leftover line simply
 * becomes its own final slide (we do NOT merge it up into a fuller group).
 * Examples (target 2): 4→[2,2], 5→[2,2,1], 3→[2,1], 6→[2,2,2], 7→[2,2,2,1].
 *
 * Superseded by {@link buildSlides} for the editor preview + ProPresenter exporter
 * (which also apply "smart long-line handling" — see below), but kept exported for
 * any other caller that only needs the plain length-based grouping.
 */
export function chunkLines(lines: string[], linesPerSlide: number): string[][] {
  const target = Math.max(1, Math.floor(linesPerSlide));
  if (lines.length <= target) return [lines];
  const chunks: string[][] = [];
  for (let i = 0; i < lines.length; i += target) {
    chunks.push(lines.slice(i, i + target));
  }
  return chunks;
}

/**
 * Smart long-line slide layout. Delimiter is `linesPerSlide`, with two additions:
 *
 *  - Rule 1 (de-pair): a line whose length is >= `maxCharsPerLine` gets its OWN
 *    slide — it never shares a slide with another line. Only lines SHORTER than the
 *    threshold pack together, up to `linesPerSlide` per slide. This is a fixed
 *    point: re-running it on the same lines always yields the same slide count/
 *    grouping, so it's safe to show in the editor preview.
 *  - Rule 2 (wrap): when `wrapLongLines` is true, a long line's single slide gets up
 *    to 2 DISPLAY ROWS (for on-screen/projected readability) via {@link lineToRows} —
 *    a Gemini break hint if one matches, else the deterministic {@link splitLongLine}.
 *    This does NOT change slide count/grouping — only how many rows render inside
 *    that one slide — so it's safe to apply ONLY at ProPresenter export time without
 *    diverging from the editor preview (see the fixed-point note on
 *    {@link formatSectionsForEditor} and `buildProPresenterFile`).
 */
export interface SlideLayoutOptions {
  linesPerSlide: number;
  /** De-pair threshold (rule 1). Default {@link DEFAULT_MAX_CHARS_PER_LINE}. */
  maxCharsPerLine?: number;
  /** Split an overlong line into 2 rows (rule 2). Default false. */
  wrapLongLines?: boolean;
  /** Normalized line -> [rowA, rowB] break hints, e.g. from Gemini. */
  breakHints?: Record<string, string[]>;
}

export const DEFAULT_MAX_CHARS_PER_LINE = 30;

/** Normalized key to match a line to a Gemini break hint (whitespace-insensitive). */
export function lineHintKey(line: string): string {
  return line.toLowerCase().replace(/\s+/g, ' ').trim();
}

/** Candidate break points, tried in priority order, for {@link splitLongLine}. */
const PUNCTUATION_BREAK = /[,;:]|(?:\s-\s|\s–\s|\s—\s)/g;
const CONJUNCTION_BREAK = /\s(?:and|but|for|yet|so|when|while|because)\s/gi;

/**
 * Deterministic Rule-2 fallback: split an overly-long line into two display rows at
 * a natural break point nearest the middle. Returns 1 row (unchanged) if the line is
 * short enough or no acceptable break point exists.
 */
export function splitLongLine(line: string, maxCharsPerLine: number): string[] {
  const text = line.trim();
  const wrapWidth = Math.max(40, maxCharsPerLine * 2);
  if (text.length <= wrapWidth) return [text];

  const minPos = text.length * 0.3;
  const maxPos = text.length * 0.7;
  const midPos = text.length / 2;

  let bestPos = -1;
  let bestDistance = Infinity;

  const consider = (pos: number) => {
    if (pos < minPos || pos > maxPos) return;
    const distance = Math.abs(pos - midPos);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestPos = pos;
    }
  };

  // Prefer a comma/semicolon/colon/dash — split right AFTER the punctuation.
  for (const match of text.matchAll(PUNCTUATION_BREAK)) {
    consider((match.index ?? 0) + match[0].length);
  }

  // Fallback: before a conjunction word.
  if (bestPos === -1) {
    for (const match of text.matchAll(CONJUNCTION_BREAK)) {
      consider((match.index ?? 0) + 1);
    }
  }

  // Last resort: the space closest to the midpoint.
  if (bestPos === -1) {
    for (let i = 0; i < text.length; i += 1) {
      if (text[i] === ' ') consider(i);
    }
  }

  if (bestPos === -1) return [text];

  const rows = [text.slice(0, bestPos).trim(), text.slice(bestPos).trim()].filter(Boolean);
  return rows.length === 2 ? rows : [text];
}

/** Rows to render for one line's slide — whole (editor) or wrapped (export). */
function lineToRows(line: string, options: SlideLayoutOptions): string[] {
  const trimmed = line.trim();
  if (!options.wrapLongLines) return [trimmed]; // editor/preview: keep whole (fixed point)

  const hint = options.breakHints?.[lineHintKey(trimmed)];
  if (hint && hint.length >= 2) {
    const rows = hint.map((row) => row.trim()).filter(Boolean);
    if (rows.length >= 2) return rows;
  }

  return splitLongLine(trimmed, options.maxCharsPerLine ?? DEFAULT_MAX_CHARS_PER_LINE);
}

/**
 * Build slide-sized row groups from a section's lines, applying smart long-line
 * handling (rules 1 + 2 above). Each returned inner array is one slide's display
 * rows. Shared by the editor preview and the ProPresenter exporter.
 */
export function buildSlides(lines: string[], options: SlideLayoutOptions): string[][] {
  const target = Math.max(1, Math.floor(options.linesPerSlide));
  const maxChars = options.maxCharsPerLine ?? DEFAULT_MAX_CHARS_PER_LINE;
  const cleaned = lines.map((line) => line.trim()).filter(Boolean);

  const slides: string[][] = [];
  let buffer: string[] = [];
  const flush = () => {
    if (buffer.length) {
      slides.push(buffer);
      buffer = [];
    }
  };

  for (const line of cleaned) {
    if (line.length >= maxChars) {
      // Rule 1: a long line always gets its own slide — never shares with another.
      flush();
      slides.push(lineToRows(line, options));
    } else {
      buffer.push(line);
      if (buffer.length >= target) flush();
    }
  }
  flush();

  return slides;
}

/**
 * Render sections to plain text with each section's lines grouped into slides via
 * {@link buildSlides} (a blank line between slides). This is what the editor shows,
 * so the on-screen preview matches the exported slide COUNT/grouping one-to-one.
 *
 * FIXED-POINT NOTE: `wrapLongLines` is forced OFF here (and in the editor's HTML
 * builder) because `handleDownloadPro` re-parses this rendered text back through
 * {@link sectionLyrics} to re-derive sections/grouping on export. If a long line's
 * wrapped rows were written here as separate lines, that re-parse would re-group
 * them and the exported slide count would diverge from what the editor showed. Rule
 * 1 (de-pair) IS a fixed point (same lines in -> same grouping out), so it's safe to
 * apply here; Rule 2 (wrap) is intentionally export-only — see `buildProPresenterFile`.
 */
export function formatSectionsForEditor(
  sections: LyricSection[],
  options: SlideLayoutOptions,
): string {
  return sections
    .map((section) => {
      const body = buildSlides(section.lines, { ...options, wrapLongLines: false })
        .map((rows) => rows.join('\n'))
        .join('\n\n');
      return body ? `${section.label}\n${body}` : section.label;
    })
    .join('\n\n');
}
