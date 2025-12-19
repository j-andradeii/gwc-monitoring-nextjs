'use client';

import React from 'react';

interface PillarItem {
  icon: string;
  title: string;
  description: string;
}

const pillars: PillarItem[] = [
  {
    icon: 'pi pi-heart',
    title: 'Worship',
    description: 'Experience God through authentic worship and praise that transforms hearts.',
  },
  {
    icon: 'pi pi-users',
    title: 'Community',
    description: 'Find your place in our church family and build genuine relationships.',
  },
  {
    icon: 'pi pi-book',
    title: 'Grow',
    description: 'Deepen your faith through biblical teaching and spiritual formation.',
  },
  {
    icon: 'pi pi-globe',
    title: 'Serve',
    description: 'Make an impact in our community and beyond through compassionate service.',
  },
];

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
          <div className="pillars-grid">
            {pillars.map((pillar, index) => (
              <div key={index} className="pillar-card">
                <div className="pillar-icon">
                  <i className={pillar.icon}></i>
                </div>
                <h4>{pillar.title}</h4>
                <p>{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionMission;
