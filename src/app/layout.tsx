import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'GATEWAY CHURCH',
  description: 'Church management and monitoring platform for Gateway Church',
  keywords: ['church', 'management', 'monitoring', 'members', 'portal'],
  authors: [{ name: 'GWC Team' }],
  metadataBase: new URL('https://your-domain.com'),
  openGraph: {
    title: 'GWC Monitoring - Church Management Portal',
    description: 'Church management and monitoring platform for Gateway Church',
    images: [
      {
        url: '/assets/images/fam-picture.jpg',
        width: 1200,
        height: 630,
        alt: 'Gateway Church Family',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GATEWAY CHURCH',
    description: 'Church management and monitoring platform for Gateway Church',
    images: ['/assets/images/fam-picture.jpg'],
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
