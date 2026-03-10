import type { MetadataRoute } from 'next';

import { siteMetadata } from '@/data/site-metadata';
import { sermons } from '@/data/sermons';
import { events } from '@/data/events';

const siteUrl = siteMetadata.siteUrl;

export default function sitemap(): MetadataRoute.Sitemap {
  const sermonRoutes = sermons.map((sermon) => ({
    url: `${siteUrl}/sermon-notes/${sermon.slug}`,
    lastModified: new Date(sermon.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const eventRoutes = events
    .filter((event) => !event.is_event_finished)
    .map((event) => ({
      url: `${siteUrl}/events/${event.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

  return [
    // Homepage
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },

    // About
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // Sermon Notes
    {
      url: `${siteUrl}/sermon-notes`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...sermonRoutes,

    // Ministries
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

    // Events
    {
      url: `${siteUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...eventRoutes,
    {
      url: `${siteUrl}/events/vip-form`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },

    // Give
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
    {
      url: `${siteUrl}/give/gateway-outreach`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
