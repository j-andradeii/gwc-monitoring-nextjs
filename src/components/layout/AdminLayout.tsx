/**
 * AdminLayout
 *
 * The admin shell: fixed navy header, sidebar (pinned on desktop, drawer on
 * mobile), page area with breadcrumbs, and a slim footer. Styles live in
 * src/styles/admin-layout.css (tokens shared by every admin surface).
 */

'use client';

import React, { useEffect, useCallback } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { Breadcrumbs } from './Breadcrumbs';
import { ToastProvider } from '@/components/ui/Toast';
import { PageSpinner } from '@/components/ui/Spinner';
import { useSidebarStore } from '@/stores/sidebar.store';
import { useLoadingStore } from '@/stores/loading.store';
import { useResponsive } from '@/hooks/useResponsive';
import '@/styles/admin-layout.css';

export interface AdminLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  showBreadcrumbs?: boolean;
  className?: string;
}

export function AdminLayout({
  children,
  showFooter = true,
  showBreadcrumbs = true,
  className = '',
}: AdminLayoutProps) {
  const { isMobile } = useResponsive();
  const { isOpen, setIsOpen, close } = useSidebarStore();
  const { isLoading } = useLoadingStore();

  // Pinned open on desktop, closed drawer on mobile — re-evaluated on resize.
  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile, setIsOpen]);

  const sidebarVisible = isOpen && !isMobile;
  const overlayVisible = isMobile && isOpen;

  const handleOverlayClick = useCallback(() => {
    if (overlayVisible) close();
  }, [overlayVisible, close]);

  // Escape closes the mobile drawer (keyboard users have no scrim to click).
  useEffect(() => {
    if (!overlayVisible) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [overlayVisible, close]);

  return (
    <ToastProvider>
      <div className="admin-layout">
        <div className="admin-layout-header">
          <Header />
        </div>

        <div
          className={`admin-layout-overlay${overlayVisible ? ' is-visible' : ''}`}
          onClick={handleOverlayClick}
          aria-hidden="true"
        />

        {/* `inert` keeps the off-screen sidebar out of the tab order */}
        <div
          id="admin-sidebar"
          className={[
            'admin-layout-sidebar',
            isMobile ? 'is-mobile' : '',
            isOpen ? 'is-open' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          inert={!isOpen}
        >
          <div className="admin-layout-sidebar-inner">
            <Sidebar />
          </div>
        </div>

        <main className={`admin-layout-main${sidebarVisible ? ' is-sidebar-visible' : ''}`}>
          <div className="admin-layout-content">
            <div className={`admin-layout-page ${className}`.trim()}>
              {showBreadcrumbs && (
                <div className="admin-layout-breadcrumbs">
                  <Breadcrumbs />
                </div>
              )}
              {children}
            </div>

            {showFooter && (
              <div className="admin-layout-footer">
                <Footer isAdmin />
              </div>
            )}
          </div>
        </main>

        {isLoading && <PageSpinner />}
      </div>
    </ToastProvider>
  );
}

export default AdminLayout;
