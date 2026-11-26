/**
 * PlatformAdminShell
 *
 * The platform admin portal's frame: the admin navy header ("Gateway Church · Platform Admin"), the signed-in
 * email and a Sign out button, then the page area. No sidebar: the portal has one read-only directory. Reuses the
 * admin tokens (`.admin-layout`) and header classes; portal-only styles are `platform-*` in
 * src/styles/platform-admin.css.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ToastProvider } from '@/components/ui/Toast';
import { ROUTES } from '@/core/constants';
import { signOut } from '@/services/platform-admin.service';
import { selectPlatformAdminEmail, usePlatformAdminStore } from '@/stores/platform-admin.store';
import '@/styles/admin-layout.css';
import '@/styles/admin.css';
import '@/styles/admin-dashboard.css';
import '@/styles/platform-admin.css';

export function PlatformAdminShell({ children }: { children: React.ReactNode }) {
  const email = usePlatformAdminStore(selectPlatformAdminEmail);

  return (
    <ToastProvider>
      <div className="admin-layout platform-shell">
        <header className="admin-header platform-header">
          <div className="admin-header-inner">
            <div className="admin-header-left">
              <Link
                href={ROUTES.PLATFORM_ADMIN}
                className="admin-header-brand"
                aria-label="Platform Admin directory"
              >
                <span className="admin-header-logo" aria-hidden="true">
                  <Image
                    src="/assets/images/church-logo-white.png"
                    alt=""
                    width={30}
                    height={17}
                    priority
                  />
                </span>
                <span className="admin-header-wordmark">
                  <span className="admin-header-wordmark-title">Gateway Church</span>
                  <span className="admin-header-wordmark-kicker">Platform Admin</span>
                </span>
              </Link>
            </div>

            <div className="admin-header-right platform-header-right">
              {email && (
                <span className="platform-header-email" title={email}>
                  {email}
                </span>
              )}
              <button
                type="button"
                className="platform-signout"
                onClick={() => void signOut()}
              >
                <i className="pi pi-sign-out" aria-hidden="true" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </header>

        <main className="platform-main">
          <div className="admin-layout-page">{children}</div>
        </main>
      </div>
    </ToastProvider>
  );
}

export default PlatformAdminShell;
