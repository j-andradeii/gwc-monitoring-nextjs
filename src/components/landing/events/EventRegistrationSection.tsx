'use client';

import { useEffect, useId, useRef, useState } from 'react';
import {
  useForm,
  FormProvider,
  useFieldArray,
  useWatch,
  Controller,
  type DefaultValues,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Event } from '@/data/events';
import {
  FormInput,
  FormSocialMedia,
  useScrollToFirstError,
} from '@/components/forms';
import ProofOfPaymentField from '@/components/forms/ProofOfPaymentField';
import DownloadQRButton from '@/components/ui/DownloadQRButton';
import { useDownloadImage } from '@/hooks/useDownloadImage';
import { createRegistrationReceiptImage } from '@/lib/registration-receipt';
import { eventRegistrationSchema } from '@/models/schemas/event-registration.schema';
import { SOD_PROOF_MAX_BYTES } from '@/models/schemas/sod.schema';
import { mimeFromFilename } from '@/lib/image-mime';
import '@/styles/landing.css';
import '@/styles/vip-form.css';

// Client-side Zod schema — extends the base schema with the required proof file.
const proofOfPaymentSchema = z
  .instanceof(File, { message: 'Proof of payment is required' })
  .refine((file) => file.size <= SOD_PROOF_MAX_BYTES, 'File must be 10 MB or smaller')
  .refine(
    (file) => file.type.startsWith('image/') || mimeFromFilename(file.name) !== null,
    'Please upload an image file'
  );

const eventRegistrationFormSchema = eventRegistrationSchema.extend({
  proofOfPayment: proofOfPaymentSchema,
});

type EventRegistrationFormData = z.infer<typeof eventRegistrationFormSchema>;

const EMPTY_REGISTRANT = { firstName: '', lastName: '' };

const DEFAULT_FORM_VALUES: DefaultValues<EventRegistrationFormData> = {
  firstName: '',
  lastName: '',
  cellLeader: '',
  email: '',
  phone: '',
  socialMedia: [{ platform: 'Facebook', handle: '' }],
  registerMultiple: false,
  additionalRegistrants: [],
  proofOfPayment: undefined,
};

interface Props {
  event: Event;
}

