/**
 * About Page
 *
 * Dedicated About page for Gateway Church
 */

import type { Metadata } from 'next';

import '@/styles/landing.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gatewaychurch.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'About Us | Gateway Church',
  description:
    'Learn about Gateway Church - our vision, mission, values, and what we believe. We are a vibrant, multicultural community dedicated to sharing the love of Christ.',
  keywords: [
    'Gateway Church',
    'About Gateway Church',
    'church vision',
    'church mission',
    'church values',
    'what we believe',
    'statement of faith',
    'Cebu church',
  ],
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Us | Gateway Church',
    description:
      'Learn about Gateway Church - our vision, mission, values, and what we believe.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Gateway Church',
    url: `${siteUrl}/about`,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Gateway Church - About Us',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Gateway Church',
    description:
      'Learn about Gateway Church - our vision, mission, values, and what we believe.',
    images: ['/og-image.jpg'],
  },
};

import {
  LandingHeader,
  LandingFooter,
  ScrollAnimationProvider,
  ContactSection,
} from '@/components/landing';

import {
  AboutHero,
  OurStory,
  VisionMission,
  OurValues,
  AboutSideNav,
} from '@/components/landing/about';

export default function AboutPage() {
  return (
    <div className="landing-page about-page">
      <LandingHeader />

      <main className="landing-main">
        <AboutSideNav />
        <ScrollAnimationProvider>
          <AboutHero />
          <OurStory />
          <VisionMission />
          <OurValues />
          <ContactSection />
        </ScrollAnimationProvider>
      </main>

      <LandingFooter />
    </div>
  );
}
