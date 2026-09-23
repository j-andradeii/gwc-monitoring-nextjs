import React from 'react';
import { GiveChannelsSection } from '@/components/landing/give/GiveChannelsSection';


export const OutreachGiveSection: React.FC = () => {
  return (
    <section id="outreach-give" className="outreach-give-section">
      <div className="outreach-give-header landing-container">
        <div className="section-header-center animate-on-scroll">
          <span className="section-label">Support Our Outreach</span>
          <h2 className="outreach-give-title">Your Generosity Reaches Communities</h2>
          <p className="outreach-give-subtitle">
            Every gift keeps our teams in the community week after week — and keeps us ready to move the moment disaster strikes
          </p>
        </div>
      </div>
      <GiveChannelsSection showGivingDescription={false} />
    </section>
  );
};

export default OutreachGiveSection;
