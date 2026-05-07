'use client';

import React from 'react';

interface ServiceInfoItem {
  icon: string;
  text: string;
}

interface PageHeroProps {
  id?: string;
  badge: string;
  title: string;
  titleAccent?: string;
  subtitle: string;
  tagline?: string;
  backgroundImage?: string;
  serviceInfo?: ServiceInfoItem[];
  className?: string;
  displayBadge?: boolean;
  displayDivider?: boolean;
}

/**
 * PageHero Component
 *
 * Reusable hero section for internal pages (About, Events, Give, Sermon Notes, etc.)
 * Sanctuary Glow design language: gold corner brackets, optional italic Fraunces
 * accent + tagline, bold modern typography with rise-and-fade entrance animations.
 */
export const PageHero: React.FC<PageHeroProps> = ({
  id,
  badge,
  title,
  titleAccent,
  subtitle,
  tagline,
  backgroundImage = '/assets/images/community.jpg',
  serviceInfo,
  className = '',
  displayBadge = true,
  displayDivider = true
}) => {
  return (
    <section
      id={id}
      className={`hero-section page-hero ${className}`.trim()}
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <div className="page-hero-frame" aria-hidden="true">
        <span className="page-hero-corner page-hero-corner--tl" />
        <span className="page-hero-corner page-hero-corner--tr" />
        <span className="page-hero-corner page-hero-corner--bl" />
        <span className="page-hero-corner page-hero-corner--br" />
      </div>
      <div className="hero-content">
        {displayBadge && (
          <span className="hero-badge">{badge}</span>
        )}
        <h1 className={titleAccent ? 'has-accent' : undefined}>
          <span className="hero-title-main">{title}</span>
          {titleAccent && (
            <span className="hero-title-accent">{titleAccent}</span>
          )}
        </h1>
        {displayDivider && (
          <div className="hero-gold-divider" aria-hidden={!tagline}>
            {tagline && <span className="hero-gold-divider-text">{tagline}</span>}
          </div>
        )}
        <p>{subtitle}</p>
        {serviceInfo && serviceInfo.length > 0 && (
          <div className="hero-service-info">
            {serviceInfo.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <div className="service-info-divider"></div>}
                <div className="service-info-item">
                  <i className={item.icon}></i>
                  <span>{item.text}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PageHero;
