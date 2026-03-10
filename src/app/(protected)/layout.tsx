/**
 * Protected Layout
 *
 * Parent layout for all protected/admin pages.
 * These pages should never be indexed by search engines.
 */

import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
