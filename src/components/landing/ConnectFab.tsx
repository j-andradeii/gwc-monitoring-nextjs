'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '@/components/forms/FormInput';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { contactSchema, type ContactFormData } from '@/models/schemas/contact.schema';

export function ConnectFab() {
    const [isOpen, setIsOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const pathname = usePathname();

    const methods = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        mode: 'onChange', // Enable real-time validation as user types
        defaultValues: {
            name: '',
            email: '',
            message: '',
        },
    });

    const { handleSubmit, reset } = methods;

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setSubmitted(true);
        reset();
    };

    // Close modal on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

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

    const toggleModal = () => setIsOpen(!isOpen);

    const handleReset = () => {
        setSubmitted(false);
        reset();
    };

    return (
        <>
            <button
                className="connect-fab-btn"
                onClick={toggleModal}
                aria-label="Connect with us"
            >
                <span>CONNECT</span>
                <i className={`pi ${isOpen ? 'pi-times' : 'pi-comment'}`} style={{ fontSize: '1.2rem' }}></i>
            </button>

            <div className={`connect-modal-overlay ${isOpen ? 'open' : ''}`} onClick={(e) => {
                if (e.target === e.currentTarget) setIsOpen(false);
            }}>
                <div className="connect-modal-content">
                    <button className="connect-close-btn" onClick={() => setIsOpen(false)}>
                        <i className="pi pi-times"></i>
                    </button>

                    {/* Left Side - Image/Visual */}
                    <div className="connect-modal-left" style={{ backgroundImage: 'url("https://gtxngthtpisigkys.public.blob.vercel-storage.com/pray.jpg")' }}>
                        <div className="connect-modal-left-content">
                            <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">WE'RE HERE FOR YOU.</h2>
                            <p className="text-sm md:text-lg opacity-90">
                                Whether you have questions about faith, need prayer, or want to join a small group, we're just a message away.
                            </p>
                        </div>
                    </div>

                    {/* Right Side - Form & Options */}
                    <div className="connect-modal-right">
                        <div className="mb-6 md:mb-8">
                            <span className="text-xs font-bold text-yellow-600 tracking-widest uppercase mb-2 block">Connect With Us</span>
                            <h3 className="text-2xl md:text-3xl font-bold text-navy-900 mb-4 md:mb-6" style={{ color: 'var(--color-navy)' }}>HOW CAN WE HELP?</h3>

                            <div className="connect-options-grid">
                                <div className="connect-option-card">
                                    <div className="connect-option-icon">
                                        <i className="pi pi-heart"></i>
                                    </div>
                                    <span className="font-bold text-xs md:text-sm text-dark">REQUEST PRAYER</span>
                                </div>
                                <div className="connect-option-card">
                                    <div className="connect-option-icon">
                                        <i className="pi pi-users"></i>
                                    </div>
                                    <span className="font-bold text-xs md:text-sm text-dark">JOIN A GROUP</span>
                                </div>
                            </div>
                        </div>

                        {submitted ? (
                            <div className="contact-success-state">
                                <div className="success-checkmark">
                                    <i className="pi pi-check"></i>
                                </div>
                                <h3>Message Sent!</h3>
                                <p>We'll get back to you soon.</p>
                                <button onClick={handleReset} className="success-reset">
                                    Send another <i className="pi pi-arrow-right"></i>
                                </button>
                            </div>
                        ) : (
                            <FormProvider {...methods}>
                                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <FormInput
                                                name="name"
                                                label="Full Name"
                                                placeholder="JOHN DOE"
                                                showRequired
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <FormInput
                                                name="email"
                                                label="Email Address"
                                                placeholder="JOHN@EXAMPLE.COM"
                                                showRequired
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1" style={{ marginBottom: '16px', marginTop: '16px' }}>
                                        <FormTextarea
                                            name="message"
                                            label="Your Message"
                                            placeholder="HOW CAN WE PRAY FOR YOU OR HELP YOU TODAY?"
                                            rows={4}
                                            showRequired
                                        />
                                    </div>

                                    <button type="submit" className="connect-submit-btn mt-4" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <i className="pi pi-spin pi-spinner"></i>
                                        ) : (
                                            <>
                                                SEND MESSAGE <i className="pi pi-send text-sm"></i>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </FormProvider>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
