'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  duration: string;
  image: string;
}

const sermons: Sermon[] = [
  {
    id: '1',
    title: 'The Power of Forgiveness',
    speaker: 'Pastor John',
    date: 'Dec 8, 2024',
    duration: '45 min',
    image: 'https://placehold.co/400x225/D1D1D1/232323?text=Sermon',
  },
  {
    id: '2',
    title: 'Living a Life of Purpose',
    speaker: 'Pastor Jane',
    date: 'Dec 1, 2024',
    duration: '38 min',
    image: 'https://placehold.co/400x225/D1D1D1/232323?text=Sermon',
  },
  {
    id: '3',
    title: 'Finding Hope in Hard Times',
    speaker: 'Guest Speaker',
    date: 'Nov 24, 2024',
    duration: '42 min',
    image: 'https://placehold.co/400x225/D1D1D1/232323?text=Sermon',
  },
];

export const SermonsSection: React.FC = () => {
  return (
    <section id="sermons" className="sermons-section animate-on-scroll">
      <div className="landing-container">
        <div className="section-header-inline">
          <div>
            <span className="section-label">Messages</span>
            <h2>Latest Sermons</h2>
          </div>
          <Link href="/sermon-notes" className="view-all-link">
            View All <i className="pi pi-arrow-right"></i>
          </Link>
        </div>

        <div className="sermon-grid">
          {sermons.map((sermon) => (
            <article key={sermon.id} className="sermon-card animate-on-scroll">
              <div className="sermon-card-image">
                <Image
                  src={sermon.image}
                  alt={sermon.title}
                  width={400}
                  height={225}
                  unoptimized
                />
                <div className="sermon-play-overlay">
                  <i className="pi pi-play-circle"></i>
                </div>
                <span className="sermon-duration">{sermon.duration}</span>
              </div>
              <div className="sermon-card-content">
                <h3>{sermon.title}</h3>
                <div className="sermon-meta">
                  <span><i className="pi pi-user"></i> {sermon.speaker}</span>
                  <span><i className="pi pi-calendar"></i> {sermon.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SermonsSection;
