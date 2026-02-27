'use client';

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LandingHeader, LandingFooter, PageHero } from '@/components/landing';
import { FormInput, FormCalendar, CalendarViewType } from '@/components/forms';
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
    const [step, setStep] = useState(1);

    const methods = useForm<VipFormData>({
        resolver: zodResolver(vipFormSchema),
        mode: 'onChange',
        defaultValues: {
            familyName: '',
            firstName: '',
            birthdate: null,
            socialMedia: '',
            contactNumber: '',
            whoInvitedYou: '',
        },
    });

    const { handleSubmit, reset, trigger, formState: { errors } } = methods;

    // Event Listener for API responses
    useEffect(() => {
        const unsubscribe = apiEventStore.subscribe((event) => {
            if (!event) return;

            if (event.type === ApiEventType.SUBMIT_VIP_FORM) {
                if (event.status === ApiEventStatus.COMPLETED) {
                    setIsSubmitting(false);
                    setSubmitted(true);
                    reset();
                } else if (event.status === ApiEventStatus.ERROR) {
                    setIsSubmitting(false);
                    setError('Something went wrong. Please try again.');
                }
            }
        });
        return () => {
            unsubscribe();
        };
    }, []); // Use empty dependency array to prevent infinite loops from store updates

    const onSubmit = async (data: VipFormData) => {
        setIsSubmitting(true);
        setError(null);
        await inquiryService.submitVipForm(data);
    };

    const nextStep = async () => {
        const fieldsToValidate = step === 1 
            ? ['firstName', 'familyName', 'birthdate'] 
            : ['contactNumber', 'socialMedia', 'whoInvitedYou'];
        
        const isValid = await trigger(fieldsToValidate as any);
        if (isValid) {
            setStep(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const prevStep = () => {
        setStep(prev => prev - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="landing-page">
            <LandingHeader />

            <PageHero
                badge="Ministries"
                title="Community"
                subtitle="Doing Life Together"
                backgroundImage="https://gtxngthtpisigkys.public.blob.vercel-storage.com/community.jpg"
            />

            {/* Form Section with Progress */}

            {/* Form Section with Progress */}
            <main style={{ 
                backgroundColor: '#ffffff', 
                padding: '0 0 100px',
                marginTop: '-40px',
                position: 'relative',
                zIndex: 2
            }}>
                <div className="landing-container">
                    <div style={{ 
                        maxWidth: '800px', 
                        margin: '0 auto', 
                    }}>
                        {/* Progress Tracker */}
                        {!submitted && (
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                gap: '12px',
                                marginBottom: '40px'
                            }}>
                                <div style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    borderRadius: '50%', 
                                    backgroundColor: step >= 1 ? 'var(--primary-gold-accent)' : '#e2e8f0',
                                    color: step >= 1 ? 'white' : '#64748b',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '700',
                                    transition: 'all 0.3s ease',
                                    boxShadow: step >= 1 ? '0 4px 12px rgba(240, 180, 41, 0.3)' : 'none'
                                }}>
                                    {step > 1 ? <i className="pi pi-check" /> : '1'}
                                </div>
                                <div style={{ width: '60px', height: '2px', backgroundColor: step > 1 ? 'var(--primary-gold-accent)' : '#e2e8f0' }} />
                                <div style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    borderRadius: '50%', 
                                    backgroundColor: step >= 2 ? 'var(--primary-gold-accent)' : '#e2e8f0',
                                    color: step >= 2 ? 'white' : '#64748b',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '700',
                                    transition: 'all 0.3s ease',
                                    boxShadow: step >= 2 ? '0 4px 12px rgba(240, 180, 41, 0.3)' : 'none'
                                }}>
                                    2
                                </div>
                            </div>
                        )}

                        <div style={{ 
                            backgroundColor: '#ffffff', 
                            borderRadius: '32px', 
                            padding: '48px',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.08)',
                            border: '1px solid rgba(0,0,0,0.05)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Decorative Blur */}
                            <div style={{
                                position: 'absolute',
                                top: '-20%',
                                right: '-10%',
                                width: '200px',
                                height: '200px',
                                backgroundColor: 'rgba(240, 180, 41, 0.05)',
                                filter: 'blur(40px)',
                                borderRadius: '50%'
                            }} />

                            {submitted ? (
                                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                    <div style={{ 
                                        width: '100px', 
                                        height: '100px', 
                                        backgroundColor: 'var(--primary-gold-accent)', 
                                        borderRadius: '50%', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        margin: '0 auto 32px',
                                        color: 'white',
                                        fontSize: '48px',
                                        boxShadow: '0 20px 40px rgba(240, 180, 41, 0.3)',
                                        animation: 'scaleIn 0.5s ease'
                                    }}>
                                        <i className="pi pi-heart-fill"></i>
                                    </div>
                                    <h2 style={{ fontSize: '32px', color: 'var(--color-navy)', marginBottom: '16px', fontWeight: '800' }}>You&apos;re All Set!</h2>
                                    <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: '1.6' }}>
                                        Thank you for sharing your details with us. <br />
                                        We can&apos;t wait to meet you properly!
                                    </p>
                                    <Link href="/" className="landing-btn landing-btn-primary" style={{ padding: '16px 40px', height: 'auto', fontSize: '16px' }}>
                                        Explore Our Community
                                    </Link>
                                </div>
                            ) : (
                                <FormProvider {...methods}>
                                    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                        {error && (
                                            <div style={{ 
                                                padding: '20px', 
                                                backgroundColor: '#fff1f2', 
                                                color: '#e11d48', 
                                                borderRadius: '16px', 
                                                fontSize: '14px',
                                                border: '1px solid #ffe4e6',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px'
                                            }}>
                                                <i className="pi pi-exclamation-circle" style={{ fontSize: '20px' }} />
                                                {error}
                                            </div>
                                        )}

                                        {step === 1 && (
                                            <div style={{ animation: 'fadeInRight 0.4s ease' }}>
                                                <h3 style={{ fontSize: '24px', color: 'var(--color-navy)', marginBottom: '32px', fontWeight: '700' }}>
                                                    Personal Details
                                                </h3>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="responsive-grid">
                                                    <FormInput 
                                                        name="firstName" 
                                                        label="First Name" 
                                                        placeholder="John" 
                                                        showRequired 
                                                        inputClassName="enhanced-input"
                                                    />
                                                    <FormInput 
                                                        name="familyName" 
                                                        label="Family Name" 
                                                        placeholder="Doe" 
                                                        showRequired 
                                                        inputClassName="enhanced-input"
                                                    />
                                                </div>
                                                <div style={{ marginTop: '24px' }}>
                                                    <FormCalendar 
                                                        name="birthdate" 
                                                        label="When is your birthday?" 
                                                        placeholder="Select your birthdate" 
                                                        showRequired 
                                                        calendarView={CalendarViewType.DATE}
                                                        format="mm/dd/yy"
                                                    />
                                                </div>
                                                <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
                                                    <button 
                                                        type="button" 
                                                        className="landing-btn landing-btn-primary" 
                                                        onClick={nextStep}
                                                        style={{ padding: '12px 32px' }}
                                                    >
                                                        Continue <i className="pi pi-arrow-right" style={{ marginLeft: '8px', fontSize: '12px' }} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {step === 2 && (
                                            <div style={{ animation: 'fadeInRight 0.4s ease' }}>
                                                <h3 style={{ fontSize: '24px', color: 'var(--color-navy)', marginBottom: '32px', fontWeight: '700' }}>
                                                    How can we reach you?
                                                </h3>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="responsive-grid">
                                                    <FormInput 
                                                        name="contactNumber" 
                                                        label="Mobile Number" 
                                                        placeholder="09XX XXX XXXX" 
                                                        showRequired 
                                                        inputClassName="enhanced-input"
                                                    />
                                                    <FormInput 
                                                        name="socialMedia" 
                                                        label="FB/IG Handle" 
                                                        placeholder="@johndoe" 
                                                        showRequired 
                                                        inputClassName="enhanced-input"
                                                    />
                                                </div>
                                                <div style={{ marginTop: '24px' }}>
                                                    <FormInput 
                                                        name="whoInvitedYou" 
                                                        label="Who invited you to Gateway?" 
                                                        placeholder="Name of your friend or family" 
                                                        showRequired 
                                                        inputClassName="enhanced-input"
                                                    />
                                                </div>
                                                
                                                <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                                                    <button 
                                                        type="button" 
                                                        className="landing-btn landing-btn-outline" 
                                                        onClick={prevStep}
                                                        style={{ padding: '12px 32px' }}
                                                    >
                                                        <i className="pi pi-arrow-left" style={{ marginRight: '8px', fontSize: '12px' }} /> Back
                                                    </button>
                                                    <button 
                                                        type="submit" 
                                                        className="landing-btn landing-btn-primary" 
                                                        style={{ padding: '12px 32px', minWidth: '200px', justifyContent: 'center' }}
                                                        disabled={isSubmitting}
                                                    >
                                                        {isSubmitting ? (
                                                            <i className="pi pi-spin pi-spinner"></i>
                                                        ) : (
                                                            <>Complete Registration <i className="pi pi-check-circle" style={{ marginLeft: '8px' }} /></>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </form>
                                </FormProvider>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <LandingFooter />

            <style jsx global>{`
                .enhanced-input {
                    border-radius: 12px !important;
                    padding: 12px 16px !important;
                    transition: all 0.2s ease !important;
                    border: 2px solid #e2e8f0 !important;
                }
                .enhanced-input:focus {
                    border-color: var(--primary-gold-accent) !important;
                    box-shadow: 0 0 0 4px rgba(240, 180, 41, 0.1) !important;
                }
                
                @keyframes scaleIn {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                
                @keyframes fadeInRight {
                    from { transform: translateX(20px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }

                @media (max-width: 640px) {
                    .responsive-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}
