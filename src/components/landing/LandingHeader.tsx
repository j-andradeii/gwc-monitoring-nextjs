'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export const LandingHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMinistriesOpen, setIsMinistriesOpen] = useState(false);
  const ministriesRef = useRef<HTMLLIElement>(null);
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ministriesRef.current && !ministriesRef.current.contains(event.target as Node)) {
        setIsMinistriesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="landing-header">
      <nav className="landing-navbar">
        <div className="landing-logo">
          <Link href="/">
            <Image
              src="/assets/images/gwc-logo-gold.png"
              alt="Gateway Church Logo"
              width={65}
              height={65}
              priority
            />
          </Link>
        </div>

        <button className="hamburger-menu" onClick={toggleMobileMenu} aria-label="Toggle menu">
          <i className="pi pi-bars"></i>
        </button>

        <div className={`nav-menu-wrapper ${isMobileMenuOpen ? 'mobile-nav-active' : ''}`}>
          <ul className="nav-links">
            <li>
              <Link href="/about" className={isActive('/about') ? 'active' : ''} onClick={closeMobileMenu}>
                About Us
              </Link>
            </li>
            <li>
              <Link href="/sermon-notes" className={isActive('/sermon-notes') ? 'active' : ''} onClick={closeMobileMenu}>
                Sermons
              </Link>
            </li>
            <li
              ref={ministriesRef}
              className={`nav-dropdown ${isMinistriesOpen ? 'dropdown-open' : ''}`}
            >
              <button
                className={`nav-dropdown-trigger ${pathname.startsWith('/ministries') ? 'active' : ''}`}
                onClick={() => setIsMinistriesOpen(!isMinistriesOpen)}
                aria-expanded={isMinistriesOpen}
                aria-haspopup="true"
              >
                Ministries
                <i className={`pi pi-chevron-down dropdown-icon ${isMinistriesOpen ? 'rotated' : ''}`}></i>
              </button>
              <ul className="nav-dropdown-menu">
                <li>
                  <Link
                    href="/ministries/community"
                    className={pathname === '/ministries/community' ? 'active' : ''}
                    onClick={() => { closeMobileMenu(); setIsMinistriesOpen(false); }}
                  >
                    <i className="pi pi-users"></i>
                    Community
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ministries/serve"
                    className={pathname === '/ministries/serve' ? 'active' : ''}
                    onClick={() => { closeMobileMenu(); setIsMinistriesOpen(false); }}
                  >
                    <i className="pi pi-heart"></i>
                    Serve
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link href="/events" className={isActive('/events') ? 'active' : ''} onClick={closeMobileMenu}>
                Events
              </Link>
            </li>
            <li>
              <Link href="/give" className={isActive('/give') ? 'active' : ''} onClick={closeMobileMenu}>
                Connect
              </Link>
            </li>
            <li>
              <Link href="/give" className={isActive('/give') ? 'active' : ''} onClick={closeMobileMenu}>
                Give
              </Link>
            </li>
          </ul>

          <div className="header-actions">
            {/* <Link
              href="/signin"
              className="landing-btn landing-btn-primary"
              onClick={closeMobileMenu}
            >
              Sign In
            </Link> */}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default LandingHeader;
