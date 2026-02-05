'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface GalleryImage {
    id: number;
    src: string;
    alt: string;
    caption: string;
}

interface ProjectGalleryProps {
    images: GalleryImage[];
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({ images }) => {
    const [previewIndex, setPreviewIndex] = useState<number | null>(null);
    const [scale, setScale] = useState(1);
    const [dragY, setDragY] = useState(0);
    const touchStart = useRef<number | null>(null);
    const isDragging = useRef(false);

    const isZoomed = scale > 1.05;

    // Handle Next/Prev
    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (previewIndex !== null) {
            setPreviewIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
            setScale(1); // Reset zoom on change
        }
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (previewIndex !== null) {
            setPreviewIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
            setScale(1); // Reset zoom on change
        }
    };

    // Lock body scroll when modal is open
    useEffect(() => {
        if (previewIndex !== null) {
            document.body.style.overflow = 'hidden';
            setScale(1);
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [previewIndex]);

    return (
        <>
            <div className="gallery-grid">
                {images.map((image, index) => (
                    <div
                        key={image.id}
                        className="gallery-item"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setPreviewIndex(index)}
                    >
                        <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="gallery-image"
                            unoptimized
                        />
                        <div className="gallery-caption">
                            <span></span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Full Screen Zoom Modal */}
            {previewIndex !== null && createPortal(
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9999,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        touchAction: 'none'
                    }}
                    onTouchStart={(e) => {
                        if (isZoomed) return;
                        touchStart.current = e.touches[0].clientY;
                        isDragging.current = true;
                    }}
                    onTouchMove={(e) => {
                        if (!isDragging.current || isZoomed || touchStart.current === null) return;
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
                            setPreviewIndex(null);
                        }
                        setDragY(0);
                    }}
                    onMouseDown={(e) => {
                        if (isZoomed) return;
                        touchStart.current = e.clientY;
                        isDragging.current = true;
                    }}
                    onMouseMove={(e) => {
                        if (!isDragging.current || isZoomed || touchStart.current === null) return;
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
                            setPreviewIndex(null);
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
                        onClick={() => setPreviewIndex(null)}
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

                    {/* Navigation Buttons */}
                    <button
                        onClick={handlePrev}
                        style={{
                            position: 'absolute',
                            left: '20px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 10000,
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            color: 'white',
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            backdropFilter: 'blur(4px)',
                        }}
                    >
                        <i className="pi pi-chevron-left" style={{ fontSize: '1.5rem' }}></i>
                    </button>

                    <button
                        onClick={handleNext}
                        style={{
                            position: 'absolute',
                            right: '20px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 10000,
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            color: 'white',
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            backdropFilter: 'blur(4px)',
                        }}
                    >
                        <i className="pi pi-chevron-right" style={{ fontSize: '1.5rem' }}></i>
                    </button>

                    <div
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
                            minScale={1}
                            maxScale={4}
                            centerOnInit={true}
                            limitToBounds={false}
                            panning={{ disabled: !isZoomed }}
                            onTransformed={(ref, state) => {
                                setScale(state.scale);
                            }}
                        >
                            <TransformComponent
                                wrapperStyle={{ width: '100vw', height: '100vh' }}
                                contentStyle={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <img
                                    key={images[previewIndex].id} // Force re-render on image change
                                    src={images[previewIndex].src}
                                    alt={images[previewIndex].alt}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                        userSelect: 'none'
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </TransformComponent>
                        </TransformWrapper>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};
