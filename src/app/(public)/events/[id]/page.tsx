/**
 * Event Detail Page
 *
 * Displays a single event with details
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { events, getEventById } from '@/data/events';
import EventDetailClient from './EventDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return events.map((event) => ({
    id: event.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = getEventById(id);

  if (!event) {
    return {
      title: 'Event Not Found | Gateway Church',
    };
  }

  return {
    title: `${event.title} | Gateway Church Events`,
    description: event.description || `Join us for ${event.title} at Gateway Church`,
    openGraph: {
      title: event.title,
      description: event.description || `Join us for ${event.title} at Gateway Church`,
      images: [event.image],
      type: 'article',
    },
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const event = getEventById(id);

  if (!event) {
    notFound();
  }

  const otherEvents = events.filter(e => e.id !== id).slice(0, 3);

  return (
    <EventDetailClient
      event={event}
      otherEvents={otherEvents}
    />
  );
}
