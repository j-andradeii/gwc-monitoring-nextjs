/**
 * Landing Page
 *
 * Public landing page for Gateway Church (Server Component)
 */

import type { Metadata } from 'next';

import '@/styles/landing.css';

const siteUrl = siteMetadata.siteUrl;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${siteMetadata.name} | Welcome Home`,
  description: `${siteMetadata.description} Join us at ${siteMetadata.address.street}.`,
  keywords: siteMetadata.keywords,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${siteMetadata.name} | Welcome Home`,
    description: siteMetadata.description,
    type: 'website',
    locale: 'en_US',
    siteName: siteMetadata.name,
    url: siteUrl,
    images: [
      {
        url: 'https://gwc-monitoring-nextjs.vercel.app/assets/images/fam-picture.jpg',
        width: 2048,
        height: 715,
        alt: `${siteMetadata.name} Family`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteMetadata.name} | Welcome Home`,
    description: siteMetadata.description,
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
  ConnectFab,
} from '@/components/landing';
import { siteMetadata } from '@/data/site-metadata';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Church',
      name: siteMetadata.name,
      description: `${siteMetadata.description} Our discipleship process: ${siteMetadata.discipleshipProcess.join('; ')}.`,
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      image: `${siteUrl}/assets/images/fam-picture.jpg`,
      slogan: siteMetadata.slogan,
      knowsAbout: siteMetadata.discipleshipProcess,
      sameAs: [
        siteMetadata.socials.facebook,
        siteMetadata.socials.instagram,
      ],
      address: {
        '@type': 'PostalAddress',
        streetAddress: siteMetadata.address.street,
        addressLocality: siteMetadata.address.city,
        addressRegion: siteMetadata.address.region,
        postalCode: siteMetadata.address.postalCode,
        addressCountry: siteMetadata.address.country,
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: siteMetadata.contact.phone,
        contactType: siteMetadata.contact.type,
      },
    },
    {
      '@type': 'ItemList',
      '@id': `${siteUrl}/#main-navigation`,
      name: 'Main Navigation',
      itemListElement: [
        {
          '@type': 'SiteNavigationElement',
          position: 1,
          name: 'About Us',
          description: 'Learn about our history, mission, and leadership.',
          url: `${siteUrl}/about`,
        },
        {
          '@type': 'SiteNavigationElement',
          position: 2,
          name: 'Sermons',
          description: 'Watch past sermons and series.',
          url: `${siteUrl}/sermon-notes`,
        },
        {
          '@type': 'SiteNavigationElement',
          position: 3,
          name: 'Ministries',
          description: 'Get involved in our community and serve.',
          url: `${siteUrl}/ministries/community`,
        },
        {
          '@type': 'SiteNavigationElement',
          position: 4,
          name: 'Events',
          description: 'Upcoming events and gatherings.',
          url: `${siteUrl}/events`,
        },
        {
          '@type': 'SiteNavigationElement',
          position: 5,
          name: 'Give',
          description: 'Support the mission and projects of Gateway Church.',
          url: `${siteUrl}/give/ways-to-give`,
        },
      ],
    },
  ],
};

export default function LandingPage() {
  return (
    <div className="landing-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingHeader />
      <ConnectFab />

      <main className="landing-main">
        <ScrollAnimationProvider>
          <HeroSection />
          <AboutSection />
          <MissionSection />
          <CommunityGallerySection />
          <ChurchServiceSection />
          <SermonsSection />
          <MinistriesSection />
          <AriseAndBuildSection />
          <EventsSection />
          <ContactSection />
        </ScrollAnimationProvider>
      </main>

      <LandingFooter />
    </div>
  );
}
