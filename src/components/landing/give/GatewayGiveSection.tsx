'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { gatewayProjectsChannel, gatewayGivingChannels, type GivingChannel } from '@/data/giveData';
import DownloadQRButton from '@/components/ui/DownloadQRButton';

// Copy to clipboard hook
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

// Compact channel card for additional channels
const ChannelCard: React.FC<{
  channel: GivingChannel;
  copiedId: string | null;
  copy: (text: string, id: string) => void;
}> = ({ channel, copiedId, copy }) => {
  return (
    <div className="gateway-alt-channel-card">
      <div className="gateway-alt-channel-header">
        <div className="gateway-alt-channel-logo" style={{ backgroundColor: channel.color }}>
          <i className={channel.icon}></i>
        </div>
        <div className="gateway-alt-channel-title">
          <h4>{channel.name}</h4>
          <span>{channel.accountName}</span>
        </div>
      </div>

      <div
        className={`compact-account-box copyable ${copiedId === `${channel.id}-account` ? 'copied' : ''}`}
        onClick={() => copy(channel.accountNumber, `${channel.id}-account`)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && copy(channel.accountNumber, `${channel.id}-account`)}
      >
        <span className="account-label">Account Number</span>
        <div className="account-value-row">
          <span className="account-value">{channel.accountNumber}</span>
          <span className="copy-indicator">
            {copiedId === `${channel.id}-account` ? (
              <><i className="pi pi-check"></i> Copied!</>
            ) : (
              <><i className="pi pi-copy"></i></>
            )}
          </span>
        </div>
      </div>

      {channel.qrCode && (
        <div className="gateway-alt-channel-qr">
          <Image
            src={channel.qrCode}
            alt={`${channel.name} QR Code`}
            width={100}
            height={100}
            className="qr-image"
            unoptimized
          />
        </div>
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
          </ol>
        </details>
      </div>
    </div>
  );
};

export const GatewayGiveSection: React.FC = () => {
  const { copiedId, copy } = useCopyToClipboard();

  // Additional channels (skip the first one which is Gotyme / featured)
  const additionalChannels = gatewayGivingChannels.filter(
    (ch) => ch.id !== gatewayProjectsChannel.id
  );

  return (
    <section id="gateway-give" className="landing-section gateway-give-section">
      <div className="landing-container">
        <div className="section-header-center animate-on-scroll">
          <span className="section-label">Contribute</span>
          <h2>Give to Gateway Projects</h2>
          <p>Support the ministry center improvement project through any of our giving channels</p>
        </div>

        {/* Featured Channel: Gotyme Bank */}
        <div className="gateway-project-card-wrapper animate-on-scroll">
          {/* <div className="gateway-featured-badge">
            <i className="pi pi-star-fill"></i>
            <span>Preferred Channel</span>
          </div> */}
          <div className="giving-channel-card compact-card featured-compact">
            <div className="card-accent featured-accent"></div>

            <div className="featured-card-layout">
              {/* Left Side - Account Info */}
              <div className="featured-card-info">
                <div className="compact-card-header">
                  <div className="channel-logo-compact featured-logo" style={{ backgroundColor: gatewayProjectsChannel.color }}>
                    <i className={gatewayProjectsChannel.icon}></i>
                  </div>
                  <div className="channel-title-wrap">
                    <h3>{gatewayProjectsChannel.name}</h3>
                    <span className="channel-subtitle">{gatewayProjectsChannel.accountName}</span>
                  </div>
                </div>

                <div className="featured-account-details">
                  <div
                    className={`compact-account-box copyable ${copiedId === 'gotyme-account' ? 'copied' : ''}`}
                    onClick={() => copy(gatewayProjectsChannel.accountNumber, 'gotyme-account')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && copy(gatewayProjectsChannel.accountNumber, 'gotyme-account')}
                  >
                    <span className="account-label">Account Number</span>
                    <div className="account-value-row">
                      <span className="account-value">{gatewayProjectsChannel.accountNumber}</span>
                      <span className="copy-indicator">
                        {copiedId === 'gotyme-account' ? (
                          <><i className="pi pi-check"></i> Copied!</>
                        ) : (
                          <><i className="pi pi-copy"></i></>
                        )}
                      </span>
                    </div>
                  </div>
                  {gatewayProjectsChannel.swiftCode && (
                    <div
                      className={`compact-account-box copyable ${copiedId === 'gotyme-swift' ? 'copied' : ''}`}
                      onClick={() => copy(gatewayProjectsChannel.swiftCode!, 'gotyme-swift')}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && copy(gatewayProjectsChannel.swiftCode!, 'gotyme-swift')}
                    >
                      <span className="account-label">Swift Code</span>
                      <div className="account-value-row">
                        <span className="account-value">{gatewayProjectsChannel.swiftCode}</span>
                        <span className="copy-indicator">
                          {copiedId === 'gotyme-swift' ? (
                            <><i className="pi pi-check"></i> Copied!</>
                          ) : (
                            <><i className="pi pi-copy"></i></>
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="reference-badge">
                  <i className="pi pi-tag"></i>
                  <span>Reference: <strong>Gateway Projects</strong></span>
                </div>

                <div className="compact-instructions">
                  <details>
                    <summary>
                      <i className="pi pi-info-circle"></i>
                      <span>How to Send</span>
                      <i className="pi pi-chevron-down chevron"></i>
                    </summary>
                    <ol>
                      {gatewayProjectsChannel.instructions.map((instruction, idx) => (
                        <li key={idx}>{instruction}</li>
                      ))}
                    </ol>
                  </details>
                </div>
              </div>

              {/* Right Side - QR Code */}
              {gatewayProjectsChannel.qrCode && (
                <div className="featured-card-qr">
                  <div className="qr-container">
                    <span className="qr-label">Scan to Give</span>
                    <div className="qr-image-wrapper">
                      <Image
                        src={gatewayProjectsChannel.qrCode}
                        alt="Gotyme Bank QR Code"
                        width={180}
                        height={180}
                        className="qr-image"
                        unoptimized
                      />
                    </div>
                    <DownloadQRButton
                      qrCodeUrl={gatewayProjectsChannel.qrCode!}
                      filename="gateway-projects-qrcode.jpg"
                      color="var(--primary-color, #007DFE)"
                      style={{
                        marginTop: '10px',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Screenshot Email Notice */}
            <div className="screenshot-notice">
              <div className="notice-icon">
                <i className="pi pi-camera"></i>
              </div>
              <div className="notice-content">
                <span className="notice-title">After giving, please send your screenshot to:</span>
                <a href="mailto:justinmarctariman@yahoo.com" className="notice-email">
                  <i className="pi pi-envelope"></i>
                  justinmarctariman@yahoo.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GatewayGiveSection;
