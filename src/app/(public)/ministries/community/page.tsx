import type { Metadata } from 'next';
import { siteMetadata } from '@/data/site-metadata';
import { LandingHeader, LandingFooter, PageHero, ScrollAnimationProvider, MinistryFeatureSection, ContactSection, ConnectFab, ProjectBanner } from '@/components/landing';
import { ministries } from '@/data/ministries';
// @ts-ignore
import '@/styles/landing.css';

const siteUrl = siteMetadata.siteUrl;

export const metadata: Metadata = {
    title: 'Community | Gateway Church',
    description: 'Join our vibrant community groups and connect with others at Gateway Church. Find fellowship, small groups, and meaningful relationships.',
    keywords: [
        'Gateway Church',
        'community',
        'small groups',
        'fellowship',
        'church community',
        'Cebu church',
        'connect groups',
        'Gateway Church Cebu',
    ],
    alternates: {
        canonical: `${siteUrl}/ministries/community`,
    },
    openGraph: {
        title: 'Community | Gateway Church',
        description: 'Join our vibrant community groups and connect with others at Gateway Church.',
        url: `${siteUrl}/ministries/community`,
        type: 'website',
        locale: 'en_US',
        siteName: siteMetadata.name,
        images: [
            {
                url: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/community.jpg',
                width: 1200,
                height: 630,
                alt: 'Gateway Church Community',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Community | Gateway Church',
        description: 'Join our vibrant community groups and connect with others at Gateway Church.',
        images: ['https://gtxngthtpisigkys.public.blob.vercel-storage.com/community.jpg'],
    },
};

export default function CommunityPage() {
    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Ministries', item: `${siteUrl}/ministries` },
            { '@type': 'ListItem', position: 3, name: 'Community' },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
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

                 <ProjectBanner
                            badge="Belong"
                            title="There's a seat saved for you."
                            buttonLabel="Join us this Sunday"
                            buttonAriaLabel="Join us this Sunday"
                            ariaLabel="Join us this Sunday"
                            route={'/events/sonday-service'}
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
        </>
    );
}
