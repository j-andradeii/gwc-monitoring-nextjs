'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { ministries } from '@/data/ministries';

export const MinistriesSection: React.FC = () => {
  return (
    <section id="ministries" className="ministries-section animate-on-scroll">
      <div className="landing-container">
        <div className="section-header-center">
          <span className="section-label">Get Involved</span>
          <h2>Our Ministries</h2>
          <p>Find your place to serve and grow</p>
        </div>

        <div className="ministry-grid">
          {ministries.map((ministry) => (
            <Link key={ministry.id} href="#" className="ministry-card animate-on-scroll">
              <div className="ministry-image">
                <Image
                  src={ministry.image}
                  alt={ministry.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="ministry-overlay"></div>
              <div className="ministry-content">
                <h3>{ministry.title}</h3>
                <span className="ministry-link">
                  Learn More <i className="pi pi-arrow-right"></i>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MinistriesSection;
