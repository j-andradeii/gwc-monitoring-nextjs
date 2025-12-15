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
  ChurchServiceSection,
  SermonsSection,
  MinistriesSection,
  EventsSection,
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
          <ChurchServiceSection />
          <SermonsSection />
          <MinistriesSection />
          <EventsSection />
        </ScrollAnimationProvider>
      </main>

      <LandingFooter />
    </div>
  );
}
