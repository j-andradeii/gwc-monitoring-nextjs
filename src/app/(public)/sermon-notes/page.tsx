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
import { LandingHeader, LandingFooter } from '@/components/landing';

interface SermonNote {
  id: string;
  title: string;
  speaker: string;
  date: string;
  series: string;
  excerpt: string;
  tags: string[];
  image: string;
  scripture: string;
  downloadUrl?: string;
  isFeatured?: boolean;
}

// Mock data - replace with actual API calls
const sermonNotes: SermonNote[] = [
  {
    id: '1',
    title: 'The Power of Faith',
    speaker: 'Pastor John Smith',
    date: '2024-12-08',
    series: 'Faith Foundations',
    excerpt:
      'Exploring what it means to walk by faith and not by sight in our daily lives. Discover how trusting God transforms our perspective and empowers us to overcome challenges.',
    tags: ['Faith', 'Trust', 'Christian Living'],
    image: 'https://placehold.co/600x400/c0a067/ffffff?text=Faith',
    scripture: 'Hebrews 11:1-6',
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Living in Community',
    speaker: 'Pastor Jane Doe',
    date: '2024-12-01',
    series: 'Better Together',
    excerpt:
      'The importance of fellowship and how we grow together as the body of Christ. Learn practical ways to build meaningful connections.',
    tags: ['Community', 'Fellowship', 'Church'],
    image: 'https://placehold.co/600x400/D1D1D1/232323?text=Community',
    scripture: 'Acts 2:42-47',
  },
  {
    id: '3',
    title: 'Finding Your Purpose',
    speaker: 'Pastor John Smith',
    date: '2024-11-24',
    series: 'Destiny',
    excerpt:
      "Discovering God's unique calling and purpose for your life. Understanding how your gifts and passions align with His plan.",
    tags: ['Purpose', 'Calling', 'Destiny'],
    image: 'https://placehold.co/600x400/D1D1D1/232323?text=Purpose',
    scripture: 'Jeremiah 29:11-13',
  },
  {
    id: '4',
    title: 'Overcoming Fear',
    speaker: 'Pastor Jane Doe',
    date: '2024-11-17',
    series: 'Faith Foundations',
    excerpt:
      'How to overcome fear and anxiety through the promises of God. Practical steps to finding peace in uncertain times.',
    tags: ['Fear', 'Anxiety', 'Peace'],
    image: 'https://placehold.co/600x400/D1D1D1/232323?text=Peace',
    scripture: 'Isaiah 41:10',
  },
  {
    id: '5',
    title: 'The Joy of Giving',
    speaker: 'Guest Speaker',
    date: '2024-11-10',
    series: 'Generosity',
    excerpt:
      'Understanding the biblical principles of generosity and its blessings. How giving transforms both the giver and receiver.',
    tags: ['Giving', 'Generosity', 'Blessings'],
    image: 'https://placehold.co/600x400/D1D1D1/232323?text=Giving',
    scripture: '2 Corinthians 9:6-8',
  },
  {
    id: '6',
    title: 'Walking in Love',
    speaker: 'Pastor John Smith',
    date: '2024-11-03',
    series: 'Better Together',
    excerpt:
      'Practical ways to demonstrate Christ-like love in our relationships. Building bridges and healing hearts through unconditional love.',
    tags: ['Love', 'Relationships', 'Grace'],
    image: 'https://placehold.co/600x400/D1D1D1/232323?text=Love',
    scripture: '1 Corinthians 13:4-7',
  },
];

const seriesOptions = ['All Series', 'Faith Foundations', 'Better Together', 'Destiny', 'Generosity'];

export default function SermonNotesPage() {
  const [selectedSeries, setSelectedSeries] = useState('All Series');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredSermons = useMemo(() => {
    return sermonNotes.filter((sermon) => {
      const matchesSeries = selectedSeries === 'All Series' || sermon.series === selectedSeries;
      const matchesSearch =
        searchQuery === '' ||
        sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sermon.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sermon.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sermon.scripture.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSeries && matchesSearch;
    });
  }, [selectedSeries, searchQuery]);

  const featuredSermon = sermonNotes.find((s) => s.isFeatured);
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

      {/* Hero Banner */}
      <section
        className="hero-section"
        style={{
          backgroundImage: "url('https://placehold.co/1920x600/1a1a1a/ffffff?text=Sermon+Notes')",
          minHeight: '50vh',
        }}
      >
        <div className="hero-content">
          <span className="hero-badge">Study Resources</span>
          <h1>Sermon Notes</h1>
          <p>
            Dive deeper into God&apos;s Word with notes from our recent sermons. Use these resources
            for personal study, small group discussions, and spiritual growth.
          </p>
        </div>
      </section>

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
                }}
                className="featured-sermon-grid"
              >
                <div style={{ position: 'relative', aspectRatio: '4/3' }}>
                  <Image
                    src={featuredSermon.image}
                    alt={featuredSermon.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
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
                      {featuredSermon.scripture}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <Link href={`#`} className="landing-btn landing-btn-primary">
                      <i className="pi pi-file-pdf" />
                      Read Notes
                    </Link>
                    <button
                      className="landing-btn landing-btn-outline"
                      style={{ background: 'transparent' }}
                    >
                      <i className="pi pi-download" />
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
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
              {filteredSermons.length === sermonNotes.length
                ? `Showing all ${sermonNotes.length} sermon notes`
                : `Found ${filteredSermons.length} sermon${filteredSermons.length !== 1 ? 's' : ''}`}
            </div>
          </div>
        </section>

        {/* Sermon Notes Grid - Warm Cream Background */}
        <section style={{
          padding: '60px 0',
          background: 'linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%)',
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
                  <article
                    key={sermon.id}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
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
                        <Link
                          href="#"
                          style={{
                            color: 'inherit',
                            textDecoration: 'none',
                            transition: 'color 0.3s ease',
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = 'var(--primary-gold-accent)')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = 'var(--text-primary)')
                          }
                        >
                          {sermon.title}
                        </Link>
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
                          {sermon.scripture}
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
                          marginBottom: '20px',
                        }}
                      >
                        {sermon.tags.map((tag) => (
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

                      {/* Actions */}
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          paddingTop: '16px',
                          borderTop: '1px solid var(--border-color)',
                        }}
                      >
                        <Link
                          href="#"
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            padding: '10px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: 'var(--primary-gold-accent)',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            transition: 'background-color 0.3s ease',
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = 'rgba(192, 160, 103, 0.1)')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = 'transparent')
                          }
                        >
                          <i className="pi pi-eye" />
                          Read
                        </Link>
                        <button
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            padding: '10px',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: 'var(--text-secondary)',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f5f4f0';
                            e.currentTarget.style.color = 'var(--text-primary)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                          }}
                        >
                          <i className="pi pi-download" />
                          Download
                        </button>
                      </div>
                    </div>
                  </article>
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
