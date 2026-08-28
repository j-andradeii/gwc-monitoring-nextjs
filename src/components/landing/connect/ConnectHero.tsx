'use client';

import React from 'react';
import { PageHero } from '@/components/landing';
import { useConnectTabs } from './ConnectTabsContext';

export const ConnectHero: React.FC = () => {
  const { activeBackground } = useConnectTabs();

  return (
    <PageHero
      id="connect-top"
      badge="Connect"
      title="Find Your Place at Gateway"
      subtitle="Take your next step, from first visit to lifelong growth"
      backgroundImage={activeBackground}
      className="connect-hero"
    />
  );
};

export default ConnectHero;
