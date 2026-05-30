'use client';

import React from 'react';
import { PageHero } from '@/components/landing';

export const ConnectHero: React.FC = () => {
  return (
    <PageHero
      id="connect-top"
      badge="Connect"
      title="Find Your Place at Gateway"
      subtitle="Take your next step — from first visit to lifelong growth"
      backgroundImage="/assets/images/community.jpg"
      className="connect-hero"
    />
  );
};

export default ConnectHero;
