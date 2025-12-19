'use client';

import React from 'react';
import Link from 'next/link';

export const AboutCTA: React.FC = () => {
  return (
    <section id="join-us" className="about-cta-section animate-on-scroll">
      <div className="landing-container">
        <div className="about-cta-content">
          <span className="section-label-light">Join Us</span>
          <h2>Come As You Are</h2>
          <p>
            We&apos;d love to meet you! Whether you&apos;re exploring faith for the first
            time or looking for a church home, you&apos;re welcome here. Join us this
            Sunday and experience the warmth of our community.
          </p>

          <div className="about-cta-info">
            <div className="cta-info-item">
              <i className="pi pi-clock"></i>
              <div>
                <span className="cta-info-label">Service Time</span>
                <span className="cta-info-value">Sundays 9:30 AM</span>
              </div>
            </div>
            <div className="cta-info-divider"></div>
            <div className="cta-info-item">
              <i className="pi pi-map-marker"></i>
              <div>
                <span className="cta-info-label">Location</span>
                <span className="cta-info-value">8th Floor, Golden Peak, Gorordo Avenue</span>
              </div>
            </div>
          </div>

          <div className="about-cta-actions">
            <Link href="/#services" className="landing-btn landing-btn-light">
              <i className="pi pi-calendar"></i>
              Plan Your Visit
            </Link>
            <Link href="/#contact" className="landing-btn landing-btn-light-outline">
              <i className="pi pi-envelope"></i>
              Get Connected
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCTA;
