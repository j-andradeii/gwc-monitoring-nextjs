'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function ConnectFab() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

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
                    <div className="connect-modal-left" style={{ backgroundImage: 'url("/assets/images/fam-picture.jpg")' }}>
                        <div className="connect-modal-left-content">
                            <h2 className="text-4xl font-bold mb-4">WE'RE HERE FOR YOU.</h2>
                            <p className="text-lg opacity-90">
                                Whether you have questions about faith, need prayer, or want to join a small group, we're just a message away.
                            </p>
                        </div>
                    </div>

                    {/* Right Side - Form & Options */}
                    <div className="connect-modal-right">
                        <div className="mb-8">
                            <span className="text-xs font-bold text-yellow-600 tracking-widest uppercase mb-2 block">Connect With Us</span>
                            <h3 className="text-3xl font-bold text-navy-900 mb-6" style={{ color: 'var(--color-navy)' }}>HOW CAN WE HELP?</h3>

                            <div className="connect-options-grid">
                                <div className="connect-option-card">
                                    <div className="connect-option-icon">
                                        <i className="pi pi-heart"></i>
                                    </div>
                                    <span className="font-bold text-sm text-dark">REQUEST PRAYER</span>
                                </div>
                                <div className="connect-option-card">
                                    <div className="connect-option-icon">
                                        <i className="pi pi-users"></i>
                                    </div>
                                    <span className="font-bold text-sm text-dark">JOIN A GROUP</span>
                                </div>
                            </div>
                        </div>

                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Full Name</label>
                                    <input type="text" placeholder="JOHN DOE" className="connect-input" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email Address</label>
                                    <input type="email" placeholder="JOHN@EXAMPLE.COM" className="connect-input" />
                                </div>
                            </div>

                            <div className="space-y-1" style={{ marginBottom: '16px' }}>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Your Message</label>
                                <textarea
                                    placeholder="HOW CAN WE PRAY FOR YOU OR HELP YOU TODAY?"
                                    className="connect-input"
                                    rows={4}
                                    style={{ resize: 'none' }}
                                ></textarea>
                            </div>

                            <button type="submit" className="connect-submit-btn mt-4">
                                SEND MESSAGE <i className="pi pi-send text-sm"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
