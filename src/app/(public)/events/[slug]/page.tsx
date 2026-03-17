/**
 * Event Detail Page
 *
 * Displays a single event with details
 */

import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { events, getEventBySlug } from '@/data/events';
import { siteMetadata } from '@/data/site-metadata';
import EventDetailClient from './EventDetailClient';

const siteUrl = siteMetadata.siteUrl;

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

  if (!event) {
    return {
      title: 'Event Not Found | Gateway Church',
      alternates: {
        canonical: `${siteUrl}/events`,
      },
    };
  }

  const eventUrl = `${siteUrl}/events/${event.slug}`;
  const imageUrl = event.image.startsWith('http') ? event.image : `${siteUrl}${event.image}`;

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
      siteName: siteMetadata.name,
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: imageUrl,
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
      images: [imageUrl],
    },
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    redirect('/events');
  }

  const otherEvents = events.filter(e => e.id !== event.id).slice(0, 3);

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

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Events', item: `${siteUrl}/events` },
      { '@type': 'ListItem', position: 3, name: event.title },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <EventDetailClient
        event={event}
        otherEvents={otherEvents}
      />
    </>
  );
}
