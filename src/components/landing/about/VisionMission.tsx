'use client';

import React from 'react';
import { ProcessSteps } from '../MissionSection';

export const VisionMission: React.FC = () => {
  return (
    <section id="vision-mission" className="vision-mission-section animate-on-scroll">
      <div className="landing-container">
        <div className="vision-mission-header">
          <span className="section-label">Vision & Mission</span>
          <h2>Why We Exist</h2>
        </div>

        <div className="vision-mission-cards">
          <div className="vision-card">
            <div className="vision-card-icon">
              <i className="pi pi-eye"></i>
            </div>
            <h3>Our Vision</h3>
            <p>
              To be a community where people encounter God&apos;s presence and discover
              their purpose, becoming everything He created them to be.
            </p>
          </div>

          <div className="mission-card">
            <div className="mission-card-icon">
              <i className="pi pi-compass"></i>
            </div>
            <h3>Our Mission</h3>
            <p>
              Gateway Church exists to connect people to God and each other through
              authentic worship, meaningful community, biblical teaching, and
              compassionate service.
            </p>
          </div>
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
