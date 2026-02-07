/**
 * Event Detail Page
 *
 * Displays a single event with details
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { events, getEventBySlug } from '@/data/events';
import { config } from '@/core/config';
import EventDetailClient from './EventDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return events.map((event) => ({
    slug: event.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  const siteUrl = config.app.url;

  if (!event) {
    return {
      title: 'Event Not Found | Gateway Church',
      alternates: {
        canonical: `${siteUrl}/events`,
      },
    };
  }

  const eventUrl = `${siteUrl}/events/${event.slug}`;

  return {
    title: `${event.title} | Gateway Church Events`,
    description: event.description ? event.description.substring(0, 160) : `Join us for ${event.title} at Gateway Church`,
    alternates: {
      canonical: eventUrl,
    },
    openGraph: {
      title: event.title,
      description: event.description || `Join us for ${event.title} at Gateway Church`,
      url: eventUrl,
      siteName: 'Gateway Church Cebu',
      locale: 'en_PH',
      type: 'website',
      images: [
        {
          url: event.image.startsWith('http') ? event.image : `${siteUrl}${event.image}`,
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description: event.description ? event.description.substring(0, 160) : `Join us for ${event.title} at Gateway Church`,
      images: [event.image.startsWith('http') ? event.image : `${siteUrl}${event.image}`],
    },
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const otherEvents = events.filter(e => e.id !== event.id).slice(0, 3);
  const siteUrl = config.app.url;

  // Create JSON-LD structured data for the event
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: new Date(`${event.date} ${event.time}`).toISOString(),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.location,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Gorordo Ave. cor. Escario St.',
        addressLocality: 'Cebu City',
        postalCode: '6000',
        addressRegion: 'Cebu',
        addressCountry: 'PH'
      }
    },
    image: [event.image.startsWith('http') ? event.image : `${siteUrl}${event.image}`],
    description: event.description,
    organizer: {
      '@type': 'Organization',
      name: 'Gateway Church Cebu',
      url: siteUrl
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EventDetailClient
        event={event}
        otherEvents={otherEvents}
      />
    </>
  );
}
