/**
 * Ways to Give Page
 *
 * Dedicated page for Gateway Church giving channels and information
 */

import type { Metadata } from 'next';

import '@/styles/landing.css';

import {
  LandingHeader,
  LandingFooter,
  ScrollAnimationProvider,
  ContactSection,
} from '@/components/landing';

import {
  GiveHero,
  GiveWhySection,
  GiveChannelsSection,
} from '@/components/landing/give';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gatewaychurch.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Ways to Give | Gateway Church',
  description:
    'Support Gateway Church through your tithes and offerings. Multiple giving channels available including GCash, BPI, and BDO.',
  keywords: [
    'Gateway Church',
    'Give',
    'Tithes',
    'Offerings',
    'Donate',
    'Church Giving',
    'GCash',
    'BPI',
    'BDO',
  ],
  alternates: {
    canonical: '/give/ways-to-give',
  },
  openGraph: {
    title: 'Ways to Give | Gateway Church',
    description:
      'Support Gateway Church through your tithes and offerings. Multiple giving channels available including GCash, BPI, and BDO.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Gateway Church',
    url: `${siteUrl}/give/ways-to-give`,
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
    title: 'Ways to Give | Gateway Church',
    description:
      'Support Gateway Church through your tithes and offerings.',
    images: ['/og-image.jpg'],
  },
};

export default function WaysToGivePage() {
  return (
    <div className="landing-page give-page ways-to-give-page">
      <LandingHeader />

      <main className="landing-main">
        <ScrollAnimationProvider>
          {/* Hero Section */}
          <GiveHero backgroundImage="https://gtxngthtpisigkys.public.blob.vercel-storage.com/give.jpg" />

          {/* Section 1: Why We Give (Cream background) */}
          <GiveWhySection />

          {/* Section 2: Giving Channels - GCash, BPI, BDO (White background) */}
          <GiveChannelsSection />

          {/* Contact Section */}
          <ContactSection />
        </ScrollAnimationProvider>
      </main>

      <LandingFooter />
    </div>
  );
}
