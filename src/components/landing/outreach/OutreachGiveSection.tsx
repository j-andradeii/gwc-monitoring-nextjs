import React from 'react';
import { GiveChannelsSection } from '@/components/landing/give/GiveChannelsSection';

export const OutreachGiveSection: React.FC = () => {
  return (
    <section id="outreach-give" className="outreach-give-section">
      <div className="outreach-give-header landing-container">
        <div className="section-header-center animate-on-scroll">
          <span className="section-label">Support Our Outreach</span>
          <h2 className="outreach-give-title">Your Generosity Saves Lives</h2>
          <p className="outreach-give-subtitle">
            Your generosity enables us to respond when disaster strikes — providing immediate relief, recovery support, and lasting hope to families in crisis
          </p>
        </div>
      </div>
      <GiveChannelsSection />
    </section>
  );
};

export default OutreachGiveSection;
