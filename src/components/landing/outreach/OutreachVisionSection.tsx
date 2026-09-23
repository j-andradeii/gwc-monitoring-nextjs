import React from 'react';
import Image from 'next/image';
import { GiveScriptureList } from '@/components/landing/give/GiveScriptureList';
import { outreachVisionData } from '@/data/outreachData';

export const OutreachVisionSection: React.FC = () => {
  return (
    <section id="outreach-vision" className="landing-section outreach-vision-section">
      <div className="landing-container">
        <div className="gateway-vision-grid">
          {/* Left Column: Pastor portrait image + scripture beneath */}
          <div className="gateway-vision-image animate-on-scroll">
            <div className="gateway-vision-image-wrapper">
              <Image
                src="https://gtxngthtpisigkys.public.blob.vercel-storage.com/outreach/10.jpg"
                alt="Gateway Outreach volunteers handing out clothing and drinks to families in the community"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="gateway-vision-photo"
                unoptimized
              />
            </div>

            <GiveScriptureList
              className="outreach-vision-scripture-list"
              description="The scripture behind this outreach call."
              ariaLabel="Gateway Outreach scripture"
              items={[
                {
                  kicker: outreachVisionData.sectionLabel,
                  verse: outreachVisionData.scripture.verse,
                  text: outreachVisionData.scripture.text,
                },
              ]}
            />
          </div>

          {/* Right Column: Vision narrative text */}
          <div className="gateway-vision-content animate-on-scroll">
            <span className="section-label">{outreachVisionData.sectionLabel}</span>
            <h2 className="gateway-vision-heading">{outreachVisionData.heading}</h2>

            <div className="gateway-vision-text">
              {outreachVisionData.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Pastor attribution */}
            {/* <div className="gateway-vision-attribution">
              <div className="gateway-vision-attr-line"></div>
              <div className="gateway-vision-attr-info">
                <span className="gateway-vision-attr-name">{outreachVisionData.pastorName}</span>
                <span className="gateway-vision-attr-role">{outreachVisionData.pastorRole}</span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OutreachVisionSection;
