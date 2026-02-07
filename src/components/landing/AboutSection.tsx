'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { siteMetadata } from '@/data/site-metadata';

const stats = [
  { number: '500+', label: 'Members' },
  { number: '10+', label: 'Ministries' },
  { number: '5', label: 'Years' },
];

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="about-section animate-on-scroll">
      <div className="landing-container">
        <div className="about-grid">
          <div className="about-image-wrapper">
            <Image
              src="/assets/images/community.jpg"
              alt={`${siteMetadata.name} Community`}
              width={500}
              height={500}
              className="about-image"
              unoptimized
            />
            <div className="about-image-accent"></div>
          </div>

          <div className="about-content">
            <span className="section-label">About Us</span>
            <h2>{siteMetadata.slogan}</h2>
            <p>
              {siteMetadata.description}
            </p>

            {/* <div className="about-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <span className="stat-number">{stat.number}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div> */}

            <Link href="/about" className="landing-btn landing-btn-outline">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
