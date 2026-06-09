'use client';

import React from 'react';
import { ProcessSteps } from '../MissionSection';

export const VisionMission: React.FC = () => {
  return (
    <section
      id="vision-mission"
      className="vision-mission-section vision-mission-vibrant animate-on-scroll"
    >
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
            <div className="vision-card-icon vm-card-icon">
              <i className="pi pi-eye" aria-hidden="true"></i>
            </div>
            <h3>Our Vision</h3>
            <p>
              To be a community where people encounter God&apos;s presence and discover
              their purpose, becoming everything He created them to be.
            </p>
          </article>

          <article
            className="mission-card vm-card vm-card--dark"
            style={{ ['--vm-index' as string]: 1 }}
          >
            <div className="mission-card-icon vm-card-icon">
              <i className="pi pi-compass" aria-hidden="true"></i>
            </div>
            <h3>Our Mission</h3>
            <p>
              Gateway Church exists to connect people to God and each other through
              authentic worship, meaningful community, biblical teaching, and
              compassionate service.
            </p>
          </article>
        </div>

        <div className="vm-pathway-section">
          <div className="mission-layout vm-pathway-layout">
            <div className="mission-content vm-pathway-content">
              <span className="section-label">How we live it out</span>
              <h3>Win. Consolidate. Disciple. Send.</h3>
              {/* <p>
                This is how our vision becomes a lived pathway: people are reached,
                cared for, formed as disciples, and released to lead with purpose.
              </p> */}
            </div>
{/*
            <aside className="mission-pathway-card vm-pathway-card" aria-label="Discipleship pathway summary">
              <span className="mission-pathway-label">Discipleship Pathway</span>
              <strong>4</strong>
              <span>intentional steps that move people from encounter to commissioned leadership.</span>
            </aside> */}
          </div>

          <ProcessSteps className="mission-process-steps vm-process-steps" showConnectors={false} />
        </div>
      </div>
    </section>
  );
};

export default VisionMission;
