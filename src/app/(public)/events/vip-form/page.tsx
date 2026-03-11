/**
 * VIP Registration Form Page
 *
 * Public page for new visitors to register their details
 */

import { Metadata } from 'next';
import { siteMetadata } from '@/data/site-metadata';
import VipFormClient from './VipFormClient';

const siteUrl = siteMetadata.siteUrl;

export const metadata: Metadata = {
  title: 'VIP Registration | Gateway Church',
  description: 'Welcome to Gateway Church! Please register your details so we can connect with you.',
  keywords: ['VIP registration', 'Gateway Church', 'church registration', 'first time visitor', 'newcomer', 'Cebu City'],
  alternates: {
    canonical: `${siteUrl}/events/vip-form`,
  },
  openGraph: {
    title: 'VIP Registration | Gateway Church',
    description: 'Welcome to Gateway Church! Please register your details so we can connect with you.',
    url: `${siteUrl}/events/vip-form`,
    siteName: siteMetadata.name,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VIP Registration - Gateway Church',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VIP Registration | Gateway Church',
    description: 'Welcome to Gateway Church! Please register your details so we can connect with you.',
    images: ['/og-image.jpg'],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Events', item: `${siteUrl}/events` },
    { '@type': 'ListItem', position: 3, name: 'VIP Registration' },
  ],
};

export default function VipFormPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <VipFormClient />
    </>
  );
}
