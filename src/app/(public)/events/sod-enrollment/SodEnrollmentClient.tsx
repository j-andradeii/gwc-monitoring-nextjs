'use client';

import { useState, useId, useRef, useEffect } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import SodBirthdateField from './SodBirthdateField';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Checkbox } from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';
import { LandingHeader, LandingFooter, PageHero } from '@/components/landing';
import { FormInput, FormSelect } from '@/components/forms';
import { sodEnrollmentSchema, SOD_PROOF_MAX_BYTES, SOD_PROOF_ACCEPT } from '@/models/schemas/sod.schema';
import { useMutation } from '@tanstack/react-query';
import { convertImageToWebp } from '@/lib/image-to-webp';
import { resolveImageMime, ensureExtension, mimeFromFilename } from '@/lib/image-mime';
import DownloadQRButton from '@/components/ui/DownloadQRButton';
import '@/styles/landing.css';
import '@/styles/vip-form.css';

const SOD_STATUS_OPTIONS = [
  'Consolidator',
  'Cell leader with less than 3 disciples',
  'Cell leader with more than 3 disciples',
  "Haven't consolidated yet, willing to be trained",
  'Consolidated before but the people are not in the church anymore',
];

const SOD_CATEGORY_OPTIONS = ['Student', 'Working Professional', 'Parent'] as const;

const SOD_CLASS_OPTIONS = [
  { label: 'School of Destiny 1', value: 'School of Destiny 1' },
  { label: 'School of Destiny 2', value: 'School of Destiny 2' },
];

// Server-side body ceiling. The proof image is POSTed THROUGH the route
// (multipart), so it must stay under Vercel's ~4.5 MB serverless body limit —
// exceeding it returns an opaque HTML "A server error occurred" page, not our
// JSON error. The client converter downscales every upload well below this; the
// guard below catches the rare case where decoding failed and the original
// (e.g. a multi-MB iPhone HEIC) was returned untouched.
const SOD_UPLOAD_SAFE_BYTES = 4 * 1024 * 1024; // 4 MB

// Client-side form schema = enrollment fields + the optional proof-of-payment File.
// (The server route validates the fields + the resulting Blob URL instead.)
const proofOfPaymentSchema = z
  .instanceof(File)
  .refine((file) => file.size <= SOD_PROOF_MAX_BYTES, 'File must be 10 MB or smaller')
  .refine(
    (file) => file.type.startsWith('image/') || mimeFromFilename(file.name) !== null,
    'Please upload an image file'
  )
  .optional();

const sodEnrollmentFormSchema = sodEnrollmentSchema.extend({
  proofOfPayment: proofOfPaymentSchema,
});

type SodEnrollmentFormData = z.infer<typeof sodEnrollmentFormSchema>;

