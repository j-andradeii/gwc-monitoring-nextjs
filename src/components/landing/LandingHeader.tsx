'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const LandingHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
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
              <Link href="/" className="active" onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link href="#about" onClick={closeMobileMenu}>
                About Us
              </Link>
            </li>
            <li>
              <Link href="/sermon-notes" onClick={closeMobileMenu}>
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
