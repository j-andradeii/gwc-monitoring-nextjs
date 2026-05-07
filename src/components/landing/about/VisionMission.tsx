'use client';

import React from 'react';
import { ProcessSteps } from '../MissionSection';

interface TrustChip {
  icon: string;
  label: string;
  value: string;
}

const trustChips: TrustChip[] = [
  { icon: 'pi pi-compass', label: 'Core Values', value: '12' },
  { icon: 'pi pi-book', label: 'Fundamental Truths', value: '16' },
  { icon: 'pi pi-users', label: 'Cell Communities', value: 'Many' },
  { icon: 'pi pi-bolt', label: 'Spirit-Filled', value: 'Daily' },
];

export const VisionMission: React.FC = () => {
  return (
    <section
      id="vision-mission"
      className="vision-mission-section vision-mission-vibrant animate-on-scroll"
    >
      {/* Decorative animated orbs (gold + deep navy depth) */}
      <span className="vm-bg-orb vm-bg-orb--gold" aria-hidden="true" />
      <span className="vm-bg-orb vm-bg-orb--navy" aria-hidden="true" />
      <span className="vm-bg-grid" aria-hidden="true" />

      <div className="landing-container">
        <div className="vision-mission-header vm-vibrant-header">
          <span className="section-label">Vision &amp; Mission</span>
          <h2>
            Why We <span className="vm-vibrant-title-accent">Exist</span>
          </h2>
          <p className="vm-vibrant-subtitle">
            A church on fire — pursuing God&apos;s presence, multiplying disciples, and
            shaping the next generation with bold, Spirit-filled purpose.
          </p>
        </div>

        <div className="vision-mission-cards">
          <article
            className="vision-card vm-card vm-card--light"
            style={{ ['--vm-index' as string]: 0 }}
          >
            <span className="vm-card-watermark" aria-hidden="true">01</span>
            <span className="vm-card-eyebrow">A Vision</span>
            <div className="vision-card-icon vm-card-icon">
              <i className="pi pi-eye" aria-hidden="true"></i>
              <span className="vm-card-icon-glow" aria-hidden="true" />
            </div>
            <h3>Our Vision</h3>
            <p>
              To be a community where people encounter God&apos;s presence and discover
              their purpose, becoming everything He created them to be.
            </p>
            <span className="vm-card-flourish" aria-hidden="true" />
          </article>

          <article
            className="mission-card vm-card vm-card--dark"
            style={{ ['--vm-index' as string]: 1 }}
          >
            <span className="vm-card-watermark" aria-hidden="true">02</span>
            <span className="vm-card-eyebrow">A Mission</span>
            <div className="mission-card-icon vm-card-icon">
              <i className="pi pi-compass" aria-hidden="true"></i>
              <span className="vm-card-icon-glow" aria-hidden="true" />
            </div>
            <h3>Our Mission</h3>
            <p>
              Gateway Church exists to connect people to God and each other through
              authentic worship, meaningful community, biblical teaching, and
              compassionate service.
            </p>
            <span className="vm-card-flourish" aria-hidden="true" />
          </article>
        </div>



        <div className="pillars-section">
          <h3 className="pillars-title">How We Live It Out</h3>
          <ProcessSteps />
        </div>
      </div>
    </section>
  );
};

export default VisionMission;
