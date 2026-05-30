'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export const LandingHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMinistriesOpen, setIsMinistriesOpen] = useState(false);
  const [isGiveOpen, setIsGiveOpen] = useState(false);
  const ministriesRef = useRef<HTMLLIElement>(null);
  const giveRef = useRef<HTMLLIElement>(null);
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ministriesRef.current && !ministriesRef.current.contains(event.target as Node)) {
        setIsMinistriesOpen(false);
      }
      if (giveRef.current && !giveRef.current.contains(event.target as Node)) {
        setIsGiveOpen(false);
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
            {/* <li>
              <Link href="/connect" className={isActive('/connect') ? 'active' : ''} onClick={closeMobileMenu}>
                Connect
              </Link>
            </li> */}
            <li
              ref={giveRef}
              className={`nav-dropdown ${isGiveOpen ? 'dropdown-open' : ''}`}
            >
              <button
                className={`nav-dropdown-trigger ${pathname.startsWith('/give') ? 'active' : ''}`}
                onClick={() => setIsGiveOpen(!isGiveOpen)}
                aria-expanded={isGiveOpen}
                aria-haspopup="true"
              >
                Give
                <i className={`pi pi-chevron-down dropdown-icon ${isGiveOpen ? 'rotated' : ''}`}></i>
              </button>
              <ul className="nav-dropdown-menu give-dropdown">
                <li>
                  <Link
                    href="/give/ways-to-give"
                    className={pathname === '/give/ways-to-give' ? 'active' : ''}
                    onClick={() => { closeMobileMenu(); setIsGiveOpen(false); }}
                  >
                    <i className="pi pi-wallet"></i>
                    Ways to Give
                  </Link>
                </li>
                <li>
                  <Link
                    href="/give/gateway-projects"
                    className={pathname === '/give/gateway-projects' ? 'active' : ''}
                    onClick={() => { closeMobileMenu(); setIsGiveOpen(false); }}
                  >
                    <i className="pi pi-building"></i>
                    Gateway Projects
                  </Link>
                </li>
                <li>
                  <Link
                    href="/give/gateway-outreach"
                    className={pathname === '/give/gateway-outreach' ? 'active' : ''}
                    onClick={() => { closeMobileMenu(); setIsGiveOpen(false); }}
                  >
                    <i className="pi pi-globe"></i>
                    Gateway Outreach
                  </Link>
                </li>
              </ul>
            </li>
          </ul>

          {/* <div className="header-actions">
            <Link
              href="/signin"
              className="landing-btn landing-btn-primary"
              onClick={closeMobileMenu}
            >
              Sign In
            </Link>
          </div> */}
        </div>
      </nav>
    </header>
  );
};

export default LandingHeader;
