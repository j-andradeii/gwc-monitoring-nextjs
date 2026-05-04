/**
 * Events Page
 *
 * Public page displaying upcoming events with landing page consistent design
 */

import type { Metadata } from 'next';

import '@/styles/landing.css';
import { siteMetadata } from '@/data/site-metadata';
import { LandingHeader, LandingFooter, EventsCardGrid, FeaturedEventCard, PageHero, ConnectFab } from '@/components/landing';
import { MonthlyCalendar } from '@/components/events/MonthlyCalendar';
import { events, getFeaturedEvent } from '@/data/events';
import { EventsShareButton } from './EventsShareButton';

const siteUrl = siteMetadata.siteUrl;
const CALENDAR_IMAGE_URL = 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/events/calendar.webp';

export const metadata: Metadata = {
  title: 'Events | Gateway Church',
  description:
    'Connect, grow, and celebrate with our church community. Find upcoming events, gatherings, and fellowship opportunities at Gateway Church.',
  keywords: [
    'Gateway Church events',
    'church events Cebu',
    'Christian events',
    'church gatherings',
    'fellowship',
    'community events',
    'worship events',
    'Gateway Church Cebu',
  ],
  alternates: {
    canonical: `${siteUrl}/events`,
  },
  openGraph: {
    title: 'Events | Gateway Church',
    description:
      'Connect, grow, and celebrate with our church community. Find upcoming events and fellowship opportunities.',
    type: 'website',
    locale: 'en_US',
    siteName: siteMetadata.name,
    url: `${siteUrl}/events`,
    images: [
      {
        url: CALENDAR_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: 'Gateway Church Monthly Calendar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Events | Gateway Church',
    description:
      'Connect, grow, and celebrate with our church community. Find upcoming events and fellowship opportunities.',
    images: [CALENDAR_IMAGE_URL],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Events' },
  ],
};

export default function EventsPage() {
  const featuredEvent = getFeaturedEvent();
  const regularEvents = events
    .filter((e) => !e.isFeatured && !e.is_event_finished)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="landing-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <LandingHeader />

      <PageHero
        id="events-top"
        badge="Join Us"
        title="Upcoming Events"
        subtitle="Connect, grow, and celebrate with our church community. Find an event that's right for you and experience the joy of fellowship."
        backgroundImage="/assets/images/community.jpg"
        className="events-hero"
      />

      <MonthlyCalendar imageSrc={CALENDAR_IMAGE_URL} />

      {/* Main Content */}
      <main className="landing-main" style={{ paddingTop: 0 }}>
        {/* Featured Event */}
        {featuredEvent && <FeaturedEventCard event={featuredEvent} />}

        {/* Events Grid */}
        <section className="events-grid-section">
          <div className="landing-container">
            <div
              className="section-header-center"
              style={{
                textAlign: 'left',
                marginBottom: '32px',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <span className="section-label">All Events</span>
                <h2>Upcoming Gatherings</h2>
              </div>
              <EventsShareButton />
            </div>
            <EventsCardGrid events={regularEvents} showDescription={true} showAll={true} limit={0} />
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
