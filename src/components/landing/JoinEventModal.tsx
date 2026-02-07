'use client';

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '@/components/forms/FormInput';
import { eventContactSchema, type EventContactFormData } from '@/models/schemas/contact.schema';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    eventSlug: string;
    eventTitle: string;
}

export function JoinEventModal({ isOpen, onClose, eventSlug, eventTitle }: Props) {
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const methods = useForm<EventContactFormData>({
        resolver: zodResolver(eventContactSchema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            address: '',
            gender: '',
            facebook: '',
            message: '',
        },
    });

    const { handleSubmit, reset } = methods;

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const onSubmit = async (data: EventContactFormData) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`/api/event/${eventSlug}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Failed to submit registration');
            }

            setSubmitted(true);
            reset();
        } catch (err: unknown) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setSubmitted(false);
        reset();
    };

    if (!isOpen) return null;

    return (
        <div className={`connect-modal-overlay open`} onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className="connect-modal-content">
                <button className="connect-close-btn" onClick={onClose}>
                    <i className="pi pi-times"></i>
                </button>

                {/* Left Side - Image/Visual */}
                <div className="connect-modal-left" style={{ backgroundImage: 'url("https://gtxngthtpisigkys.public.blob.vercel-storage.com/pray.jpg")' }}>
                    <div className="connect-modal-left-content">
                        <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">JOIN EVENT</h2>
                        <p className="text-sm md:text-lg opacity-90">
                            We're excited to have you join us for <strong>{eventTitle}</strong>. Please fill out the form to register.
                        </p>
                    </div>
                </div>

                {/* Right Side - Form & Options */}
                <div className="connect-modal-right">
                    <div className="mb-6 md:mb-8">
                        <span className="text-xs font-bold text-yellow-600 tracking-widest uppercase mb-1 block">Registration</span>
                        <h3 className="text-xl md:text-2xl font-bold text-navy-900 mb-2 md:mb-4 !mt-1" style={{ color: 'var(--color-navy)' }}>ENTER YOUR DETAILS</h3>
                    </div>

                    {submitted ? (
                        <div className="contact-success-state">
                            <div className="success-checkmark">
                                <i className="pi pi-check"></i>
                            </div>
                            <h3>Registration Sent!</h3>
                            <p>We'll look forward to seeing you there.</p>
                            <button onClick={onClose} className="success-reset">
                                Close <i className="pi pi-times"></i>
                            </button>
                        </div>
                    ) : (
                        <div>
                            {error && (
                                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <FormProvider {...methods}>
                                <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
                                    <div className="grid grid-cols-1 gap-3 !mt-3">
                                        <FormInput
                                            name="name"
                                            label="Full Name"
                                            showRequired
                                            inputClassName="connect-input"
                                            labelClassName="font-bold text-sm mb-1"
                                        />

                                        <FormInput
                                            name="email"
                                            label="Email Address"
                                            showRequired
                                            inputClassName="connect-input"
                                            labelClassName="font-bold text-sm mb-1"
                                        />

                                        <FormInput
                                            name="phone"
                                            label="Phone Number"
                                            placeholder="+1 234 567 8900"
                                            showRequired
                                            inputClassName="connect-input"
                                            labelClassName="font-bold text-sm mb-1"
                                        />
                                    </div>

                                    <button type="submit" className="connect-submit-btn mt-4" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <i className="pi pi-spin pi-spinner"></i>
                                        ) : (
                                            <>
                                                JOIN EVENT <i className="pi pi-check text-sm"></i>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </FormProvider>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
