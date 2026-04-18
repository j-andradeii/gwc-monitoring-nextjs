/**
 * Public Layout
 *
 * Layout for public pages (landing, sermon-notes)
 */

import '@/styles/landing.css';
import '@/styles/sermon-detail.css';
import { ConnectFab } from '@/components/landing';
import React from 'react';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>
    <ConnectFab />
    {children}
  </>;
}