export default function SodEnrollmentClient() {
  const [enrolledName, setEnrolledName] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const checkboxGroupId = useId();
  const radioGroupId = useId();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const methods = useForm<SodEnrollmentFormData>({
    resolver: zodResolver(sodEnrollmentFormSchema),
    mode: 'onChange',
    defaultValues: {
      surname: '',
      givenName: '',
      middleName: '',
      mobileNumber: '',
      birthdate: undefined,
      cellLeader: '',
      classToEnroll: undefined,
      category: undefined,
      status: [],
      amountSent: '',
      proofOfPayment: undefined,
    },
  });

  const { handleSubmit, reset } = methods;

  // Live preview for the selected proof-of-payment image.
  // eslint-disable-next-line react-hooks/incompatible-library
  const proofFile = methods.watch('proofOfPayment') as File | undefined;
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  useEffect(() => {
    if (proofFile instanceof File) {
      const objectUrl = URL.createObjectURL(proofFile);
      setProofPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setProofPreview(null);
  }, [proofFile]);

  const submitSodEnrollment = useMutation({
    mutationFn: async (data: SodEnrollmentFormData) => {
      // Send everything (incl. the proof image) as multipart/form-data so the
      // route can upload the file straight to Google Drive and embed it in the
      // ENROLLEES sheet via =IMAGE(). apiClient is JSON-only, so we use fetch.
      const formData = new FormData();
      formData.append('surname', data.surname);
      formData.append('givenName', data.givenName);
      formData.append('middleName', data.middleName ?? '');
      formData.append('mobileNumber', data.mobileNumber);
      formData.append('birthdate', data.birthdate ? data.birthdate.toISOString() : '');
      formData.append('cellLeader', data.cellLeader);
      formData.append('classToEnroll', data.classToEnroll);
      formData.append('category', data.category);
      formData.append('status', JSON.stringify(data.status));
      formData.append('amountSent', data.amountSent ?? '');
      if (data.proofOfPayment) {
        formData.append('proofOfPayment', data.proofOfPayment);
      }

      const response = await fetch('/api/events/sod-enrollment', {
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
      reset();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },
  });

  const onSubmit = (data: SodEnrollmentFormData) => {
    setEnrolledName(`${data.givenName} ${data.surname}`);
    submitSodEnrollment.mutate(data);
  };

  return (
    <div className="landing-page sod-enrollment-page" style={{ background: '#fcfcfd' }}>
      <LandingHeader />

      <PageHero
        badge="Ministries"
        title="School of Destiny"
        subtitle="ENROLLMENT IS NOW OPEN"
        backgroundImage="https://gtxngthtpisigkys.public.blob.vercel-storage.com/events/SOD-ENROLLMENT.webp"
        displayBadge={false}
      />

      <main className="sod-main">
        <div className="landing-container">
          <div className="vip-layout-grid">

            {/* Left Side: Welcome Card */}
            <div className="vip-welcome-card sod-welcome-card">
              <div className="glass-overlay" />
              <div className="card-content">
                <span className="sod-welcome-eyebrow">Discipleship Program</span>
                <h2 className="welcome-title">Welcome to School of Destiny!</h2>
                <p className="welcome-text">
                  School of Destiny (SOD) is a discipleship program designed to train and equip cell leaders and consolidators to fulfill the Great Commission.
                </p>

                <div className="sod-info-list">
                  <div className="sod-info-row">
                    <span className="sod-info-icon"><i className="pi pi-calendar"></i></span>
                    <span className="sod-info-text">
                      <span className="sod-info-label">Enrollment closes</span>
                      <span className="sod-info-value">June 28, 2026</span>
                    </span>
                  </div>
                  <div className="sod-info-row">
                    <span className="sod-info-icon"><i className="pi pi-tag"></i></span>
                    <span className="sod-info-text">
                      <span className="sod-info-label">Enrollment fee</span>
                      <span className="sod-info-value">PHP 500</span>
                    </span>
                  </div>
                  <div className="sod-info-row">
                    <span className="sod-info-icon"><i className="pi pi-send"></i></span>
                    <span className="sod-info-text">
                      <span className="sod-info-label">Payment</span>
                      <span className="sod-info-value">Send e-receipts to KC</span>
                    </span>
                  </div>
                </div>

                <div className="sod-highlight">
                  <span className="sod-highlight-icon"><i className="pi pi-book"></i></span>
                  <span className="sod-highlight-text">
                    <span className="sod-highlight-label">Class Starts</span>
                    <span className="sod-highlight-value">July 05, 2026</span>
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
              {submitSodEnrollment.isSuccess ? (
                <div className="success-animation-container">
                  <div className="success-icon-wrapper">
                    <i className="pi pi-heart-fill"></i>
                    <div className="pulse-ring"></div>
                  </div>
                  <h3>Thank You!</h3>
                  <p>
                    Thank you for enrolling in School of Destiny, <strong>{enrolledName}</strong>!
                    We look forward to seeing you grow in discipleship.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      submitSodEnrollment.reset();
                      reset({
                        surname: '',
                        givenName: '',
                        middleName: '',
                        mobileNumber: '',
                        birthdate: undefined,
                        cellLeader: '',
                        classToEnroll: undefined,
                        category: undefined,
                        status: [],
                        amountSent: '',
                        proofOfPayment: undefined,
                      });
                      setEnrolledName(null);
                    }}
                    className="landing-btn landing-btn-primary elevated"
                  >
                    Submit Another Enrollment
                  </button>
                </div>
              ) : (
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmit)} className="advanced-vip-form" aria-busy={submitSodEnrollment.isPending}>
                    <div className="form-header">
                      <span className="step-label">Enrollment Form</span>
                      <h3 className="form-main-title">School of Destiny</h3>
                    </div>

                    {submitSodEnrollment.isError && (
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

                      <div className="form-row sod-form-row-2col">
                        <FormInput
                          name="givenName"
                          label="Given Name"
                          placeholder="e.g. Maria"
                          showRequired
                          className="modern-field"
                        />
                        <FormInput
                          name="surname"
                          label="Surname"
                          placeholder="e.g. Santos"
                          showRequired
                          className="modern-field"
                        />
                      </div>

                      <div className="form-row sod-form-row-2col">
                        <FormInput
                          name="mobileNumber"
                          label="Mobile Number"
                          placeholder="0917 XXX XXXX"
                          showRequired
                          className="modern-field"
                          type="tel"
                          inputMode="tel"
                        />
                      </div>

                      <div className="form-row sod-form-row-2col">
                        <SodBirthdateField />
                      </div>


                    </div>

                    {/* Section 02: Enrollment Details */}
                    <div className="form-section">
                      <div className="section-title">
                        <span className="section-number">02</span>
                        <h4>Enrollment Details</h4>
                      </div>

                      <div className="form-row sod-form-row-1col mt-3 mb-3">
                        <FormInput
                          name="cellLeader"
                          label="Cell Leader Name"
                          placeholder="Name of your cell leader"
                          showRequired
                          className="modern-field"
                        />
                      </div>

                      <FormSelect
                        name="classToEnroll"
                        label="Which class to enroll?"
                        placeholder="Select a class"
                        showRequired
                        options={SOD_CLASS_OPTIONS}
                      />

                      <div style={{ marginTop: '16px' }}>
                        <Controller
                          name="category"
                          control={methods.control}
                          render={({ field, fieldState }) => (
                            <fieldset className="sod-radio-fieldset" aria-required="true">
                              <legend className="sod-radio-legend">
                                Category
                                <span className="form-required" aria-hidden="true">*</span>
                              </legend>

                              <div className="sod-radio-group" role="radiogroup">
                                {SOD_CATEGORY_OPTIONS.map((opt) => {
                                  const optionId = `sod-cat-${radioGroupId}-${opt.replace(/\s+/g, '-')}`;
                                  const isChecked = field.value === opt;

                                  return (
                                    <label
                                      key={opt}
                                      htmlFor={optionId}
                                      className={`sod-radio-option${isChecked ? ' sod-radio-option--checked' : ''}`}
                                    >
                                      <RadioButton
                                        inputId={optionId}
                                        name={field.name}
                                        value={opt}
                                        checked={isChecked}
                                        onChange={(e) => {
                                          field.onChange(e.value);
                                          field.onBlur();
                                        }}
                                        onBlur={field.onBlur}
                                        className="sod-radio-input"
                                      />
                                      <span className="sod-radio-option-text">{opt}</span>
                                    </label>
                                  );
                                })}
                              </div>

                              {fieldState.invalid && fieldState.error?.message && (
                                <p className="sod-radio-error" role="alert">
                                  <i className="pi pi-exclamation-circle"></i>
                                  {fieldState.error.message}
                                </p>
                              )}
                            </fieldset>
                          )}
                        />
                      </div>
                    </div>

                    {/* Section 03: Your Status */}
                    <div className="form-section">
                      <div className="section-title">
                        <span className="section-number">03</span>
                        <h4>Your Status</h4>
                      </div>

                      <Controller
                        name="status"
                        control={methods.control}
                        render={({ field, fieldState }) => (
                          <fieldset className="sod-status-fieldset" aria-required="true">
                            <legend className="sod-status-legend">
                              Choose the status that applies to you
                              <span className="form-required" aria-hidden="true">*</span>
                            </legend>

                            <div className="sod-status-group" role="group">
                              {SOD_STATUS_OPTIONS.map((option) => {
                                const optionId = `sod-status-${checkboxGroupId}-${option.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')}`;
                                const isChecked = field.value.includes(option);

                                return (
                                  <label
                                    key={option}
                                    htmlFor={optionId}
                                    className={`sod-status-option${isChecked ? ' sod-status-option--checked' : ''}`}
                                  >
                                    <Checkbox
                                      inputId={optionId}
                                      checked={isChecked}
                                      onChange={() => {
                                        const current = field.value as string[];
                                        if (current.includes(option)) {
                                          field.onChange(current.filter((v) => v !== option));
                                        } else {
                                          field.onChange([...current, option]);
                                        }
                                      }}
                                      onBlur={field.onBlur}
                                      className="sod-status-checkbox"
                                    />
                                    <span className="sod-status-option-text">{option}</span>
                                  </label>
                                );
                              })}
                            </div>

                            {fieldState.invalid && fieldState.error?.message && (
                              <p className="sod-status-error" role="alert">
                                <i className="pi pi-exclamation-circle"></i>
                                {fieldState.error.message}
                              </p>
                            )}
                          </fieldset>
                        )}
                      />
                    </div>

                    {/* Section 04: Proof of Payment */}
                    <div className="form-section sod-payment-section">
                      <div className="section-title">
                        <span className="section-number">04</span>
                        <h4>Proof of Payment</h4>
                      </div>

                      <p className="sod-payment-intro">
                        Pay the <strong>₱500</strong> enrollment fee by scanning either QR
                        code below, then upload your proof of payment to confirm your slot.
                      </p>

                      <div className="sod-payment-grid">
                        <div className="sod-payment-card">
                          <span className="sod-payment-bank">
                            <i className="pi pi-credit-card"></i>
                            BPI
                          </span>
                          <span className="sod-payment-qr-frame">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="https://gtxngthtpisigkys.public.blob.vercel-storage.com/sod-payment/kc_bpi.png"
                              alt="BPI payment QR code for School of Destiny enrollment"
                              className="sod-payment-qr"
                              loading="lazy"
                            />
                          </span>
                          <span className="sod-payment-scan">
                            <i className="pi pi-qrcode"></i>
                            Scan to pay
                          </span>
                          <DownloadQRButton
                            qrCodeUrl="https://gtxngthtpisigkys.public.blob.vercel-storage.com/sod-payment/kc_bpi.png"
                            filename="gateway-sod-bpi-qr.png"
                            color="var(--color-primary)"
                            className="sod-payment-download"
                            style={{ marginTop: '0.25rem', padding: '0.45rem 0.9rem', fontSize: '0.78rem', fontWeight: 700 }}
                          />
                        </div>

                        <div className="sod-payment-card">
                          <span className="sod-payment-bank">
                            <i className="pi pi-wallet"></i>
                            GCash
                          </span>
                          <span className="sod-payment-qr-frame">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="https://gtxngthtpisigkys.public.blob.vercel-storage.com/sod-payment/kc_gcash.png"
                              alt="GCash payment QR code for School of Destiny enrollment"
                              className="sod-payment-qr"
                              loading="lazy"
                            />
                          </span>
                          <span className="sod-payment-scan">
                            <i className="pi pi-qrcode"></i>
                            Scan to pay
                          </span>
                          <DownloadQRButton
                            qrCodeUrl="https://gtxngthtpisigkys.public.blob.vercel-storage.com/sod-payment/kc_gcash.png"
                            filename="gateway-sod-gcash-qr.png"
                            color="var(--color-primary)"
                            className="sod-payment-download"
                            style={{ marginTop: '0.25rem', padding: '0.45rem 0.9rem', fontSize: '0.78rem', fontWeight: 700 }}
                          />
                        </div>
                      </div>

                      <div className="sod-amount-field">
                        <FormInput
                          name="amountSent"
                          label="Payment Amount Sent (optional)"
                          placeholder="e.g. 500"
                          className="modern-field"
                        />
                      </div>

                      <div className="sod-upload-field">
                        <span className="sod-upload-label">
                          Upload proof of payment
                          <span className="sod-upload-optional">(optional)</span>
                        </span>
                        <span className="sod-upload-sublabel">Upload 1 supported image. Max 10 MB.</span>

                        <Controller
                          name="proofOfPayment"
                          control={methods.control}
                          render={({ field, fieldState }) => (
                            <div className="sod-upload">
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept={SOD_PROOF_ACCEPT}
                                className="sod-upload-input"
                                onChange={async (e) => {
                                  const picked = e.target.files?.[0];
                                  e.target.value = ''; // reset early so re-picking the same file fires change
                                  setUploadError(null);
                                  if (!picked) {
                                    field.onChange(undefined);
                                    field.onBlur();
                                    return;
                                  }
                                  setIsConverting(true);
                                  try {
                                    // Capture the bytes IMMEDIATELY. A macOS screenshot dragged from its
                                    // floating thumbnail lives in a temp file the OS may delete moments later,
                                    // and often arrives with an empty File.type — reading now gives us stable,
                                    // owned bytes and lets us recover the real image type by sniffing.
                                    const buffer = await picked.arrayBuffer();
                                    const mime = resolveImageMime(new Uint8Array(buffer), picked.type || '', picked.name);

                                    if (!mime) {
                                      setUploadError('That file isn’t a supported image. Please upload a PNG, JPG, or a saved screenshot.');
                                      field.onChange(undefined);
                                      return;
                                    }

                                    // Stable in-memory File with a correct type + extension — works even if the
                                    // original temp file disappears before the form is submitted.
                                    const stable = new File([buffer], ensureExtension(picked.name, mime), {
                                      type: mime,
                                      lastModified: picked.lastModified,
                                    });

                                    let finalFile: File = stable;
                                    try {
                                      finalFile = await convertImageToWebp(stable);
                                    } catch {
                                      finalFile = stable; // the server re-encodes to WebP; never lose the upload
                                    }

                                    // Safety net for the rare device where decoding failed and the original
                                    // was returned untouched. A still-HEIC file can't render in the preview
                                    // and the server can't decode it; an oversized file blows past Vercel's
                                    // body limit → opaque "server error". In both cases, guide the user to a
                                    // working format instead of letting the submit fail cryptically.
                                    const stillUndecodable = /image\/(heic|heif)/i.test(finalFile.type);
                                    if (stillUndecodable || finalFile.size > SOD_UPLOAD_SAFE_BYTES) {
                                      setUploadError(
                                        'We couldn’t process that photo on your device. Please take a screenshot of it (or save a copy as JPG) and upload that instead.'
                                      );
                                      field.onChange(undefined);
                                      return;
                                    }

                                    field.onChange(finalFile);
                                  } catch {
                                    setUploadError('We couldn’t read that file. If you dragged a screenshot preview, save it to your device first, then upload it.');
                                    field.onChange(undefined);
                                  } finally {
                                    setIsConverting(false);
                                    field.onBlur();
                                  }
                                }}
                              />

                              {proofPreview ? (
                                <div className="sod-upload-preview">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={proofPreview}
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
                                      <i className="pi pi-spin pi-spinner"></i>
                                      <span className="sod-upload-cta">Optimizing image&hellip;</span>
                                    </>
                                  ) : (
                                    <>
                                      <i className="pi pi-cloud-upload"></i>
                                      <span className="sod-upload-cta">Add file</span>
                                      <span className="sod-upload-hint">Tap to upload a screenshot · Max 10 MB</span>
                                    </>
                                  )}
                                </button>
                              )}

                              {fieldState.invalid && fieldState.error?.message && (
                                <p className="sod-radio-error" role="alert">
                                  <i className="pi pi-exclamation-circle"></i>
                                  {fieldState.error.message}
                                </p>
                              )}
                              {uploadError && (
                                <p className="sod-radio-error" role="alert">
                                  <i className="pi pi-exclamation-circle"></i>
                                  {uploadError}
                                </p>
                              )}
                            </div>
                          )}
                        />
                      </div>

                      <p className="sod-payment-note">
                        <i className="pi pi-info-circle"></i>
                        <span>
                          Your enrollment is confirmed once we verify your payment. Questions?
                          Message <strong>KC</strong>.
                        </span>
                      </p>
                    </div>

                    <div className="form-actions">
                      <button
                        type="submit"
                        className="vip-submit-button"
                        disabled={submitSodEnrollment.isPending}
                      >
                        {submitSodEnrollment.isPending ? (
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
