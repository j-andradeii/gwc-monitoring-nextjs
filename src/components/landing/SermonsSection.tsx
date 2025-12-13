'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  excerpt: string;
  image: string;
}

const sermons: Sermon[] = [
  {
    id: '1',
    title: 'The Power of Forgiveness',
    speaker: 'Pastor John Doe',
    date: 'July 14, 2025',
    excerpt: 'Discover the liberating power of forgiveness in your life and relationships.',
    image: 'https://placehold.co/400x250/D1D1D1/232323?text=Sermon+Series',
  },
  {
    id: '2',
    title: 'Living a Life of Purpose',
    speaker: 'Pastor Jane Smith',
    date: 'July 7, 2025',
    excerpt: "Exploring how to find and live out God's purpose for your life.",
    image: 'https://placehold.co/400x250/D1D1D1/232323?text=Faith+Journey',
  },
  {
    id: '3',
    title: 'Finding Hope in Hard Times',
    speaker: 'Guest Speaker',
    date: 'June 30, 2025',
    excerpt: 'A message of encouragement and resilience through faith.',
    image: 'https://placehold.co/400x250/D1D1D1/232323?text=Hope+Restored',
  },
];

export const SermonsSection: React.FC = () => {
  return (
    <section id="sermons" className="sermons-section animate-on-scroll">
      <div className="landing-container">
        <h2>Latest Sermons</h2>

        <div className="sermon-list">
          {sermons.map((sermon) => (
            <div key={sermon.id} className="sermon-item animate-on-scroll">
              <div className="item-image">
                <Image
                  src={sermon.image}
                  alt={sermon.title}
                  width={400}
                  height={250}
                  unoptimized
                />
              </div>
              <div className="item-content">
                <p className="item-meta">
                  Speaker: {sermon.speaker} | {sermon.date}
                </p>
                <h3>
                  <Link href="#">{sermon.title}</Link>
                </h3>
                <p>{sermon.excerpt}</p>
                <Link href="#" className="read-more">
                  Watch Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SermonsSection;
