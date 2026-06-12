/**
 * Client-only utility (Canvas API / DOM) — never call from a Server Component or
 * a server-side code path. It is safe to import in Client Components because it
 * is only executed on user interaction (file-input onChange).
 *
 * Optimizes an image File for upload: it is DOWNSCALED to a sane max dimension
 * and re-encoded to WebP (or JPEG when WebP encoding is unavailable). This is the
 * iPhone-critical path:
 *   - iPhone photos are HEIC and/or 12–48 MP. Drawing a full-resolution photo to a
 *     canvas can exceed iOS Safari's canvas pixel limit (toBlob returns null) or
 *     run the tab out of memory. Downscaling first avoids both.
 *   - Older Safari can't encode WebP via canvas.toBlob (returns image/png or null),
 *     so we fall back to JPEG — which every canvas supports — instead of shipping
 *     the original multi-MB HEIC/JPEG. That kept the upload under the serverless
 *     body limit AND fixed the broken-preview thumbnail (HEIC can't render).
 *
 * Returns the original File unchanged ONLY when:
 *   - the input is not an image
 *   - the input is already image/webp
 *   - decoding fails entirely, or neither WebP nor JPEG encoding is available
 * In every other case it returns a small, renderable WebP/JPEG. The server still
 * re-encodes the result to WebP with sharp, so JPEG output is fine.
 */

/** Longest-edge cap. Keeps proof-of-payment screenshots/receipts legible while
 *  staying well under iOS canvas limits and the serverless request-body limit. */
const MAX_DIMENSION = 1600;

/** Cap for the memory-safe RESIZED decode fallback (used only when a full-res
 *  decode fails, e.g. a 48 MP iPhone photo exhausting iOS memory). Kept a little
 *  above MAX_DIMENSION so the final canvas downscale still has detail to work with. */
const MAX_DECODE_DIMENSION = 2048;

/** Promise wrapper around canvas.toBlob. */
function toBlobAsync(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), type, quality));
}

/** Encode a canvas to WebP, falling back to JPEG when WebP encoding is unavailable. */
async function encodeCanvas(
  canvas: HTMLCanvasElement,
  quality: number
): Promise<{ blob: Blob; mime: string; ext: string } | null> {
  // Prefer WebP — smaller, and the server keeps it as-is (no re-encode).
  const webp = await toBlobAsync(canvas, 'image/webp', quality);
  if (webp && webp.type === 'image/webp') {
    return { blob: webp, mime: 'image/webp', ext: 'webp' };
  }
  // Fallback: JPEG — universally supported by canvas.toBlob (incl. older iOS Safari).
  // Guarantees a renderable, small file even when the source was HEIC.
  const jpeg = await toBlobAsync(canvas, 'image/jpeg', quality);
  if (jpeg && jpeg.type === 'image/jpeg') {
    return { blob: jpeg, mime: 'image/jpeg', ext: 'jpg' };
  }
  return null;
}

export async function convertImageToWebp(file: File, quality = 0.85): Promise<File> {
  // Pass-through: non-image or already WebP
  if (!file.type.startsWith('image/') || file.type === 'image/webp') {
    return file;
  }

  let bitmap: ImageBitmap | null = null;
  let objectUrl: string | null = null;

  try {
    // --- Decode the image (memory-safe) ---
    // Try a full-resolution decode first — it is correct for typical images and
    // yields the true dimensions. iPhone photos are 12–48 MP; decoding one at full
    // resolution can exhaust memory on iOS (the decode fails, or the tab is killed),
    // which the user experiences as a failed/blocked "error uploading" the photo.
    // If the full-res decode fails, retry with a capped RESIZED decode that never
    // materializes the entire photo in memory.
    if (typeof createImageBitmap === 'function') {
      try {
        bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
      } catch {
        try {
          // Some browsers reject the imageOrientation option but decode fine without it.
          bitmap = await createImageBitmap(file);
        } catch {
          bitmap = null;
        }
      }

      if (!bitmap) {
        try {
          // Resized decode: passing only resizeWidth preserves aspect ratio and
          // decodes straight to a small bitmap, sidestepping the memory/pixel
          // limit. This runs only after a full-res decode failed (an oversized
          // image), so it can never upscale a small one.
          bitmap = await createImageBitmap(file, {
            resizeWidth: MAX_DECODE_DIMENSION,
            resizeQuality: 'high',
            imageOrientation: 'from-image',
          });
        } catch {
          bitmap = null; // fall through to Image() fallback (decodes HEIC on Safari)
        }
      }
    }

    let width: number;
    let height: number;
    let source: ImageBitmap | HTMLImageElement;

    if (bitmap) {
      width = bitmap.width;
      height = bitmap.height;
      source = bitmap;
    } else {
      // Fallback: HTMLImageElement. On iOS Safari this decodes HEIC natively and
      // applies EXIF orientation when drawn to canvas.
      objectUrl = URL.createObjectURL(file);
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error('Image load failed'));
        el.src = objectUrl as string;
      });
      width = img.naturalWidth;
      height = img.naturalHeight;
      source = img;
    }

    if (!width || !height) throw new Error('Zero-size image');

    // --- Downscale to MAX_DIMENSION on the longest edge (never upscale) ---
    const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
    const targetW = Math.max(1, Math.round(width * scale));
    const targetH = Math.max(1, Math.round(height * scale));

    // --- Draw (scaled) to canvas ---
    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No 2D context');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(source, 0, 0, targetW, targetH);

    // --- Encode (WebP → JPEG fallback) ---
    const encoded = await encodeCanvas(canvas, quality);

    // Last resort: neither format could be encoded — keep the original so the
    // upload is never lost (the server re-encodes with sharp).
    if (!encoded) {
      return file;
    }

    // Derive the base name (strip extension)
    const dotIndex = file.name.lastIndexOf('.');
    const baseName = dotIndex > 0 ? file.name.slice(0, dotIndex) : (file.name || 'proof-of-payment');

    return new File([encoded.blob], `${baseName}.${encoded.ext}`, {
      type: encoded.mime,
      lastModified: file.lastModified,
    });
  } catch {
    // Any failure → return original so upload never breaks
    return file;
  } finally {
    if (bitmap) bitmap.close();
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }
}
