/**
 * Footer Component
 *
 * Modern, elegant footer with unified design
 * Features gold accent colors matching landing page theme
 */

'use client';

import React from 'react';
import Link from 'next/link';

export interface FooterProps {
  /** Additional CSS classes */
  className?: string;
  /** Show in admin layout */
  isAdmin?: boolean;
}

export function Footer({ className = '', isAdmin = false }: FooterProps) {
  const currentYear = new Date().getFullYear();

  if (isAdmin) {
    return (
      <footer className={`admin-footer ${className}`}>
        <div className="footer-inner">
          <div className="footer-left">
            <span className="copyright">
              &copy; {currentYear} Gateway Church. All rights reserved.
            </span>
          </div>
          <div className="footer-center">
            <Link href="/privacy" className="footer-link">Privacy Policy</Link>
            <span className="divider">|</span>
            <Link href="/terms" className="footer-link">Terms of Service</Link>
            <span className="divider">|</span>
            <Link href="/help" className="footer-link">Help Center</Link>
          </div>
          <div className="footer-right">
            <span className="version">Version 1.0.0</span>
          </div>
        </div>

        <style jsx>{`
          .admin-footer {
            background: #ffffff;
            border-top: 1px solid rgba(0, 0, 0, 0.06);
            padding: 16px 24px;
          }

          .footer-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 12px;
          }

          .footer-left {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .copyright {
            font-size: 13px;
            color: #6b7280;
          }

          .footer-center {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .footer-center :global(.footer-link) {
            font-size: 13px;
            color: #6b7280;
            text-decoration: none;
            transition: color 0.2s ease;
          }

          .footer-center :global(.footer-link:hover) {
            color: var(--primary-gold-accent, #c0a067);
          }

          .divider {
            color: #d1d5db;
            font-size: 12px;
          }

          .footer-right {
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .version {
            font-size: 12px;
            color: #9ca3af;
            padding: 4px 10px;
            background: #f3f4f6;
            border-radius: 6px;
          }

          @media (max-width: 767px) {
            .footer-inner {
              flex-direction: column;
              text-align: center;
            }

            .footer-center {
              order: -1;
            }
          }
        `}</style>
      </footer>
    );
  }

  return (
    <footer className={`public-footer ${className}`}>
      <div className="footer-container">
        <div className="footer-main">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-icon">
                <i className="pi pi-building" />
              </div>
              <span className="logo-text">Gateway Church</span>
            </div>
            <p className="brand-description">
              Church management and monitoring platform designed to help churches
              manage their members, track growth, and streamline administrative tasks.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                <i className="pi pi-facebook" />
              </a>
              <a href="#" aria-label="Twitter">
                <i className="pi pi-twitter" />
              </a>
              <a href="#" aria-label="Instagram">
                <i className="pi pi-instagram" />
              </a>
              <a href="#" aria-label="YouTube">
                <i className="pi pi-youtube" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="footer-links-group">
            <div className="footer-column">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="/about">About Us</a></li>
                <li><a href="/services">Our Services</a></li>
                <li><a href="/events">Events</a></li>
                <li><a href="/sermons">Sermons</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Resources</h4>
              <ul>
                <li><a href="/help">Help Center</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/terms">Terms of Service</a></li>
                <li><a href="/contact">Contact Us</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Contact</h4>
              <ul className="contact-list">
                <li>
                  <i className="pi pi-envelope" />
                  <span>support@gatewaychurch.com</span>
                </li>
                <li>
                  <i className="pi pi-phone" />
                  <span>+1 234 567 890</span>
                </li>
                <li>
                  <i className="pi pi-map-marker" />
                  <span>123 Church Street</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Gateway Church. All rights reserved.</p>
        </div>
      </div>

      <style jsx>{`
        .public-footer {
          background: #1a1a1a;
          color: #ffffff;
          padding: 60px 0 0;
        }

        .footer-container {
          max-width: 1140px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .footer-main {
          display: flex;
          justify-content: space-between;
          gap: 60px;
          padding-bottom: 40px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-brand {
          max-width: 300px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .logo-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--primary-gold-accent, #c0a067) 0%, #d4bc8e 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-icon i {
          font-size: 20px;
          color: #ffffff;
        }

        .logo-text {
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
        }

        .brand-description {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.7;
          margin-bottom: 20px;
        }

        .social-links {
          display: flex;
          gap: 12px;
        }

        .social-links a {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          transition: all 0.3s ease;
        }

        .social-links a:hover {
          background: var(--primary-gold-accent, #c0a067);
          transform: translateY(-2px);
        }

        .social-links i {
          font-size: 16px;
        }

        .footer-links-group {
          display: flex;
          gap: 60px;
        }

        .footer-column h4 {
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 20px;
        }

        .footer-column ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .footer-column ul li {
          margin-bottom: 12px;
        }

        .footer-column ul li a {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-column ul li a:hover {
          color: var(--primary-gold-accent, #c0a067);
        }

        .contact-list li {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
        }

        .contact-list i {
          font-size: 14px;
          color: var(--primary-gold-accent, #c0a067);
        }

        .footer-bottom {
          padding: 24px 0;
          text-align: center;
        }

        .footer-bottom p {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.4);
          margin: 0;
        }

        @media (max-width: 1024px) {
          .footer-main {
            flex-direction: column;
            gap: 40px;
          }

          .footer-brand {
            max-width: 100%;
            text-align: center;
          }

          .footer-logo {
            justify-content: center;
          }

          .social-links {
            justify-content: center;
          }

          .footer-links-group {
            justify-content: center;
            flex-wrap: wrap;
            gap: 40px;
          }
        }

        @media (max-width: 767px) {
          .footer-links-group {
            flex-direction: column;
            text-align: center;
            gap: 32px;
          }

          .contact-list li {
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer;
