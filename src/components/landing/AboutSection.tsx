'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
              alt="Gateway Church Community"
              width={500}
              height={500}
              className="about-image"
              unoptimized
            />
            <div className="about-image-accent"></div>
          </div>

          <div className="about-content">
            <span className="section-label">About Us</span>
            <h2>Loving God, Loving People</h2>
            <p>
              Gateway Church is a vibrant, multicultural community dedicated to sharing the
              love of Christ. We create a space where people can encounter God, grow in their
              faith, and find a supportive family.
            </p>

            <div className="about-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <span className="stat-number">{stat.number}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>

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
