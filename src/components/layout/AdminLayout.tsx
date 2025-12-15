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
  /** Page content */
  children: React.ReactNode;
  /** Show footer */
  showFooter?: boolean;
  /** Show breadcrumbs */
  showBreadcrumbs?: boolean;
  /** Additional CSS classes for main content */
  className?: string;
}

const SIDEBAR_WIDTH = 280;
const SIDEBAR_COLLAPSED_WIDTH = 0;

export function AdminLayout({
  children,
  showFooter = true,
  showBreadcrumbs = true,
  className = '',
}: AdminLayoutProps) {
  const { isMobile } = useResponsive();
  const { isOpen, setIsOpen, close } = useSidebarStore();
  const { isLoading } = useLoadingStore();

  // Auto-close sidebar on mobile (< 768px), auto-open on desktop
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [isMobile, setIsOpen]);

  // Close sidebar when clicking overlay on mobile
  const handleOverlayClick = useCallback(() => {
    if (isMobile && isOpen) {
      close();
    }
  }, [isMobile, isOpen, close]);

  // Get sidebar width based on state
  const sidebarWidth = isOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH;

  return (
    <ToastProvider>
      <div className="admin-layout">
        {/* Fixed Header */}
        <Header />

        {/* Mobile overlay when sidebar is open */}
        {isMobile && isOpen && (
          <div
            className="sidebar-overlay"
            onClick={handleOverlayClick}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`admin-sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'} ${
            isMobile ? 'sidebar-mobile' : 'sidebar-desktop'
          }`}
        >
          <Sidebar />
        </aside>

        {/* Main content area */}
        <div
          className="admin-main"
          style={{
            marginLeft: isMobile ? 0 : sidebarWidth,
          }}
        >
          <div className="admin-content">
            {/* Breadcrumbs */}
            {showBreadcrumbs && (
              <div className="breadcrumbs-container">
                <Breadcrumbs />
              </div>
            )}

            {/* Page content */}
            <main className={`page-content ${className}`}>{children}</main>

            {/* Footer */}
            {showFooter && (
              <Footer isAdmin />
            )}
          </div>
        </div>

        {/* Global Loading Spinner */}
        {isLoading && <PageSpinner />}

        <style jsx>{`
          .admin-layout {
            min-height: 100vh;
            background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
          }

          /* Sidebar overlay for mobile */
          .sidebar-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            z-index: 40;
            transition: opacity 0.3s ease;
          }

          /* Sidebar styles */
          .admin-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            width: ${SIDEBAR_WIDTH}px;
            padding-top: 100px; /* Account for header height */
            background: linear-gradient(180deg, #ffffff 0%, #fafbfc 100%);
            border-right: 1px solid rgba(0, 0, 0, 0.06);
            box-shadow: 2px 0 20px rgba(0, 0, 0, 0.03);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 45;
            overflow-y: auto;
            overflow-x: hidden;
          }

          .admin-sidebar::-webkit-scrollbar {
            width: 6px;
          }

          .admin-sidebar::-webkit-scrollbar-track {
            background: transparent;
          }

          .admin-sidebar::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 3px;
          }

          .admin-sidebar::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 0, 0, 0.2);
          }

          /* Desktop sidebar states */
          .sidebar-desktop.sidebar-open {
            transform: translateX(0);
          }

          .sidebar-desktop.sidebar-closed {
            transform: translateX(-100%);
          }

          /* Mobile sidebar states */
          .sidebar-mobile {
            z-index: 50;
          }

          .sidebar-mobile.sidebar-open {
            transform: translateX(0);
          }

          .sidebar-mobile.sidebar-closed {
            transform: translateX(-100%);
          }

          /* Main content area */
          .admin-main {
            min-height: 100vh;
            padding-top: 100px; /* Account for header height */
            transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .admin-content {
            display: flex;
            flex-direction: column;
            min-height: calc(100vh - 100px);
            padding: 0;
          }

          /* Breadcrumbs container */
          .breadcrumbs-container {
            padding: 1rem 1.5rem;
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(0, 0, 0, 0.04);
          }

          /* Page content */
          .page-content {
            flex: 1;
            padding: 1.5rem;
          }

          /* Responsive adjustments */
          @media (max-width: 767px) {
            .admin-main {
              margin-left: 0 !important;
            }

            .page-content {
              padding: 1rem;
            }

            .breadcrumbs-container {
              padding: 0.75rem 1rem;
            }
          }

          @media (min-width: 768px) {
            .page-content {
              padding: 2rem;
            }

            .breadcrumbs-container {
              padding: 1rem 2rem;
            }
          }

          @media (min-width: 1024px) {
            .page-content {
              padding: 2rem 2.5rem;
            }
          }
        `}</style>
      </div>
    </ToastProvider>
  );
}

export default AdminLayout;
