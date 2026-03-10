/**
 * Gateway Outreach Page
 *
 * Dedicated page for Gateway Church's Disaster Response Ministry.
 * Showcasing outreach initiatives, impact statistics, testimonials, and giving channels.
 */

import type { Metadata } from 'next';

import '@/styles/landing.css';

import { siteMetadata } from '@/data/site-metadata';
import {
  LandingHeader,
  LandingFooter,
  ScrollAnimationProvider,
  PageHero,
} from '@/components/landing';

import {
  OutreachVisionSection,
  OutreachInitiativesSection,
  OutreachImpactSection,
  OutreachGallerySection,
  OutreachTestimonialsSection,
  OutreachGiveSection,
} from '@/components/landing/outreach';

const siteUrl = siteMetadata.siteUrl;

export const metadata: Metadata = {
  title: 'Gateway Outreach | Disaster Response Ministry | Gateway Church',
  description:
    'Gateway Church Cebu\'s disaster response ministry. We bring hope in times of crisis through emergency relief, community recovery, and long-term care for affected families across Cebu and the Visayas.',
  keywords: [
    'Gateway Church',
    'Gateway Outreach',
    'Disaster Response',
    'Relief Operations',
    'Community Outreach',
    'Cebu Church',
    'Typhoon Relief',
    'Humanitarian Aid',
    'Christian Outreach Philippines',
  ],
  alternates: {
    canonical: `${siteUrl}/give/gateway-outreach`,
  },
  openGraph: {
    title: 'Gateway Outreach | Disaster Response Ministry | Gateway Church',
    description:
      'Gateway Church Cebu\'s disaster response ministry. We bring hope in times of crisis through emergency relief, community recovery, and long-term care for affected families.',
    type: 'website',
    locale: 'en_US',
    siteName: siteMetadata.name,
    url: `${siteUrl}/give/gateway-outreach`,
    images: [
      {
        url: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/outreach/1.jpg',
        width: 1200,
        height: 630,
        alt: 'Gateway Outreach - Disaster Response Ministry',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gateway Outreach | Disaster Response Ministry | Gateway Church',
    description:
      'Gateway Church Cebu\'s disaster response ministry. Bringing hope when disaster strikes.',
    images: ['https://gtxngthtpisigkys.public.blob.vercel-storage.com/outreach/1.jpg'],
  },
};

export default function GatewayOutreachPage() {
  return (
    <div className="landing-page give-page gateway-outreach-page">
      <LandingHeader />

      <main className="landing-main">
        <ScrollAnimationProvider>
          {/* Hero Section */}
          <PageHero
            id="gateway-outreach-top"
            badge="Gateway Outreach"
            title="Disaster Response Ministry"
            subtitle="Bringing Hope in Times of Crisis"
            backgroundImage="https://gtxngthtpisigkys.public.blob.vercel-storage.com/community/1.jpg"
            className="give-hero gateway-outreach-hero"
            serviceInfo={[
              { icon: 'pi pi-heart', text: 'Community Relief' },
              { icon: 'pi pi-users', text: 'Disaster Response' },
            ]}
          />

          {/* Section 1: Pastor's Vision for Disaster Response */}
          <OutreachVisionSection />

          {/* Section 2: Our Disaster Response Initiatives */}
          <OutreachInitiativesSection />

          {/* Section 3: Impact Statistics (Navy background) */}
          <OutreachImpactSection />

          {/* Section 4: Gallery — Outreach in Action */}
          <OutreachGallerySection />

          {/* Section 5: Community Testimonials */}
          <OutreachTestimonialsSection />

          {/* Section 6: Support Our Outreach — Giving Channels */}
          <OutreachGiveSection />
        </ScrollAnimationProvider>
      </main>

      <LandingFooter />
    </div>
  );
}
