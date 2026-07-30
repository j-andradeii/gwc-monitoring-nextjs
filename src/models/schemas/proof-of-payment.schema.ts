import { z } from 'zod';
import { SOD_PROOF_MAX_BYTES } from '@/models/schemas/sod.schema';
import { mimeFromFilename } from '@/lib/image-mime';

/**
 * Client-side validation for a proof-of-payment upload.
 *
 * Browser-only: it validates a `File`, so it belongs to the forms that collect
 * the image (the registration form, where it is `.optional()`, and the
 * "Complete your registration" dialog, where it is required). The server
 * re-checks size and sniffs the real MIME from magic bytes in
 * lib/event-proof-upload.ts — this only keeps obvious mistakes out of the
 * request.
 */
export const proofOfPaymentFileSchema = z
  .instanceof(File, { message: 'Proof of payment is required' })
  .refine((file) => file.size <= SOD_PROOF_MAX_BYTES, 'File must be 10 MB or smaller')
  .refine(
    (file) => file.type.startsWith('image/') || mimeFromFilename(file.name) !== null,
    'Please upload an image file'
  );
