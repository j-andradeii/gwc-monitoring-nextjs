/**
 * Landing Page
 *
 * Public landing page for Gateway Church (Server Component)
 */

import type { Metadata } from 'next';

import '@/styles/landing.css';
import { siteMetadata } from '@/data/site-metadata';

const siteUrl = siteMetadata.siteUrl;

export const metadata: Metadata = {
  title: `${siteMetadata.name} | Welcome Home`,
  description: `${siteMetadata.description} Join us at ${siteMetadata.address.street}.`,
  keywords: siteMetadata.keywords,
  alternates: {
    canonical: siteUrl,
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
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${siteMetadata.name} - Loving God, Loving People`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteMetadata.name} | Welcome Home`,
    description: siteMetadata.description,
    images: ['/og-image.jpg'],
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Church', 'Organization'],
      '@id': `${siteUrl}/#church`,
      name: siteMetadata.name,
      description: `${siteMetadata.description} Our discipleship process: ${siteMetadata.discipleshipProcess.join('; ')}.`,
      url: siteUrl,
      logo: `${siteUrl}/assets/images/gwc-logo-gold.png`,
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
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'https://schema.org/Sunday',
          opens: '09:00',
          closes: '12:00',
          description: 'Sunday Service',
        },
      ],
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 10.3157,
        longitude: 123.8854,
      },
      areaServed: {
        '@type': 'City',
        name: 'Cebu City',
        containedInPlace: {
          '@type': 'Country',
          name: 'Philippines',
        },
      },
      legalName: 'Gateway Church Cebu',
      foundingDate: '2015',
      hasMap: siteMetadata.address.mapsUrl,
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: siteMetadata.name,
      description: siteMetadata.description,
      publisher: { '@id': `${siteUrl}/#church` },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteUrl}/sermon-notes?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'SiteNavigationElement',
      '@id': `${siteUrl}/#nav-about`,
      name: 'About Us',
      description: 'Learn about our history, mission, and leadership.',
      url: `${siteUrl}/about`,
    },
    {
      '@type': 'SiteNavigationElement',
      '@id': `${siteUrl}/#nav-sermons`,
      name: 'Sermons',
      description: 'Watch past sermons and series.',
      url: `${siteUrl}/sermon-notes`,
    },
    {
      '@type': 'SiteNavigationElement',
      '@id': `${siteUrl}/#nav-ministries`,
      name: 'Ministries',
      description: 'Get involved in our community and serve.',
      url: `${siteUrl}/ministries/community`,
    },
    {
      '@type': 'SiteNavigationElement',
      '@id': `${siteUrl}/#nav-events`,
      name: 'Events',
      description: 'Upcoming events and gatherings.',
      url: `${siteUrl}/events`,
    },
    {
      '@type': 'SiteNavigationElement',
      '@id': `${siteUrl}/#nav-give`,
      name: 'Give',
      description: 'Support the mission and projects of Gateway Church.',
      url: `${siteUrl}/give/ways-to-give`,
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What time is the Sunday service at Gateway Church Cebu?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Gateway Church Cebu holds Sunday services starting at 9:30 AM. Gates open at 9:00 AM. We are located at the 8th Floor, Golden Peak Hotel and Suites, Escario St. Gorordo Ave., Cebu City.',
          },
        },
        {
          '@type': 'Question',
          name: 'Where is Gateway Church Cebu located?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Gateway Church Cebu is located at the 8th Floor, Golden Peak Hotel and Suites, Escario St. Gorordo Ave., Cebu City 6000, Philippines.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is Gateway Church Cebu open to visitors and newcomers?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Everyone is welcome at Gateway Church Cebu. Whether you are new to faith or have been a believer for years, we would love to have you join us. Our VIP team will help you feel at home.',
          },
        },
        {
          '@type': 'Question',
          name: 'How can I give or donate to Gateway Church Cebu?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can give to Gateway Church Cebu through GCash, bank transfer via BPI or BDO, or during our Sunday services. Visit our Ways to Give page for account details.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the discipleship process at Gateway Church?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Gateway Church follows a 4-step discipleship process: WIN (evangelism and outreach), CONSOLIDATE (grounding new believers), DISCIPLE (growing in faith through small groups and mentorship), and SEND (equipping and sending leaders to serve).',
          },
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
