/**
 * About Page
 *
 * Dedicated About page for Gateway Church
 */

import type { Metadata } from 'next';

import '@/styles/landing.css';
import { siteMetadata } from '@/data/site-metadata';

const siteUrl = siteMetadata.siteUrl;

export const metadata: Metadata = {
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
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: 'About Us | Gateway Church',
    description:
      'Learn about Gateway Church - our vision, mission, values, and what we believe.',
    type: 'website',
    locale: 'en_US',
    siteName: siteMetadata.name,
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
  ConnectFab,
  ProjectBanner,
} from '@/components/landing';

import {
  AboutHero,
  OurStory,
  VisionMission,
  OurValues,
  OurPastors,
  AboutTabs,
} from '@/components/landing/about';

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'About Us' },
      ],
    },
    {
      '@type': 'Person',
      name: 'Ptr. Jim Baloran',
      jobTitle: 'Senior Pastor',
      worksFor: {
        '@type': 'Church',
        name: 'Gateway Church Cebu',
        url: siteUrl,
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: "What is Gateway Church Cebu's vision?",
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Gateway Church Cebu's vision is to be a gateway for every person to encounter God, experience transformation, and be empowered to impact the world.",
          },
        },
        {
          '@type': 'Question',
          name: 'What does Gateway Church Cebu believe?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Gateway Church Cebu believes in the Bible as the inspired Word of God, the Trinity (Father, Son, and Holy Spirit), salvation through Jesus Christ, and the power of the Holy Spirit in the life of every believer.',
          },
        },
        {
          '@type': 'Question',
          name: 'Who is the senior pastor of Gateway Church Cebu?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The senior pastor of Gateway Church Cebu is Ptr. Jim Baloran.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the WIN-CONSOLIDATE-DISCIPLE-SEND process?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "The WIN-CONSOLIDATE-DISCIPLE-SEND process is Gateway Church's discipleship framework: WIN means reaching new people for Jesus through sharing the Gospel, CONSOLIDATE means taking care of new believers through personal Encounters with Jesus, DISCIPLE means reproducing Christ's character and equipping leaders, and SEND means empowering leaders to fulfill the Great Commission.",
          },
        },
      ],
    },
  ],
};

export default function AboutPage() {
  return (
    <div className="landing-page about-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <LandingHeader />

      <main className="landing-main">
        <ScrollAnimationProvider>
          <AboutHero />
          <ProjectBanner
                badge="Belong"
                title="There's a seat saved for you."
                buttonLabel="Join us this Sunday"
                buttonAriaLabel="Join us this Sunday"
                ariaLabel="Join us this Sunday"
                route={'/events/sonday-service'}
            />
          <AboutTabs />
          <OurStory />
          <VisionMission />
          <OurValues />
          <OurPastors />
          <ContactSection />
        </ScrollAnimationProvider>
      </main>

      <LandingFooter />
    </div >
  );
}
