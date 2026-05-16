/**
 * Ways to Give Page
 *
 * Dedicated page for Gateway Church giving channels and information
 */

import type { Metadata } from 'next';

import '@/styles/landing.css';

import { siteMetadata } from '@/data/site-metadata';
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
  GiveQuickCTA,
} from '@/components/landing/give';

const siteUrl = siteMetadata.siteUrl;

export const metadata: Metadata = {
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
    canonical: `${siteUrl}/give/ways-to-give`,
  },
  openGraph: {
    title: 'Ways to Give | Gateway Church',
    description:
      'Support Gateway Church through your tithes and offerings. Multiple giving channels available including GCash, BPI, and BDO.',
    type: 'website',
    locale: 'en_US',
    siteName: siteMetadata.name,
    url: `${siteUrl}/give/ways-to-give`,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ways to Give - Gateway Church',
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

const giveFaqJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Give', item: `${siteUrl}/give/ways-to-give` },
        { '@type': 'ListItem', position: 3, name: 'Ways to Give' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How can I give to Gateway Church Cebu online?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can give to Gateway Church Cebu through GCash (0928-252-4463, account name: Gateway Church Cebu), bank transfer via BPI (account number: 0206007186, account name: Anna Marie Baloran) or BDO (account number: 002428024627, account name: Anna Marie Baloran/Jimanuel Baloran), or during our Sunday services.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does Gateway Church Cebu accept online donations?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, Gateway Church Cebu accepts online donations through GCash (0928-252-4463) and bank transfers via BPI (0206007186) and BDO (002428024627). You can give anytime from anywhere.',
          },
        },
        {
          '@type': 'Question',
          name: 'What are the giving channels at Gateway Church Cebu?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Gateway Church Cebu offers multiple giving channels: GCash mobile payment (0928-252-4463, Gateway Church Cebu), BPI bank transfer (account number: 0206007186, Anna Marie Baloran), BDO bank transfer (account number: 002428024627, Anna Marie Baloran/Jimanuel Baloran), and in-person giving during Sunday services.',
          },
        },
      ],
    },
  ],
};

export default function WaysToGivePage() {
  return (
    <div className="landing-page give-page ways-to-give-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(giveFaqJsonLd) }}
      />
      <LandingHeader />

      <main className="landing-main">
        <ScrollAnimationProvider>
          {/* Hero Section */}
          <GiveHero backgroundImage="https://gtxngthtpisigkys.public.blob.vercel-storage.com/give.jpg" />

          {/* Project banner CTA */}
          <GiveQuickCTA
            targetId="give-channels"
            buttonLabel="View Giving Channels"
            buttonAriaLabel="Jump to Giving Channels section"
          />

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
