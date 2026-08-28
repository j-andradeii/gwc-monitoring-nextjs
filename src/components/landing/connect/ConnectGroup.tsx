'use client';

import React from 'react';
import Link from 'next/link';

const groupFeatures = [
  {
    icon: 'pi pi-users',
    title: 'Weekly Gatherings',
    description:
      'Connect Groups meet weekly in homes and coffee shops across the city. Real relationships, real conversations, real life.',
  },
  {
    icon: 'pi pi-map-marker',
    title: 'Find a Group Near You',
    description:
      'We have groups in multiple areas, whether you live north, south, or central, there is a community close to you.',
  },
  {
    icon: 'pi pi-heart',
    title: 'Do Life Together',
    description:
      'Share meals, study the Word, pray for one another, and experience the kind of community the church was always meant to be.',
  },
];

export const ConnectGroup: React.FC = () => {
  return (
    <section className="connect-panel landing-container" style={{ padding: '48px 24px' }}>
      <span className="section-label">Connect Group</span>
      <h2
        style={{
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: 800,
          color: 'var(--text-heading)',
          letterSpacing: 'var(--letter-spacing-tight)',
          marginBottom: '12px',
        }}
      >
        Community Changes Everything
      </h2>
      <p
        style={{
          fontSize: '18px',
          fontWeight: 500,
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          lineHeight: 1.7,
          marginBottom: '36px',
        }}
      >
        Life is better together. Our Connect Groups (cell groups) are small, intentional
        communities where you can belong, grow, and be known, not just attend church.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '36px',
        }}
      >
        {groupFeatures.map((feature) => (
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
                fontSize: '16px',
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
        href="/ministries/community"
        className="landing-btn landing-btn-primary"
        style={{ alignSelf: 'flex-start' }}
      >
        <i className="pi pi-users" aria-hidden="true" />
        Find a Connect Group
      </Link>
    </section>
  );
};

export default ConnectGroup;
