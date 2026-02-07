'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LandingHeader, LandingFooter, EventContactSection, ScrollAnimationProvider, ShareModal, JoinEventModal, ContactSection } from '@/components/landing';
import { Event } from '@/data/events';
import '@/styles/landing.css';

interface Props {
  event: Event;
  otherEvents: Event[];
}

export default function EventDetailClient({ event, otherEvents }: Props) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  return (
    <div className="landing-page">
      <LandingHeader />

      {/* Hero Section */}
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
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                backgroundColor: 'var(--primary-gold-accent)',
                color: 'white',
                padding: '10px 12px',
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <span style={{ display: 'block', fontSize: '22px', fontWeight: '700', lineHeight: '1' }}>
                {(event.displayDate || event.date).split(' ')[1]}
              </span>
              <span style={{ display: 'block', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>
                {(event.displayDate || event.date).split(' ')[0]}
              </span>
            </div>

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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
                <i className="pi pi-map-marker" style={{ color: 'var(--primary-gold-accent)' }} />
                {event.location}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main style={{ background: '#ffffff' }}>
        <div className="landing-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 380px',
              gap: '48px',
              padding: '60px 0',
            }}
            className="event-detail-grid"
          >
            {/* Left Column - Main Content */}
            <div>
              {/* Description */}
              {event.description && (
                <div style={{ marginBottom: '40px' }}>
                  <h2 style={{ fontSize: '24px', marginBottom: '20px', color: 'var(--text-primary)' }}>
                    About This Event
                  </h2>
                  <div
                    style={{
                      fontSize: '16px',
                      lineHeight: '1.8',
                      color: 'var(--text-secondary)',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {event.description}
                  </div>
                </div>
              )}

              {/* Event Details Card */}
              <div
                style={{
                  padding: '32px',
                  backgroundColor: '#fefcf3',
                  borderRadius: '16px',
                  border: '1px solid rgba(240, 180, 41, 0.2)',
                }}
              >
                <h3 style={{ fontSize: '20px', marginBottom: '24px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="pi pi-info-circle" style={{ color: 'var(--primary-gold-accent)' }} />
                  Event Details
                </h3>

                <div style={{ display: 'grid', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--primary-gold-accent)',
                        color: 'white',
                        flexShrink: 0,
                      }}
                    >
                      <i className="pi pi-calendar" style={{ fontSize: '18px' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Date</div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {event.day}, {event.displayDate || event.date}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--primary-gold-accent)',
                        color: 'white',
                        flexShrink: 0,
                      }}
                    >
                      <i className="pi pi-clock" style={{ fontSize: '18px' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Time</div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {event.time}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--primary-gold-accent)',
                        color: 'white',
                        flexShrink: 0,
                      }}
                    >
                      <i className="pi pi-map-marker" style={{ fontSize: '18px' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Location</div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {event.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <aside>
              {/* Actions Card */}
              <div
                style={{
                  padding: '24px',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  marginBottom: '24px',
                }}
              >
                <h3 style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--text-primary)' }}>
                  Actions
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    className="landing-btn landing-btn-primary"
                    style={{ justifyContent: 'center' }}
                    onClick={() => setShowJoinModal(true)}
                  >
                    <i className="pi pi-user-plus" />
                    Join Event
                  </button>
                  <button
                    className="landing-btn landing-btn-outline"
                    style={{ justifyContent: 'center' }}
                    onClick={() => setShowShareModal(true)}
                  >
                    <i className="pi pi-share-alt" />
                    Share Event
                  </button>
                </div>
              </div>

              {/* Other Events */}
              {otherEvents.length > 0 && (
                <div
                  style={{
                    padding: '24px',
                    background: 'linear-gradient(135deg, #fefcf3 0%, #fdf6e3 100%)',
                    borderRadius: '16px',
                    border: '1px solid rgba(240, 180, 41, 0.2)',
                  }}
                >
                  <h3 style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--text-primary)' }}>
                    Other Upcoming Events
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {otherEvents.map((e) => (
                      <Link
                        key={e.id}
                        href={`/events/${e.slug}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          backgroundColor: 'white',
                          borderRadius: '10px',
                          textDecoration: 'none',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        }}
                        onMouseEnter={(ev) => {
                          ev.currentTarget.style.transform = 'translateX(4px)';
                          ev.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                        }}
                        onMouseLeave={(ev) => {
                          ev.currentTarget.style.transform = 'translateX(0)';
                          ev.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: 'var(--primary-gold-accent)',
                            color: 'white',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            textAlign: 'center',
                            minWidth: '50px',
                          }}
                        >
                          <span style={{ display: 'block', fontSize: '16px', fontWeight: '700', lineHeight: '1' }}>
                            {(e.displayDate || e.date).split(' ')[1]}
                          </span>
                          <span style={{ display: 'block', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase' }}>
                            {(e.displayDate || e.date).split(' ')[0]}
                          </span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {e.title}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {e.time} | {e.location}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>

        <ScrollAnimationProvider>
          <ContactSection />
        </ScrollAnimationProvider>

        {/* Back to All Events */}
        <section
          style={{
            padding: '60px 0',
            backgroundColor: '#f8fafc',
            textAlign: 'center',
          }}
        >
          <div className="landing-container">
            <Link href="/events" className="landing-btn landing-btn-outline">
              <i className="pi pi-arrow-left" />
              Back to All Events
            </Link>
          </div>
        </section>
      </main>

      <LandingFooter />

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={event.title}
        excerpt={event.description || `Join us for ${event.title} at Gateway Church`}
      />

      <JoinEventModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        eventSlug={event.slug}
        eventTitle={event.title}
      />

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 900px) {
          .event-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
