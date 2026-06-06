'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LandingHeader, LandingFooter, ScrollAnimationProvider, ShareModal, JoinEventModal, ContactSection } from '@/components/landing';
import { ProjectGallery } from '@/components/landing/give';
import { EventDetailHero } from '@/components/landing/events/EventDetailHero';
import { Event } from '@/data/events';
import { CONTACT_INFO } from '@/data/contact';
import '@/styles/landing.css';

interface LatestSermon {
  slug: string;
  title: string;
  speaker: string;
  date: string;
  image: string;
  duration: string;
}

interface Props {
  event: Event;
  otherEvents: Event[];
  latestSermons: LatestSermon[];
}

interface DetailItemProps {
  icon: string;
  label: string;
  value: string;
  href?: string;
}

function getDateParts(event: Event) {
  const dateLabel = event.displayDate || event.date;
  const [month = '', day = ''] = dateLabel.replace(',', '').split(' ');

  return {
    dateLabel,
    month,
    day,
  };
}

function DetailItem({ icon, label, value, href }: DetailItemProps) {
  const content = (
    <>
      <i className={`pi ${icon}`} aria-hidden="true" />
      <span>
        <strong>{label}</strong>
        {value}
      </span>
    </>
  );

  if (href) {
    return (
      <a className="event-detail-info-row" href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <div className="event-detail-info-row">{content}</div>;
}

function formatSermonDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function EventDetailClient({ event, otherEvents, latestSermons }: Props) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const isGoldenPeak = event.location?.toLowerCase().includes('golden peak');
  const descriptionParagraphs = event.description
    ?.split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description || `Join us for ${event.title} at Gateway Church`,
          url: window.location.href,
        });
        return;
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }

    setShowShareModal(true);
  };

  return (
    <div className="landing-page event-detail-page">
      <LandingHeader />

      <EventDetailHero
        event={event}
        onJoinEvent={() => setShowJoinModal(true)}
        onShareEvent={handleShare}
      />

      <main className="event-detail-main">
        <section className="event-detail-content-section">
          <div className="landing-container event-detail-layout">
            <article className="event-detail-article">
              {descriptionParagraphs && descriptionParagraphs.length > 0 && (
                <section className="event-detail-section">
                  <span className="event-detail-section-label">About this event</span>
                  <h2>{event.title}</h2>
                  <div className="event-detail-prose">
                    {descriptionParagraphs.map((paragraph, index) => (
                      <p key={`${event.slug}-description-${index}`}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              )}

              {event.gallery && event.gallery.length > 0 && (
                <section className="event-detail-section">
                  <span className="event-detail-section-label">Moments</span>
                  <h2>Photos from the gathering</h2>
                  <div className="event-detail-gallery">
                    <ProjectGallery
                      images={event.gallery.map((src, index) => ({
                        id: index + 1,
                        src,
                        alt: `${event.title} - Photo ${index + 1}`,
                        caption: `${event.title} - Photo ${index + 1}`,
                      }))}
                    />
                  </div>
                </section>
              )}
            </article>

            <aside className="event-detail-aside" aria-label="Event details">
              <div className="event-detail-panel">
                <h2>Event details</h2>
                <div className="event-detail-info-list">
                  <DetailItem icon="pi-calendar" label="Date" value={`${event.day}, ${event.displayDate || event.date}`} />
                  <DetailItem icon="pi-clock" label="Time" value={event.time} />
                  <DetailItem
                    icon="pi-map-marker"
                    label="Location"
                    value={event.location}
                    href={isGoldenPeak ? CONTACT_INFO.mapsUrl : undefined}
                  />
                </div>
              </div>

              {latestSermons.length > 0 && (
                <div className="event-detail-sermons-panel">
                  <div className="event-detail-sermons-header">
                    <h2>Latest Sermons</h2>
                    <Link href="/sermon-notes" className="event-detail-sermons-view-all">
                      View all <i className="pi pi-arrow-right" aria-hidden="true" />
                    </Link>
                  </div>
                  <div className="event-detail-sermons-list">
                    {latestSermons.map((sermon, index) => (
                      <React.Fragment key={sermon.slug}>
                        {index > 0 && <div className="event-detail-sermons-divider" />}
                        <Link
                          href={`/sermon-notes/${sermon.slug}`}
                          className="event-detail-sermon-link"
                          aria-label={`${sermon.title} — ${sermon.speaker}`}
                        >
                          <div className="event-detail-sermon-thumb">
                            <Image
                              src={sermon.image}
                              alt={sermon.title}
                              fill
                              sizes="68px"
                              unoptimized
                              style={{ objectFit: 'cover' }}
                            />
                          </div>
                          <div className="event-detail-sermon-body">
                            <span className="event-detail-sermon-title">{sermon.title}</span>
                            <span className="event-detail-sermon-meta">{formatSermonDate(sermon.date)}</span>
                          </div>
                        </Link>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </section>

        {otherEvents.length > 0 && (
          <section className="event-detail-related-section">
            <div className="landing-container">
              <div className="event-detail-related-header">
                <span className="event-detail-section-label">More gatherings</span>
                <h2>Upcoming at Gateway</h2>
              </div>

              <div className="event-detail-related-grid">
                {otherEvents.map((relatedEvent) => {
                  const { month, day, dateLabel } = getDateParts(relatedEvent);

                  return (
                    <Link
                      key={relatedEvent.id}
                      href={`/events/${relatedEvent.slug}`}
                      className="event-detail-related-card"
                    >
                      <span className="event-detail-related-date" aria-hidden="true">
                        <strong>{day}</strong>
                        {month}
                      </span>
                      <span className="event-detail-related-body">
                        <strong>{relatedEvent.title}</strong>
                        <span>{relatedEvent.day}, {dateLabel}</span>
                        <span>{relatedEvent.time}</span>
                      </span>
                      <i className="pi pi-arrow-right" aria-hidden="true" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <ScrollAnimationProvider>
          <ContactSection />
        </ScrollAnimationProvider>

        <section className="event-detail-back-section">
          <div className="landing-container">
            <Link href="/events" className="event-detail-back-link">
              <i className="pi pi-arrow-left" aria-hidden="true" />
              Back to all events
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
    </div>
  );
}
