'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Carousel } from 'primereact/carousel';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

const galleryImages: GalleryImage[] = [
  { id: 1, src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/597992661_122181102518766700_6759379141760359149_n.jpg', alt: 'Sunday Worship' },
  { id: 2, src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/598001057_122181102470766700_7721753414270859091_n.jpg', alt: 'Fellowship Lunch' },
  { id: 3, src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/598354889_122181101306766700_7166132187056166846_n.jpg', alt: 'Youth Night' },
  { id: 4, src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/598691167_122181202298766700_3747857486846455162_n.jpg', alt: 'Community Outreach' },
  { id: 5, src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/598696417_122181101384766700_414950063467040030_n.jpg', alt: 'Kids Ministry' },
  { id: 6, src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/598714870_122181102446766700_1099840975765605389_n.jpg', alt: 'Volunteer Team' },
  { id: 7, src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/598718079_122181100730766700_1031415504206357468_n.jpg', alt: 'Prayer Meeting' },
  { id: 8, src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/598721854_122181101078766700_9143129039121658822_n.jpg', alt: 'Baptism Service' },
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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Shuffle images on client
  useEffect(() => {
    setImages(shuffleArray(galleryImages));

    // Scroll Animation Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = document.querySelectorAll('.animate-on-scroll');
    items.forEach((item) => observer.observe(item));

    return () => {
      items.forEach((item) => observer.unobserve(item));
    };
  }, []);

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setTimeout(() => setSelectedImage(null), 300); // Wait for fade out
    document.body.style.overflow = 'unset';
  };

  return (
    <section className="community-gallery-section" id="community">
      <div className="landing-container landing-full-width">
        <div className="section-header-center animate-on-scroll">
          <span className="section-label">Our Community</span>
          <h2>Life Together</h2>
        </div>

        {/* Bento Grid Layout - Responsive for all screens */}
        <div className="bento-grid">
          {images.slice(0, 8).map((image, index) => (
            <div
              key={image.id}
              className={`bento-item bento-item-${index + 1} animate-on-scroll`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onClick={() => openLightbox(image)}
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

      {/* Lightbox Overlay */}
      <div
        className={`gallery-lightbox ${lightboxOpen ? 'active' : ''}`}
        onClick={closeLightbox}
      >
        <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
          <button className="lightbox-close" onClick={closeLightbox}>
            <i className="pi pi-times"></i>
          </button>
          {selectedImage && (
            <div className="lightbox-image-container">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="lightbox-image"
                quality={100}
                unoptimized
              />
              <div className="lightbox-caption">
                <h3>{selectedImage.alt}</h3>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};



export default CommunityGallerySection;
