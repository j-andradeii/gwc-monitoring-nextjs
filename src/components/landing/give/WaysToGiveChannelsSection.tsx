'use client';

/**
 * WaysToGiveChannelsSection — a DELIBERATE FORK of `GiveChannelsSection`.
 *
 * Why a fork and not a prop on the shared component: `GiveChannelsSection` is
 * rendered by /give/gateway-outreach (and its `.compact-*` card markup is
 * shared further still). Ways to Give is the only page with a giving
 * confirmation form under the channels, so the behaviour below belongs to that
 * page rather than to every page that shows giving channels.
 *
 * What this adds on top of the original:
 *   • A reveal-on-copy "upload your receipt" hint inside whichever card was
 *     copied last, linking down to the confirmation form. Built in, not
 *     opt-in — that is the entire reason this file exists.
 *   • A `copy` helper that reports success/failure, so the hint can never
 *     appear off the back of a rejected clipboard write.
 *
 * MAINTENANCE: the card markup (`.compact-card`, `.compact-account-box`,
 * `.compact-instructions`, `.compact-qr`) is duplicated verbatim from
 * `GiveChannelsSection`. Fixes to the shared card — new channel fields, QR
 * handling, instruction rendering — need mirroring here.
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { givingChannels } from '@/data/giveData';
import DownloadQRButton from '@/components/ui/DownloadQRButton';
import { CONTACT_INFO } from '@/data/contact';
import type { GiveKeywordInstruction } from './GiveChannelsSection';

// Re-exported so this page's callers have a single import source; the type
// itself stays defined once, in the original, so the two can't drift.
export type { GiveKeywordInstruction };

const useCopyToClipboard = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const resetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Returns whether the number actually made it to the clipboard. Copying
   * rejects on an insecure origin or a blocked permission, and the receipt
   * hint hangs off this — so a failure must not read as a success (and must
   * not surface as an unhandled rejection either).
   */
  const copy = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text.replace(/-/g, ''));
      setCopiedId(id);
      // Restart the flash rather than stacking timers on rapid taps.
      if (resetRef.current) clearTimeout(resetRef.current);
      resetRef.current = setTimeout(() => setCopiedId(null), 2000);
      return true;
    } catch {
      // The number is still on screen, so there's nothing to recover from
      // here — just don't claim it was copied.
      setCopiedId(null);
      return false;
    }
  }, []);

  // Don't let a pending reset fire into an unmounted component (tab switch).
  useEffect(
    () => () => {
      if (resetRef.current) clearTimeout(resetRef.current);
    },
    []
  );

  return { copiedId, copy };
};

export interface WaysToGiveChannelsSectionProps {
  showGivingDescription?: boolean;
  /** Anchor id for the section (e.g. "give-channels") */
  sectionId?: string;
  /** Eyebrow label above the heading */
  sectionLabel?: string;
  /** Section heading (defaults to "How to Give") */
  title?: string;
  /**
   * Keyword instructions to surface above the channel cards. When provided,
   * each channel's "How to Send" steps also include a generic final step
   * that references all configured keywords.
   */
  keywords?: GiveKeywordInstruction[];
  /**
   * Id of the giving-confirmation form the receipt hint scrolls to. Defaults
   * to the id `GivingConfirmationSection` renders, so the anchor isn't a magic
   * string buried in the JSX below.
   */
  confirmationTargetId?: string;
}

