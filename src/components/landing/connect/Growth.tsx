'use client';

import React from 'react';
import Link from 'next/link';

const growthFeatures = [
  {
    icon: 'pi pi-book',
    title: 'Discipleship Track',
    description:
      'Our discipleship pathway helps you grow from a new believer to a mature, fruit-bearing follower of Jesus through intentional stages.',
  },
  {
    icon: 'pi pi-star',
    title: 'Equipping & Training',
    description:
      'Through workshops, mentoring, and the School of Leaders, we equip you with tools to live out your calling with confidence.',
  },
  {
    icon: 'pi pi-compass',
    title: 'Be Sent',
    description:
      'The ultimate goal of discipleship is to be sent — empowered and commissioned to fulfill the Great Commission in your sphere of influence.',
  },
];

export const Growth: React.FC = () => {
  return (
    <section className="connect-panel landing-container" style={{ padding: '48px 24px' }}>
      <span className="section-label">Growth</span>
      <h2
        style={{
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: 800,
          color: 'var(--text-heading)',
          letterSpacing: 'var(--letter-spacing-tight)',
          marginBottom: '12px',
        }}
      >
        Grow, Equip, Be Sent
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
        We don&apos;t just want you to attend church — we want to see you become a disciple
        who makes disciples. The WIN–CONSOLIDATE–DISCIPLE–SEND process is our roadmap for
        your spiritual journey.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '36px',
        }}
      >
        {growthFeatures.map((feature) => (
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
        href="/about"
        className="landing-btn landing-btn-primary"
        style={{ alignSelf: 'flex-start' }}
      >
        <i className="pi pi-arrow-right" aria-hidden="true" />
        Grow With Us
      </Link>
    </section>
  );
};

export default Growth;
