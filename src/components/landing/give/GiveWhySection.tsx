'use client';

import React from 'react';
import Link from 'next/link';
import { GiveScriptureList, type GiveScriptureListItem } from './GiveScriptureList';
import { scriptures as defaultScriptures } from '@/data/giveData';

export type GiveScripture = GiveScriptureListItem;

export interface GiveWhySectionProps {
  /** Anchor id for the section (e.g. "ways-to-give", "firstfruits") */
  sectionId?: string;
  /** Eyebrow label above the heading */
  sectionLabel?: string;
  /** Section heading */
  title?: string;
  /** Intro paragraph — string for simple cases, ReactNode for multi-paragraph / lists */
  intro?: React.ReactNode;
  /** Scripture cards to render. If empty/undefined, falls back to the default set. */
  scriptures?: GiveScripture[];
  /** Extra modifier class for theming (e.g. "give-why-section--firstfruits") */
  variantClassName?: string;
  /** Optional line clamp for compact scripture layouts. */
  scriptureMaxLines?: number;
  /** When set, renders a "Learn more" CTA beneath the scriptures pointing at this route. */
  learnMoreHref?: string;
  /** CTA label (defaults to "Learn more") */
  learnMoreLabel?: string;
  /** Optional helper line shown above the CTA */
  learnMoreCaption?: string;
}

const DEFAULT_INTRO =
  'Giving is an act of worship and obedience to God. When we give, we acknowledge ' +
  'that everything we have comes from Him. Our tithes and offerings support the ' +
  'ministry of Gateway Church, enabling us to reach more people with the Gospel, ' +
  'serve our community, and equip believers for Kingdom work.';

export const GiveWhySection: React.FC<GiveWhySectionProps> = ({
  sectionId = 'ways-to-give',
  sectionLabel = 'Generosity',
  title = 'Why We Give',
  intro = DEFAULT_INTRO,
  scriptures,
  variantClassName,
  scriptureMaxLines,
  learnMoreHref,
  learnMoreLabel = 'Learn more',
  learnMoreCaption,
}) => {
  const cards = scriptures && scriptures.length > 0 ? scriptures : defaultScriptures;

  return (
    <section
      id={sectionId}
      className={`landing-section give-why-section${variantClassName ? ` ${variantClassName}` : ''}`}
    >
      <div className="landing-container">
        <div className="section-header-center animate-on-scroll">
          <span className="section-label">{sectionLabel}</span>
          <h2>{title}</h2>
        </div>

        <div className="give-why-content animate-on-scroll">
          {typeof intro === 'string' ? (
            <p className="give-why-intro">{intro}</p>
          ) : (
            <div className="give-why-intro give-why-intro--rich">{intro}</div>
          )}

          <GiveScriptureList
            items={cards}
            description={`Scripture foundations for ${title.toLowerCase()}.`}
            ariaLabel={`${title} scriptures`}
            maxLines={scriptureMaxLines}
          />

          {learnMoreHref && (
            <div className="give-why-cta animate-on-scroll">
              {learnMoreCaption && (
                <p className="give-why-cta-caption">{learnMoreCaption}</p>
              )}
              <Link
                href={learnMoreHref}
                className="landing-btn landing-btn-outline give-why-cta-btn"
                aria-label={learnMoreLabel}
              >
                <span>{learnMoreLabel}</span>
                <i className="pi pi-arrow-right" aria-hidden="true"></i>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GiveWhySection;
