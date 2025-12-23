 'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export const LandingHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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
              width={70}
              height={70}
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
              <Link href="/" className={isActive('/') ? 'active' : ''} onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
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
            <li>
              <Link href="#ministries" onClick={closeMobileMenu}>
                Ministries
              </Link>
            </li>
            <li>
              <Link href="#events" onClick={closeMobileMenu}>
                Events
              </Link>
            </li>
            <li>
              <Link href="#contact" onClick={closeMobileMenu}>
                Contact
              </Link>
            </li>
            <li>
              <Link href="/give" className={isActive('/give') ? 'active' : ''} onClick={closeMobileMenu}>
                Give
              </Link>
            </li>
          </ul>

          <div className="header-actions">
            <Link
              href="/signin"
              className="landing-btn landing-btn-primary"
              onClick={closeMobileMenu}
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default LandingHeader;