export const WaysToGiveChannelsSection: React.FC<WaysToGiveChannelsSectionProps> = ({
  showGivingDescription = true,
  sectionId = 'give-channels',
  sectionLabel = 'Channels',
  title = 'How to Give',
  keywords,
  confirmationTargetId = 'giving-confirmation',
}) => {
  const { copiedId, copy } = useCopyToClipboard();
  /**
   * Which card is showing the "upload your receipt" hint. Deliberately NOT the
   * same state as `copiedId`: that one flips back after 2s, which is right for
   * a "Copied!" flash and far too short for an older giver to read a sentence
   * and act on it. Once revealed the hint stays — it only ever moves to
   * whichever card was copied last, so there's never more than one on screen.
   */
  const [hintCardId, setHintCardId] = useState<string | null>(null);
  const instanceKey = sectionId;
  const hasKeywords = keywords && keywords.length > 0;

  const handleCopy = useCallback(
    async (accountNumber: string, cardId: string) => {
      const copied = await copy(accountNumber, cardId);
      // Only point them at the next step if the number really is on their
      // clipboard — otherwise the hint would be congratulating a failure.
      if (copied) setHintCardId(cardId);
    },
    [copy]
  );

  /**
   * Scrolls to the giving-confirmation form. Shared by two links: the
   * reveal-on-copy hint below, and the primary "upload your receipt" link in
   * the section intro paragraph. Kept as one handler (rather than a copy per
   * caller) so the scroll behaviour — and the header/tab-bar allowance below
   * — only ever lives in one place.
   */
  const handleScrollToConfirmation = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(confirmationTargetId);
    // No target on the page? Let the browser handle the anchor itself.
    if (!target) return;

    event.preventDefault();
    // `scrollIntoView` honours the section's own `scroll-margin-top: 170px`
    // (fixed header + sticky Ways-to-Give tab bar), so the allowance lives in
    // one place instead of being re-guessed here.
    target.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const keywordListText = hasKeywords
    ? keywords!
        .map((k) => `${k.keyword} (${k.label.replace(/^For\s+/i, '')})`)
        .join(' or ')
    : '';

  return (
    <section id={sectionId} className="landing-section give-channels-section section-white">
      <div className="landing-container">
        {showGivingDescription && (
          <div className="section-header-center animate-on-scroll">
            <span className="section-label">{sectionLabel}</span>
            <h2>{title}</h2>
            <p>
              Choose your preferred method to give your tithes, offerings, and firstfruits. After you send your gift,{' '}
              <a
                href={`#${confirmationTargetId}`}
                onClick={handleScrollToConfirmation}
                className="gcs-intro-receipt-link"
              >
                upload a screenshot of your receipt below.
              </a>{' '}
                You can also email it to{' '}
              <a href={`mailto:${CONTACT_INFO.email}`} className="text-primary hover:underline">{CONTACT_INFO.email}</a>{' '}
              or send it to us on{' '}
              <a href={CONTACT_INFO.social.facebook} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Facebook</a>.
            </p>
          </div>
        )}

        <div className="giving-channels-grid compact-grid animate-on-scroll">
          {givingChannels.map((channel) => {
            const cardId = `${instanceKey}-${channel.id}`;
            const channelStyle = { '--channel-color': channel.color } as React.CSSProperties;

            return (
              <div key={cardId} className="giving-channel-card compact-card" style={channelStyle}>
                <div className="card-accent"></div>
                <div className="compact-card-header">
                  <div className="channel-logo-compact">
                    <i className={channel.icon}></i>
                  </div>
                  <div className="channel-title-wrap">
                    <h3>{channel.name}</h3>
                    <span className="channel-subtitle">{channel.accountName}</span>
                  </div>
                </div>

                <div
                  className={`compact-account-box copyable ${copiedId === cardId ? 'copied' : ''}`}
                  onClick={() => void handleCopy(channel.accountNumber, cardId)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void handleCopy(channel.accountNumber, cardId);
                  }}
                >
                  <span className="account-label">Account Number</span>
                  <div className="account-value-row">
                    <span className="account-value">{channel.accountNumber}</span>
                    <span className="copy-indicator">
                      {copiedId === cardId ? (
                        <><i className="pi pi-check"></i> Copied!</>
                      ) : (
                        <><i className="pi pi-copy"></i> Tap to copy</>
                      )}
                    </span>
                  </div>
                </div>

                {/* Reveal-on-copy next step. Sits immediately after the account
                    box so it is the very next tab stop after the thing that
                    revealed it. Mobile only (hidden ≥769px in CSS, which keeps
                    it out of the a11y tree there too). It is a real anchor, so
                    it still works if the click handler never runs — the target
                    carries scroll-margin-top for that case. */}
                {hintCardId === cardId && (
                  <a
                    href={`#${confirmationTargetId}`}
                    className="gcs-receipt-hint"
                    onClick={handleScrollToConfirmation}
                    aria-label="After you send it, tap here to upload your receipt — goes to the giving confirmation form"
                  >
                    <span className="gcs-receipt-hint-icon" aria-hidden="true">
                      <i className="pi pi-arrow-down"></i>
                    </span>
                    <span className="gcs-receipt-hint-text">
                      After you send it, tap here to upload your receipt
                    </span>
                  </a>
                )}

                <div className="compact-instructions">
                  <details>
                    <summary>
                      <i className="pi pi-info-circle"></i>
                      <span>How to Send</span>
                      <i className="pi pi-chevron-down chevron"></i>
                    </summary>
                    <ol>
                      {channel.instructions.map((instruction, idx) => (
                        <li key={idx}>{instruction}</li>
                      ))}
                      {hasKeywords && (
                        <li className="keyword-step">
                          In the message / details / reference field, put{' '}
                          <strong>{keywordListText}</strong>.
                        </li>
                      )}
                    </ol>
                  </details>
                </div>

                <div className="compact-qr">
                  {channel.qrCode ? (
                    <div className="compact-qr-wrapper">
                      {/* Mirrors GiveChannelsSection verbatim. Staying on <img>
                          is deliberate: these are CSS-sized remote blobs with
                          no intrinsic dimensions to hand next/image, and
                          swapping only the fork would make the two card
                          markups diverge. Suppressed so this duplicate doesn't
                          double-count a warning the original already carries;
                          fix both together or neither. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={channel.qrCode}
                        alt={`${channel.name} QR Code`}
                        className="compact-qr-image"
                      />
                      <DownloadQRButton
                        qrCodeUrl={channel.qrCode!}
                        filename={`${channel.name}-qrcode.jpg`}
                        color={channel.color}
                        className="compact-qr-download"
                        style={{
                          marginTop: 0,
                          padding: '0.4rem 0.7rem',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                        }}
                      />
                    </div>
                  ) : (
                    <div className="compact-qr-empty">
                      <i className="pi pi-qrcode"></i>
                      <span>Manual transfer</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WaysToGiveChannelsSection;
