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

export default function VipFormPage() {
  return <VipFormClient />;
}
