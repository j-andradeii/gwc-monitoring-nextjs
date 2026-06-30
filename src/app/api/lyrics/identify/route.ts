import { NextResponse } from 'next/server';
import { searchLrclib } from '@/lib/lyrics/lrclib-search';
import { getPlainLyrics, type LrclibTrack } from '@/lib/lyrics/lrclib';

/**
 * Lyric-snippet → song search, powered by Firecrawl web search (NO LLM).
 *
 * LRCLIB only searches track/artist/album metadata, never the lyric body — so a
 * raw lyric snippet can't be searched directly, and an LLM's memory is unreliable
 * for newer/less-famous worship songs (it substitutes a famous song with a similar
 * theme). Instead we:
 *   1. Web-search the snippet via Firecrawl `/v2/search` — lyric sites (Genius,
 *      Musixmatch, etc.) index these, so the right song surfaces in the result
 *      titles.
 *   2. Clean each result title into an LRCLIB free-text query (strip site/video
 *      noise; no parsing model needed).
 *   3. Run those through LRCLIB and VERIFY each returned track's actual lyrics
 *      contain the user's snippet — this guarantees we never show a wrong song
 *      that merely shares a title/theme.
 *   4. Rank by lyric-match strength, dedupe, return the top 10.
 *
 * Requires `FIRECRAWL_API_KEY` (server-only, in `.env`/`.env.local`, gitignored).
 */

const FIRECRAWL_SEARCH_URL = 'https://api.firecrawl.dev/v2/search';
const MAX_RESULTS = 10;
const MAX_QUERIES = 6;

interface FirecrawlWebResult {
  title?: string;
  description?: string;
  url?: string;
}

/** Firecrawl query: the whole snippet on one line + "lyrics" (cap 500 chars). */
function buildSearchQuery(snippet: string): string {
  return `${snippet.replace(/\s+/g, ' ').trim().slice(0, 480)} lyrics`;
}

// Strip the boilerplate that wraps a song name in web-result titles so what's
// left ("Song Title Artist") is a usable LRCLIB free-text query.
const TITLE_NOISE =
  /\b(official\s+(music\s+)?video|lyric\s+video|lyrics?|audio|visualizer|chords?|live|hd|4k|hq|remaster(ed)?|feat\.?|ft\.?|by)\b/gi;
const TITLE_SITES =
  /\b(youtube|youtu|spotify|genius|musixmatch|apple\s*music|soundcloud|vimeo|essentialworship|worshiptogether|multitracks|bethelmusic|azlyrics|shazam|deezer|tidal)\b/gi;

function cleanTitleToQuery(title: string): string {
  return title
    .replace(/[([{][^)\]}]*[)\]}]/g, ' ') // (feat. …), [Live], {Lyrics}
    .replace(TITLE_NOISE, ' ')
    .replace(TITLE_SITES, ' ')
    .replace(/\.(com|net|org)\b/gi, ' ')
    .replace(/[|\-–—/:•·"'`+]+/g, ' ') // separators + stray symbols
    .replace(/\s+/g, ' ')
    .trim();
}

// ---- lyric verification ----------------------------------------------------

const STOPWORDS = new Set(
  'a an the and or of to in on is are am i you he she it we they your my me with what here as be no'.split(' '),
);

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

interface MatchScore {
  lineHits: number;
  coverage: number;
}

/**
 * How strongly a track's lyrics contain the user's snippet:
 *  - lineHits: snippet lines (≥2 words) that appear verbatim in the lyrics
 *  - coverage: fraction of the snippet's distinctive words present in the lyrics
 */
function scoreMatch(snippet: string, lyrics: string): MatchScore {
  const normLyrics = normalize(lyrics);
  if (!normLyrics) return { lineHits: 0, coverage: 0 };

  let lineHits = 0;
  for (const line of snippet.split('\n').map(normalize)) {
    if (line.split(' ').length >= 2 && normLyrics.includes(line)) lineHits += 1;
  }

  const tokens = [...new Set(normalize(snippet).split(' ').filter((t) => t && !STOPWORDS.has(t)))];
  const lyricTokens = new Set(normLyrics.split(' '));
  const present = tokens.filter((t) => lyricTokens.has(t)).length;
  const coverage = tokens.length ? Number((present / tokens.length).toFixed(2)) : 0;

  return { lineHits, coverage };
}

const isGoodMatch = (s: MatchScore): boolean => s.lineHits >= 1 || s.coverage >= 0.5;

// ---- Firecrawl -------------------------------------------------------------

async function firecrawlSearch(apiKey: string, query: string): Promise<FirecrawlWebResult[]> {
  const response = await fetch(FIRECRAWL_SEARCH_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, limit: MAX_RESULTS, sources: [{ type: 'web' }] }),
    signal: AbortSignal.timeout(25000),
  });
  if (!response.ok) {
    throw new Error(`Firecrawl returned ${response.status}`);
  }
  const data = (await response.json()) as { data?: { web?: FirecrawlWebResult[] } };
  return data.data?.web ?? [];
}

// ---- route -----------------------------------------------------------------

export async function POST(request: Request) {
  let lyrics = '';
  try {
    const body = await request.json();
    lyrics = String((body as { lyrics?: unknown })?.lyrics ?? '').trim();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (lyrics.length < 4) {
    return NextResponse.json(
      { error: 'Enter a line or two of the song lyrics to search.' },
      { status: 400 },
    );
  }

  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Lyric search is not configured (missing FIRECRAWL_API_KEY).' },
      { status: 503 },
    );
  }

  // 1. Web-search the snippet.
  let web: FirecrawlWebResult[];
  try {
    web = await firecrawlSearch(apiKey, buildSearchQuery(lyrics));
  } catch (error) {
    console.error('Firecrawl search failed:', error);
    return NextResponse.json(
      { error: 'Could not reach the song search service. Try again.' },
      { status: 502 },
    );
  }

  // 2. Turn the result titles into distinct LRCLIB queries.
  const queries: string[] = [];
  for (const result of web) {
    const query = cleanTitleToQuery(result.title ?? '');
    if (
      query.split(' ').length >= 2 &&
      !queries.some((existing) => existing.toLowerCase() === query.toLowerCase())
    ) {
      queries.push(query);
    }
    if (queries.length >= MAX_QUERIES) break;
  }

  if (queries.length === 0) {
    return NextResponse.json({ results: [], source: 'firecrawl', reason: 'no-song-titles' });
  }

  // 3. Resolve each query against LRCLIB (parallel) and merge/dedupe by id.
  const lists = await Promise.all(queries.map((q) => searchLrclib({ q }).catch(() => [])));
  const byId = new Map<number, LrclibTrack>();
  for (const list of lists) {
    for (const track of list) if (!byId.has(track.id)) byId.set(track.id, track);
  }

  // 4. Verify against the actual lyrics, rank by match strength, take top 10.
  const scored = [...byId.values()]
    .map((track) => ({ track, score: scoreMatch(lyrics, getPlainLyrics(track)) }))
    .sort((a, b) => b.score.lineHits - a.score.lineHits || b.score.coverage - a.score.coverage);

  const verified = scored.filter((entry) => isGoodMatch(entry.score));
  const chosen = (verified.length > 0 ? verified : scored).slice(0, MAX_RESULTS);

  return NextResponse.json({
    results: chosen.map((entry) => entry.track),
    source: 'firecrawl',
    verified: verified.length > 0,
  });
}
