import React from 'react';
import Image from 'next/image';
import { gatewayQuickFacts } from '@/data/giveData';

export const GatewayQuickFactsSection: React.FC = () => {
  return (
    <section id="gateway-facts" className="landing-section gateway-quickfacts-section">
      <div className="landing-container">
        <div className="section-header-center animate-on-scroll">
          <span className="section-label gateway-quickfacts-label">Project Highlights</span>
          <h2 className="gateway-quickfacts-title">What We Are Building</h2>
          <p className="gateway-quickfacts-subtitle">
            Key details about the Ministry Center Improvement Project
          </p>
        </div>

        <div className="gateway-quickfacts-grid animate-on-scroll">
          {gatewayQuickFacts.map((fact, index) => (
            <div key={index} className="gateway-quickfact-card">
              <div className="gateway-quickfact-icon" style={{ overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '12px' }}>
                <Image
                  src={fact.image}
                  alt={fact.label}
                  width={64}
                  height={64}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  unoptimized
                />
              </div>
              <span className="gateway-quickfact-value">{fact.value}</span>
              <span className="gateway-quickfact-label">{fact.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GatewayQuickFactsSection;
