'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ServiceDetail {
  emoji: string;
  text: string;
  highlight?: string;
}

const serviceDetails: ServiceDetail[] = [
  { emoji: '🗓️', text: '', highlight: 'Every Sunday' },
  { emoji: '🚪', text: 'Gates open at 9:00am' },
  { emoji: '⏰', text: 'Starts at 9:30am' },
  { emoji: '📍', text: 'Address: Lex Hotel 2nd Floor, Capitol Cebu City' },
];

export const ChurchServiceSection: React.FC = () => {
  return (
    <section id="services" className="church-service-section animate-on-scroll">
      <div className="landing-container">
        <h2>Church Service</h2>

        <div className="flex flex-wrap items-center gap-8">
          <div className="w-full md:w-5/12 church-service-image">
            <Image
              src="https://placehold.co/600x400/F0EAD6/333333?text=Sunday+Service"
              alt="Church Service"
              width={600}
              height={400}
              unoptimized
            />
          </div>

          <div className="w-full md:w-7/12 service-details-wrapper">
            <div className="service-details">
              {serviceDetails.map((detail, index) => (
                <p key={index}>
                  <span className="emoji-icon">{detail.emoji}</span>
                  {detail.highlight ? <strong>{detail.highlight}</strong> : detail.text}
                </p>
              ))}
            </div>
            <Link href="#" className="landing-btn landing-btn-primary">
              More Details
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChurchServiceSection;
