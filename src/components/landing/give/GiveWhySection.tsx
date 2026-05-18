'use client';

import React from 'react';
import { ScriptureCard } from '@/components/cards';
import { scriptures as defaultScriptures } from '@/data/giveData';

export interface GiveScripture {
  verse: string;
  text: string;
}

export interface GiveWhySectionProps {
  /** Anchor id for the section (e.g. "ways-to-give", "firstfruits") */
  sectionId?: string;
  /** Eyebrow label above the heading */
  sectionLabel?: string;
  /** Section heading */
  title?: string;
  /** Intro paragraph */
  intro?: string;
  /** Scripture cards to render. If empty/undefined, falls back to the default set. */
  scriptures?: GiveScripture[];
  /** Extra modifier class for theming (e.g. "give-why-section--firstfruits") */
  variantClassName?: string;
  /**
   * Visually clamp each scripture card's text to this many lines.
   * Defaults to 4 so long passages (e.g. Malachi 3:10) stay uniform with
   * shorter ones. Card link still opens BibleGateway for the full passage.
   * Pass 0 to disable clamping.
   */
  scriptureMaxLines?: number;
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
  scriptureMaxLines = 8,
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
          <p className="give-why-intro">{intro}</p>

          <div className="scriptures-grid">
            {cards.map((scripture, index) => (
              <ScriptureCard
                key={`${scripture.verse}-${index}`}
                verse={scripture.verse}
                text={scripture.text}
                maxLines={scriptureMaxLines}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GiveWhySection;
