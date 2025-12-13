/**
 * AdminLayout Component
 *
 * Main layout wrapper for admin pages
 */

'use client';

import React, { useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
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
  /** Additional CSS classes for main content */
  className?: string;
}

export function AdminLayout({
  children,
  showFooter = true,
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
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar />

        {/* Header */}
        <Header />

        {/* Main Content */}
        <main
          className={`pt-16 lg:pl-64 min-h-screen flex flex-col ${className}`}
        >
          <div className="flex-1 p-4 md:p-6">
            {children}
          </div>

          {/* Footer */}
          {showFooter && <Footer isAdmin />}
        </main>

        {/* Global Loading Spinner */}
        {isLoading && <PageSpinner />}
      </div>
    </ToastProvider>
  );
}

export default AdminLayout;
