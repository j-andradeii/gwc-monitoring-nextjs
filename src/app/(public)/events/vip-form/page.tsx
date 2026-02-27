/**
 * VIP Registration Form Page
 *
 * Public page for new visitors to register their details
 */

import { Metadata } from 'next';
import VipFormClient from './VipFormClient';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://gatewaychurch.com';

export const metadata: Metadata = {
  title: 'VIP Registration | Gateway Church',
  description: 'Welcome to Gateway Church! Please register your details so we can connect with you.',
  alternates: {
    canonical: '/events/vip-form',
  },
  openGraph: {
    title: 'VIP Registration | Gateway Church',
    description: 'Welcome to Gateway Church! Please register your details so we can connect with you.',
    url: `${siteUrl}/events/vip-form`,
    siteName: 'Gateway Church',
    locale: 'en_US',
    type: 'website',
  },
};

export default function VipFormPage() {
  return <VipFormClient />;
}
