import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Event } from '@/data/events';
import { CONTACT_INFO } from '@/data/contact';

interface Props {
  event: Event;
  onJoinEvent: () => void;
  onShareEvent: () => void;
}

export function EventDetailHero({ event, onJoinEvent, onShareEvent }: Props) {
  const isGoldenPeak = event.location?.toLowerCase().includes('golden peak');
  const dateLabel = event.displayDate || event.date;
  const [dateMonth = '', dateDay = ''] = dateLabel.replace(',', '').split(' ');
  const intro = event.description
    ?.split('\n')
    .map((line) => line.trim())
    .find(Boolean);

  return (
    <section className="event-detail-hero">
      <div className="landing-container">
        <nav className="event-detail-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="sep" aria-hidden="true">/</span>
          <Link href="/events">Events</Link>
          <span className="sep" aria-hidden="true">/</span>
          <span className="current" aria-current="page">{event.title}</span>
        </nav>

        <div className="event-detail-hero__layout">
          <div className="event-detail-hero__copy">
            {event.category && <div className="event-detail-hero__eyebrow">{event.category}</div>}
            <h1 className="event-detail-hero__title">{event.title}</h1>
            {intro && <p className="event-detail-hero__deck">{intro}</p>}



            <div className="event-detail-hero__meta" aria-label="Event summary">
              <div className="event-detail-hero__meta-item">
                <i className="pi pi-calendar" aria-hidden="true" />
                <span><strong>{event.day}, {dateLabel}</strong>Date</span>
              </div>
              <div className="event-detail-hero__meta-item">
                <i className="pi pi-clock" aria-hidden="true" />
                <span><strong>{event.time}</strong>Time</span>
              </div>
              {isGoldenPeak ? (
                <a
                  className="event-detail-hero__meta-item"
                  href={CONTACT_INFO.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${event.location} in Google Maps`}
                >
                  <i className="pi pi-map-marker" aria-hidden="true" />
                  <span><strong>{event.location}</strong>Location</span>
                </a>
              ) : (
                <div className="event-detail-hero__meta-item">
                  <i className="pi pi-map-marker" aria-hidden="true" />
                  <span><strong>{event.location}</strong>Location</span>
                </div>
              )}
            </div>

            <div className="event-detail-hero__actions" aria-label="Event actions">
              <button type="button" className="landing-btn landing-btn-primary event-detail-hero__action" onClick={onJoinEvent}>
                <i className="pi pi-user-plus" aria-hidden="true" />
                Join Event
              </button>
              <button type="button" className="landing-btn landing-btn-outline event-detail-hero__action" onClick={onShareEvent}>
                <i className="pi pi-share-alt" aria-hidden="true" />
                Share
              </button>
            </div>
          </div>

          <figure className="event-detail-hero__artwork">
            <Image
              src={event.image}
              alt={event.title}
              fill
              sizes="(max-width: 1023px) 100vw, 48vw"
              className="event-detail-hero__artwork-img"
              priority
            />
            <figcaption className="event-detail-hero__date" aria-label={dateLabel}>
              <span>{dateDay}</span>
              <strong>{dateMonth}</strong>
            </figcaption>
            {isGoldenPeak ? (
              <a
                className="event-detail-hero__map-link"
                href={CONTACT_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${event.location} in Google Maps`}
              >
                <i className="pi pi-map-marker" aria-hidden="true" />
                View map
              </a>
            ) : null}
          </figure>
        </div>
      </div>
    </section>
  );
}
