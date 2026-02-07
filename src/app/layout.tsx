import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './globals.css';
import { ConnectFab } from '@/components/landing';

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GATEWAY CHURCH',
  description: 'Church management and monitoring platform for Gateway Church',
  keywords: ['church', 'management', 'monitoring', 'members', 'portal'],
  authors: [{ name: 'GATEWAY CHURCH FAMILY' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://gatewaychurch.com'),
  icons: {
    icon: '/assets/images/gwc-logo-gold.png',
    apple: '/assets/images/gwc-logo-gold.png',
  },
  openGraph: {
    title: 'GWC Monitoring - Church Management Portal',
    description: 'Church management and monitoring platform for Gateway Church',
    images: [
      {
        url: 'https://gwc-monitoring-nextjs.vercel.app/assets/images/fam-picture.jpg',
        width: 2048,
        height: 715,
        alt: 'Gateway Church Family',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GATEWAY CHURCH',
    description: 'Church management and monitoring platform for Gateway Church',
    images: ['https://gwc-monitoring-nextjs.vercel.app/assets/images/fam-picture.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
