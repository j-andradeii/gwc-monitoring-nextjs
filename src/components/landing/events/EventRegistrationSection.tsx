'use client';

import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from 'react';
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
import { FormInput, useScrollToFirstError } from '@/components/forms';
import ProofOfPaymentField from '@/components/forms/ProofOfPaymentField';
import CompleteRegistrationPanel, {
  type RecordedProof,
} from '@/components/landing/events/CompleteRegistrationPanel';
import EventPaymentQrGrid from '@/components/landing/events/EventPaymentQrGrid';
import { useDownloadImage } from '@/hooks/useDownloadImage';
import { createRegistrationReceiptImage } from '@/lib/registration-receipt';
import { eventRegistrationSchema } from '@/models/schemas/event-registration.schema';
import { proofOfPaymentFileSchema } from '@/models/schemas/proof-of-payment.schema';
import '@/styles/landing.css';
import '@/styles/vip-form.css';

// Client-side Zod schema — extends the base schema with the proof file.
// The proof is OPTIONAL: a registrant may reserve their slot now and send the
// payment later from the "Complete your registration" panel, which matches
// their reference number back to these rows.
const eventRegistrationFormSchema = eventRegistrationSchema.extend({
  proofOfPayment: proofOfPaymentFileSchema.optional(),
});

type EventRegistrationFormData = z.infer<typeof eventRegistrationFormSchema>;

const EMPTY_REGISTRANT = { firstName: '', lastName: '' };

// Shape of the reference numbers the registration route hands out
// (`GWC-YYMMDD-XXXXX`). Anything else arriving in `?ref=` is ignored rather
// than typed into the field for the registrant to puzzle over.
const REFERENCE_PATTERN = /^GWC-\d{6}-[A-Z0-9]{5}$/;

/**
 * `?ref=` — the reference number carried in by the "Upload proof of payment"
 * button of the registration email, which links to
 * `/events/<slug>?ref=…#event-complete`.
 *
 * Read through `useSyncExternalStore` rather than `useSearchParams()`: this
 * page is prerendered (see generateStaticParams in the [slug] route) and that
 * hook would force it behind a Suspense boundary. The server snapshot is null,
 * so the prerendered HTML still matches at hydration and the value arrives on
 * the render straight after it.
 */
const subscribeToLocation = (onChange: () => void) => {
  window.addEventListener('popstate', onChange);
  return () => window.removeEventListener('popstate', onChange);
};
const readReferenceParam = () => new URLSearchParams(window.location.search).get('ref');
const readNoReferenceParam = () => null;

