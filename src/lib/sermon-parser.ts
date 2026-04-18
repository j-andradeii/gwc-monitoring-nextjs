/**
 * Sermon Parser Utilities
 *
 * Pure server-safe functions for parsing sermon content.
 * No Next.js dependencies — usable on server and client.
 */

export interface ParsedSection {
  id: string;
  kicker?: string;
  title: string;
  paragraphs: string[];
}

const BOOK_BADGES: Record<string, string> = {
  genesis: 'GE',
  exodus: 'EX',
  leviticus: 'LV',
  numbers: 'NU',
  deuteronomy: 'DT',
  joshua: 'JS',
  judges: 'JG',
  ruth: 'RU',
  '1 samuel': '1S',
  '2 samuel': '2S',
  '1 kings': '1K',
  '2 kings': '2K',
  '1 chronicles': '1C',
  '2 chronicles': '2C',
  ezra: 'EZ',
  nehemiah: 'NE',
  esther: 'ES',
  job: 'JB',
  psalm: 'PS',
  psalms: 'PS',
  proverbs: 'PR',
  ecclesiastes: 'EC',
  'song of solomon': 'SS',
  isaiah: 'IS',
  jeremiah: 'JR',
  lamentations: 'LA',
  ezekiel: 'EK',
  daniel: 'DA',
  hosea: 'HO',
  joel: 'JL',
  amos: 'AM',
  obadiah: 'OB',
  jonah: 'JN',
  micah: 'MI',
  nahum: 'NA',
  habakkuk: 'HA',
  zephaniah: 'ZP',
  haggai: 'HG',
  zechariah: 'ZC',
  malachi: 'ML',
  matthew: 'MT',
  mark: 'MK',
  luke: 'LK',
  john: 'JO',
  acts: 'AC',
  romans: 'RO',
  '1 corinthians': '1C',
  '2 corinthians': '2C',
  galatians: 'GA',
  ephesians: 'EP',
  philippians: 'PH',
  colossians: 'CO',
  '1 thessalonians': '1T',
  '2 thessalonians': '2T',
  '1 timothy': '1T',
  '2 timothy': '2T',
  titus: 'TI',
  philemon: 'PM',
  hebrews: 'HE',
  james: 'JA',
  '1 peter': '1P',
  '2 peter': '2P',
  '1 john': '1J',
  '2 john': '2J',
  '3 john': '3J',
  jude: 'JD',
  revelation: 'RV',
};

/**
 * Derive a 2-letter uppercase book code from a verse reference string.
 * e.g. "Matthew 18:20" → "MT", "Nehemiah 8:5–6" → "NE", "1 Corinthians 10:7" → "1C"
 */
export function deriveBookBadge(verse: string): string {
  const lower = verse.trim().toLowerCase();

  // Try numbered book prefixes first (e.g. "1 corinthians")
  const numberedMatch = lower.match(/^(\d)\s+([a-z]+)/);
  if (numberedMatch) {
    const key = `${numberedMatch[1]} ${numberedMatch[2]}`;
    if (BOOK_BADGES[key]) return BOOK_BADGES[key];
  }

  // Try multi-word book names (e.g. "song of solomon")
  for (const [bookKey, badge] of Object.entries(BOOK_BADGES)) {
    if (lower.startsWith(bookKey)) return badge;
  }

  // Fallback: first 2 letters of the first word, uppercased
  const firstWord = lower.split(/[\s\d]/)[0] || 'UN';
  return firstWord.slice(0, 2).toUpperCase();
}

/**
 * Estimate reading time in minutes from raw text (200 wpm, minimum 1 min).
 */
export function estimateReadingMinutes(text: string): number {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Slugify a section title for use as an anchor ID.
 * Falls back to "sec-{index}" if title is empty.
 */
export function slugifySectionId(title: string, index: number): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return slug ? `sec-${slug}` : `sec-${index}`;
}

/**
 * Parse legacy description markdown into structured sections.
 *
 * The description format uses **bold** headings (possibly with letters like **a. Heading**)
 * followed by paragraph text. Each bold heading starts a new section.
 */
export function parseSermonSections(description?: string): ParsedSection[] {
  if (!description) return [];

  const lines = description.split('\n');
  const sections: ParsedSection[] = [];
  const usedIds = new Set<string>();
  let current: ParsedSection | null = null;
  let paraBuffer: string[] = [];

  const flushPara = () => {
    if (current && paraBuffer.length > 0) {
      const para = paraBuffer.join(' ').trim();
      if (para) current.paragraphs.push(para);
      paraBuffer = [];
    }
  };

  const uniqueId = (baseId: string): string => {
    if (!usedIds.has(baseId)) {
      usedIds.add(baseId);
      return baseId;
    }
    let n = 2;
    while (usedIds.has(`${baseId}-${n}`)) n++;
    const id = `${baseId}-${n}`;
    usedIds.add(id);
    return id;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // Detect bold heading lines: **something** or **a. something** or **(1)** etc.
    const headingMatch = line.match(/^\*\*([^*]+)\*\*\s*$/);
    if (headingMatch) {
      flushPara();
      if (current) {
        sections.push(current);
      }
      const headingText = headingMatch[1].trim();
      // Strip leading letter/number prefixes like "a. " or "(1) "
      const cleanTitle = headingText
        .replace(/^[a-z]\.\s*/i, '')
        .replace(/^\(\d+\)\s*/, '')
        .replace(/^\d+\.\s*/, '');
      current = {
        id: uniqueId(slugifySectionId(cleanTitle, sections.length)),
        title: cleanTitle || headingText,
        paragraphs: [],
      };
      continue;
    }

    // Separator lines — start a new implicit section if we have content
    if (line === '---') {
      flushPara();
      continue;
    }

    // Empty lines flush current paragraph buffer
    if (line === '') {
      flushPara();
      continue;
    }

    // Content lines — accumulate into paragraph buffer
    if (current) {
      paraBuffer.push(line);
    } else {
      // Content before any heading — create an implicit intro section
      current = {
        id: uniqueId('sec-intro'),
        title: 'Introduction',
        paragraphs: [],
      };
      paraBuffer.push(line);
    }
  }

  flushPara();
  if (current) {
    sections.push(current);
  }

  // Filter out sections with no meaningful paragraphs and no title
  return sections.filter(
    (s) => s.title || s.paragraphs.some((p) => p.length > 0)
  );
}
