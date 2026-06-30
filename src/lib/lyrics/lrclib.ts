/**
 * LRCLIB (https://lrclib.net) shared types + helpers.
 *
 * LRCLIB is a free, no-key lyrics API. We proxy it server-side (see
 * `app/api/lyrics/search/route.ts`) to set a proper User-Agent and dodge CORS.
 * NOTE: LRCLIB has no "year" field — search is by track / artist / album / free text.
 */

export interface LrclibTrack {
  id: number;
  trackName: string;
  artistName: string;
  albumName: string | null;
  duration: number | null;
  instrumental: boolean;
  plainLyrics: string | null;
  syncedLyrics: string | null;
}

export interface LyricsSearchResponse {
  results: LrclibTrack[];
}

/** Strip `[mm:ss.xx]` timestamps from LRC synced lyrics to recover plain text. */
export function syncedToPlain(synced: string): string {
  return synced
    .replace(/\[\d{1,2}:\d{2}(?:[.:]\d{1,3})?\]/g, '')
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .trim();
}

/** Best available plain-text lyrics for a track (falls back to de-synced LRC). */
export function getPlainLyrics(track: LrclibTrack): string {
  if (track.plainLyrics && track.plainLyrics.trim()) return track.plainLyrics;
  if (track.syncedLyrics && track.syncedLyrics.trim()) return syncedToPlain(track.syncedLyrics);
  return '';
}

/** Format a duration in seconds as "m:ss". */
export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) return '';
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
