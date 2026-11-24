/**
 * Sidebar Component
 *
 * Admin navigation: campus card, sectioned menu, "View website" link. On mobile it
 * renders a drawer title bar with a close button. Menu data lives in
 * ./admin-navigation.ts — items with `available: false` show a "Soon" pill and are
 * never links. Styles: src/styles/admin-sidebar.css.
 */

'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebarStore } from '@/stores/sidebar.store';
import { useAuth } from '@/hooks/useAuth';
import { useResponsive } from '@/hooks/useResponsive';
import { formatEnumLabel } from '@/core/utils';
import {
  ADMIN_NAV_SECTIONS,
  isItemActive,
  isPathActive,
  type SidebarMenuItem,
} from './admin-navigation';
import '@/styles/admin-sidebar.css';

export type { SidebarMenuItem } from './admin-navigation';

export interface SidebarProps {
  className?: string;
}

const groupId = (label: string) => `admin-nav-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

export function Sidebar({ className = '' }: SidebarProps) {
  const pathname = usePathname();
  const { close, expandedItems, toggleExpand, expandItem } = useSidebarStore();
  const { user, hasRole } = useAuth();
  const { isMobile } = useResponsive();

  const campus = user?.church_campus_staff?.church_campus;
  const campusName = campus?.name || campus?.church?.name || 'Gateway Church';
  const campusMeta = [campus?.church?.name !== campusName ? campus?.church?.name : null, formatEnumLabel(user?.church_campus_staff?.role)]
    .filter(Boolean)
    .join(' · ');

  // Open the group that holds the current page, so the active link is always
  // visible. Runs on navigation only; the user can still collapse it afterwards.
  // expandItem is idempotent, so StrictMode's double effect can't close it again.
  useEffect(() => {
    ADMIN_NAV_SECTIONS.forEach((section) =>
      section.items.forEach((item) => {
        if (item.children && isItemActive(pathname, item)) expandItem(item.label);
      }),
    );
  }, [pathname, expandItem]);

  const canAccess = (item: SidebarMenuItem) => !item.roles?.length || hasRole(item.roles);
  const onNavigate = () => {
    if (isMobile) close();
  };

  const renderLeaf = (item: SidebarMenuItem, isSub: boolean) => {
    const base = isSub ? 'admin-sidebar-subitem' : 'admin-sidebar-item';
    const content = (
      <>
        {isSub ? (
          <span className="admin-sidebar-subitem-dot" aria-hidden="true" />
        ) : (
          <span className="admin-sidebar-icon" aria-hidden="true">
            <i className={item.icon} />
          </span>
        )}
        <span className="admin-sidebar-label" title={item.label}>{item.label}</span>
        {item.available === false && <span className="admin-sidebar-soon">Soon</span>}
        {item.badge !== undefined && item.available !== false && (
          <span className="admin-sidebar-badge">{item.badge}</span>
        )}
      </>
    );

    if (item.available === false || !item.path) {
      return (
        <span className={`${base} is-soon`} aria-disabled="true" title="Coming soon">
          {content}
        </span>
      );
    }

    const active = isPathActive(pathname, item.path);
    return (
      <Link
        href={item.path}
        className={`${base}${active ? ' is-active' : ''}`}
        aria-current={active ? 'page' : undefined}
        onClick={onNavigate}
      >
        {content}
      </Link>
    );
  };

  const renderItem = (item: SidebarMenuItem) => {
    if (!canAccess(item)) return null;

    if (!item.children?.length) {
      return <li key={item.label}>{renderLeaf(item, false)}</li>;
    }

    const id = groupId(item.label);
    const open = expandedItems.includes(item.label);
    const active = isItemActive(pathname, item);
    const children = item.children.filter(canAccess);

    return (
      <li key={item.label}>
        <button
          type="button"
          className={`admin-sidebar-item admin-sidebar-group${active ? ' is-active-group' : ''}`}
          aria-expanded={open}
          aria-controls={id}
          onClick={() => toggleExpand(item.label)}
        >
          <span className="admin-sidebar-icon" aria-hidden="true">
            <i className={item.icon} />
          </span>
          <span className="admin-sidebar-label" title={item.label}>{item.label}</span>
          <i className="pi pi-chevron-down admin-sidebar-chevron" aria-hidden="true" />
        </button>
        <div className={`admin-sidebar-sublist-wrap${open ? ' is-open' : ''}`} id={id} inert={!open}>
          <ul className="admin-sidebar-sublist">
            {children.map((child) => (
              <li key={child.label}>{renderLeaf(child, true)}</li>
            ))}
          </ul>
        </div>
      </li>
    );
  };

  return (
    <nav className={`admin-sidebar ${className}`.trim()} aria-label="Admin navigation">
      {isMobile && (
        <div className="admin-sidebar-drawer-bar">
          <span className="admin-sidebar-drawer-title">
            <span className="admin-sidebar-drawer-kicker">Campus Admin</span>
            <span>Menu</span>
          </span>
          <button type="button" className="admin-sidebar-close" onClick={close} aria-label="Close navigation">
            <i className="pi pi-times" aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="admin-sidebar-campus">
        <span className="admin-sidebar-campus-icon" aria-hidden="true">
          <i className="pi pi-building" />
        </span>
        <span className="admin-sidebar-campus-text">
          <span className="admin-sidebar-campus-name">{campusName}</span>
          {campusMeta && <span className="admin-sidebar-campus-meta">{campusMeta}</span>}
        </span>
      </div>

      <div className="admin-sidebar-body">
        {ADMIN_NAV_SECTIONS.map((section) => (
          <div key={section.label} className="admin-sidebar-section">
            <p className="admin-sidebar-section-label">{section.label}</p>
            <ul className="admin-sidebar-list">{section.items.map(renderItem)}</ul>
          </div>
        ))}
      </div>

      <div className="admin-sidebar-footer">
        <Link href="/" className="admin-sidebar-footer-link" onClick={onNavigate}>
          <i className="pi pi-globe" aria-hidden="true" />
          <span>View website</span>
          <i className="pi pi-arrow-up-right admin-sidebar-footer-arrow" aria-hidden="true" />
        </Link>
      </div>
    </nav>
  );
}

export default Sidebar;
