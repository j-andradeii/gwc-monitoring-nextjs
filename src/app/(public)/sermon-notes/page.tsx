/**
 * Sermon Notes Page
 *
 * Public page displaying sermon notes with landing page consistent design
 */

import { Metadata } from 'next';
import SermonNotesClient from './SermonNotesClient';
import { config } from '@/core/config';

export const metadata: Metadata = {
  title: 'Sermon Notes | Gateway Church Cebu',
  description: "Dive deeper into God's Word with notes from our recent sermons. Use these resources for personal study, small group discussions, and spiritual growth.",
  openGraph: {
    title: 'Sermon Notes | Gateway Church Cebu',
    description: "Dive deeper into God's Word with notes from our recent sermons.",
    url: `${config.app.url}/sermon-notes`,
    siteName: 'Gateway Church Cebu',
    images: [
      {
        url: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/notes.jpg',
        width: 1200,
        height: 630,
        alt: 'Sermon Notes - Gateway Church Cebu',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function SermonNotesPage() {
  return <SermonNotesClient />;
}
