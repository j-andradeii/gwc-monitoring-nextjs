/**
 * Admin Layout
 *
 * Layout for protected admin pages
 */

'use client';

import React from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AuthGuard } from '@/guards/AuthGuard';

export default function ChurchCampusAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AdminLayout>{children}</AdminLayout>
    </AuthGuard>
  );
}
