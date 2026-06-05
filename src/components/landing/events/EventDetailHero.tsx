import React from 'react';
import Link from 'next/link';
import { Event } from '@/data/events';
import { CONTACT_INFO } from '@/data/contact';

interface Props {
  event: Event;
}

export function EventDetailHero({ event }: Props) {
  const isGoldenPeak = event.location?.toLowerCase().includes('golden peak');
  return (
    <section
      style={{
        position: 'relative',
        paddingTop: '80px',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="landing-container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '24px', paddingTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <Link
              href="/"
              style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}
            >
              Home
            </Link>
            <i className="pi pi-chevron-right" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }} />
            <Link
              href="/events"
              style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}
            >
              Events
            </Link>
            <i className="pi pi-chevron-right" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }} />
            <span style={{ color: 'var(--primary-gold-accent)' }}>{event.title}</span>
          </div>
        </nav>

        {/* Event Hero Image */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1000px',
            margin: '0 auto',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            aspectRatio: '16/9',
            backgroundImage: `url('${event.image}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Date Badge */}
          {/* <div
            style={{
              position: 'absolute',
              top: '15px',
              left: '20px',
              backgroundColor: 'var(--primary-gold-accent)',
              color: 'white',
              padding: '8px 8px',
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            <span style={{ display: 'block', fontSize: '20px', fontWeight: '700', lineHeight: '1' }}>
              {(event.displayDate || event.date).split(' ')[1]}
            </span>
            <span style={{ display: 'block', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>
              {(event.displayDate || event.date).split(' ')[0]}
            </span>
          </div> */}

          {/* Category Badge */}
          {event.category && (
            <div
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                backgroundColor: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(8px)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {event.category}
            </div>
          )}
        </div>

        {/* Event Title & Meta */}
        <div style={{ maxWidth: '1000px', margin: '32px auto 40px', textAlign: 'center' }}>
          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 44px)',
              color: '#ffffff',
              marginBottom: '16px',
              fontWeight: '700',
              lineHeight: '1.2',
            }}
          >
            {event.title}
          </h1>

          {/* Meta Info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
              <i className="pi pi-calendar" style={{ color: 'var(--primary-gold-accent)' }} />
              {event.day}, {event.displayDate || event.date}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
              <i className="pi pi-clock" style={{ color: 'var(--primary-gold-accent)' }} />
              {event.time}
            </div>
            {isGoldenPeak ? (
              <a
                href={CONTACT_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${event.location} in Google Maps`}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.8)', fontSize: '16px', textDecoration: 'none' }}
              >
                <i className="pi pi-map-marker" style={{ color: 'var(--primary-gold-accent)' }} />
                {event.location}
              </a>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
                <i className="pi pi-map-marker" style={{ color: 'var(--primary-gold-accent)' }} />
                {event.location}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
