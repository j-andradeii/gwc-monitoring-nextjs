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
  PageHero,
  ContactSection,
  ProjectBanner,
} from '@/components/landing';

import {
  OutreachVisionSection,
  OutreachImpactSection,
  OutreachGallerySection,
  OutreachTestimonialsSection,
  OutreachReliefFundSection,
  OutreachGiveSection,
  OutreachDonationDropoffSection,
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
        url: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/outreach/7.jpg',
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
    images: ['https://gtxngthtpisigkys.public.blob.vercel-storage.com/outreach/7.jpg'],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Give', item: `${siteUrl}/give/ways-to-give` },
    { '@type': 'ListItem', position: 3, name: 'Gateway Outreach' },
  ],
};

export default function GatewayOutreachPage() {
  return (
    <div className="landing-page give-page gateway-outreach-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <LandingHeader />

      <main className="landing-main">
        {/* Hero Section */}
        <PageHero
          id="gateway-outreach-top"
          badge="Gateway Outreach"
          title="Community Outreach Ministry"
          subtitle="Relief, recovery, and lasting hope for families in crisis"
          backgroundImage="https://gtxngthtpisigkys.public.blob.vercel-storage.com/outreach/team.jpg"
          className="give-hero gateway-outreach-hero"
          // serviceInfo={[
          //   { icon: 'pi pi-heart', text: 'Community Relief' },
          //   { icon: 'pi pi-users', text: 'Disaster Response' },
          // ]}
        />

        <ProjectBanner
          badge='Support'
          targetId="outreach-give"
          title="Help us in reaching more communities in need"
          buttonLabel="Partner with Us"
          buttonAriaLabel="Jump to Give to Gateway Projects section"
          ariaLabel="Partner with Us"
        />
        

        {/* Section 1: Pastor's Vision for Disaster Response */}
        <OutreachVisionSection />

        {/* Section 2: Our Disaster Response Initiatives */}
        {/* <OutreachInitiativesSection /> */}

        {/* Section 3: Impact Statistics (Navy background) */}
        <OutreachImpactSection />

        {/* Section 4: Gallery — Outreach in Action */}
        <OutreachGallerySection />

        {/* Section 5: Community Testimonials */}
        <OutreachTestimonialsSection />

        {/* Section 6: Relief Fund — fundraising goal + items to buy */}
        <OutreachReliefFundSection />

        {/* Section 7: Support Our Outreach — Giving Channels */}
        <OutreachGiveSection />

        {/* Section 7: Drop Off Donations */}
        <OutreachDonationDropoffSection />

        <ContactSection />
      </main>

      <LandingFooter />
    </div>
  );
}
