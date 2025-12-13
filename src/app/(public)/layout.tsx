/**
 * Public Layout
 *
 * Layout for public pages (landing, sermon-notes)
 */

import React from 'react';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
