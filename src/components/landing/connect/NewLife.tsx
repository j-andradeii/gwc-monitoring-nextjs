'use client';

import React from 'react';
import Link from 'next/link';

const features = [
  {
    icon: 'pi pi-heart',
    title: 'Salvation Decision',
    description:
      'Made a decision to follow Jesus? We want to celebrate with you and help you take your very next step.',
  },
  {
    icon: 'pi pi-send',
    title: 'Water Baptism',
    description:
      'Publicly declare your faith through baptism — a meaningful step of obedience that marks a new beginning.',
  },
  {
    icon: 'pi pi-star',
    title: 'Encounter Weekend',
    description:
      'A transformative two-day experience designed to help new believers encounter the presence of God and begin their faith journey.',
  },
];

export const NewLife: React.FC = () => {
  return (
    <section className="connect-panel landing-container" style={{ padding: '48px 24px' }}>
      <span className="section-label">New Life</span>
      <h2
        style={{
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: 800,
          color: 'var(--text-heading)',
          letterSpacing: 'var(--letter-spacing-tight)',
          marginBottom: '12px',
        }}
      >
        Your Journey Starts Here
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
        Whether you just made a decision for Christ or you&apos;re curious about faith,
        Gateway Church is ready to walk alongside you. You are not alone in this.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '36px',
        }}
      >
        {features.map((feature) => (
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
        href="/events/sonday-service"
        className="landing-btn landing-btn-primary"
        style={{ alignSelf: 'flex-start' }}
      >
        <i className="pi pi-map-marker" aria-hidden="true" />
        Plan Your Visit
      </Link>
    </section>
  );
};

export default NewLife;
