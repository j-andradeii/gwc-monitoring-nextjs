/**
 * Life Class Enrollment Form Page
 *
 * Public page for enrolling in Life Class, the entry-point discipleship class
 */

import { Metadata } from 'next';
import { siteMetadata } from '@/data/site-metadata';
import LifeclassEnrollmentClient from './LifeclassEnrollmentClient';

const siteUrl = siteMetadata.siteUrl;

const ogImage = 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/events/LIFECLASS-ENROLLMENT.webp';

export const metadata: Metadata = {
  title: 'Life Class Enrollment | Gateway Church',
  description:
    'Enroll in Life Class at Gateway Church. The entry-point discipleship class that grounds you in the faith and connects you to a church family.',
  keywords: ['Life Class', 'Lifeclass', 'Gateway Church', 'discipleship', 'new believer', 'enrollment', 'Cebu City'],
  alternates: {
    canonical: `${siteUrl}/events/lifeclass-enrollment`,
  },
  openGraph: {
    title: 'Life Class Enrollment | Gateway Church',
    description:
      'Enroll in Life Class at Gateway Church. The entry-point discipleship class that grounds you in the faith and connects you to a church family.',
    url: `${siteUrl}/events/lifeclass-enrollment`,
    siteName: siteMetadata.name,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: ogImage,
        // The file's real size — social cards scale it themselves, but a wrong
        // hint makes some of them reserve the wrong box and letterbox the card.
        width: 1920,
        height: 1080,
        alt: 'Life Class Enrollment - Gateway Church',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Life Class Enrollment | Gateway Church',
    description:
      'Enroll in Life Class at Gateway Church. The entry-point discipleship class that grounds you in the faith and connects you to a church family.',
    images: [ogImage],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Events', item: `${siteUrl}/events` },
    { '@type': 'ListItem', position: 3, name: 'Life Class Enrollment' },
  ],
};

export default function LifeclassEnrollmentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <LifeclassEnrollmentClient />
    </>
  );
}
