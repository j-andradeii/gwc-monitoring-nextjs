/**
 * Sermon Notes Page
 *
 * Public page displaying sermon notes with landing page consistent design
 */

'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '@/styles/landing.css';
import { LandingHeader, LandingFooter, ContactSection, ScrollAnimationProvider, PageHero } from '@/components/landing';
import { sermons, getAllSeries, getFeaturedSermon } from '@/data/sermons';

export default function SermonNotesPage() {
  const [selectedSeries, setSelectedSeries] = useState('All Series');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const seriesOptions = ['All Series', ...getAllSeries()];

  const filteredSermons = useMemo(() => {
    return sermons.filter((sermon) => {
      const matchesSeries = selectedSeries === 'All Series' || sermon.series === selectedSeries;
      const matchesSearch =
        searchQuery === '' ||
        sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sermon.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sermon.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sermon.scriptures.some(s => s.verse.toLowerCase().includes(searchQuery.toLowerCase()) || s.text.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSeries && matchesSearch;
    });
  }, [selectedSeries, searchQuery]);

  const featuredSermon = getFeaturedSermon();
  const regularSermons = filteredSermons.filter((s) => !s.isFeatured || selectedSeries !== 'All Series' || searchQuery !== '');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="landing-page">
      <LandingHeader />

      <PageHero
        id="sermons-top"
        badge="Study Resources"
        title="Sermon Notes"
        subtitle="Dive deeper into God's Word with notes from our recent sermons. Use these resources for personal study, small group discussions, and spiritual growth."
        backgroundImage="/assets/images/community.jpg"
        className="sermons-hero"
      />

      {/* Main Content */}
      <main className="landing-main" style={{ paddingTop: 0 }}>
        {/* Featured Sermon - White with subtle gold accent */}
        {featuredSermon && selectedSeries === 'All Series' && searchQuery === '' && (
          <section style={{
            padding: '60px 0',
            background: '#ffffff',
            position: 'relative',
          }}>
            <div className="landing-container">
              <div style={{ marginBottom: '24px' }}>
                <span className="section-label">Latest Message</span>
              </div>
              <Link
                href={`/sermon-notes/${featuredSermon.id}`}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '40px',
                    alignItems: 'center',
                    background: '#ffffff',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                  className="featured-sermon-grid"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  <div style={{ position: 'relative', aspectRatio: '4/3' }}>
                    <Image
                      src={featuredSermon.image}
                      alt={featuredSermon.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      unoptimized
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      }}
                      className="play-overlay"
                    >
                      <i className="pi pi-play-circle" style={{ fontSize: '64px', color: 'white' }} />
                    </div>
                  </div>
                  <div style={{ padding: '40px 40px 40px 0' }} className="featured-sermon-content">
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '6px 16px',
                        backgroundColor: 'var(--primary-gold-accent)',
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        marginBottom: '16px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {featuredSermon.series}
                    </div>
                    <h2
                      style={{
                        fontSize: '32px',
                        marginBottom: '16px',
                        color: 'var(--text-primary)',
                        lineHeight: '1.2',
                      }}
                    >
                      {featuredSermon.title}
                    </h2>
                    <p
                      style={{
                        fontSize: '16px',
                        color: 'var(--text-secondary)',
                        marginBottom: '20px',
                        lineHeight: '1.7',
                      }}
                    >
                      {featuredSermon.excerpt}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '24px',
                        marginBottom: '20px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '14px',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        <i className="pi pi-user" style={{ color: 'var(--primary-gold-accent)' }} />
                        {featuredSermon.speaker}
                      </span>
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '14px',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        <i className="pi pi-calendar" style={{ color: 'var(--primary-gold-accent)' }} />
                        {formatDate(featuredSermon.date)}
                      </span>
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '14px',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        <i className="pi pi-book" style={{ color: 'var(--primary-gold-accent)' }} />
                        {featuredSermon.scriptures[0].verse}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <span className="landing-btn landing-btn-primary">
                        <i className="pi pi-play-circle" />
                        Watch Now
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* Search and Filter Section - Soft Gold */}
        <section
          style={{
            padding: '40px 0',
            background: 'linear-gradient(180deg, #fefcf3 0%, #fdf6e3 100%)',
            borderBottom: '1px solid rgba(240, 180, 41, 0.15)',
            position: 'sticky',
            top: '64px',
            zIndex: 100,
          }}
        >
          <div className="landing-container">
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {/* Search Input */}
              <div style={{ position: 'relative', flex: '1', minWidth: '250px', maxWidth: '400px' }}>
                <i
                  className="pi pi-search"
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-secondary)',
                    fontSize: '14px',
                  }}
                />
                <input
                  type="text"
                  placeholder="Search sermons, speakers, or scripture..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 46px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '12px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                    backgroundColor: '#ffffff',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary-gold-accent)';
                    e.target.style.boxShadow = '0 0 0 4px var(--gold-shadow-hover)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border-color)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-secondary)',
                      padding: '4px',
                    }}
                  >
                    <i className="pi pi-times" />
                  </button>
                )}
              </div>

              {/* Desktop Filters */}
              <div className="desktop-filters" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {seriesOptions.map((series) => (
                  <button
                    key={series}
                    onClick={() => setSelectedSeries(series)}
                    style={{
                      padding: '12px 20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      border: '2px solid',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      backgroundColor:
                        selectedSeries === series ? 'var(--primary-gold-accent)' : 'transparent',
                      borderColor:
                        selectedSeries === series
                          ? 'var(--primary-gold-accent)'
                          : 'var(--border-color)',
                      color: selectedSeries === series ? '#ffffff' : 'var(--text-secondary)',
                    }}
                  >
                    {series}
                  </button>
                ))}
              </div>

              {/* Mobile Filter Dropdown */}
              <div className="mobile-filters" style={{ position: 'relative', display: 'none' }}>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '14px 20px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                  }}
                >
                  <i className="pi pi-filter" />
                  {selectedSeries}
                  <i className={`pi pi-chevron-${isFilterOpen ? 'up' : 'down'}`} />
                </button>
                {isFilterOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '8px',
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                      overflow: 'hidden',
                      minWidth: '200px',
                      zIndex: 10,
                    }}
                  >
                    {seriesOptions.map((series) => (
                      <button
                        key={series}
                        onClick={() => {
                          setSelectedSeries(series);
                          setIsFilterOpen(false);
                        }}
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '14px 20px',
                          border: 'none',
                          backgroundColor:
                            selectedSeries === series ? 'var(--primary-gold-accent)' : 'transparent',
                          color: selectedSeries === series ? '#ffffff' : 'var(--text-primary)',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '14px',
                          transition: 'background-color 0.2s ease',
                        }}
                      >
                        {series}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Results Count */}
            <div style={{ marginTop: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              {filteredSermons.length === sermons.length
                ? `Showing all ${sermons.length} sermon notes`
                : `Found ${filteredSermons.length} sermon${filteredSermons.length !== 1 ? 's' : ''}`}
            </div>
          </div>
        </section>

        {/* Sermon Notes Grid - Warm Cream Background */}
        <section style={{
          padding: '60px 0',
          background: '#fff',
        }}>
          <div className="landing-container">
            {regularSermons.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                  gap: '24px',
                }}
              >
                {regularSermons.map((sermon) => (
                  <Link
                    key={sermon.id}
                    href={`/sermon-notes/${sermon.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <article
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        height: '100%',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 24px 50px rgba(0, 0, 0, 0.18), 0 8px 20px rgba(0, 0, 0, 0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)';
                      }}
                    >
                      {/* Card Image */}
                      <div style={{ position: 'relative', aspectRatio: '16/10' }}>
                        <Image
                          src={sermon.image}
                          alt={sermon.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          unoptimized
                        />
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                          }}
                          className="card-play-overlay"
                        >
                          <i className="pi pi-play-circle" style={{ fontSize: '48px', color: 'white' }} />
                        </div>
                        <div
                          style={{
                            position: 'absolute',
                            top: '16px',
                            left: '16px',
                            padding: '6px 14px',
                            backgroundColor: 'var(--primary-gold-accent)',
                            color: 'white',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          {sermon.series}
                        </div>
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '16px',
                            right: '16px',
                            padding: '4px 10px',
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          {sermon.duration}
                        </div>
                      </div>

                      {/* Card Content */}
                      <div style={{ padding: '24px' }}>
                        <h3
                          style={{
                            fontSize: '20px',
                            marginBottom: '12px',
                            color: 'var(--text-primary)',
                            lineHeight: '1.3',
                          }}
                        >
                          {sermon.title}
                        </h3>

                        <p
                          style={{
                            fontSize: '14px',
                            color: 'var(--text-secondary)',
                            marginBottom: '16px',
                            lineHeight: '1.6',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {sermon.excerpt}
                        </p>

                        {/* Scripture Reference */}
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            backgroundColor: 'rgba(192, 160, 103, 0.1)',
                            borderRadius: '6px',
                            marginBottom: '16px',
                          }}
                        >
                          <i
                            className="pi pi-book"
                            style={{ fontSize: '12px', color: 'var(--primary-gold-accent)' }}
                          />
                          <span
                            style={{
                              fontSize: '13px',
                              fontWeight: '600',
                              color: 'var(--primary-gold-accent)',
                            }}
                          >
                            {sermon.scriptures[0].verse}
                          </span>
                        </div>

                        {/* Meta Info */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            fontSize: '13px',
                            color: 'var(--text-secondary)',
                            marginBottom: '16px',
                            flexWrap: 'wrap',
                          }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <i
                              className="pi pi-user"
                              style={{ fontSize: '12px', color: 'var(--primary-gold-accent)' }}
                            />
                            {sermon.speaker}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <i
                              className="pi pi-calendar"
                              style={{ fontSize: '12px', color: 'var(--primary-gold-accent)' }}
                            />
                            {formatDate(sermon.date)}
                          </span>
                        </div>

                        {/* Tags */}
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '6px',
                          }}
                        >
                          {sermon.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              style={{
                                padding: '4px 10px',
                                fontSize: '11px',
                                fontWeight: '500',
                                backgroundColor: 'rgba(240, 180, 41, 0.12)',
                                color: '#b8860b',
                                borderRadius: '4px',
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div
                style={{
                  textAlign: 'center',
                  padding: '80px 20px',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                }}
              >
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 24px',
                    background: 'linear-gradient(135deg, rgba(240, 180, 41, 0.15) 0%, rgba(8, 145, 178, 0.1) 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <i
                    className="pi pi-search"
                    style={{ fontSize: '32px', color: 'var(--text-secondary)' }}
                  />
                </div>
                <h3
                  style={{
                    color: 'var(--text-primary)',
                    marginBottom: '12px',
                    fontSize: '24px',
                  }}
                >
                  No sermons found
                </h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
                  Try adjusting your search terms or filter criteria to find what you&apos;re looking
                  for.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSeries('All Series');
                  }}
                  className="landing-btn landing-btn-outline"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Load More */}
            {regularSermons.length > 0 && regularSermons.length >= 6 && (
              <div style={{ textAlign: 'center', marginTop: '48px' }}>
                <button className="landing-btn landing-btn-outline">
                  <i className="pi pi-refresh" />
                  Load More Sermons
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Subscribe CTA - Vibrant Navy with Colorful Accents */}
        <section
          style={{
            padding: '80px 0',
            background: 'linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 50%, #3d5a7f 100%)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div className="landing-container">
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <span className="section-label-light">Stay Connected</span>
              <h2 style={{ color: '#ffffff', fontSize: '32px', marginBottom: '16px' }}>
                Never Miss a Sermon
              </h2>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '16px',
                  marginBottom: '32px',
                  lineHeight: '1.7',
                }}
              >
                Subscribe to receive sermon notes directly in your inbox. Get weekly study materials
                and reflection questions to deepen your faith journey.
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  maxWidth: '450px',
                  margin: '0 auto',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  style={{
                    flex: '1',
                    minWidth: '200px',
                    padding: '14px 20px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '10px',
                    fontSize: '15px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    outline: 'none',
                  }}
                />
                <button className="landing-btn landing-btn-light">Subscribe</button>
              </div>
            </div>
          </div>
        </section>

        <ScrollAnimationProvider>
          <ContactSection />
        </ScrollAnimationProvider>
      </main>

      <LandingFooter />

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 900px) {
          .featured-sermon-grid {
            grid-template-columns: 1fr !important;
          }
          .featured-sermon-content {
            padding: 32px !important;
          }
        }
        @media (max-width: 767px) {
          .desktop-filters {
            display: none !important;
          }
          .mobile-filters {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
