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
  subtitle: string;
  backgroundImage?: string;
  serviceInfo?: ServiceInfoItem[];
  className?: string;
  displayBadge?: boolean;
}

/**
 * PageHero Component
 *
 * Reusable hero section for internal pages (About, Events, Give, Sermon Notes, etc.)
 * This is separate from the main landing page HeroSection carousel.
 */
export const PageHero: React.FC<PageHeroProps> = ({
  id,
  badge,
  title,
  subtitle,
  backgroundImage = '/assets/images/community.jpg',
  serviceInfo,
  className = '',
  displayBadge = true
}) => {
  return (
    <section
      id={id}
      className={`hero-section page-hero ${className}`.trim()}
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <div className="hero-content">
        {displayBadge && (
          <span className="hero-badge">{badge}</span>
        )}
        <h1>{title}</h1>
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
