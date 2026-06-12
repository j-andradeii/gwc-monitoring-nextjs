'use client';

import React, { useState, useId } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';
import { LandingHeader, LandingFooter, PageHero } from '@/components/landing';
import { FormInput, FormCalendar, FormSelect, CalendarViewType } from '@/components/forms';
import { sodEnrollmentSchema, type SodEnrollmentData } from '@/models/schemas/sod.schema';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';
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

export default function SodEnrollmentClient() {
  const [enrolledName, setEnrolledName] = useState<string | null>(null);
  const checkboxGroupId = useId();
  const radioGroupId = useId();

  const methods = useForm<SodEnrollmentData>({
    resolver: zodResolver(sodEnrollmentSchema),
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
    },
  });

  const { handleSubmit, reset } = methods;

  const submitSodEnrollment = useMutation({
    mutationFn: (data: SodEnrollmentData) =>
      apiClient.post('/api/inquiry/sod-enrollment', data),
    onSuccess: () => {
      reset();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },
  });

  const onSubmit = (data: SodEnrollmentData) => {
    setEnrolledName(`${data.givenName} ${data.surname}`);
    submitSodEnrollment.mutate(data);
  };

  return (
    <div className="landing-page" style={{ background: '#fcfcfd' }}>
      <LandingHeader />

      <PageHero
        badge="Ministries"
        title="School of Destiny"
        subtitle="ENROLLMENT IS NOW OPEN"
        backgroundImage="https://gtxngthtpisigkys.public.blob.vercel-storage.com/events/SOD-ENROLLMENT.webp"
        displayBadge={false}
      />

      <main style={{
        padding: '80px 0 120px',
        marginTop: '-60px',
        position: 'relative',
        zIndex: 10
      }}>
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
                          name="middleName"
                          label="Middle Name"
                          placeholder="e.g. Dela Cruz"
                          showRequired
                          className="modern-field"
                        />
                        <FormInput
                          name="mobileNumber"
                          label="Mobile Number"
                          placeholder="0917 XXX XXXX"
                          showRequired
                          className="modern-field"
                        />
                      </div>

                      <div className="form-row sod-form-row-2col">
                        <FormCalendar
                          name="birthdate"
                          label="Birthdate"
                          placeholder="mm/dd/yyyy"
                          showRequired
                          calendarView={CalendarViewType.DATE}
                          format="mm/dd/yy"
                        />
                        <FormInput
                          name="cellLeader"
                          label="Cell Leader Name"
                          placeholder="Name of your cell leader"
                          showRequired
                          className="modern-field"
                        />
                      </div>
                    </div>

                    {/* Section 02: Enrollment Details */}
                    <div className="form-section">
                      <div className="section-title">
                        <span className="section-number">02</span>
                        <h4>Enrollment Details</h4>
                      </div>

                      <FormSelect
                        name="classToEnroll"
                        label="Which class to enroll?"
                        placeholder="Select a class"
                        showRequired
                        options={SOD_CLASS_OPTIONS}
                      />

                      <div style={{ marginTop: '20px' }}>
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
