import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './globals.css';


import { siteMetadata } from '@/data/site-metadata';

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: siteMetadata.name,
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  authors: [{ name: siteMetadata.name }],
  metadataBase: new URL(siteMetadata.siteUrl),
  icons: {
    icon: '/assets/images/gwc-logo-gold.png',
    apple: '/assets/images/gwc-logo-gold.png',
  },
  openGraph: {
    title: siteMetadata.name,
    description: siteMetadata.description,
    images: [
      {
        url: 'https://gwc-monitoring-nextjs.vercel.app/assets/images/fam-picture.jpg',
        width: 2048,
        height: 715,
        alt: `${siteMetadata.name} Family`,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMetadata.name,
    description: siteMetadata.description,
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
