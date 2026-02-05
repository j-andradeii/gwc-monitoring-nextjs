'use client';

import React from 'react';
import { ScriptureCard } from '@/components/cards';
import { scriptures } from '@/data/giveData';

export const GiveWhySection: React.FC = () => {
  return (
    <section id="ways-to-give" className="landing-section give-why-section">
      <div className="landing-container">
        <div className="section-header-center animate-on-scroll">
          <span className="section-label">Generosity</span>
          <h2>Why We Give</h2>
        </div>

        <div className="give-why-content animate-on-scroll">
          <p className="give-why-intro">
            Giving is an act of worship and obedience to God. When we give, we acknowledge
            that everything we have comes from Him. Our tithes and offerings support the
            ministry of Gateway Church, enabling us to reach more people with the Gospel,
            serve our community, and equip believers for Kingdom work.
          </p>

          <div className="scriptures-grid">
            {scriptures.map((scripture, index) => (
              <ScriptureCard
                key={index}
                verse={scripture.verse}
                text={scripture.text}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GiveWhySection;
