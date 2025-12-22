'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { sermons } from '@/data/sermons';

export const SermonsSection: React.FC = () => {
  // Get the 3 most recent sermons
  const recentSermons = sermons.slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

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
          {recentSermons.map((sermon) => (
            <Link
              key={sermon.id}
              href={`/sermon-notes/${sermon.id}`}
              style={{ textDecoration: 'none' }}
            >
              <article className="sermon-card animate-on-scroll">
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
                    <span><i className="pi pi-calendar"></i> {formatDate(sermon.date)}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SermonsSection;
