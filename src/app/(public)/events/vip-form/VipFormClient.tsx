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

export default function VipFormClient() {
    const apiEventStore = useApiEventStore();
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    const { handleSubmit, reset } = methods;

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
                                    <p>Your VIP registration is complete. We are so excited to have you as part of our community!</p>
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
                                                    placeholder="When do we celebrate you?"
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

            <style jsx global>{`
                .vip-layout-grid {
                    display: grid;
                    grid-template-columns: 350px 1fr;
                    gap: 30px;
                    align-items: start;
                }

                /* Welcome Card Styling */
                .vip-welcome-card {
                    position: sticky;
                    top: 100px;
                    height: 600px;
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    border-radius: 30px;
                    overflow: hidden;
                    color: white;
                    padding: 40px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
                }

                .vip-welcome-card .glass-overlay {
                    position: absolute;
                    inset: 0;
                    background: url('https://gtxngthtpisigkys.public.blob.vercel-storage.com/community.jpg') center/cover;
                    opacity: 0.2;
                    filter: grayscale(100%);
                }

                .vip-welcome-card .card-content {
                    position: relative;
                    z-index: 2;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }

                .icon-badge {
                    width: 50px;
                    height: 50px;
                    background: var(--primary-gold-accent);
                    border-radius: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    margin-bottom: 30px;
                    box-shadow: 0 10px 20px rgba(240, 180, 41, 0.4);
                }

                .welcome-title {
                    font-size: 32px;
                    font-weight: 800;
                    margin-bottom: 20px;
                    line-height: 1.2;
                }

                .welcome-text {
                    font-size: 16px;
                    color: rgba(255,255,255,0.7);
                    line-height: 1.6;
                    margin-bottom: 40px;
                }

                .welcome-features {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .feature-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-weight: 500;
                    color: rgba(255,255,255,0.9);
                }

                .feature-item i {
                    color: var(--primary-gold-accent);
                }

                .card-footer {
                    margin-top: auto;
                }

                /* Form Container Styling */
                .vip-form-container {
                    background: white;
                    border-radius: 30px;
                    padding: 50px;
                    box-shadow: 0 30px 60px rgba(0,0,0,0.05);
                    border: 1px solid rgba(0,0,0,0.05);
                }

                .form-header {
                    margin-bottom: 40px;
                }

                .step-label {
                    color: var(--primary-gold-accent);
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-size: 12px;
                    display: block;
                    margin-bottom: 10px;
                }

                .form-main-title {
                    font-size: 28px;
                    color: #0f172a;
                    font-weight: 800;
                }

                .form-section {
                    margin-bottom: 40px;
                }

                .section-title {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 25px;
                    border-bottom: 1px solid #f1f5f9;
                    padding-bottom: 15px;
                }

                .section-number {
                    font-size: 14px;
                    font-weight: 800;
                    color: var(--primary-gold-accent);
                    background: rgba(240, 180, 41, 0.1);
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                }

                .section-title h4 {
                    font-size: 18px;
                    font-weight: 700;
                    color: #334155;
                    margin: 0;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 20px;
                    margin-bottom: 20px;
                }

                .form-row-single {
                    margin-bottom: 20px;
                }

                .form-error-alert {
                    background: #fff1f2;
                    color: #e11d48;
                    padding: 15px 20px;
                    border-radius: 12px;
                    margin-bottom: 30px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 14px;
                }

                .vip-submit-button {
                    width: 100%;
                    background: #0f172a;
                    color: white;
                    border: none;
                    padding: 18px;
                    border-radius: 15px;
                    font-size: 16px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 10px 20px rgba(15, 23, 42, 0.2);
                    margin-bottom: 20px;
                }

                .vip-submit-button:hover:not(:disabled) {
                    background: #1e293b;
                    transform: translateY(-2px);
                    box-shadow: 0 15px 30px rgba(15, 23, 42, 0.3);
                }

                .vip-submit-button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .privacy-note {
                    text-align: center;
                    font-size: 12px;
                    color: #94a3b8;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                }

                /* Success State Styling */
                .success-animation-container {
                    text-align: center;
                    padding: 40px 0;
                }

                .success-icon-wrapper {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    background: var(--primary-gold-accent);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 40px;
                    margin: 0 auto 30px;
                    z-index: 1;
                }

                .pulse-ring {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: var(--primary-gold-accent);
                    opacity: 0.4;
                    animation: pulse 2s infinite;
                    z-index: -1;
                }

                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.4; }
                    100% { transform: scale(2); opacity: 0; }
                }

                .success-animation-container h3 {
                    font-size: 32px;
                    font-weight: 800;
                    margin-bottom: 15px;
                    color: #0f172a;
                }

                .success-animation-container p {
                    color: #64748b;
                    line-height: 1.6;
                    margin-bottom: 40px;
                    max-width: 400px;
                    margin-left: auto;
                    margin-right: auto;
                }

                @media (max-width: 992px) {
                    .vip-layout-grid {
                        grid-template-columns: 1fr;
                    }
                    .vip-welcome-card {
                        height: auto;
                        position: relative;
                        top: 0;
                        margin-bottom: 30px;
                    }
                }

                @media (max-width: 640px) {
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                    .vip-form-container {
                        padding: 30px 20px;
                    }
                }
            `}</style>
        </div>
    );
}
