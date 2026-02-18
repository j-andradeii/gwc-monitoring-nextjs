/**
 * Site Metadata
 *
 * Shared metadata used across the application for SEO and configuration
 */

export const siteMetadata = {
    name: 'Gateway Church',
    shortName: 'Gateway',
    slogan: 'Loving God, Loving People',
    description: 'Loving God, Loving People. Gateway Church is a vibrant, multicultural community dedicated to sharing the love of Christ. We create a space where people can encounter God, grow in their faith, and find a supportive family.',
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
        'community',
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
    ]
};
