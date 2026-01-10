'use client';

import React from 'react';

interface QuickInfoItem {
  icon: string;
  title: string;
  description: string;
}

const quickInfoItems: QuickInfoItem[] = [
  {
    icon: 'pi pi-user-plus',
    title: 'WIN',
    description: 'Reaching new people for Jesus through sharing the Gospel.',
  },
  {
    icon: 'pi pi-heart',
    title: 'CONSOLIDATE',
    description: 'Taking care of the new believer in the same way a parent takes care of a newborn baby. During this process their faith is affirmed through a personal Encounter with Jesus.',
  },
  {
    icon: 'pi pi-book',
    title: 'DISCIPLE',
    description: 'Reproducing the character of Christ in disciples and equipping them with the necessary tools so that they can become successful leaders who multiply and reproduce the Vision.',
  },
  {
    icon: 'pi pi-globe',
    title: 'SEND',
    description: 'The moment where new leaders are empowered to step into the ministry and fulfill the Great Commission.',
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
