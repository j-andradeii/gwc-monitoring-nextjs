/**
 * Client-only utility (Canvas API / DOM) — never call from a Server Component or
 * a server-side code path. It is safe to import in Client Components because it
 * is only executed on user interaction (file-input onChange).
 *
 * Converts an image File to WebP at the requested quality.
 * Returns the original File unchanged when:
 *   - the input is not an image
 *   - the input is already image/webp
 *   - the browser does not support WebP encoding (canvas.toBlob returns a
 *     non-webp MIME type — e.g. older Safari silently returns image/png)
 *   - any decode / canvas error occurs
 */
export async function convertImageToWebp(file: File, quality = 0.9): Promise<File> {
  // Pass-through: non-image or already WebP
  if (!file.type.startsWith('image/') || file.type === 'image/webp') {
    return file;
  }

  let bitmap: ImageBitmap | null = null;
  let objectUrl: string | null = null;

  try {
    // --- Decode the image ---
    if (typeof createImageBitmap === 'function') {
      try {
        bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
      } catch {
        bitmap = null; // fall through to Image() fallback
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
      // Fallback: HTMLImageElement (handles EXIF via CSS image-orientation)
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

    // --- Draw to canvas ---
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No 2D context');
    ctx.drawImage(source, 0, 0);

    // --- Encode as WebP ---
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/webp', quality);
    });

    // Graceful fallback: null blob or browser silently returned a non-WebP type
    if (!blob || blob.type !== 'image/webp') {
      return file;
    }

    // Derive the base name (strip extension)
    const dotIndex = file.name.lastIndexOf('.');
    const baseName = dotIndex > 0 ? file.name.slice(0, dotIndex) : (file.name || 'proof-of-payment');

    return new File([blob], `${baseName}.webp`, {
      type: 'image/webp',
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
