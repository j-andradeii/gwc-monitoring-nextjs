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
        <h1>Welcome to Gateway</h1>
        <p>A community growing in faith, hope, and love. Join us this Sunday!</p>
        <div>
          <Link href="#sermons" className="landing-btn landing-btn-primary">
            Our Sermons
          </Link>
          <Link href="#about" className="landing-btn landing-btn-light-outline">
            About Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
