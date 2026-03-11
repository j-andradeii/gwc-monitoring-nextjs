import React from 'react';
import Image from 'next/image';
import { outreachImpactStats } from '@/data/outreachData';

export const OutreachImpactSection: React.FC = () => {
  return (
    <section id="outreach-impact" className="landing-section outreach-impact-section">
      <div className="outreach-impact-bg-decoration" aria-hidden="true" />

      <div className="landing-container">
        <div className="section-header-center animate-on-scroll">
          <span className="section-label-light">
            <i className="pi pi-heart-fill outreach-impact-label-icon" />
            Our Impact
          </span>
          <h2 className="outreach-impact-title">God&apos;s Work Through Your Generosity</h2>
          <p className="outreach-impact-subtitle">
            Every peso given and every hour volunteered translates into lives touched and communities restored
          </p>
          <div className="outreach-impact-title-divider" aria-hidden="true" />
        </div>

        <div className="outreach-impact-grid">
          {outreachImpactStats.map((stat, index) => (
            <div
              key={index}
              className="outreach-impact-card animate-on-scroll"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="outreach-impact-image-wrapper">
                <Image
                  src={stat.image}
                  alt={stat.label}
                  fill
                  className="outreach-impact-image"
                  sizes="(max-width: 480px) 50vw, (max-width: 900px) 25vw, 20vw"
                />
                <div className="outreach-impact-image-overlay" />
                <div className="outreach-impact-icon-badge">
                  <i className={stat.icon} />
                </div>
              </div>
              <div className="outreach-impact-card-body">
                <span className="outreach-impact-value">{stat.value}</span>
                <div className="outreach-impact-value-bar" aria-hidden="true" />
                <span className="outreach-impact-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OutreachImpactSection;
