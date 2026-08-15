'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useForm, FormProvider, type DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import {
  FormInput,
  FormTextarea,
  ProofOfPaymentField,
  useScrollToFirstError,
} from '@/components/forms';
import { useDownloadImage } from '@/hooks/useDownloadImage';
import { createRegistrationReceiptImage } from '@/lib/registration-receipt';
import { givingConfirmationSchema } from '@/models/schemas/giving-confirmation.schema';
import { proofOfPaymentFileSchema } from '@/models/schemas/proof-of-payment.schema';
import '@/styles/vip-form.css';

/**
 * Client schema — the shared name rule plus the receipt image.
 *
 * The image is REQUIRED here (unlike the event registration form, where a
 * registrant may pay later): the gift has already been sent, so there is
 * nothing to record without the photo of it.
 */
const givingConfirmationFormSchema = givingConfirmationSchema.extend({
  // The shared file rules (size + image type) are piped in behind a
  // plain-language "missing file" message — the shared schema's own wording
  // ("Proof of payment is required") is form jargon on a page written for the
  // least tech-confident giver.
  proofOfPayment: z
    .instanceof(File, { message: 'Please add a photo or screenshot of your receipt.' })
    .pipe(proofOfPaymentFileSchema),
});

type GivingConfirmationFormData = z.infer<typeof givingConfirmationFormSchema>;

const DEFAULT_FORM_VALUES: DefaultValues<GivingConfirmationFormData> = {
  fullName: '',
  email: '',
  amount: '',
  notes: '',
  proofOfPayment: undefined,
};

/** Mirrors the schema's cap so the textarea stops them before the error does. */
const NOTES_MAX_LENGTH = 500;

export interface GivingConfirmationSectionProps {
  /** Anchor id for the section. */
  sectionId?: string;
}

/**
 * Giving confirmation — two steps, one screen.
 *
 * Sits directly beneath the giving channels on the "Give Details" tab: the
 * giver sends their gift with one of the cards above, then tells us it's on the
 * way here. Deliberately the shortest form on the site (name + amount + photo,
 * plus an optional email) because the people most likely to use it are the
 * least comfortable with online forms.
 *
 * The confirmation screen mirrors the paid-event one (reference no., copy
 * button, saveable receipt image) so both surfaces hand back the same kind of
 * proof — those `.event-register-receipt-*` classes are shared, not copied
 * (see the "Success receipt" block in vip-form.css).
 */
