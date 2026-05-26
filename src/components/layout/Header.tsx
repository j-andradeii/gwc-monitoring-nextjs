'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { useAuth } from '@/hooks/useAuth';
import { useSidebarStore } from '@/stores/sidebar.store';
import { useResponsive } from '@/hooks/useResponsive';
import { ROUTES } from '@/core/constants';
import '@/styles/admin.css';

export interface HeaderProps {
  className?: string;
}

export function Header({ className = '' }: HeaderProps) {
  const menuRef = useRef<Menu>(null);
  const { user, logout } = useAuth();
  const { isOpen, toggle, setIsOpen } = useSidebarStore();
  const { isMobile } = useResponsive();

  const userMenuItems: MenuItem[] = [
    { label: 'Profile', icon: 'pi pi-user', command: () => {} },
    { label: 'Settings', icon: 'pi pi-cog', command: () => {} },
    { separator: true },
    { label: 'Logout', icon: 'pi pi-sign-out', command: logout },
  ];

  const userName = user?.member
    ? `${user.member.first_name || ''} ${user.member.last_name || ''}`.trim() || 'User'
    : 'User';

  const userInitials = user?.member
    ? `${user.member.first_name?.charAt(0) || ''}${user.member.last_name?.charAt(0) || ''}`.toUpperCase()
    : 'U';

  const userRole = user?.church_campus_staff?.role || '';

  const handleSidebarToggle = () => {
    if (isMobile) {
      toggle();
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <header className={`admin-header ${className}`.trim()}>
      <div className="admin-header-inner">
        <div className="admin-header-left">
          <button
            type="button"
            onClick={handleSidebarToggle}
            className={`admin-header-menu-toggle${isOpen ? ' is-open' : ''}`}
            aria-label="Toggle sidebar"
            aria-expanded={isOpen}
          >
            <span className="line" />
            <span className="line" />
            <span className="line" />
          </button>

          <Link href={ROUTES.DASHBOARD} className="admin-header-logo-link">
            <div className="admin-header-logo">
              <Image
                src="/assets/images/church-logo-white.png"
                alt="Gateway Church"
                width={32}
                height={32}
                priority
                style={{ objectFit: 'contain' }}
              />
            </div>
          </Link>
        </div>

        <div className="admin-header-right">
          <button type="button" className="admin-header-action" aria-label="Search">
            <i className="pi pi-search" style={{ fontSize: 16 }} />
          </button>

          <button type="button" className="admin-header-action" aria-label="Notifications">
            <i className="pi pi-bell" style={{ fontSize: 16 }} />
            <span className="admin-header-badge">3</span>
          </button>

          <div className="admin-header-divider" />

          <button
            type="button"
            className="admin-header-user"
            onClick={(e) => menuRef.current?.toggle(e)}
            aria-haspopup="menu"
            aria-label="User menu"
          >
            <Avatar
              image={user?.member?.photo_url || undefined}
              label={!user?.member?.photo_url ? userInitials : undefined}
              size="normal"
              shape="circle"
            />
            {!isMobile && (
              <>
                <div className="admin-header-user-info">
                  <span className="admin-header-user-name">{userName}</span>
                  <span className="admin-header-user-role">{userRole}</span>
                </div>
                <i className="pi pi-chevron-down admin-header-user-chevron" />
              </>
            )}
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
