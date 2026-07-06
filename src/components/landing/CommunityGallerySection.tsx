'use client';

import React, { useState, useEffect } from 'react';
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

  const displayedImages = images.slice(0, 8);

  // Shuffle images on the client (deferred so server + first client render share
  // the original order — avoids a hydration mismatch). This is the ONLY state
  // update in this component; after it runs the gallery never re-renders again.
  useEffect(() => {
    const t = setTimeout(() => setImages(shuffleArray(galleryImages)), 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="community-gallery-section" id="community">
      <div className="landing-container landing-full-width">
        <div className="section-header-center animate-on-scroll">
          <span className="section-label">Our Community</span>
          <h2>Life Together</h2>
          <p>Real moments from our church family.</p>
        </div>

        {/*
          Bento Grid — pure display, no click behaviour.

          Scroll reveal is handled globally by ScrollAnimationProvider, which
          adds `.animate-visible` directly to the DOM. Tiles are keyed by grid
          POSITION (index), not image id, so the one-time client shuffle only
          swaps each slot's image and never rewrites a tile's className. That
          keeps the provider-added `.animate-visible` class intact — nothing
          disappears on re-render. There is no onClick / active state here, so a
          tap can never trigger a render that wipes the reveal either.
        */}
        <div className="bento-grid">
          {displayedImages.map((image, index) => (
            <div
              key={index}
              className={`bento-item bento-item-${index + 1} animate-on-scroll`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="bento-image"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityGallerySection;
