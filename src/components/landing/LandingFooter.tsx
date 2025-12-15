'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface SocialLink {
  icon: string;
  label: string;
  href: string;
}

const socialLinks: SocialLink[] = [
  { icon: 'pi pi-facebook', label: 'Facebook', href: '#' },
  { icon: 'pi pi-instagram', label: 'Instagram', href: '#' },
  { icon: 'pi pi-youtube', label: 'YouTube', href: '#' },
];

export const LandingFooter: React.FC = () => {
  return (
    <footer id="contact" className="landing-footer">
      <div className="landing-container">
        <div className="footer-main">
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              <Image
                src="/images/church-logo-transparent.png"
                alt="Gateway Church"
                width={50}
                height={50}
              />
              <span>Gateway Church</span>
            </Link>
            <p>A community growing in faith, hope, and love.</p>
            <div className="footer-social">
              {socialLinks.map((social) => (
                <Link key={social.label} href={social.href} aria-label={social.label}>
                  <i className={social.icon}></i>
                </Link>
              ))}
            </div>
          </div>

          <div className="footer-links-group">
            <div className="footer-links">
              <h4>Quick Links</h4>
              <Link href="#about">About Us</Link>
              <Link href="#sermons">Sermons</Link>
              <Link href="#ministries">Ministries</Link>
              <Link href="#events">Events</Link>
            </div>

            <div className="footer-links">
              <h4>Connect</h4>
              <Link href="#">Plan a Visit</Link>
              <Link href="#">Contact Us</Link>
              <Link href="#">Give Online</Link>
              <Link href="/signin">Member Login</Link>
            </div>

            <div className="footer-contact">
              <h4>Service Times</h4>
              <p><i className="pi pi-calendar"></i> Sundays at 9:30 AM</p>
              <p><i className="pi pi-map-marker"></i> Lex Hotel, Capitol Cebu</p>
              <p><i className="pi pi-envelope"></i> connect@gatewaychurch.com</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Gateway Church. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
