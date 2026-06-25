'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { gatewayPledgeSchema, type GatewayPledgeFormData } from '@/models/schemas/contact.schema';
import { FormInput } from '@/components/forms/FormInput';
import { useScrollToFirstError } from '@/components/forms';
import { CONTACT_INFO } from '@/data/contact';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';

export const GatewayPledgeSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const methods = useForm<GatewayPledgeFormData>({
    resolver: zodResolver(gatewayPledgeSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      pledgeAmount: '',
    },
  });

  const { handleSubmit, reset } = methods;
  const scrollToError = useScrollToFirstError();

  const submitGatewayPledge = useMutation({
    mutationFn: (data: GatewayPledgeFormData) =>
      apiClient.post('/api/inquiry/pledge', data),
    onSuccess: () => {
      reset();
      setSubmitted(true);
    },
  });

  const onSubmit = (data: GatewayPledgeFormData) => {
    submitGatewayPledge.mutate(data);
  };

  return (
    <section id="pledge" className="contact-section animate-on-scroll">
      <div className="contact-bg-pattern"></div>
      <div className="landing-container">
        <div className="contact-card">
          <div className="contact-card-inner">
            {/* Left - Info */}
            <div className="contact-info-panel">
              <span className="section-label-light">Get Involved</span>
              <h2>Make a Pledge</h2>
              <p className="contact-description">
                Partner with us in expanding God&apos;s kingdom and building a legacy for generations to come.
              </p>

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
                  <h3>May God bless you more!</h3>
                  <p>Thank you for your generosity.</p>
                  <button onClick={() => {
                    setSubmitted(false);
                    reset();
                  }}
                    className="success-reset">
                    Submit another <i className="pi pi-arrow-right"></i>
                  </button>
                </div>
              ) : (
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmit, scrollToError)} className="contact-form-minimal">
                    <FormInput
                      name="name"
                      label="Name"
                      placeholder=" "
                      isFloating
                      className="input-group"
                      displayDisabled={submitGatewayPledge.isPending}
                    />

                    <FormInput
                      name="email"
                      label="Email"
                      placeholder=" "
                      isFloating
                      className="input-group"
                      displayDisabled={submitGatewayPledge.isPending}
                    />

                    <FormInput
                      name="phone"
                      label="Phone Number"
                      placeholder=" "
                      isFloating
                      enableAllowNumbersSpacesPlusDash
                      className="input-group"
                      displayDisabled={submitGatewayPledge.isPending}
                    />

                    <FormInput
                      name="pledgeAmount"
                      label="Pledge Amount (₱)"
                      placeholder=" "
                      isFloating
                      enableOnlyInteger
                      className="input-group"
                      displayDisabled={submitGatewayPledge.isPending}
                    />

                    <button type="submit" className="submit-btn" disabled={submitGatewayPledge.isPending}>
                      {submitGatewayPledge.isPending ? (
                        <i className="pi pi-spin pi-spinner"></i>
                      ) : (
                        <>
                          Submit Pledge
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

export default GatewayPledgeSection;
