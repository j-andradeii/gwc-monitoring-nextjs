import type { Metadata } from 'next';
import { LandingHeader, LandingFooter, PageHero, ScrollAnimationProvider, InProgressSection } from '@/components/landing';
import '@/styles/landing.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gatewaychurch.com';

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: 'Serve | Gateway Church',
    description: 'Find your place to serve and make a difference.',
    openGraph: {
        title: 'Serve | Gateway Church',
        description: 'Find your place to serve and make a difference.',
        url: `${siteUrl}/ministries/serve`,
        type: 'website',
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
