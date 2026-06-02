'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LandingHeader, LandingFooter, ShareModal, ProjectBanner } from '@/components/landing';
import { Sermon } from '@/data/sermons';
import { Event } from '@/data/events';
import { parseSermonSections, deriveBookBadge, estimateReadingMinutes, slugifySectionId } from '@/lib/sermon-parser';

interface Props {
  sermon: Sermon;
  relatedSermons: Sermon[];
  seriesSermons: Sermon[];
  upcomingEvents: Event[];
}

// ---------------------------------------------------------------------------
// Rich-text renderer: converts **bold** and *italic* markers to React elements.
// Safe — no dangerouslySetInnerHTML.
// ---------------------------------------------------------------------------
function renderRichText(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

// ---------------------------------------------------------------------------
// Reading Progress Bar
// ---------------------------------------------------------------------------
function ReadingProgressBar() {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;

    const onScroll = () => {
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const scrollH = document.documentElement.scrollHeight - window.innerHeight;
        const pct = scrollH > 0 ? Math.min(100, (scrollY / scrollH) * 100) : 0;
        if (fillRef.current) {
          fillRef.current.style.setProperty('--progress', `${pct}%`);
          fillRef.current.style.width = `${pct}%`;
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="reading-progress" aria-hidden="true">
      <div ref={fillRef} className="reading-progress__fill" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Breadcrumbs
// ---------------------------------------------------------------------------
function SermonBreadcrumbs({ title }: { title: string }) {
  return (
    <nav className="sermon-hero__breadcrumbs" aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      <span className="sep" aria-hidden="true">/</span>
      <Link href="/sermon-notes">Sermons</Link>
      <span className="sep" aria-hidden="true">/</span>
      <span className="current" aria-current="page">{title}</span>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Eyebrow (series + sermon number)
// ---------------------------------------------------------------------------
function SermonEyebrow({ series, number }: { series: string; number?: number }) {
  const label = number
    ? `${series} · Sermon ${String(number).padStart(2, '0')}`
    : series;
  return <div className="sermon-hero__eyebrow">{label}</div>;
}

// ---------------------------------------------------------------------------
// Hero Title (supports split italic subtitle)
// ---------------------------------------------------------------------------
function SermonHeroTitle({ sermon }: { sermon: Sermon }) {
  if (sermon.subtitle) {
    const { prefix, italic, suffix } = sermon.subtitle;
    return (
      <h1 className="sermon-hero__title">
        {prefix}
        {'\u00A0'}
        <em>{italic}</em>
        {suffix ? <>{'\u00A0'}{suffix}</> : null}
      </h1>
    );
  }
  return <h1 className="sermon-hero__title">{sermon.title}</h1>;
}

// ---------------------------------------------------------------------------
// Hero Meta Row
// ---------------------------------------------------------------------------
function SermonMetaRow({ sermon, readingMinutes }: { sermon: Sermon; readingMinutes: number }) {
  const formattedDate = new Date(sermon.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="sermon-hero__meta">
      {/* Speaker */}
      <div className="sermon-hero__meta-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span>
          <strong>{sermon.speaker}</strong>
          {sermon.speakerRole}
        </span>
      </div>

      {/* Date */}
      <div className="sermon-hero__meta-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span><strong>{formattedDate}</strong></span>
      </div>

      {/* Duration + reading time */}
      <div className="sermon-hero__meta-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span><strong>{sermon.duration}</strong> · {readingMinutes} min read</span>
      </div>

      {/* Key verse */}
      {sermon.keyVerse && (
        <div className="sermon-hero__meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span><strong>{sermon.keyVerse}</strong> Key Verse</span>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hero Artwork card
// ---------------------------------------------------------------------------
function HeroArtwork({ sermon }: { sermon: Sermon }) {
  return (
    <div className="sermon-hero__artwork">
      <Image
        src={sermon.image}
        alt={sermon.title}
        fill
        sizes="(max-width: 1023px) 100vw, 320px"
        className="sermon-hero__artwork-img"
        priority
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section Block
// ---------------------------------------------------------------------------
interface SectionSubItem {
  title: string;
  ref?: string;
  text: string;
}

interface SectionData {
  id: string;
  kicker?: string;
  title: string;
  paragraphs: string[];
  callout?: string;
  unnumbered?: boolean;
  subItems?: SectionSubItem[];
}

function SectionBlock({ section, displayNum }: { section: SectionData; displayNum?: number }) {
  const num = displayNum !== undefined ? String(displayNum).padStart(2, '0') : null;
  return (
    <div id={section.id} style={{ scrollMarginTop: '100px' }}>
      <div className={`section-head${num === null ? ' section-head--unnumbered' : ''}`}>
        {num !== null && (
          <div className="section-head__num" aria-hidden="true">{num}</div>
        )}
        <div className="section-head__body">
          {section.kicker && (
            <div className="section-head__kicker">{section.kicker}</div>
          )}
          <h2 className="section-head__title">{section.title}</h2>
        </div>
      </div>
      <div className="prose">
        {section.paragraphs.map((para, i) => (
          <p key={i}>{renderRichText(para)}</p>
        ))}
        {section.subItems && section.subItems.length > 0 && (
          <ol className="section-subitems">
            {section.subItems.map((item, i) => (
              <li key={i} className="section-subitem">
                <div className="section-subitem__num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="section-subitem__body">
                  <h3 className="section-subitem__title">{item.title}</h3>
                  {item.ref && <div className="section-subitem__ref">{item.ref}</div>}
                  <p className="section-subitem__text">{renderRichText(item.text)}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
        {section.callout && (
          <div className="callout">{section.callout}</div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Blessings Grid
// ---------------------------------------------------------------------------
function BlessingsGrid({ blessings }: { blessings: NonNullable<Sermon['blessings']> }) {
  return (
    <div className="blessings">
      {blessings.map((b, i) => {
        const isLast = i === blessings.length - 1;
        const isOdd = blessings.length % 2 !== 0;
        return (
          <div
            key={i}
            className="blessing"
            data-span={isLast && isOdd ? 'full' : undefined}
          >
            <div className="blessing__num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </div>
            <h3 className="blessing__title">{b.title}</h3>
            <div className="blessing__ref">{b.ref}</div>
            <p className="blessing__text">{b.text}</p>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Key Takeaways Card
// ---------------------------------------------------------------------------
function TakeawaysCard({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="takeaways" id="sec-takeaways" style={{ scrollMarginTop: '100px' }}>
      <div className="takeaways__title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--color-primary)" aria-hidden="true">
          <path d="M12 2l2.39 7.36H22l-6.2 4.51 2.39 7.36L12 16.72l-6.19 4.51 2.39-7.36L2 9.36h7.61z" />
        </svg>
        Key Takeaways
      </div>
      <ul className="takeaways__list">
        {items.map((item, i) => (
          <li key={i}>
            <span className="n" aria-hidden="true">{i + 1}</span>
            <p>{item}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tag Row
// ---------------------------------------------------------------------------
function TagRow({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <div className="tag-row">
      <span className="tag-row__label">Topics</span>
      {tags.map((tag) => (
        <span key={tag} className="sermon-tag">{tag}</span>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Scripture List (Scripture tab)
// ---------------------------------------------------------------------------
function ScriptureList({ groups }: { groups: NonNullable<Sermon['scriptureGroups']> }) {
  return (
    <>
      <div className="scripture-list-intro">
        <p>
          Every scripture referenced in this sermon, in the order they appear.
        </p>
      </div>
      <div className="scripture-list" role="list">
        {groups.map((g, i) => {
          const badge = deriveBookBadge(g.verse);
          const bibleUrl = `https://www.biblegateway.com/passage/?search=${encodeURIComponent(g.verse)}&version=NKJV`;
          return (
            <a
              key={i}
              className="scripture-item"
              href={bibleUrl}
              target="_blank"
              rel="noopener noreferrer"
              role="listitem"
              aria-label={`Open ${g.verse} on Bible Gateway`}
            >
              <div className="scripture-badge" aria-hidden="true">{badge}</div>
              <div className="scripture-item__body">
                {g.kicker && <span className="scripture-kicker">{g.kicker}</span>}
                <h4>{g.verse}</h4>
                <blockquote className="scripture-quote">
                  <p>{g.text}</p>
                </blockquote>
              </div>
            </a>
          );
        })}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Table of Contents (aside)
// ---------------------------------------------------------------------------
function TableOfContents({
  sections,
  displayNums,
  activeSectionId,
}: {
  sections: SectionData[];
  displayNums: (number | undefined)[];
  activeSectionId: string;
}) {

  if (sections.length === 0) return null;
  return (
    <nav className="toc" aria-label="Table of contents">
      <div className="toc__title">In this Sermon</div>
      <ol className="toc__list">
        {sections.map((s, i) => {
          const n = displayNums[i];
          return (
            <li key={s.id} className="toc__item">
              <a
                href={`#${s.id}`}
                aria-current={activeSectionId === s.id ? 'location' : undefined}
              >
                <span className="toc__num" aria-hidden="true">{n ?? '•'}</span>
                {s.title}
              </a>
            </li>
          );
        })}
        <li className="toc__item">
          <a
            href="#sec-takeaways"
            aria-current={activeSectionId === 'sec-takeaways' ? 'location' : undefined}
          >
            <span className="toc__num" aria-hidden="true">★</span>
            Key Takeaways
          </a>
        </li>
      </ol>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Speaker Card (aside)
// ---------------------------------------------------------------------------
function SpeakerCard({ sermon }: { sermon: Sermon }) {
  const initials = sermon.speaker
    .split(' ')
    .filter((w) => /^[A-Z]/i.test(w))
    .slice(-2)
    .map((w) => w[0].toUpperCase())
    .join('');

  // Speaker subtitle: role (capitalized) and/or the church name, joined by a dot.
  // `hideChurchName` opts a sermon out of the "Gateway Church" suffix (e.g. guest/missionary speakers).
  const role = sermon.speakerRole
    ? `${sermon.speakerRole.charAt(0).toUpperCase()}${sermon.speakerRole.slice(1)}`
    : '';
  const churchName = sermon.hideChurchName ? '' : 'Gateway Church';
  const speakerSubtitle = [role, churchName].filter(Boolean).join(' · ');

  return (
    <div className="aside-card">
      <h4>Speaker</h4>
      <div className="speaker">
        <div className="speaker__avatar" aria-hidden="true">{initials}</div>
        <div className="speaker__body">
          <strong>{sermon.speaker}</strong>
          {speakerSubtitle && <span>{speakerSubtitle}</span>}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Watch Message Card (aside — only when videoUrl present)
// ---------------------------------------------------------------------------
function WatchMessageCard({ videoUrl, title }: { videoUrl: string; title: string }) {
  return (
    <div className="aside-card">
      <h4>Watch Message</h4>
      <div className="video-aside">
        <iframe
          src={videoUrl}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Share Card (aside)
// ---------------------------------------------------------------------------
function ShareCard({ onShareClick }: { onShareClick: () => void }) {
  return (
    <div className="aside-card">
      <h4>Share this Sermon</h4>
      <div style={{ display: 'grid', gap: '8px' }}>
        <button
          className="sermon-btn sermon-btn--outline sermon-btn--block"
          onClick={onShareClick}
          aria-label="Share this sermon"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14" aria-hidden="true">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          Share Sermon
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Upcoming Events Card (aside)
// ---------------------------------------------------------------------------
function UpcomingEventsCard({ events }: { events: Event[] }) {
  if (events.length === 0) return null;

  return (
    <div className="aside-card">
      <h4>Upcoming Events</h4>
      <div style={{ display: 'grid', gap: '4px' }}>
        {events.map((event) => {
          const d = new Date(event.date);
          const day = d.getDate();
          const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
          return (
            <Link
              key={event.id}
              href="/events"
              className="event-row"
            >
              <div className="event-date-badge">
                <strong>{day}</strong>
                <span>{month}</span>
              </div>
              <div className="event-row__body">
                <strong>{event.title}</strong>
                <span>{event.day} · {event.time}</span>
              </div>
            </Link>
          );
        })}
      </div>
      <Link
        href="/events"
        style={{
          display: 'block',
          marginTop: '14px',
          textAlign: 'center',
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: 'var(--color-primary-dark)',
          textDecoration: 'none',
        }}
      >
        View All Events →
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function SermonDetailClient({
  sermon,
  // relatedSermons and seriesSermons are accepted from page.tsx but not yet
  // rendered in the Modern Reader layout (future enhancement).
  relatedSermons: _relatedSermons, // eslint-disable-line @typescript-eslint/no-unused-vars
  seriesSermons: _seriesSermons, // eslint-disable-line @typescript-eslint/no-unused-vars
  upcomingEvents,
}: Props) {
  const [activeTab, setActiveTab] = useState<'notes' | 'scripture'>('notes');
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState('');
  const notesTabId = 'tab-notes';
  const scriptureTabId = 'tab-scripture';
  const notesPanelId = 'panel-notes';
  const scripturePanelId = 'panel-scripture';

  // ---- Derive sections ----
  const sections: SectionData[] = useMemo(() => {
    if (sermon.sections && sermon.sections.length > 0) {
      return sermon.sections.map((s, i) => ({
        id: s.id || slugifySectionId(s.title, i),
        kicker: s.kicker ?? undefined,
        title: s.title,
        paragraphs: s.paragraphs,
        callout: s.callout,
        unnumbered: s.unnumbered,
        subItems: s.subItems,
      }));
    }
    return parseSermonSections(sermon.description).map((s) => ({
      ...s,
      kicker: s.kicker || undefined,
      callout: undefined,
      unnumbered: true,
    }));
  }, [sermon]);

  // Running point number — skips sections marked `unnumbered` so intros/context
  // don't get labeled as "01".
  const sectionDisplayNums = useMemo(() => {
    let n = 0;
    return sections.map((s) => (s.unnumbered ? undefined : ++n));
  }, [sections]);

  const keyTakeaways = useMemo(
    () => sermon.keyTakeaways ?? sermon.keyPoints ?? [],
    [sermon.keyTakeaways, sermon.keyPoints]
  );

  const blessings = useMemo(
    () => sermon.blessings ?? [],
    [sermon.blessings]
  );

  const scriptureGroups: NonNullable<Sermon['scriptureGroups']> = useMemo(
    () =>
      sermon.scriptureGroups ??
      sermon.scriptures.map((s) => ({
        kicker: '',
        verse: s.verse,
        text: s.text,
      })),
    [sermon.scriptureGroups, sermon.scriptures]
  );

  // ---- Reading minutes (all text combined) ----
  const readingMinutes = useMemo(() => {
    const allText = [
      ...sections.flatMap((s) => [
        ...s.paragraphs,
        ...(s.subItems ?? []).map((item) => item.text),
      ]),
      ...blessings.map((b) => b.text),
      ...keyTakeaways,
    ].join(' ');
    return estimateReadingMinutes(allText);
  }, [sections, blessings, keyTakeaways]);

  // ---- Scroll-spy TOC ----
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setupObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const sectionIds = [...sections.map((s) => s.id), 'sec-takeaways'];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) {
          setActiveSectionId(visible.target.id);
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    elements.forEach((el) => observerRef.current?.observe(el));
  }, [sections]);

  useEffect(() => {
    setupObserver();
    return () => {
      observerRef.current?.disconnect();
    };
  }, [setupObserver]);

  return (
    <div>
      <ReadingProgressBar />
      <LandingHeader />

      {/* ======= Hero ======= */}
      <section className="sermon-hero">
        <div className="landing-container">
          <SermonBreadcrumbs title={sermon.title} />
          <div className="sermon-hero__layout">
            <div>
              <SermonEyebrow series={sermon.series} number={sermon.seriesNumber} />
              <SermonHeroTitle sermon={sermon} />
              <p className="sermon-hero__deck">{sermon.excerpt}</p>
              <SermonMetaRow sermon={sermon} readingMinutes={readingMinutes} />
            </div>
            <HeroArtwork sermon={sermon} />
          </div>
        </div>
      </section>
 <ProjectBanner
                            badge="Belong"
                            title="There's a seat saved for you."
                            buttonLabel="Join us this Sunday"
                            buttonAriaLabel="Join us this Sunday"
                            ariaLabel="Join us this Sunday"
                            route={'/events/sonday-service'}
                        />
      {/* ======= Body ======= */}
      <section className="sermon-body">
        <div className="landing-container">
          <div className="sermon-reader-grid">

            {/* ---- Main Article ---- */}
            <article>
              {/* Tabs */}
              <div
                className="sermon-tabs"
                role="tablist"
                aria-label="Sermon content"
              >
                <button
                  id={notesTabId}
                  className="sermon-tab"
                  role="tab"
                  aria-selected={activeTab === 'notes'}
                  aria-controls={notesPanelId}
                  onClick={() => setActiveTab('notes')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="8" y1="13" x2="16" y2="13" />
                    <line x1="8" y1="17" x2="12" y2="17" />
                  </svg>
                  Sermon Notes
                </button>
                <button
                  id={scriptureTabId}
                  className="sermon-tab"
                  role="tab"
                  aria-selected={activeTab === 'scripture'}
                  aria-controls={scripturePanelId}
                  onClick={() => setActiveTab('scripture')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                  Scripture
                  <span
                    style={{
                      background: 'var(--color-primary)',
                      color: '#fff',
                      padding: '2px 8px',
                      borderRadius: '20px',
                      fontSize: '10px',
                      marginLeft: '4px',
                      fontWeight: 700,
                    }}
                    aria-label={`${scriptureGroups.length} passages`}
                  >
                    {scriptureGroups.length}
                  </span>
                </button>
              </div>

              {/* Notes Tab Panel */}
              <div
                id={notesPanelId}
                role="tabpanel"
                aria-labelledby={notesTabId}
                className={`tab-panel${activeTab === 'notes' ? ' is-active' : ''}`}
              >
                {sections.map((s, i) => (
                  <SectionBlock key={s.id} section={s} displayNum={sectionDisplayNums[i]} />
                ))}

                {blessings.length > 0 && (
                  <BlessingsGrid blessings={blessings} />
                )}

                {keyTakeaways.length > 0 && (
                  <TakeawaysCard items={keyTakeaways} />
                )}

                <TagRow tags={sermon.tags} />
              </div>

              {/* Scripture Tab Panel */}
              <div
                id={scripturePanelId}
                role="tabpanel"
                aria-labelledby={scriptureTabId}
                className={`tab-panel${activeTab === 'scripture' ? ' is-active' : ''}`}
              >
                <ScriptureList groups={scriptureGroups} />
              </div>
            </article>

            {/* ---- Aside ---- */}
            <aside className="sermon-reader-grid__aside" aria-label="Sermon sidebar">
              <TableOfContents
                sections={sections}
                displayNums={sectionDisplayNums}
                activeSectionId={activeSectionId}
              />
              <SpeakerCard sermon={sermon} />
              {sermon.videoUrl && (
                <WatchMessageCard
                  videoUrl={sermon.videoUrl}
                  title={sermon.title}
                />
              )}
              <ShareCard onShareClick={() => setShowShareModal(true)} />
              <UpcomingEventsCard events={upcomingEvents} />
            </aside>

          </div>
        </div>
      </section>

      {/* Back to sermons */}
      <section
        style={{
          padding: '40px 0',
          background: '#ffffff',
          borderTop: '1px solid var(--border-color-light)',
          textAlign: 'center',
        }}
      >
        <div className="landing-container">
          <Link href="/sermon-notes" className="sermon-btn sermon-btn--outline">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to All Sermons
          </Link>
        </div>
      </section>

      <LandingFooter />

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={sermon.title}
        excerpt={sermon.excerpt}
        modalTitle="Share Sermon"
      />
    </div>
  );
}
