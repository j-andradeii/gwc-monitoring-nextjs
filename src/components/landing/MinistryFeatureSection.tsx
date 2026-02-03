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
                        <p className="ministry-feature-description">{ministry.description}</p>
                        {/* <Link
                            href={`#${sectionId}`}
                            className="landing-btn landing-btn-outline pastors-action-btn"
                            style={{
                                borderRadius: '4px',
                                letterSpacing: '2px',
                                fontSize: '13px',
                                padding: '16px 40px',
                                borderWidth: '1px'
                            }}
                        >
                            Learn More
                        </Link> */}
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
