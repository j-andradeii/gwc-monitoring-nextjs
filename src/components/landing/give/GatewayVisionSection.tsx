import React from 'react';
import Image from 'next/image';
import { gatewayVisionData } from '@/data/giveData';

export const GatewayVisionSection: React.FC = () => {
  return (
    <section id="gateway-vision" className="landing-section gateway-vision-section">
      <div className="landing-container">
        <div className="gateway-vision-grid">
          {/* Left Column: Pastor portrait image */}
          <div className="gateway-vision-image animate-on-scroll">
            <div className="gateway-vision-image-wrapper">
              <Image
                src={gatewayVisionData.pastorImage}
                alt={`${gatewayVisionData.pastorName} - ${gatewayVisionData.pastorRole}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="gateway-vision-photo"
                unoptimized
              />
            </div>
            {/* Scripture overlay on image */}
          </div>

          {/* Right Column: Vision narrative text */}
          <div className="gateway-vision-content animate-on-scroll">
            <span className="section-label">{gatewayVisionData.sectionLabel}</span>
            <h2 className="gateway-vision-heading">{gatewayVisionData.heading}</h2>

            <div className="gateway-vision-text">
              {gatewayVisionData.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Pastor attribution */}
            <div className="gateway-vision-attribution">
              <div className="gateway-vision-attr-line"></div>
              <div className="gateway-vision-attr-info">
                <span className="gateway-vision-attr-name">{gatewayVisionData.pastorName}</span>
                <span className="gateway-vision-attr-role">{gatewayVisionData.pastorRole}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GatewayVisionSection;
