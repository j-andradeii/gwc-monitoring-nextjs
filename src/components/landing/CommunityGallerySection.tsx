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
  { id: 9, src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/599091342_122181201380766700_3421192293662917158_n.jpg', alt: 'Baptism Service' },
  { id: 10, src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/600146957_122181101264766700_1441013425288215129_n.jpg', alt: 'Baptism Service' },
  { id: 11, src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/600224903_122181100880766700_1204906234095728137_n.jpg', alt: 'Baptism Service' },
  { id: 12, src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/600246917_122181101246766700_5544020493032707358_n.jpg', alt: 'Baptism Service' },
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
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [images, setImages] = useState<GalleryImage[]>(galleryImages);
  const [isMobile, setIsMobile] = useState(false);

  // Shuffle images and detect mobile on client
  useEffect(() => {
    setImages(shuffleArray(galleryImages));

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Carousel item template
  const carouselItemTemplate = (image: GalleryImage) => {
    return (
      <div className="gallery-carousel-item">
        <div className="carousel-image-wrapper">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="90vw"
            className="carousel-image"
            unoptimized
          />
        </div>
      </div>
    );
  };

  return (
    <section className="community-gallery-section" id="community">
      <div className="landing-container landing-full-width">
        <div className="section-header-center">
          <span className="section-label">Our Community</span>
          <h2>Life Together</h2>
          <p>Real moments from our vibrant church family</p>
        </div>

        {/* Desktop/Tablet: Grid Layout */}
        {!isMobile && (
          <div className="collage-grid">
            {images.map((image) => (
              <div
                key={image.id}
                className={`collage-item ${hoveredId === image.id ? 'active' : ''} ${hoveredId && hoveredId !== image.id ? 'dimmed' : ''}`}
                onMouseEnter={() => setHoveredId(image.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="collage-image-wrapper">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 1024px) 33vw, 25vw"
                    className="collage-image"
                    unoptimized
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mobile: Carousel Layout */}
        {isMobile && (
          <div className="gallery-carousel-wrapper">
            <Carousel
              value={images}
              itemTemplate={carouselItemTemplate}
              numVisible={1}
              numScroll={1}
              circular
              autoplayInterval={2800}
              showIndicators
              showNavigators={false}
              pt={{
                root: { className: 'gallery-carousel' },
              }}
            />
          </div>
        )}

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
