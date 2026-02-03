/**
 * Ministry Data
 *
 * Shared ministry data used across the application
 */

export interface Ministry {
    id: string;
    title: string;
    image: string;
}

export const ministries: Ministry[] = [
    {
        id: '1',
        title: 'Gateway Axis',
        image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/youth_1.jpg',
    },
    {
        id: '2',
        title: 'Marketplace',
        image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/marketplace.jpg',
    },
    {
        id: '3',
        title: 'Couples',
        image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/couple.jpg',
    },
    {
        id: '4',
        title: 'Kids Church',
        image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/kids.jpg',
    },
    {
        id: '5',
        title: 'Men Ministry',
        image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/men.jpg',
    },
    {
        id: '6',
        title: 'Women Ministry',
        image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/women.jpg',
    },
];
