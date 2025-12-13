'use client';

import React from 'react';
import Link from 'next/link';

interface FooterLink {
  label: string;
  href: string;
}

const quickLinks: FooterLink[] = [
  { label: 'About Us', href: '#' },
  { label: 'Sermons', href: '#' },
  { label: 'Ministries', href: '#' },
  { label: 'Events', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'Contact Us', href: '#' },
];

interface SocialLink {
  icon: string;
  label: string;
  href: string;
}

const socialLinks: SocialLink[] = [
  { icon: 'pi pi-facebook', label: 'Facebook', href: '#' },
  { icon: 'pi pi-twitter', label: 'Twitter', href: '#' },
  { icon: 'pi pi-instagram', label: 'Instagram', href: '#' },
  { icon: 'pi pi-youtube', label: 'YouTube', href: '#' },
];

export const LandingFooter: React.FC = () => {
  return (
    <footer id="contact" className="landing-footer">
      <div className="footer-content">
        <div className="footer-column">
          <h4>Gateway Church</h4>
          <p>IBC Banawa</p>
          <p>Phone: (123) 456-7890</p>
          <p>Email: connect@gatewaychurch.com</p>
        </div>

        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-column">
          <h4>Connect With Us</h4>
          <p>Follow us on social media to stay updated with our latest news and events.</p>
          <div className="social-icons">
            {socialLinks.map((social) => (
              <Link key={social.label} href={social.href} aria-label={social.label}>
                <i className={social.icon}></i>
              </Link>
            ))}
          </div>
        </div>

        <div className="footer-column">
          <h4>Service Times</h4>
          <p>Sunday Service: 9:30 AM</p>
          <p>Wednesday Bible Study: 7:00 PM</p>
          <p>Friday Prayer Meeting: 6:00 PM</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Gateway Church. All Rights Reserved. Designed with
          love.
        </p>
      </div>
    </footer>
  );
};

export default LandingFooter;
