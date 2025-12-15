/**
 * Sidebar Component
 *
 * Main navigation sidebar
 * Follows the Angular church-campus-admin sidebar layout
 */

'use client';

import React from 'react';
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

// Menu structure matching Angular SidebarMenuComponent
const menuItems: SidebarMenuItem[] = [
  // HOME Section
  {
    label: 'HOME',
    icon: '',
    isHeader: true,
  },
  {
    label: 'Dashboard',
    icon: 'pi pi-home',
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
  /** Additional CSS classes */
  className?: string;
}

export function Sidebar({ className = '' }: SidebarProps) {
  const pathname = usePathname();
  const { isOpen, close, expandedItems, toggleExpand } = useSidebarStore();
  const { hasRole } = useAuth();
  const { isMobile } = useResponsive();

  const isActive = (path?: string) => {
    if (!path) return false;
    return pathname === path || pathname.startsWith(path + '/');
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
        <li key={item.label} className="pt-4 pb-2 first:pt-0">
          <span className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {item.label}
          </span>
        </li>
      );
    }

    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.label);
    const active = isParentActive(item);

    const itemContent = (
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
          active
            ? 'bg-primary/10 text-primary'
            : 'text-gray-600 hover:bg-gray-100'
        } ${depth > 0 ? 'ml-6' : ''}`}
        onClick={() => {
          if (hasChildren) {
            toggleExpand(item.label);
          } else if (isMobile) {
            close();
          }
        }}
      >
        <i className={`${item.icon} text-lg`} />
        <span className="flex-1 font-medium">{item.label}</span>
        {item.badge && (
          <span className="px-2 py-0.5 text-xs bg-primary text-white rounded-full">
            {item.badge}
          </span>
        )}
        {hasChildren && (
          <i
            className={`pi ${
              isExpanded ? 'pi-chevron-down' : 'pi-chevron-right'
            } text-sm transition-transform`}
          />
        )}
      </div>
    );

    return (
      <li key={item.label}>
        {item.path && !hasChildren ? (
          <Link href={item.path} onClick={() => isMobile && close()}>
            {itemContent}
          </Link>
        ) : (
          itemContent
        )}

        {/* Children */}
        {hasChildren && isExpanded && (
          <ul className="mt-1 space-y-1">
            {item.children!.map((child) => renderMenuItem(child, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  // Backdrop for mobile (overlay sidebar)
  const backdrop = isMobile && isOpen && (
    <div
      className="fixed inset-0 bg-black/50 z-40"
      onClick={close}
      aria-hidden="true"
    />
  );

  return (
    <>
      {backdrop}
      <aside className={`sidebar-container ${className}`}>
        {/* Sidebar body with menu */}
        <div className="sidebar-body pt-2 pb-2">
          <nav className="p-2">
            <ul className="space-y-1">
              {menuItems.map((item) => renderMenuItem(item))}
            </ul>
          </nav>
        </div>

        {/* Sidebar footer (placeholder for future use) */}
        <div className="sidebar-footer" />

        {/* Sidebar styles matching Angular SCSS */}
        <style jsx>{`
          .sidebar-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
          }

          .sidebar-body {
            flex: 1;
            overflow-y: auto;
          }

          .sidebar-footer {
            /* Reserved for future footer content */
          }
        `}</style>
      </aside>
    </>
  );
}

export default Sidebar;
