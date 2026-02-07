import type { Metadata } from 'next';
import { LandingHeader, LandingFooter, PageHero, ScrollAnimationProvider, InProgressSection } from '@/components/landing';
import '@/styles/landing.css';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://gatewaychurch.com';

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: 'Serve | Gateway Church',
    description: 'Find your place to serve and make a difference at Gateway Church. Discover volunteer opportunities and use your gifts to impact lives.',
    keywords: [
        'Gateway Church',
        'serve',
        'volunteer',
        'ministry',
        'church service',
        'Cebu church',
        'volunteer opportunities',
        'Gateway Church Cebu',
    ],
    alternates: {
        canonical: '/ministries/serve',
    },
    openGraph: {
        title: 'Serve | Gateway Church',
        description: 'Find your place to serve and make a difference at Gateway Church.',
        url: `${siteUrl}/ministries/serve`,
        type: 'website',
        locale: 'en_US',
        siteName: 'Gateway Church',
        images: [
            {
                url: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/serve.jpg',
                width: 1200,
                height: 630,
                alt: 'Serve at Gateway Church',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Serve | Gateway Church',
        description: 'Find your place to serve and make a difference at Gateway Church.',
        images: ['https://gtxngthtpisigkys.public.blob.vercel-storage.com/serve.jpg'],
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

export default function ServePage() {
    return (
        <div className="landing-page serve-page">
            <LandingHeader />
            <main className="landing-main">
                <ScrollAnimationProvider>
                    <PageHero
                        badge="Ministries"
                        title="Serve"
                        subtitle="Made to Make a Difference"
                        backgroundImage="https://gtxngthtpisigkys.public.blob.vercel-storage.com/serve.jpg"
                    />
                    <InProgressSection />
                </ScrollAnimationProvider>
            </main>
            <LandingFooter />
        </div>
    );
}
