'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { convertImageToWebp } from '@/lib/image-to-webp';
import { resolveImageMime, ensureExtension } from '@/lib/image-mime';
import { SOD_PROOF_ACCEPT } from '@/models/schemas/sod.schema';

// Client-side safety ceiling — must stay under Vercel's ~4.5 MB body limit.
const UPLOAD_SAFE_BYTES = 4 * 1024 * 1024; // 4 MB

interface ProofOfPaymentFieldProps {
  name?: string;
  label?: string;
  sublabel?: string;
  required?: boolean;
}

/**
 * Self-contained proof-of-payment upload field.
 * Reads/writes the RHF field via useFormContext + Controller.
 * Handles: magic-byte mime sniffing, client-side WebP conversion (best-effort),
 * live preview, Change/Remove actions, and meaningful error messages.
 */
export default function ProofOfPaymentField({
  name = 'proofOfPayment',
  label = 'Upload proof of payment',
  sublabel = 'Upload 1 supported image. Max 10 MB.',
  required = false,
}: ProofOfPaymentFieldProps) {
  const methods = useFormContext();
  const [isConverting, setIsConverting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const proofFile = methods.watch(name) as File | undefined;

  // Derive the Object URL synchronously from the file — no setState in effects.
  // useMemo computes it during render; the effect below only handles cleanup.
  const proofPreviewUrl = useMemo(
    () => (proofFile instanceof File ? URL.createObjectURL(proofFile) : null),
    [proofFile]
  );

  // Revoke the previous Object URL when it changes or the component unmounts.
  useEffect(() => {
    return () => {
      if (proofPreviewUrl) URL.revokeObjectURL(proofPreviewUrl);
    };
  }, [proofPreviewUrl]);

  return (
    <div className="sod-upload-field">
      <span className="sod-upload-label">
        {label}
        {required ? (
          <span className="form-required">*</span>
        ) : (
          <span className="sod-upload-optional">(optional)</span>
        )}
      </span>
      <span className="sod-upload-sublabel">{sublabel}</span>

      <Controller
        name={name}
        control={methods.control}
        render={({ field, fieldState }) => (
          <div className="sod-upload" data-form-error={fieldState.invalid ? '' : undefined}>
            <input
              ref={fileInputRef}
              type="file"
              accept={SOD_PROOF_ACCEPT}
              className="sod-upload-input"
              onChange={async (e) => {
                const picked = e.target.files?.[0];
                e.target.value = '';
                setUploadError(null);
                if (!picked) {
                  field.onChange(undefined);
                  field.onBlur();
                  return;
                }
                setIsConverting(true);
                try {
                  // Capture bytes immediately — macOS floating screenshot thumbnails
                  // live in temp files the OS may delete moments later. Reading now
                  // gives stable, owned bytes and lets us sniff the real image type.
                  const buffer = await picked.arrayBuffer();
                  const mime = resolveImageMime(new Uint8Array(buffer), picked.type || '', picked.name);

                  if (!mime) {
                    setUploadError(
                      'That file isn’t a supported image. Please upload a PNG, JPG, or a saved screenshot.'
                    );
                    field.onChange(undefined);
                    return;
                  }

                  const stable = new File([buffer], ensureExtension(picked.name, mime), {
                    type: mime,
                    lastModified: picked.lastModified,
                  });

                  let finalFile: File = stable;
                  try {
                    finalFile = await convertImageToWebp(stable);
                  } catch {
                    finalFile = stable;
                  }

                  const stillUndecodable = /image\/(heic|heif)/i.test(finalFile.type);
                  if (stillUndecodable || finalFile.size > UPLOAD_SAFE_BYTES) {
                    setUploadError(
                      'We couldn’t process that photo on your device. Please take a screenshot of it (or save a copy as JPG) and upload that instead.'
                    );
                    field.onChange(undefined);
                    return;
                  }

                  field.onChange(finalFile);
                } catch {
                  setUploadError(
                    'We couldn’t read that file. If you dragged a screenshot preview, save it to your device first, then upload it.'
                  );
                  field.onChange(undefined);
                } finally {
                  setIsConverting(false);
                  field.onBlur();
                }
              }}
            />

            {proofPreviewUrl ? (
              <div className="sod-upload-preview">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={proofPreviewUrl}
                  alt="Proof of payment preview"
                  className="sod-upload-thumb"
                />
                <div className="sod-upload-meta">
                  <span className="sod-upload-filename">{proofFile?.name}</span>
                  <span className="sod-upload-size">
                    {isConverting
                      ? 'Optimizing…'
                      : `${((proofFile?.size ?? 0) / (1024 * 1024)).toFixed(2)} MB`}
                  </span>
                  <div className="sod-upload-actions">
                    <button
                      type="button"
                      className="sod-upload-change"
                      disabled={isConverting}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      className="sod-upload-remove"
                      disabled={isConverting}
                      onClick={() => {
                        setUploadError(null);
                        field.onChange(undefined);
                        field.onBlur();
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="sod-upload-dropzone"
                disabled={isConverting}
                onClick={() => !isConverting && fileInputRef.current?.click()}
              >
                {isConverting ? (
                  <>
                    <i className="pi pi-spin pi-spinner" aria-hidden="true"></i>
                    <span className="sod-upload-cta">Optimizing image&hellip;</span>
                  </>
                ) : (
                  <>
                    <i className="pi pi-cloud-upload" aria-hidden="true"></i>
                    <span className="sod-upload-cta">Add file</span>
                    <span className="sod-upload-hint">Tap to upload a screenshot &middot; Max 10 MB</span>
                  </>
                )}
              </button>
            )}

            {fieldState.invalid && fieldState.error?.message && (
              <p className="sod-radio-error" role="alert">
                <i className="pi pi-exclamation-circle" aria-hidden="true"></i>
                {fieldState.error.message}
              </p>
            )}
            {uploadError && (
              <p className="sod-radio-error" role="alert">
                <i className="pi pi-exclamation-circle" aria-hidden="true"></i>
                {uploadError}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
}
