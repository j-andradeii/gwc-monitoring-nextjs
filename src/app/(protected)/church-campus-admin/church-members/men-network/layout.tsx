/**
 * Admin Layout
 *
 * Layout for protected admin pages
 */

'use client';

import React from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AuthGuard } from '@/guards/AuthGuard';

export default function MenNetworkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
        <p style={{color:'black'}}>HELLO</p>
        {children}
    </div>
  );
}
