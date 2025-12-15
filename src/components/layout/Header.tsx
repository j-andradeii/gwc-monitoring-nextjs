/**
 * Header Component
 *
 * Modern, elegant admin header with improved logo and menu design
 * Features gold accent colors matching landing page theme
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
      toggle();
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <header className={`header-container ${className}`}>
      <div className="header-inner">
        {/* Left section - Logo and menu toggle */}
        <div className="header-left">
          {/* Sidebar toggle button - Now first */}
          <button
            onClick={handleSidebarToggle}
            className={`menu-toggle ${isOpen ? 'active' : ''}`}
            aria-label="Toggle sidebar"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>

          {/* Logo */}
          <Link href={ROUTES.DASHBOARD} className="logo-link">
            <div className="logo-wrapper">
              <Image
                src="/assets/images/church-logo-white.png"
                alt="Gateway Church"
                width={44}
                height={44}
                priority
              />
            </div>
          </Link>
        </div>

        {/* Right section - Actions and user menu */}
        <div className="header-right">
          {/* Search button */}
          <button className="header-action-btn" aria-label="Search">
            <i className="pi pi-search" />
          </button>

          {/* Notifications */}
          <button className="header-action-btn has-badge" aria-label="Notifications">
            <i className="pi pi-bell" />
            <span className="notification-badge">3</span>
          </button>

          {/* Divider */}
          <div className="header-divider" />

          {/* User menu */}
          <div
            className="user-menu"
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
              className="user-avatar"
            />
            <div className="user-info">
              <span className="user-name">{userName}</span>
              <span className="user-role">{userRole}</span>
            </div>
            <i className="pi pi-chevron-down dropdown-icon" />
          </div>

          <Menu
            ref={menuRef}
            model={userMenuItems}
            popup
            popupAlignment="right"
            className="user-dropdown-menu"
          />
        </div>
      </div>

      <style jsx>{`
        .header-container {
          background: linear-gradient(135deg, #1a1a1a 0%, #252525 100%);
          width: 100%;
          height: 72px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
          position: relative;
          z-index: 100;
        }

        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          padding: 0 20px;
          max-width: 100%;
        }

        /* Left section */
        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        /* Hamburger Menu Toggle */
        .menu-toggle {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 10px;
        }

        .menu-toggle:hover {
          background: rgba(192, 160, 103, 0.15);
        }

        .menu-toggle:hover .hamburger-line {
          background: var(--primary-gold-accent, #c0a067);
        }

        .hamburger-line {
          display: block;
          width: 22px;
          height: 2px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .menu-toggle.active .hamburger-line:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
          background: var(--primary-gold-accent, #c0a067);
        }

        .menu-toggle.active .hamburger-line:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }

        .menu-toggle.active .hamburger-line:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
          background: var(--primary-gold-accent, #c0a067);
        }

        /* Logo */
        .logo-link {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          transition: all 0.2s ease;
          padding: 6px 10px;
          border-radius: 12px;
        }

        .logo-link:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .logo-wrapper {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: linear-gradient(145deg, var(--primary-gold-accent, #c0a067) 0%, #b8956a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(192, 160, 103, 0.35);
          position: relative;
          overflow: hidden;
        }

        .logo-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 50%;
          background: linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%);
          border-radius: 10px 10px 0 0;
        }

        .logo-wrapper :global(img) {
          width: 32px;
          height: 32px;
          object-fit: contain;
          position: relative;
          z-index: 1;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .logo-title {
          font-size: 17px;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.2;
          letter-spacing: -0.3px;
        }

        .logo-subtitle {
          font-size: 11px;
          font-weight: 600;
          color: var(--primary-gold-accent, #c0a067);
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        /* Right section */
        .header-right {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .header-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
        }

        .header-action-btn:hover {
          background: rgba(192, 160, 103, 0.15);
          color: var(--primary-gold-accent, #c0a067);
        }

        .header-action-btn i {
          font-size: 18px;
        }

        .header-action-btn.has-badge .notification-badge {
          position: absolute;
          top: 6px;
          right: 6px;
          min-width: 18px;
          height: 18px;
          border-radius: 9px;
          background: #ef4444;
          color: #ffffff;
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          border: 2px solid #1a1a1a;
        }

        .header-divider {
          width: 1px;
          height: 28px;
          background: rgba(255, 255, 255, 0.12);
          margin: 0 10px;
        }

        /* User menu */
        .user-menu {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 10px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.25s ease;
          border: 1px solid transparent;
        }

        .user-menu:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .user-menu :global(.user-avatar) {
          background: linear-gradient(145deg, var(--primary-gold-accent, #c0a067) 0%, #b8956a 100%);
          color: #ffffff;
          font-weight: 600;
          font-size: 14px;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          text-align: left;
          gap: 1px;
        }

        .user-name {
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          line-height: 1.2;
        }

        .user-role {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
          text-transform: capitalize;
        }

        .dropdown-icon {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.4);
          transition: transform 0.2s ease;
          margin-left: 4px;
        }

        .user-menu:hover .dropdown-icon {
          color: var(--primary-gold-accent, #c0a067);
        }

        /* Responsive */
        @media (max-width: 767px) {
          .header-inner {
            padding: 0 12px;
          }

          .header-left {
            gap: 8px;
          }

          .logo-text {
            display: none;
          }

          .logo-link {
            padding: 6px;
          }

          .header-divider {
            display: none;
          }

          .user-info {
            display: none;
          }

          .dropdown-icon {
            display: none;
          }

          .header-action-btn {
            width: 40px;
            height: 40px;
          }

          .menu-toggle {
            width: 40px;
            height: 40px;
          }

          .logo-wrapper {
            width: 40px;
            height: 40px;
          }

          .logo-wrapper :global(img) {
            width: 28px;
            height: 28px;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .logo-subtitle {
            display: none;
          }

          .logo-title {
            font-size: 16px;
          }
        }
      `}</style>
    </header>
  );
}

export default Header;
