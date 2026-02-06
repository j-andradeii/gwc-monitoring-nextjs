'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { simpleContactSchema, type SimpleContactFormData } from '@/models/schemas/contact.schema';
import { FormInput } from '@/components/forms/FormInput';
import { FormTextarea } from '@/components/forms/FormTextarea';

export const ContactSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const methods = useForm<SimpleContactFormData>({
    resolver: zodResolver(simpleContactSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      message: ''
    }
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = methods;

  const onSubmit = async (data: SimpleContactFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitted(true);
    reset();
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
              <h2>Let&apos;s Start a Conversation</h2>
              <p className="contact-description">We&apos;re here to help and answer any questions you might have.</p>

              <div className="contact-details">
                <a href="mailto:hello@gatewaychurch.ph" className="contact-detail-item">
                  <i className="pi pi-envelope"></i>
                  <span>hello@gatewaychurch.ph</span>
                </a>
                <a href="tel:+639171234567" className="contact-detail-item">
                  <i className="pi pi-phone"></i>
                  <span>+63 917 123 4567</span>
                </a>
                <div className="contact-detail-item">
                  <i className="pi pi-map-marker"></i>
                  <span>8th Floor, Golden Peak, Gorordo Avenue</span>
                </div>
              </div>

              <div className="contact-social-row">
                <a href="#" aria-label="Facebook"><i className="pi pi-facebook"></i></a>
                <a href="#" aria-label="Instagram"><i className="pi pi-instagram"></i></a>
                <a href="#" aria-label="YouTube"><i className="pi pi-youtube"></i></a>
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
                      displayDisabled={isSubmitting}
                    />

                    <FormInput
                      name="email"
                      label="Email"
                      placeholder=" "
                      isFloating
                      className="input-group"
                      displayDisabled={isSubmitting}
                    />

                    <FormTextarea
                      name="message"
                      label="Message"
                      placeholder=" "
                      rows={3}
                      isFloating
                      className="input-group"
                      displayDisabled={isSubmitting}
                    />

                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                      {isSubmitting ? (
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

export default ContactSection;
