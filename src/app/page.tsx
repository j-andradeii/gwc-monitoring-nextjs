/**
 * Landing Page
 *
 * Public landing page for Gateway Church (Server Component)
 */

import type { Metadata } from 'next';

import '@/styles/landing.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gatewaychurch.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Gateway Church | Welcome Home',
  description:
    'Gateway Church is a welcoming community of faith. Join us for worship services, ministries, and events. Experience love, hope, and belonging.',
  keywords: [
    'Gateway Church',
    'Gateway Church Cebu',
    'church',
    'worship',
    'community',
    'faith',
    'ministries',
    'sermons',
    'events',
    'Cebu',
    'gateway church cebu',
    'cebu churches',
    'community',
    'gateway community',
    'gateway hope',
    'gateway donation drive',
    'love God, love people'
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Gateway Church | Welcome Home',
    description:
      'Gateway Church is a welcoming community of faith. Join us for worship services, ministries, and events.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Gateway Church',
    url: siteUrl,
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
    title: 'Gateway Church | Welcome Home',
    description:
      'Gateway Church is a welcoming community of faith. Join us for worship services, ministries, and events.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import {
  LandingHeader,
  HeroSection,
  AboutSection,
  MissionSection,
  CommunityGallerySection,
  ChurchServiceSection,
  SermonsSection,
  MinistriesSection,
  EventsSection,
  AriseAndBuildSection,
  ContactSection,
  LandingFooter,
  ScrollAnimationProvider,
} from '@/components/landing';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Church',
  name: 'Gateway Church',
  description:
    'Gateway Church is a welcoming community of faith. Join us for worship services, ministries, and events. Experience love, hope, and belonging.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://gatewaychurch.com',
  logo: '/logo.png',
  sameAs: [
    'https://facebook.com/gatewaychurch',
    'https://instagram.com/gatewaychurch',
    'https://youtube.com/gatewaychurch',
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Church Street',
    addressLocality: 'Your City',
    addressRegion: 'State',
    postalCode: '12345',
    addressCountry: 'US',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-555-555-5555',
    contactType: 'customer service',
  },
};

export default function LandingPage() {
  return (
    <div className="landing-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingHeader />

      <main className="landing-main">
        <ScrollAnimationProvider>
          <HeroSection />
          <AboutSection />
          <MissionSection />
          <CommunityGallerySection />
          <ChurchServiceSection />
          <SermonsSection />
          <MinistriesSection />
          <EventsSection />
          <AriseAndBuildSection />
          <ContactSection />
        </ScrollAnimationProvider>
      </main>

      <LandingFooter />
    </div>
  );
}
