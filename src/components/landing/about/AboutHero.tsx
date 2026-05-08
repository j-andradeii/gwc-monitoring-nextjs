'use client';

import React from 'react';
import { PageHero } from '@/components/landing';
import { CONTACT_INFO } from '@/data/contact';

interface AboutHeroProps {
  backgroundImage?: string;
}

export const AboutHero: React.FC<AboutHeroProps> = ({
  backgroundImage = '/assets/images/community.jpg',
}) => {
  return (
    <PageHero
      id="about-top"
      badge="About Us"
      title="Welcome to Gateway Church"
      subtitle="Loving God, Loving People"
      backgroundImage={backgroundImage}
      className="about-hero"
      serviceInfo={[
        { icon: 'pi pi-clock', text: 'Sundays 9:30 AM' },
        {
          icon: 'pi pi-map-marker',
          text: '8th Floor, Golden Peak Hotel and Suites, Escario St. Gorordo Ave.',
          href: CONTACT_INFO.mapsUrl,
          ariaLabel: 'Open church location in Google Maps',
        },
      ]}
    />
  );
};

export default AboutHero;
