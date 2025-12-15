'use client';

import React from 'react';
import Link from 'next/link';

export const ChurchServiceSection: React.FC = () => {
  return (
    <section id="services" className="service-cta-section animate-on-scroll">
      <div className="landing-container">
        <div className="service-cta-content">
          <span className="section-label-light">Join Us</span>
          <h2>Experience Worship With Us</h2>
          <p>
            Every Sunday, we gather to worship, learn, and grow together.
            Whether you&apos;re new to faith or have been walking with God for years,
            there&apos;s a place for you here.
          </p>

          <div className="service-details-compact">
            <div className="service-detail-item">
              <i className="pi pi-calendar"></i>
              <div>
                <strong>Every Sunday</strong>
                <span>Weekly Worship Service</span>
              </div>
            </div>
            <div className="service-detail-item">
              <i className="pi pi-clock"></i>
              <div>
                <strong>9:30 AM</strong>
                <span>Gates open at 9:00 AM</span>
              </div>
            </div>
            <div className="service-detail-item">
              <i className="pi pi-map-marker"></i>
              <div>
                <strong>Lex Hotel</strong>
                <span>2nd Floor, Capitol Cebu</span>
              </div>
            </div>
          </div>

          <Link href="#" className="landing-btn landing-btn-light">
            Plan Your Visit
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ChurchServiceSection;
