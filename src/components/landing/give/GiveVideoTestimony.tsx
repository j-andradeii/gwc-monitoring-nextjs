'use client';

import React from 'react';

export interface GiveVideoTestimonyProps {
  /** Embeddable video URL (YouTube/Vimeo iframe src, or direct .mp4). When falsy the section renders nothing. */
  videoUrl?: string;
  /** Anchor id (optional) */
  sectionId?: string;
  /** Eyebrow label above the heading */
  sectionLabel?: string;
  /** Heading */
  title?: string;
  /** Optional short description shown beneath the heading */
  description?: string;
  /** Optional poster image for direct video files */
  poster?: string;
  /** When true, render a section-white treatment instead of the default cream */
  invert?: boolean;
}

const isDirectVideoFile = (url: string) =>
  /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);

export const GiveVideoTestimony: React.FC<GiveVideoTestimonyProps> = ({
  videoUrl,
  sectionId,
  sectionLabel = 'Testimony',
  title = 'A Story of Generosity',
  description,
  poster,
  invert = false,
}) => {
  if (!videoUrl) return null;

  const direct = isDirectVideoFile(videoUrl);

  return (
    <section
      {...(sectionId ? { id: sectionId } : {})}
      className={`landing-section give-video-testimony-section${invert ? ' section-white' : ''}`}
    >
      <div className="landing-container">
        <div className="section-header-center animate-on-scroll">
          <span className="section-label">{sectionLabel}</span>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>

        <div className="give-video-testimony-frame animate-on-scroll">
          {direct ? (
            <video
              className="give-video-testimony-player"
              controls
              playsInline
              preload="metadata"
              poster={poster}
            >
              <source src={videoUrl} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <iframe
              className="give-video-testimony-player"
              src={videoUrl}
              title={title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default GiveVideoTestimony;
