/**
 * Header Component
 *
 * Main application header with user info and navigation
 */

'use client';

import React from 'react';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSidebarStore } from '@/stores/sidebar.store';
import { useResponsive } from '@/hooks/useResponsive';

export interface HeaderProps {
  /** Additional CSS classes */
  className?: string;
}

export function Header({ className = '' }: HeaderProps) {
  const menuRef = useRef<Menu>(null);
  const { user, logout } = useAuth();
  const { toggle } = useSidebarStore();
  const { isMobile } = useResponsive();

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

  return (
    <header
      className={`fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white border-b border-gray-200 z-30 ${className}`}
    >
      <div className="flex items-center justify-between h-full px-4">
        {/* Left side - Menu toggle (mobile) */}
        <div className="flex items-center gap-4">
          {isMobile && (
            <button
              onClick={toggle}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <i className="pi pi-bars text-xl" />
            </button>
          )}

          {/* Page title or search could go here */}
        </div>

        {/* Right side - User menu */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative"
            aria-label="Notifications"
          >
            <i className="pi pi-bell text-xl" />
            {/* Notification badge */}
            {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" /> */}
          </button>

          {/* User menu */}
          <div
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
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
              className="bg-primary text-white"
            />
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-800">{userName}</p>
              <p className="text-xs text-gray-500">{userRole}</p>
            </div>
            <i className="pi pi-chevron-down text-gray-400 text-xs hidden md:block" />
          </div>

          <Menu
            ref={menuRef}
            model={userMenuItems}
            popup
            popupAlignment="right"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
