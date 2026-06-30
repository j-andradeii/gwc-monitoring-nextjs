import { NextResponse } from 'next/server';
import type { LrclibTrack } from '@/lib/lyrics/lrclib';

/**
 * LRCLIB search proxy.
 *
 * Runs server-side so we can send a descriptive User-Agent (LRCLIB asks for one)
 * and avoid browser CORS. Accepts `q` (free text) and/or `title` / `artist` /
 * `album`. LRCLIB has no year filter, so `year` (if sent) is ignored here.
 */

const LRCLIB_SEARCH_URL = 'https://lrclib.net/api/search';
const USER_AGENT =
  'GatewayLyricFormatter/1.0 (https://gatewaycebu.com; church presentation tool)';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();
  const title = searchParams.get('title')?.trim();
  const artist = searchParams.get('artist')?.trim();
  const album = searchParams.get('album')?.trim();

  const params = new URLSearchParams();
  if (q) {
    params.set('q', q);
  } else if (title) {
    params.set('track_name', title);
    if (artist) params.set('artist_name', artist);
    if (album) params.set('album_name', album);
  } else if (artist || album) {
    params.set('q', [artist, album].filter(Boolean).join(' '));
  } else {
    return NextResponse.json(
      { error: 'Provide a song title, artist, album, or search term.' },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(`${LRCLIB_SEARCH_URL}?${params.toString()}`, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
      // Identical queries are cached briefly — LRCLIB data is effectively static.
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Lyrics provider returned ${response.status}.` },
        { status: 502 },
      );
    }

    const data = (await response.json()) as LrclibTrack[];
    const results = Array.isArray(data)
      ? data.filter((track) => !track.instrumental && (track.plainLyrics || track.syncedLyrics))
      : [];

    return NextResponse.json({ results });
  } catch (error) {
    console.error('LRCLIB search error:', error);
    return NextResponse.json(
      { error: 'Failed to reach the lyrics provider.' },
      { status: 502 },
    );
  }
}
