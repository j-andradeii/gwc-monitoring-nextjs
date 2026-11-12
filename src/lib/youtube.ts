/**
 * YouTube URL helpers.
 *
 * Accepts any common YouTube link shape — watch, youtu.be, embed, shorts —
 * and turns it into something an <iframe> can actually load. A raw
 * `/shorts/` or `/watch` URL is blocked from framing by YouTube, so always
 * go through `getYouTubeEmbedUrl` before using a link as an iframe `src`.
 */

const YT_ID_PATTERNS = [
  /youtube(?:-nocookie)?\.com\/embed\/([A-Za-z0-9_-]{6,})/i,
  /youtube\.com\/watch\?(?:.*&)?v=([A-Za-z0-9_-]{6,})/i,
  /youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/i,
  /youtube\.com\/live\/([A-Za-z0-9_-]{6,})/i,
  /youtu\.be\/([A-Za-z0-9_-]{6,})/i,
];

export function extractYouTubeId(url: string): string | null {
  for (const re of YT_ID_PATTERNS) {
    const m = url.match(re);
    if (m?.[1]) return m[1];
  }
  return null;
}

/** Shorts are vertical (9:16); everything else is treated as 16:9. */
export function isYouTubeShort(url: string): boolean {
  return /youtube\.com\/shorts\//i.test(url);
}

export function getYouTubeEmbedUrl(url: string, { autoplay = false } = {}): string | null {
  const id = extractYouTubeId(url);
  if (!id) return null;
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    ...(autoplay ? { autoplay: '1' } : {}),
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}
