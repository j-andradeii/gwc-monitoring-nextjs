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
  OutreachInitiativesSection,
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

/**
 * Toggle for the OPTIONAL Relief Fund fundraising section.
 *
 * Flip to `false` to hide <OutreachReliefFundSection />. Doing so also adds a
 * `relief-fund-hidden` class to the page root, which re-balances the
 * alternating section backgrounds so the white⇄cream rhythm stays intact in
 * BOTH states:
 *   • shown  → Vision(w) · Relief(c) · Impact(w) · Gallery(c) · Give(navy) · …
 *   • hidden → Vision(w) ·            Impact(c) · Gallery(w) · Give(navy) · …
 * The Impact↔Gallery band swap lives in the `.relief-fund-hidden` overrides in
 * `landing.css` (page-scoped band block). No other section needs to change.
 */
const SHOW_RELIEF_FUND = true;

export default function GatewayOutreachPage() {
  return (
    <div
      className={`landing-page give-page gateway-outreach-page${
        SHOW_RELIEF_FUND ? '' : ' relief-fund-hidden'
      }`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <LandingHeader />

      <main className="landing-main gateway-outreach-main">
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
        

        {/* Section 1: Pastor's Vision for Disaster Response (white band) */}
        <OutreachVisionSection />

        {/* Section 2: Relief Fund — OPTIONAL fundraising band (cream when shown).
            Toggle via SHOW_RELIEF_FUND above; hiding it flips Impact→cream and
            Gallery→white through the `.relief-fund-hidden` class so the
            alternating backgrounds stay balanced. */}
        {SHOW_RELIEF_FUND && <OutreachReliefFundSection />}

        {/* Our Disaster Response Initiatives (built, intentionally disabled) */}
        {/* <OutreachInitiativesSection /> */}

        {/* Section 3: Impact Statistics (white band, light stat cards) */}
        <OutreachImpactSection />

        {/* Section 4: Gallery — Outreach in Action (cream band) */}
        <OutreachGallerySection />

        {/* Section 5: Support Our Outreach — Giving Channels (navy anchor) */}
        <OutreachGiveSection />

        {/* Section 6: Drop Off Donations (cream band) */}
        <OutreachDonationDropoffSection />

        {/* Section 7: Community Testimonials (white band) */}
        <OutreachTestimonialsSection />


        <ContactSection />
      </main>

      <LandingFooter />
    </div>
  );
}
