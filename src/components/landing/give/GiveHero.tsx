'use client';

import React from 'react';

interface GiveHeroProps {
  backgroundImage?: string;
}

export const GiveHero: React.FC<GiveHeroProps> = ({
  backgroundImage = '/assets/images/community.jpg',
}) => {
  return (
    <section
      id="give-top"
      className="hero-section give-hero"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <div className="hero-content">
        <span className="hero-badge">Give</span>
        <h1>Generosity Changes Lives</h1>
        <p>Your giving makes an eternal difference</p>
        <div className="hero-service-info">
          <div className="service-info-item">
            <i className="pi pi-heart"></i>
            <span>Give cheerfully</span>
          </div>
          <div className="service-info-divider"></div>
          <div className="service-info-item">
            <i className="pi pi-users"></i>
            <span>Impact the community</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GiveHero;
