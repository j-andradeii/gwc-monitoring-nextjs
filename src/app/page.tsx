/**
 * Landing Page
 *
 * Public landing page for Gateway Church
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import '@/styles/landing.css';

import {
  LandingHeader,
  HeroSection,
  AboutSection,
  MissionSection,
  ChurchServiceSection,
  SermonsSection,
  MinistriesSection,
  EventsSection,
  LandingFooter,
} from '@/components/landing';

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Initialize scroll animations
  useEffect(() => {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (!animatedElements.length) return;

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
          observerRef.current?.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach((element) => {
      observerRef.current?.observe(element);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="landing-page">
      <LandingHeader
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        closeMobileMenu={closeMobileMenu}
      />

      <main className="landing-main">
        <HeroSection />
        <AboutSection />
        <MissionSection />
        <ChurchServiceSection />
        <SermonsSection />
        <MinistriesSection />
        <EventsSection />
      </main>

      <LandingFooter />
    </div>
  );
}
