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

  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile, setIsOpen]);

  const handleOverlayClick = useCallback(() => {
    if (isMobile && isOpen) close();
  }, [isMobile, isOpen, close]);

  const sidebarVisible = isOpen && !isMobile;
  const overlayVisible = isMobile && isOpen;

  return (
    <ToastProvider>
      <div className="admin-layout">
        <header className="admin-layout-header">
          <Header />
        </header>

        <div
          className={`admin-layout-overlay${overlayVisible ? ' is-visible' : ''}`}
          onClick={handleOverlayClick}
          aria-hidden="true"
        />

        <aside
          className={[
            'admin-layout-sidebar',
            isMobile ? 'is-mobile' : '',
            isOpen ? 'is-open' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <div className="admin-layout-sidebar-inner">
            <Sidebar />
          </div>
        </aside>

        <main className={`admin-layout-main${sidebarVisible ? ' is-sidebar-visible' : ''}`}>
          <div className="admin-layout-content">
            {showBreadcrumbs && (
              <div className="admin-layout-breadcrumbs">
                <Breadcrumbs />
              </div>
            )}

            <div className={`admin-layout-page ${className}`.trim()}>{children}</div>

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
