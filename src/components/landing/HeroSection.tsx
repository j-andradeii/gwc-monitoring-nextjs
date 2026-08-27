'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { sermons } from '../../data/sermons';

type SlideType = 'welcome' | 'campaign' | 'sermon';

// The subset of a Sermon the hero slide needs — the same facts the sermon
// detail hero leads with, so the two read as one system.
interface SermonBannerData {
  series: string;
  seriesNumber?: number;
  speaker: string;
  speakerRole?: string;
  date: string;
  image: string;
  excerpt: string;
  keyVerse?: string;
  /** Split title — the accented word is set in serif italic, as on the detail hero. */
  subtitle?: {
    prefix: string;
    italic: string;
    suffix?: string;
  };
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

// Long sermon titles drop to a smaller type tier so the banner never grows
// the hero past its resting height (titles in the data run from 4 to 71+ chars).
const sermonTitleSizeClass = (title: string) => {
  if (title.length > 60) return ' hero-sermon-banner__title--xlong';
  if (title.length > 40) return ' hero-sermon-banner__title--long';
  return '';
};

// "Vision · Sermon 07" — the label the detail hero's eyebrow builds.
const sermonSeriesLabel = (series: string, number?: number) =>
  number ? `${series} · Sermon ${String(number).padStart(2, '0')}` : series;

// Title with the optional serif-italic split, mirroring the detail hero's
// SermonHeroTitle. Sermons with no `subtitle` fall back to the plain title.
const HeroSermonTitle: React.FC<{ title: string; subtitle?: SermonBannerData['subtitle'] }> = ({
  title,
  subtitle,
}) => {
  // Size the type off the text that actually renders, not the raw title.
  const rendered = subtitle
    ? [subtitle.prefix, subtitle.italic, subtitle.suffix].filter(Boolean).join(' ')
    : title;
  const className = `hero-sermon-banner__title${sermonTitleSizeClass(rendered)}`;

  if (!subtitle) {
    return <h1 className={className}>{title}</h1>;
  }

  return (
    <h1 className={className}>
      {subtitle.prefix}
      {' '}
      <em>{subtitle.italic}</em>
      {subtitle.suffix ? <>{' '}{subtitle.suffix}</> : null}
    </h1>
  );
};

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
          {slide.badge}
          <span className="hero-sermon-banner__eyebrow-sep" aria-hidden="true">·</span>
          {sermonSeriesLabel(sermon.series, sermon.seriesNumber)}
        </span>

        <HeroSermonTitle title={slide.title} subtitle={sermon.subtitle} />

        <p className="hero-sermon-banner__deck">{sermon.excerpt}</p>

        {/* The same three facts the detail hero leads with: who, when, key verse. */}
        <div className="hero-sermon-banner__meta">
          <span className="hero-sermon-banner__meta-item">
            <i className="pi pi-user" aria-hidden="true"></i>
            <span>
              <strong>{sermon.speaker}</strong>
              {sermon.speakerRole && (
                <span className="hero-sermon-banner__meta-label">{sermon.speakerRole}</span>
              )}
            </span>
          </span>
          <span className="hero-sermon-banner__meta-item">
            <i className="pi pi-calendar" aria-hidden="true"></i>
            {formatSermonDate(sermon.date)}
          </span>
          {sermon.keyVerse && (
            <span className="hero-sermon-banner__meta-item">
              <i className="pi pi-book" aria-hidden="true"></i>
              <strong>{sermon.keyVerse}</strong>
            </span>
          )}
        </div>

        <Link href={slide.cta.href} className="landing-btn landing-btn-primary">
          <i className={slide.cta.icon} aria-hidden="true"></i>
          {slide.cta.label}
        </Link>
      </div>

      {/* The wrap carries the offset gold plate; the card clips its own image. */}
      <div className="hero-sermon-banner__artwork-wrap">
        <Link
          href={slide.cta.href}
          className="hero-sermon-banner__artwork"
          aria-label={`Open sermon notes: ${slide.title}`}
        >
          <Image
            src={sermon.image}
            alt={slide.title}
            fill
            sizes="(max-width: 768px) 92vw, 460px"
            className="hero-sermon-banner__artwork-img"
          />
        </Link>
      </div>
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
    // `seriesNumber`, `subtitle` and `keyVerse` are optional in the sermon data:
    // entries that carry them get the detail hero's numbered eyebrow, split
    // italic title and key-verse meta; older ones fall back gracefully.
    sermon: {
      series: latestSermon.series,
      seriesNumber: latestSermon.seriesNumber,
      speaker: latestSermon.speaker,
      speakerRole: latestSermon.speakerRole,
      date: latestSermon.date,
      image: latestSermon.image,
      excerpt: latestSermon.excerpt,
      keyVerse: latestSermon.keyVerse,
      subtitle: latestSermon.subtitle,
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
          {/* The sermon's own artwork, blurred to ambient texture — the same
              backdrop the sermon detail hero uses, so the slide takes its mood
              from its own image rather than a flat brand gradient. */}
          {slide.type === 'sermon' && slide.sermon && (
            <div className="hero-slide-bg__backdrop" aria-hidden="true">
              <Image
                src={slide.sermon.image}
                alt=""
                fill
                sizes="100vw"
                quality={35}
                className="hero-slide-bg__backdrop-img"
              />
            </div>
          )}
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
