'use client';

import React from 'react';
import Link from 'next/link';

interface MissionItem {
  icon: string;
  title: string;
  description: string;
}

const missionItems: MissionItem[] = [
  {
    icon: 'pi pi-users',
    title: 'Our Community',
    description: 'Building a family of believers who support and encourage one another.',
  },
  {
    icon: 'pi pi-book',
    title: 'Church Mission',
    description: 'Building a family of believers who support and encourage one another.',
  },
  {
    icon: 'pi pi-calendar',
    title: 'Weekly Events',
    description: 'Building a family of believers who support and encourage one another.',
  },
  {
    icon: 'pi pi-heart',
    title: 'Charity Causes',
    description: 'Building a family of believers who support and encourage one another.',
  },
];

export const MissionSection: React.FC = () => {
  return (
    <section className="our-mission-section animate-on-scroll">
      <div className="landing-container">
        <h2>Our Mission</h2>
        <h2 className="mission-title">
          Together with Faith to Overcome <br />
          Life Challenges
        </h2>

        <div className="mission-items-wrapper">
          {missionItems.map((item, index) => (
            <div key={index} className="mission-item">
              <div className="mission-icon">
                <div className="icon-placeholder">
                  <i className={item.icon}></i>
                </div>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>

        <Link href="#" className="landing-btn landing-btn-primary landing-btn-mission-learn-more">
          Learn More
        </Link>
      </div>
    </section>
  );
};

export default MissionSection;
