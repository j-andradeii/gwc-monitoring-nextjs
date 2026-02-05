'use client';

import React from 'react';
import { ScriptureCard } from '@/components/cards';
import { ProjectGallery } from './ProjectGallery';
import { gatewayProjectsData } from '@/data/giveData';

export const GatewayProjectsSection: React.FC = () => {
  return (
    <section id="gateway-projects" className="landing-section gateway-projects-section">
      <div className="landing-container">
        <div className="section-header-center animate-on-scroll">
          <span className="section-label">{gatewayProjectsData.subtitle}</span>
          <h2>{gatewayProjectsData.title}</h2>
          <p className="project-description">{gatewayProjectsData.description}</p>
        </div>

        <div className="project-content animate-on-scroll">
          <div className="project-scripture">
            <ScriptureCard
              verse="Haggai 1:8"
              text="Go up into the mountains and bring down timber and build my house, so that I may take pleasure in it and be honored,&rdquo; says the Lord."
            />
          </div>

          <div className="project-gallery">
            <h3>Our Ministry Center</h3>
            <ProjectGallery images={gatewayProjectsData.gallery} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GatewayProjectsSection;
