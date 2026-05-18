'use client';

import React from 'react';

interface ScriptureCardProps {
    verse: string;
    text: string;
    className?: string;
    /**
     * When set, the verse text is visually clamped to this many lines using
     * `-webkit-line-clamp` and the card link continues out to BibleGateway
     * for the full passage. Omit (or 0) to render the full text inline.
     */
    maxLines?: number;
}

export const ScriptureCard: React.FC<ScriptureCardProps> = ({ verse, text, className = '', maxLines }) => {
    const bibleGatewayUrl = `https://www.biblegateway.com/passage/?search=${encodeURIComponent(verse)}&version=NKJV`;

    const clamp = maxLines && maxLines > 0;
    const quoteStyle: React.CSSProperties = clamp
        ? {
              display: '-webkit-box',
              WebkitLineClamp: maxLines,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
          }
        : {};

    return (
        <a
            href={bibleGatewayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`scripture-card enhanced-scripture ${className}`}
            style={{
                display: 'block',
                textDecoration: 'none',
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <span className="scripture-verse-pill" style={{ marginBottom: 0 }}>{verse}</span>
                <span style={{ opacity: 0.7, background: 'rgba(255,255,255,0.1)', padding: '6px', borderRadius: '50%', display: 'flex' }}>
                    <i className="pi pi-external-link" style={{ fontSize: '12px' }} />
                </span>
            </div>
            <blockquote
                className="scripture-quote"
                style={quoteStyle}
                title={clamp ? text : undefined}
            >
                &ldquo;{text}&rdquo;
            </blockquote>
            <div style={{ marginTop: '20px', fontSize: '12px', opacity: 0.6, fontStyle: 'italic', textAlign: 'right' }}>
                Click to read more <i className="pi pi-arrow-right" style={{ fontSize: '10px', marginLeft: '4px' }}></i>
            </div>
        </a>
    );
};