const DEFAULT_FORM_VALUES: DefaultValues<EventRegistrationFormData> = {
  firstName: '',
  lastName: '',
  cellLeader: '',
  email: '',
  phone: '',
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
  const panelToggleRef = useRef<HTMLButtonElement>(null);
  const multiToggleId = useId();
  /**
   * Whether the "Already Registered?" panel is open.
   *
   * `null` means "nobody has touched the tab yet", which lets the default fall
   * out of `?ref=`: arriving from the registration email opens the panel, so
   * the button in it lands on something already filled in rather than on a
   * page to go hunting through. Derived rather than synced in an effect —
   * setting state from an effect here would cost a cascading render on every
   * visit.
   */
  const [panelOverride, setPanelOverride] = useState<boolean | null>(null);
  // Names captured at submit time — the form is reset behind the success screen.
  const [registeredNames, setRegisteredNames] = useState<string[]>([]);
  // Set when a proof of payment is sent later against an existing reference
  // number instead of with the form. It reaches the same confirmation screen,
  // built from what the sheet gave back rather than from this form's values.
  const [recordedProof, setRecordedProof] = useState<RecordedProof | null>(null);
  const [isSavingReceipt, setIsSavingReceipt] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [copiedReference, setCopiedReference] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const copyResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { downloadBlob } = useDownloadImage();

  // Reference number linked from the registration email, if this visit came
  // from one. Anything unrecognisable is dropped — see REFERENCE_PATTERN.
  const referenceParam = useSyncExternalStore(
    subscribeToLocation,
    readReferenceParam,
    readNoReferenceParam
  );
  const emailReference = useMemo(() => {
    const candidate = referenceParam?.trim().toUpperCase();
    return candidate && REFERENCE_PATTERN.test(candidate) ? candidate : undefined;
  }, [referenceParam]);

  const showAlreadyRegistered = panelOverride ?? Boolean(emailReference);

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

  // The server owns these values so the receipt matches the sheet row exactly.
  const submissionResult = submitRegistration.data as
    | { referenceNumber?: string; timestamp?: string; proofProvided?: boolean }
    | undefined;

  // Two ways into the confirmation screen: a fresh registration, or a proof of
  // payment sent later for one. `recordedProof` wins — it is the newer event,
  // and its values come straight back from the rows that were just updated.
  const showConfirmation = submitRegistration.isSuccess || !!recordedProof;
  const referenceNumber = recordedProof?.referenceNumber ?? submissionResult?.referenceNumber ?? '—';
  const submittedAt = recordedProof?.timestamp ?? submissionResult?.timestamp ?? '';
  const receiptNames = recordedProof?.names ?? registeredNames;
  // Drives the confirmation copy: without a proof the slot is only reserved.
  const proofProvided = recordedProof ? true : (submissionResult?.proofProvided ?? false);
  // A registration just made here that still owes a payment — its reference
  // number seeds the pay-later panel so it needn't be retyped.
  const pendingPaymentReference =
    submitRegistration.isSuccess && !proofProvided
      ? submissionResult?.referenceNumber
      : undefined;
  // A registration made here wins over one linked from an email — it is the
  // reference they are looking at right now.
  const panelPrefillReference = pendingPaymentReference ?? emailReference;

  // '—' is what stands in when the server didn't return one; there is nothing
  // to put on the clipboard in that case.
  const canCopyReference = referenceNumber !== '—';

  /**
   * Copying beats retyping a 16-character code into a chat message, and it is
   * what the reference number is mostly used for. The confirmation reverts
   * after a couple of seconds so the button reads as an action again.
   */
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

  useEffect(() => () => {
    if (copyResetRef.current) clearTimeout(copyResetRef.current);
  }, []);

  /**
   * Bring the pay-later panel into view once it is open. Both ways in need it.
   *
   * Opened by hand from the form's section-04 note, the panel is most of a
   * screen above where the reader was standing. Arriving from the email, the
   * link's own `#event-complete` already scrolls, but the hero image above the
   * section settles late and drags the anchor down with it — so they land
   * mid-page. Hence the wait before measuring on that path; a hand-opened
   * panel has nothing to wait for.
   *
   * Aims at the tab rather than the panel: the tab is the way back to the
   * registration form, so it has to stay on screen.
   */
  useEffect(() => {
    if (!showAlreadyRegistered) return;

    const smooth =
      !emailReference && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const timer = setTimeout(
      () => {
        const target = panelToggleRef.current ?? document.getElementById('event-complete');
        if (!target) return;

        window.scrollTo({
          // Same 100px allowance for the sticky header as the confirmation scroll.
          top: target.getBoundingClientRect().top + window.scrollY - 100,
          behavior: smooth ? 'smooth' : 'auto',
        });
      },
      emailReference ? 250 : 0
    );

    return () => clearTimeout(timer);
  }, [showAlreadyRegistered, emailReference]);

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
        names: receiptNames,
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

  // On a successful registration — or once a late proof of payment is recorded
  // and its dialog closes — the form is swapped for the "Thank You!" success
  // message. Wait for that container to paint, then scroll it into view (this
  // section only renders for has_payment events).
  useEffect(() => {
    if (showConfirmation) {
      // A slightly longer timeout ensures the layout shift from the form 
      // disappearing has fully settled.
      setTimeout(() => {
        const target = successRef.current ?? sectionRef.current;
        if (target) {
          // Calculate the target position and subtract 100px to account for 
          // potential sticky headers, which often cover elements scrolled to the top.
          const yPosition = target.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({
            top: yPosition,
            behavior: 'smooth',
          });
        }
      }, 150);
    }
  }, [showConfirmation, recordedProof]);



  // Pay-later half of the flow. Always a sibling of the form card (never nested
  // inside the <form>) so its own input and Continue button can't submit the
  // registration. The key remounts it when the prefill appears, which seeds the
  // input without an effect that writes state during render.
  const completePanel = (
    <CompleteRegistrationPanel
      key={panelPrefillReference ?? 'blank'}
      event={event}
      prefillReference={panelPrefillReference}
      onProofRecorded={setRecordedProof}
    />
  );

  /**
   * The pay-later panel REPLACES the registration form rather than sitting on
   * top of it — someone coming back to send their proof has no reason to
   * scroll past the questions again, and two forms on one screen invites
   * filling in the wrong one.
   *
   * The confirmation screen is exempt: it carries the reference number the
   * panel is asking for, so hiding it would take away the thing being typed in
   * (there the panel follows the receipt instead of leading the section).
   */
  const showFormCard = showConfirmation || !showAlreadyRegistered;

  return (
    <section
      id="event-register"
      ref={sectionRef}
      className="event-register-section"
      aria-label="Event Registration"
    >
      <div className="landing-container">
        <div className="event-register-form-wrap">
          {/* Before registering, the pay-later route leads the section as a
              collapsed tab: someone coming back with a reference number would
              otherwise have to scroll the entire form to find it, while
              everyone else would have to scroll past a panel they don't need.
              Opening it swaps the form out for the panel. */}
          {!showConfirmation && (
            <button
              ref={panelToggleRef}
              type="button"
              className={`form-tab-button${showAlreadyRegistered ? ' is-active' : ''}`}
              onClick={() => setPanelOverride(!showAlreadyRegistered)}
              aria-expanded={showAlreadyRegistered}
              aria-controls="event-complete"
            >
              <span className="form-tab-button-label">
                <i className="pi pi-history" aria-hidden="true"></i>
                Already Registered?
              </span>
              <i
                className={`pi ${showAlreadyRegistered ? 'pi-chevron-up' : 'pi-chevron-down'}`}
                aria-hidden="true"
              ></i>
            </button>
          )}

          {!showConfirmation && showAlreadyRegistered && completePanel}

          {showFormCard && (
          <div className="vip-form-container">
            {showConfirmation ? (
              <div className="success-animation-container" ref={successRef}>
                <h3>Thank You!</h3>
                <p>
                  <strong>{receiptNames[0]}</strong>, your registration for{' '}
                  <strong>{event.title}</strong>
                  {receiptNames.length > 1 ? (
                    <>
                      {' '}
                      (covering <strong>{receiptNames.length} people</strong>)
                    </>
                  ) : null}{' '}
                  {proofProvided
                    ? 'is in. Your slot is reserved.'
                    : 'is in. To complete, use your reference number to upload proof of payment.'}
                </p>

                {/* Receipt — the registrant's proof of registration. Mirrors the
                    saved image so what they see is what they keep. */}
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
                    <span className="event-register-receipt-label">
                      {receiptNames.length > 1
                        ? `Registrants (${receiptNames.length})`
                        : 'Registrant'}
                    </span>
                    <ol>
                      {receiptNames.map((name, index) => (
                        <li key={`${name}-${index}`}>
                          <span className="event-register-receipt-num" aria-hidden="true">
                            {index + 1}
                          </span>
                          {name}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {receiptNames.length > 1 && (
                    <p className="event-register-receipt-note">
                      <i className="pi pi-info-circle" aria-hidden="true"></i>
                      <span>
                        Everyone above shares this reference number. It covers the one
                        payment {proofProvided ? 'you sent' : 'for the whole group'}.
                      </span>
                    </p>
                  )}
                </div>

                {copyError && (
                  <p className="event-register-receipt-error" role="alert">
                    <i className="pi pi-exclamation-circle" aria-hidden="true"></i>
                    {copyError}
                  </p>
                )}

                {/* The reference number is the only way back into this
                    registration — say so loudly before they navigate away. */}
                <p className="event-register-receipt-keep" role="note">
                  <i className="pi pi-camera" aria-hidden="true"></i>
                  <span>
                    <strong>Take a screenshot or save your reference no.</strong> Screenshot
                    this page, or tap <em>Save as image</em> below, and keep{' '}
                    <strong>{referenceNumber}</strong>. It’s how we match your payment to your slot.
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
                      submitRegistration.reset();
                      reset(DEFAULT_FORM_VALUES);
                      setRegisteredNames([]);
                      setRecordedProof(null);
                      setSaveError(null);
                      // Someone reaching this screen through the pay-later
                      // panel left the tab open — close it, or "Register
                      // Another" lands them back on that panel instead of on
                      // the blank form they asked for.
                      setPanelOverride(false);
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
                            label="Email"
                            showRequired
                            placeholder="you@email.com"
                            className="modern-field"
                            type="email"
                            inputMode="email"
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
                              names below. Each one gets their own slot.
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
                      </div>
                    </div>

                    {/* ── Right column: proof of payment ───────────────── */}
                    <div className="event-register-col">
                      {/* Section 04: Proof of Payment */}
                      <div className="form-section sod-payment-section">
                        <div className="section-title">
                          <span className="section-number">04</span>
                          <h4>Proof of Payment (Optional)</h4>
                        </div>

                        <p className="sod-payment-intro">
                          Pay the {event.registration_fee ? `${event.registration_fee} ` : ''}registration fee by scanning
                          either QR code below, then upload your proof of payment to confirm your slot.
                          {' '}<strong>Haven&apos;t paid yet?</strong>{' '}
                          Register now and send your proof later using the reference number
                          we&apos;ll give you.
                        </p>

                        {totalRegistrants > 1 && (
                          <p className="event-register-multi-fee">
                            <i className="pi pi-info-circle" aria-hidden="true"></i>
                            <span>
                              You&apos;re registering <strong>{totalRegistrants} people</strong>
                              {event.registration_fee
                                ? ` (${event.registration_fee} × ${totalRegistrants})`
                                : ''}
                              . Send the total in one payment and upload that single proof.
                              It will be recorded for everyone on your list.
                            </span>
                          </p>
                        )}

                        <EventPaymentQrGrid />

                        <ProofOfPaymentField
                          sublabel="Optional. You can send this later with your reference number. Max 10 MB."
                        />

                        <p className="sod-payment-note">
                          <i className="pi pi-info-circle" aria-hidden="true"></i>
                          <span>
                            Your slot is confirmed once we verify your payment. Registering
                            without a proof reserves your slot. Upload it any time from{' '}
                            {/* A button, not an anchor: the panel is collapsed
                                behind the tab above, so there is no
                                `#event-complete` for a fragment to find. */}
                            <button
                              type="button"
                              className="sod-payment-note-link"
                              onClick={() => setPanelOverride(true)}
                            >
                              Already Registered?
                            </button>{' '}
                            at the top of this section.
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
          )}

          {showConfirmation && completePanel}
        </div>
      </div>
    </section>
  );
}
