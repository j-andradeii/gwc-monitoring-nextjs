/**
 * AdminComingSoon
 *
 * Placeholder panel for an admin page whose feature isn't built yet. Says plainly
 * what will live here and offers one way back, so the page is never a dead end.
 * Styles: `.admin-dash-coming-soon*` in src/styles/admin-dashboard.css.
 */

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/core/constants';
import '@/styles/admin-dashboard.css';

export interface AdminComingSoonProps {
  icon: string;
  title?: string;
  description: React.ReactNode;
  /** Accessible name for the section */
  label: string;
}

export function AdminComingSoon({ icon, title = 'Coming soon', description, label }: AdminComingSoonProps) {
  return (
    <section className="admin-dash-panel admin-dash-coming-soon" aria-label={label}>
      <span className="admin-dash-coming-soon-icon" aria-hidden="true">
        <i className={icon} />
      </span>
      <span className="admin-dash-soon-pill">In development</span>
      <h2 className="admin-dash-coming-soon-title">{title}</h2>
      <p className="admin-dash-coming-soon-text">{description}</p>
      <Link href={ROUTES.DASHBOARD} className="admin-dash-btn-secondary">
        <i className="pi pi-arrow-left" aria-hidden="true" />
        <span>Back to dashboard</span>
      </Link>
    </section>
  );
}

export default AdminComingSoon;
