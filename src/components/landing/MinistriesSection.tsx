'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Ministry {
  id: string;
  title: string;
  description: string;
  image: string;
}

const ministries: Ministry[] = [
  {
    id: '1',
    title: 'Youth Ministry',
    description: 'Engaging and empowering the next generation in their faith journey.',
    image: 'https://placehold.co/400x250/C7C7C7/232323?text=Youth+Ministry',
  },
  {
    id: '2',
    title: 'Marketplace Ministry',
    description: 'Connecting faith and work, equipping professionals to make an impact.',
    image: 'https://placehold.co/400x250/C7C7C7/232323?text=Marketplace+Ministry',
  },
  {
    id: '3',
    title: 'Couples Ministry',
    description: 'Strengthening marriages and relationships through biblical guidance.',
    image: 'https://placehold.co/400x250/C7C7C7/232323?text=Couples+Ministry',
  },
];

export const MinistriesSection: React.FC = () => {
  return (
    <section id="ministries" className="ministries-section animate-on-scroll">
      <div className="landing-container">
        <h2>Our Ministries</h2>

        <div className="ministry-list">
          {ministries.map((ministry) => (
            <div key={ministry.id} className="ministry-item animate-on-scroll">
              <div className="item-image">
                <Image
                  src={ministry.image}
                  alt={ministry.title}
                  width={400}
                  height={250}
                  unoptimized
                />
              </div>
              <div className="item-content">
                <h3>
                  <Link href="#">{ministry.title}</Link>
                </h3>
                <p>{ministry.description}</p>
                <Link href="#" className="read-more">
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="#" className="landing-btn landing-btn-outline">
            View More Ministries
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MinistriesSection;
