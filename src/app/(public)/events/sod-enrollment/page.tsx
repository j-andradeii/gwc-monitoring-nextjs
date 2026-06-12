/**
 * School of Destiny Enrollment Form Page
 *
 * Public page for enrolling in the School of Destiny discipleship program
 */

import { Metadata } from 'next';
import { siteMetadata } from '@/data/site-metadata';
import SodEnrollmentClient from './SodEnrollmentClient';

const siteUrl = siteMetadata.siteUrl;

export const metadata: Metadata = {
  title: 'School of Destiny Enrollment | Gateway Church',
  description: 'Enroll in School of Destiny at Gateway Church. A discipleship program to train and equip cell leaders and consolidators for the Great Commission.',
  keywords: ['School of Destiny', 'SOD', 'Gateway Church', 'discipleship', 'cell leader', 'consolidator', 'enrollment', 'Cebu City'],
  alternates: {
    canonical: `${siteUrl}/events/sod-enrollment`,
  },
  openGraph: {
    title: 'School of Destiny Enrollment | Gateway Church',
    description: 'Enroll in School of Destiny at Gateway Church. A discipleship program to train and equip cell leaders and consolidators.',
    url: `${siteUrl}/events/sod-enrollment`,
    siteName: siteMetadata.name,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'School of Destiny Enrollment - Gateway Church',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'School of Destiny Enrollment | Gateway Church',
    description: 'Enroll in School of Destiny at Gateway Church. A discipleship program to train and equip cell leaders and consolidators.',
    images: ['/og-image.jpg'],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Events', item: `${siteUrl}/events` },
    { '@type': 'ListItem', position: 3, name: 'School of Destiny Enrollment' },
  ],
};

export default function SodEnrollmentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <SodEnrollmentClient />
    </>
  );
}
