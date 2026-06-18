/**
 * Ways to Give Page
 *
 * Dedicated page for Gateway Church giving channels and information
 */

import type { Metadata } from 'next';

import '@/styles/landing.css';

import { siteMetadata } from '@/data/site-metadata';
import {
  LandingHeader,
  LandingFooter,
  ContactSection,
  ProjectBanner,
} from '@/components/landing';

import {
  GiveHero,
  GiveWhySection,
  GiveChannelsSection,
  GiveVideoTestimony,
} from '@/components/landing/give';

import type { GiveKeywordInstruction } from '@/components/landing/give/GiveChannelsSection';

import {
  scriptures,
  firstfruitsScriptures,
  tithesAndOfferingIntro,
} from '@/data/giveData';

const firstfruitsIntro = `Proverbs 3:9–10 says: "Honor the Lord with your wealth, with the firstfruits of all your crops; then your barns will be filled to overflowing…"

When we give our first fruits:

- We honor God.

- We acknowledge that everything comes from Him.

- We demonstrate obedience and trust.

This principle is not about the result — it is about obedience. The blessing is a byproduct; obedience is the priority.

When you give your first fruit to God, He stands on it. He stands guard over what you entrust to Him.`;

const siteUrl = siteMetadata.siteUrl;

// Optional video testimonies — set to a YouTube/Vimeo embed URL (or direct .mp4)
// to surface a testimony in that section. Leave as undefined to hide.
const TITHES_VIDEO_URL: string | undefined = undefined;
const FIRSTFRUITS_VIDEO_URL: string = 'https://www.youtube.com/watch?v=HpJBLkLw3Uc'; 

const giveKeywords: GiveKeywordInstruction[] = [
  {
    label: 'For Tithes & Offering',
    keyword: 'TITHES & OFFERING',
    icon: 'pi pi-wallet',
    helper: 'Use when sending your tithe or a regular offering.',
  },
  {
    label: 'For Firstfruits',
    keyword: 'FIRSTFRUITS',
    icon: 'pi pi-star',
    helper: 'Use when dedicating the first portion of a new increase.',
  },
];

export const metadata: Metadata = {
  title: 'Ways to Give | Gateway Church',
  description:
    'Support Gateway Church through your tithes, offerings, and firstfruits. Multiple giving channels available including GCash, BPI, and BDO.',
  keywords: [
    'Gateway Church',
    'Give',
    'Tithes',
    'Offerings',
    'Firstfruits',
    'Donate',
    'Church Giving',
    'GCash',
    'BPI',
    'BDO',
  ],
  alternates: {
    canonical: `${siteUrl}/give/ways-to-give`,
  },
  openGraph: {
    title: 'Ways to Give | Gateway Church',
    description:
      'Support Gateway Church through your tithes, offerings, and firstfruits. Multiple giving channels available including GCash, BPI, and BDO.',
    type: 'website',
    locale: 'en_US',
    siteName: siteMetadata.name,
    url: `${siteUrl}/give/ways-to-give`,
    images: [
      {
        url: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/giving.jpeg',
        width: 1200,
        height: 630,
        alt: 'Ways to Give - Gateway Church',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ways to Give | Gateway Church',
    description:
      'Support Gateway Church through your tithes, offerings, and firstfruits.',
    images: ['https://gtxngthtpisigkys.public.blob.vercel-storage.com/giving.jpeg'],
  },
};

const giveFaqJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Give', item: `${siteUrl}/give/ways-to-give` },
        { '@type': 'ListItem', position: 3, name: 'Ways to Give' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How can I give to Gateway Church Cebu online?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can give to Gateway Church Cebu through GCash (0928-252-4463, account name: Gateway Church Cebu), bank transfer via BPI (account number: 0206007186, account name: Anna Marie Baloran) or BDO (account number: 002428024627, account name: Anna Marie Baloran/Jimanuel Baloran), or during our Sunday services. Please include the keyword TITHES & OFFERING or FIRSTFRUITS in the message/details field so we can record your gift accurately.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does Gateway Church Cebu accept online donations?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, Gateway Church Cebu accepts online donations through GCash (0928-252-4463) and bank transfers via BPI (0206007186) and BDO (002428024627). You can give anytime from anywhere.',
          },
        },
        {
          '@type': 'Question',
          name: 'What are the giving channels at Gateway Church Cebu?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Gateway Church Cebu offers multiple giving channels: GCash mobile payment (0928-252-4463, Gateway Church Cebu), BPI bank transfer (account number: 0206007186, Anna Marie Baloran), BDO bank transfer (account number: 002428024627, Anna Marie Baloran/Jimanuel Baloran), and in-person giving during Sunday services.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between tithes, offerings, and firstfruits?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Tithes are the first ten percent of your income given back to God as worship. Offerings are gifts given beyond the tithe as the Spirit leads. Firstfruits is the dedication of the first portion of every new increase — a new job, a new business, or a fresh season — back to the Lord before anything else is spent.',
          },
        },
      ],
    },
  ],
};

