/**
 * Platform Admin Layout
 *
 * The platform admin portal (/platform-admin): platform admins only (PlatformAdminGuard + the API's
 * PlatformAdminGuard), read-only. Separate from the church admin: its own guard, store and shell.
 */

'use client';

import React from 'react';
import { PlatformAdminShell } from '@/components/platform-admin';
import { PlatformAdminGuard } from '@/guards/PlatformAdminGuard';

export default function PlatformAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlatformAdminGuard>
      <PlatformAdminShell>{children}</PlatformAdminShell>
    </PlatformAdminGuard>
  );
}
