'use client';

import { useId, useState } from 'react';
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form';
import type { DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RadioButton } from 'primereact/radiobutton';
import { useMutation } from '@tanstack/react-query';
import { LandingHeader, LandingFooter, PosterHero } from '@/components/landing';
import {
  FormInput,
  FormMaskedDate,
  ProofOfPaymentField,
  useScrollToFirstError,
} from '@/components/forms';
import { proofOfPaymentFileSchema } from '@/models/schemas/proof-of-payment.schema';
import {
  LIFECLASS_CATEGORY_OPTIONS,
  lifeclassEnrollmentSchema,
} from '@/models/schemas/lifeclass.schema';
import DownloadQRButton from '@/components/ui/DownloadQRButton';
import '@/styles/landing.css';
import '@/styles/vip-form.css';

/**
 * The enrollment poster — the wide (8:3) cut, made to run edge to edge as a
 * hero band. `width`/`height` are the file's real pixel size and must be
 * updated with the URL: PosterHero derives the band's height from that ratio,
 * so a stale pair makes the page jump as the image loads.
 *
 * page.tsx keeps the full 16:9 original as the OG image — social cards want a
 * squarer crop than a hero band does.
 */
const LIFECLASS_POSTER = {
  src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/events/lc-wide.webp',
  width: 1920,
  height: 720,
} as const;

/**
 * The phone cut, used below 640px. Art direction, not just a smaller file: the
 * 8:3 banner collapses to a ~146px strip on a 390px screen, where the class
 * dates printed on it are barely legible. This 16:9 original is 220px tall
 * there and reads properly.
 */
const LIFECLASS_POSTER_MOBILE = {
  src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/events/LIFECLASS-ENROLLMENT.webp',
  width: 1920,
  height: 1080,
} as const;

/**
 * Batch details shown on the welcome card and in the payment section.
 *
 * Collected here (rather than inline in the markup) so rolling the page over to
 * the next batch is one edit in one place, and so a stale date can't hide
 * halfway down the JSX.
 *
 * The dates come from the poster itself (Batch 3: enroll Aug 16 – Sep 13, class
 * starts Oct 4).
 */
const LIFECLASS_BATCH = {
  enrollmentCloses: 'September 13, 2026',
  classStarts: 'October 4, 2026',
  /**
   * Rendered as-is in the welcome card's fee line and in the payment intro.
   * Paying is NOT required to submit the form — see section 03, where both the
   * amount and the proof image are optional.
   */
  fee: 'PHP 500',
  /** Who an enrollee follows up with about payment. */
  contact: 'the Life Class team',
} as const;

/**
 * Payment QR codes. Currently the same account the SOD enrollment uses — swap
 * these if Life Class fees are collected through a different account.
 */
const LIFECLASS_PAYMENT_QRS = [
  {
    bank: 'BPI',
    icon: 'pi pi-credit-card',
    src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/sod-payment/kc_bpi.png',
    filename: 'gateway-lifeclass-bpi-qr.png',
  },
  {
    bank: 'GCash',
    icon: 'pi pi-wallet',
    src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/sod-payment/kc_gcash.png',
    filename: 'gateway-lifeclass-gcash-qr.png',
  },
] as const;

// Client-side form schema = the enrollment fields + the optional proof image.
// (The route validates the fields + the resulting Blob URL instead — a File
// only exists in the browser.)
const lifeclassEnrollmentFormSchema = lifeclassEnrollmentSchema.extend({
  proofOfPayment: proofOfPaymentFileSchema.optional(),
});

type LifeclassEnrollmentFormData = z.infer<typeof lifeclassEnrollmentFormSchema>;

/** Shared by `defaultValues` and every `reset()` so the two can't drift apart. */
const EMPTY_FORM: DefaultValues<LifeclassEnrollmentFormData> = {
  surname: '',
  givenName: '',
  email: '',
  mobileNumber: '',
  birthdate: undefined,
  cellLeader: '',
  category: undefined,
  amountSent: '',
  proofOfPayment: undefined,
};

interface RadioCardGroupProps {
  name: string;
  legend: string;
  options: readonly string[];
  required?: boolean;
}

