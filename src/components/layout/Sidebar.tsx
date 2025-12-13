/**
 * Sidebar Component
 *
 * Main navigation sidebar
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
}

const menuItems: SidebarMenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'pi pi-home',
    path: ROUTES.DASHBOARD,
  },
  {
    label: 'Church Detail',
    icon: 'pi pi-building',
    children: [
      {
        label: 'Church Info',
        icon: 'pi pi-info-circle',
        path: ROUTES.CHURCH_INFO,
      },
      {
        label: 'Pastoral Staffs',
        icon: 'pi pi-users',
        path: ROUTES.PASTORAL_STAFFS,
      },
      {
        label: 'Church Config',
        icon: 'pi pi-cog',
        path: ROUTES.CHURCH_CONFIG,
        roles: ['SENIOR_PASTOR'],
      },
    ],
  },
  {
    label: 'Church Members',
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
  {
    label: 'Campaigns',
    icon: 'pi pi-megaphone',
    path: ROUTES.CHURCH_CAMPAIGNS,
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

  // Backdrop for mobile
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
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${className}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">GWC</span>
            <span className="text-xl font-light text-gray-600">Monitoring</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 overflow-y-auto" style={{ height: 'calc(100% - 4rem)' }}>
          <ul className="space-y-1">
            {menuItems.map((item) => renderMenuItem(item))}
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
