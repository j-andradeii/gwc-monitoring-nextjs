import { MetadataRoute } from 'next';
import { siteMetadata } from '@/data/site-metadata';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: siteMetadata.name,
        short_name: siteMetadata.shortName,
        description: siteMetadata.description,
        start_url: '/',
        display: 'standalone',
        background_color: '#f5f0e6',
        theme_color: '#1a2744',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    };
}