/**
 * Radio buttons rendered as tappable cards — the same treatment as the SOD
 * form's category group, factored out here because this page asks two of these
 * questions (Category, and whether they've been to a Lifeclass Party).
 */
function RadioCardGroup({ name, legend, options, required = false }: RadioCardGroupProps) {
  const { control } = useFormContext();
  const groupId = useId();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <fieldset
          className="sod-radio-fieldset"
          aria-required={required ? 'true' : undefined}
          data-form-error={fieldState.invalid ? '' : undefined}
        >
          <legend className="sod-radio-legend">
            {legend}
            {required && (
              <span className="form-required" aria-hidden="true">
                *
              </span>
            )}
          </legend>

          <div className="sod-radio-group" role="radiogroup">
            {options.map((option) => {
              const optionId = `lc-${name}-${groupId}-${option.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')}`;
              const isChecked = field.value === option;

              return (
                <label
                  key={option}
                  htmlFor={optionId}
                  className={`sod-radio-option${isChecked ? ' sod-radio-option--checked' : ''}`}
                >
                  <RadioButton
                    inputId={optionId}
                    name={field.name}
                    value={option}
                    checked={isChecked}
                    onChange={(e) => {
                      field.onChange(e.value);
                      field.onBlur();
                    }}
                    onBlur={field.onBlur}
                    className="sod-radio-input"
                  />
                  <span className="sod-radio-option-text">{option}</span>
                </label>
              );
            })}
          </div>

          {fieldState.invalid && fieldState.error?.message && (
            <p className="sod-radio-error" role="alert">
              <i className="pi pi-exclamation-circle" aria-hidden="true"></i>
              {fieldState.error.message}
            </p>
          )}
        </fieldset>
      )}
    />
  );
}

