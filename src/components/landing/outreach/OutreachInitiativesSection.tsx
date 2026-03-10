import React from 'react';
import Image from 'next/image';
import { outreachInitiatives } from '@/data/outreachData';

export const OutreachInitiativesSection: React.FC = () => {
  return (
    <section id="outreach-initiatives" className="landing-section outreach-initiatives-section">
      <div className="landing-container">
        <div className="section-header-center animate-on-scroll">
          <span className="section-label">What We Do</span>
          <h2 className="outreach-initiatives-title">Our Disaster Response Initiatives</h2>
          <p className="outreach-initiatives-subtitle">
            From immediate relief to long-term recovery, we walk with communities through every stage of disaster response
          </p>
        </div>

        <div className="outreach-initiatives-grid animate-on-scroll">
          {outreachInitiatives.map((initiative) => (
            <div key={initiative.id} className="outreach-initiative-card">
              <div className="outreach-initiative-image-wrapper">
                <Image
                  src={initiative.image}
                  alt={initiative.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="outreach-initiative-image"
                  unoptimized
                />
                <div className="outreach-initiative-overlay"></div>
              </div>
              <div className="outreach-initiative-content">
                <div className="outreach-initiative-icon">
                  <i className={initiative.icon}></i>
                </div>
                <h3 className="outreach-initiative-title">{initiative.title}</h3>
                <p className="outreach-initiative-description">{initiative.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OutreachInitiativesSection;
