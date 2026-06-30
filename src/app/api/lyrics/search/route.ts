import { NextResponse } from 'next/server';
import { searchLrclib, type LrclibSearchQuery } from '@/lib/lyrics/lrclib-search';

/**
 * LRCLIB search proxy.
 *
 * Runs server-side so we can send a descriptive User-Agent (LRCLIB asks for one)
 * and avoid browser CORS. Accepts `q` (free text) and/or `title` / `artist` /
 * `album`. LRCLIB has no year filter, so `year` (if sent) is ignored here.
 */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();
  const title = searchParams.get('title')?.trim();
  const artist = searchParams.get('artist')?.trim();
  const album = searchParams.get('album')?.trim();

  let query: LrclibSearchQuery | null = null;
  if (q) {
    query = { q };
  } else if (title) {
    query = { trackName: title, artistName: artist, albumName: album };
  } else if (artist || album) {
    query = { q: [artist, album].filter(Boolean).join(' ') };
  }

  if (!query) {
    return NextResponse.json(
      { error: 'Provide a song title, artist, album, or search term.' },
      { status: 400 },
    );
  }

  try {
    const results = await searchLrclib(query);
    return NextResponse.json({ results });
  } catch (error) {
    console.error('LRCLIB search error:', error);
    return NextResponse.json(
      { error: 'Failed to reach the lyrics provider.' },
      { status: 502 },
    );
  }
}
