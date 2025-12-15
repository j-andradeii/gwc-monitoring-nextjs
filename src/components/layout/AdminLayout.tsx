/**
 * AdminLayout Component
 *
 * Modern, elegant admin portal layout with Header, Sidebar, Footer and main content.
 * Sidebar automatically hides on screens less than 768px width.
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

const SIDEBAR_WIDTH = 280;
const HEADER_HEIGHT = 72;

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
    if (isMobile) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [isMobile, setIsOpen]);

  const handleOverlayClick = useCallback(() => {
    if (isMobile && isOpen) {
      close();
    }
  }, [isMobile, isOpen, close]);

  // Dynamic styles
  const layoutStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #f9f8f6 0%, #f5f4f2 50%, #f1f0ed 100%)',
    position: 'relative',
  };

  const headerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 100,
  };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(26, 26, 26, 0.6)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    zIndex: 90,
    opacity: isMobile && isOpen ? 1 : 0,
    visibility: isMobile && isOpen ? 'visible' : 'hidden',
    transition: 'opacity 0.3s ease, visibility 0.3s ease',
  };

  const sidebarStyle: React.CSSProperties = {
    position: 'fixed',
    top: isMobile ? 0 : HEADER_HEIGHT,
    left: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    zIndex: isMobile ? 110 : 95,
    transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease',
    boxShadow: isMobile ? '6px 0 24px rgba(0, 0, 0, 0.12)' : 'none',
  };

  const sidebarInnerStyle: React.CSSProperties = {
    height: '100%',
    background: '#ffffff',
    borderRight: '1px solid rgba(0, 0, 0, 0.05)',
    boxShadow: '2px 0 16px rgba(0, 0, 0, 0.03)',
    overflowY: 'auto',
    overflowX: 'hidden',
    paddingTop: isMobile ? HEADER_HEIGHT : 0,
  };

  const mainStyle: React.CSSProperties = {
    minHeight: '100vh',
    paddingTop: HEADER_HEIGHT,
    marginLeft: isOpen && !isMobile ? SIDEBAR_WIDTH : 0,
    transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
  };

  const breadcrumbsStyle: React.CSSProperties = {
    padding: '14px 24px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
    position: 'sticky',
    top: HEADER_HEIGHT,
    zIndex: 50,
  };

  const pageContentStyle: React.CSSProperties = {
    flex: 1,
    padding: '24px',
  };

  const footerContainerStyle: React.CSSProperties = {
    marginTop: 'auto',
  };

  return (
    <ToastProvider>
      <div style={layoutStyle}>
        {/* Fixed Header */}
        <header style={headerStyle}>
          <Header />
        </header>

        {/* Mobile overlay */}
        <div
          style={overlayStyle}
          onClick={handleOverlayClick}
          aria-hidden="true"
        />

        {/* Sidebar */}
        <aside style={sidebarStyle}>
          <div style={sidebarInnerStyle}>
            <Sidebar />
          </div>
        </aside>

        {/* Main content */}
        <main style={mainStyle}>
          <div style={contentStyle}>
            {showBreadcrumbs && (
              <div style={breadcrumbsStyle}>
                <Breadcrumbs />
              </div>
            )}

            <div style={pageContentStyle} className={className}>
              {children}
            </div>

            {showFooter && (
              <div style={footerContainerStyle}>
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
