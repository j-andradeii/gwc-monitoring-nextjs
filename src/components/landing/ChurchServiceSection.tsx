'use client';

import React from 'react';
import Link from 'next/link';
import { getNearestSondayService } from '@/data/events';
import { CONTACT_INFO } from '@/data/contact';

export const ChurchServiceSection: React.FC = () => {
  const nearestService = getNearestSondayService();
  const serviceLink = nearestService ? `/events/${nearestService.slug}` : '/events';

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
            <a
              href={CONTACT_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="service-detail-item"
              aria-label="Open church location in Google Maps"
            >
              <i className="pi pi-map-marker"></i>
              <div>
                <strong>8th Floor, Golden Peak Hotel &amp; Suites</strong>
                <span>Escario St. Gorordo Ave.</span>
              </div>
            </a>
          </div>

          <Link href={serviceLink} className="landing-btn landing-btn-light">
            Plan Your Visit
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ChurchServiceSection;
