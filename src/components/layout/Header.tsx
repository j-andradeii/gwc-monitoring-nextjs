/**
 * Admin Header
 *
 * Navy chrome bar: sidebar toggle, brand lockup ("Gateway Church · Campus Admin")
 * and the signed-in user's menu. Only controls that work are shown — search and
 * notifications return when they have a backend. Styles: src/styles/admin.css.
 */

'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { useAuth } from '@/hooks/useAuth';
import { useSidebarStore } from '@/stores/sidebar.store';
import { ROUTES } from '@/core/constants';
import { formatEnumLabel } from '@/core/utils';
import '@/styles/admin.css';

export interface HeaderProps {
  className?: string;
}

export function Header({ className = '' }: HeaderProps) {
  const menuRef = useRef<Menu>(null);
  const { user, logout } = useAuth();
  const { isOpen, toggle } = useSidebarStore();

  const member = user?.member;
  const userName = `${member?.first_name ?? ''} ${member?.last_name ?? ''}`.trim() || 'User';
  const userInitials =
    `${member?.first_name?.charAt(0) ?? ''}${member?.last_name?.charAt(0) ?? ''}`.toUpperCase() || 'U';
  const userRole = formatEnumLabel(user?.church_campus_staff?.role);
  const campusName =
    user?.church_campus_staff?.church_campus?.name ||
    user?.church_campus_staff?.church_campus?.church?.name ||
    'Gateway Church';

  const userMenuItems: MenuItem[] = [
    {
      template: () => (
        <div className="admin-user-menu-header">
          <span className="admin-user-menu-name">{userName}</span>
          <span className="admin-user-menu-meta">
            {[userRole, campusName].filter(Boolean).join(' · ')}
          </span>
        </div>
      ),
    },
    { separator: true },
    { label: 'Sign out', icon: 'pi pi-sign-out', command: logout },
  ];

  return (
    <header className={`admin-header ${className}`.trim()}>
      <div className="admin-header-inner">
        <div className="admin-header-left">
          <button
            type="button"
            onClick={toggle}
            className={`admin-header-menu-toggle${isOpen ? ' is-open' : ''}`}
            aria-label={isOpen ? 'Hide navigation' : 'Show navigation'}
            aria-expanded={isOpen}
            aria-controls="admin-sidebar"
          >
            <span className="line" />
            <span className="line" />
            <span className="line" />
          </button>

          <Link href={ROUTES.DASHBOARD} className="admin-header-brand" aria-label="Campus Admin dashboard">
            <span className="admin-header-logo" aria-hidden="true">
              <Image
                src="/assets/images/church-logo-white.png"
                alt=""
                width={30}
                height={17}
                priority
              />
            </span>
            <span className="admin-header-wordmark">
              <span className="admin-header-wordmark-title">Gateway Church</span>
              <span className="admin-header-wordmark-kicker">Campus Admin</span>
            </span>
          </Link>
        </div>

        <div className="admin-header-right">
          <button
            type="button"
            className="admin-header-user"
            onClick={(e) => menuRef.current?.toggle(e)}
            aria-haspopup="menu"
            aria-label={`Account menu for ${userName}`}
          >
            <Avatar
              image={member?.photo_url || undefined}
              label={!member?.photo_url ? userInitials : undefined}
              shape="circle"
              className="admin-header-avatar"
            />
            <span className="admin-header-user-info">
              <span className="admin-header-user-name">{userName}</span>
              {userRole && <span className="admin-header-user-role">{userRole}</span>}
            </span>
            <i className="pi pi-chevron-down admin-header-user-chevron" aria-hidden="true" />
          </button>

          <Menu
            ref={menuRef}
            model={userMenuItems}
            popup
            popupAlignment="right"
            className="admin-user-menu"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
