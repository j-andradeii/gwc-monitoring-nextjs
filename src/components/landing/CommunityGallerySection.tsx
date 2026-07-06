'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

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
  const [activeMobileId, setActiveMobileId] = useState<number | null>(null);
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);

  const displayedImages = images.slice(0, 8);

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

  // Mobile has no hover, so a tap reveals the caption overlay. It only ever
  // reveals — never hides — so nothing disappears on tap, and there is no
  // lightbox/preview to open. Desktop shows the caption on hover.
  const handleTileClick = (image: GalleryImage) => {
    if (window.innerWidth <= 768) {
      setActiveMobileId(image.id);
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
          <p>Real moments from our church family.</p>
        </div>

        {/* Bento Grid Layout - Responsive for all screens */}
        <div className="bento-grid">
          {displayedImages.map((image, index) => (
            <div
              key={image.id}
              data-interact-id={`img-${image.id}`}
              className={`bento-item bento-item-${index + 1} animate-on-scroll ${activeMobileId === image.id ? 'active' : ''} ${visibleItems.has(`img-${image.id}`) ? 'visible' : ''}`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onClick={() => handleTileClick(image)}
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityGallerySection;