export default function EventRegistrationSection({ event }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const multiToggleId = useId();
  // Names captured at submit time — the form is reset behind the success screen.
  const [registeredNames, setRegisteredNames] = useState<string[]>([]);
  const [isSavingReceipt, setIsSavingReceipt] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { downloadBlob } = useDownloadImage();

  const methods = useForm<EventRegistrationFormData>({
    resolver: zodResolver(eventRegistrationFormSchema),
    mode: 'onChange',
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { handleSubmit, reset, control, setValue, clearErrors } = methods;
  const onError = useScrollToFirstError();

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'additionalRegistrants',
  });
  const registerMultiple = useWatch({ control, name: 'registerMultiple' });
  // The registrant themselves plus everyone they are paying for.
  const totalRegistrants = registerMultiple ? fields.length + 1 : 1;

  // The checkbox drives the rows: ticking it opens the first name row, unticking
  // it drops every row (and any half-filled-row errors) so the form can submit.
  useEffect(() => {
    if (registerMultiple && fields.length === 0) {
      append(EMPTY_REGISTRANT, { shouldFocus: false });
    } else if (!registerMultiple && fields.length > 0) {
      replace([]);
      clearErrors('additionalRegistrants');
    }
  }, [registerMultiple, fields.length, append, replace, clearErrors]);

  // Removing the only row means "never mind" — untick the box so the section
  // collapses instead of leaving a lone blank row behind (the effect above
  // re-adds one for as long as the box stays ticked).
  const handleRemoveRegistrant = (index: number) => {
    if (fields.length <= 1) {
      setValue('registerMultiple', false);
      return;
    }
    remove(index);
  };

  const submitRegistration = useMutation({
    mutationFn: async (data: EventRegistrationFormData) => {
      const formData = new FormData();
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('cellLeader', data.cellLeader ?? '');
      formData.append('email', data.email ?? '');
      formData.append('phone', data.phone ?? '');
      formData.append('socialMedia', JSON.stringify(data.socialMedia));
      // One extra row per additional registrant; the server copies this
      // submission's proof of payment onto each of them.
      formData.append(
        'additionalRegistrants',
        JSON.stringify(data.registerMultiple ? (data.additionalRegistrants ?? []) : [])
      );
      formData.append('eventSlug', event.slug);
      formData.append('eventTitle', event.title);
      formData.append('eventDate', event.date);
      if (data.proofOfPayment) {
        formData.append('proofOfPayment', data.proofOfPayment);
      }

      const response = await fetch('/api/events/event-registration', {
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

  const onSubmit = (data: EventRegistrationFormData) => {
    const additional = data.registerMultiple ? (data.additionalRegistrants ?? []) : [];
    setRegisteredNames([
      `${data.firstName} ${data.lastName}`.trim(),
      ...additional.map((registrant) => `${registrant.firstName} ${registrant.lastName}`.trim()),
    ]);
    setSaveError(null);
    submitRegistration.mutate(data);
  };

  // The server owns both values so the receipt matches the sheet row exactly.
  const submissionResult = submitRegistration.data as
    | { referenceNumber?: string; timestamp?: string }
    | undefined;
  const referenceNumber = submissionResult?.referenceNumber ?? '—';
  const submittedAt = submissionResult?.timestamp ?? '';

  /**
   * Draw the receipt to a PNG and hand it to `useDownloadImage`, which routes
   * mobile devices through the native share sheet ("Save Image" → Photos) and
   * falls back to a normal file download on desktop — same path as the QR code.
   */
  const handleSaveReceipt = async () => {
    if (isSavingReceipt) return;

    setIsSavingReceipt(true);
    setSaveError(null);

    try {
      const blob = await createRegistrationReceiptImage({
        eventTitle: event.title,
        // Full date (not displayDate) — a saved receipt should carry the year.
        eventDate: `${event.day}, ${event.date}`,
        referenceNumber,
        timestamp: submittedAt,
        names: registeredNames,
      });

      // The blob goes straight to the hook: wrapping it in a blob: URL and
      // fetching it back trips the app's CSP connect-src (see middleware.ts).
      await downloadBlob(blob, `gateway-registration-${referenceNumber}.png`);
    } catch (error) {
      console.error('Saving the registration receipt failed:', error);
      setSaveError(
        'We couldn’t save the image on this device. Please screenshot this page instead.'
      );
    } finally {
      setIsSavingReceipt(false);
    }
  };

  // On a successful registration the form is swapped for the "Thank You!"
  // success message. Wait for that container to paint, then scroll it into
  // view (this section only renders for has_payment events).
  useEffect(() => {
    if (submitRegistration.isSuccess) {
      (successRef.current ?? sectionRef.current)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [submitRegistration.isSuccess]);

  return (
    <section
      id="event-register"
      ref={sectionRef}
      className="event-register-section"
      aria-label="Event Registration"
    >
      <div className="landing-container">
        <div className="event-register-form-wrap">
          <div className="vip-form-container">
            {submitRegistration.isSuccess ? (
              <div className="success-animation-container" ref={successRef}>
                <h3>Thank You!</h3>
                <p>
                  <strong>{registeredNames[0]}</strong>, your registration for{' '}
                  <strong>{event.title}</strong>
                  {registeredNames.length > 1 ? (
                    <>
                      {' '}
                      — covering <strong>{registeredNames.length} people</strong> —
                    </>
                  ) : null}{' '}
                  is in — we&apos;ll confirm once your payment is verified.
                </p>

                {/* Receipt — the registrant's proof of registration. Mirrors the
                    saved image so what they see is what they keep. */}
                <div className="event-register-receipt">
                  <div className="event-register-receipt-ref">
                    <span className="event-register-receipt-label">Reference No.</span>
                    <strong className="event-register-receipt-code">{referenceNumber}</strong>
                  </div>

                  <div className="event-register-receipt-meta">
                    <i className="pi pi-clock" aria-hidden="true"></i>
                    <span>Submitted {submittedAt}</span>
                  </div>

                  <div className="event-register-receipt-names">
                    <span className="event-register-receipt-label">
                      {registeredNames.length > 1
                        ? `Registrants (${registeredNames.length})`
                        : 'Registrant'}
                    </span>
                    <ol>
                      {registeredNames.map((name, index) => (
                        <li key={`${name}-${index}`}>
                          <span className="event-register-receipt-num" aria-hidden="true">
                            {index + 1}
                          </span>
                          {name}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {registeredNames.length > 1 && (
                    <p className="event-register-receipt-note">
                      <i className="pi pi-info-circle" aria-hidden="true"></i>
                      <span>
                        Everyone above shares this reference number — it covers the one
                        payment you sent.
                      </span>
                    </p>
                  )}
                </div>

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
                      submitRegistration.reset();
                      reset(DEFAULT_FORM_VALUES);
                      setRegisteredNames([]);
                      setSaveError(null);
                    }}
                  >
                    Register Another
                  </button>
                </div>
              </div>
            ) : (
              <FormProvider {...methods}>
                <form
                  onSubmit={handleSubmit(onSubmit, onError)}
                  className="advanced-vip-form"
                  aria-busy={submitRegistration.isPending}
                  noValidate
                >
                  <div className="form-header">
                    <span className="step-label">Registration Form</span>
                    <h3 className="form-main-title">{event.title}</h3>
                  </div>

                  {submitRegistration.isError && (
                    <div className="form-error-alert" role="alert">
                      <i className="pi pi-info-circle" aria-hidden="true"></i>
                      Something went wrong. Please try again.
                    </div>
                  )}

                  {/* Two-column on desktop (info | payment), single column on mobile */}
                  <div className="event-register-columns">
                    {/* ── Left column: applicant details ───────────────── */}
                    <div className="event-register-col">
                      {/* Section 01: Personal Information */}
                      <div className="form-section">
                        <div className="section-title">
                          <span className="section-number">01</span>
                          <h4>Personal Information</h4>
                        </div>

                        <div className="form-row sod-form-row-2col">
                          <FormInput
                            name="firstName"
                            label="First Name"
                            showRequired
                            className="modern-field"
                          />
                          <FormInput
                            name="lastName"
                            label="Last Name"
                            showRequired
                            className="modern-field"
                          />
                        </div>

                        <div className="form-row sod-form-row-1col">
                          <FormInput
                            name="email"
                            label="Email (optional)"
                            placeholder="you@email.com"
                            className="modern-field"
                          />
                          <FormInput
                            name="phone"
                            label="Phone Number (optional)"
                            placeholder="0917 XXX XXXX"
                            className="modern-field"
                            type="tel"
                            inputMode="tel"
                          />
                        </div>
                      </div>

                      {/* Section 02: Additional Registrants (one payment, many slots) */}
                      <div className="form-section">
                        <div className="section-title">
                          <span className="section-number">02</span>
                          <h4>Additional Registrants</h4>
                        </div>

                        <div className="event-register-multi-toggle">
                          <Controller
                            name="registerMultiple"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                inputId={multiToggleId}
                                checked={!!field.value}
                                onChange={(e) => field.onChange(!!e.checked)}
                                onBlur={field.onBlur}
                              />
                            )}
                          />
                          <label
                            htmlFor={multiToggleId}
                            className="event-register-multi-toggle-label"
                          >
                            <strong>Register multiple people</strong>
                            <span>
                              Tick this if your payment covers other people, then add their
                              names below — each one gets their own slot.
                            </span>
                          </label>
                        </div>

                        {registerMultiple && (
                          <div className="event-register-multi-rows">
                            {fields.map((field, index) => (
                              <div className="event-register-multi-row" key={field.id}>
                                <div className="event-register-multi-row-header">
                                  <span
                                    className="event-register-multi-row-number"
                                    aria-hidden="true"
                                  >
                                    {index + 2}
                                  </span>
                                  <span className="event-register-multi-row-title">
                                    Registrant {index + 2}
                                  </span>
                                  <Button
                                    type="button"
                                    icon="pi pi-times"
                                    className="p-button-rounded p-button-text form-social-remove-btn event-register-multi-remove"
                                    onClick={() => handleRemoveRegistrant(index)}
                                    aria-label={`Remove registrant ${index + 2}`}
                                  />
                                </div>

                                <div className="event-register-multi-row-fields">
                                  <FormInput
                                    name={`additionalRegistrants.${index}.firstName`}
                                    label="First Name"
                                    showRequired
                                    className="modern-field"
                                  />
                                  <FormInput
                                    name={`additionalRegistrants.${index}.lastName`}
                                    label="Last Name"
                                    showRequired
                                    className="modern-field"
                                  />
                                </div>
                              </div>
                            ))}

                            <Button
                              type="button"
                              label="Add another registrant"
                              icon="pi pi-plus"
                              className="p-button-text p-button-sm form-social-add-btn"
                              onClick={() => append(EMPTY_REGISTRANT, { shouldFocus: false })}
                              style={{ fontWeight: 600 }}
                            />

                            <p className="event-register-multi-total">
                              <i className="pi pi-users" aria-hidden="true"></i>
                              <span>
                                Registering <strong>{totalRegistrants}</strong> people in
                                total, including you.
                              </span>
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Section 03: Connectivity */}
                      <div className="form-section">
                        <div className="section-title">
                          <span className="section-number">03</span>
                          <h4>Connectivity</h4>
                        </div>

                        <div className="form-row sod-form-row-1col">
                          <FormInput
                            name="cellLeader"
                            label="Cell Leader Name (optional)"
                            className="modern-field"
                          />
                        </div>

                        <FormSocialMedia
                          name="socialMedia"
                          label="Social Handles"
                          showRequired
                        />
                      </div>
                    </div>

                    {/* ── Right column: proof of payment ───────────────── */}
                    <div className="event-register-col">
                      {/* Section 04: Proof of Payment */}
                      <div className="form-section sod-payment-section">
                        <div className="section-title">
                          <span className="section-number">04</span>
                          <h4>Proof of Payment</h4>
                        </div>

                        <p className="sod-payment-intro">
                          Pay the {event.registration_fee ? `${event.registration_fee} ` : ''}registration fee by scanning
                          either QR code below, then upload your proof of payment to confirm your slot.
                        </p>

                        {totalRegistrants > 1 && (
                          <p className="event-register-multi-fee">
                            <i className="pi pi-info-circle" aria-hidden="true"></i>
                            <span>
                              You&apos;re registering <strong>{totalRegistrants} people</strong>
                              {event.registration_fee
                                ? ` (${event.registration_fee} × ${totalRegistrants})`
                                : ''}
                              . Send the total in one payment and upload that single proof —
                              it will be recorded for everyone on your list.
                            </span>
                          </p>
                        )}

                        <div className="sod-payment-grid">
                          <div className="sod-payment-card">
                            <span className="sod-payment-bank">
                              <i className="pi pi-credit-card" aria-hidden="true"></i>
                              BPI
                            </span>
                            <span className="sod-payment-qr-frame">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src="https://gtxngthtpisigkys.public.blob.vercel-storage.com/sod-payment/kc_bpi.png"
                                alt="BPI payment QR code for Gateway event registration"
                                className="sod-payment-qr"
                                loading="lazy"
                              />
                            </span>
                            <span className="sod-payment-scan">
                              <i className="pi pi-qrcode" aria-hidden="true"></i>
                              Scan to pay
                            </span>
                            <DownloadQRButton
                              qrCodeUrl="https://gtxngthtpisigkys.public.blob.vercel-storage.com/sod-payment/kc_bpi.png"
                              filename="gateway-event-bpi-qr.png"
                              color="var(--color-primary)"
                              className="sod-payment-download"
                              style={{
                                marginTop: '0.25rem',
                                padding: '0.45rem 0.9rem',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                              }}
                            />
                          </div>

                          <div className="sod-payment-card">
                            <span className="sod-payment-bank">
                              <i className="pi pi-wallet" aria-hidden="true"></i>
                              GCash
                            </span>
                            <span className="sod-payment-qr-frame">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src="https://gtxngthtpisigkys.public.blob.vercel-storage.com/sod-payment/kc_gcash.png"
                                alt="GCash payment QR code for Gateway event registration"
                                className="sod-payment-qr"
                                loading="lazy"
                              />
                            </span>
                            <span className="sod-payment-scan">
                              <i className="pi pi-qrcode" aria-hidden="true"></i>
                              Scan to pay
                            </span>
                            <DownloadQRButton
                              qrCodeUrl="https://gtxngthtpisigkys.public.blob.vercel-storage.com/sod-payment/kc_gcash.png"
                              filename="gateway-event-gcash-qr.png"
                              color="var(--color-primary)"
                              className="sod-payment-download"
                              style={{
                                marginTop: '0.25rem',
                                padding: '0.45rem 0.9rem',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                              }}
                            />
                          </div>
                        </div>

                        <ProofOfPaymentField required />

                        <p className="sod-payment-note">
                          <i className="pi pi-info-circle" aria-hidden="true"></i>
                          <span>
                            Your slot is confirmed once we verify your payment.
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="form-actions">
                    <button
                      type="submit"
                      className="vip-submit-button"
                      disabled={submitRegistration.isPending}
                    >
                      {submitRegistration.isPending ? (
                        <i className="pi pi-spin pi-spinner" aria-hidden="true"></i>
                      ) : (
                        <>
                          {totalRegistrants > 1
                            ? `Complete Registration (${totalRegistrants})`
                            : 'Complete Registration'}
                          <i className="pi pi-arrow-right" aria-hidden="true"></i>
                        </>
                      )}
                    </button>
                    <p className="privacy-note">
                      <i className="pi pi-lock" aria-hidden="true"></i>
                      Your information is safe and will only be used for church connectivity.
                    </p>
                  </div>
                </form>
              </FormProvider>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
