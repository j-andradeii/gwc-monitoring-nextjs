/**
 * Gateway Outreach Page
 *
 * Dedicated page for Gateway Church's Community Outreach Ministry.
 * The page leads with the everyday community work — vision, programs, impact,
 * gallery, giving — and keeps the "we come when disaster strikes" promise in
 * the copy (hero, vision, give, drop-off) rather than in a section of its own.
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
  OutreachProgramsSection,
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
  title: 'Gateway Outreach | Community Outreach Ministry | Gateway Church',
  description:
    'Gateway Church Cebu\'s community outreach ministry. We bring food, goods, prayer, and practical help to families across Cebu week after week — and we are ready to respond when disaster strikes.',
  keywords: [
    'Gateway Church',
    'Gateway Outreach',
    'Community Outreach',
    'Feeding Program',
    'Relief Goods',
    'Cebu Church',
    'Disaster Response',
    'Typhoon Relief',
    'Humanitarian Aid',
    'Christian Outreach Philippines',
  ],
  alternates: {
    canonical: `${siteUrl}/give/gateway-outreach`,
  },
  openGraph: {
    title: 'Gateway Outreach | Community Outreach Ministry | Gateway Church',
    description:
      'Gateway Church Cebu\'s community outreach ministry — serving families across Cebu week after week, and ready to respond when disaster strikes.',
    type: 'website',
    locale: 'en_US',
    siteName: siteMetadata.name,
    url: `${siteUrl}/give/gateway-outreach`,
    images: [
      {
        url: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/outreach/7.jpg',
        width: 1200,
        height: 630,
        alt: 'Gateway Outreach - Community Outreach Ministry',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gateway Outreach | Community Outreach Ministry | Gateway Church',
    description:
      'Gateway Church Cebu\'s community outreach ministry. Serving our communities — and ready when disaster strikes.',
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
 * Flip to `true` to show <OutreachReliefFundSection />. Leaving it `false`
 * adds a `relief-fund-hidden` class to the page root, which re-balances the
 * alternating section backgrounds so the white⇄cream rhythm holds in BOTH
 * states:
 *   • shown  → Vision(w) · Programs(c) · Relief(w) · Impact(c) · Gallery(w) · Give(navy) · Dropoff(c) · Testimonials(w)
 *   • hidden → Vision(w) · Programs(c) ·           Impact(w) · Gallery(c) · Give(navy) · Dropoff(c) · Testimonials(w)
 * Programs is always the cream band directly after Vision, so it is the SHOWN
 * state that carries the Relief/Impact/Gallery flip — those overrides live under
 * `.gateway-outreach-page:not(.relief-fund-hidden)` in `landing.css`.
 */
const SHOW_RELIEF_FUND = false;

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
          subtitle="Serving the communities around us week after week — and ready to move when disaster strikes"
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


        {/* Section 1: Pastor's Vision — the community calling (white band) */}
        <OutreachVisionSection />

        {/* Section 2: What We Do — ongoing community programs (cream band).
            This is the page's community-outreach anchor. */}
        <OutreachProgramsSection />

        {/* Section 3: Relief Fund — OPTIONAL fundraising band (cream when shown).
            Toggle via SHOW_RELIEF_FUND above; hiding it flips Impact→cream and
            Gallery→white through the `.relief-fund-hidden` class so the
            alternating backgrounds stay balanced. */}
        {SHOW_RELIEF_FUND && <OutreachReliefFundSection />}

        {/* Legacy disaster-initiatives grid — kept but not rendered; 4 of its 5
            images are missing from blob storage (see the note in outreachData.ts). */}
        {/* <OutreachInitiativesSection /> */}

        {/* Section 4: Impact Statistics */}
        <OutreachImpactSection />

        {/* Section 5: Gallery — Outreach in Action */}
        <OutreachGallerySection />

        {/* Section 6: Support Our Outreach — Giving Channels (navy anchor) */}
        <OutreachGiveSection />

        {/* Section 7: Drop Off Donations (cream band) */}
        <OutreachDonationDropoffSection />

        {/* Section 8: Community Testimonials (white band) */}
        <OutreachTestimonialsSection />


        <ContactSection />
      </main>

      <LandingFooter />
    </div>
  );
}