export const GivingConfirmationSection: React.FC<GivingConfirmationSectionProps> = ({
  sectionId = 'giving-confirmation',
}) => {
  const successRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  // Captured at submit time — the form is reset behind the success screen.
  const [giverName, setGiverName] = useState('');
  const [isSavingReceipt, setIsSavingReceipt] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [copiedReference, setCopiedReference] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const copyResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { downloadBlob } = useDownloadImage();

  const methods = useForm<GivingConfirmationFormData>({
    resolver: zodResolver(givingConfirmationFormSchema),
    mode: 'onChange',
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { handleSubmit, reset } = methods;
  // The Form* Controller wrappers don't forward `field.ref`, so RHF's own
  // `shouldFocusError` can't scroll — this hook does it instead.
  const onError = useScrollToFirstError();

  const submitConfirmation = useMutation({
    mutationFn: async (data: GivingConfirmationFormData) => {
      const formData = new FormData();
      formData.append('fullName', data.fullName);
      // Optional — sent as '' when skipped so the route parses one shape.
      formData.append('email', data.email?.trim() ?? '');
      // Already normalised to digits by the schema's transform.
      formData.append('amount', data.amount);
      formData.append('notes', data.notes?.trim() ?? '');
      formData.append('proofOfPayment', data.proofOfPayment);

      const response = await fetch('/api/give/giving-confirmation', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(
          (err as { error?: string; message?: string }).error ||
            (err as { message?: string }).message ||
            'Submission failed'
        );
      }

      return response.json();
    },
  });

  const onSubmit = (data: GivingConfirmationFormData) => {
    setGiverName(data.fullName.trim());
    setSaveError(null);
    submitConfirmation.mutate(data);
  };

  // The server owns both values so the receipt matches the sheet row exactly.
  const submissionResult = submitConfirmation.data as
    | { referenceNumber?: string; timestamp?: string }
    | undefined;
  const referenceNumber = submissionResult?.referenceNumber ?? '—';
  const submittedAt = submissionResult?.timestamp ?? '';
  const showConfirmation = submitConfirmation.isSuccess;

  // '—' stands in when the server didn't return one — nothing to copy then.
  const canCopyReference = referenceNumber !== '—';

  const handleCopyReference = async () => {
    if (!canCopyReference) return;

    try {
      await navigator.clipboard.writeText(referenceNumber);
      setCopyError(null);
      setCopiedReference(true);
      if (copyResetRef.current) clearTimeout(copyResetRef.current);
      copyResetRef.current = setTimeout(() => setCopiedReference(false), 2000);
    } catch (error) {
      // Blocked permission or an insecure origin — the number is still on
      // screen, so point them at the manual way rather than failing silently.
      console.error('Copying the reference number failed:', error);
      setCopiedReference(false);
      setCopyError('We couldn’t copy it for you. Press and hold the number to copy it manually.');
    }
  };

  useEffect(
    () => () => {
      if (copyResetRef.current) clearTimeout(copyResetRef.current);
    },
    []
  );

  /**
   * Draw the receipt to a PNG and hand it to `useDownloadImage`, which routes
   * mobile devices through the native share sheet ("Save Image" → Photos) and
   * falls back to a normal file download on desktop.
   */
  const handleSaveReceipt = async () => {
    if (isSavingReceipt) return;

    setIsSavingReceipt(true);
    setSaveError(null);

    try {
      const blob = await createRegistrationReceiptImage({
        headline: 'Giving Received',
        eventTitle: 'Tithes, Offering & Firstfruits',
        // No date line on a giving receipt — the timestamp below carries it.
        eventDate: '',
        namesLabel: 'GIVER',
        footerNote: 'Thank you for your generosity. Our team will verify your gift.',
        referenceNumber,
        timestamp: submittedAt,
        names: [giverName],
      });

      // The blob goes straight to the hook: wrapping it in a blob: URL and
      // fetching it back trips the app's CSP connect-src (see middleware.ts).
      await downloadBlob(blob, `gateway-giving-${referenceNumber}.png`);
    } catch (error) {
      console.error('Saving the giving receipt failed:', error);
      setSaveError(
        'We couldn’t save the image on this device. Please screenshot this page instead.'
      );
    } finally {
      setIsSavingReceipt(false);
    }
  };

  // Once the form is swapped for the "Thank You!" screen, wait for it to paint
  // and bring it into view — the form can be taller than the viewport.
  useEffect(() => {
    if (!showConfirmation) return;

    // The layout shift from the form disappearing needs a moment to settle.
    const timer = setTimeout(() => {
      const target = successRef.current ?? sectionRef.current;
      if (!target) return;

      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({
        // 170px allowance: the fixed landing header (70px) plus the sticky
        // Ways-to-Give tab bar (~88px) that pins beneath it — a smaller offset
        // parks the "Thank You!" heading underneath the bar.
        top: target.getBoundingClientRect().top + window.scrollY - 170,
        behavior: smooth ? 'smooth' : 'auto',
      });

      // Move keyboard / screen-reader focus into the receipt too — the form
      // they were tabbing through no longer exists. Programmatic focus on a
      // container doesn't trigger :focus-visible, so nothing changes visually.
      successRef.current?.focus({ preventScroll: true });
    }, 150);

    return () => clearTimeout(timer);
  }, [showConfirmation]);

  return (
    <section
      id={sectionId}
      ref={sectionRef}
      className="landing-section giving-confirm-section "
      aria-label="Confirm your giving"
    >
      <div className="landing-container !mt-2 !mb-2">
        <div className="vip-form-container giving-confirm-card">
          {showConfirmation ? (
            <div className="success-animation-container" ref={successRef} tabIndex={-1}>
              <h3>Thank You!</h3>
              <p>
                <strong>{giverName}</strong>, we&apos;ve received your giving confirmation. 
              </p>

              {/* Receipt — the giver's copy. Mirrors the saved image, so what
                  they see on screen is what they keep. */}
              <div className="event-register-receipt">
                <div className="event-register-receipt-ref">
                  <span className="event-register-receipt-label">Reference No.</span>
                  <div className="event-register-receipt-code-row">
                    <strong className="event-register-receipt-code">{referenceNumber}</strong>
                    {canCopyReference && (
                      <button
                        type="button"
                        className={`event-register-receipt-copy${copiedReference ? ' is-copied' : ''}`}
                        onClick={handleCopyReference}
                        aria-label={`Copy reference number ${referenceNumber}`}
                      >
                        <i
                          className={`pi ${copiedReference ? 'pi-check' : 'pi-copy'}`}
                          aria-hidden="true"
                        />
                        <span role="status">{copiedReference ? 'Copied' : 'Copy'}</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="event-register-receipt-meta">
                  <i className="pi pi-clock" aria-hidden="true"></i>
                  <span>Submitted {submittedAt}</span>
                </div>

                <div className="event-register-receipt-names">
                  <span className="event-register-receipt-label">Giver</span>
                  <ol>
                    <li>
                      <span className="event-register-receipt-num" aria-hidden="true">
                        1
                      </span>
                      {giverName}
                    </li>
                  </ol>
                </div>
              </div>

              {copyError && (
                <p className="event-register-receipt-error" role="alert">
                  <i className="pi pi-exclamation-circle" aria-hidden="true"></i>
                  {copyError}
                </p>
              )}

              <p className="event-register-receipt-keep" role="note">
                <i className="pi pi-camera" aria-hidden="true"></i>
                <span>
                  <strong>Take a screenshot or save your reference no.</strong> Screenshot this
                  page — or tap <em>Save as image</em> below — and keep{' '}
                  <strong>{referenceNumber}</strong>. 
                </span>
              </p>

              {saveError && (
                <p className="event-register-receipt-error" role="alert">
                  <i className="pi pi-exclamation-circle" aria-hidden="true"></i>
                  {saveError}
                </p>
              )}

              <div className="event-register-success-actions">
                <button
                  type="button"
                  className="landing-btn landing-btn-primary elevated"
                  onClick={handleSaveReceipt}
                  disabled={isSavingReceipt}
                >
                  <i
                    className={`pi ${isSavingReceipt ? 'pi-spin pi-spinner' : 'pi-download'}`}
                    aria-hidden="true"
                  />
                  {isSavingReceipt ? 'Saving…' : 'Save as image'}
                </button>
                <button
                  type="button"
                  className="landing-btn landing-btn-outline"
                  onClick={() => {
                    submitConfirmation.reset();
                    reset(DEFAULT_FORM_VALUES);
                    setGiverName('');
                    setSaveError(null);
                    setCopyError(null);
                    setCopiedReference(false);
                  }}
                >
                  Submit Another
                </button>
              </div>
            </div>
          ) : (
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmit, onError)}
                className="advanced-vip-form"
                aria-busy={submitConfirmation.isPending}
                noValidate
              >
                {submitConfirmation.isError && (
                  <div className="form-error-alert" role="alert">
                    <i className="pi pi-info-circle" aria-hidden="true"></i>
                    {submitConfirmation.error instanceof Error && submitConfirmation.error.message
                      ? submitConfirmation.error.message
                      : 'We couldn’t send that. Please check your internet connection and tap the button again.'}
                  </div>
                )}

                {/* Step 01 — who the gift is from */}
                <div className="form-section">
                  <div className="section-title">
                    <span className="section-number">01</span>
                    <h4>Your Details</h4>
                  </div>

                  <div className="form-row">
                    <FormInput
                      name="fullName"
                      label="Full Name"
                      showRequired
                      placeholder="Juan Dela Cruz"
                      className="modern-field"
                    />
                    {/* Optional: nothing is emailed — it's only so the finance
                        team can reach back if a gift can't be matched. */}
                    <FormInput
                      name="email"
                      label="Email (optional)"
                      placeholder="you@email.com"
                      className="modern-field"
                      type="email"
                      inputMode="email"
                    />
                    {/* Left as free text with a decimal keypad rather than
                        type="number": the schema strips "₱" and commas, so
                        pasting "₱1,500.00" straight from a banking app works,
                        and there are no scroll-wheel/spinner surprises. */}
                    <FormInput
                      name="amount"
                      label="Amount Sown (₱)"
                      showRequired
                      placeholder="1500"
                      className="modern-field"
                      inputMode="decimal"
                    />
                    {/* Optional: whatever the receipt photo can't say for
                        itself. Lands in the sheet's Notes column (E), where the
                        finance team reads it while matching the gift. */}
                    <FormTextarea
                      name="notes"
                      label="Notes (optional)"
                      placeholder="Anything we should know? e.g. which fund this is for, or whose account it was sent from."
                      className="modern-field"
                      rows={3}
                      autoResize
                      maxLength={NOTES_MAX_LENGTH}
                      showCount
                    />
                  </div>
                </div>

                {/* Step 02 — the photo of the receipt */}
                <div className="form-section">
                  <div className="section-title">
                    <span className="section-number">02</span>
                    <h4>Photo of Your Receipt</h4>
                  </div>

                  <ProofOfPaymentField
                    required
                    label="Add a photo of your receipt"
                    sublabel="Upload a screenshot or photo of your GCash, BPI, or BDO transfer."
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="vip-submit-button"
                    disabled={submitConfirmation.isPending}
                  >
                    {submitConfirmation.isPending ? (
                      <i className="pi pi-spin pi-spinner" aria-hidden="true"></i>
                    ) : (
                      <>
                        Send Confirmation
                        <i className="pi pi-arrow-right" aria-hidden="true"></i>
                      </>
                    )}
                  </button>
                  <p className="privacy-note">
                    <i className="pi pi-lock" aria-hidden="true"></i>
                    Your details are kept private and only used to record your gift.
                  </p>
                </div>
              </form>
            </FormProvider>
          )}
        </div>
      </div>
    </section>
  );
};

export default GivingConfirmationSection;
