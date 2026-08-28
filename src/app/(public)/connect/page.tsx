/**
 * Connect Page
 *
 * Public page for Gateway Church — helping visitors find their next step.
 */

import type { Metadata } from 'next';

import '@/styles/landing.css';
import { siteMetadata } from '@/data/site-metadata';

const siteUrl = siteMetadata.siteUrl;

export const metadata: Metadata = {
  title: 'Connect | Gateway Church',
  description:
    'Take your next step at Gateway Church Cebu, from your first visit to lifelong growth. Find a Connect Group, discover New Life, and grow as a disciple.',
  keywords: [
    'Gateway Church Connect',
    'next steps church Cebu',
    'new believer',
    'water baptism',
    'Connect Group',
    'cell group Cebu',
    'discipleship Cebu',
    'church community Cebu',
    'small groups Gateway',
    'spiritual growth',
    'church volunteer Cebu',
    'Gateway Church discipleship',
  ],
  alternates: {
    canonical: `${siteUrl}/connect`,
  },
  openGraph: {
    title: 'Connect | Gateway Church',
    description:
      'Take your next step at Gateway Church, from first visit to lifelong growth. Find community, grow in faith, and be sent.',
    type: 'website',
    locale: 'en_US',
    siteName: siteMetadata.name,
    url: `${siteUrl}/connect`,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Gateway Church - Connect',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Connect | Gateway Church',
    description:
      'Take your next step at Gateway Church, from first visit to lifelong growth. Find community, grow in faith, and be sent.',
    images: ['/og-image.jpg'],
  },
};

import {
  LandingHeader,
  LandingFooter,
  ScrollAnimationProvider,
  ProjectBanner,
} from '@/components/landing';

import { ConnectHero, ConnectTabs, ConnectTabsProvider } from '@/components/landing/connect';

const connectJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Connect', item: `${siteUrl}/connect` },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: "I'm new to Christianity. What is the New Life pathway at Gateway Church?",
          acceptedAnswer: {
            '@type': 'Answer',
            text: "The New Life pathway at Gateway Church Cebu is designed for people who have just made a decision to follow Jesus or are curious about faith. It includes learning about salvation, being baptised in water, and attending an Encounter Weekend, a transformative experience that helps new believers encounter God's presence and begin their faith journey.",
          },
        },
        {
          '@type': 'Question',
          name: 'What are Connect Groups at Gateway Church?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Connect Groups (also called cell groups) are small, intentional communities at Gateway Church Cebu that meet weekly in homes and coffee shops across the city. They are designed for members to build real relationships, study the Word, pray for one another, and experience authentic community life together.",
          },
        },
        {
          '@type': 'Question',
          name: 'How can I grow as a disciple at Gateway Church Cebu?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Gateway Church Cebu follows the WIN–CONSOLIDATE–DISCIPLE–SEND process. The Growth pathway includes a structured discipleship track, equipping workshops, mentoring, and the School of Leaders program. The ultimate goal is to be sent, empowered to fulfil the Great Commission in your own sphere of influence.",
          },
        },
      ],
    },
  ],
};

export default function ConnectPage() {
  return (
    <div className="landing-page connect-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(connectJsonLd) }}
      />
      <LandingHeader />

      <main className="landing-main">
        <ScrollAnimationProvider>
          {/* Provider shares the active tab so the hero background swaps per tab */}
          <ConnectTabsProvider>
            <ConnectHero />
            <ProjectBanner
              badge="Belong"
              title="There's a seat saved for you."
              buttonLabel="Join us this Sunday"
              buttonAriaLabel="Join us this Sunday"
              ariaLabel="Join us this Sunday"
              route={'/events/sonday-service'}
            />
            <ConnectTabs />
          </ConnectTabsProvider>
        </ScrollAnimationProvider>
      </main>

      <LandingFooter />
    </div>
  );
}
