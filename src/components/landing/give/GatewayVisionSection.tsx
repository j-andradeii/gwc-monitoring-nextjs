import React from 'react';
import Image from 'next/image';
import { gatewayVisionData } from '@/data/giveData';

export const GatewayVisionSection: React.FC = () => {
  const { scripture } = gatewayVisionData;

  return (
    <section id="gateway-vision" className="landing-section gateway-vision-section">
      <div className="landing-container">
        <div className="gateway-vision-grid">
          {/* Left Column: Pastor portrait + scripture pull-quote */}
          <div className="gateway-vision-image animate-on-scroll">
            <div className="gateway-vision-photo-frame">
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
            </div>

            {/* Scripture behind the vision — surfaces gatewayVisionData.scripture */}
            {scripture && (
              <figure className="gateway-vision-scripture-card">
                <blockquote className="gateway-vision-scripture-quote">
                  {scripture.text}
                </blockquote>
                <figcaption className="gateway-vision-scripture-ref">
                  <i className="pi pi-book" aria-hidden="true"></i>
                  {scripture.verse}
                </figcaption>
              </figure>
            )}
          </div>

          {/* Right Column: Vision narrative text */}
          <div className="gateway-vision-content animate-on-scroll">
            <span className="section-label">{gatewayVisionData.sectionLabel}</span>
            <h2 className="gateway-vision-heading">{gatewayVisionData.heading}</h2>

            <div className="gateway-vision-text">
              {gatewayVisionData.paragraphs.map((paragraph, index) => (
                <p key={index} className={index === 0 ? 'gateway-vision-lead' : undefined}>
                  {paragraph}
                </p>
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
