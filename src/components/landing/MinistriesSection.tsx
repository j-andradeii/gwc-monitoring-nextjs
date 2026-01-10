'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Ministry {
  id: string;
  title: string;
  image: string;
}

const ministries: Ministry[] = [
  {
    id: '1',
    title: 'Youth Ministry',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/youth_1.jpg',
  },
  {
    id: '2',
    title: 'Marketplace',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/marketplace.jpg',
  },
  {
    id: '3',
    title: 'Couples',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/couple.jpg',
  },
  {
    id: '4',
    title: 'Kids Church',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/kids.jpg',
  },
];

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
