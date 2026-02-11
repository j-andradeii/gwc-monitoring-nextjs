'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Ministry } from '@/data/ministries';

interface MinistryFeatureSectionProps {
    ministry: Ministry;
    reverse?: boolean;
    alternateBackground?: boolean;
}

export const MinistryFeatureSection: React.FC<MinistryFeatureSectionProps> = ({
    ministry,
    reverse = false,
    alternateBackground = false,
}) => {
    // Create a URL-friendly ID from the title for fragment navigation
    // e.g. "Kids Church" -> "kids-church"
    const sectionId = ministry.title.toLowerCase().replace(/\s+/g, '-');

    return (
        <section
            id={sectionId}
            className={`ministry-feature-section pastor-style ${reverse ? 'ministry-feature-reverse' : ''} ${alternateBackground ? 'section-alternate-bg' : ''}`}
        >
            <div className="landing-container">
                <div className="ministry-feature-grid">
                    {/* Card Content */}
                    <div className="ministry-feature-card animate-on-scroll">
                        <h2 className="ministry-feature-title">{ministry.title}</h2>
                        <div
                            style={{
                                fontSize: '18px',
                                lineHeight: '1.9',
                                color: 'var(--text-primary)',
                                whiteSpace: 'pre-line',
                            }}
                            dangerouslySetInnerHTML={{
                                __html: ministry.description
                                    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                            }}
                        />
                        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                            {ministry.social?.facebook && (
                                <a
                                    href={ministry.social.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="landing-btn landing-btn-outline pastors-action-btn"
                                    style={{
                                        borderRadius: '4px',
                                        letterSpacing: '1px',
                                        fontSize: '13px',
                                        padding: '12px 24px',
                                        borderWidth: '1px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <i className="pi pi-facebook"></i>
                                    Facebook
                                </a>
                            )}
                            {ministry.social?.instagram && (
                                <a
                                    href={ministry.social.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="landing-btn landing-btn-outline pastors-action-btn"
                                    style={{
                                        borderRadius: '4px',
                                        letterSpacing: '1px',
                                        fontSize: '13px',
                                        padding: '12px 24px',
                                        borderWidth: '1px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <i className="pi pi-instagram"></i>
                                    Instagram
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Image */}
                    <div className="ministry-feature-image-wrapper animate-on-scroll">
                        <Image
                            src={ministry.image}
                            alt={ministry.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MinistryFeatureSection;
