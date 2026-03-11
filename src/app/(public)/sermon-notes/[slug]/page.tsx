/**
 * Sermon Detail Page
 *
 * Displays a single sermon with video player, notes, and related content
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sermons, getSermonBySlug, getRelatedSermons, getSermonsBySeries } from '@/data/sermons';
import { events, isEventUpcoming } from '@/data/events';
import { siteMetadata } from '@/data/site-metadata';
import SermonDetailClient from './SermonDetailClient';

const siteUrl = siteMetadata.siteUrl;

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
      alternates: {
        canonical: `${siteUrl}/sermon-notes`,
      },
    };
  }

  const sermonUrl = `${siteUrl}/sermon-notes/${sermon.slug}`;
  const imageUrl = sermon.image.startsWith('http') ? sermon.image : `${siteUrl}${sermon.image}`;

  return {
    title: `${sermon.title} | Gateway Church Sermons`,
    description: sermon.excerpt,
    alternates: {
      canonical: sermonUrl,
    },
    openGraph: {
      title: sermon.title,
      description: sermon.excerpt,
      url: sermonUrl,
      siteName: siteMetadata.name,
      locale: 'en_US',
      type: 'article',
      authors: [sermon.speaker],
      publishedTime: new Date(sermon.date).toISOString(),
      tags: sermon.tags.length > 0 ? sermon.tags : [sermon.series, 'sermon', 'Gateway Church'],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: sermon.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: sermon.title,
      description: sermon.excerpt,
      images: [imageUrl],
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
  const upcomingEvents = events.filter(isEventUpcoming).slice(0, 3);

  const sermonJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Sermon Notes', item: `${siteUrl}/sermon-notes` },
          { '@type': 'ListItem', position: 3, name: sermon.title },
        ],
      },
      ...(sermon.videoUrl
        ? [
            {
              '@type': 'VideoObject',
              name: sermon.title,
              description: sermon.excerpt || `Sermon by ${sermon.speaker} at Gateway Church Cebu`,
              uploadDate: new Date(sermon.date).toISOString(),
              thumbnailUrl: sermon.image.startsWith('http') ? sermon.image : `${siteUrl}${sermon.image}`,
              contentUrl: sermon.videoUrl,
              author: { '@type': 'Person', name: sermon.speaker },
              publisher: {
                '@type': 'Organization',
                name: 'Gateway Church Cebu',
                url: siteUrl,
                logo: { '@type': 'ImageObject', url: `${siteUrl}/assets/images/gwc-logo-gold.png` },
              },
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sermonJsonLd) }}
      />
      <SermonDetailClient
        sermon={sermon}
        relatedSermons={relatedSermons}
        seriesSermons={seriesSermons}
        upcomingEvents={upcomingEvents}
      />
    </>
  );
}
