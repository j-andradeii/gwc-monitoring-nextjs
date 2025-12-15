'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface GalleryImage {
  src: string;
  alt: string;
  span?: 'wide' | 'tall' | 'normal';
}

const galleryImages: GalleryImage[] = [
  { src: 'https://placehold.co/800x400/1a2744/d4a84b?text=Worship+Gathering', alt: 'Worship gathering', span: 'wide' },
  { src: 'https://placehold.co/400x400/4a3c6e/f5f0e6?text=Small+Group', alt: 'Small group fellowship', span: 'normal' },
  { src: 'https://placehold.co/400x800/6b2c3a/f5f0e6?text=Youth+Ministry', alt: 'Youth ministry', span: 'tall' },
  { src: 'https://placehold.co/400x400/1a2744/d4a84b?text=Outreach', alt: 'Community outreach', span: 'normal' },
  { src: 'https://placehold.co/400x400/4a3c6e/f5f0e6?text=Family+Event', alt: 'Family event', span: 'normal' },
  { src: 'https://placehold.co/800x400/d4a84b/1a2744?text=Volunteer+Team', alt: 'Volunteer team', span: 'wide' },
];

export const CommunityGallerySection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  return (
    <section className="community-gallery-section" id="community">
      <div className="landing-container">
        <div className="section-header-center">
          <span className="section-label">Our Community</span>
          <h2>Life Together</h2>
          <p>
            Real moments from our vibrant church family. We laugh, serve, worship,
            and grow together.
          </p>
        </div>

        {/* Masonry Grid for Desktop */}
        <div className="gallery-masonry">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className={`gallery-item gallery-item-${image.span || 'normal'} animate-on-scroll`}
            >
              <div className="gallery-image-wrapper">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="gallery-image"
                  unoptimized
                />
                <div className="gallery-overlay">
                  <span className="gallery-caption">{image.alt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel for Mobile */}
        <div className="gallery-carousel">
          <div className="carousel-container">
            <div
              className="carousel-track"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {galleryImages.map((image, index) => (
                <div key={index} className="carousel-slide">
                  <div className="carousel-image-wrapper">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="100vw"
                      className="carousel-image"
                      priority={index === 0}
                      unoptimized
                    />
                  </div>
                  <p className="carousel-caption">{image.alt}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            className="carousel-btn carousel-btn-prev"
            onClick={prevSlide}
            aria-label="Previous image"
          >
            <i className="pi pi-chevron-left"></i>
          </button>
          <button
            className="carousel-btn carousel-btn-next"
            onClick={nextSlide}
            aria-label="Next image"
          >
            <i className="pi pi-chevron-right"></i>
          </button>

          <div className="carousel-dots">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="gallery-cta">
          <p>Want to be part of our story?</p>
          <a href="#contact" className="landing-btn landing-btn-outline">
            <i className="pi pi-heart"></i>
            Join Our Family
          </a>
        </div>
      </div>
    </section>
  );
};

export default CommunityGallerySection;
