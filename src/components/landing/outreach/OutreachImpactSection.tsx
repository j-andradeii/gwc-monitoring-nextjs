'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { outreachImpactStats } from '@/data/outreachData';

/** Parse a stat value string like "50+", "2+", "20" → { target, suffix } */
function parseStatValue(value: string): { target: number; suffix: string } {
  const match = value.match(/^(\d+)(.*)/);
  if (!match) return { target: 0, suffix: value };
  return { target: parseInt(match[1], 10), suffix: match[2] };
}

/** Ease-out cubic */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

interface CountUpValueProps {
  value: string;
}

function CountUpValue({ value }: CountUpValueProps) {
  const { target, suffix } = parseStatValue(value);
  const [displayed, setDisplayed] = useState<number>(target);
  const startedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const elRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    // Check for reduced motion preference — initial state is already target, so just skip animation
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      return;
    }

    const el = elRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          observer.disconnect();

          const duration = 1400; // ms
          const startTime = performance.now();

          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOut(progress);
            const current = Math.round(easedProgress * target);
            setDisplayed(current);

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
      className="outreach-impact-value"
      aria-label={value}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {displayed}
      {suffix}
    </span>
  );
}

export const OutreachImpactSection: React.FC = () => {
  return (
    <section id="outreach-impact" className="landing-section outreach-impact-section">
      <div className="outreach-impact-bg-decoration" aria-hidden="true" />

      <div className="landing-container">
        <div className="section-header-center animate-on-scroll">
          <span className="section-label">
            <i className="pi pi-heart-fill outreach-impact-label-icon" />
            Our Impact
          </span>
          <h2 className="outreach-impact-title">God&apos;s Work Through Your Generosity</h2>
          <p className="outreach-impact-subtitle">
            Every peso given and every hour volunteered translates into lives touched and communities restored
          </p>
          <div className="outreach-impact-title-divider" aria-hidden="true" />
        </div>

        <div className="outreach-impact-grid">
          {outreachImpactStats.map((stat, index) => (
            <div
              key={index}
              className="outreach-impact-card animate-on-scroll"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="outreach-impact-image-wrapper">
                <Image
                  src={stat.image}
                  alt={stat.label}
                  fill
                  className="outreach-impact-image"
                  sizes="(max-width: 480px) 50vw, (max-width: 900px) 25vw, 20vw"
                />
                <div className="outreach-impact-image-overlay" />
                <div className="outreach-impact-icon-badge">
                  <i className={stat.icon} />
                </div>
              </div>
              <div className="outreach-impact-card-body">
                <CountUpValue value={stat.value} />
                <div className="outreach-impact-value-bar" aria-hidden="true" />
                <span className="outreach-impact-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OutreachImpactSection;
