'use client';

import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from 'react';
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
  LIFECLASS_FEE,
  LIFECLASS_REFERENCE_PATTERN,
  lifeclassEnrollmentSchema,
} from '@/models/schemas/lifeclass.schema';
import { useDownloadImage } from '@/hooks/useDownloadImage';
import { createRegistrationReceiptImage } from '@/lib/registration-receipt';
import LifeclassPaymentQrGrid from './LifeclassPaymentQrGrid';
import LifeclassAlreadyEnrolledPanel, {
  type RecordedLifeclassProof,
} from './LifeclassAlreadyEnrolledPanel';
import LifeclassScrollToFormCue from './LifeclassScrollToFormCue';
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
 * dates printed on it are barely legible. This 16:9 original is the widest cut
 * that still reads there.
 *
 * These are the FILE's real dimensions and must stay that way — how much of the
 * band it fills is LIFECLASS_POSTER_MOBILE_BAND's business, not this object's.
 */
const LIFECLASS_POSTER_MOBILE = {
  src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/events/LIFECLASS-ENROLLMENT.webp',
  width: 1920,
  height: 1080,
} as const;

/**
 * How tall the phone band is allowed to get, as a ratio.
 *
 * Even the 16:9 cut is only ~219px on a 390px screen, which still reads as a
 * strip rather than a poster. Band height is viewport width ÷ ratio and a phone
 * gives you no width to spend, so the height has to be bought from the
 * artwork's own margins: PosterHero scales the file up to fill this ratio and
 * crops it evenly left and right. 3:2 is ~260px, a fifth taller.
 *
 * 3:2 is the CEILING here, not a taste call. The poster's content — from the
 * "L" of "LifeClass" to the right-hand photo — spans 1620 of the file's 1920px,
 * and 1620/1080 is exactly 3:2. Anything squarer starts eating the wording.
 * A hero taller than this needs a taller CUT of the artwork (a 4:5 or 1:1
 * export), swapped in above with its real dimensions; it cannot come from a
 * smaller number here.
 */
const LIFECLASS_POSTER_MOBILE_BAND = { width: 3, height: 2 } as const;

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
  fee: LIFECLASS_FEE,
  /** Who an enrollee follows up with about payment. */
  contact: 'the Life Class team',
} as const;

/**
 * `?ref=` — the reference number carried in by the "Upload proof of payment"
 * button of the enrollment email, which links to
 * `/events/lifeclass-enrollment?ref=…#lifeclass-complete`.
 *
 * Read through `useSyncExternalStore` rather than `useSearchParams()`: that
 * hook would force this page behind a Suspense boundary. The server snapshot is
 * null, so the prerendered HTML still matches at hydration and the value
 * arrives on the render straight after it.
 */
const subscribeToLocation = (onChange: () => void) => {
  window.addEventListener('popstate', onChange);
  return () => window.removeEventListener('popstate', onChange);
};
const readReferenceParam = () => new URLSearchParams(window.location.search).get('ref');
const readNoReferenceParam = () => null;

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

interface ReferenceReceiptProps {
  referenceNumber: string;
  timestamp: string;
  timestampLabel: string;
  /** The enrollee this reference covers. Empty entries are dropped. */
  names: string[];
  canCopy: boolean;
  copied: boolean;
  onCopy: (value: string) => void;
}

/**
 * The receipt: reference number, when it was stamped, and who it covers.
 *
 * Mirrors the confirmation screen of the G12 events flow
 * (components/landing/events/EventRegistrationSection) element for element, and
 * wears its `.event-register-receipt` styling — which the "Already Enrolled?"
 * dialog also wears — so the same number reads as the same artefact everywhere
 * it appears.
 *
 * Shared by both Life Class screens (after enrolling, and after a later
 * payment) so the two can't drift apart.
 */
