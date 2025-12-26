'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface HeroSlide {
  id: string;
  type: 'welcome' | 'campaign' | 'sermon';
  badge: string;
  title: string;
  subtitle?: string;
  description: string;
  backgroundImage: string;
  overlayGradient?: string;
  primaryAction: {
    label: string;
    href: string;
    icon: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
    icon: string;
  };
}

const heroSlides: HeroSlide[] = [
  {
    id: 'welcome',
    type: 'welcome',
    badge: 'Welcome to Gateway Church',
    title: 'HIS PRESENCE, OUR HOME',
    subtitle: "Join our community of faith as we grow together in God's love",
    description: 'Sundays 9:30 AM · 8th Floor, Golden Peak, Gorordo Avenue',
    backgroundImage: '/assets/images/fam-picture.jpg',
    overlayGradient: 'linear-gradient(180deg, rgba(30, 58, 95, 0.6) 0%, rgba(30, 58, 95, 0.8) 100%)',
    primaryAction: {
      label: 'Join This Sunday',
      href: '#services',
      icon: 'pi pi-calendar',
    },
    secondaryAction: {
      label: 'Get Directions',
      href: 'https://maps.google.com/?q=Golden+Peak+Gorordo+Avenue+Cebu',
      icon: 'pi pi-map-marker',
    },
  },
  {
    id: 'campaign',
    type: 'campaign',
    badge: '2025 Campaign Theme',
    title: 'LEGACY',
    subtitle: 'Building a Foundation for Generations',
    description:
      'What we do today echoes in eternity. Join us as we explore how to leave a lasting legacy of faith, love, and purpose.',
    backgroundImage: '/assets/images/community.jpg',
    overlayGradient: 'linear-gradient(135deg, rgba(124, 58, 237, 0.55) 0%, rgba(30, 58, 95, 0.65) 100%)',
    primaryAction: {
      label: 'Learn More',
      href: '#campaign',
      icon: 'pi pi-arrow-right',
    },
    secondaryAction: {
      label: 'Watch Series',
      href: '#sermons',
      icon: 'pi pi-play-circle',
    },
  },
  // {
  //   id: 'sermon',
  //   type: 'sermon',
  //   badge: 'Latest Sermon',
  //   title: 'THE POWER OF FAITH',
  //   subtitle: 'Pastor John Smith',
  //   description:
  //     'Exploring what it means to walk by faith and not by sight in our daily lives. Discover how trusting God transforms our perspective.',
  //   backgroundImage: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/10473938-thumb-1024x576.jpg',
  //   overlayGradient: 'linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.5) 100%)',
  //   primaryAction: {
  //     label: 'Watch Now',
  //     href: '#sermons',
  //     icon: 'pi pi-play-circle',
  //   },
  //   secondaryAction: {
  //     label: 'View All Sermons',
  //     href: '/sermon-notes',
  //     icon: 'pi pi-list',
  //   },
  // },
];

export const HeroSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const goToNext = useCallback(() => {
    goToSlide((activeIndex + 1) % heroSlides.length);
  }, [activeIndex, goToSlide]);

  const goToPrev = useCallback(() => {
    goToSlide((activeIndex - 1 + heroSlides.length) % heroSlides.length);
  }, [activeIndex, goToSlide]);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 8000);
    return () => clearInterval(interval);
  }, [goToNext]);

  const currentSlide = heroSlides[activeIndex];

  return (
    <section id="home" className="hero-carousel-section">
      {/* Background Images - all preloaded */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`hero-slide-bg ${index === activeIndex ? 'active' : ''}`}
          style={{
            backgroundImage: `url('${slide.backgroundImage}')`,
          }}
        >
          <div
            className="hero-slide-overlay"
            style={{ background: slide.overlayGradient }}
          />
        </div>
      ))}

      {/* Content */}
      <div className="hero-carousel-content-wrapper">
        <div className={`hero-content ${isTransitioning ? 'transitioning' : ''}`}>
          <span className={`hero-badge ${currentSlide.type === 'campaign' ? 'hero-badge-campaign' : currentSlide.type === 'sermon' ? 'hero-badge-sermon' : ''}`}>
            {currentSlide.badge}
          </span>
          <h1 key={currentSlide.id}>{currentSlide.title}</h1>
          {currentSlide.subtitle && (
            <p className="hero-subtitle">{currentSlide.subtitle}</p>
          )}
          <p className="hero-description">{currentSlide.description}</p>
          <div className="hero-actions">
            <Link href={currentSlide.primaryAction.href} className="landing-btn landing-btn-primary">
              <i className={currentSlide.primaryAction.icon}></i>
              {currentSlide.primaryAction.label}
            </Link>
            {currentSlide.secondaryAction && (
              <Link
                href={currentSlide.secondaryAction.href}
                className="landing-btn landing-btn-light-outline"
              >
                <i className={currentSlide.secondaryAction.icon}></i>
                {currentSlide.secondaryAction.label}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        className="hero-nav-btn hero-nav-prev"
        onClick={goToPrev}
        aria-label="Previous slide"
      >
        <i className="pi pi-chevron-left"></i>
      </button>
      <button
        className="hero-nav-btn hero-nav-next"
        onClick={goToNext}
        aria-label="Next slide"
      >
        <i className="pi pi-chevron-right"></i>
      </button>

      {/* Indicators */}
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
    </section>
  );
};

export default HeroSection;
