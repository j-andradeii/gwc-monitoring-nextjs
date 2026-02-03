'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface MonthlyCalendarProps {
    imageSrc: string;
}

export const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
    imageSrc
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const scaleRef = useRef(1);
    const contentRef = useRef<HTMLDivElement>(null);
    const [dragY, setDragY] = useState(0);
    const touchStart = useRef<number | null>(null);
    const isDragging = useRef(false);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            scaleRef.current = 1;
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

                <div className="calendar-preview-container">
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

                        // Remove background color here as we use a separate overlay div for opacity control
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        touchAction: 'none'
                    }}
                    onTouchStart={(e) => {
                        if (scaleRef.current > 1.1) return;
                        touchStart.current = e.touches[0].clientY;
                        isDragging.current = true;
                    }}
                    onTouchMove={(e) => {
                        if (!isDragging.current || scaleRef.current > 1.1 || touchStart.current === null) return;
                        const currentY = e.touches[0].clientY;
                        const diff = currentY - touchStart.current;
                        if (diff > 0) { // Only allow dragging down
                            setDragY(diff);
                        }
                    }}
                    onTouchEnd={() => {
                        isDragging.current = false;
                        touchStart.current = null;
                        if (dragY > 150) {
                            setIsOpen(false);
                        }
                        setDragY(0);
                    }}
                    onMouseDown={(e) => {
                        if (scaleRef.current > 1.1) return;
                        touchStart.current = e.clientY;
                        isDragging.current = true;
                    }}
                    onMouseMove={(e) => {
                        if (!isDragging.current || scaleRef.current > 1.1 || touchStart.current === null) return;
                        const currentY = e.clientY;
                        const diff = currentY - touchStart.current;
                        if (diff > 0) {
                            setDragY(diff);
                        }
                    }}
                    onMouseUp={() => {
                        isDragging.current = false;
                        touchStart.current = null;
                        if (dragY > 150) {
                            setIsOpen(false);
                        }
                        setDragY(0);
                    }}
                >
                    {/* Background Overlay with Dynamic Opacity */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: 'black',
                            opacity: Math.max(0, 1 - dragY / 400),
                            transition: isDragging.current ? 'none' : 'opacity 0.3s ease-out'
                        }}
                    />


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

                    <div
                        ref={contentRef}
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: `translateY(${dragY}px)`,
                            transition: isDragging.current ? 'none' : 'transform 0.3s ease-out',
                        }}
                    >
                        <TransformWrapper
                            initialScale={1}
                            minScale={0.5}
                            maxScale={4}
                            centerOnInit={true}
                            limitToBounds={false}
                            onTransformed={(ref, state) => {
                                scaleRef.current = state.scale;
                            }}
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
