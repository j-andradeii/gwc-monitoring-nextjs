/**
 * Lyric Formatter
 *
 * Internal worship/tech tool: search LRCLIB for song lyrics, auto-group into
 * MultiTracks-style sections, edit, then copy or export to ProPresenter (.pro).
 * Marked noindex (utility page that surfaces third-party lyrics) and intentionally
 * left out of the sitemap.
 */

import '@/styles/landing.css';
import { Metadata } from 'next';
import { siteMetadata } from '@/data/site-metadata';
import LyricFormatterClient from './LyricFormatterClient';

const siteUrl = siteMetadata.siteUrl;

export const metadata: Metadata = {
  title: 'Lyric Formatter | Gateway Church Cebu',
  description:
    'Search song lyrics, auto-group them into sections, edit, then copy or export to ProPresenter (.pro).',
  robots: { index: false, follow: false },
  alternates: {
    canonical: `${siteUrl}/lyric-formatter`,
  },
};

export default function LyricFormatterPage() {
  return <LyricFormatterClient />;
}
