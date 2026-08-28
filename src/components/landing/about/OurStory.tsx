'use client';

import React from 'react';
import Image from 'next/image';

const stats = [
  { number: '500+', label: 'Members' },
  { number: '10+', label: 'Ministries' },
  { number: '5', label: 'Years' },
];

export const OurStory: React.FC = () => {
  return (
    <section id="our-story" className="our-story-section animate-on-scroll">
      <div className="landing-container">
        <div className="our-story-grid">
          <div className="our-story-image-wrapper">
            <Image
              src="/assets/images/community.jpg"
              alt="Gateway Church Community"
              width={550}
              height={450}
              className="our-story-image"
              unoptimized
            />
            <div className="our-story-image-accent"></div>
          </div>

          <div className="our-story-content">
            <span className="section-label">Our Story</span>
            <h2>A Place Called Home</h2>
            <p>
              Gateway Church began with a simple vision: to create a place where people
              from all walks of life could encounter God&apos;s presence and discover their
              purpose. What started as a small gathering has grown into a vibrant,
              multigenerational community united by faith and love.
            </p>
            <p>
              We are more than just a Sunday service. We are a family committed to
              walking alongside each other through every season of life. Whether
              you&apos;re taking your first steps in faith or have been walking with God
              for years, there&apos;s a place for you here.
            </p>

            {/* <div className="our-story-stats">
              {stats.map((stat, index) => (
                <div key={index} className="our-story-stat-item">
                  <span className="stat-number">{stat.number}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
