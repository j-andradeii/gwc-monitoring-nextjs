'use client';

import React from 'react';
import { PageHero } from '@/components/landing';

interface GiveHeroProps {
  backgroundImage?: string;
}

export const GiveHero: React.FC<GiveHeroProps> = ({
  backgroundImage = 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/golden_peak.jpg',
}) => {
  return (
    <PageHero
      id="give-top"
      badge="Give"
      title="Generosity Changes Lives"
      subtitle="Your giving makes an eternal difference"
      backgroundImage={backgroundImage}
      className="give-hero"
      serviceInfo={[
        { icon: 'pi pi-heart', text: 'Give cheerfully' },
        { icon: 'pi pi-users', text: 'Impact the community' },
      ]}
    />
  );
};

export default GiveHero;
