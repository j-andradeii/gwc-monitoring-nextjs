/**
 * Sermon Notes Client Component
 *
 * Public page displaying sermon notes with landing page consistent design
 */

'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LandingHeader, LandingFooter, ContactSection, ScrollAnimationProvider, PageHero, ProjectBanner } from '@/components/landing';
import { sermons, getAllSeries, getFeaturedSermon } from '@/data/sermons';

export default function SermonNotesClient() {
    const [selectedSeries, setSelectedSeries] = useState('All Series');
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const seriesOptions = ['All Series', ...getAllSeries()];

    const filteredSermons = useMemo(() => {
        return sermons
            .filter((sermon) => {
                const matchesSeries = selectedSeries === 'All Series' || sermon.series === selectedSeries;
                const matchesSearch =
                    searchQuery === '' ||
                    sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    sermon.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    sermon.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    sermon.scriptures.some(s => s.verse.toLowerCase().includes(searchQuery.toLowerCase()) || s.text.toLowerCase().includes(searchQuery.toLowerCase()));
                return matchesSeries && matchesSearch;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
                backgroundImage="https://gtxngthtpisigkys.public.blob.vercel-storage.com/notes.jpg"
                className="sermons-hero"
            />
            <ProjectBanner
                badge="Belong"
                title="There's a seat saved for you."
                buttonLabel="Join us this Sunday"
                buttonAriaLabel="Join us this Sunday"
                ariaLabel="Join us this Sunday"
                route={'/events/sonday-service'}
            />

            {/* Main Content */}
            <main className="landing-main" style={{ paddingTop: 0 }}>
                {/* Featured Sermon - warm surface with design-system border contrast */}
                {featuredSermon && selectedSeries === 'All Series' && searchQuery === '' && (
                    <section style={{
                        padding: '48px 0',
                        background: 'var(--color-ivory)',
                        position: 'relative',
                    }}>
                        <div className="landing-container">
                            <div style={{ marginBottom: '18px' }}>
                                <span className="section-label">Latest Message</span>
                            </div>
                            <Link
                                href={`/sermon-notes/${featuredSermon.slug}`}
                                style={{ textDecoration: 'none', display: 'block', maxWidth: '1040px', margin: '0 auto' }}
                            >
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '32px',
                                        alignItems: 'center',
                                        background: '#ffffff',
                                        borderRadius: '14px',
                                        border: '1px solid var(--border-color)',
                                        overflow: 'hidden',
                                        boxShadow: '0 10px 30px var(--shadow-color-soft)',
                                        transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                                    }}
                                    className="featured-sermon-grid"
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.borderColor = 'var(--primary-gold-accent)';
                                        e.currentTarget.style.boxShadow = '0 18px 42px var(--shadow-color-medium), 0 0 0 1px rgba(212, 168, 75, 0.28)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.borderColor = 'var(--border-color)';
                                        e.currentTarget.style.boxShadow = '0 10px 30px var(--shadow-color-soft)';
                                    }}
                                >
                                    <div style={{ position: 'relative', aspectRatio: '16/10' }}>
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
                                            <i className="pi pi-play-circle" style={{ fontSize: '54px', color: 'white' }} />
                                        </div>
                                    </div>
                                    <div style={{ padding: '32px 34px 32px 0' }} className="featured-sermon-content">
                                        <div
                                            style={{
                                                display: 'inline-block',
                                                padding: '6px 14px',
                                                backgroundColor: 'var(--primary-gold-accent)',
                                                color: 'white',
                                                borderRadius: '20px',
                                                fontSize: '11px',
                                                fontWeight: '600',
                                                marginBottom: '14px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                            }}
                                        >
                                            {featuredSermon.series}
                                        </div>
                                        <h2 className="featured-sermon-title">
                                            {featuredSermon.title}
                                        </h2>
                                        <p
                                            style={{
                                                fontSize: '15px',
                                                color: 'var(--text-secondary)',
                                                marginBottom: '18px',
                                                lineHeight: '1.65',
                                            }}
                                        >
                                            {featuredSermon.excerpt}
                                        </p>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '18px',
                                                marginBottom: '18px',
                                                flexWrap: 'wrap',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '7px',
                                                    fontSize: '13px',
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
                                                    gap: '7px',
                                                    fontSize: '13px',
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
                                                    gap: '7px',
                                                    fontSize: '13px',
                                                    color: 'var(--text-secondary)',
                                                }}
                                            >
                                                <i className="pi pi-book" style={{ color: 'var(--primary-gold-accent)' }} />
                                                {featuredSermon.scriptures[0].verse}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                            <span className="landing-btn landing-btn-primary">
                                                Learn More
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </section>
                )}

                {/* Search and Filter Section - Minimalist & Mobile Friendly */}
                <section
                    style={{
                        padding: '24px 0',
                        background: '#FFFCF5', // Minimalist light cream
                        position: 'sticky',
                        top: '64px',
                        zIndex: 100,
                    }}
                >
                    <div className="landing-container">
                        <div
                            className="search-filter-container"
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '16px',
                                justifyContent: 'center', // Center content for a balanced look
                                alignItems: 'center',
                            }}
                        >
                            {/* Search Input - Clean & Minimal */}
                            <div className="search-input-wrapper" style={{ position: 'relative', flex: '1', minWidth: '280px', maxWidth: '500px' }}>
                                <i
                                    className="pi pi-search"
                                    style={{
                                        position: 'absolute',
                                        left: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#9ca3af',
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
                                        padding: '10px 14px 10px 38px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        outline: 'none',
                                        transition: 'all 0.2s ease',
                                        backgroundColor: '#ffffff',
                                        color: '#374151',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = 'var(--primary-gold-accent)';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(240, 180, 41, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e5e7eb';
                                        e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                                    }}
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        style={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#9ca3af',
                                            padding: '4px',
                                        }}
                                    >
                                        <i className="pi pi-times" style={{ fontSize: '12px' }} />
                                    </button>
                                )}
                            </div>

                            {/* Desktop Filters - Simple Pills */}
                            <div className="desktop-filters" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {seriesOptions.map((series) => (
                                    <button
                                        key={series}
                                        onClick={() => setSelectedSeries(series)}
                                        style={{
                                            padding: '10px 18px',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            border: selectedSeries === series ? 'none' : '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            backgroundColor:
                                                selectedSeries === series ? 'var(--primary-gold-accent)' : '#ffffff',
                                            color: selectedSeries === series ? '#ffffff' : '#4b5563',
                                            boxShadow: selectedSeries === series ? '0 4px 12px rgba(240, 180, 41, 0.2)' : '0 1px 2px rgba(0,0,0,0.05)',
                                        }}
                                    >
                                        {series}
                                    </button>
                                ))}
                            </div>

                            {/* Mobile Filter Button - Primary Action */}
                            <div className="mobile-filters" style={{ position: 'relative', display: 'none' }}>
                                <button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '12px 20px',
                                        border: 'none',
                                        borderRadius: '8px',
                                        backgroundColor: 'var(--primary-gold-accent)',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#ffffff',
                                        boxShadow: '0 4px 12px rgba(240, 180, 41, 0.2)',
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
                                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                                            overflow: 'hidden',
                                            minWidth: '220px',
                                            zIndex: 10,
                                            border: '1px solid #f3f4f6',
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
                                                    padding: '12px 20px',
                                                    border: 'none',
                                                    backgroundColor:
                                                        selectedSeries === series ? '#fffbf2' : 'transparent',
                                                    color: selectedSeries === series ? 'var(--primary-gold-accent)' : '#4b5563',
                                                    textAlign: 'left',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    fontWeight: selectedSeries === series ? '600' : '400',
                                                    transition: 'background-color 0.2s ease',
                                                    borderLeft: selectedSeries === series ? '3px solid var(--primary-gold-accent)' : '3px solid transparent',
                                                }}
                                            >
                                                {series}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Results Count - Subtle */}
                        <div style={{ marginTop: '12px', fontSize: '13px', color: '#9ca3af', textAlign: 'center' }}>
                            {filteredSermons.length === sermons.length
                                ? `Showing all ${sermons.length} sermon notes`
                                : `Found ${filteredSermons.length} sermon${filteredSermons.length !== 1 ? 's' : ''}`}
                        </div>
                    </div>
                </section>

                {/* Sermon Notes Grid - warm surface with higher-contrast cards */}
                <section style={{
                    padding: '52px 0',
                    background: 'var(--color-ivory)',
                }}>
                    <div className="landing-container">
                        {regularSermons.length > 0 ? (
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
                                    gap: '20px',
                                    maxWidth: '1040px',
                                    margin: '0 auto',
                                }}
                            >
                                {regularSermons.map((sermon) => (
                                    <Link
                                        key={sermon.id}
                                        href={`/sermon-notes/${sermon.slug}`}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <article
                                            style={{
                                                backgroundColor: '#ffffff',
                                                borderRadius: '14px',
                                                border: '1px solid var(--border-color)',
                                                overflow: 'hidden',
                                                boxShadow: '0 8px 24px var(--shadow-color-soft)',
                                                transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                                                height: '100%',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-4px)';
                                                e.currentTarget.style.borderColor = 'var(--primary-gold-accent)';
                                                e.currentTarget.style.boxShadow = '0 16px 36px var(--shadow-color-medium), 0 0 0 1px rgba(212, 168, 75, 0.24)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.borderColor = 'var(--border-color)';
                                                e.currentTarget.style.boxShadow = '0 8px 24px var(--shadow-color-soft)';
                                            }}
                                        >
                                            {/* Card Image */}
                                            <div style={{ position: 'relative', aspectRatio: '16/9' }}>
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
                                                    <i className="pi pi-play-circle" style={{ fontSize: '40px', color: 'white' }} />
                                                </div>
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        top: '12px',
                                                        left: '12px',
                                                        padding: '5px 12px',
                                                        backgroundColor: 'var(--primary-gold-accent)',
                                                        color: 'white',
                                                        borderRadius: '20px',
                                                        fontSize: '10px',
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
                                                        bottom: '12px',
                                                        right: '12px',
                                                        padding: '4px 10px',
                                                        backgroundColor: 'rgba(0,0,0,0.7)',
                                                        color: 'white',
                                                        borderRadius: '4px',
                                                        fontSize: '11px',
                                                        fontWeight: '600',
                                                    }}
                                                >
                                                    {sermon.duration}
                                                </div>
                                            </div>

                                            {/* Card Content */}
                                            <div style={{ padding: '20px' }}>
                                                <h3
                                                    style={{
                                                        fontSize: '18px',
                                                        marginBottom: '10px',
                                                        color: 'var(--text-primary)',
                                                        lineHeight: '1.3',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    {sermon.title}
                                                </h3>

                                                <p
                                                    style={{
                                                        fontSize: '13.5px',
                                                        color: 'var(--text-secondary)',
                                                        marginBottom: '14px',
                                                        lineHeight: '1.55',
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
                                                        padding: '5px 10px',
                                                        backgroundColor: 'rgba(192, 160, 103, 0.1)',
                                                        borderRadius: '6px',
                                                        marginBottom: '14px',
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
                                                        gap: '14px',
                                                        fontSize: '12.5px',
                                                        color: 'var(--text-secondary)',
                                                        marginBottom: '14px',
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
                                                                fontSize: '10.5px',
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

                {/* Subscribe CTA - High Contrast Navy */}
                {/* <section className="service-cta-section">
          <div className="landing-container">
            <div className="service-cta-content">
              <span className="section-label-light">Stay Connected</span>
              <h2>Never Miss a Sermon</h2>
              <p>
                Subscribe to receive sermon notes directly in your inbox. Get weekly study materials
                and reflection questions to deepen your faith journey.
              </p>
              <div className="subscribe-form">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="subscribe-input"
                />
                <button className="landing-btn landing-btn-border-light">Subscribe</button>
              </div>
            </div>
          </div>
        </section> */}

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
          .search-filter-container {
            flex-direction: column !important;
            gap: 12px !important;
          }
          .search-input-wrapper {
            width: 100% !important;
            max-width: 100% !important;
            min-width: 100% !important;
          }
          .desktop-filters {
            display: none !important;
          }

        }
      `}</style>
        </div>
    );
}
