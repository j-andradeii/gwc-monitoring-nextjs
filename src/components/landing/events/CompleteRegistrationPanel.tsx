'use client';

import { useId, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Event } from '@/data/events';
import ProofOfPaymentField from '@/components/forms/ProofOfPaymentField';
import EventPaymentQrGrid from '@/components/landing/events/EventPaymentQrGrid';
import { proofOfPaymentFileSchema } from '@/models/schemas/proof-of-payment.schema';

const PROOF_ENDPOINT = '/api/events/event-registration/proof';

// The dialog exists only to collect the image, so here it IS required — unlike
// the registration form, where it is optional.
const proofUploadSchema = z.object({
  proofOfPayment: proofOfPaymentFileSchema,
});

type ProofUploadFormData = z.infer<typeof proofUploadSchema>;

/** What the lookup returns — names only, never contact details. */
interface LookupResult {
  referenceNumber: string;
  eventTitle: string;
  eventDate: string;
  submittedAt: string;
  registrants: string[];
  hasProof: boolean;
}

/** Handed to the parent so it can show its confirmation screen. */
export interface RecordedProof {
  referenceNumber: string;
  /** Restamped submission time from the sheet (column A). */
  timestamp: string;
  names: string[];
}

async function readError(response: Response, fallback: string): Promise<string> {
  const payload = (await response.json().catch(() => ({}))) as { error?: string; message?: string };
  return payload.error || payload.message || fallback;
}

interface Props {
  event: Event;
  /**
   * Reference number of a registration made in this session, prefilled for
   * convenience. The parent remounts this component (via `key`) when it
   * changes, so it is only ever an initial value.
   */
  prefillReference?: string;
  /** Fired once the proof is on the sheet; the parent takes over from here. */
  onProofRecorded: (proof: RecordedProof) => void;
}

/**
 * "Already registered?" panel — the second half of the pay-later flow.
 *
 * Registration no longer requires a proof of payment, so a registrant leaves
 * with a reference number and an unpaid slot. Entering that reference here
 * looks up every name it covers (column K of the sheet), shows them in a
 * dialog for confirmation, and lets them send the proof, which is written back
 * onto all of those rows. On success the dialog closes and the parent's
 * confirmation screen takes over.
 */
