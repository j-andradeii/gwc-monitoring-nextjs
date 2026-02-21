/**
 * Ministry Data
 *
 * Shared ministry data used across the application
 */

export interface Ministry {
    id: string;
    title: string;
    image: string;
    description: string;
    social?: {
        facebook?: string;
        instagram?: string;
    };
}

export const ministries: Ministry[] = [
    {
        id: '1',
        title: 'Gateway Axis',
        image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/youth_1.jpg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        social: {
            instagram: 'https://www.instagram.com/gateway.axis'
        }
    },
    {
        id: '2',
        title: 'Gateway Marketplace',
        image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/marketplace.jpg',
        description: `[We are] Ambassadors of Christ in the Marketplace
                       
                       We are therefore Christ’s ambassadors, as though God were making his appeal through us. We implore you on Christ’s behalf: Be reconciled to God
                       - 2 Corinthians 5:20`,
        social: {
            instagram: 'https://www.instagram.com/gatewaymarketplace.ceb'
        }
    },
    {
        id: '3',
        title: 'Gateway Couples',
        image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/couple.jpg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    },
    {
        id: '4',
        title: 'Gateway Kids',
        image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/kids.jpg',
        description: `Gateway Church is ready and happy to serve everyone who visits with their precious ones by ushering them to our Kids’ Corner. 
        There, children play, sing songs of God’s goodness, share their stories, and create art. 
        They also discover great stories from the Bible, learning that the same amazing things God did for His people then, He will do for them today. 
        We are honored to support parents who desire to "train up a child in the way they should go" (Proverbs 22:6).`,
    },
    {
        id: '5',
        title: 'Men Ministry',
        image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/men.jpg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    },
    {
        id: '6',
        title: 'Women Ministry',
        image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/women.jpg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    },
];
