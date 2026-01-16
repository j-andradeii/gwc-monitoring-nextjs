'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LandingHeader, LandingFooter } from '@/components/landing';
import { Sermon } from '@/data/sermons';
import { ScriptureCard } from '@/components/cards';
import '@/styles/landing.css';

interface Props {
  sermon: Sermon;
  relatedSermons: Sermon[];
  seriesSermons: Sermon[];
}

export default function SermonDetailClient({ sermon, relatedSermons, seriesSermons }: Props) {
  const [activeTab, setActiveTab] = useState<'notes' | 'scripture'>('notes');

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

      {/* Hero Section with Video */}
      <section
        style={{
          position: 'relative',
          paddingTop: '80px',
          background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
          overflow: 'hidden',
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.05,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="landing-container" style={{ position: 'relative', zIndex: 1 }}>
          {/* Breadcrumb */}
          <nav style={{ marginBottom: '24px', paddingTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <Link
                href="/"
                style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}
              >
                Home
              </Link>
              <i className="pi pi-chevron-right" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }} />
              <Link
                href="/sermon-notes"
                style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}
              >
                Sermons
              </Link>
              <i className="pi pi-chevron-right" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }} />
              <span style={{ color: 'var(--primary-gold-accent)' }}>{sermon.title}</span>
            </div>
          </nav>

          {/* Video Player */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '1000px',
              margin: '0 auto',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              {sermon.videoUrl ? (
                <iframe
                  src={sermon.videoUrl}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={sermon.title}
                />
              ) : (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <Image
                    src={sermon.image}
                    alt={sermon.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                  {/* Gradient overlay for image-only sermons */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)',
                    }}
                  />
                  {/* Audio/Notes only badge */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '20px',
                      left: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: '8px',
                      color: 'white',
                    }}
                  >
                    <i className="pi pi-file-edit" style={{ fontSize: '18px', color: 'var(--primary-gold-accent)' }} />
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>Sermon Notes Available</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sermon Title & Meta */}
          <div style={{ maxWidth: '1000px', margin: '32px auto 40px', textAlign: 'center' }}>
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
              {sermon.series}
            </div>
            <h1
              style={{
                fontSize: 'clamp(28px, 5vw, 44px)',
                color: '#ffffff',
                marginBottom: '16px',
                fontWeight: '700',
                lineHeight: '1.2',
              }}
            >
              {sermon.title}
            </h1>
            <p
              style={{
                fontSize: '18px',
                color: 'rgba(255,255,255,0.8)',
                maxWidth: '700px',
                margin: '0 auto 24px',
                lineHeight: '1.6',
              }}
            >
              {sermon.excerpt}
            </p>

            {/* Meta Info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '24px',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {sermon.speakerImage && (
                  <Image
                    src={sermon.speakerImage}
                    alt={sermon.speaker}
                    width={40}
                    height={40}
                    style={{ borderRadius: '50%' }}
                    unoptimized
                  />
                )}
                <div style={{ textAlign: 'left' }}>
                  <div style={{ color: '#ffffff', fontWeight: '600', fontSize: '14px' }}>
                    {sermon.speaker}
                  </div>
                  {sermon.speakerRole && (
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                      {sermon.speakerRole}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ width: '1px', height: '30px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                <i className="pi pi-calendar" style={{ color: 'var(--primary-gold-accent)' }} />
                {formatDate(sermon.date)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                <i className="pi pi-clock" style={{ color: 'var(--primary-gold-accent)' }} />
                {sermon.duration}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main style={{ background: '#ffffff' }}>
        <div className="landing-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 380px',
              gap: '48px',
              padding: '60px 0',
            }}
            className="sermon-detail-grid"
          >
            {/* Left Column - Main Content */}
            <div>
              {/* Tabs */}
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '32px',
                  borderBottom: '2px solid var(--border-color)',
                  paddingBottom: '0',
                }}
              >
                <button
                  onClick={() => setActiveTab('notes')}
                  style={{
                    padding: '16px 24px',
                    fontSize: '15px',
                    fontWeight: '600',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: activeTab === 'notes' ? 'var(--primary-gold-accent)' : 'var(--text-secondary)',
                    borderBottom: activeTab === 'notes' ? '3px solid var(--primary-gold-accent)' : '3px solid transparent',
                    marginBottom: '-2px',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <i className="pi pi-file-edit" style={{ marginRight: '8px' }} />
                  Sermon Notes
                </button>
                <button
                  onClick={() => setActiveTab('scripture')}
                  style={{
                    padding: '16px 24px',
                    fontSize: '15px',
                    fontWeight: '600',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: activeTab === 'scripture' ? 'var(--primary-gold-accent)' : 'var(--text-secondary)',
                    borderBottom: activeTab === 'scripture' ? '3px solid var(--primary-gold-accent)' : '3px solid transparent',
                    marginBottom: '-2px',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <i className="pi pi-book" style={{ marginRight: '8px' }} />
                  Scripture
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'notes' && (
                <div>
                  {/* Description */}
                  {sermon.description && (
                    <div style={{ marginBottom: '40px' }}>
                      <h2 style={{ fontSize: '24px', marginBottom: '20px', color: 'var(--text-primary)' }}>
                        About This Message
                      </h2>
                      <div
                        style={{
                          fontSize: '16px',
                          lineHeight: '1.8',
                          color: 'var(--text-secondary)',
                          whiteSpace: 'pre-line',
                        }}
                      >
                        {sermon.description}
                      </div>
                    </div>
                  )}

                  {/* Key Points */}
                  {sermon.keyPoints && sermon.keyPoints.length > 0 && (
                    <div
                      style={{
                        padding: '32px',
                        backgroundColor: '#fefcf3',
                        borderRadius: '16px',
                        border: '1px solid rgba(240, 180, 41, 0.2)',
                      }}
                    >
                      <h3 style={{ fontSize: '20px', marginBottom: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="pi pi-star-fill" style={{ color: 'var(--primary-gold-accent)' }} />
                        Key Takeaways
                      </h3>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {sermon.keyPoints.map((point, index) => (
                          <li
                            key={index}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '16px',
                              marginBottom: index < sermon.keyPoints!.length - 1 ? '16px' : 0,
                              fontSize: '16px',
                              lineHeight: '1.6',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            <span
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--primary-gold-accent)',
                                color: 'white',
                                fontSize: '13px',
                                fontWeight: '700',
                                flexShrink: 0,
                              }}
                            >
                              {index + 1}
                            </span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'scripture' && (
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {sermon.scriptures.map((item, index) => (
                      <ScriptureCard
                        key={index}
                        verse={item.verse}
                        text={item.text}
                      />
                    ))}
                  </div>

                  <div style={{ marginTop: '32px', textAlign: 'center' }}>
                    <a
                      href={`https://www.biblegateway.com/passage/?search=${encodeURIComponent(sermon.scriptures[0].verse)}&version=NIV`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="landing-btn landing-btn-outline"
                    >
                      <i className="pi pi-external-link" />
                      Read Full Passage on Bible Gateway
                    </a>
                  </div>
                </div>
              )}

              {/* Tags */}
              <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Topics
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {sermon.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: '8px 16px',
                        fontSize: '13px',
                        fontWeight: '500',
                        backgroundColor: 'rgba(240, 180, 41, 0.12)',
                        color: '#b8860b',
                        borderRadius: '20px',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <aside>
              {/* Actions Card */}
              <div
                style={{
                  padding: '24px',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  marginBottom: '24px',
                }}
              >
                <h3 style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--text-primary)' }}>
                  Resources
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {sermon.downloadUrl && (
                    <a
                      href={sermon.downloadUrl}
                      className="landing-btn landing-btn-primary"
                      style={{ justifyContent: 'center' }}
                    >
                      <i className="pi pi-download" />
                      Download Notes (PDF)
                    </a>
                  )}
                  {sermon.audioUrl && (
                    <a
                      href={sermon.audioUrl}
                      className="landing-btn landing-btn-outline"
                      style={{ justifyContent: 'center' }}
                    >
                      <i className="pi pi-headphones" />
                      Listen to Audio
                    </a>
                  )}
                  <button
                    className="landing-btn landing-btn-outline"
                    style={{ justifyContent: 'center' }}
                    onClick={() => {
                      navigator.share?.({
                        title: sermon.title,
                        text: sermon.excerpt,
                        url: window.location.href,
                      }).catch(() => {
                        navigator.clipboard.writeText(window.location.href);
                      });
                    }}
                  >
                    <i className="pi pi-share-alt" />
                    Share Sermon
                  </button>
                </div>
              </div>

              {/* Series Card */}
              <div
                style={{
                  padding: '24px',
                  background: 'linear-gradient(135deg, #fefcf3 0%, #fdf6e3 100%)',
                  borderRadius: '16px',
                  border: '1px solid rgba(240, 180, 41, 0.2)',
                  marginBottom: '24px',
                }}
              >
                <h3 style={{ fontSize: '16px', marginBottom: '8px', color: 'var(--text-primary)' }}>
                  {sermon.series}
                </h3>
                {sermon.seriesDescription && (
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.6' }}>
                    {sermon.seriesDescription}
                  </p>
                )}
                {seriesSermons.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      More in this series
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {seriesSermons.slice(0, 3).map((s) => (
                        <Link
                          key={s.id}
                          href={`/sermon-notes/${s.id}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            backgroundColor: 'white',
                            borderRadius: '10px',
                            textDecoration: 'none',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateX(4px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateX(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <i className="pi pi-play-circle" style={{ color: 'var(--primary-gold-accent)', fontSize: '18px' }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {s.title}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                              {s.speaker}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Related Sermons */}
              {relatedSermons.length > 0 && (
                <div
                  style={{
                    padding: '24px',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <h3 style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--text-primary)' }}>
                    You Might Also Like
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {relatedSermons.map((s) => (
                      <Link
                        key={s.id}
                        href={`/sermon-notes/${s.id}`}
                        style={{
                          display: 'flex',
                          gap: '12px',
                          textDecoration: 'none',
                        }}
                      >
                        <div
                          style={{
                            position: 'relative',
                            width: '80px',
                            height: '50px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            flexShrink: 0,
                          }}
                        >
                          <Image
                            src={s.image}
                            alt={s.title}
                            fill
                            style={{ objectFit: 'cover' }}
                            unoptimized
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: 'var(--text-primary)',
                              marginBottom: '4px',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {s.title}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {s.speaker}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>

        {/* Back to All Sermons */}
        <section
          style={{
            padding: '60px 0',
            backgroundColor: '#f8fafc',
            textAlign: 'center',
          }}
        >
          <div className="landing-container">
            <Link href="/sermon-notes" className="landing-btn landing-btn-outline">
              <i className="pi pi-arrow-left" />
              Back to All Sermons
            </Link>
          </div>
        </section>
      </main>

      <LandingFooter />

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 900px) {
          .sermon-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