export default function CompleteRegistrationPanel({
  event,
  prefillReference,
  onProofRecorded,
}: Props) {
  const referenceInputId = useId();
  const [reference, setReference] = useState(prefillReference ?? '');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const proofMethods = useForm<ProofUploadFormData>({
    resolver: zodResolver(proofUploadSchema),
    mode: 'onChange',
    defaultValues: { proofOfPayment: undefined },
  });

  const lookup = useMutation({
    mutationFn: async (referenceNumber: string): Promise<LookupResult> => {
      const params = new URLSearchParams({ referenceNumber, eventSlug: event.slug });
      const response = await fetch(`${PROOF_ENDPOINT}?${params.toString()}`);

      if (!response.ok) {
        throw new Error(
          await readError(response, 'We couldn’t look up that reference number. Please try again.')
        );
      }

      return response.json();
    },
    onSuccess: () => {
      setIsDialogOpen(true);
    },
  });

  const uploadProof = useMutation({
    mutationFn: async (data: ProofUploadFormData) => {
      const referenceNumber = lookup.data?.referenceNumber ?? reference.trim();

      const formData = new FormData();
      formData.append('referenceNumber', referenceNumber);
      formData.append('eventSlug', event.slug);
      formData.append('proofOfPayment', data.proofOfPayment);

      const response = await fetch(PROOF_ENDPOINT, { method: 'POST', body: formData });

      if (!response.ok) {
        throw new Error(
          await readError(response, 'We couldn’t record that proof of payment. Please try again.')
        );
      }

      return response.json() as Promise<{
        referenceNumber?: string;
        timestamp?: string;
        registrants?: string[];
      }>;
    },
    onSuccess: (result) => {
      // Close the dialog and hand the confirmed registration to the parent,
      // which swaps in the receipt screen and scrolls to it.
      setIsDialogOpen(false);
      proofMethods.reset({ proofOfPayment: undefined });
      onProofRecorded({
        referenceNumber: result.referenceNumber ?? lookup.data?.referenceNumber ?? reference.trim(),
        timestamp: result.timestamp ?? '',
        names: result.registrants ?? lookup.data?.registrants ?? [],
      });
    },
  });

  const trimmedReference = reference.trim();
  // The Continue button stays disabled until a reference number is typed.
  const canContinue = trimmedReference.length > 0 && !lookup.isPending;

  const handleContinue = (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault();
    if (!canContinue) return;
    uploadProof.reset();
    proofMethods.reset({ proofOfPayment: undefined });
    lookup.mutate(trimmedReference);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    // Drop the staged file so re-opening starts clean.
    uploadProof.reset();
    proofMethods.reset({ proofOfPayment: undefined });
  };

  const lookupResult = lookup.data;
  const registrants = lookupResult?.registrants ?? [];

  return (
    <div className="event-complete-panel">
      <span className="event-complete-eyebrow">
        <i className="pi pi-history" aria-hidden="true"></i>
        Already registered?
      </span>
      <h3 className="event-complete-title">Complete your registration</h3>
      <p className="event-complete-intro">
        To complete registration, input your reference no. — the code on the receipt you got
        when you registered. We&apos;ll pull up your slot so you can send your proof of payment.
      </p>

      <form className="event-complete-form" onSubmit={handleContinue} noValidate>
        <div className="event-complete-field">
          <label htmlFor={referenceInputId}>
            Reference No.
            <span className="form-required">*</span>
          </label>
          <InputText
            id={referenceInputId}
            value={reference}
            onChange={(e) => setReference(e.target.value.toUpperCase())}
            placeholder="GWC-000000-XXXXX"
            autoComplete="off"
            spellCheck={false}
            aria-required="true"
            className={`w-100 ${lookup.isError ? 'p-invalid' : ''}`}
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
            : 'We couldn’t look up that reference number. Please try again.'}
        </p>
      )}

      <Dialog
        header="Complete your registration"
        visible={isDialogOpen && !!lookupResult}
        onHide={closeDialog}
        dismissableMask
        draggable={false}
        blockScroll
        className="event-complete-dialog"
        style={{ width: '92vw', maxWidth: '540px' }}
      >
        {lookupResult && (
          <>
            {/* Same receipt styling as the confirmation screen so the
                registrant recognises what they're looking at. */}
            <div className="event-register-receipt event-complete-receipt">
              <div className="event-register-receipt-ref">
                <span className="event-register-receipt-label">Reference No.</span>
                <strong className="event-register-receipt-code">
                  {lookupResult.referenceNumber}
                </strong>
              </div>

              {lookupResult.submittedAt && (
                <div className="event-register-receipt-meta">
                  <i className="pi pi-clock" aria-hidden="true"></i>
                  <span>Registered {lookupResult.submittedAt}</span>
                </div>
              )}

              <div className="event-register-receipt-names">
                <span className="event-register-receipt-label">
                  {registrants.length > 1 ? `Registrants (${registrants.length})` : 'Registrant'}
                </span>
                <ol>
                  {registrants.map((name, index) => (
                    <li key={`${name}-${index}`}>
                      <span className="event-register-receipt-num" aria-hidden="true">
                        {index + 1}
                      </span>
                      {name}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {lookupResult.hasProof && (
              <p className="sod-payment-note">
                <i className="pi pi-info-circle" aria-hidden="true"></i>
                <span>
                  We already have a proof of payment on file for this reference number.
                  Uploading a new one <strong>replaces</strong> it.
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
                  Pay the {event.registration_fee ? `${event.registration_fee} ` : ''}
                  registration fee
                  {registrants.length > 1 ? ` for all ${registrants.length} registrants` : ''} by
                  scanning either QR code below, then upload your proof of payment.
                </p>

                <EventPaymentQrGrid />

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
          </>
        )}
      </Dialog>
    </div>
  );
}
