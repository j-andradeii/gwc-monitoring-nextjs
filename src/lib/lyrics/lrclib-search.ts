/**
 * Server-side LRCLIB search helper.
 *
 * Centralises the call to LRCLIB's /api/search so both the metadata search route
 * (`/api/lyrics/search`) and the AI lyric-identify route (`/api/lyrics/identify`)
 * share one User-Agent, cache policy, and "usable track" filter. Lives apart from
 * `lrclib.ts` (which is imported by client code) so this fetch logic stays
 * server-only. LRCLIB matches `q` against track/artist/album metadata — never the
 * lyric body — which is why lyric search has to resolve a title/artist first.
 */
import type { LrclibTrack } from './lrclib';

const LRCLIB_SEARCH_URL = 'https://lrclib.net/api/search';
const USER_AGENT =
  'GatewayLyricFormatter/1.0 (https://gatewaycebu.com; church presentation tool)';

export interface LrclibSearchQuery {
  /** Free-text query (matched against track/artist/album metadata, not lyrics). */
  q?: string;
  trackName?: string;
  artistName?: string;
  albumName?: string;
}

/** Presentable track: not instrumental and carrying some lyrics. */
function isUsable(track: LrclibTrack): boolean {
  return !track.instrumental && Boolean(track.plainLyrics || track.syncedLyrics);
}

/**
 * Query LRCLIB and return only usable (non-instrumental, has-lyrics) tracks.
 * Throws on network failure or a non-OK response so callers decide how to surface
 * the error. Returns `[]` when the query is effectively empty.
 */
export async function searchLrclib(query: LrclibSearchQuery): Promise<LrclibTrack[]> {
  const params = new URLSearchParams();
  if (query.q?.trim()) {
    params.set('q', query.q.trim());
  } else if (query.trackName?.trim()) {
    params.set('track_name', query.trackName.trim());
    if (query.artistName?.trim()) params.set('artist_name', query.artistName.trim());
    if (query.albumName?.trim()) params.set('album_name', query.albumName.trim());
  } else {
    return [];
  }

  const response = await fetch(`${LRCLIB_SEARCH_URL}?${params.toString()}`, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
    // Identical queries are cached briefly — LRCLIB data is effectively static.
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`LRCLIB returned ${response.status}`);
  }

  const data = (await response.json()) as unknown;
  return Array.isArray(data) ? (data as LrclibTrack[]).filter(isUsable) : [];
}
