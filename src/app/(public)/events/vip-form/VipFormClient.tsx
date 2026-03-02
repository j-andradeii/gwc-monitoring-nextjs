'use client';

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LandingHeader, LandingFooter, PageHero } from '@/components/landing';
import { FormInput, FormCalendar, FormSocialMedia, CalendarViewType } from '@/components/forms';
import { vipFormSchema, type VipFormData } from '@/models/schemas/vip.schema';
import * as inquiryService from "@/services/inquiry.service";
import { ApiEventStatus, ApiEventType, useApiEventStore } from '@/stores';
import Link from 'next/link';
import '@/styles/landing.css';
import '@/styles/vip-form.css';

export default function VipFormClient() {
    const apiEventStore = useApiEventStore();
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [vipName, setVipName] = useState<string | null>(null);

    const methods = useForm<VipFormData>({
        resolver: zodResolver(vipFormSchema),
        mode: 'onChange',
        defaultValues: {
            familyName: '',
            firstName: '',
            birthdate: null,
            socialMedia: [{ platform: 'Facebook', handle: '' }],
            contactNumber: '',
            whoInvitedYou: '',
        },
    });

    const { handleSubmit, reset, getValues } = methods;

    // Event Listener for API responses
    useEffect(() => {
        const unsubscribe = apiEventStore.subscribe((event) => {
            if (!event) return;

            if (event.type === ApiEventType.SUBMIT_VIP_FORM) {
                if (event.status === ApiEventStatus.COMPLETED) {
                    setIsSubmitting(false);
                    setSubmitted(true);
                    reset();
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth',
                    });
                } else if (event.status === ApiEventStatus.ERROR) {
                    setIsSubmitting(false);
                    setError('Something went wrong. Please try again.');
                }
            }
        });
        return () => {
            unsubscribe();
        };
    }, []);

    const onSubmit = async (data: VipFormData) => {
        setIsSubmitting(true);
        setError(null);
        setVipName(`${data.firstName} ${data.familyName}`);
        await inquiryService.submitVipForm(data);
    };

    return (
        <div className="landing-page" style={{ background: '#fcfcfd' }}>
            <LandingHeader />

            <PageHero
                badge="Ministries"
                title="Welome to Gateway Church"
                subtitle="HIS PRECENSE, OUR HOME"
                backgroundImage="https://gtxngthtpisigkys.public.blob.vercel-storage.com/vip_2.jpg"
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

                        {/* Left Side: Welcome Card (Pinterest/Dribbble feel) */}
                        <div className="vip-welcome-card">
                            <div className="glass-overlay" />
                            <div className="card-content">
                                <h2 className="welcome-title">Welcome Home</h2>
                                <p className="welcome-text">
                                    We believe that every person who walks through our doors is a VIP.
                                    Gateway is more than just a building—it&apos;s a family.
                                </p>

                                <div className="welcome-features">
                                    <div className="feature-item">
                                        <i className="pi pi-check-circle"></i>
                                        <span>Personal Connection</span>
                                    </div>
                                    <div className="feature-item">
                                        <i className="pi pi-check-circle"></i>
                                        <span>Community Support</span>
                                    </div>
                                    <div className="feature-item">
                                        <i className="pi pi-check-circle"></i>
                                        <span>Spiritual Growth</span>
                                    </div>
                                </div>

                                <div className="card-footer">
                                    <img src="/assets/images/church-logo-white.png" alt="Gateway Logo" style={{ height: '30px', opacity: 0.8 }} />
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Advanced Form */}
                        <div className="vip-form-container">
                            {submitted ? (
                                <div className="success-animation-container">
                                    <div className="success-icon-wrapper">
                                        <i className="pi pi-heart-fill"></i>
                                        <div className="pulse-ring"></div>
                                    </div>
                                    <h3>Thank You!</h3>
                                    <p>Welcome <strong>{vipName}</strong>. We are so excited to have you as part of our community!</p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSubmitted(false);
                                            reset({
                                                familyName: '',
                                                firstName: '',
                                                birthdate: null,
                                                socialMedia: [{ platform: 'Facebook', handle: '' }],
                                                contactNumber: '',
                                                whoInvitedYou: '',
                                            });
                                            setVipName(null);
                                        }}
                                        className="landing-btn landing-btn-primary elevated"
                                    >
                                        Submit Another VIP
                                    </button>
                                </div>
                            ) : (
                                <FormProvider {...methods}>
                                    <form onSubmit={handleSubmit(onSubmit)} className="advanced-vip-form">
                                        <div className="form-header">
                                            <span className="step-label">Registration Form</span>
                                            <h3 className="form-main-title">Share your story with us</h3>
                                        </div>

                                        {error && (
                                            <div className="form-error-alert">
                                                <i className="pi pi-info-circle"></i>
                                                {error}
                                            </div>
                                        )}

                                        {/* Group 1: Identity */}
                                        <div className="form-section">
                                            <div className="section-title">
                                                <span className="section-number">01</span>
                                                <h4>Personal Identity</h4>
                                            </div>
                                            <div className="form-row">
                                                <FormInput
                                                    name="firstName"
                                                    label="First Name"
                                                    placeholder="e.g. Maria"
                                                    showRequired
                                                    className="modern-field"
                                                />
                                                <FormInput
                                                    name="familyName"
                                                    label="Family Name"
                                                    placeholder="e.g. Santos"
                                                    showRequired
                                                    className="modern-field"
                                                />
                                            </div>
                                            <div className="form-row-single">
                                                <FormCalendar
                                                    name="birthdate"
                                                    label="Birthdate"
                                                    placeholder="mm/dd/yyyy"
                                                    showRequired
                                                    calendarView={CalendarViewType.DATE}
                                                    format="mm/dd/yy"
                                                />
                                            </div>
                                        </div>

                                        {/* Group 2: Connectivity */}
                                        <div className="form-section">
                                            <div className="section-title">
                                                <span className="section-number">02</span>
                                                <h4>Connectivity</h4>
                                            </div>
                                            <div className="form-row">
                                                <FormInput
                                                    name="contactNumber"
                                                    label="Mobile Number"
                                                    placeholder="0917 XXX XXXX"
                                                    showRequired
                                                    className="modern-field"
                                                />
                                                <FormSocialMedia
                                                    name="socialMedia"
                                                    label="Social Handles"
                                                    showRequired
                                                    className="modern-field"
                                                />
                                            </div>
                                            <div className="form-row-single">
                                                <FormInput
                                                    name="whoInvitedYou"
                                                    label="How did you find us?"
                                                    placeholder="Name of the person who invited you"
                                                    showRequired
                                                    className="modern-field"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-actions">
                                            <button
                                                type="submit"
                                                className="vip-submit-button"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <i className="pi pi-spin pi-spinner"></i>
                                                ) : (
                                                    <>
                                                        Complete Registration
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
