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
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        social: {
            instagram: 'https://www.instagram.com/gatewaymarketplace.ceb'
        }
    },
    {
        id: '3',
        title: 'Couples',
        image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/couple.jpg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    },
    {
        id: '4',
        title: 'Kids Church',
        image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/kids.jpg',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
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
