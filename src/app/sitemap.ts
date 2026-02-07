import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gatewaychurch.com';

import { sermons } from '@/data/sermons';
import { events } from '@/data/events';

export default function sitemap(): MetadataRoute.Sitemap {
  const sermonRoutes = sermons.map((sermon) => ({
    url: `${siteUrl}/sermon-notes/${sermon.slug}`,
    lastModified: new Date(sermon.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const eventRoutes = events.map((event) => ({
    url: `${siteUrl}/events/${event.slug}`,
    // Use current date if event date is not parseable or future, but sitemap expects a date. 
    // Usually LastModified is about the page update. We'll use new Date() for now or parse the event date if strict.
    // For simplicity and to match the other static entries, we can use new Date() or the event date if it's strictly formatted.
    // Given event.date is string like "Feb 07, 2026", new Date(event.date) works.
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/sermon-notes`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...sermonRoutes,
    {
      url: `${siteUrl}/ministries/community`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/ministries/serve`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...eventRoutes,
    {
      url: `${siteUrl}/give/ways-to-give`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/give/gateway-projects`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];
}
