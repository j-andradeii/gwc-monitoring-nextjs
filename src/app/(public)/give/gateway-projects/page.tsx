/**
 * Gateway Projects Page
 *
 * Dedicated page for Gateway Church's Ministry Center Improvement Project.
 * Inspired by Bethel Church's "Arise & Build" campaign design patterns.
 */

import type { Metadata } from 'next';

import '@/styles/landing.css';

import {
  LandingHeader,
  LandingFooter,
  ScrollAnimationProvider,
  ContactSection,
  PageHero,
} from '@/components/landing';

import {
  GatewaySectionNav,
  GatewayVisionSection,
  GatewayProjectsSection,
  GatewayQuickFactsSection,
  GatewayTestimonialsSection,
  GatewayBuildingProgressSection,
  GatewayGiveSection,
} from '@/components/landing/give';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://gatewaychurch.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
    canonical: '/give/gateway-projects',
  },
  openGraph: {
    title: 'Gateway Projects | Gateway Church',
    description:
      'Support Gateway Church Ministry Center Improvement Project. Help us build a better facility for worship, ministry, and community impact.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Gateway Church',
    url: `${siteUrl}/give/gateway-projects`,
    images: [
      {
        url: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/community/1.jpg',
        width: 2048,
        height: 715,
        alt: 'Gateway Church Family',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gateway Projects | Gateway Church',
    description:
      'Support Gateway Church Ministry Center Improvement Project.',
    images: ['/og-image.jpg'],
  },
};

export default function GatewayProjectsPage() {
  return (
    <div className="landing-page give-page gateway-projects-page">
      <LandingHeader />

      <main className="landing-main">
        <ScrollAnimationProvider>
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


          {/* Section 1: Pastor's Vision Narrative (Cream background) */}
          <GatewayVisionSection />

          {/* Section 2: Gateway Projects Overview (Cream background) */}
          <GatewayProjectsSection />

          {/* Section 3: Quick Facts / Project Specs (Navy background) */}
          {/* <GatewayQuickFactsSection /> */}

          {/* Section 4: Leader Testimonials (Cream background) */}

          {/* Section 5: Building Progress with Milestones (Dark/Navy background) */}
          <GatewayBuildingProgressSection />

          <GatewayTestimonialsSection />


          {/* Section 6: Give to Gateway Projects (Cream background) */}
          <GatewayGiveSection />

          {/* Contact Section */}
          <ContactSection />
        </ScrollAnimationProvider>
      </main>

      <LandingFooter />
    </div>
  );
}
