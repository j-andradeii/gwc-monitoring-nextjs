import React from 'react';
import { outreachGalleryImages } from '@/data/outreachData';
import { ProjectGallery } from '@/components/landing/give';

export const OutreachGallerySection: React.FC = () => {
  return (
    <section id="outreach-gallery" className="landing-section outreach-gallery-section">
      <div className="landing-container">
        <div className="section-header-center animate-on-scroll">
          <span className="section-label">In Action</span>
          <h2 className="outreach-gallery-title">Our Outreach in Action</h2>
          <p className="outreach-gallery-subtitle">
            Glimpses of the everyday work — goods packed, homes visited, and neighbors met right where they live
          </p>
        </div>

        <div className="animate-on-scroll">
          <ProjectGallery images={outreachGalleryImages} />
        </div>
      </div>
    </section>
  );
};

export default OutreachGallerySection;
