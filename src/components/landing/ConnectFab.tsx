'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '@/components/forms/FormInput';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { FormSelect } from '@/components/forms/FormSelect';
import { useScrollToFirstError } from '@/components/forms';
import { contactSchema, type ContactFormData } from '@/models/schemas/contact.schema';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/services/api-client';
import { useConnectFabStore } from '@/stores/connectFab.store';

const FAB_TEXTS = ['CONNECT', 'PRAYER?', 'NEED HELP?'];

export function ConnectFab() {
    const [isOpen, setIsOpen] = useState(false);
    const [textIndex, setTextIndex] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [activeTab, setActiveTab] = useState<'prayer' | 'join'>('prayer');
    const pathname = usePathname();
    const isEventDetailRoute = pathname.startsWith('/events/') && pathname !== '/events/vip-form';
    const isSermonNoteDetailRoute = pathname.startsWith('/sermon-notes/');
    const isFabHiddenRoute = pathname === '/give/ways-to-give' || isSermonNoteDetailRoute;

    const methods = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        mode: 'onChange',
        defaultValues: {
            type: 'prayer',
            name: '',
            email: '',
            phone: '',
            message: '',
        },
    });

    const { handleSubmit, reset, clearErrors } = methods;
    const scrollToError = useScrollToFirstError();

    const handleTabChange = (tab: 'prayer' | 'join') => {
        setActiveTab(tab);
        if (tab === 'prayer') {
            reset({
                type: 'prayer',
                name: '',
                email: '',
                phone: '',
                message: '',
            });
        } else {
            reset({
                type: 'join',
                name: '',
                email: '',
                phone: '',
                gender: '',
                facebook: '',
                instagram: '',
                address: '',
                joinReason: '',
            });
        }
        clearErrors();
    };

    const submitPrayerRequest = useMutation({
        mutationFn: (data: ContactFormData) =>
            apiClient.post('/api/inquiry/prayer-requests', data),
        onSuccess: () => {
            setSubmitted(true);
            reset();
        },
    });

    const submitCellGroupJoin = useMutation({
        mutationFn: (data: ContactFormData) =>
            apiClient.post('/api/inquiry/cell-groups', data),
        onSuccess: () => {
            setSubmitted(true);
            reset();
        },
    });

    const isSubmitting = submitPrayerRequest.isPending || submitCellGroupJoin.isPending;

    const onSubmit = (data: ContactFormData) => {
        if (activeTab === 'prayer') {
            submitPrayerRequest.mutate(data);
        } else {
            submitCellGroupJoin.mutate(data);
        }
    };

    // Close modal on route change
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setIsOpen(false), 0);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // Cycle FAB text
    useEffect(() => {
        const interval = setInterval(() => {
            setTextIndex((prev) => (prev + 1) % FAB_TEXTS.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Open on an external request (e.g. the homepage CTA slider's "Request Prayer" slide)
    const pendingTab = useConnectFabStore((s) => s.pendingTab);
    const clearConnectRequest = useConnectFabStore((s) => s.clearRequest);

    useEffect(() => {
        if (!pendingTab) return;
        setTimeout(() => {
            setActiveTab(pendingTab);
            setSubmitted(false);
            submitPrayerRequest.reset();
            submitCellGroupJoin.reset();
            reset(
                pendingTab === 'prayer'
                    ? { type: 'prayer', name: '', email: '', phone: '', message: '' }
                    : { type: 'join', name: '', email: '', phone: '', gender: '', facebook: '', instagram: '', address: '', joinReason: '' }
            );
            clearErrors();
            setIsOpen(true);
            clearConnectRequest();
        }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pendingTab]);

    const toggleModal = () => {
        if (!isOpen) {
            setActiveTab('prayer');
            setSubmitted(false);
            submitPrayerRequest.reset();
            submitCellGroupJoin.reset();
            reset({
                type: 'prayer',
                name: '',
                email: '',
                phone: '',
                message: '',
            });
            clearErrors();
        }
        setIsOpen(!isOpen);
    };

    const handleReset = () => {
        setSubmitted(false);
        submitPrayerRequest.reset();
        submitCellGroupJoin.reset();
        reset();
    };

    // Some pages (e.g. Ways to Give) opt out of the floating Connect button entirely.
    if (isFabHiddenRoute) {
        return null;
    }

    return (
        <>
            <button
                className={`connect-fab-btn${isEventDetailRoute ? ' connect-fab-btn--event-detail-hidden' : ''}`}
                onClick={toggleModal}
                aria-label="Connect with us"
                style={{ minWidth: '140px', justifyContent: 'center' }}
            >
                <span key={textIndex} className="fab-text-changing" style={{ minWidth: '80px', textAlign: 'center' }}>
                    {FAB_TEXTS[textIndex]}
                </span>
                <i className={`pi ${isOpen ? 'pi-times' : 'pi-comment'}`} style={{ fontSize: '1.2rem', marginLeft: 'auto' }}></i>
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
                            <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">WE&apos;RE HERE FOR YOU.</h2>
                            <p className="text-sm md:text-lg opacity-90">
                                Whether you have questions about faith, need prayer, or want to join a small group, we&apos;re just a message away.
                            </p>
                        </div>
                    </div>

                    {/* Right Side - Form & Options */}
                    <div className="connect-modal-right">
                        <div className="mb-6 md:mb-8">
                            <span className="text-xs font-bold text-yellow-600 tracking-widest uppercase mb-1 block">Connect With Us</span>
                            <h3 className="text-xl md:text-2xl font-bold text-navy-900 mb-2 md:mb-4 !mt-1" style={{ color: 'var(--color-navy)' }}>HOW CAN WE HELP?</h3>


                        </div>

                        {submitted ? (
                            <div className="contact-success-state">
                                <div className="success-checkmark">
                                    <i className="pi pi-check"></i>
                                </div>
                                <h3>Message Sent!</h3>
                                <p>We&apos;ll get back to you soon.</p>
                                <button onClick={handleReset} className="success-reset">
                                    Send another <i className="pi pi-arrow-right"></i>
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div className="grid grid-cols-2 gap-3 mb-4 !mt-2">
                                    <div
                                        className={`relative cursor-pointer transition-all duration-300 border-2 rounded-2xl p-3 flex flex-col items-center justify-center gap-2 text-center h-24 md:h-28 ${activeTab === 'prayer' ? 'border-yellow-500 bg-white shadow-md' : 'border-gray-100 bg-white hover:border-yellow-200 hover:shadow-sm'}`}
                                        onClick={() => handleTabChange('prayer')}
                                    >
                                        {activeTab === 'prayer' && (
                                            <div className="absolute top-2 right-2 text-yellow-500">
                                                <i className="pi pi-check-circle lg:text-md"></i>
                                            </div>
                                        )}
                                        <div className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${activeTab === 'prayer' ? 'bg-yellow-500 text-white shadow-sm' : 'bg-gray-100 text-gray-400'}`}>
                                            <i className="pi pi-heart text-lg"></i>
                                        </div>
                                        <span className={`font-bold text-[10px] md:text-xs uppercase tracking-wider leading-tight ${activeTab === 'prayer' ? 'text-navy-900' : 'text-gray-400'}`}>
                                            Request<br className="md:hidden" /> Prayer
                                        </span>
                                    </div>

                                    <div
                                        className={`relative cursor-pointer transition-all duration-300 border-2 rounded-2xl p-3 flex flex-col items-center justify-center gap-2 text-center h-24 md:h-28 ${activeTab === 'join' ? 'border-yellow-500 bg-white shadow-md' : 'border-gray-100 bg-white hover:border-yellow-200 hover:shadow-sm'}`}
                                        onClick={() => handleTabChange('join')}
                                    >
                                        {activeTab === 'join' && (
                                            <div className="absolute top-2 right-2 text-yellow-500">
                                                <i className="pi pi-check-circle lg:text-md"></i>
                                            </div>
                                        )}
                                        <div className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${activeTab === 'join' ? 'bg-yellow-500 text-white shadow-sm' : 'bg-gray-100 text-gray-400'}`}>
                                            <i className="pi pi-users text-lg"></i>
                                        </div>
                                        <span className={`font-bold text-[10px] md:text-xs uppercase tracking-wider leading-tight ${activeTab === 'join' ? 'text-navy-900' : 'text-gray-400'}`}>
                                            Join A<br className="md:hidden" /> Group
                                        </span>
                                    </div>
                                </div>

                                <FormProvider {...methods}>
                                    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit, scrollToError)}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 !mt-3">
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

                                            <div className={activeTab === 'prayer' ? 'md:col-span-2' : ''}>
                                                <FormInput
                                                    name="phone"
                                                    label="Phone Number"
                                                    placeholder="+1 234 567 8900"
                                                    showRequired
                                                    inputClassName="connect-input"
                                                    labelClassName="font-bold text-sm mb-1"
                                                />
                                            </div>

                                            {activeTab === 'join' && (
                                                <>
                                                    <FormSelect
                                                        name="gender"
                                                        label="Gender"
                                                        placeholder="Select Gender"
                                                        options={[
                                                            { label: 'Male', value: 'Male' },
                                                            { label: 'Female', value: 'Female' }
                                                        ]}
                                                        showRequired
                                                        dropdownClassName="connect-select"
                                                        labelClassName="font-bold text-sm mb-1"
                                                    />

                                                    <FormInput
                                                        name="facebook"
                                                        label="Facebook Link/Handle"
                                                        inputClassName="connect-input"
                                                        labelClassName="font-bold text-sm mb-1"
                                                    />

                                                    <FormInput
                                                        name="instagram"
                                                        label="Instagram Link/Handle"
                                                        inputClassName="connect-input"
                                                        labelClassName="font-bold text-sm mb-1"
                                                    />
                                                    <div className="md:col-span-2">
                                                        <FormInput
                                                            name="address"
                                                            label="Address"
                                                            placeholder="123 Main St, City, Country"
                                                            showRequired
                                                            inputClassName="connect-input"
                                                            labelClassName="font-bold text-sm mb-1"
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className="w-full">
                                            {activeTab === 'prayer' ? (
                                                <FormTextarea
                                                    name="message"
                                                    label="Prayer Request"
                                                    placeholder="HOW CAN WE PRAY FOR YOU OR HELP YOU TODAY?"
                                                    rows={4}
                                                    showRequired
                                                    textareaClassName="connect-input"
                                                    labelClassName="font-bold text-sm mb-1"
                                                />
                                            ) : (
                                                <FormTextarea
                                                    name="joinReason"
                                                    label="Why do you want to join a cell group?"
                                                    placeholder="Tell us a bit about yourself and why you'd like to join..."
                                                    rows={4}
                                                    showRequired
                                                    textareaClassName="connect-input"
                                                    labelClassName="font-bold text-sm mb-1"
                                                />
                                            )}
                                        </div>

                                        {activeTab === 'join' && (
                                            <div className="text-center">
                                                <Link href="/ministries/community" onClick={() => setIsOpen(false)} className="inline-flex items-center gap-2 text-sm text-yellow-600 hover:text-yellow-700 font-bold uppercase tracking-wider transition-colors">
                                                    Check our Community <i className="pi pi-arrow-right"></i>
                                                </Link>
                                            </div>
                                        )}

                                        <button type="submit" className="connect-submit-btn" disabled={isSubmitting}>
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
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
