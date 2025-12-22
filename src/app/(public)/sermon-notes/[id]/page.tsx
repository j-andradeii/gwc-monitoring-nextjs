/**
 * Sermon Detail Page
 *
 * Displays a single sermon with video player, notes, and related content
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sermons, getSermonById, getRelatedSermons, getSermonsBySeries } from '@/data/sermons';
import SermonDetailClient from './SermonDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return sermons.map((sermon) => ({
    id: sermon.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const sermon = getSermonById(id);

  if (!sermon) {
    return {
      title: 'Sermon Not Found | Gateway Church',
    };
  }

  return {
    title: `${sermon.title} | Gateway Church Sermons`,
    description: sermon.excerpt,
    openGraph: {
      title: sermon.title,
      description: sermon.excerpt,
      images: [sermon.image],
      type: 'article',
    },
  };
}

export default async function SermonDetailPage({ params }: Props) {
  const { id } = await params;
  const sermon = getSermonById(id);

  if (!sermon) {
    notFound();
  }

  const relatedSermons = getRelatedSermons(id);
  const seriesSermons = getSermonsBySeries(sermon.series).filter(s => s.id !== id);

  return (
    <SermonDetailClient
      sermon={sermon}
      relatedSermons={relatedSermons}
      seriesSermons={seriesSermons}
    />
  );
}
