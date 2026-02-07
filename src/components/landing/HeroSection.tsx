'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { sermons } from '../../data/sermons';

type SlideType = 'welcome' | 'campaign' | 'sermon';

interface HeroSlideData {
  id: string;
  type: SlideType;
  badge: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
  overlayGradient: string;
  cta: {
    label: string;
    href: string;
    icon: string;
  };
}

interface HeroSlideContentProps {
  slide: HeroSlideData;
  isTransitioning: boolean;
}

const HeroSlideContent: React.FC<HeroSlideContentProps> = ({ slide, isTransitioning }) => {
  const badgeClass = slide.type !== 'welcome' ? `hero-badge-${slide.type}` : '';

  return (
    <div className={`hero-slide-content ${isTransitioning ? 'transitioning' : ''}`}>
      <span className={`hero-badge ${badgeClass}`}>{slide.badge}</span>
      <h1>{slide.title}</h1>
      <p className="hero-subtitle">{slide.subtitle}</p>
      <Link href={slide.cta.href} className="landing-btn landing-btn-primary">
        <i className={slide.cta.icon}></i>
        {slide.cta.label}
      </Link>
    </div>
  );
};

const latestSermon = [...sermons].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

const heroSlides: HeroSlideData[] = [
  {
    id: 'welcome',
    type: 'welcome',
    badge: 'Welcome to Gateway Church',
    title: 'HIS PRESENCE, OUR HOME',
    subtitle: 'Sundays 9:30 AM · 8th Floor, Golden Peak, Gorordo Avenue',
    backgroundImage: '/assets/images/fam-picture.jpg',
    overlayGradient: 'linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(26, 39, 68, 0.40) 100%)',
    cta: {
      label: 'Join This Sunday',
      href: '#services',
      icon: 'pi pi-calendar',
    },
  },
  {
    id: `sermon-${latestSermon.id}`,
    type: 'sermon',
    badge: 'Latest Message',
    title: latestSermon.title,
    subtitle: latestSermon.excerpt,
    backgroundImage: latestSermon.image,
    overlayGradient: '',
    cta: {
      label: 'Learn More',
      href: `/sermon-notes/${latestSermon.slug}`,
      icon: 'pi pi-play',
    },
  },
];

export const HeroSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setActiveIndex(index);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [isTransitioning]
  );

  const goToNext = useCallback(() => {
    goToSlide((activeIndex + 1) % heroSlides.length);
  }, [activeIndex, goToSlide]);

  const goToPrev = useCallback(() => {
    goToSlide((activeIndex - 1 + heroSlides.length) % heroSlides.length);
  }, [activeIndex, goToSlide]);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const interval = setInterval(goToNext, 8000);
    return () => clearInterval(interval);
  }, [goToNext]);

  return (
    <section id="home" className="hero-carousel-section">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`hero-slide-bg ${index === activeIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url('${slide.backgroundImage}')` }}
        >
          <div className="hero-slide-overlay" style={{ background: slide.overlayGradient }} />
        </div>
      ))}

      <div className="hero-carousel-content-wrapper">
        <HeroSlideContent slide={heroSlides[activeIndex]} isTransitioning={isTransitioning} />
      </div>

      {heroSlides.length > 1 && (
        <>
          <button className="hero-nav-btn hero-nav-prev" onClick={goToPrev} aria-label="Previous slide">
            <i className="pi pi-chevron-left"></i>
          </button>
          <button className="hero-nav-btn hero-nav-next" onClick={goToNext} aria-label="Next slide">
            <i className="pi pi-chevron-right"></i>
          </button>
        </>
      )}

      {heroSlides.length > 1 && (
        <div className="hero-indicators">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.id}
              className={`hero-indicator ${index === activeIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSection;