export default function WaysToGivePage() {
  return (
    <div className="landing-page give-page ways-to-give-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(giveFaqJsonLd) }}
      />
      <LandingHeader />

      <main className="landing-main">
        {/* Hero Section */}
        <GiveHero backgroundImage="https://gtxngthtpisigkys.public.blob.vercel-storage.com/giving.jpeg" />

        {/* Project banner CTA */}
        <ProjectBanner
          badge="Sow"
          targetId="give-channels"
          title="Honor God with Your Giving"
          buttonLabel="Giving channels"
          buttonAriaLabel="Giving channels"
          ariaLabel="Giving channels"
        />

        {/* ===========================================
            SECTION 1 — TITHES & OFFERING
            =========================================== */}
        <GiveWhySection
          sectionId="tithes-offering"
          sectionLabel="Generosity"
          title="Tithes & Offering"
          intro={tithesAndOfferingIntro}
          variantClassName="give-why-section--default give-why-section--compact"
          scriptures={scriptures}
          scriptureMaxLines={4}
        />

        <GiveVideoTestimony
          videoUrl={TITHES_VIDEO_URL}
          sectionId="tithes-offering-testimony"
          sectionLabel="Testimony"
          title="Stories of Faithful Giving"
          description="Hear how tithes and offerings have moved the ministry forward."
        />

        {/* ===========================================
            SECTION 2 — FIRSTFRUITS
            =========================================== */}
        <GiveWhySection
          sectionId="firstfruits"
          sectionLabel="Firstfruits"
          title="Firstfruits"
          intro={firstfruitsIntro}
          scriptures={firstfruitsScriptures}
          variantClassName="give-why-section--firstfruits give-why-section--compact"
          scriptureMaxLines={4}
          learnMoreHref="/sermon-notes/first-fruit-sunday"
          learnMoreLabel="Learn more about Firstfruits"
          learnMoreCaption="Dive deeper into the heart behind Firstfruits Sunday."
        />

        <GiveVideoTestimony
          videoUrl={FIRSTFRUITS_VIDEO_URL}
          videos={[
            {
              url: FIRSTFRUITS_VIDEO_URL,
              title: 'Firstfruits Testimony',
              speaker: 'Doc Vince & Arian Araneta',
            },
            {
              url: `https://www.youtube.com/watch?v=uSE1AlFt6Bw`,
              title: 'Firstfruits Testimony',
              speaker: 'Justin & Amae Tariman',
            },
          ]}
          sectionId="firstfruits-testimony"
          sectionLabel="Testimony"
          title="Firstfruits Testimony"
          description="A story of God’s faithfulness when His people honor the first."
          invert
        />

        {/* ===========================================
            SHARED — GIVING CHANNELS
            One block serves both Tithes & Offering and Firstfruits.
            The keyword to put in the message / details / reference
            field is surfaced as the final "How to Send" step per card.
            =========================================== */}
        <GiveChannelsSection
          sectionId="give-channels"
          sectionLabel="Channels"
          title="How to Give"
          keywords={giveKeywords}
        />

        {/* Contact Section */}
        <ContactSection />
      </main>

      <LandingFooter />
    </div>
  );
}
