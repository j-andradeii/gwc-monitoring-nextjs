/**
 * Header Component
 *
 * Main application header with user info and navigation
 * Follows the Angular church-campus-admin header layout
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
import { useResponsive } from '@/hooks/useResponsive';
import { ROUTES } from '@/core/constants';

export interface HeaderProps {
  /** Additional CSS classes */
  className?: string;
}

export function Header({ className = '' }: HeaderProps) {
  const menuRef = useRef<Menu>(null);
  const { user, logout } = useAuth();
  const { isOpen, toggle, setIsOpen } = useSidebarStore();
  const { isMobile, isDesktop } = useResponsive();

  const userMenuItems: MenuItem[] = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => {
        // Navigate to profile
      },
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      command: () => {
        // Navigate to settings
      },
    },
    { separator: true },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: logout,
    },
  ];

  const userName = user?.member
    ? `${user.member.first_name || ''} ${user.member.last_name || ''}`.trim() || 'User'
    : 'User';

  const userInitials = user?.member
    ? `${user.member.first_name?.charAt(0) || ''}${user.member.last_name?.charAt(0) || ''}`.toUpperCase()
    : 'U';

  const userRole = user?.church_campus_staff?.role || '';

  // Handle sidebar toggle based on screen size
  const handleSidebarToggle = () => {
    if (isMobile) {
      // Mobile: Show overlay sidebar
      toggle();
    } else {
      // Desktop: Toggle sidebar visibility (activate/deactivate)
      setIsOpen(!isOpen);
    }
  };

  return (
    <header className={`header-container ${className}`}>
      <div className="main-top-bar">
        <div className="flex items-center gap-4 pl-5">
          {/* Logo */}
          <Link href={ROUTES.DASHBOARD} className="logo">
            <Image
              src="/assets/images/church-logo-white.png"
              alt="Gateway Church"
              width={65}
              height={65}
              priority
            />
          </Link>

          {/* Sidebar toggle button */}
          <button
            onClick={handleSidebarToggle}
            className={`header-menu-button ${!isOpen && isDesktop ? 'rotate' : ''}`}
            aria-label="Toggle sidebar"
          >
            <i className="pi pi-chevron-left text-white text-lg" />
          </button>
        </div>

        {/* Right side - User menu */}
        <div className="flex items-center gap-4 pr-5">
          {/* Notifications */}
          <button
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors relative"
            aria-label="Notifications"
          >
            <i className="pi pi-bell text-xl" />
          </button>

          {/* User menu */}
          <div
            className="flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg p-2 transition-colors"
            onClick={(e) => menuRef.current?.toggle(e)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                menuRef.current?.toggle(e as unknown as React.SyntheticEvent);
              }
            }}
          >
            <Avatar
              image={user?.member?.photo_url || undefined}
              label={!user?.member?.photo_url ? userInitials : undefined}
              size="normal"
              shape="circle"
              className="bg-white/20 text-white"
            />
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-white">{userName}</p>
              <p className="text-xs text-white/70">{userRole}</p>
            </div>
            <i className="pi pi-chevron-down text-white/70 text-xs hidden md:block" />
          </div>

          <Menu
            ref={menuRef}
            model={userMenuItems}
            popup
            popupAlignment="right"
          />
        </div>
      </div>

      {/* Header styles matching Angular SCSS */}
      <style jsx>{`
        .header-container {
          background-color: var(--primary, #6366f1);
          box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
          width: 100%;
          padding: 18px 0;
          backdrop-filter: blur(10px);
        }

        .main-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: var(--header-height, 3.5rem);
        }

        .logo {
          cursor: pointer;
          padding-right: 0.5rem;
        }

        .logo :global(img) {
          height: 65px;
          width: auto;
        }

        .header-menu-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.5rem;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: transform 0.3s ease, background-color 0.2s ease;
        }

        .header-menu-button:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .header-menu-button.rotate {
          transform: rotate(180deg);
        }
      `}</style>
    </header>
  );
}

export default Header;
