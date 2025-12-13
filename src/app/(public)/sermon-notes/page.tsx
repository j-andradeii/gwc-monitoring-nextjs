/**
 * Sermon Notes Page
 *
 * Public page displaying sermon notes with landing page consistent design
 */

'use client';

import React, { useState } from 'react';
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
}

// Mock data - replace with actual API calls
const sermonNotes: SermonNote[] = [
  {
    id: '1',
    title: 'The Power of Faith',
    speaker: 'Pastor John Smith',
    date: '2024-12-08',
    series: 'Faith Foundations',
    excerpt: 'Exploring what it means to walk by faith and not by sight in our daily lives.',
    tags: ['Faith', 'Trust', 'Christian Living'],
    image: 'https://placehold.co/400x250/D1D1D1/232323?text=Faith',
  },
  {
    id: '2',
    title: 'Living in Community',
    speaker: 'Pastor Jane Doe',
    date: '2024-12-01',
    series: 'Better Together',
    excerpt: 'The importance of fellowship and how we grow together as the body of Christ.',
    tags: ['Community', 'Fellowship', 'Church'],
    image: 'https://placehold.co/400x250/D1D1D1/232323?text=Community',
  },
  {
    id: '3',
    title: 'Finding Your Purpose',
    speaker: 'Pastor John Smith',
    date: '2024-11-24',
    series: 'Destiny',
    excerpt: "Discovering God's unique calling and purpose for your life.",
    tags: ['Purpose', 'Calling', 'Destiny'],
    image: 'https://placehold.co/400x250/D1D1D1/232323?text=Purpose',
  },
  {
    id: '4',
    title: 'Overcoming Fear',
    speaker: 'Pastor Jane Doe',
    date: '2024-11-17',
    series: 'Faith Foundations',
    excerpt: 'How to overcome fear and anxiety through the promises of God.',
    tags: ['Fear', 'Anxiety', 'Peace'],
    image: 'https://placehold.co/400x250/D1D1D1/232323?text=Peace',
  },
  {
    id: '5',
    title: 'The Joy of Giving',
    speaker: 'Guest Speaker',
    date: '2024-11-10',
    series: 'Generosity',
    excerpt: 'Understanding the biblical principles of generosity and its blessings.',
    tags: ['Giving', 'Generosity', 'Blessings'],
    image: 'https://placehold.co/400x250/D1D1D1/232323?text=Giving',
  },
  {
    id: '6',
    title: 'Walking in Love',
    speaker: 'Pastor John Smith',
    date: '2024-11-03',
    series: 'Better Together',
    excerpt: 'Practical ways to demonstrate Christ-like love in our relationships.',
    tags: ['Love', 'Relationships', 'Grace'],
    image: 'https://placehold.co/400x250/D1D1D1/232323?text=Love',
  },
];

const seriesOptions = ['All', 'Faith Foundations', 'Better Together', 'Destiny', 'Generosity'];

export default function SermonNotesPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const filteredSermons = sermonNotes.filter((sermon) => {
    const matchesSeries = selectedSeries === 'All' || sermon.series === selectedSeries;
    const matchesSearch =
      searchQuery === '' ||
      sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeries && matchesSearch;
  });

  return (
    <div className="landing-page">
      <LandingHeader
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        closeMobileMenu={closeMobileMenu}
      />

      {/* Hero Banner */}
      <section
        className="hero-section"
        style={{
          backgroundImage: "url('https://placehold.co/1920x400/c0a067/ffffff?text=Sermon+Notes')",
          padding: '100px 0 60px',
        }}
      >
        <div className="hero-content">
          <h1 style={{ fontSize: '42px' }}>Sermon Notes</h1>
          <p style={{ fontSize: '18px', maxWidth: '600px' }}>
            Access notes from our recent sermons. Use these resources to dig deeper into
            God&apos;s Word and apply it to your life.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="landing-main" style={{ paddingTop: 0 }}>
        <section style={{ padding: '50px 0', backgroundColor: 'var(--background-section)' }}>
          <div className="landing-container">
            {/* Search and Filter */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '40px',
              }}
            >
              <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
                <i
                  className="pi pi-search"
                  style={{
                    position: 'absolute',
                    left: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-secondary)',
                  }}
                />
                <input
                  type="text"
                  placeholder="Search sermons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 15px 12px 45px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '30px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary-gold-accent)';
                    e.target.style.boxShadow = '0 0 0 3px var(--gold-shadow-hover)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border-color)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {seriesOptions.map((series) => (
                  <button
                    key={series}
                    onClick={() => setSelectedSeries(series)}
                    className={
                      selectedSeries === series
                        ? 'landing-btn landing-btn-primary'
                        : 'landing-btn landing-btn-outline'
                    }
                    style={{
                      padding: '10px 20px',
                      fontSize: '14px',
                    }}
                  >
                    {series}
                  </button>
                ))}
              </div>
            </div>

            {/* Sermon Cards */}
            <div className="sermon-list">
              {filteredSermons.map((sermon) => (
                <article key={sermon.id} className="sermon-item">
                  <div className="item-image">
                    <Image
                      src={sermon.image}
                      alt={sermon.title}
                      width={400}
                      height={250}
                      unoptimized
                    />
                  </div>

                  <div className="item-content">
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        backgroundColor: 'var(--primary-gold-accent)',
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        marginBottom: '15px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {sermon.series}
                    </div>

                    <h3>
                      <Link href="#">{sermon.title}</Link>
                    </h3>

                    <p style={{ marginBottom: '15px' }}>{sermon.excerpt}</p>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        fontSize: '14px',
                        color: 'var(--text-secondary)',
                        marginBottom: '15px',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="pi pi-user" />
                        {sermon.speaker}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="pi pi-calendar" />
                        {new Date(sermon.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        marginBottom: '20px',
                      }}
                    >
                      {sermon.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            padding: '4px 10px',
                            fontSize: '12px',
                            backgroundColor: 'var(--background-main)',
                            color: 'var(--text-secondary)',
                            borderRadius: '4px',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Link href="#" className="read-more">
                      Read Full Notes <i className="pi pi-arrow-right" style={{ marginLeft: '5px' }} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Empty State */}
            {filteredSermons.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: 'var(--text-secondary)',
                }}
              >
                <i
                  className="pi pi-search"
                  style={{ fontSize: '48px', marginBottom: '20px', display: 'block' }}
                />
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>
                  No sermons found
                </h3>
                <p>Try adjusting your search or filter criteria.</p>
              </div>
            )}

            {/* Load More */}
            {filteredSermons.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <Link href="#" className="landing-btn landing-btn-outline">
                  Load More Sermons
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
