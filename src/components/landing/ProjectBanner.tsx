'use client';

import Link from 'next/link';
import React from 'react';

export interface ProjectBannerProps {
  title: string;
  eyebrow?: string;
  badge?: string;
  icon?: string;
  targetId?: string | null;
  route?: string | null;
  href?: string;
  buttonLabel?: string;
  buttonAriaLabel?: string;
  ariaLabel?: string;
  className?: string;
}

export const ProjectBanner: React.FC<ProjectBannerProps> = ({
  title,
  eyebrow,
  badge = 'Live',
  icon,
  targetId,
  route,
  href,
  buttonLabel = 'Learn More',
  buttonAriaLabel,
  ariaLabel,
  className,
}) => {
  const ctaHref = route ?? href ?? (targetId ? `#${targetId}` : '#');
  const sectionLabel = ariaLabel ?? title;
  const linkLabel = buttonAriaLabel ?? buttonLabel;

  return (
    <section
      className={
        className
          ? `project-banner-section ${className}`
          : 'project-banner-section'
      }
      aria-label={sectionLabel}
    >
      <div className="landing-container">
        <div className="project-banner">
          <div className="project-banner__content">
            {icon ? (
              <span className="project-banner__icon" aria-hidden="true">
                <i className={icon} aria-hidden="true" />
              </span>
            ) : (
              <span className="project-banner__badge" aria-hidden="true">
                <span className="project-banner__badge-dot" />
                <span className="project-banner__badge-text">{badge}</span>
              </span>
            )}

            <div className="project-banner__text">
              {eyebrow && (
                <span className="project-banner__eyebrow">{eyebrow}</span>
              )}
              <h2 className="project-banner__title">{title}</h2>
            </div>
          </div>

          <Link
            href={ctaHref}
            className="project-banner__btn"
            aria-label={linkLabel}
          >
            <span className="project-banner__btn-label">{buttonLabel}</span>
            <i
              className="pi pi-arrow-right project-banner__btn-arrow"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectBanner;
