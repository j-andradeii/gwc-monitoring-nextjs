/**
 * AdminLayout Component
 *
 * Main layout wrapper for admin pages
 * Follows the Angular church-campus-admin-portal layout structure
 */

'use client';

import React, { useEffect } from 'react';
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

export function AdminLayout({
  children,
  showFooter = true,
  showBreadcrumbs = true,
  className = '',
}: AdminLayoutProps) {
  const { isDesktop } = useResponsive();
  const { isOpen, setIsOpen } = useSidebarStore();
  const { isLoading } = useLoadingStore();

  // Auto-open sidebar on desktop, close on mobile
  useEffect(() => {
    if (isDesktop && !isOpen) {
      setIsOpen(true);
    } else if (!isDesktop && isOpen) {
      setIsOpen(false);
    }
  }, [isDesktop, isOpen, setIsOpen]);

  return (
    <ToastProvider>
      {/* Main container matching Angular main-container */}
      <main className="overflow-x-hidden">
        <div className="main-container w-full min-h-screen">
          {/* Header - Full width at top */}
          <div className="grid-header w-full">
            <Header />
          </div>

          {/* Layout body with sidebar and content */}
          <div
            className={`layout-body ${
              isOpen ? 'layout-static' : 'layout-static-inactive'
            }`}
          >
            {/* Sidebar - Fixed position */}
            <div className="sidebar-wrapper">
              <Sidebar />
            </div>

            {/* Router/Content area */}
            <div className="router-div">
              {/* Breadcrumbs */}
              {showBreadcrumbs && (
                <div className="w-full">
                  <Breadcrumbs className="mb-4" />
                </div>
              )}

              {/* Main Content */}
              <div className={`w-full flex-1 ${className}`}>{children}</div>

              {/* Footer */}
              {showFooter && (
                <div className="w-full mt-auto">
                  <Footer isAdmin />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Global Loading Spinner */}
        {isLoading && <PageSpinner />}
      </main>

      {/* Layout styles matching Angular SCSS */}
      <style jsx>{`
        .main-container {
          overflow: hidden;
          background-color: var(--surface-ground, #f8fafc);
        }

        .grid-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }

        .layout-body {
          display: flex;
          min-height: 100vh;
        }

        .sidebar-wrapper {
          position: fixed;
          width: 18rem;
          height: calc(100vh - 10rem);
          z-index: 999;
          overflow-y: auto;
          user-select: none;
          top: 8rem;
          left: 2rem;
          transition: transform 0.3s ease, left 0.3s ease;
          background-color: var(--surface-overlay, #ffffff);
          border-radius: var(--curved-radius, 0.75rem);
          padding: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .router-div {
          padding: 2.3rem 2rem 1rem 2rem;
          transition: margin-left 0.3s ease;
          width: 100%;
          min-height: calc(100vh - 5.7rem);
          margin-top: 5.7rem;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        /* Desktop - Sidebar visible */
        @media (min-width: 1200px) {
          .layout-static .router-div {
            margin-left: 20rem;
          }

          .layout-static-inactive .router-div {
            margin-left: 0;
            padding-left: 2rem;
          }

          .layout-static-inactive .sidebar-wrapper {
            transform: translateX(-100%);
            left: 0;
          }
        }

        /* Mobile - Sidebar hidden by default */
        @media (max-width: 1199px) {
          .sidebar-wrapper {
            transform: translateX(-100%);
            left: 0;
            top: 0;
            height: 100vh;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            transition: transform 0.4s cubic-bezier(0.05, 0.74, 0.2, 0.99),
              left 0.4s cubic-bezier(0.05, 0.74, 0.2, 0.99);
          }

          .router-div {
            padding: 1rem;
            margin-left: 0;
          }
        }

        @media (max-width: 720px) {
          .router-div {
            padding: 1rem;
          }
        }
      `}</style>
    </ToastProvider>
  );
}

export default AdminLayout;
