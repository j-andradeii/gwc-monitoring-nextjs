import type { MetadataRoute } from 'next';

import { siteMetadata } from '@/data/site-metadata';

const siteUrl = siteMetadata.siteUrl;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/dashboard/', '/private/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
