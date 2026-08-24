'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { InputText } from 'primereact/inputtext';
import ProofOfPaymentField from '@/components/forms/ProofOfPaymentField';
import { proofOfPaymentFileSchema } from '@/models/schemas/proof-of-payment.schema';
import { LIFECLASS_FEE } from '@/models/schemas/lifeclass.schema';
import LifeclassPaymentQrGrid from './LifeclassPaymentQrGrid';

const PROOF_ENDPOINT = '/api/events/lifeclass-enrollment/proof';

// The dialog exists only to collect the image, so here it IS required — unlike
// the enrollment form, where it is optional.
const proofUploadSchema = z.object({
  proofOfPayment: proofOfPaymentFileSchema,
  amountSent: z.string().optional(),
});

type ProofUploadFormData = z.infer<typeof proofUploadSchema>;

/** What the lookup returns — never contact details. See the route's `summarize`. */
interface LookupResult {
  referenceNumber: string;
  name: string;
  enrolledAt: string;
  hasProof: boolean;
  amountPaid: string;
  /** How many payments are already logged against this reference. */
  paymentCount: number;
  /** The looked-up email matched more than one enrollment; we took the latest. */
  ambiguous: boolean;
}

/** Handed to the parent once a payment is on the sheet. */
export interface RecordedLifeclassProof {
  referenceNumber: string;
  name: string;
  timestamp: string;
  paymentNumber: number;
  totalPaid: string;
}

async function readError(response: Response, fallback: string): Promise<string> {
  const payload = (await response.json().catch(() => ({}))) as { error?: string; message?: string };
  return payload.error || payload.message || fallback;
}

interface Props {
  /**
   * Reference number of an enrollment made in this session (or carried in by
   * `?ref=` from the confirmation email), prefilled for convenience. The parent
   * remounts this component via `key` when it changes, so it is only ever an
   * initial value.
   */
  prefillReference?: string;
  /** Fired once the payment is on the sheet; the parent takes over from here. */
  onProofRecorded: (proof: RecordedLifeclassProof) => void;
}

/**
 * "Already enrolled?" panel — the second half of the pay-later flow.
 *
 * Enrollment does not require a proof of payment, so an enrollee leaves with a
 * reference number and an unpaid slot. Entering that reference here (or the
 * email they enrolled with, which is the only way in for enrollments made
 * before reference numbers existed) pulls up their enrollment, shows it for
 * confirmation, and lets them send the proof.
 *
 * Unlike the G12 events version this models, sending a proof does NOT replace
 * the last one: every upload is its own row on the PAYMENTS tab, so the fee can
 * be settled in parts and the panel can be used as many times as needed.
 */
