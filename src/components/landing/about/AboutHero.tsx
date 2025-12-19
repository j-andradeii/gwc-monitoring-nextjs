'use client';

import React from 'react';

interface AboutHeroProps {
  backgroundImage?: string;
}

export const AboutHero: React.FC<AboutHeroProps> = ({
  backgroundImage = '/assets/images/community.jpg',
}) => {
  return (
    <section
      id="about-top"
      className="hero-section about-hero"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <div className="hero-content">
        <span className="hero-badge">About Us</span>
        <h1>Welcome to Gateway Church</h1>
        <p>Loving God, Loving People</p>
        <div className="hero-service-info">
          <div className="service-info-item">
            <i className="pi pi-clock"></i>
            <span>Sundays 9:30 AM</span>
          </div>
          <div className="service-info-divider"></div>
          <div className="service-info-item">
            <i className="pi pi-map-marker"></i>
            <span>8th Floor, Golden Peak, Gorordo Avenue</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
