'use client';

import React, { useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface MonthlyCalendarProps {
    imageSrc: string;
}

export const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
    imageSrc
}) => {
    const [isOpen, setIsOpen] = useState(false);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <section className="monthly-calendar-section" style={{ padding: '80px 0 20px' }}>
            <div className="landing-container" style={{ maxWidth: '1400px' }}>
                <div className="section-header-center" style={{ textAlign: 'left', marginBottom: '32px' }}>
                    <span className="section-label">Monthly Schedule</span>
                    <h2>Calendar of Activities</h2>
                </div>

                <div className="calendar-preview-container premium-glass-card">
                    {/* Thumbnail - Click to open */}
                    <div
                        style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer' }}
                        onClick={() => setIsOpen(true)}
                    >
                        <img
                            src={imageSrc}
                            alt="Monthly Calendar"
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                        />
                    </div>
                </div>
            </div>

            {/* Full Screen Zoom Modal */}
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9999,
                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        touchAction: 'none'
                    }}
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            zIndex: 10000,
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            color: 'white',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            backdropFilter: 'blur(4px)'
                        }}
                    >
                        <i className="pi pi-times" style={{ fontSize: '1.2rem' }}></i>
                    </button>

                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <TransformWrapper
                            initialScale={1}
                            minScale={0.5}
                            maxScale={4}
                            centerOnInit={true}
                            limitToBounds={false}
                        >
                            <TransformComponent
                                wrapperStyle={{ width: '100vw', height: '100vh' }}
                                contentStyle={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <img
                                    src={imageSrc}
                                    alt="Monthly Calendar Full"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain',
                                        userSelect: 'none'
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </TransformComponent>
                        </TransformWrapper>
                    </div>
                </div>
            )}
        </section>
    );
};