export default function LifeclassAlreadyEnrolledPanel({
  prefillReference,
  onProofRecorded,
}: Props) {
  const lookupInputId = useId();
  const [lookupValue, setLookupValue] = useState(prefillReference ?? '');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // The dialog is taller than a phone screen (receipt + two QR codes + upload),
  // so it needs an explicit "there's more below" cue.
  const [showScrollHint, setShowScrollHint] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const scrollContentRef = useRef<HTMLDivElement | null>(null);

  const proofMethods = useForm<ProofUploadFormData>({
    resolver: zodResolver(proofUploadSchema),
    mode: 'onChange',
    defaultValues: { proofOfPayment: undefined, amountSent: '' },
  });

  // Prevent body scroll while the modal is open.
  useEffect(() => {
    document.body.style.overflow = isDialogOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isDialogOpen]);

  /** Show the cue only while there is still something left to scroll to. */
  const updateScrollHint = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowScrollHint(el.scrollHeight - el.scrollTop - el.clientHeight > 24);
  }, []);

  /** The chevron lands on top of the upload dropzone, so it has to handle its
   *  own taps — otherwise they fall through and open the file picker. */
  const scrollDown = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Clamped to the last scrollable pixel: asking for an offset past the end
    // leaves iOS parked in the overscroll region — a screen of blank white
    // below the content — instead of bouncing back.
    const end = Math.max(el.scrollHeight - el.clientHeight, 0);
    const target = Math.min(el.scrollTop + Math.round(el.clientHeight * 0.8), end);
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollTo({ top: target, behavior: smooth ? 'smooth' : 'auto' });
  }, []);

  /**
   * A resize can leave the offset past the end of the content — the dialog is
   * sized off the viewport, and an in-app browser's toolbars collapse under
   * you — which paints as a screen of blank white below the last element.
   * Pull it back before re-measuring.
   */
  const handleResize = useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      const end = Math.max(el.scrollHeight - el.clientHeight, 0);
      if (el.scrollTop > end) el.scrollTop = end;
    }
    updateScrollHint();
  }, [updateScrollHint]);

  useEffect(() => {
    if (!isDialogOpen) return;

    const scroller = scrollRef.current;
    const content = scrollContentRef.current;
    if (!scroller || !content) return;

    // Both boxes matter: the content grows as the QR images settle in, and the
    // scroller's own height follows the viewport. ResizeObserver reports each
    // one on subscribe, which doubles as the first measurement.
    const observer = new ResizeObserver(handleResize);
    observer.observe(content);
    observer.observe(scroller);
    window.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, [isDialogOpen, handleResize]);

  const lookup = useMutation({
    mutationFn: async (value: string): Promise<LookupResult> => {
      const params = new URLSearchParams({ lookup: value });
      const response = await fetch(`${PROOF_ENDPOINT}?${params.toString()}`);

      if (!response.ok) {
        throw new Error(
          await readError(response, 'We couldn’t look that up. Please try again.')
        );
      }

      return response.json();
    },
    onSuccess: () => setIsDialogOpen(true),
  });

  const uploadProof = useMutation({
    mutationFn: async (data: ProofUploadFormData) => {
      const formData = new FormData();
      // Send the REFERENCE the lookup resolved, not what was typed: someone who
      // searched by email must not have their upload re-matched by a second
      // email lookup that could resolve differently.
      formData.append('lookup', lookup.data?.referenceNumber || lookupValue.trim());
      formData.append('proofOfPayment', data.proofOfPayment);
      formData.append('amountSent', data.amountSent ?? '');

      const response = await fetch(PROOF_ENDPOINT, { method: 'POST', body: formData });

      if (!response.ok) {
        throw new Error(
          await readError(response, 'We couldn’t record that proof of payment. Please try again.')
        );
      }

      return response.json() as Promise<{
        referenceNumber?: string;
        name?: string;
        timestamp?: string;
        paymentNumber?: number;
        totalPaid?: string;
      }>;
    },
    onSuccess: (result) => {
      setIsDialogOpen(false);
      proofMethods.reset({ proofOfPayment: undefined, amountSent: '' });
      onProofRecorded({
        referenceNumber: result.referenceNumber ?? lookup.data?.referenceNumber ?? '',
        name: result.name ?? lookup.data?.name ?? '',
        timestamp: result.timestamp ?? '',
        paymentNumber: result.paymentNumber ?? 1,
        totalPaid: result.totalPaid ?? '',
      });
    },
  });

  const trimmedLookup = lookupValue.trim();
  const canContinue = trimmedLookup.length > 0 && !lookup.isPending;

  const handleContinue = (submitEvent: React.FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    if (!canContinue) return;

    // Blur the active element to dismiss the mobile keyboard.
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();

    uploadProof.reset();
    proofMethods.reset({ proofOfPayment: undefined, amountSent: '' });
    lookup.mutate(trimmedLookup);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setShowScrollHint(false);
    // Drop the staged file so re-opening starts clean.
    uploadProof.reset();
    proofMethods.reset({ proofOfPayment: undefined, amountSent: '' });
  };

  const result = lookup.data;

  return (
    <div className="event-complete-panel" id="lifeclass-complete">
      <span className="event-complete-eyebrow">
        <i className="pi pi-history" aria-hidden="true"></i>
        Already Enrolled?
      </span>
      <h3 className="event-complete-title">Send your proof of payment</h3>
      <p className="event-complete-intro">
        Enter the reference no. from your confirmation email and we&rsquo;ll pull up your
        enrollment. Paying the {LIFECLASS_FEE} in parts is fine — you can send a proof as many
        times as you need.
      </p>

      <form className="event-complete-form" onSubmit={handleContinue} noValidate>
        <div className="event-complete-field">
          <label htmlFor={lookupInputId}>
            Reference No.
            <span className="form-required">*</span>
          </label>
          <InputText
            id={lookupInputId}
            value={lookupValue}
            // Uppercased only while it still looks like a reference — an email
            // address typed into the same field has to survive as typed.
            onChange={(e) =>
              setLookupValue(
                e.target.value.includes('@') ? e.target.value : e.target.value.toUpperCase()
              )
            }
            placeholder="LC-000000-XXXXX"
            autoComplete="off"
            spellCheck={false}
            aria-required="true"
            className={`w-100 !text-black ${lookup.isError ? 'p-invalid' : ''}`}
            style={{ fontSize: '16px', opacity: 1, WebkitTextFillColor: '#000' }}
          />
        </div>

        <button type="submit" className="event-complete-continue" disabled={!canContinue}>
          {lookup.isPending ? (
            <>
              <i className="pi pi-spin pi-spinner" aria-hidden="true"></i>
              Checking&hellip;
            </>
          ) : (
            <>
              Continue
              <i className="pi pi-arrow-right" aria-hidden="true"></i>
            </>
          )}
        </button>
      </form>

      {lookup.isError && (
        <p className="event-complete-error" role="alert">
          <i className="pi pi-exclamation-circle" aria-hidden="true"></i>
          {lookup.error instanceof Error
            ? lookup.error.message
            : 'We couldn’t look that up. Please try again.'}
        </p>
      )}

      {isDialogOpen && !!result && (
        <div
          className="connect-modal-overlay open"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDialog();
          }}
        >
          <div className="connect-modal-content event-complete-dialog">
            <button
              type="button"
              className="connect-close-btn"
              onClick={closeDialog}
              aria-label="Close"
            >
              <i className="pi pi-times" aria-hidden="true"></i>
            </button>
            <h3 className="event-complete-dialog-title">Send your proof of payment</h3>

            <div className="event-complete-dialog-body">
              <div
                className="event-complete-dialog-scroll"
                ref={scrollRef}
                onScroll={updateScrollHint}
              >
                <div ref={scrollContentRef}>
                  {/* Same receipt styling as the confirmation screen so the
                      enrollee recognises what they're looking at. */}
                  <div className="event-register-receipt event-complete-receipt">
                    {result.referenceNumber && (
                      <div className="event-register-receipt-ref">
                        <span className="event-register-receipt-label">Reference No.</span>
                        <strong className="event-register-receipt-code">
                          {result.referenceNumber}
                        </strong>
                      </div>
                    )}

                    {result.enrolledAt && (
                      <div className="event-register-receipt-meta">
                        <i className="pi pi-clock" aria-hidden="true"></i>
                        <span>Enrolled {result.enrolledAt}</span>
                      </div>
                    )}

                    <div className="event-register-receipt-names">
                      <span className="event-register-receipt-label">Enrollee</span>
                      <ol>
                        <li>
                          <span className="event-register-receipt-num" aria-hidden="true">
                            1
                          </span>
                          {result.name}
                        </li>
                      </ol>
                    </div>
                  </div>

                  {result.ambiguous && (
                    <p className="sod-payment-note">
                      <i className="pi pi-info-circle" aria-hidden="true"></i>
                      <span>
                        That email matches more than one enrollment — this is the most recent
                        one. If it isn&rsquo;t the one you meant, close this and use the
                        reference number instead.
                      </span>
                    </p>
                  )}

                  {result.paymentCount > 0 && (
                    <p className="sod-payment-note">
                      <i className="pi pi-check-circle" aria-hidden="true"></i>
                      <span>
                        We already have{' '}
                        <strong>
                          {result.paymentCount} payment{result.paymentCount > 1 ? 's' : ''}
                        </strong>{' '}
                        on file for this enrollment
                        {result.amountPaid ? (
                          <>
                            {' '}
                            (<strong>{result.amountPaid}</strong> recorded so far)
                          </>
                        ) : null}
                        . Sending another one <strong>adds</strong> to it — nothing is replaced.
                      </span>
                    </p>
                  )}

                  <FormProvider {...proofMethods}>
                    <form
                      className="event-complete-upload-form"
                      onSubmit={proofMethods.handleSubmit((data) => uploadProof.mutate(data))}
                      aria-busy={uploadProof.isPending}
                      noValidate
                    >
                      <p className="sod-payment-intro">
                        Pay the {LIFECLASS_FEE} enrollment fee by scanning either QR code below,
                        then upload your proof of payment. Paying in parts is fine.
                      </p>

                      <LifeclassPaymentQrGrid />

                      <div className="sod-amount-field">
                        <label
                          htmlFor={`${lookupInputId}-amount`}
                          className="event-complete-amount-label"
                        >
                          Payment Amount Sent (optional)
                        </label>
                        {/* Controller, not a spread `register` — PrimeReact's
                            InputText is a controlled component everywhere else
                            in this app (see components/forms/FormInput). */}
                        <Controller
                          name="amountSent"
                          control={proofMethods.control}
                          render={({ field }) => (
                            <InputText
                              id={`${lookupInputId}-amount`}
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(e.target.value)}
                              onBlur={field.onBlur}
                              placeholder="e.g. 250"
                              inputMode="decimal"
                              autoComplete="off"
                              className="w-100 !text-black"
                              style={{ fontSize: '16px', opacity: 1, WebkitTextFillColor: '#000' }}
                            />
                          )}
                        />
                      </div>

                      <ProofOfPaymentField required />

                      {uploadProof.isError && (
                        <div className="form-error-alert" role="alert">
                          <i className="pi pi-info-circle" aria-hidden="true"></i>
                          {uploadProof.error instanceof Error
                            ? uploadProof.error.message
                            : 'Something went wrong. Please try again.'}
                        </div>
                      )}

                      <p className="sod-payment-note">
                        <i className="pi pi-info-circle" aria-hidden="true"></i>
                        <span>Your slot is confirmed once we verify your payment.</span>
                      </p>

                      <button
                        type="submit"
                        className="vip-submit-button event-complete-submit"
                        disabled={uploadProof.isPending}
                      >
                        {uploadProof.isPending ? (
                          <i className="pi pi-spin pi-spinner" aria-hidden="true"></i>
                        ) : (
                          <>
                            Submit proof of payment
                            <i className="pi pi-arrow-right" aria-hidden="true"></i>
                          </>
                        )}
                      </button>
                    </form>
                  </FormProvider>
                </div>
              </div>

              {/* Sits over the fold, not in the flow, so it never shifts the
                  content it is pointing past. Decorative for assistive tech —
                  keyboard and screen-reader users just scroll the region —
                  hence aria-hidden and tabIndex -1 on the button. */}
              <div
                className={`event-complete-scroll-hint${showScrollHint ? ' is-visible' : ''}`}
                aria-hidden="true"
              >
                <button type="button" tabIndex={-1} onClick={scrollDown}>
                  <i className="pi pi-chevron-down"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
