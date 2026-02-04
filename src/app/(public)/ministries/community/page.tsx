import type { Metadata } from 'next';
import { LandingHeader, LandingFooter, PageHero, ScrollAnimationProvider, MinistryFeatureSection, ContactSection, ConnectFab } from '@/components/landing';
import { ministries } from '@/data/ministries';
import '@/styles/landing.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gatewaychurch.com';

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: 'Community | Gateway Church',
    description: 'Join our vibrant community groups and connect with others.',
    openGraph: {
        title: 'Community | Gateway Church',
        description: 'Join our vibrant community groups and connect with others.',
        url: `${siteUrl}/ministries/community`,
        type: 'website',
        images: [
            {
                url: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/community.jpg',
                width: 1200,
                height: 630,
                alt: 'Gateway Church Community',
            },
        ],
    },
};

export default function CommunityPage() {
    return (
        <div className="landing-page community-page">
            <LandingHeader />
            <main className="landing-main">
                <ScrollAnimationProvider>
                    <PageHero
                        badge="Ministries"
                        title="Community"
                        subtitle="Doing Life Together"
                        backgroundImage="https://gtxngthtpisigkys.public.blob.vercel-storage.com/community.jpg"
                    />

                    <section className="landing-section" style={{ paddingBottom: 0 }}>
                        <div className="landing-container">
                            <div className="section-header-center" style={{ paddingTop: '40px' }}>
                                <span className="section-label">Get Involved</span>
                                <h2>Our Ministries</h2>
                                <p>Find your place to serve and grow</p>
                            </div>
                        </div>
                    </section>

                    <div className="ministries-list-container">
                        {ministries.map((ministry, index) => (
                            <MinistryFeatureSection
                                key={ministry.id}
                                ministry={ministry}
                                reverse={index % 2 !== 0}
                                alternateBackground={index % 2 !== 0}
                            />
                        ))}
                    </div>
                    <ContactSection />
                </ScrollAnimationProvider>
            </main>
            <LandingFooter />
        </div>
    );
}
