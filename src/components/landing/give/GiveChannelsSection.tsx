'use client';

import React, { useState, useCallback } from 'react';
import { givingChannels } from '@/data/giveData';
import DownloadQRButton from '@/components/ui/DownloadQRButton';
import { CONTACT_INFO } from '@/data/contact';

const useCopyToClipboard = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text.replace(/-/g, '')).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }, []);

  return { copiedId, copy };
};


export interface GiveKeywordInstruction {
  /** Display label for what this keyword is for, e.g. "For Tithes & Offering" */
  label: string;
  /** Exact keyword text to put in the transaction message field */
  keyword: string;
  /** Optional PrimeIcons class, e.g. "pi pi-tag" */
  icon?: string;
  /** Optional helper line shown beneath the keyword badge */
  helper?: string;
}

export interface GiveChannelsSectionProps {
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
}


export const GiveChannelsSection: React.FC<GiveChannelsSectionProps> = ({
  showGivingDescription = true,
  sectionId = 'give-channels',
  sectionLabel = 'Channels',
  title = 'How to Give',
  keywords,
}) => {
  const { copiedId, copy } = useCopyToClipboard();
  const instanceKey = sectionId;
  const hasKeywords = keywords && keywords.length > 0;

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
              Choose your preferred method to give your tithes, offerings, and firstfruits. Please send a screenshot of your transaction to{' '}
              <a href={`mailto:${CONTACT_INFO.email}`} className="text-primary hover:underline">{CONTACT_INFO.email}</a>{' '}
              or via{' '}
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
                  onClick={() => copy(channel.accountNumber, cardId)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && copy(channel.accountNumber, cardId)}
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

export default GiveChannelsSection;
