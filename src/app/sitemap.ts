import type { MetadataRoute } from 'next';

import { siteMetadata } from '@/data/site-metadata';
import { sermons } from '@/data/sermons';
import { events } from '@/data/events';

const siteUrl = siteMetadata.siteUrl;

/**
 * Stable "last significant content update" date for the largely-static marketing
 * pages (home chrome, about, connect, give, ministries, forms).
 *
 * IMPORTANT: bump this ONLY when you make a meaningful content change to those
 * pages. Do NOT wire it back to `new Date()` / build time. A sitemap whose
 * <lastmod> changes for every page on every deploy trains Google to distrust —
 * and ultimately ignore — the lastmod signal, which weakens re-crawl
 * prioritisation and contributes to "Crawled - currently not indexed".
 * Listing pages below derive their lastmod from real sermon/event content dates.
 */
const STATIC_CONTENT_LASTMOD = new Date('2026-06-14');

const safeTime = (value: string): number => {
  const t = new Date(value).getTime();
  return Number.isNaN(t) ? 0 : t;
};

const latestSermonTime = sermons.reduce((max, s) => Math.max(max, safeTime(s.date)), 0);
const latestEventTime = events.reduce((max, e) => Math.max(max, safeTime(e.date)), 0);

const sermonsListingLastMod = latestSermonTime ? new Date(latestSermonTime) : STATIC_CONTENT_LASTMOD;
const eventsListingLastMod = latestEventTime ? new Date(latestEventTime) : STATIC_CONTENT_LASTMOD;
const homeLastMod = new Date(
  Math.max(latestSermonTime, latestEventTime, STATIC_CONTENT_LASTMOD.getTime()),
);

export default function sitemap(): MetadataRoute.Sitemap {
  const sermonRoutes = sermons.map((sermon) => ({
    url: `${siteUrl}/sermon-notes/${sermon.slug}`,
    lastModified: new Date(sermon.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const eventRoutes = events.map((event) => ({
    url: `${siteUrl}/events/${event.slug}`,
    lastModified: new Date(event.date),
    changeFrequency: event.is_event_finished ? ('monthly' as const) : ('weekly' as const),
    priority: event.is_event_finished ? 0.4 : 0.7,
  }));

  return [
    // Homepage
    {
      url: siteUrl,
      lastModified: homeLastMod,
      changeFrequency: 'weekly',
      priority: 1,
    },

    // About
    {
      url: `${siteUrl}/about`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // Connect
    {
      url: `${siteUrl}/connect`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // Sermon Notes
    {
      url: `${siteUrl}/sermon-notes`,
      lastModified: sermonsListingLastMod,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...sermonRoutes,

    // Ministries
    {
      url: `${siteUrl}/ministries/community`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/ministries/serve`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // Events
    {
      url: `${siteUrl}/events`,
      lastModified: eventsListingLastMod,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...eventRoutes,
    {
      url: `${siteUrl}/events/vip-form`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/events/sod-enrollment`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'monthly',
      priority: 0.5,
    },

    // Give
    {
      url: `${siteUrl}/give/ways-to-give`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/give/gateway-projects`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/give/gateway-outreach`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
