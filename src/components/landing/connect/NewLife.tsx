'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { MinistryFeatureSection } from '@/components/landing/MinistryFeatureSection';
import type { Ministry } from '@/data/ministries';

const placeholderImage = '/assets/images/event-placeholder.svg';

const newLifeSections: Ministry[] = [
  {
    id: 'salvation-decision',
    title: 'YOU ARE FORGIVEN',
    image: placeholderImage,
    scripture: {
      reference: '1 John 1:9',
      verse:
        'If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.',
    },
  },
  {
    id: 'water-baptism',
    title: 'YOU ARE NOW A CHILD OF GOD',
    image: placeholderImage,
    scripture: {
      reference: 'John 1:12',
      verse:
        'Yet to all who did receive him, to those who believed in his name, he gave the right to become children of God',
    },
  },
  {
    id: 'encounter-weekend',
    title: 'YOU ARE NOW A NEW CREATION',
    image: placeholderImage,
    scripture: {
      reference: '2 Corinthians 5:17',
      verse:
        'Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!',
    },
  },
  {
    id: 'eternal-life',
    title: 'YOU HAVE NOW ETERNAL LIFE',
    image: placeholderImage,
    scripture: {
      reference: 'John 3:16',
      verse:
        'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
    },
  },
];

export const NewLife: React.FC = () => {
  const listRef = useRef<HTMLDivElement>(null);

  // This panel mounts inside the ConnectTabs content-switcher AFTER initial page load,
  // so ScrollAnimationProvider's one-time observer never sees these cards and they stay
  // at opacity:0 (blank panel on tab-switch). Reveal them on mount. Mount-reveal — not a
  // fresh observer — because the cards sit below the fold on switch, so a scroll-triggered
  // reveal would never fire. See memory: scroll-animation-remount.
  useEffect(() => {
    const container = listRef.current;
    if (!container) return;
    const animated = container.querySelectorAll('.animate-on-scroll');
    if (animated.length === 0) return;
    const raf = requestAnimationFrame(() => {
      animated.forEach((el) => el.classList.add('animate-visible'));
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <section className="landing-section" style={{ paddingBottom: 0 }}>
        <div className="landing-container">
          <div className="section-header-center" style={{ paddingTop: '40px' }}>
            <span className="section-label">New Beginning</span>
            <h2>ROMANS 10:9</h2>
            <p>
              If you declare with your mouth, &quot;Jesus is Lord,&quot; and believe
              in your heart that God raised him from the dead, you will be saved.
            </p>
          </div>
        </div>
      </section>

      <div className="ministries-list-container" ref={listRef}>
        {newLifeSections.map((section, index) => (
          <MinistryFeatureSection
            key={section.id}
            ministry={section}
            reverse={index % 2 !== 0}
            alternateBackground={index % 2 !== 0}
          />
        ))}
      </div>

      {/* <section className="landing-section" style={{ paddingTop: 0 }}>
        <div className="landing-container">
          <Link href="/events/sonday-service" className="landing-btn landing-btn-primary">
            <i className="pi pi-map-marker" aria-hidden="true" />
            Plan Your Visit
          </Link>
        </div>
      </section> */}
    </>
  );
};

export default NewLife;
