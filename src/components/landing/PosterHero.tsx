'use client';

import React from 'react';
import './styles/poster-hero.css';

/**
 * Below this width the mobile cut is used.
 * MUST match the `max-width` media query in poster-hero.css — the <source>
 * decides which file loads, the stylesheet decides which ratio is reserved for
 * it, and if the two disagree the band jumps as the image arrives.
 */
const MOBILE_BREAKPOINT_PX = 640;

interface PosterArt {
  src: string;
  /** The file's REAL pixel size — only the ratio is used. */
  width: number;
  height: number;
}

interface PosterHeroProps {
  /** The poster. Spans the full width of the hero, uncropped. */
  image: string;
  /** What the poster says, for anyone who can't see it. */
  imageAlt: string;
  /**
   * The file's REAL pixel size. Only the ratio is used — it fixes the band's
   * height against its width, so the space is reserved before the image loads
   * and the page doesn't jump. Get these wrong and the hero shifts on load.
   */
  imageWidth: number;
  imageHeight: number;
  /**
   * Optional narrow-screen cut, used below 640px. Art direction, not just
   * resizing: a banner wide enough to make a good desktop hero is a thin strip
   * on a phone, so the mobile file is usually a squarer crop of the same
   * artwork. Grouped into one object so its dimensions can't go missing —
   * they're what keeps the band from jumping at that breakpoint.
   */
  mobileImage?: PosterArt;
  /**
   * Optional taller band for phones, given as a ratio (e.g. `{ width: 3,
   * height: 2 }`). The mobile art is scaled up to FILL it and cropped left and
   * right — the one place this component crops on purpose.
   *
   * It exists because band height is viewport width ÷ ratio, and a phone gives
   * you no width to spend: a 16:9 cut is a ~219px strip on a 390px screen no
   * matter how good the artwork is. Trading the poster's outer margins for
   * height is often the better read.
   *
   * Only safe on art with slack around its content, and only up to the ratio
   * where that slack runs out — work out where the content actually ends
   * before picking a number. Leave it off and nothing crops, as before.
   */
  mobileBandRatio?: { width: number; height: number };
  /**
   * The page's <h1>. Rendered for screen readers and search results only — it
   * is never drawn, because the poster already carries the wording and a
   * caption would just repeat it. Omit only if the page has an <h1> elsewhere.
   */
  title?: string;
  id?: string;
  className?: string;
}

/**
 * PosterHero — a hero for pages whose art is a poster rather than a photo.
 *
 * PageHero is still the right component for scenic backgrounds: it paints the
 * image with `background-size: cover` and lays the title over it. That crops,
 * which a photo can absorb and a poster cannot — a flyer in a hero band of a
 * different shape loses its top and bottom, which is exactly where event dates
 * live.
 *
 * So the artwork runs edge to edge at full viewport width and the band takes
 * whatever height its ratio asks for. Every pixel is on screen, at the largest
 * size the viewport allows.
 *
 * Give it a WIDE cut for desktop — band height is viewport width ÷ ratio, so an
 * 8:3 poster on a 1440px screen is a 540px hero while a 16:9 one is 810px — and
 * a squarer `mobileImage` for phones, where that same 8:3 cut collapses to a
 * ~146px strip. When a band feels too tall, re-crop the artwork; capping the
 * height here could only crop it or strand it in empty margins, which is the
 * problem this component exists to avoid.
 *
 * Deliberately a plain <picture>/<img> rather than next/image: next/image has
 * no art-direction story, and the alternative — two <Image>s toggled with
 * `display: none` — makes every visitor download both files. <picture> lets the
 * browser fetch exactly the one it will show. The trade is that these files are
 * served at their exported size, so export them at a sane one.
 */
export const PosterHero: React.FC<PosterHeroProps> = ({
  image,
  imageAlt,
  imageWidth,
  imageHeight,
  mobileImage,
  mobileBandRatio,
  title,
  id,
  className = '',
}) => {
  return (
    <section
      id={id}
      className={`poster-hero ${className}`.trim()}
      style={
        {
          '--poster-hero-ratio': `${imageWidth} / ${imageHeight}`,
          ...(mobileImage
            ? { '--poster-hero-mobile-ratio': `${mobileImage.width} / ${mobileImage.height}` }
            : {}),
          ...(mobileBandRatio
            ? {
                '--poster-hero-mobile-band-ratio': `${mobileBandRatio.width} / ${mobileBandRatio.height}`,
              }
            : {}),
        } as React.CSSProperties
      }
    >
      {title && <h1 className="poster-hero-heading">{title}</h1>}

      <picture>
        {mobileImage && (
          <source
            media={`(max-width: ${MOBILE_BREAKPOINT_PX}px)`}
            srcSet={mobileImage.src}
            width={mobileImage.width}
            height={mobileImage.height}
          />
        )}
        <img
          src={image}
          alt={imageAlt}
          width={imageWidth}
          height={imageHeight}
          fetchPriority="high"
          decoding="async"
          className="poster-hero-img"
        />
      </picture>

      {/* Sanctuary Glow corner brackets — same markup and animation PageHero
          uses, so a poster page still reads as part of the site. Last in the
          DOM so it frames the artwork rather than sitting under it. */}
      <div className="page-hero-frame" aria-hidden="true">
        <span className="page-hero-corner page-hero-corner--tl" />
        <span className="page-hero-corner page-hero-corner--tr" />
        <span className="page-hero-corner page-hero-corner--bl" />
        <span className="page-hero-corner page-hero-corner--br" />
      </div>
    </section>
  );
};

export default PosterHero;
