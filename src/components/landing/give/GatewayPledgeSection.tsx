'use client';

import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { gatewayPledgeSchema, type GatewayPledgeFormData } from '@/models/schemas/contact.schema';
import { FormInput } from '@/components/forms/FormInput';
import * as inquiryService from '@/services/inquiry.service';
import { ApiEvent, ApiEventStatus, ApiEventType, useApiEventStore } from '@/stores';
import { CONTACT_INFO } from '@/data/contact';

export const GatewayPledgeSection: React.FC = () => {
  const apiEventStore = useApiEventStore();
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

  useEffect(() => {
    const cleanup = getApiEvents();
    return () => {
      cleanup();
    };
  }, []);

  const getApiEvents = () => {
    const unsubscribe = apiEventStore.subscribe((event) => {
      if (!event) return;
      const eventStatusHandleMap = createEventStatusHandleMap(event);
      const handleEvent = eventStatusHandleMap[event.status] || (() => { });
      handleEvent();
    });
    return () => {
      unsubscribe();
    };
  };

  const createEventStatusHandleMap = (
    apiEvent: ApiEvent,
  ): { [key in ApiEventStatus]?: () => void } => {
    return {
      [ApiEventStatus.COMPLETED]: () => {
        const eventTypeHandleMap: { [key in ApiEventType]?: () => void } = {
          [ApiEventType.SUBMIT_GATEWAY_PLEDGE]: async () => {
            reset();
            setSubmitted(true);
          },
        };
        const handleEventType = eventTypeHandleMap[apiEvent.type] || (() => { });
        handleEventType();
      },
      [ApiEventStatus.ERROR]: () => { },
      [ApiEventStatus.IN_PROGRESS]: () => { },
      [ApiEventStatus.DEFAULT]: () => { },
    };
  };

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: GatewayPledgeFormData) => {
    await inquiryService.submitGatewayPledge(data);
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

                    <FormInput
                      name="phone"
                      label="Phone Number"
                      placeholder=" "
                      isFloating
                      enableAllowNumbersSpacesPlusDash
                      className="input-group"
                      displayDisabled={isSubmitting}
                    />

                    <FormInput
                      name="pledgeAmount"
                      label="Pledge Amount (₱)"
                      placeholder=" "
                      isFloating
                      enableOnlyInteger
                      className="input-group"
                      displayDisabled={isSubmitting}
                    />

                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                      {isSubmitting ? (
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
