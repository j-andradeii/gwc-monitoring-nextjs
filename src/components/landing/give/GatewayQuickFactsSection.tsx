import React from 'react';
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
              <div className="gateway-quickfact-icon">
                <i className={fact.icon}></i>
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
