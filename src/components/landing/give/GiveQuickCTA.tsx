'use client';

import Link from 'next/link';
import React from 'react';

export interface GiveQuickCTAChip {
  icon: string;
  label: string;
}

interface GiveQuickCTAProps {
  href?: string;
  targetId?: string;
  eyebrow?: string;
  eyebrowIcon?: string;
  title?: string;
  subtitle?: React.ReactNode;
  buttonLabel?: string;
  buttonAriaLabel?: string;
  chips?: GiveQuickCTAChip[];
}

export const GiveQuickCTA: React.FC<GiveQuickCTAProps> = ({
  href,
  targetId = 'give-channels',
  eyebrow = 'Featured giving project',
  eyebrowIcon = 'pi pi-bookmark-fill',
  title = 'Now building: Ministry Center, Phase 02.',
  buttonLabel = 'Give to the Project',
  buttonAriaLabel = 'Give to the Ministry Center project',
}) => {
  const ctaHref = href ?? `#${targetId}`;

  return (
    <section className="give-quick-cta-section" aria-label={eyebrow}>
      <div className="landing-container">
        <div className="give-quick-cta">
          <div className="give-quick-cta__content">
            <span className="give-quick-cta__icon" aria-hidden="true">
              <i className={eyebrowIcon} aria-hidden="true" />
            </span>
            <h2 className="give-quick-cta__title">{title}</h2>
          </div>

          <span className="give-quick-cta__separator" aria-hidden="true" />

          <Link
            href={ctaHref}
            className="give-quick-cta__btn"
            aria-label={buttonAriaLabel}
          >
            <span>{buttonLabel}</span>
            <i className="pi pi-arrow-right" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GiveQuickCTA;
