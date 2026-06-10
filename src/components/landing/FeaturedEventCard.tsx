'use client';

import React from 'react';
import Link from 'next/link';
import { Event } from '@/data/events';

interface FeaturedEventCardProps {
  event: Event;
}

/**
 * FeaturedEventCard Component
 *
 * Displays a featured event in a prominent card layout.
 */
export const FeaturedEventCard: React.FC<FeaturedEventCardProps> = ({ event }) => {
  return (
    <section style={{
      padding: '60px 0',
      background: 'var(--color-ivory)',
      position: 'relative',
    }}>
      <div className="landing-container">
        <div style={{ marginBottom: '24px' }}>
          <span className="section-label">Featured Event</span>
        </div>
        <Link
          href={`/events/${event.slug}`}
          style={{ textDecoration: 'none', display: 'block' }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '40px',
              alignItems: 'center',
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              boxShadow: '0 10px 30px var(--shadow-color-soft)',
              transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
            }}
            className="featured-event-grid"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'var(--primary-gold-accent)';
              e.currentTarget.style.boxShadow = '0 18px 42px var(--shadow-color-medium), 0 0 0 1px rgba(212, 168, 75, 0.28)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = '0 10px 30px var(--shadow-color-soft)';
            }}
          >
            <div
              style={{
                position: 'relative',
                aspectRatio: '4/3',
                backgroundImage: `url('${event.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  backgroundColor: 'var(--primary-gold-accent)',
                  color: 'white',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  textAlign: 'center',
                }}
              >
                <span style={{ display: 'block', fontSize: '24px', fontWeight: '700', lineHeight: '1' }}>
                  {(event.displayDate || event.date).split(' ')[1]}
                </span>
                <span style={{ display: 'block', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>
                  {(event.displayDate || event.date).split(' ')[0]}
                </span>
              </div>
            </div>
            <div style={{ padding: '40px 40px 40px 0' }} className="featured-event-content">
              {event.category && (
                <div
                  style={{
                    display: 'inline-block',
                    padding: '6px 16px',
                    backgroundColor: 'var(--primary-gold-accent)',
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginBottom: '16px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {event.category}
                </div>
              )}
              <h2
                style={{
                  fontSize: '32px',
                  marginBottom: '16px',
                  color: 'var(--text-primary)',
                  lineHeight: '1.2',
                }}
              >
                {event.title}
              </h2>
              <p
                style={{
                  fontSize: '16px',
                  color: 'var(--text-secondary)',
                  marginBottom: '20px',
                  lineHeight: '1.7',
                }}
              >
                {event.description}
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  marginBottom: '20px',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <i className="pi pi-calendar" style={{ color: 'var(--primary-gold-accent)' }} />
                  {event.day}, {event.displayDate || event.date}
                </span>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <i className="pi pi-clock" style={{ color: 'var(--primary-gold-accent)' }} />
                  {event.time}
                </span>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <i className="pi pi-map-marker" style={{ color: 'var(--primary-gold-accent)' }} />
                  {event.location}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <span className="landing-btn landing-btn-primary">
                  <i className="pi pi-calendar-plus" />
                  Learn More
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .featured-event-grid {
            grid-template-columns: 1fr !important;
          }
          .featured-event-content {
            padding: 32px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default FeaturedEventCard;
