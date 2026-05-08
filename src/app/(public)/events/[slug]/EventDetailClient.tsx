'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LandingHeader, LandingFooter, EventContactSection, ScrollAnimationProvider, ShareModal, JoinEventModal, ContactSection } from '@/components/landing';
import { ProjectGallery } from '@/components/landing/give';
import { EventDetailHero } from '@/components/landing/events/EventDetailHero';
import { Event } from '@/data/events';
import { CONTACT_INFO } from '@/data/contact';
import '@/styles/landing.css';

interface Props {
  event: Event;
  otherEvents: Event[];
}

export default function EventDetailClient({ event, otherEvents }: Props) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const isGoldenPeak = event.location?.toLowerCase().includes('golden peak');
  return (
    <div className="landing-page">
      <LandingHeader />

      {/* Hero Section */}
      <EventDetailHero event={event} />

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
                  {/* Event Gallery */}
                  {event.gallery && event.gallery.length > 0 && (
                    <div style={{ marginBottom: '40px' }}>
                      <ProjectGallery
                        images={event.gallery.map((src, index) => ({
                          id: index + 1,
                          src,
                          alt: `${event.title} - Photo ${index + 1}`,
                          caption: `${event.title} - Photo ${index + 1}`,
                        }))}
                      />
                    </div>
                  )}

                  <h2 style={{ fontSize: '24px', marginBottom: '20px', color: 'var(--text-primary)' }}>
                    About This Event
                  </h2>


                  <div
                    style={{
                      fontSize: '18px',
                      lineHeight: '1.8',
                      color: 'var(--text-primary)',
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

                  {isGoldenPeak ? (
                    <a
                      href={CONTACT_INFO.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${event.location} in Google Maps`}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', textDecoration: 'none' }}
                    >
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
                    </a>
                  ) : (
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
                  )}
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
                    onClick={async () => {
                      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                      if (isMobile && typeof navigator !== 'undefined' && navigator.share) {
                        try {
                          await navigator.share({
                            title: event.title,
                            text: event.description || `Join us for ${event.title} at Gateway Church`,
                            url: window.location.href,
                          });
                        } catch (error) {
                          console.error('Error sharing:', error);
                        }
                      } else {
                        setShowShareModal(true);
                      }
                    }}
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
