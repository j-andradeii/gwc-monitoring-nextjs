/**
 * Events Page
 *
 * Public page displaying upcoming events with landing page consistent design
 */

'use client';

import '@/styles/landing.css';
import { LandingHeader, LandingFooter, EventsCardGrid, FeaturedEventCard } from '@/components/landing';
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
        {/* Featured Event */}
        {featuredEvent && <FeaturedEventCard event={featuredEvent} />}

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
            <EventsCardGrid events={regularEvents} showDescription={true} showAll={true} limit={0} />
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
