'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { sermons } from '../../data/sermons';

type SlideType = 'welcome' | 'campaign' | 'sermon';

interface SermonBannerData {
  series: string;
  speaker: string;
  speakerRole?: string;
  date: string;
  duration: string;
  image: string;
  excerpt: string;
}

interface HeroSlideData {
  id: string;
  type: SlideType;
  badge: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
  overlayGradient: string;
  is_display_info?: boolean;
  sermon?: SermonBannerData;
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
  const shouldDisplayInfo = slide.is_display_info !== false;

  return (
    <div className={`hero-slide-content ${!shouldDisplayInfo ? 'hero-slide-content--cta-only' : ''} ${isTransitioning ? 'transitioning' : ''}`}>
      {shouldDisplayInfo && (
        <>
          <span className={`hero-badge ${badgeClass}`}>{slide.badge}</span>
          <h1>{slide.title}</h1>
          <p className="hero-subtitle">{slide.subtitle}</p>
        </>
      )}

      <Link href={slide.cta.href} className="landing-btn landing-btn-primary">
        <i className={slide.cta.icon}></i>
        {slide.cta.label}
      </Link>
    </div>
  );
};

const formatSermonDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

interface HeroSermonBannerProps {
  slide: HeroSlideData;
  isTransitioning: boolean;
}

const HeroSermonBanner: React.FC<HeroSermonBannerProps> = ({ slide, isTransitioning }) => {
  const sermon = slide.sermon;
  if (!sermon) return null;

  return (
    <div className={`hero-sermon-banner ${isTransitioning ? 'transitioning' : ''}`}>
      <div className="hero-sermon-banner__text">
        <span className="hero-sermon-banner__eyebrow">
          <i className="pi pi-bookmark" aria-hidden="true"></i>
          {slide.badge}
          <span className="hero-sermon-banner__eyebrow-sep" aria-hidden="true">·</span>
          {sermon.series}
        </span>

        <h1 className="hero-sermon-banner__title">{slide.title}</h1>

        <p className="hero-sermon-banner__deck">{sermon.excerpt}</p>

        <div className="hero-sermon-banner__meta">
          <span className="hero-sermon-banner__meta-item">
            <i className="pi pi-user" aria-hidden="true"></i>
            <strong>{sermon.speaker}</strong>
          </span>
          <span className="hero-sermon-banner__meta-item">
            <i className="pi pi-calendar" aria-hidden="true"></i>
            {formatSermonDate(sermon.date)}
          </span>
          <span className="hero-sermon-banner__meta-item">
            <i className="pi pi-clock" aria-hidden="true"></i>
            {sermon.duration}
          </span>
        </div>

        <Link href={slide.cta.href} className="landing-btn landing-btn-primary">
          <i className={slide.cta.icon} aria-hidden="true"></i>
          {slide.cta.label}
        </Link>
      </div>

      <Link
        href={slide.cta.href}
        className="hero-sermon-banner__artwork"
        aria-label={`Open sermon notes: ${slide.title}`}
      >
        <Image
          src={sermon.image}
          alt={slide.title}
          fill
          sizes="(max-width: 768px) 92vw, 500px"
          className="hero-sermon-banner__artwork-img"
        />
        <span className="hero-sermon-banner__play" aria-hidden="true">
          <i className="pi pi-play"></i>
        </span>
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
    subtitle: 'Sundays 9:30 AM · 8th Floor, Golden Peak Hotel and Suites, Escario St. Gorordo Ave.',
    backgroundImage: '/assets/images/fam-picture.jpg',
    overlayGradient: 'linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(26, 39, 68, 0.40) 100%)',
    cta: {
      label: 'Join This Sunday',
      href: '/events/sonday-service',
      icon: 'pi pi-calendar',
    },
  },
  {
    id: `sermon-${latestSermon.id}`,
    type: 'sermon',
    badge: 'Latest Message',
    title: latestSermon.title,
    subtitle: latestSermon.excerpt,
    backgroundImage: '',
    overlayGradient: '',
    sermon: {
      series: latestSermon.series,
      speaker: latestSermon.speaker,
      speakerRole: latestSermon.speakerRole,
      date: latestSermon.date,
      duration: latestSermon.duration,
      image: latestSermon.image,
      excerpt: latestSermon.excerpt,
    },
    cta: {
      label: 'Read Sermon Notes',
      href: `/sermon-notes/${latestSermon.slug}`,
      icon: 'pi pi-arrow-right',
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

  const activeSlide = heroSlides[activeIndex];

  return (
    <section id="home" className="hero-carousel-section">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`hero-slide-bg ${slide.type === 'sermon' && !slide.backgroundImage ? 'hero-slide-bg--sermon' : ''} ${index === activeIndex ? 'active' : ''}`}
          style={slide.backgroundImage ? { backgroundImage: `url('${slide.backgroundImage}')` } : undefined}
        >
          <div className="hero-slide-overlay" style={{ background: slide.overlayGradient }} />
        </div>
      ))}

      <div className={`hero-carousel-content-wrapper ${activeSlide.type === 'sermon' ? 'hero-carousel-content-wrapper--sermon' : ''}`}>
        {activeSlide.type === 'sermon' ? (
          <HeroSermonBanner key={activeSlide.id} slide={activeSlide} isTransitioning={isTransitioning} />
        ) : (
          <HeroSlideContent key={activeSlide.id} slide={activeSlide} isTransitioning={isTransitioning} />
        )}
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
