/**
 * Proof-of-payment image handling for paid-event registrations.
 * Shared by the registration route (proof sent with the form) and the proof
 * route (proof sent later against a reference number).
 *
 * Node-only (sharp + @vercel/blob) — never import from a Client Component.
 */

import { put } from '@vercel/blob';
import { resolveImageMime } from '@/lib/image-mime';
import { SOD_PROOF_MAX_BYTES } from '@/models/schemas/sod.schema';

/**
 * Size- and type-check an uploaded proof before it touches Blob storage.
 * The MIME comes from magic bytes — never trust multipart Content-Type.
 */
export async function readProofBlob(
  proofBlob: Blob
): Promise<{ ok: true; bytes: Buffer; mime: string } | { ok: false; error: string }> {
  if (proofBlob.size > SOD_PROOF_MAX_BYTES) {
    return { ok: false, error: 'Proof of payment must be 10 MB or smaller' };
  }

  const bytes = Buffer.from(await proofBlob.arrayBuffer());
  const mime = resolveImageMime(bytes, proofBlob.type || '', (proofBlob as File).name || '');

  if (!mime) {
    return { ok: false, error: 'Proof of payment must be an image file' };
  }

  return { ok: true, bytes, mime };
}

/**
 * Guarantee the proof image is stored as WebP. The client already converts
 * most uploads (canvas), but that is best-effort — older browsers, decode
 * errors, and HEIC photos can slip through as the original format. This
 * re-encodes server-side with sharp (lazy import) as a safety net.
 */
export async function ensureWebp(
  inputBuffer: Buffer,
  originalMime: string
): Promise<{ buffer: Buffer; mime: string; ext: string }> {
  if (originalMime === 'image/webp') {
    return { buffer: inputBuffer, mime: 'image/webp', ext: 'webp' };
  }

  try {
    const sharp = (await import('sharp')).default;
    const webpBuffer = await sharp(inputBuffer).rotate().webp({ quality: 90 }).toBuffer();
    return { buffer: webpBuffer, mime: 'image/webp', ext: 'webp' };
  } catch (conversionError) {
    console.error('Server-side WebP conversion failed; storing original:', conversionError);
    const ext = (originalMime.split('/')[1] || 'png').split('+')[0].replace('jpeg', 'jpg');
    return { buffer: inputBuffer, mime: originalMime, ext };
  }
}

/**
 * Upload the proof image to Vercel Blob and return its public URL.
 * `nameHint` only shapes the filename (last name, or a reference number when
 * the proof arrives after the fact) — a random suffix keeps it unique.
 * `folder` keeps unrelated proofs apart in Blob storage: event registrations
 * default to `event-proofs`, giving confirmations pass `giving-proofs`.
 */
export async function uploadProofToBlob(
  inputBuffer: Buffer,
  originalMime: string,
  nameHint: string,
  folder = 'event-proofs'
): Promise<string> {
  const { buffer, mime, ext } = await ensureWebp(inputBuffer, originalMime);
  const safeBase = `${nameHint || 'registrant'}`.replace(/[^a-zA-Z0-9._-]/g, '_');

  const blob = await put(`${folder}/${safeBase}.${ext}`, buffer, {
    access: 'public',
    addRandomSuffix: true,
    contentType: mime,
  });

  return blob.url;
}
