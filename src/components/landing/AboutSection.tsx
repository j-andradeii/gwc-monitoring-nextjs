'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { siteMetadata } from '@/data/site-metadata';

// Founding year matches the jsonLd foundingDate in src/app/page.tsx
const FOUNDING_YEAR = 2015;

const stats = [
  { value: '500+', label: 'Members' },
  { value: '10+', label: 'Ministries' },
  { value: `${new Date().getFullYear() - FOUNDING_YEAR}`, label: 'Years' },
];

/** Parse a stat value string like "500+" → { target, suffix } */
function parseStatValue(value: string): { target: number; suffix: string } {
  const match = value.match(/^(\d+)(.*)/);
  if (!match) return { target: 0, suffix: value };
  return { target: parseInt(match[1], 10), suffix: match[2] };
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Counts up from 0 when scrolled into view. SSR/no-JS/reduced-motion render
 * the final value (initial state is the target), so nothing is lost without
 * the animation. Same pattern as OutreachImpactSection's CountUpValue.
 */
function CountUpStat({ value }: { value: string }) {
  const { target, suffix } = parseStatValue(value);
  const [displayed, setDisplayed] = useState<number>(target);
  const startedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const elRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const el = elRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          observer.disconnect();

          const duration = 1400;
          const startTime = performance.now();

          const tick = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            setDisplayed(Math.round(easeOut(progress) * target));
            if (progress < 1) {
              rafRef.current = requestAnimationFrame(tick);
            }
          };

          rafRef.current = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [target]);

  return (
    <span
      ref={elRef}
      className="stat-number"
      aria-label={value}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {displayed}
      {suffix}
    </span>
  );
}

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="about-section animate-on-scroll">
      <div className="landing-container">
        <div className="about-grid">
          <div className="about-image-wrapper">
            <Image
              src="/assets/images/community.jpg"
              alt={`${siteMetadata.name} Community`}
              width={500}
              height={500}
              className="about-image"
              unoptimized
            />
            <span className="home-sticker">
              <i className="pi pi-heart-fill" aria-hidden="true"></i>
              Welcome home
            </span>
            <div className="about-image-accent"></div>
          </div>

          <div className="about-content">
            <span className="section-label">About Us</span>
            <h2>{siteMetadata.slogan}</h2>
            <p>
              {siteMetadata.description}
            </p>

            {/* <div className="about-stats">
              {stats.map((stat) => (
                <div key={stat.label} className="stat-item">
                  <CountUpStat value={stat.value} />
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div> */}

            <Link href="/about" className="landing-btn landing-btn-outline">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
