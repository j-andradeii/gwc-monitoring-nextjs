'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

const galleryImages: GalleryImage[] = [
  { id: 1, src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/community/1.jpg', alt: 'Sunday Worship' },
  { id: 2, src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/community/2.jpg', alt: 'Fellowship Lunch' },
  { id: 3, src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/community/3.jpg', alt: 'Youth Night' },
  { id: 4, src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/community/4.jpg', alt: 'Community Outreach' },
  { id: 5, src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/community/5.jpg', alt: 'Kids Ministry' },
  { id: 6, src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/community/6.jpg', alt: 'Volunteer Team' },
  { id: 7, src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/community/8.jpg', alt: 'Prayer Meeting' },
  { id: 8, src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/community/9.jpg', alt: 'Baptism Service' },
];

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const CommunityGallerySection: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>(galleryImages);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [scale, setScale] = useState(1);
  const [dragY, setDragY] = useState(0);
  const [isDraggingState, setIsDraggingState] = useState(false);
  const [activeMobileId, setActiveMobileId] = useState<number | null>(null);
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);
  const touchStart = useRef<number | null>(null);
  const isDragging = useRef(false);

  const displayedImages = images.slice(0, 8);
  const lightboxOpen = previewIndex !== null;
  const isZoomed = scale > 1.05;

  // Shuffle images on client (deferred to avoid synchronous setState in effect)
  useEffect(() => {
    const t = setTimeout(() => setImages(shuffleArray(galleryImages)), 0);
    return () => clearTimeout(t);
  }, []);

  // Scroll Animation Observer - Scoped to this component
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-interact-id');
            if (id) {
              setVisibleItems((prev) => {
                const newSet = new Set(prev);
                newSet.add(id);
                return newSet;
              });
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      const items = sectionRef.current.querySelectorAll('.animate-on-scroll');
      items.forEach((item) => observer.observe(item));
    }

    return () => {
      observer.disconnect();
    };
  }, [images]); // Re-run when images are set (shuffled)

  const openLightbox = (index: number) => {
    setScale(1);
    setDragY(0);
    setPreviewIndex(index);
  };

  const closeLightbox = () => {
    setPreviewIndex(null);
  };

  // Handle Next/Prev
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewIndex !== null) {
      setPreviewIndex((prev) => (prev !== null && prev < displayedImages.length - 1 ? prev + 1 : 0));
      setScale(1); // Reset zoom on change
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewIndex !== null) {
      setPreviewIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : displayedImages.length - 1));
      setScale(1); // Reset zoom on change
    }
  };

  // Lock body scroll while the lightbox is open; cleanup always restores it
  // (covers close AND unmount) — writing document.body.style directly
  // inside a click handler is a react-hooks/immutability violation.
  useEffect(() => {
    if (!lightboxOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [lightboxOpen]);

  // Close the lightbox with Escape
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [lightboxOpen]);

  // Desktop: click opens the lightbox. Mobile: first tap reveals the caption
  // overlay, second tap opens the lightbox.
  const handleTileClick = (image: GalleryImage, index: number) => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile && activeMobileId !== image.id) {
      setActiveMobileId(image.id);
      return;
    }
    openLightbox(index);
  };

  const handleTileKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openLightbox(index);
    }
  };

  return (
    <section className="community-gallery-section" id="community" ref={sectionRef}>
      <div className="landing-container landing-full-width">
        <div
          className={`section-header-center animate-on-scroll ${visibleItems.has('header') ? 'visible' : ''}`}
          data-interact-id="header"
        >
          <span className="section-label">Our Community</span>
          <h2>Life Together</h2>
          <p>Real moments from our church family — tap any photo for a closer look.</p>
        </div>

        {/* Bento Grid Layout - Responsive for all screens */}
        <div className="bento-grid">
          {displayedImages.map((image, index) => (
            <div
              key={image.id}
              data-interact-id={`img-${image.id}`}
              className={`bento-item bento-item-${index + 1} animate-on-scroll ${activeMobileId === image.id ? 'active' : ''} ${visibleItems.has(`img-${image.id}`) ? 'visible' : ''}`}
              style={{ transitionDelay: `${index * 100}ms` }}
              role="button"
              tabIndex={0}
              aria-label={`View photo: ${image.alt}`}
              onClick={() => handleTileClick(image, index)}
              onKeyDown={(event) => handleTileKeyDown(event, index)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="bento-image"
                unoptimized
              />
              <div className="bento-overlay">
                <h3>{image.alt}</h3>
                <span className="bento-expand" aria-hidden="true">
                  <i className="pi pi-search-plus"></i>
                </span>
              </div>
            </div>
          ))}
        </div>
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
            setIsDraggingState(true);
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
            setIsDraggingState(false);
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
            setIsDraggingState(true);
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
            setIsDraggingState(false);
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
              transition: isDraggingState ? 'none' : 'opacity 0.3s ease-out'
            }}
          />

          {/* Close Button */}
          <button
            onClick={closeLightbox}
            aria-label="Close photo viewer"
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
            aria-label="Previous photo"
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
            aria-label="Next photo"
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
              transition: isDraggingState ? 'none' : 'transform 0.3s ease-out',
            }}
          >
            <TransformWrapper
              key={displayedImages[previewIndex].id} // Remount per image so zoom/pan reset on navigation
              initialScale={1}
              minScale={1}
              maxScale={4}
              centerOnInit={true}
              limitToBounds={false}
              panning={{ disabled: !isZoomed }}
              onTransformed={(_ref, state) => {
                setScale(state.scale);
              }}
            >
              <TransformComponent
                wrapperStyle={{ width: '100vw', height: '100vh' }}
                contentStyle={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <img
                  src={displayedImages[previewIndex].src}
                  alt={displayedImages[previewIndex].alt}
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
    </section>
  );
};

export default CommunityGallerySection;
