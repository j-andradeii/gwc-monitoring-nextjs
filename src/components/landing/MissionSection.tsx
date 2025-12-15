'use client';

import React from 'react';

interface QuickInfoItem {
  icon: string;
  title: string;
  description: string;
}

const quickInfoItems: QuickInfoItem[] = [
  {
    icon: 'pi pi-heart',
    title: 'Worship',
    description: 'Experience God through authentic worship and praise.',
  },
  {
    icon: 'pi pi-users',
    title: 'Community',
    description: 'Find your place in our church family.',
  },
  {
    icon: 'pi pi-book',
    title: 'Grow',
    description: 'Deepen your faith through biblical teaching.',
  },
  {
    icon: 'pi pi-globe',
    title: 'Serve',
    description: 'Make an impact in our community and beyond.',
  },
];

export const MissionSection: React.FC = () => {
  return (
    <section className="quick-info-section animate-on-scroll">
      <div className="landing-container">
        <div className="quick-info-grid">
          {quickInfoItems.map((item, index) => (
            <div key={index} className="quick-info-card">
              <div className="quick-info-icon">
                <i className={item.icon}></i>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
