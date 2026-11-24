/**
 * AdminPageHeader
 *
 * The top of every admin page: gold eyebrow, page title, one-line
 * subtitle and an optional actions slot (right-aligned on desktop, full width on
 * mobile). Styles: `.admin-dash-page-header*` in src/styles/admin-dashboard.css.
 */

import React from 'react';
import '@/styles/admin-dashboard.css';

export interface AdminPageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}

export function AdminPageHeader({ eyebrow, title, subtitle, actions }: AdminPageHeaderProps) {
  return (
    <header className="admin-dash-page-header">
      <div className="admin-dash-header-meta">
        {eyebrow && <p className="admin-dash-eyebrow">{eyebrow}</p>}
        <h1 className="admin-dash-title">{title}</h1>
        {subtitle && <p className="admin-dash-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="admin-dash-header-actions">{actions}</div>}
    </header>
  );
}

export default AdminPageHeader;
