'use client';

import React from 'react';
import Link from 'next/link';

interface HeroSectionProps {
  backgroundImage?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  backgroundImage = '/images/fam-picture.jpg',
}) => {
  return (
    <section
      id="home"
      className="hero-section"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <div className="hero-content">
        <span className="hero-badge">Welcome to Gateway Church</span>
        <h1>HIS PRESENCE, OUR HOME</h1>
        <p>Join our community of faith as we grow together in God&apos;s love</p>
        <div className="hero-actions">
          <Link href="#services" className="landing-btn landing-btn-primary">
            <i className="pi pi-calendar"></i>
            Join This Sunday
          </Link>
          {/* <Link href="#sermons" className="landing-btn landing-btn-light-outline">
            <i className="pi pi-play-circle"></i>
            Watch Sermons
          </Link> */}
        </div>
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

export default HeroSection;
