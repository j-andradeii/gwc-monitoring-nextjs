'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface GiveVideoItem {
  /** Embeddable / share / watch URL (YouTube, Vimeo, or direct .mp4) */
  url: string;
  /** Card title (overrides the section title for this card) */
  title?: string;
  /** Speaker / contributor */
  speaker?: string;
  /** Display date — already-formatted string */
  date?: string;
  /** Duration pill, e.g. "12 min" */
  duration?: string;
  /** Custom thumbnail (overrides auto-derived YouTube thumb) */
  poster?: string;
}

export interface GiveVideoTestimonyProps {
  /** Single video — kept for backward compatibility. */
  videoUrl?: string;
  /** Multiple videos — when provided (length ≥ 1), renders a thumbnail grid. */
  videos?: GiveVideoItem[];
  /** Anchor id */
  sectionId?: string;
  /** Eyebrow label */
  sectionLabel?: string;
  /** Section heading */
  title?: string;
  /** Optional short description beneath the heading */
  description?: string;
  /** Poster image for a single direct-file video */
  poster?: string;
  /** Section-white treatment instead of cream */
  invert?: boolean;
}

/* ------------------------------------------------------------------ */
/*  URL helpers                                                        */
/* ------------------------------------------------------------------ */

const isDirectVideoFile = (url: string) =>
  /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);

const isYouTube = (url: string) => /youtube\.com|youtu\.be/i.test(url);

const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/i,
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]{6,})/i,
    /youtu\.be\/([A-Za-z0-9_-]{6,})/i,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/i,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m && m[1]) return m[1];
  }
  return null;
};

const buildYouTubeEmbed = (id: string, autoplay = false) => {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    color: 'white',
    ...(autoplay ? { autoplay: '1' } : {}),
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
};

const youtubeThumbnail = (id: string) =>
  `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

const youtubeThumbnailHigh = (id: string) =>
  `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

/* ------------------------------------------------------------------ */
/*  Single thumbnail card                                              */
/* ------------------------------------------------------------------ */

interface VideoCardProps {
  item: GiveVideoItem;
  onPlay: (item: GiveVideoItem) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ item, onPlay }) => {
  const youtubeId = isYouTube(item.url) ? extractYouTubeId(item.url) : null;
  const initialThumb =
    item.poster ?? (youtubeId ? youtubeThumbnailHigh(youtubeId) : undefined);
  const [thumbSrc, setThumbSrc] = useState(initialThumb);

  // Some YouTube videos have no maxresdefault — fall back to hqdefault.
  const onThumbError = useCallback(() => {
    if (youtubeId && thumbSrc !== youtubeThumbnail(youtubeId)) {
      setThumbSrc(youtubeThumbnail(youtubeId));
    }
  }, [thumbSrc, youtubeId]);

  const cardLabel = item.title ?? 'Watch testimony';

  return (
    <button
      type="button"
      className="give-video-card"
      onClick={() => onPlay(item)}
      aria-label={`Play video: ${cardLabel}`}
    >
      <div className="give-video-card-thumb">
        {thumbSrc ? (
          <img src={thumbSrc} alt="" onError={onThumbError} loading="lazy" />
        ) : (
          <div className="give-video-card-thumb-fallback">
            <i className="pi pi-video" aria-hidden="true"></i>
          </div>
        )}

        <span className="give-video-card-play" aria-hidden="true">
          <i className="pi pi-play"></i>
        </span>

        {item.duration && (
          <span className="give-video-card-duration">{item.duration}</span>
        )}
      </div>

      <div className="give-video-card-body">
        {item.title && <h3 className="give-video-card-title">{item.title}</h3>}
        {(item.speaker || item.date) && (
          <div className="give-video-card-meta">
            {item.speaker && (
              <span>
                <i className="pi pi-user" aria-hidden="true"></i>
                {item.speaker}
              </span>
            )}
            {item.date && (
              <span>
                <i className="pi pi-calendar" aria-hidden="true"></i>
                {item.date}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
};

/* ------------------------------------------------------------------ */
/*  Lightbox player                                                    */
/* ------------------------------------------------------------------ */

interface LightboxProps {
  item: GiveVideoItem;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ item, onClose }) => {
  const direct = isDirectVideoFile(item.url);
  const youtubeId = !direct && isYouTube(item.url) ? extractYouTubeId(item.url) : null;
  const embedSrc = youtubeId ? buildYouTubeEmbed(youtubeId, true) : item.url;

  // ESC to close + body scroll-lock
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="give-video-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.title ?? 'Video testimony'}
      onClick={onClose}
    >
      <div
        className="give-video-lightbox-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="give-video-lightbox-close"
          onClick={onClose}
          aria-label="Close video"
        >
          <i className="pi pi-times" aria-hidden="true"></i>
        </button>

        <div className="give-video-lightbox-frame">
          {direct ? (
            <video
              className="give-video-lightbox-player"
              src={item.url}
              poster={item.poster}
              controls
              autoPlay
              playsInline
            />
          ) : (
            <iframe
              className="give-video-lightbox-player"
              src={embedSrc}
              title={item.title ?? 'Video testimony'}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
        </div>

        {(item.title || item.speaker || item.date) && (
          <div className="give-video-lightbox-meta">
            {item.title && <h3>{item.title}</h3>}
            {(item.speaker || item.date) && (
              <p>
                {item.speaker}
                {item.speaker && item.date ? ' • ' : ''}
                {item.date}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export const GiveVideoTestimony: React.FC<GiveVideoTestimonyProps> = ({
  videoUrl,
  videos,
  sectionId,
  sectionLabel = 'Testimony',
  title = 'A Story of Generosity',
  description,
  poster,
  invert = false,
}) => {
  // Normalize to a video list. Both single (videoUrl) and multi (videos) shapes
  // render as thumbnail cards with a lightbox player.
  const videoList: GiveVideoItem[] = useMemo(() => {
    if (videos && videos.length > 0) return videos;
    if (videoUrl) return [{ url: videoUrl, poster, title }];
    return [];
  }, [videos, videoUrl, poster, title]);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeLightbox = useCallback(() => setActiveIndex(null), []);

  if (videoList.length === 0) return null;

  const gridModifier =
    videoList.length === 1
      ? ' give-video-grid--single'
      : videoList.length === 2
        ? ' give-video-grid--duo'
        : '';

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

        <div className={`give-video-grid${gridModifier} animate-on-scroll`}>
          {videoList.map((item, idx) => (
            <VideoCard
              key={`${item.url}-${idx}`}
              item={item}
              onPlay={() => setActiveIndex(idx)}
            />
          ))}
        </div>
      </div>

      {activeIndex !== null && videoList[activeIndex] && (
        <Lightbox item={videoList[activeIndex]} onClose={closeLightbox} />
      )}
    </section>
  );
};

export default GiveVideoTestimony;
