'use client';

import React from 'react';
import Link from 'next/link';
import { Event } from '@/data/events';

interface EventsCardGridProps {
  events: Event[];
  showDescription?: boolean;
}

/**
 * EventsCardGrid Component
 *
 * Reusable grid component for displaying event cards.
 * Used on both the landing page and the dedicated events page.
 */
export const EventsCardGrid: React.FC<EventsCardGridProps> = ({
  events,
  showDescription = true,
}) => {
  if (events.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '80px 20px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 24px',
            background: 'linear-gradient(135deg, rgba(240, 180, 41, 0.15) 0%, rgba(8, 145, 178, 0.1) 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <i
            className="pi pi-calendar"
            style={{ fontSize: '32px', color: 'var(--text-secondary)' }}
          />
        </div>
        <h3
          style={{
            color: 'var(--text-primary)',
            marginBottom: '12px',
            fontSize: '24px',
          }}
        >
          No events found
        </h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
          Check back soon for upcoming events and gatherings.
        </p>
      </div>
    );
  }

  return (
    <div className="events-card-grid">
      {events.map((event) => (
        <Link key={event.id} href={`/events/${event.id}`} className="event-grid-card">
          <div
            className="event-grid-card-image"
            style={{ backgroundImage: `url('${event.image}')` }}
          >
            <div className="event-grid-card-date-badge">
              <span className="event-grid-day-num">{event.date.split(' ')[1]}</span>
              <span className="event-grid-month">{event.date.split(' ')[0]}</span>
            </div>
          </div>
          <div className="event-grid-card-body">
            <h3 className="event-grid-card-title">{event.title}</h3>
            {showDescription && event.description && (
              <p style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                marginBottom: '12px',
                lineHeight: '1.5',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {event.description}
              </p>
            )}
            <div className="event-grid-card-info">
              <div className="event-grid-info-row">
                <i className="pi pi-calendar"></i>
                <span>{event.day}, {event.date}</span>
              </div>
              <div className="event-grid-info-row">
                <i className="pi pi-clock"></i>
                <span>{event.time}</span>
              </div>
              <div className="event-grid-info-row">
                <i className="pi pi-map-marker"></i>
                <span>{event.location}</span>
              </div>
            </div>
            <div className="event-grid-card-cta">
              <span>Learn More</span>
              <i className="pi pi-arrow-right"></i>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default EventsCardGrid;
