'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventContactSchema, type EventContactFormData } from '@/models/schemas/contact.schema';
import { FormInput } from '@/components/forms/FormInput';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { FormSelect } from '@/components/forms/FormSelect';
import { GENDER_OPTIONS } from '@/models/enums';
import { CONTACT_INFO } from '@/data/contact';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';

interface EventContactSectionProps {
  eventSlug: string;
}

export const EventContactSection: React.FC<EventContactSectionProps> = ({ eventSlug }) => {

  const [submitted, setSubmitted] = useState(false);

  const methods = useForm<EventContactFormData>({
    resolver: zodResolver(eventContactSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      gender: '',
      phone: '',
      address: '',
      facebook: '',
      message: ''
    }
  });

  const { handleSubmit, reset } = methods;

  const submitEventInquiry = useMutation({
    mutationFn: (data: EventContactFormData) =>
      apiClient.post(`/api/event/${eventSlug}`, data),
    onSuccess: () => {
      reset();
      setSubmitted(true);
    },
  });

  const onSubmit = (data: EventContactFormData) => {
    submitEventInquiry.mutate(data);
  };

  return (
    <section id="contact" className="contact-section animate-on-scroll">
      <div className="contact-bg-pattern"></div>
      <div className="landing-container">
        <div className="contact-card">
          <div className="contact-card-inner">
            {/* Left - Info */}
            <div className="contact-info-panel">
              <span className="section-label-light">Get in Touch</span>
              <h2>Join us and be part of the family.</h2>
              <p className="contact-description">We&apos;re here to help and answer any questions you might have.</p>

              <div className="contact-details">
                <a href={`mailto:${CONTACT_INFO.email}`} className="contact-detail-item">
                  <i className="pi pi-envelope"></i>
                  <span>{CONTACT_INFO.email}</span>
                </a>
                <a href={`tel:${CONTACT_INFO.phoneRaw}`} className="contact-detail-item">
                  <i className="pi pi-phone"></i>
                  <span>{CONTACT_INFO.phone}</span>
                </a>
                <div className="contact-detail-item">
                  <i className="pi pi-map-marker"></i>
                  <span>{CONTACT_INFO.address}</span>
                </div>
              </div>

            </div>

            {/* Right - Form */}
            <div className="contact-form-panel">
              {submitted ? (
                <div className="contact-success-state">
                  <div className="success-checkmark">
                    <i className="pi pi-check"></i>
                  </div>
                  <h3>Message Sent!</h3>
                  <p>We&apos;ll get back to you soon.</p>
                  <button onClick={() => setSubmitted(false)} className="success-reset">
                    Send another <i className="pi pi-arrow-right"></i>
                  </button>
                </div>
              ) : (
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmit)} className="contact-form-minimal">
                    <FormInput
                      name="name"
                      label="Name"
                      placeholder=" "
                      isFloating
                      className="input-group"
                      displayDisabled={submitEventInquiry.isPending}
                    />

                    <FormInput
                      name="email"
                      label="Email"
                      placeholder=" "
                      isFloating
                      className="input-group"
                      displayDisabled={submitEventInquiry.isPending}
                    />

                    <FormInput
                      name="phone"
                      label="Phone Number"
                      placeholder=" "
                      isFloating
                      className="input-group"
                      displayDisabled={submitEventInquiry.isPending}
                    />

                    <FormSelect
                      name="gender"
                      label="Gender"
                      placeholder="Select Gender"
                      options={GENDER_OPTIONS}
                      displayDisabled={submitEventInquiry.isPending}
                      className="input-group"
                      showLabel={true}
                      isFloating={true}
                    />

                    <FormInput
                      name="address"
                      label="Address"
                      placeholder=" "
                      isFloating
                      className="input-group"
                      displayDisabled={submitEventInquiry.isPending}
                    />

                    <FormInput
                      name="facebook"
                      label="Facebook URL (Optional)"
                      placeholder=" "
                      isFloating
                      className="input-group"
                      displayDisabled={submitEventInquiry.isPending}
                    />

                    <FormTextarea
                      name="message"
                      label="Message (Optional)"
                      placeholder=" "
                      rows={3}
                      isFloating
                      className="input-group"
                      displayDisabled={submitEventInquiry.isPending}
                    />

                    <button type="submit" className="submit-btn" disabled={submitEventInquiry.isPending}>
                      {submitEventInquiry.isPending ? (
                        <i className="pi pi-spin pi-spinner"></i>
                      ) : (
                        <>
                          Send Message
                          <i className="pi pi-send"></i>
                        </>
                      )}
                    </button>
                  </form>
                </FormProvider>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventContactSection;
