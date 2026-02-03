import type { Metadata } from 'next';
import { LandingHeader, LandingFooter, PageHero, ScrollAnimationProvider } from '@/components/landing';
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
                        backgroundImage="/assets/images/community.jpg"
                    />
                    <section className="landing-section">
                        <div className="landing-container">
                            <div className="section-label">Connect</div>
                            <h2 className="section-title">Life Groups</h2>
                            <p className="section-description">
                                We believe that life is better together. Our community groups are the heartbeat of our church,
                                providing a place for you to connect, grow, and share life with others.
                            </p>
                            <br />
                            <p>More details coming soon.</p>
                        </div>
                    </section>
                </ScrollAnimationProvider>
            </main>
            <LandingFooter />
        </div>
    );
}
