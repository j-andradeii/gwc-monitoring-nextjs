import type { MetadataRoute } from 'next';

import { siteMetadata } from '@/data/site-metadata';

const siteUrl = siteMetadata.siteUrl;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/church-campus-admin/', '/signin', '/signup', '/forgot-password'],
      },
      // AI crawler explicit opt-in (Agent Engine Optimization)
      { userAgent: 'GPTBot', allow: '/', disallow: ['/api/', '/church-campus-admin/', '/signin', '/signup', '/forgot-password'] },
      { userAgent: 'ChatGPT-User', allow: '/', disallow: ['/api/', '/church-campus-admin/', '/signin', '/signup', '/forgot-password'] },
      { userAgent: 'OAI-SearchBot', allow: '/', disallow: ['/api/', '/church-campus-admin/', '/signin', '/signup', '/forgot-password'] },
      { userAgent: 'PerplexityBot', allow: '/', disallow: ['/api/', '/church-campus-admin/', '/signin', '/signup', '/forgot-password'] },
      { userAgent: 'ClaudeBot', allow: '/', disallow: ['/api/', '/church-campus-admin/', '/signin', '/signup', '/forgot-password'] },
      { userAgent: 'anthropic-ai', allow: '/', disallow: ['/api/', '/church-campus-admin/', '/signin', '/signup', '/forgot-password'] },
      { userAgent: 'Claude-Web', allow: '/', disallow: ['/api/', '/church-campus-admin/', '/signin', '/signup', '/forgot-password'] },
      { userAgent: 'Applebot-Extended', allow: '/', disallow: ['/api/', '/church-campus-admin/', '/signin', '/signup', '/forgot-password'] },
      { userAgent: 'Bytespider', allow: '/', disallow: ['/api/', '/church-campus-admin/', '/signin', '/signup', '/forgot-password'] },
      { userAgent: 'cohere-ai', allow: '/', disallow: ['/api/', '/church-campus-admin/', '/signin', '/signup', '/forgot-password'] },
      { userAgent: 'Google-Extended', allow: '/', disallow: ['/api/', '/church-campus-admin/', '/signin', '/signup', '/forgot-password'] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
