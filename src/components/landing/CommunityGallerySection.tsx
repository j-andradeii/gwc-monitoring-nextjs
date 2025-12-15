'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

const galleryImages: GalleryImage[] = [
  { id: 1, src: 'https://placehold.co/800x600/1a2744/d4a84b?text=1', alt: 'Sunday Worship' },
  { id: 2, src: 'https://placehold.co/600x600/d4a84b/1a2744?text=2', alt: 'Fellowship Lunch' },
  { id: 3, src: 'https://placehold.co/600x400/1a2744/f5f0e6?text=3', alt: 'Youth Night' },
  { id: 4, src: 'https://placehold.co/600x400/d4a84b/1a2744?text=4', alt: 'Community Outreach' },
  { id: 5, src: 'https://placehold.co/800x600/1a2744/d4a84b?text=5', alt: 'Kids Ministry' },
  { id: 6, src: 'https://placehold.co/600x600/d4a84b/1a2744?text=6', alt: 'Volunteer Team' },
  { id: 7, src: 'https://placehold.co/600x400/1a2744/f5f0e6?text=7', alt: 'Prayer Meeting' },
  { id: 8, src: 'https://placehold.co/800x600/d4a84b/1a2744?text=8', alt: 'Baptism Service' },
  { id: 9, src: 'https://placehold.co/600x600/1a2744/d4a84b?text=9', alt: 'Small Groups' },
  { id: 10, src: 'https://placehold.co/600x400/d4a84b/1a2744?text=10', alt: 'Mission Trip' },
];

export const CommunityGallerySection: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="community-gallery-section" id="community">
      <div className="landing-container">
        <div className="section-header-center">
          <span className="section-label">Our Community</span>
          <h2>Life Together</h2>
          <p>Real moments from our vibrant church family</p>
        </div>

        <div className="collage-grid">
          {galleryImages.map((image, index) => (
            <div
              key={image.id}
              className={`collage-item collage-item-${index + 1} ${hoveredId === image.id ? 'active' : ''} ${hoveredId && hoveredId !== image.id ? 'dimmed' : ''}`}
              onMouseEnter={() => setHoveredId(image.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="collage-image-wrapper">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="collage-image"
                  unoptimized
                />
              </div>
            </div>
          ))}
        </div>

        <div className="gallery-cta">
          <a href="#contact" className="landing-btn landing-btn-primary">
            <i className="pi pi-users"></i>
            Join Our Family
          </a>
        </div>
      </div>
    </section>
  );
};

export default CommunityGallerySection;
