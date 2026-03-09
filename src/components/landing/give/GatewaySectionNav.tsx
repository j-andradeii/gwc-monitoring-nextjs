'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { gatewaySectionNavLinks } from '@/data/giveData';

export const GatewaySectionNav: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = useCallback(() => {
    // Show nav after scrolling past the hero (approx 400px)
    const scrollY = window.scrollY;
    setIsVisible(scrollY > 400);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Intersection Observer for active section tracking
  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    // Observe all section targets
    gatewaySectionNavLinks.forEach((link) => {
      const element = document.getElementById(link.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 56;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav
      className={`gateway-section-nav ${isVisible ? 'gateway-nav-visible' : ''}`}
      aria-label="Page sections"
    >
      <div className="gateway-nav-inner">
        {gatewaySectionNavLinks.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={`gateway-nav-link ${activeSection === link.id ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, link.id)}
          >
            <i className={link.icon}></i>
            <span>{link.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
};

export default GatewaySectionNav;
