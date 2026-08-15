/**
 * Sidebar Component
 *
 * Modern, minimalist navigation sidebar
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebarStore } from '@/stores/sidebar.store';
import { useAuth } from '@/hooks/useAuth';
import { useResponsive } from '@/hooks/useResponsive';
import { ROUTES } from '@/core/constants';
export interface SidebarMenuItem {
  label: string;
  icon: string;
  path?: string;
  children?: SidebarMenuItem[];
  roles?: string[];
  badge?: string | number;
  isHeader?: boolean;
}

// Menu structure
const menuItems: SidebarMenuItem[] = [
  // HOME Section
  {
    label: 'HOME',
    icon: '',
    isHeader: true,
  },
  {
    label: 'Dashboard',
    icon: 'pi pi-th-large',
    path: ROUTES.DASHBOARD,
  },
  {
    label: 'Church Information',
    icon: 'pi pi-building',
    children: [
      {
        label: 'Church Detail',
        icon: 'pi pi-info-circle',
        path: ROUTES.CHURCH_INFO,
      },
      {
        label: 'Pastoral Staffs',
        icon: 'pi pi-users',
        path: ROUTES.PASTORAL_STAFFS,
      },
      {
        label: 'Configuration',
        icon: 'pi pi-cog',
        path: ROUTES.CHURCH_CONFIG,
        roles: ['SENIOR_PASTOR'],
      },
    ],
  },
  {
    label: 'Campaigns',
    icon: 'pi pi-megaphone',
    path: ROUTES.CHURCH_CAMPAIGNS,
  },
  // MEMBERS Section
  {
    label: 'MEMBERS',
    icon: '',
    isHeader: true,
  },
  {
    label: 'Gateway Church Members',
    icon: 'pi pi-users',
    children: [
      {
        label: 'All Members',
        icon: 'pi pi-list',
        path: ROUTES.CHURCH_MEMBERS,
      },
      {
        label: 'Men Network',
        icon: 'pi pi-user',
        path: ROUTES.MEN_NETWORK,
      },
      {
        label: 'Women Network',
        icon: 'pi pi-user',
        path: ROUTES.WOMEN_NETWORK,
      },
    ],
  },
  // WINNING Section
  {
    label: 'WINNING',
    icon: '',
    isHeader: true,
  },
  {
    label: 'Prayer of 3',
    icon: 'pi pi-heart',
    path: '/church-campus-admin/prayer-of-three',
  },
  {
    label: 'Evangelize',
    icon: 'pi pi-send',
    path: '/church-campus-admin/evangelize',
  },
  // CONSOLIDATION Section
  {
    label: 'CONSOLIDATION',
    icon: '',
    isHeader: true,
  },
  {
    label: 'SUYNIL',
    icon: 'pi pi-book',
    path: '/church-campus-admin/suynil',
  },
  // GATEWAY EVENTS Section
  {
    label: 'GATEWAY EVENTS',
    icon: '',
    isHeader: true,
  },
  {
    label: 'Events',
    icon: 'pi pi-calendar',
    path: '/church-campus-admin/events',
  },
];

export interface SidebarProps {
  className?: string;
}

export function Sidebar({ className = '' }: SidebarProps) {
  const pathname = usePathname();
  const { close, expandedItems, toggleExpand } = useSidebarStore();
  const { hasRole } = useAuth();
  const { isMobile } = useResponsive();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const isActive = (path?: string) => {
    if (!path) return false;
    return pathname === path;
  };

  const isParentActive = (item: SidebarMenuItem) => {
    if (item.path) return isActive(item.path);
    return item.children?.some((child) => isActive(child.path));
  };

  const canAccess = (item: SidebarMenuItem) => {
    if (!item.roles || item.roles.length === 0) return true;
    return hasRole(item.roles);
  };

  const renderMenuItem = (item: SidebarMenuItem, depth = 0) => {
    if (!canAccess(item)) return null;

    // Render header items (section dividers)
    if (item.isHeader) {
      return (
        <li key={item.label} style={styles.sectionHeader}>
          <span style={styles.sectionLabel}>{item.label}</span>
        </li>
      );
    }

    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.label);
    const active = isParentActive(item);
    const isSubmenuItem = depth > 0;
    const isHovered = hoveredItem === item.label;

    const menuItemStyle: React.CSSProperties = {
      ...styles.menuItem,
      ...(isHovered && !active && styles.menuItemHover),
      ...(active && styles.menuItemActive),
      ...(isSubmenuItem && styles.submenuItem),
    };

    const iconContainerStyle: React.CSSProperties = {
      ...styles.iconContainer,
      ...(isHovered && !active && styles.iconContainerHover),
      ...(active && styles.iconContainerActive),
      ...(isSubmenuItem && styles.submenuIconContainer),
    };

    const labelStyle: React.CSSProperties = {
      ...styles.menuLabel,
      ...(isHovered && styles.menuLabelHover),
      ...(active && styles.menuLabelActive),
      ...(isSubmenuItem && styles.submenuLabel),
      ...(isSubmenuItem && active && styles.submenuLabelActive),
    };

    const iconStyle: React.CSSProperties = isSubmenuItem
      ? { ...styles.submenuIcon, ...(active && styles.submenuIconActive) }
      : active
        ? styles.iconActive
        : isHovered
          ? styles.iconHover
          : styles.icon;

    const itemContent = (
      <div
        style={menuItemStyle}
        onClick={() => {
          if (hasChildren) {
            toggleExpand(item.label);
          } else if (isMobile) {
            close();
          }
        }}
        onMouseEnter={() => setHoveredItem(item.label)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        {active && !isSubmenuItem && <span style={styles.activeIndicator} />}
        <span style={iconContainerStyle}>
          <i className={item.icon} style={iconStyle} />
        </span>
        <span style={labelStyle}>{item.label}</span>
        {item.badge && <span style={styles.badge}>{item.badge}</span>}
        {hasChildren && (
          <i
            className={`pi ${isExpanded ? 'pi-chevron-down' : 'pi-chevron-right'}`}
            style={{ ...styles.expandIcon, ...(isExpanded && styles.expandIconOpen) }}
          />
        )}
      </div>
    );

    return (
      <li key={item.label} style={styles.menuItemWrapper}>
        {item.path && !hasChildren ? (
          <Link
            href={item.path}
            onClick={() => isMobile && close()}
            style={styles.link}
          >
            {itemContent}
          </Link>
        ) : (
          itemContent
        )}

        {/* Children */}
        {hasChildren && (
          <ul style={{ ...styles.submenu, ...(isExpanded && styles.submenuExpanded) }}>
            {item.children!.map((child) => renderMenuItem(child, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside style={{ ...styles.container, ...(className ? {} : {}) }} className={className}>
      <div style={styles.body}>
        <nav>
          <ul style={styles.menuList}>
            {menuItems.map((item) => renderMenuItem(item))}
          </ul>
        </nav>
      </div>

      <div style={styles.footer}>
        <div style={styles.footerContent}>
          <span style={styles.footerIcon}>
            <i className="pi pi-shield" style={{ fontSize: '16px', color: '#fff' }} />
          </span>
          <div style={styles.footerText}>
            <span style={styles.footerTitle}>Need Help?</span>
            <span style={styles.footerLink}>Contact Support</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
  },
  body: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '8px 10px',
  },
  menuList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  sectionHeader: {
    padding: '12px 12px 6px',
  },
  sectionLabel: {
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '1.2px',
    color: '#9ca3af',
  },
  menuItemWrapper: {
    marginBottom: '2px',
  },
  link: {
    textDecoration: 'none',
    display: 'block',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 10px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    backgroundColor: 'transparent',
    position: 'relative' as const,
  },
  menuItemHover: {
    backgroundColor: '#f9fafb',
  },
  menuItemActive: {
    backgroundColor: 'rgba(192, 160, 103, 0.08)',
  },
  activeIndicator: {
    position: 'absolute' as const,
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '3px',
    height: '20px',
    backgroundColor: '#c0a067',
    borderRadius: '0 4px 4px 0',
  },
  iconContainer: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.15s ease',
  },
  iconContainerHover: {
    backgroundColor: '#e5e7eb',
  },
  iconContainerActive: {
    backgroundColor: '#c0a067',
    boxShadow: '0 2px 8px rgba(192, 160, 103, 0.3)',
  },
  icon: {
    fontSize: '14px',
    color: '#000',
  },
  iconHover: {
    fontSize: '14px',
    color: '#000',
  },
  iconActive: {
    fontSize: '14px',
    color: '#ffffff',
  },
  menuLabel: {
    flex: 1,
    fontSize: '14px',
    fontWeight: 500,
    color: '#000',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    transition: 'color 0.2s ease',
  },
  menuLabelHover: {
    color: '#000',
  },
  menuLabelActive: {
    fontWeight: 600,
    color: '#000',
  },
  badge: {
    padding: '3px 8px',
    borderRadius: '12px',
    fontSize: '10px',
    fontWeight: 600,
    backgroundColor: '#c0a067',
    color: '#ffffff',
  },
  expandIcon: {
    fontSize: '10px',
    color: '#9ca3af',
    transition: 'transform 0.2s ease',
  },
  expandIconOpen: {
    color: '#c0a067',
  },
  submenu: {
    listStyle: 'none',
    margin: 0,
    padding: '2px 0 0 0',
    maxHeight: 0,
    overflow: 'hidden',
    transition: 'max-height 0.2s ease',
  },
  submenuExpanded: {
    maxHeight: '400px',
  },
  submenuItem: {
    paddingLeft: '42px',
    paddingTop: '6px',
    paddingBottom: '6px',
    borderRadius: '6px',
  },
  submenuIconContainer: {
    width: '24px',
    height: '24px',
    backgroundColor: 'transparent',
  },
  submenuIcon: {
    fontSize: '13px',
    color: '#9ca3af',
  },
  submenuIconActive: {
    color: '#c0a067',
  },
  submenuLabel: {
    fontSize: '13px',
    fontWeight: 400,
    color: '#000',
  },
  submenuLabelActive: {
    fontWeight: 500,
    color: '#c0a067',
  },
  footer: {
    padding: '10px',
    borderTop: '1px solid #f3f4f6',
  },
  footerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    backgroundColor: '#fafaf9',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    border: '1px solid #f3f4f6',
  },
  footerIcon: {
    width: '34px',
    height: '34px',
    borderRadius: '8px',
    backgroundColor: '#c0a067',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 2px 6px rgba(192, 160, 103, 0.2)',
  },
  footerText: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
  },
  footerTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#000',
  },
  footerLink: {
    fontSize: '11px',
    color: '#c0a067',
    fontWeight: 600,
  },
};

export default Sidebar;
