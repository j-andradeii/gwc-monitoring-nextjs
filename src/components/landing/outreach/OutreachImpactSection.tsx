import React from 'react';
import { outreachImpactStats } from '@/data/outreachData';

export const OutreachImpactSection: React.FC = () => {
  return (
    <section id="outreach-impact" className="landing-section outreach-impact-section">
      <div className="landing-container">
        <div className="section-header-center animate-on-scroll">
          <span className="section-label-light">Our Impact</span>
          <h2 className="outreach-impact-title">God&apos;s Work Through Your Generosity</h2>
          <p className="outreach-impact-subtitle">
            Every peso given and every hour volunteered translates into lives touched and communities restored
          </p>
        </div>

        <div className="outreach-impact-grid animate-on-scroll">
          {outreachImpactStats.map((stat, index) => (
            <div key={index} className="outreach-impact-card">
              <div className="outreach-impact-icon">
                <i className={stat.icon}></i>
              </div>
              <span className="outreach-impact-value">{stat.value}</span>
              <span className="outreach-impact-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OutreachImpactSection;
