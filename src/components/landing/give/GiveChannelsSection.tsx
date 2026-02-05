'use client';

import React, { useState, useCallback } from 'react';
import { givingChannels } from '@/data/giveData';

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

export const GiveChannelsSection: React.FC = () => {
  const { copiedId, copy } = useCopyToClipboard();

  return (
    <section className="landing-section give-channels-section section-white">
      <div className="landing-container">
        <div className="section-header-center animate-on-scroll">
          <span className="section-label">Channels</span>
          <h2>How to Give</h2>
          <p>Choose your preferred method to give your tithes and offerings</p>
        </div>

        <div className="giving-channels-grid compact-grid animate-on-scroll">
          {givingChannels.map((channel) => (
            <div key={channel.id} className="giving-channel-card compact-card">
              <div className="card-accent" style={{ backgroundColor: channel.color }}></div>
              <div className="compact-card-header">
                <div className="channel-logo-compact" style={{ backgroundColor: channel.color }}>
                  <i className={channel.icon}></i>
                </div>
                <div className="channel-title-wrap">
                  <h3>{channel.name}</h3>
                  <span className="channel-subtitle">{channel.accountName}</span>
                </div>
              </div>

              <div
                className={`compact-account-box copyable ${copiedId === channel.id ? 'copied' : ''}`}
                onClick={() => copy(channel.accountNumber, channel.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && copy(channel.accountNumber, channel.id)}
              >
                <span className="account-label">Account Number</span>
                <div className="account-value-row">
                  <span className="account-value">{channel.accountNumber}</span>
                  <span className="copy-indicator">
                    {copiedId === channel.id ? (
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
                  </ol>
                </details>
              </div>

              <div className="compact-qr">
                <i className="pi pi-qrcode"></i>
                <span>QR Coming Soon</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GiveChannelsSection;