export default function LifeclassEnrollmentClient() {
  const [enrolledName, setEnrolledName] = useState<string | null>(null);

  const methods = useForm<LifeclassEnrollmentFormData>({
    resolver: zodResolver(lifeclassEnrollmentFormSchema),
    mode: 'onChange',
    defaultValues: EMPTY_FORM,
  });

  const { handleSubmit, reset } = methods;

  const submitEnrollment = useMutation({
    mutationFn: async (data: LifeclassEnrollmentFormData) => {
      // multipart/form-data, not JSON: the proof image is POSTed THROUGH the
      // route so it can be uploaded to Blob storage server-side and embedded in
      // the sheet. apiClient is JSON-only, so this uses fetch directly.
      const formData = new FormData();
      formData.append('surname', data.surname);
      formData.append('givenName', data.givenName);
      formData.append('email', data.email);
      formData.append('mobileNumber', data.mobileNumber ?? '');
      formData.append('birthdate', data.birthdate ? data.birthdate.toISOString() : '');
      formData.append('cellLeader', data.cellLeader);
      formData.append('category', data.category);
      formData.append('amountSent', data.amountSent ?? '');
      if (data.proofOfPayment) {
        formData.append('proofOfPayment', data.proofOfPayment);
      }

      const response = await fetch('/api/events/lifeclass-enrollment', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || err.message || 'Submission failed');
      }

      return response.json();
    },
    onSuccess: () => {
      reset(EMPTY_FORM);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  });

  const onSubmit = (data: LifeclassEnrollmentFormData) => {
    setEnrolledName(`${data.givenName} ${data.surname}`);
    submitEnrollment.mutate(data);
  };

  // On a failed submit, scroll the first invalid field into view (mobile + desktop).
  const onError = useScrollToFirstError();

  return (
    // `sod-enrollment-page` is the shared enrollment-form skin in vip-form.css
    // (tighter rhythm, bolder labels, the payment section, the mobile fixes);
    // `lifeclass-enrollment-page` is this page's own hook for anything that
    // should differ from SOD later.
    <div
      className="landing-page sod-enrollment-page lifeclass-enrollment-page"
      style={{ background: '#fcfcfd' }}
    >
      <LandingHeader />

      {/* PosterHero, not PageHero: the enrollment poster carries the dates in
          its top and bottom thirds, which a `cover` background crops away.
          `title` is the page's <h1> — read by crawlers and screen readers,
          never drawn, since the poster is the visible headline. */}
      <PosterHero
        image={LIFECLASS_POSTER.src}
        imageWidth={LIFECLASS_POSTER.width}
        imageHeight={LIFECLASS_POSTER.height}
        mobileImage={LIFECLASS_POSTER_MOBILE}
        imageAlt="LifeClass Batch 3 enrollment poster — enroll August 16 until September 13, 2026; class starts October 4"
        title="Life Class Enrollment"
      />

      <main className="sod-main">
        <div className="landing-container">
          <div className="vip-layout-grid">

            {/* Left Side: Welcome Card */}
            <div className="vip-welcome-card sod-welcome-card">
              <div className="glass-overlay" />
              <div className="card-content">
                <span className="sod-welcome-eyebrow">Discipleship Journey</span>
                <h2 className="welcome-title">Welcome to Life Class!</h2>
                <p className="welcome-text">
                  Life Class is is a nine-week course designed to strengthen the faith of new believers and prepare them for a personal encounter with God
                </p>

                <div className="sod-info-list">
                  <div className="sod-info-row">
                    <span className="sod-info-icon"><i className="pi pi-calendar"></i></span>
                    <span className="sod-info-text">
                      <span className="sod-info-label">Enrollment closes</span>
                      <span className="sod-info-value">{LIFECLASS_BATCH.enrollmentCloses}</span>
                    </span>
                  </div>
                  <div className="sod-info-row">
                    <span className="sod-info-icon"><i className="pi pi-tag"></i></span>
                    <span className="sod-info-text">
                      <span className="sod-info-label">Enrollment fee</span>
                      <span className="sod-info-value">{LIFECLASS_BATCH.fee}</span>
                    </span>
                  </div>
                  <div className="sod-info-row">
                    <span className="sod-info-icon"><i className="pi pi-users"></i></span>
                    <span className="sod-info-text">
                      <span className="sod-info-label">Who it&rsquo;s for</span>
                      <span className="sod-info-value">Anyone starting out with Jesus</span>
                    </span>
                  </div>
                </div>

                <div className="sod-highlight">
                  <span className="sod-highlight-icon"><i className="pi pi-book"></i></span>
                  <span className="sod-highlight-text">
                    <span className="sod-highlight-label">Class Starts</span>
                    <span className="sod-highlight-value">{LIFECLASS_BATCH.classStarts}</span>
                  </span>
                </div>

                <div className="card-footer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/images/church-logo-white.png" alt="Gateway Logo" style={{ height: '30px', opacity: 0.8 }} />
                </div>
              </div>
            </div>

            {/* Right Side: Enrollment Form */}
            <div className="vip-form-container">
              {submitEnrollment.isSuccess ? (
                <div className="success-animation-container">
                  <div className="success-icon-wrapper">
                    <i className="pi pi-heart-fill"></i>
                    <div className="pulse-ring"></div>
                  </div>
                  <h3>Thank You!</h3>
                  <p>
                    Thank you for enrolling in Life Class, <strong>{enrolledName}</strong>!
                    We can&rsquo;t wait to journey with you.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      submitEnrollment.reset();
                      reset(EMPTY_FORM);
                      setEnrolledName(null);
                    }}
                    className="landing-btn landing-btn-primary elevated"
                  >
                    Submit Another Enrollment
                  </button>
                </div>
              ) : (
                <FormProvider {...methods}>
                  <form
                    onSubmit={handleSubmit(onSubmit, onError)}
                    className="advanced-vip-form"
                    aria-busy={submitEnrollment.isPending}
                  >
                    <div className="form-header">
                      <span className="step-label">Enrollment Form</span>
                      <h3 className="form-main-title">Life Class</h3>
                    </div>

                    {submitEnrollment.isError && (
                      <div className="form-error-alert" role="alert">
                        <i className="pi pi-info-circle"></i>
                        Something went wrong. Please try again.
                      </div>
                    )}

                    {/* Section 01: Personal Information */}
                    <div className="form-section">
                      <div className="section-title">
                        <span className="section-number">01</span>
                        <h4>Personal Information</h4>
                      </div>

                      <div className="form-row sod-form-row-1col">
                        <FormInput
                          name="givenName"
                          label="First Name"
                          placeholder=""
                          showRequired
                          className="modern-field"
                        />
                      </div>

                      <div className="form-row sod-form-row-1col">
                        <FormInput
                          name="surname"
                          label="Last Name"
                          placeholder=""
                          showRequired
                          className="modern-field"
                        />
                      </div>

                      <div className="form-row sod-form-row-1col">
                        <FormInput
                          name="email"
                          label="Email"
                          placeholder="you@example.com"
                          showRequired
                          className="modern-field"
                          type="email"
                          inputMode="email"
                        />
                      </div>

                      <div className="form-row sod-form-row-1col">
                        <FormInput
                          name="mobileNumber"
                          label="Mobile Number (optional)"
                          placeholder="0917 XXX XXXX"
                          className="modern-field"
                          type="tel"
                          inputMode="tel"
                        />
                      </div>

                      <div className="form-row sod-form-row-1col">
                        <FormMaskedDate name="birthdate" label="Birthdate" showRequired />
                      </div>
                    </div>

                    {/* Section 02: Enrollment Details */}
                    <div className="form-section">
                      <div className="section-title">
                        <span className="section-number">02</span>
                        <h4>Enrollment Details</h4>
                      </div>

                      <div className="form-row sod-form-row-1col">
                        <FormInput
                          name="cellLeader"
                          label="Cell Leader"
                          placeholder="Name of your cell leader"
                          showRequired
                          className="modern-field"
                        />
                      </div>

                      <RadioCardGroup
                        name="category"
                        legend="Category"
                        options={LIFECLASS_CATEGORY_OPTIONS}
                        required
                      />
                    </div>

                    {/* Section 03: Proof of Payment */}
                    <div className="form-section sod-payment-section">
                      <div className="section-title">
                        <span className="section-number">03</span>
                        <h4>Payment (optional)</h4>
                      </div>

                      <p className="sod-payment-intro">
                        The Life Class enrollment fee is <strong>{LIFECLASS_BATCH.fee}</strong>.
                        Paying now is optional — you can submit this form first and settle the fee
                        before class starts. If you&rsquo;d like to pay now, scan either QR code
                        below and upload your proof of payment.
                      </p>

                      <div className="sod-payment-grid">
                        {LIFECLASS_PAYMENT_QRS.map((qr) => (
                          <div className="sod-payment-card" key={qr.bank}>
                            <span className="sod-payment-bank">
                              <i className={qr.icon}></i>
                              {qr.bank}
                            </span>
                            <span className="sod-payment-qr-frame">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={qr.src}
                                alt={`${qr.bank} payment QR code for Life Class enrollment`}
                                className="sod-payment-qr"
                                loading="lazy"
                              />
                            </span>
                            <span className="sod-payment-scan">
                              <i className="pi pi-qrcode"></i>
                              Scan to pay
                            </span>
                            <DownloadQRButton
                              qrCodeUrl={qr.src}
                              filename={qr.filename}
                              color="var(--color-primary)"
                              className="sod-payment-download"
                              style={{ marginTop: '0.25rem', padding: '0.45rem 0.9rem', fontSize: '0.78rem', fontWeight: 700 }}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="sod-amount-field">
                        <FormInput
                          name="amountSent"
                          label="Payment Amount Sent (optional)"
                          placeholder="e.g. 500"
                          className="modern-field"
                        />
                      </div>

                      <ProofOfPaymentField />

                      <p className="sod-payment-note">
                        <i className="pi pi-info-circle"></i>
                        <span>
                          Your slot is reserved as soon as you submit — your payment just needs to
                          reach us before {LIFECLASS_BATCH.classStarts}. Questions?
                          Message <strong>{LIFECLASS_BATCH.contact}</strong>.
                        </span>
                      </p>
                    </div>

                    <div className="form-actions">
                      <button
                        type="submit"
                        className="vip-submit-button"
                        disabled={submitEnrollment.isPending}
                      >
                        {submitEnrollment.isPending ? (
                          <i className="pi pi-spin pi-spinner"></i>
                        ) : (
                          <>
                            Complete Enrollment
                            <i className="pi pi-arrow-right"></i>
                          </>
                        )}
                      </button>
                      <p className="privacy-note">
                        <i className="pi pi-lock"></i>
                        Your information is safe and will only be used for church connectivity.
                      </p>
                    </div>
                  </form>
                </FormProvider>
              )}
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
