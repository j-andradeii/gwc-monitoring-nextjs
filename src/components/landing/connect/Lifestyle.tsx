'use client';

import React from 'react';
import Link from 'next/link';

const lifestyleFeatures = [
  {
    icon: 'pi pi-sun',
    title: 'Spirit-Filled Daily Living',
    description:
      'Faith is not just Sunday. We equip you to walk in the Spirit every day — in your home, workplace, and community.',
  },
  {
    icon: 'pi pi-heart',
    title: 'Generosity & Service',
    description:
      'We believe a generous life is a blessed life. Whether giving your time, treasure, or talent — every act of service matters.',
  },
  {
    icon: 'pi pi-bookmark',
    title: 'Worship & Devotion',
    description:
      'We cultivate lives rooted in prayer, the Word, and authentic worship that flows from a transformed heart, not just a stage.',
  },
];

export const Lifestyle: React.FC = () => {
  return (
    <section className="connect-panel landing-container" style={{ padding: '48px 24px' }}>
      <span className="section-label">Lifestyle</span>
      <h2
        style={{
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: 800,
          color: 'var(--text-heading)',
          letterSpacing: 'var(--letter-spacing-tight)',
          marginBottom: '12px',
        }}
      >
        Live the Gateway Way
      </h2>
      <p
        style={{
          fontSize: '16px',
          fontWeight: 500,
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          lineHeight: 1.7,
          marginBottom: '36px',
        }}
      >
        Being part of Gateway Church is a lifestyle, not just a church attendance. We
        pursue God&apos;s presence in every area of life — and invite you to do the same.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '36px',
        }}
      >
        {lifestyleFeatures.map((feature) => (
          <div
            key={feature.title}
            className="premium-glass-card"
            style={{ padding: '28px 24px' }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(212, 168, 75, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <i
                className={feature.icon}
                style={{ fontSize: '20px', color: 'var(--primary-gold-accent)' }}
                aria-hidden="true"
              />
            </div>
            <h3
              style={{
                fontSize: '17px',
                fontWeight: 700,
                color: 'var(--text-heading)',
                marginBottom: '8px',
              }}
            >
              {feature.title}
            </h3>
            <p
              style={{
                fontSize: '14px',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <Link
        href="/ministries/serve"
        className="landing-btn landing-btn-primary"
        style={{ alignSelf: 'flex-start' }}
      >
        <i className="pi pi-send" aria-hidden="true" />
        Start Serving
      </Link>
    </section>
  );
};

export default Lifestyle;
