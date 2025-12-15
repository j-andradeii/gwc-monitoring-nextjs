'use client';

import React from 'react';
import Link from 'next/link';

interface Ministry {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const ministries: Ministry[] = [
  {
    id: '1',
    title: 'Youth Ministry',
    description: 'Empowering the next generation in their faith journey.',
    icon: 'pi pi-users',
  },
  {
    id: '2',
    title: 'Marketplace',
    description: 'Connecting faith and work for professionals.',
    icon: 'pi pi-briefcase',
  },
  {
    id: '3',
    title: 'Couples',
    description: 'Strengthening marriages through biblical guidance.',
    icon: 'pi pi-heart',
  },
  {
    id: '4',
    title: 'Kids Church',
    description: 'Fun and faith-filled programs for children.',
    icon: 'pi pi-star',
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
              <div className="ministry-icon">
                <i className={ministry.icon}></i>
              </div>
              <h3>{ministry.title}</h3>
              <p>{ministry.description}</p>
              <span className="ministry-link">
                Learn More <i className="pi pi-arrow-right"></i>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MinistriesSection;
