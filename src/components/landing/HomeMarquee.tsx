'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import { useConnectFabStore } from '@/stores/connectFab.store';

/**
 * Auto-advancing CTA slider shown under the hero on the homepage.
 * Replaces the old scrolling brand-word marquee with 5 rotating
 * calls-to-action (nav links + one "open the prayer form" action).
 */
type NavSlide = {
  tag: string;
  headline: string;
  cta: string;
  href: string;
  action?: never;
};

type ActionSlide = {
  tag: string;
  headline: string;
  cta: string;
  href?: never;
  action: 'prayer';
};

type Slide = NavSlide | ActionSlide;

const SLIDES: Slide[] = [
  {
    tag: 'BELONG',
    headline: "There's a seat saved for you.",
    cta: 'JOIN US THIS SUNDAY',
    href: '/events/sonday-service',
  },
  {
    tag: 'CONNECT',
    headline: 'You were made for community.',
    cta: 'JOIN A CONNECT GROUP',
    href: '/connect#connect-group',
  },
  {
    tag: 'PRAY',
    headline: "Whatever you're facing, we'll pray with you.",
    cta: 'REQUEST PRAYER',
    action: 'prayer',
  },
  {
    tag: 'SOW',
    headline: 'Honor God with Your Giving',
    cta: 'GIVING CHANNELS',
    href: '/give/ways-to-give',
  },
  {
    tag: 'SOW',
    headline: 'Build the future of Gateway with us',
    cta: 'GIVE TO GATEWAY PROJECTS',
    href: '/give/gateway-projects',
  },
];

const SLIDE_INTERVAL_MS = 5000;

export const HomeMarquee: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const requestOpen = useConnectFabStore((s) => s.requestOpen);
  const pauseCountRef = useRef(0);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Pause on hover AND on focus-within (WCAG 2.2.2 — no unstoppable motion
  // while a keyboard user is interacting with the band). Multiple overlapping
  // enter/focus events are tracked with a counter so a single leave/blur
  // doesn't prematurely resume auto-advance.
  const pause = () => {
    pauseCountRef.current += 1;
    setIsPaused(true);
  };

  const resume = () => {
    pauseCountRef.current = Math.max(0, pauseCountRef.current - 1);
    if (pauseCountRef.current === 0) {
      setIsPaused(false);
    }
  };

  return (
    <section aria-label="Ways to get involved" className="home-cta-band">
      <div className="landing-container">
        <div
          className="home-cta-viewport"
          onMouseEnter={pause}
          onMouseLeave={resume}
          onFocus={pause}
          onBlur={resume}
        >
          <div
            className="home-cta-track"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {SLIDES.map((slide, index) => {
              const isActive = index === activeIndex;
              const ariaLabel = `${slide.tag}: ${slide.headline} — ${slide.cta}`;

              const inner = (
                <>
                  <span className="home-cta-tag">
                    <i className="pi pi-circle-fill" aria-hidden="true"></i>
                    {slide.tag}
                  </span>
                  <span className="home-cta-headline">{slide.headline}</span>
                  <span className="home-cta-action">
                    {slide.cta}
                    <i className="pi pi-arrow-right" aria-hidden="true"></i>
                  </span>
                </>
              );

              if (slide.action === 'prayer') {
                return (
                  <button
                    key={slide.cta}
                    type="button"
                    className="home-cta-slide"
                    aria-label={ariaLabel}
                    aria-hidden={!isActive}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => requestOpen('prayer')}
                  >
                    {inner}
                  </button>
                );
              }

              return (
                <Link
                  key={slide.cta}
                  href={slide.href}
                  className="home-cta-slide"
                  aria-label={ariaLabel}
                  aria-hidden={!isActive}
                  tabIndex={isActive ? 0 : -1}
                >
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeMarquee;
