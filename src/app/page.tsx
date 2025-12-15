/**
 * Landing Page
 *
 * Public landing page for Gateway Church (Server Component)
 */

import '@/styles/landing.css';

import {
  LandingHeader,
  HeroSection,
  AboutSection,
  MissionSection,
  CommunityGallerySection,
  ChurchServiceSection,
  SermonsSection,
  MinistriesSection,
  EventsSection,
  ContactSection,
  LandingFooter,
  ScrollAnimationProvider,
} from '@/components/landing';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <LandingHeader />

      <main className="landing-main">
        <ScrollAnimationProvider>
          <HeroSection />
          <AboutSection />
          <MissionSection />
          <CommunityGallerySection />
          <ChurchServiceSection />
          <SermonsSection />
          <MinistriesSection />
          <EventsSection />
          <ContactSection />
        </ScrollAnimationProvider>
      </main>

      <LandingFooter />
    </div>
  );
}
