import React from 'react';
import { ScriptureCard } from '@/components/cards';
import { ProjectGallery } from './ProjectGallery';
import { gatewayProjectsData } from '@/data/giveData';

export const GatewayProjectsSection: React.FC = () => {
  return (
    <section id="gateway-about" className="landing-section gateway-projects-section">
      <div className="landing-container">
        {/* Compact header — no description paragraph (vision section covers the narrative) */}
        <div className="gateway-projects-header animate-on-scroll">
          <span className="section-label">{gatewayProjectsData.subtitle}</span>
          <h2>Our Ministry Center</h2>
        </div>

        {/* Gallery-forward layout with scripture accent sidebar */}
        <div className="gateway-projects-layout animate-on-scroll">
          {/* Accent sidebar: Scripture card + scroll prompt */}
          <div className="gateway-projects-sidebar">
            <ScriptureCard
              verse="Haggai 1:8"
              text="Go up into the mountains and bring down timber and build my house, so that I may take pleasure in it and be honored,&rdquo; says the Lord."
            />

            <div className="gateway-projects-scroll-cta">
              <span>See our progress</span>
              <i className="pi pi-arrow-down"></i>
            </div>
          </div>

          <div className="gateway-projects-gallery-main">
            <ProjectGallery images={gatewayProjectsData.gallery} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GatewayProjectsSection;
