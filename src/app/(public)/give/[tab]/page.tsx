/**
 * Give Page with Dynamic Tab Route
 *
 * Dedicated Give page for Gateway Church with Ways to Give and Gateway Projects tabs
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import '@/styles/landing.css';

import {
  LandingHeader,
  LandingFooter,
  ScrollAnimationProvider,
  ContactSection,
} from '@/components/landing';

import { GiveHero, GiveTabs } from '@/components/landing/give';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gatewaychurch.com';

const validTabs = ['ways-to-give', 'gateway-projects'] as const;
type TabType = (typeof validTabs)[number];

type Props = {
  params: Promise<{ tab: string }>;
};

export async function generateStaticParams() {
  return validTabs.map((tab) => ({ tab }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tab } = await params;

  const tabTitles: Record<TabType, string> = {
    'ways-to-give': 'Ways to Give',
    'gateway-projects': 'Gateway Projects',
  };

  const tabDescriptions: Record<TabType, string> = {
    'ways-to-give':
      'Support Gateway Church through your tithes and offerings. Multiple giving channels available including GCash, BPI, and BDO.',
    'gateway-projects':
      'Contribute to the Gateway Projects worship center improvement project. Help us build a place of worship for our growing congregation.',
  };

  const title = tabTitles[tab as TabType] || 'Give';
  const description =
    tabDescriptions[tab as TabType] ||
    'Support Gateway Church through your tithes and offerings.';

  return {
    metadataBase: new URL(siteUrl),
    title: `${title} | Gateway Church`,
    description,
    keywords: [
      'Gateway Church',
      'Give',
      'Tithes',
      'Offerings',
      'Donate',
      'Gateway Projects',
      'Church Giving',
      'GCash',
      'BPI',
      'BDO',
    ],
    alternates: {
      canonical: `/give/${tab}`,
    },
    openGraph: {
      title: `${title} | Gateway Church`,
      description,
      type: 'website',
      locale: 'en_US',
      siteName: 'Gateway Church',
      url: `${siteUrl}/give/${tab}`,
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
      title: `${title} | Gateway Church`,
      description,
      images: ['/og-image.jpg'],
    },
  };
}

export default async function GiveTabPage({ params }: Props) {
  const { tab } = await params;

  if (!validTabs.includes(tab as TabType)) {
    notFound();
  }

  return (
    <div className="landing-page give-page">
      <LandingHeader />

      <main className="landing-main">
        <ScrollAnimationProvider>
          <GiveHero />
          <GiveTabs activeTab={tab as TabType} />
          <ContactSection />
        </ScrollAnimationProvider>
      </main>

      <LandingFooter />
    </div>
  );
}
