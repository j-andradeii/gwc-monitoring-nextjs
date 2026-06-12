/**
 * Pure, isomorphic image helpers (no DOM, no Node globals) — safe to import from
 * both Client Components and server routes. Used to recover the real image type
 * when a File arrives with an empty/incorrect MIME (e.g. a macOS screenshot
 * dragged from its floating thumbnail).
 */

const IMAGE_EXTENSIONS: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  bmp: 'image/bmp',
  heic: 'image/heic',
  heif: 'image/heif',
  avif: 'image/avif',
  tif: 'image/tiff',
  tiff: 'image/tiff',
};

/** Sniff a raster image MIME from magic bytes. Returns null if unrecognized. */
export function sniffImageMime(bytes: Uint8Array): string | null {
  const b = bytes;
  if (
    b.length >= 8 &&
    b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 &&
    b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a
  ) return 'image/png';
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (b.length >= 6 && b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38) return 'image/gif';
  if (
    b.length >= 12 &&
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50
  ) return 'image/webp';
  if (b.length >= 2 && b[0] === 0x42 && b[1] === 0x4d) return 'image/bmp';
  // ISO-BMFF (HEIC/HEIF/AVIF): 'ftyp' box at offset 4, brand at 8.
  if (b.length >= 12 && b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70) {
    const brand = String.fromCharCode(b[8], b[9], b[10], b[11]).toLowerCase();
    if (brand === 'avif' || brand === 'avis') return 'image/avif';
    if (brand.startsWith('hei') || brand.startsWith('mif') || brand.startsWith('msf')) return 'image/heic';
  }
  return null;
}

/** Map a filename extension to an image MIME. Returns null if not a known image extension. */
export function mimeFromFilename(name: string): string | null {
  const dot = name.lastIndexOf('.');
  if (dot < 0) return null;
  return IMAGE_EXTENSIONS[name.slice(dot + 1).toLowerCase()] ?? null;
}

/**
 * Best-effort image MIME: prefer sniffed magic bytes, then a valid declared
 * File.type, then the filename extension. Returns null when nothing says "image".
 */
export function resolveImageMime(bytes: Uint8Array, declaredType: string, filename: string): string | null {
  return (
    sniffImageMime(bytes) ??
    (declaredType.startsWith('image/') ? declaredType : null) ??
    mimeFromFilename(filename)
  );
}

/** Ensure a filename ends with the extension matching `mime` (e.g. proof.png -> proof.png, proof -> proof.png). */
export function ensureExtension(name: string, mime: string): string {
  const ext = (mime.split('/')[1] ?? 'png').split('+')[0].replace('jpeg', 'jpg');
  const dot = name.lastIndexOf('.');
  const base = dot > 0 ? name.slice(0, dot) : (name || 'proof-of-payment');
  return `${base}.${ext}`;
}
