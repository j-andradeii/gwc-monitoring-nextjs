/**
 * Events Page
 *
 * Public page displaying upcoming events with landing page consistent design
 */

'use client';

import Link from 'next/link';
import '@/styles/landing.css';
import { LandingHeader, LandingFooter, EventsCardGrid } from '@/components/landing';
import { events, getFeaturedEvent } from '@/data/events';

export default function EventsPage() {
  const featuredEvent = getFeaturedEvent();
  const regularEvents = events.filter((e) => !e.isFeatured);

  return (
    <div className="landing-page">
      <LandingHeader />

      {/* Hero Banner */}
      <section
        className="hero-section"
        style={{
          backgroundImage: "url('/assets/images/community.jpg')",
          minHeight: '50vh',
        }}
      >
        <div className="hero-content">
          <span className="hero-badge">Join Us</span>
          <h1>Upcoming Events</h1>
          <p>
            Connect, grow, and celebrate with our church community. Find an event that&apos;s
            right for you and experience the joy of fellowship.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="landing-main" style={{ paddingTop: 0 }}>
        {/* Featured Event - White with subtle gold accent */}
        {featuredEvent && (
          <section style={{
            padding: '60px 0',
            background: '#ffffff',
            position: 'relative',
          }}>
            <div className="landing-container">
              <div style={{ marginBottom: '24px' }}>
                <span className="section-label">Featured Event</span>
              </div>
              <Link
                href={`/events/${featuredEvent.id}`}
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
                    overflow: 'hidden',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                  className="featured-event-grid"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      aspectRatio: '4/3',
                      backgroundImage: `url('${featuredEvent.image}')`,
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
                        {featuredEvent.date.split(' ')[1]}
                      </span>
                      <span style={{ display: 'block', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>
                        {featuredEvent.date.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '40px 40px 40px 0' }} className="featured-event-content">
                    {featuredEvent.category && (
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
                        {featuredEvent.category}
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
                      {featuredEvent.title}
                    </h2>
                    <p
                      style={{
                        fontSize: '16px',
                        color: 'var(--text-secondary)',
                        marginBottom: '20px',
                        lineHeight: '1.7',
                      }}
                    >
                      {featuredEvent.description}
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
                        {featuredEvent.day}, {featuredEvent.date}
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
                        {featuredEvent.time}
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
                        {featuredEvent.location}
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
          </section>
        )}

        {/* Events Grid */}
        <section style={{
          padding: '60px 0',
          background: '#fff',
        }}>
          <div className="landing-container">
            <div style={{ marginBottom: '32px' }}>
              <span className="section-label">All Events</span>
              <h2 style={{ fontSize: '28px', color: 'var(--text-primary)', marginTop: '8px' }}>
                Upcoming Gatherings
              </h2>
            </div>
            <EventsCardGrid events={regularEvents} showDescription={true} />
          </div>
        </section>
      </main>

      <LandingFooter />

      {/* Responsive Styles */}
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
    </div>
  );
}
