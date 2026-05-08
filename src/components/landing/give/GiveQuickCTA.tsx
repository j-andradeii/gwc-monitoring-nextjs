'use client';

import React from 'react';

export interface GiveQuickCTAChip {
  icon: string;
  label: string;
}

interface GiveQuickCTAProps {
  targetId?: string;
  eyebrow?: string;
  eyebrowIcon?: string;
  title?: string;
  subtitle?: React.ReactNode;
  buttonLabel?: string;
  buttonAriaLabel?: string;
  chips?: GiveQuickCTAChip[];
}

const DEFAULT_CHIPS: GiveQuickCTAChip[] = [
  { icon: 'pi pi-mobile', label: 'GCash' },
  { icon: 'pi pi-credit-card', label: 'BPI' },
  { icon: 'pi pi-credit-card', label: 'BDO' },
];

export const GiveQuickCTA: React.FC<GiveQuickCTAProps> = ({
  targetId = 'give-channels',
  eyebrow = 'Start Giving in Seconds',
  eyebrowIcon = 'pi pi-bolt',
  title = 'Ready to give? Pick your channel.',
  subtitle = (
    <>
      GCash, BPI, BDO &mdash; tap a channel below and we&apos;ll guide you through it.
      Every gift fuels what God is building through Gateway Church.
    </>
  ),
  buttonLabel = 'View Giving Channels',
  buttonAriaLabel = 'Jump to giving channels',
  chips = DEFAULT_CHIPS,
}) => {
  return (
    <section className="give-quick-cta-section">
      <div className="landing-container">
        <div className="give-quick-cta">
          <div className="give-quick-cta__glow" aria-hidden="true" />
          <div className="give-quick-cta__pattern" aria-hidden="true" />

          <div className="give-quick-cta__content">
            <span className="give-quick-cta__eyebrow">
              <i className={eyebrowIcon} aria-hidden="true" />
              {eyebrow}
            </span>
            <h2 className="give-quick-cta__title">{title}</h2>
            <p className="give-quick-cta__subtitle">{subtitle}</p>
          </div>

          <div className="give-quick-cta__actions">
            <a
              href={`#${targetId}`}
              className="give-quick-cta__btn give-quick-cta__btn--primary"
              aria-label={buttonAriaLabel}
            >
              <span>{buttonLabel}</span>
              <i className="pi pi-arrow-down" aria-hidden="true" />
            </a>
            {chips.length > 0 && (
              <div className="give-quick-cta__chips" aria-hidden="true">
                {chips.map((chip) => (
                  <span key={chip.label} className="give-quick-cta__chip">
                    <i className={chip.icon} />
                    {chip.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GiveQuickCTA;
