/**
 * Footer Component
 *
 * Application footer
 */

'use client';

import React from 'react';

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
      <footer className={`py-4 px-6 border-t border-gray-200 bg-white ${className}`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-gray-500">
          <p>&copy; {currentYear} GWC Monitoring. All rights reserved.</p>
          <p>Version 1.0.0</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className={`bg-gray-900 text-white py-12 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">GWC Monitoring</h3>
            <p className="text-gray-400 max-w-md">
              Church management and monitoring platform designed to help churches
              manage their members, track growth, and streamline administrative tasks.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <i className="pi pi-envelope" />
                <span>support@gwc.com</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="pi pi-phone" />
                <span>+1 234 567 890</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="pi pi-map-marker" />
                <span>123 Church Street</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400">
            &copy; {currentYear} GWC Monitoring. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <i className="pi pi-facebook text-xl" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <i className="pi pi-twitter text-xl" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <i className="pi pi-instagram text-xl" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="YouTube"
            >
              <i className="pi pi-youtube text-xl" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
