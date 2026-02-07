/**
 * Sermon Detail Page
 *
 * Displays a single sermon with video player, notes, and related content
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sermons, getSermonBySlug, getRelatedSermons, getSermonsBySeries } from '@/data/sermons';
import SermonDetailClient from './SermonDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return sermons.map((sermon) => ({
    slug: sermon.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sermon = getSermonBySlug(slug);

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
    twitter: {
      card: 'summary_large_image',
      title: sermon.title,
      description: sermon.excerpt,
      images: [sermon.image],
    },
  };
}

export default async function SermonDetailPage({ params }: Props) {
  const { slug } = await params;
  const sermon = getSermonBySlug(slug);

  if (!sermon) {
    notFound();
  }

  const relatedSermons = getRelatedSermons(sermon.id);
  const seriesSermons = getSermonsBySeries(sermon.series).filter(s => s.id !== sermon.id);

  return (
    <SermonDetailClient
      sermon={sermon}
      relatedSermons={relatedSermons}
      seriesSermons={seriesSermons}
    />
  );
}
