'use client';

import React from 'react';
import { PageHero } from '@/components/landing';

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
        { icon: 'pi pi-map-marker', text: '8th Floor, Golden Peak, Gorordo Avenue' },
      ]}
    />
  );
};

export default AboutHero;
