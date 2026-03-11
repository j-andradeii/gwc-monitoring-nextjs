/**
 * Site Metadata
 *
 * Shared metadata used across the application for SEO and configuration
 */

export const siteMetadata = {
    name: 'Gateway Church',
    shortName: 'Gateway',
    slogan: 'Loving God, Loving People',
    description: 'Gateway Church Cebu — a vibrant, multicultural Christian church in Cebu City, Philippines. Sunday services at the 8th Floor, Golden Peak Hotel & Suites, Gorordo Avenue. Loving God, Loving People.',
    siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://www.gatewaychurchcebu.com',
    keywords: [
        'Gateway Church',
        'Gateway Church Cebu',
        'church',
        'worship',
        'community',
        'faith',
        'ministries',
        'sermons',
        'events',
        'Cebu',
        'gateway church cebu',
        'cebu churches',
        'gateway community',
        'gateway hope',
        'gateway donation drive',
        'love God, love people',
        'discipleship',
        'win consolidate disciple send',
        'great commission',
        'evangelism',
        'new believers',
        'church leadership',
        'spiritual growth'
    ],
    socials: {
        facebook: 'https://www.facebook.com/profile.php?id=61573001004310',
        instagram: 'https://www.instagram.com/gatewaychurchcebu',
    },
    address: {
        street: '8th Floor, Golden Peak, Gorordo Avenue',
        city: 'Cebu City',
        region: 'Cebu',
        postalCode: '6000',
        country: 'PH',
    },
    contact: {
        phone: '+639225262508',
        type: 'customer service',
    },
    discipleshipProcess: [
        'WIN - Reaching new people for Jesus through sharing the Gospel',
        'CONSOLIDATE - Taking care of new believers through personal Encounters with Jesus',
        'DISCIPLE - Reproducing Christ\'s character and equipping leaders',
        'SEND - Empowering leaders to fulfill the Great Commission'
    ],
    openingHours: 'Su 09:00-12:00',
    geo: {
        latitude: '10.3157',
        longitude: '123.8854',
    },
    foundingDate: '2015',
};
