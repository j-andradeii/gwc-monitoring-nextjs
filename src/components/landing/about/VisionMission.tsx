'use client';

import React from 'react';

interface PillarItem {
  icon: string;
  title: string;
  description: string;
}

const pillars: PillarItem[] = [
  {
    icon: 'pi pi-user-plus',
    title: 'WIN',
    description: 'Reaching new people for Jesus through sharing the Gospel.',
  },
  {
    icon: 'pi pi-heart',
    title: 'CONSOLIDATE',
    description: 'Taking care of the new believer in the same way a parent takes care of a newborn baby. During this process their faith is affirmed through a personal Encounter with Jesus.',
  },
  {
    icon: 'pi pi-book',
    title: 'DISCIPLE',
    description: 'Reproducing the character of Christ in disciples and equipping them with the necessary tools so that they can become successful leaders who multiply and reproduce the Vision.',
  },
  {
    icon: 'pi pi-globe',
    title: 'SEND',
    description: 'The moment where new leaders are empowered to step into the ministry and fulfill the Great Commission.',
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
          <div className="quick-info-grid">
            {pillars.map((pillar, index) => (
              <div key={index} className="quick-info-card">
                <div className="quick-info-icon">
                  <i className={pillar.icon}></i>
                </div>
                <h3>{pillar.title}</h3>
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
