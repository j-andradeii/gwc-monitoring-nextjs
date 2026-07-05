/**
 * Gateway Projects Page
 *
 * Dedicated page for Gateway Church's Ministry Center Improvement Project.
 * Inspired by Bethel Church's "Arise & Build" campaign design patterns.
 */

import type { Metadata } from 'next';

import '@/styles/landing.css';

import { siteMetadata } from '@/data/site-metadata';
import {
  LandingHeader,
  LandingFooter,
  PageHero,
  ProjectBanner,
} from '@/components/landing';

import {
  GatewayVisionSection,
  GatewayProjectsSection,
  GatewayTestimonialsSection,
  GatewayBuildingProgressSection,
  GatewayGiveSection,
  GatewayPledgeSection,
} from '@/components/landing/give';

const siteUrl = siteMetadata.siteUrl;

export const metadata: Metadata = {
  title: 'Gateway Projects | Gateway Church',
  description:
    'Support Gateway Church Ministry Center Improvement Project. Help us build a better facility for worship, ministry, and community impact.',
  keywords: [
    'Gateway Church',
    'Gateway Projects',
    'Ministry Center',
    'Church Building',
    'Donate',
    'Church Improvement',
    'Gotyme Bank',
  ],
  alternates: {
    canonical: `${siteUrl}/give/gateway-projects`,
  },
  openGraph: {
    title: 'Gateway Projects | Gateway Church',
    description:
      'Support Gateway Church Ministry Center Improvement Project. Help us build a better facility for worship, ministry, and community impact.',
    type: 'website',
    locale: 'en_US',
    siteName: siteMetadata.name,
    url: `${siteUrl}/give/gateway-projects`,
    images: [
      {
        url: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/community/1.jpg',
        width: 1200,
        height: 630,
        alt: 'Gateway Church Ministry Center Improvement Project',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gateway Projects | Gateway Church',
    description:
      'Support Gateway Church Ministry Center Improvement Project.',
    images: ['https://gtxngthtpisigkys.public.blob.vercel-storage.com/community/1.jpg'],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Give', item: `${siteUrl}/give/ways-to-give` },
    { '@type': 'ListItem', position: 3, name: 'Gateway Projects' },
  ],
};

export default function GatewayProjectsPage() {
  return (
    <div className="landing-page give-page gateway-projects-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <LandingHeader />

      <main className="landing-main">
        {/* Hero Section */}
        <PageHero
          id="gateway-projects-top"
          badge="Gateway Projects"
          title="Building for the Future"
          subtitle="Ministry Center Improvement Project"
          backgroundImage="https://gtxngthtpisigkys.public.blob.vercel-storage.com/community/1.jpg"
          className="give-hero gateway-projects-hero"
          serviceInfo={[
            { icon: 'pi pi-building', text: 'Ministry Center' },
            { icon: 'pi pi-users', text: 'Community Impact' },
          ]}
        />

        {/* Quick CTA: jumps straight to the Give section, right below */}
        <ProjectBanner
          badge='Sow'
          targetId="gateway-give"
          title="Build the future of Gateway with us"
          buttonLabel="Give to Gateway Projects"
          buttonAriaLabel="Jump to Give to Gateway Projects section"
          ariaLabel="Partner With Us"
        />

        {/* ===========================================
            GIVE TO GATEWAY PROJECTS — lead section
            Channels-first, mirroring the Ways to Give page: the
            giving channels are placed immediately after the banner
            so they're the first thing visitors reach. (White background)
            =========================================== */}
        <GatewayGiveSection />

        {/* Section 1: Pastor's Vision Narrative (Cream background) */}
        <GatewayVisionSection />

        {/* Section 2: Gateway Projects Overview (White background) */}
        <GatewayProjectsSection />

        {/* Section 3: Quick Facts / Project Specs (Navy background) */}
        {/* <GatewayQuickFactsSection /> */}

        {/* Section 4: Leader Testimonials (Cream background) */}

        {/* Section 5: Building Progress with Milestones (Dark/Navy background) */}
        <GatewayBuildingProgressSection />

        <GatewayTestimonialsSection />

        {/* Pledge Section (Grey background) */}
        <GatewayPledgeSection />
      </main>

      <LandingFooter />
    </div>
  );
}
