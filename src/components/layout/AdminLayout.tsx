/**
 * AdminLayout Component
 *
 * Modern, clean admin layout with seamless transitions
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

export interface AdminLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  showBreadcrumbs?: boolean;
  className?: string;
}

const SIDEBAR_WIDTH = 260;
const HEADER_HEIGHT = 64;

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

  return (
    <ToastProvider>
      <div style={styles.layout}>
        {/* Header */}
        <header style={styles.header}>
          <Header />
        </header>

        {/* Overlay */}
        <div
          style={{
            ...styles.overlay,
            opacity: isMobile && isOpen ? 1 : 0,
            visibility: isMobile && isOpen ? 'visible' : 'hidden',
          }}
          onClick={handleOverlayClick}
          aria-hidden="true"
        />

        {/* Sidebar */}
        <aside
          style={{
            ...styles.sidebar,
            top: isMobile ? 0 : HEADER_HEIGHT,
            zIndex: isMobile ? 200 : 80,
            transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          }}
        >
          <div
            style={{
              ...styles.sidebarInner,
              paddingTop: isMobile ? HEADER_HEIGHT : 0,
            }}
          >
            <Sidebar />
          </div>
        </aside>

        {/* Main */}
        <main
          style={{
            ...styles.main,
            marginLeft: sidebarVisible ? SIDEBAR_WIDTH : 0,
          }}
        >
          <div style={styles.content}>
            {showBreadcrumbs && (
              <div style={styles.breadcrumbs}>
                <Breadcrumbs />
              </div>
            )}

            <div style={styles.pageContent} className={className}>
              {children}
            </div>

            {showFooter && (
              <div style={styles.footer}>
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

const styles: Record<string, React.CSSProperties> = {
  layout: {
    minHeight: '100vh',
    background: '#f8f9fa',
  },
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 100,
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 150,
    transition: 'opacity 0.25s ease, visibility 0.25s ease',
  },
  sidebar: {
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    transition: 'transform 0.25s ease',
  },
  sidebarInner: {
    height: '100%',
    background: '#ffffff',
    borderRight: '1px solid #e9ecef',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  main: {
    minHeight: '100vh',
    paddingTop: HEADER_HEIGHT,
    transition: 'margin-left 0.25s ease',
    background: '#f8f9fa',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
  },
  breadcrumbs: {
    padding: '12px 24px',
    background: '#ffffff',
    borderBottom: '1px solid #e9ecef',
  },
  pageContent: {
    flex: 1,
    padding: '24px',
  },
  footer: {
    marginTop: 'auto',
  },
};

export default AdminLayout;
