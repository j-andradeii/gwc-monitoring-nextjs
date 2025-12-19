'use client';

import React, { useState, useEffect, useRef } from 'react';

interface NavItem {
  id: string;
  label: string;
}

const navItems: NavItem[] = [
  { id: 'about-top', label: 'About' },
  { id: 'our-story', label: 'Our Story' },
  { id: 'vision-mission', label: 'Vision & Mission' },
  { id: 'our-values', label: 'Our Values' },
  { id: 'what-we-believe', label: 'What We Believe' },
  { id: 'contact', label: 'Contact' },
];

export const AboutSideNav: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('about-top');
  const [isVisible, setIsVisible] = useState(false);
  const isClickScrolling = useRef(false);

  // Handle visibility of the nav (show after scrolling past hero)
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('about-top');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        setIsVisible(window.scrollY > heroBottom - 300);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Use scroll-based detection for more reliable tracking
  useEffect(() => {
    const handleSectionScroll = () => {
      if (isClickScrolling.current) return;

      const scrollTop = window.scrollY + 150; // 150px from top of viewport

      // Find the section whose top is closest to (but above) the scroll position
      let currentSection = navItems[0].id;

      for (const item of navItems) {
        const element = document.getElementById(item.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;

          if (elementTop <= scrollTop) {
            currentSection = item.id;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleSectionScroll, { passive: true });
    handleSectionScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleSectionScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Prevent scroll handler from interfering during smooth scroll
      isClickScrolling.current = true;
      setActiveSection(id);

      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth',
      });

      // Re-enable detection after animation completes
      setTimeout(() => {
        isClickScrolling.current = false;
      }, 800);
    }
  };

  return (
    <nav className={`about-side-nav ${isVisible ? 'visible' : ''}`}>
      <ul className="side-nav-list">
        {navItems.map((item) => (
          <li key={item.id} className="side-nav-item">
            <a
              href={`#${item.id}`}
              className={`side-nav-link ${activeSection === item.id ? 'active' : ''}`}
              onClick={(e) => handleClick(e, item.id)}
            >
              <span className="side-nav-label">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AboutSideNav;
