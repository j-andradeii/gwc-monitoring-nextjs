'use client';

import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '@/components/forms/FormInput';
import { eventContactSchema, type EventContactFormData } from '@/models/schemas/contact.schema';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    eventSlug: string;
    eventTitle: string;
}

export function JoinEventModal({ isOpen, onClose, eventSlug, eventTitle }: Props) {
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

    const submitEventInquiry = useMutation({
        mutationFn: (data: EventContactFormData) =>
            apiClient.post(`/api/event/${eventSlug}`, data),
        onSuccess: () => {
            reset();
        },
    });

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Reset state when opening
            submitEventInquiry.reset();
            reset({
                name: '',
                email: '',
                phone: '',
                address: '',
                gender: '',
                facebook: '',
                message: '',
            });
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, reset]);

    const onSubmit = (data: EventContactFormData) => {
        submitEventInquiry.mutate(data);
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
                            We&apos;re excited to have you join us for <strong>{eventTitle}</strong>. Please fill out the form to register.
                        </p>
                    </div>
                </div>

                {/* Right Side - Form & Options */}
                <div className="connect-modal-right">
                    <div className="mb-6 md:mb-8">
                        <span className="text-xs font-bold text-yellow-600 tracking-widest uppercase mb-1 block">Registration</span>
                        <h3 className="text-xl md:text-2xl font-bold text-navy-900 mb-2 md:mb-4 !mt-1" style={{ color: 'var(--color-navy)' }}>ENTER YOUR DETAILS</h3>
                    </div>

                    {submitEventInquiry.isSuccess ? (
                        <div className="contact-success-state">
                            <div className="success-checkmark">
                                <i className="pi pi-check"></i>
                            </div>
                            <h3>Registration Sent!</h3>
                            <p>We&apos;ll look forward to seeing you there.</p>
                            <button onClick={onClose} className="success-reset">
                                Close <i className="pi pi-times"></i>
                            </button>
                        </div>
                    ) : (
                        <div>
                            {submitEventInquiry.isError && (
                                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                                    Something went wrong. Please try again.
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

                                    <button type="submit" className="connect-submit-btn mt-4" disabled={submitEventInquiry.isPending}>
                                        {submitEventInquiry.isPending ? (
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
