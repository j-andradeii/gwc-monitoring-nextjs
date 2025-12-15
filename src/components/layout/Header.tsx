/**
 * Header Component
 *
 * Modern admin header with dark gradient background
 */

'use client';

import React, { useRef, useState } from 'react';
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
  className?: string;
}

export function Header({ className = '' }: HeaderProps) {
  const menuRef = useRef<Menu>(null);
  const { user, logout } = useAuth();
  const { isOpen, toggle, setIsOpen } = useSidebarStore();
  const { isMobile } = useResponsive();
  const [menuHover, setMenuHover] = useState(false);

  const userMenuItems: MenuItem[] = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => {},
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      command: () => {},
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

  const handleSidebarToggle = () => {
    if (isMobile) {
      toggle();
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <header style={{ ...styles.container, ...(className ? {} : {}) }} className={className}>
      <div style={styles.inner}>
        {/* Left */}
        <div style={styles.left}>
          <button
            onClick={handleSidebarToggle}
            style={styles.menuToggle}
            onMouseEnter={() => setMenuHover(true)}
            onMouseLeave={() => setMenuHover(false)}
            aria-label="Toggle sidebar"
          >
            <span style={{ ...styles.hamburgerLine, ...(menuHover && styles.hamburgerLineHover), ...(isOpen && styles.hamburgerLine1Active) }} />
            <span style={{ ...styles.hamburgerLine, ...(menuHover && styles.hamburgerLineHover), ...(isOpen && styles.hamburgerLine2Active) }} />
            <span style={{ ...styles.hamburgerLine, ...(menuHover && styles.hamburgerLineHover), ...(isOpen && styles.hamburgerLine3Active) }} />
          </button>

          <Link href={ROUTES.DASHBOARD} style={styles.logoLink}>
            <div style={styles.logoWrapper}>
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

        {/* Right */}
        <div style={styles.right}>
          <button style={styles.actionBtn} aria-label="Search">
            <i className="pi pi-search" style={{ fontSize: '16px' }} />
          </button>

          <button style={styles.actionBtn} aria-label="Notifications">
            <i className="pi pi-bell" style={{ fontSize: '16px' }} />
            <span style={styles.badge}>3</span>
          </button>

          <div style={styles.divider} />

          <div
            style={styles.userMenu}
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
              style={styles.avatar}
            />
            {!isMobile && (
              <>
                <div style={styles.userInfo}>
                  <span style={styles.userName}>{userName}</span>
                  <span style={styles.userRole}>{userRole}</span>
                </div>
                <i className="pi pi-chevron-down" style={styles.dropdownIcon} />
              </>
            )}
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

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: 'linear-gradient(135deg, #0a0a0f 0%, #0d1525 50%, #0d1a2d 100%)',
    width: '100%',
    height: '64px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.3)',
    position: 'relative',
    zIndex: 100,
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    padding: '0 20px',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  menuToggle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '5px',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '10px',
    transition: 'background 0.2s ease',
  },
  hamburgerLine: {
    display: 'block',
    width: '20px',
    height: '2px',
    background: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
  },
  hamburgerLineHover: {
    background: '#c0a067',
  },
  hamburgerLine1Active: {
    transform: 'translateY(7px) rotate(45deg)',
    background: '#c0a067',
  },
  hamburgerLine2Active: {
    opacity: 0,
    transform: 'scaleX(0)',
  },
  hamburgerLine3Active: {
    transform: 'translateY(-7px) rotate(-45deg)',
    background: '#c0a067',
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
  logoWrapper: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'linear-gradient(145deg, #c0a067 0%, #a8894f 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(192, 160, 103, 0.3)',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '38px',
    height: '38px',
    borderRadius: '8px',
    background: 'transparent',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.7)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    minWidth: '16px',
    height: '16px',
    borderRadius: '8px',
    background: '#ef4444',
    color: '#ffffff',
    fontSize: '10px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 4px',
  },
  divider: {
    width: '1px',
    height: '24px',
    background: 'rgba(255, 255, 255, 0.1)',
    margin: '0 8px',
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '6px 10px',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
  },
  avatar: {
    background: 'linear-gradient(145deg, #c0a067 0%, #a8894f 100%)',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '13px',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    gap: '1px',
  },
  userName: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#ffffff',
    lineHeight: 1.2,
  },
  userRole: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'capitalize',
  },
  dropdownIcon: {
    fontSize: '10px',
    color: 'rgba(255, 255, 255, 0.4)',
    marginLeft: '4px',
  },
};

export default Header;
