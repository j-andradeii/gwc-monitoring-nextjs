/**
 * Give Page
 *
 * Dedicated Give page for Gateway Church with Ways to Give and Arise & Build tabs
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';

import '@/styles/landing.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gatewaychurch.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Give | Gateway Church',
  description:
    'Support Gateway Church through your tithes and offerings. Learn about ways to give and contribute to the Arise & Build worship center improvement project.',
  keywords: [
    'Gateway Church',
    'Give',
    'Tithes',
    'Offerings',
    'Donate',
    'Arise and Build',
    'Church Giving',
    'GCash',
    'BPI',
    'BDO',
  ],
  alternates: {
    canonical: '/give',
  },
  openGraph: {
    title: 'Give | Gateway Church',
    description:
      'Support Gateway Church through your tithes and offerings. Your generosity makes an eternal difference.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Gateway Church',
    url: `${siteUrl}/give`,
   images: [
      {
        url: 'https://gwc-monitoring-nextjs.vercel.app/assets/images/fam-picture.jpg',
        width: 2048,
        height: 715,
        alt: 'Gateway Church Family',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Give | Gateway Church',
    description:
      'Support Gateway Church through your tithes and offerings. Your generosity makes an eternal difference.',
    images: ['/og-image.jpg'],
  },
};

import {
  LandingHeader,
  LandingFooter,
  ScrollAnimationProvider,
  ContactSection,
} from '@/components/landing';

import { GiveHero, GiveTabs } from '@/components/landing/give';

export default function GivePage() {
  return (
    <div className="landing-page give-page">
      <LandingHeader />

      <main className="landing-main">
        <ScrollAnimationProvider>
          <GiveHero />
          <Suspense fallback={<div className="loading-tabs">Loading...</div>}>
            <GiveTabs />
          </Suspense>
          <ContactSection />
        </ScrollAnimationProvider>
      </main>

      <LandingFooter />
    </div>
  );
}