function ReferenceReceipt({
  referenceNumber,
  timestamp,
  timestampLabel,
  names,
  canCopy,
  copied,
  onCopy,
}: ReferenceReceiptProps) {
  const listed = names.filter(Boolean);

  return (
    <div className="event-register-receipt lifeclass-receipt">
      <div className="event-register-receipt-ref">
        <span className="event-register-receipt-label">Reference No.</span>
        <div className="event-register-receipt-code-row">
          <strong className="event-register-receipt-code">{referenceNumber}</strong>
          {canCopy && (
            <button
              type="button"
              className={`event-register-receipt-copy${copied ? ' is-copied' : ''}`}
              onClick={() => onCopy(referenceNumber)}
              aria-label={`Copy reference number ${referenceNumber}`}
            >
              <i className={`pi ${copied ? 'pi-check' : 'pi-copy'}`} aria-hidden="true" />
              <span role="status">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          )}
        </div>
      </div>

      {timestamp && (
        <div className="event-register-receipt-meta">
          <i className="pi pi-clock" aria-hidden="true"></i>
          <span>
            {timestampLabel} {timestamp}
          </span>
        </div>
      )}

      {listed.length > 0 && (
        <div className="event-register-receipt-names">
          <span className="event-register-receipt-label">Enrollee</span>
          <ol>
            {listed.map((name, index) => (
              <li key={`${name}-${index}`}>
                <span className="event-register-receipt-num" aria-hidden="true">
                  {index + 1}
                </span>
                {name}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default function LifeclassEnrollmentClient() {
  const [enrolledName, setEnrolledName] = useState<string | null>(null);
  // Reference number the route issued for THIS submission. It is the only way
  // back into the enrollment, so the confirmation screen leads with it.
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);
  // Set when a payment is sent later against an existing enrollment instead of
  // with the form. It reaches its own confirmation screen, built from what the
  // sheet gave back rather than from this form's values.
  const [recordedProof, setRecordedProof] = useState<RecordedLifeclassProof | null>(null);
  /**
   * Whether the "Already Enrolled?" panel is open.
   *
   * `null` means "nobody has touched the tab yet", which lets the default fall
   * out of `?ref=`: arriving from the enrollment email opens the panel, so the
   * button in it lands on something already filled in rather than on a page to
   * go hunting through. Derived rather than synced in an effect — setting state
   * from an effect here would cost a cascading render on every visit.
   */
  const [panelOverride, setPanelOverride] = useState<boolean | null>(null);
  // Asia/Manila stamp the route wrote into column A, so the receipt on screen
  // says the same thing as the sheet and the email.
  const [submittedAt, setSubmittedAt] = useState('');
  // Whether the enrollment form carried a proof image, which decides whether
  // the confirmation asks for one.
  const [proofProvided, setProofProvided] = useState(false);
  const [copiedReference, setCopiedReference] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [isSavingReceipt, setIsSavingReceipt] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const copyResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const { downloadBlob } = useDownloadImage();

  // Reference number linked from the enrollment email, if this visit came from
  // one. Anything unrecognisable is dropped rather than typed into the field
  // for the enrollee to puzzle over.
  const referenceParam = useSyncExternalStore(
    subscribeToLocation,
    readReferenceParam,
    readNoReferenceParam
  );
  const emailReference = useMemo(() => {
    const candidate = referenceParam?.trim().toUpperCase();
    return candidate && LIFECLASS_REFERENCE_PATTERN.test(candidate) ? candidate : undefined;
  }, [referenceParam]);

  const showAlreadyEnrolled = panelOverride ?? Boolean(emailReference);


  /**
   * Bring the panel into view once it is open. Both ways in need this.
   *
   * Opened by hand, the panel is below the fold. Arriving from the enrollment
   * email's "Upload proof of payment" button, the `#lifeclass-complete`
   * fragment on that link cannot do the job itself: the panel is gated on
   * `?ref=`, which `useSyncExternalStore` only reports AFTER hydration, so at
   * the moment the browser resolves the fragment its target does not exist —
   * and a fragment is resolved once, never retried. Without this, the email
   * button drops the reader at the top of the poster with the panel a full
   * screen further down.
   *
   * The email path jumps instantly, the way the fragment would have; a
   * hand-opened panel scrolls smoothly from wherever the reader was.
   */
  useEffect(() => {
    if (!showAlreadyEnrolled) return;
    const target = panelRef.current;
    if (!target) return;
    const smooth =
      !emailReference && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      // -100 clears the sticky header.
      top: target.getBoundingClientRect().top + window.scrollY - 100,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }, [showAlreadyEnrolled, emailReference]);

  useEffect(() => () => {
    if (copyResetRef.current) clearTimeout(copyResetRef.current);
  }, []);

  const canCopyReference =
    typeof navigator !== 'undefined' && Boolean(navigator.clipboard?.writeText);

  const handleCopyReference = async (value: string) => {
    if (!canCopyReference) return;

    try {
      await navigator.clipboard.writeText(value);
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

  /**
   * Save the receipt as a PNG, the same escape hatch the G12 events screen
   * offers: a reference number that only ever lived in a browser tab is one
   * closed tab away from a support message.
   *
   * `createRegistrationReceiptImage` is shared with that flow — the headline
   * and labels are parameters, so nothing about it is event-specific.
   */
  const handleSaveReceipt = async () => {
    if (isSavingReceipt || !referenceNumber) return;

    setIsSavingReceipt(true);
    setSaveError(null);

    try {
      const blob = await createRegistrationReceiptImage({
        eventTitle: 'Life Class',
        eventDate: `Class starts ${LIFECLASS_BATCH.classStarts}`,
        referenceNumber,
        timestamp: submittedAt,
        names: enrolledName ? [enrolledName] : [],
        headline: 'You’re enrolled',
        namesLabel: 'ENROLLEE',
        footerNote: 'Use this reference number to send your proof of payment.',
      });

      // The blob goes straight to the hook: wrapping it in a blob: URL and
      // fetching it back trips the app's CSP connect-src (see middleware.ts).
      await downloadBlob(blob, `gateway-lifeclass-${referenceNumber}.png`);
    } catch (error) {
      console.error('Saving the Life Class receipt failed:', error);
      setSaveError(
        'We couldn’t save the image on this device. Please screenshot this page instead.'
      );
    } finally {
      setIsSavingReceipt(false);
    }
  };

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
    onSuccess: (result: { referenceNumber?: string; timestamp?: string }) => {
      setReferenceNumber(result?.referenceNumber ?? null);
      setSubmittedAt(result?.timestamp ?? '');
      reset(EMPTY_FORM);
      // Scrolling to the success screen is the effect below's job — it has to
      // wait for that screen to paint, which hasn't happened yet here.
    },
  });

  /**
   * Which confirmation screen is on the page, if any — they share one card,
   * one `successRef` and one scroll effect. Matches the render order below:
   * a recorded payment wins over an enrollment made earlier in the session.
   *
   * A string rather than a boolean so a SECOND proof sent against the same
   * enrollment counts as a new screen and scrolls again, instead of the effect
   * seeing `true` both times and sitting still.
   */
  const confirmationScreen = recordedProof
    ? `proof:${recordedProof.referenceNumber}:${recordedProof.paymentNumber}`
    : submitEnrollment.isSuccess
      ? 'enrollment'
      : null;

  /**
   * Once a confirmation screen takes over the card — "Thank You!" after
   * enrolling, "Payment received!" after a later proof — bring it into view, on
   * phones and on desktop alike.
   *
   * Scrolling to the top of the page instead isn't enough on either: the poster
   * hero fills most of a phone viewport, and on desktop the card sits in the
   * right-hand column below the hero, so the reader lands on artwork with their
   * reference number somewhere off screen. The proof-of-payment route is worse
   * still — the upload dialog is a fixed overlay that locks body scroll, so
   * closing it drops the reader back wherever they were before they opened it,
   * which for a hand-opened panel can be most of a page above the answer.
   *
   * It can't ride along in either mutation's `onSuccess` — the screen hasn't
   * rendered at that point, so there is nothing to measure. The 150ms wait lets
   * the layout shift settle too: the form (or the panel) is far taller than the
   * card replacing it, and measuring before that reflow lands aims at the wrong
   * offset.
   */
  useEffect(() => {
    if (!confirmationScreen) return;

    const timer = setTimeout(() => {
      const target = successRef.current;
      if (!target) return;

      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({
        // -100 clears the sticky header, as above.
        top: target.getBoundingClientRect().top + window.scrollY - 100,
        behavior: smooth ? 'smooth' : 'auto',
      });

      // Move keyboard / screen-reader focus into the receipt too — the form (or
      // the dialog) they were tabbing through no longer exists. Programmatic
      // focus on a container doesn't trigger :focus-visible, so nothing changes
      // visually.
      target.focus({ preventScroll: true });
    }, 150);

    return () => clearTimeout(timer);
  }, [confirmationScreen]);

  const onSubmit = (data: LifeclassEnrollmentFormData) => {
    setEnrolledName(`${data.givenName} ${data.surname}`);
    // Captured at submit time — the form is reset behind the success screen.
    setProofProvided(Boolean(data.proofOfPayment));
    submitEnrollment.mutate(data);
  };

  // On a failed submit, scroll the first invalid field into view (mobile + desktop).
  const onError = useScrollToFirstError();

  /**
   * The pay-later panel REPLACES the enrollment form rather than sitting on top
   * of it — someone coming back to settle their fee has no reason to scroll
   * past the questions again, and two forms on one screen invites filling in
   * the wrong one.
   *
   * Both confirmation screens are exempt: they carry the reference number the
   * panel is asking for, so hiding them would take away the thing being typed
   * in. (`recordedProof` closes the panel anyway.)
   */
  const showEnrollmentCard =
    !showAlreadyEnrolled || submitEnrollment.isSuccess || Boolean(recordedProof);

  /**
   * Whether the enrollment form itself is on the page, as opposed to one of the
   * two confirmation screens that share its card. Gates the mobile "jump to the
   * form" cue, which would otherwise have nothing to point at.
   */
  const showEnrollmentForm =
    showEnrollmentCard && !recordedProof && !submitEnrollment.isSuccess;


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
        mobileBandRatio={LIFECLASS_POSTER_MOBILE_BAND}
        imageAlt="LifeClass Batch 3 enrollment poster — enroll August 16 until September 13, 2026; class starts October 4"
        title="Life Class Enrollment"
      />

      <main className="sod-main">
        <div className="landing-container">
          <div className="vip-layout-grid">

            {/* Left Side: the "Already Enrolled?" tab, then the Welcome Card.

                On desktop the tab sits ABOVE the card and reads as attached to
                it, so the pay-later route is visible without scrolling the
                whole form — someone coming back to settle their fee has no
                reason to read the enrollment questions again.

                Below 992px the two swap (CSS `order`, see vip-form.css): the
                column is stacked there, so a tab above the card would wedge
                itself between the poster and the welcome copy. */}
            <div className="lifeclass-sidebar">
              {/* The mobile cue's landing spot, not the form itself: stacked,
                  this tab is the last thing above the form column, so aiming
                  here puts the pay-later route and the form's own header on
                  screen together instead of dropping the reader straight onto
                  "First Name" with no idea what they've landed in. */}
              <button
                id="lifeclass-enroll-start"
                type="button"
                className={`lifeclass-tab-button${showAlreadyEnrolled ? ' is-active' : ''}`}
                onClick={() => setPanelOverride(!showAlreadyEnrolled)}
                aria-expanded={showAlreadyEnrolled}
                aria-controls="lifeclass-complete"
              >
                <span className="lifeclass-tab-button-label">
                  <i className="pi pi-history" aria-hidden="true"></i>
                  Already Enrolled?
                </span>
                <i
                  className={`pi ${showAlreadyEnrolled ? 'pi-chevron-up' : 'pi-chevron-down'}`}
                  aria-hidden="true"
                ></i>
              </button>

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

            </div>

            {/* Right Side: the pay-later panel, then the Enrollment Form.

                The panel is a SIBLING of the form card, never nested inside the
                <form>, so its own input and Continue button can't submit the
                enrollment. */}
            <div className="lifeclass-form-column">
              {showAlreadyEnrolled && !recordedProof && (
                <div ref={panelRef}>
                  <LifeclassAlreadyEnrolledPanel
                    // Remounts when the prefill appears, which seeds the input
                    // without an effect that writes state during render.
                    key={emailReference ?? referenceNumber ?? 'blank'}
                    prefillReference={emailReference ?? referenceNumber ?? undefined}
                    onProofRecorded={setRecordedProof}
                  />
                </div>
              )}

            {showEnrollmentCard && (
            <div className="vip-form-container">
              {recordedProof ? (
                // tabIndex -1 so the scroll effect can park focus here; the
                // upload dialog that had it has just closed.
                <div className="success-animation-container" ref={successRef} tabIndex={-1}>
                  <h3>Payment received!</h3>
                  <p>
                    {recordedProof.name ? <strong>{recordedProof.name}</strong> : 'Thanks'}, we
                    have your proof of payment
                    {recordedProof.paymentNumber > 1 ? (
                      <>
                        {' '}
                        &mdash; <strong>payment {recordedProof.paymentNumber}</strong> &mdash;
                      </>
                    ) : null}
                    . Your slot is confirmed once we verify it.
                    {recordedProof.totalPaid ? (
                      <>
                        {' '}
                        Recorded so far: <strong>{recordedProof.totalPaid}</strong>.
                      </>
                    ) : null}
                  </p>

                  {recordedProof.referenceNumber && (
                    <ReferenceReceipt
                      referenceNumber={recordedProof.referenceNumber}
                      timestamp={recordedProof.timestamp}
                      timestampLabel="Received"
                      names={[recordedProof.name]}
                      canCopy={canCopyReference}
                      copied={copiedReference}
                      onCopy={handleCopyReference}
                    />
                  )}

                  {copyError && (
                    <p className="event-register-receipt-error" role="alert">
                      <i className="pi pi-exclamation-circle" aria-hidden="true"></i>
                      {copyError}
                    </p>
                  )}

                  <p className="event-register-receipt-keep" role="note">
                    <i className="pi pi-info-circle" aria-hidden="true"></i>
                    <span>
                      <strong>Paying in parts?</strong> Send the next one the same way &mdash;{' '}
                      <strong>{recordedProof.referenceNumber}</strong> keeps working, and every
                      upload is kept.
                    </span>
                  </p>

                  <div className="event-register-success-actions">
                    <button
                      type="button"
                      onClick={() => {
                        setRecordedProof(null);
                        setPanelOverride(true);
                      }}
                      className="landing-btn landing-btn-primary elevated"
                    >
                      <i className="pi pi-upload" aria-hidden="true" />
                      Send another proof
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRecordedProof(null);
                        setPanelOverride(false);
                      }}
                      className="landing-btn landing-btn-outline"
                    >
                      Back to enrollment
                    </button>
                  </div>
                </div>
              ) : submitEnrollment.isSuccess ? (
                // tabIndex -1 so the scroll effect can park focus here; the
                // form that had it is gone.
                <div className="success-animation-container" ref={successRef} tabIndex={-1}>
                  <h3>Thank You!</h3>
                  <p>
                    <strong>{enrolledName}</strong>, your enrollment in{' '}
                    <strong>Life Class</strong>{' '}
                    {proofProvided
                      ? 'is in. Your slot is reserved.'
                      : `is in. To complete, use your reference number to upload proof of the ${LIFECLASS_BATCH.fee} fee.`}
                  </p>

                  {/* Receipt — the enrollee's proof of enrollment. Mirrors the
                      saved image so what they see is what they keep. */}
                  {referenceNumber && (
                    <ReferenceReceipt
                      referenceNumber={referenceNumber}
                      timestamp={submittedAt}
                      timestampLabel="Enrolled"
                      names={enrolledName ? [enrolledName] : []}
                      canCopy={canCopyReference}
                      copied={copiedReference}
                      onCopy={handleCopyReference}
                    />
                  )}

                  {copyError && (
                    <p className="event-register-receipt-error" role="alert">
                      <i className="pi pi-exclamation-circle" aria-hidden="true"></i>
                      {copyError}
                    </p>
                  )}

                  {/* The reference number is the only way back into this
                      enrollment — say so loudly before they navigate away. */}
                  {referenceNumber && (
                    <p className="event-register-receipt-keep" role="note">
                      <i className="pi pi-camera" aria-hidden="true"></i>
                      <span>
                        <strong>Take a screenshot or save your reference no.</strong> Screenshot
                        this page — or tap <em>Save as image</em> below — and keep{' '}
                        <strong>{referenceNumber}</strong>. It&rsquo;s how we match your payment
                        to your slot. We&rsquo;ve emailed it to you too.
                      </span>
                    </p>
                  )}

                  {saveError && (
                    <p className="event-register-receipt-error" role="alert">
                      <i className="pi pi-exclamation-circle" aria-hidden="true"></i>
                      {saveError}
                    </p>
                  )}

                  <div className="event-register-success-actions">
                    {referenceNumber && (
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
                    )}
                    <button
                      type="button"
                      className="landing-btn landing-btn-outline"
                      onClick={() => {
                        submitEnrollment.reset();
                        reset(EMPTY_FORM);
                        setEnrolledName(null);
                        setReferenceNumber(null);
                        setSubmittedAt('');
                        setSaveError(null);
                        setCopyError(null);
                      }}
                    >
                      Enroll Another
                    </button>
                  </div>
                </div>
              ) : (
                <FormProvider {...methods}>
                  <form
                    id="lifeclass-enroll-form"
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

                      <LifeclassPaymentQrGrid />

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
            )}
            </div>
          </div>
        </div>
      </main>

      {/* Outside <main> on purpose, the same way GivingUploadCue sits outside
          the section it points at: it is `position: fixed`, and a transform,
          filter or will-change on any layout wrapper would become its
          containing block and clip it to the column. */}
      {showEnrollmentForm && <LifeclassScrollToFormCue />}

      <LandingFooter />
    </div>
  );
}
