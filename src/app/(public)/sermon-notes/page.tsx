/**
 * Sermon Notes Page
 *
 * Public page displaying sermon notes with landing page consistent design
 */

import '@/styles/landing.css';
import { Metadata } from 'next';
import { siteMetadata } from '@/data/site-metadata';
import SermonNotesClient from './SermonNotesClient';

const siteUrl = siteMetadata.siteUrl;

export const metadata: Metadata = {
  title: 'Sermon Notes | Gateway Church Cebu',
  description: "Dive deeper into God's Word with notes from our recent sermons. Use these resources for personal study, small group discussions, and spiritual growth.",
  keywords: [
    'sermon notes',
    'Gateway Church sermons',
    'Bible study',
    'church sermons Cebu',
    'spiritual growth',
    'Gateway Church Cebu',
  ],
  alternates: {
    canonical: `${siteUrl}/sermon-notes`,
  },
  openGraph: {
    title: 'Sermon Notes | Gateway Church Cebu',
    description: "Dive deeper into God's Word with notes from our recent sermons.",
    url: `${siteUrl}/sermon-notes`,
    siteName: siteMetadata.name,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/notes.jpg',
        width: 1200,
        height: 630,
        alt: 'Sermon Notes - Gateway Church Cebu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sermon Notes | Gateway Church Cebu',
    description: "Dive deeper into God's Word with notes from our recent sermons.",
    images: ['https://gtxngthtpisigkys.public.blob.vercel-storage.com/notes.jpg'],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Sermon Notes' },
  ],
};

export default function SermonNotesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <SermonNotesClient />
    </>
  );
}
