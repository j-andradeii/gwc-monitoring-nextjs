'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Event } from '@/data/events';
import {
  FormInput,
  FormSocialMedia,
  useScrollToFirstError,
} from '@/components/forms';
import ProofOfPaymentField from '@/components/forms/ProofOfPaymentField';
import DownloadQRButton from '@/components/ui/DownloadQRButton';
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

interface Props {
  event: Event;
}

export default function EventRegistrationSection({ event }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [registrantName, setRegistrantName] = useState<string | null>(null);

  const methods = useForm<EventRegistrationFormData>({
    resolver: zodResolver(eventRegistrationFormSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      cellLeader: '',
      email: '',
      phone: '',
      socialMedia: [{ platform: 'Facebook', handle: '' }],
      amountSent: '',
      proofOfPayment: undefined,
    },
  });

  const { handleSubmit, reset } = methods;
  const onError = useScrollToFirstError();

  const submitRegistration = useMutation({
    mutationFn: async (data: EventRegistrationFormData) => {
      const formData = new FormData();
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('cellLeader', data.cellLeader);
      formData.append('email', data.email ?? '');
      formData.append('phone', data.phone ?? '');
      formData.append('socialMedia', JSON.stringify(data.socialMedia));
      formData.append('amountSent', data.amountSent ?? '');
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
    setRegistrantName(`${data.firstName} ${data.lastName}`);
    submitRegistration.mutate(data);
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
                <div className="success-icon-wrapper">
                  <i className="pi pi-heart-fill" aria-hidden="true"></i>
                  <div className="pulse-ring" aria-hidden="true"></div>
                </div>
                <h3>Thank You!</h3>
                <p>
                  <strong>{registrantName}</strong>, your registration for{' '}
                  <strong>{event.title}</strong> is in — we&apos;ll confirm once your
                  payment is verified.
                </p>
                <button
                  type="button"
                  className="landing-btn landing-btn-primary elevated"
                  onClick={() => {
                    submitRegistration.reset();
                    reset({
                      firstName: '',
                      lastName: '',
                      cellLeader: '',
                      email: '',
                      phone: '',
                      socialMedia: [{ platform: 'Facebook', handle: '' }],
                      amountSent: '',
                      proofOfPayment: undefined,
                    });
                    setRegistrantName(null);
                  }}
                >
                  Register Another
                </button>
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

                      {/* Section 02: Connectivity */}
                      <div className="form-section">
                        <div className="section-title">
                          <span className="section-number">02</span>
                          <h4>Connectivity</h4>
                        </div>

                        <div className="form-row sod-form-row-1col">
                          <FormInput
                            name="cellLeader"
                            label="Cell Leader Name"
                            showRequired
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
                      {/* Section 03: Proof of Payment */}
                      <div className="form-section sod-payment-section">
                        <div className="section-title">
                          <span className="section-number">03</span>
                          <h4>Proof of Payment</h4>
                        </div>

                        <p className="sod-payment-intro">
                          Pay the {event.registration_fee ? `${event.registration_fee} ` : ''}registration fee by scanning
                          either QR code below, then upload your proof of payment to confirm your slot.
                        </p>

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

                        <div className="sod-amount-field">
                          <FormInput
                            name="amountSent"
                            label="Payment Amount Sent"
                            showRequired
                            placeholder={event.registration_fee}
                            className="modern-field"
                          />
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
                          Complete Registration
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
