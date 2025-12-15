'use client';

import React from 'react';
import Image from 'next/image';
import { Carousel } from 'primereact/carousel';

interface GalleryImage {
  src: string;
  alt: string;
  category: string;
}

const galleryImages: GalleryImage[] = [
  { src: 'https://placehold.co/600x400/1a2744/d4a84b?text=Worship', alt: 'Sunday Worship', category: 'Worship' },
  { src: 'https://placehold.co/600x400/d4a84b/1a2744?text=Fellowship', alt: 'Fellowship Lunch', category: 'Fellowship' },
  { src: 'https://placehold.co/600x400/1a2744/f5f0e6?text=Youth', alt: 'Youth Night', category: 'Youth' },
  { src: 'https://placehold.co/600x400/d4a84b/1a2744?text=Outreach', alt: 'Community Outreach', category: 'Outreach' },
  { src: 'https://placehold.co/600x400/1a2744/d4a84b?text=Kids', alt: 'Kids Ministry', category: 'Kids' },
  { src: 'https://placehold.co/600x400/d4a84b/1a2744?text=Serve', alt: 'Volunteer Team', category: 'Serve' },
];

const responsiveOptions = [
  {
    breakpoint: '1400px',
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: '1024px',
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: '767px',
    numVisible: 1,
    numScroll: 1,
  },
];

export const CommunityGallerySection: React.FC = () => {
  const imageTemplate = (image: GalleryImage) => {
    return (
      <div className="gallery-slide">
        <div className="gallery-slide-inner">
          <div className="gallery-slide-image">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 767px) 90vw, (max-width: 1024px) 45vw, 30vw"
              className="gallery-image"
              unoptimized
            />
          </div>
          <div className="gallery-slide-content">
            <span className="gallery-slide-category">{image.category}</span>
            <h3 className="gallery-slide-title">{image.alt}</h3>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="community-gallery-section" id="community">
      <div className="landing-container">
        <div className="section-header-center">
          <span className="section-label">Our Community</span>
          <h2>Life Together</h2>
          <p>Real moments from our vibrant church family</p>
        </div>

        <div className="gallery-carousel-wrapper">
          <Carousel
            value={galleryImages}
            numVisible={2}
            numScroll={1}
            responsiveOptions={responsiveOptions}
            itemTemplate={imageTemplate}
            circular
            autoplayInterval={4000}
            className="community-carousel"
          />
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
