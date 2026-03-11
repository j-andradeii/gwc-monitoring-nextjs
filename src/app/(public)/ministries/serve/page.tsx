import type { Metadata } from 'next';
import { siteMetadata } from '@/data/site-metadata';
import { LandingHeader, LandingFooter, PageHero, ScrollAnimationProvider, InProgressSection } from '@/components/landing';
import '@/styles/landing.css';

const siteUrl = siteMetadata.siteUrl;

export const metadata: Metadata = {
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
        canonical: `${siteUrl}/ministries/serve`,
    },
    openGraph: {
        title: 'Serve | Gateway Church',
        description: 'Find your place to serve and make a difference at Gateway Church.',
        url: `${siteUrl}/ministries/serve`,
        type: 'website',
        locale: 'en_US',
        siteName: siteMetadata.name,
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
};

export default function ServePage() {
    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'Ministries', item: `${siteUrl}/ministries` },
            { '@type': 'ListItem', position: 3, name: 'Serve' },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
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
        </>
    );
}
