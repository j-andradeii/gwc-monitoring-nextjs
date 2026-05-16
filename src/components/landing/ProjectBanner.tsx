'use client';

import Link from 'next/link';
import React from 'react';

export interface ProjectBannerProps {
  title: string;
  targetId?: string | null;
  route?: string | null;
  href?: string;
  icon?: string;
  buttonLabel?: string;
  buttonAriaLabel?: string;
  ariaLabel?: string;
  className?: string;
}

export const ProjectBanner: React.FC<ProjectBannerProps> = ({
  title,
  targetId,
  route,
  href,
  icon = 'pi pi-bookmark-fill',
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
            <span className="project-banner__icon" aria-hidden="true">
              <i className={icon} aria-hidden="true" />
            </span>
            <h2 className="project-banner__title">{title}</h2>
          </div>

          <span className="project-banner__separator" aria-hidden="true" />

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
