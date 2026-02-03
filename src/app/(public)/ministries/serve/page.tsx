import type { Metadata } from 'next';
import { LandingHeader, LandingFooter, PageHero, ScrollAnimationProvider } from '@/components/landing';
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
                        backgroundImage="/assets/images/community.jpg" // Using community.jpg as placeholder for now
                    />
                    <section className="landing-section">
                        <div className="landing-container">
                            <div className="section-label">Get Involved</div>
                            <h2 className="section-title">Join a Team</h2>
                            <p className="section-description">
                                We believe that every person has a unique purpose and a role to play in God's kingdom.
                                Serving is one of the best ways to get connected and make a difference.
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
