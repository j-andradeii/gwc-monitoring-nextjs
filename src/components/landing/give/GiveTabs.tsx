'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ScriptureCard } from '@/components/cards';

type TabType = 'ways-to-give' | 'gateway-projects';

interface GiveTabsProps {
  activeTab?: TabType;
}

interface CopyToClipboardProps {
  copiedId: string | null;
  copy: (text: string, id: string) => void;
}

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

// Scripture data
const scriptures = [
  {
    verse: '2 Corinthians 9:7',
    text: 'Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.',
  },
  {
    verse: 'Proverbs 3:9-10',
    text: 'Honor the Lord with your wealth, with the firstfruits of all your crops; then your barns will be filled to overflowing.',
  },
  {
    verse: 'Luke 6:38',
    text: 'Give, and it will be given to you. A good measure, pressed down, shaken together and running over, will be poured into your lap.',
  },
];

// Giving channels
const givingChannels = [
  {
    id: 'gcash',
    name: 'GCash',
    accountName: 'Gateway Church Cebu',
    accountNumber: '0917-XXX-XXXX',
    icon: 'pi pi-mobile',
    color: '#007DFE',
    instructions: [
      'Open your GCash app',
      'Tap "Send Money"',
      'Enter the GCash number above',
      'Enter the amount and add a message (optional)',
      'Confirm and send',
    ],
  },
  {
    id: 'bpi',
    name: 'BPI',
    accountName: 'Gateway Church Cebu Inc.',
    accountNumber: '1234-5678-90',
    icon: 'pi pi-building',
    color: '#A6192E',
    instructions: [
      'Log in to BPI Online or Mobile App',
      'Select "Transfer"',
      'Choose "Transfer to BPI Account"',
      'Enter the account number above',
      'Enter amount and confirm',
    ],
  },
  {
    id: 'bdo',
    name: 'BDO',
    accountName: 'Gateway Church Cebu Inc.',
    accountNumber: '0012-3456-7890',
    icon: 'pi pi-credit-card',
    color: '#003087',
    instructions: [
      'Log in to BDO Online or Mobile App',
      'Select "Send Money"',
      'Choose "Transfer to BDO Account"',
      'Enter the account number above',
      'Enter amount and confirm',
    ],
  },
];

// Gateway Projects giving channel (Gotyme Bank only)
const gatewayProjectsChannel = {
  id: 'gotyme',
  name: 'Gotyme Bank',
  accountName: 'Justin Marc Tariman',
  accountNumber: '016765188731',
  swiftCode: 'GOTYPHM2XXX',
  icon: 'pi pi-wallet',
  color: '#00A651',
  qrCode: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/cc5dbe5a-cc42-495c-b17c-c77e7a73686f.jpeg',
  instructions: [
    'Log in to your Gotyme Bank app or any banking app',
    'Select "Transfer" or "Send Money"',
    'Choose "Transfer to Other Banks" if using another bank',
    'Enter the account number above',
    'Use Swift Code for international transfers',
    'Enter amount and confirm',
  ],
};

// Gateway Projects data
const gatewayProjectsData = {
  title: 'Gateway Projects',
  subtitle: 'Ministry Center Improvement Project',
  description:
    'Join us in improving the 8th Floor Golden Peak as our House of Worship. This project will enhance our facilities to better serve our growing congregation and community outreach programs.',
  goalAmount: 1000000,
  currentAmount: 195000,
  milestones: [
    { label: 'Phase 1: Planning & Design', amount: 150000, completed: true },
    { label: 'Phase 2: Airconditioning and Flooring', amount: 400000, completed: false },
    { label: 'Phase 3: Interior and Reception', amount: 300000, completed: false },
    { label: 'Phase 4: Completion', amount: 150000, completed: false },
  ],
  gallery: [
    {
      id: 1,
      src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/597992661_122181102518766700_6759379141760359149_n.jpg',
      alt: 'Ministry Center - Main Hall',
      caption: 'Main Worship Hall',
    },
    {
      id: 2,
      src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/598001057_122181102470766700_7721753414270859091_n.jpg',
      alt: 'Ministry Center - Stage Area',
      caption: 'Stage & Platform',
    },
    {
      id: 3,
      src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/598354889_122181101306766700_7166132187056166846_n.jpg',
      alt: 'Ministry Center - Congregation',
      caption: 'Congregation Area',
    },
    {
      id: 4,
      src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/598691167_122181202298766700_3747857486846455162_n.jpg',
      alt: 'Ministry Center - Sound System',
      caption: 'Sound & Media Setup',
    },
    {
      id: 5,
      src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/598696417_122181101384766700_414950063467040030_n.jpg',
      alt: 'Ministry Center - Lighting',
      caption: 'Lighting System',
    },
    {
      id: 6,
      src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/598714870_122181102446766700_1099840975765605389_n.jpg',
      alt: 'Ministry Center - Fellowship Area',
      caption: 'Fellowship Space',
    },
  ],
};

// Ways to Give Tab Component
const WaysToGiveTab: React.FC<CopyToClipboardProps> = ({ copiedId, copy }) => {
  return (
    <div className="give-tab-panel ways-to-give-panel">
      {/* Why We Give Section */}
      <div className="why-we-give">
        <div className="why-we-give-header">
          <span className="section-label">Generosity</span>
          <h2>Why We Give</h2>
        </div>
        <div className="why-we-give-content">
          <p className="why-we-give-intro">
            Giving is an act of worship and obedience to God. When we give, we acknowledge
            that everything we have comes from Him. Our tithes and offerings support the
            ministry of Gateway Church, enabling us to reach more people with the Gospel,
            serve our community, and equip believers for Kingdom work.
          </p>

          <div className="scriptures-grid">
            {scriptures.map((scripture, index) => (
              <ScriptureCard
                key={index}
                verse={scripture.verse}
                text={scripture.text}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Giving Channels */}
      <div className="giving-channels">
        <div className="giving-channels-header">
          <span className="section-label">Channels</span>
          <h2>How to Give</h2>
          <p>Choose your preferred method to give your tithes and offerings</p>
        </div>

        <div className="giving-channels-grid compact-grid">
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
    </div>
  );
};

// Gateway Projects Tab Component
const GatewayProjectsTab: React.FC<CopyToClipboardProps> = ({ copiedId, copy }) => {
  const progressPercentage = (gatewayProjectsData.currentAmount / gatewayProjectsData.goalAmount) * 100;
  const remainingAmount = gatewayProjectsData.goalAmount - gatewayProjectsData.currentAmount;

  return (
    <div className="give-tab-panel gateway-projects-panel">
      {/* Project Overview */}
      <div className="project-overview">
        <div className="project-header">
          <span className="section-label">{gatewayProjectsData.subtitle}</span>
          <h2>{gatewayProjectsData.title}</h2>
          <p className="project-description">{gatewayProjectsData.description}</p>
        </div>

        {/* Project Scripture */}
        <div className="project-scripture">
          <ScriptureCard
            verse="Haggai 1:8"
            text="Go up into the mountains and bring down timber and build my house, so that I may take pleasure in it and be honored,&rdquo; says the Lord."
          />
        </div>

        {/* Project Gallery */}
        <div className="project-gallery">
          <h3>Our Ministry Center</h3>
          <div className="gallery-grid">
            {gatewayProjectsData.gallery.map((image) => (
              <div key={image.id} className="gallery-item">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="gallery-image"
                  unoptimized
                />
                <div className="gallery-caption">
                  <span>{image.caption}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Section - Enhanced */}
        <div className="project-progress enhanced-progress">
          <div className="progress-header">
            <div className="progress-percentage-circle">
              <span className="percentage-value">{progressPercentage.toFixed(0)}%</span>
              <span className="percentage-label">Raised</span>
            </div>
            <div className="progress-headline">
              <h4>Together We&apos;re Building</h4>
              <p>Your generosity is making a difference</p>
            </div>
          </div>

          <div className="progress-bar-wrapper">
            <div className="progress-bar enhanced">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="progress-bar-glow"></div>
              </div>
            </div>
          </div>

          <div className="progress-stats enhanced-stats">
            <div className="progress-stat-card current-card">
              <div className="stat-icon">
                <i className="pi pi-wallet"></i>
              </div>
              <div className="stat-info">
                <span className="stat-label">Raised So Far</span>
                <span className="stat-value current">
                  &#8369;{gatewayProjectsData.currentAmount.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="progress-stat-card remaining-card">
              <div className="stat-icon">
                <i className="pi pi-chart-line"></i>
              </div>
              <div className="stat-info">
                <span className="stat-label">Still Needed</span>
                <span className="stat-value remaining">
                  &#8369;{remainingAmount.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="progress-stat-card goal-card">
              <div className="stat-icon">
                <i className="pi pi-bullseye"></i>
              </div>
              <div className="stat-info">
                <span className="stat-label">Goal Amount</span>
                <span className="stat-value goal">
                  &#8369;{gatewayProjectsData.goalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Milestones Stepper - Enhanced Vertical */}
        <div className="milestones-section enhanced-milestones vertical-milestones">
          <div className="milestones-header">
            <span className="section-label">Roadmap</span>
            <h3>Project Milestones</h3>
            <p>Track our journey to completing the ministry center</p>
          </div>
          <div className="milestones-stepper vertical">
            {gatewayProjectsData.milestones.map((milestone, index) => (
              <div
                key={index}
                className={`milestone-step ${milestone.completed ? 'completed' : ''}`}
              >
                <div className="milestone-indicator">
                  {milestone.completed ? (
                    <i className="pi pi-check"></i>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="milestone-content-card">
                  <div className="milestone-content-inner">
                    <span className="milestone-phase">Phase {index + 1}</span>
                    <h4>{milestone.label.replace(/Phase \d+: /, '')}</h4>
                    <span className="milestone-amount">
                      &#8369;{milestone.amount.toLocaleString()}
                    </span>
                  </div>
                  {milestone.completed && (
                    <span className="milestone-badge completed-badge">
                      <i className="pi pi-check-circle"></i> Complete
                    </span>
                  )}
                </div>
                {index < gatewayProjectsData.milestones.length - 1 && (
                  <div className={`milestone-connector-vertical ${milestone.completed ? 'completed' : ''}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Giving Channel for Gateway Projects - Gotyme Bank Only */}
      <div className="giving-channels build-rise-channels">
        <div className="giving-channels-header">
          <span className="section-label">Contribute</span>
          <h2>Give to Gateway Projects</h2>
          <p>Support the ministry center improvement project</p>
        </div>

        <div className="gateway-project-card-wrapper">
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
                  <div
                    className={`compact-account-box copyable ${copiedId === 'gotyme-swift' ? 'copied' : ''}`}
                    onClick={() => copy(gatewayProjectsChannel.swiftCode, 'gotyme-swift')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && copy(gatewayProjectsChannel.swiftCode, 'gotyme-swift')}
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
                </div>
              </div>
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
    </div>
  );
};

// Main GiveTabs Component
export const GiveTabs: React.FC<GiveTabsProps> = ({ activeTab: initialTab = 'ways-to-give' }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const { copiedId, copy } = useCopyToClipboard();

  // Update URL when tab changes
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    router.push(`/give/${tab}`, { scroll: false });
  };

  return (
    <section id="give-content" className="give-tabs-section">
      <div className="landing-container givetabs-container">
        {/* Tab Navigation */}
        <div className="give-tabs-nav">
          <button
            className={`give-tab-btn ${activeTab === 'ways-to-give' ? 'active' : ''}`}
            onClick={() => handleTabChange('ways-to-give')}
          >
            <i className="pi pi-wallet"></i>
            Ways to Give
          </button>
          <button
            className={`give-tab-btn ${activeTab === 'gateway-projects' ? 'active' : ''}`}
            onClick={() => handleTabChange('gateway-projects')}
          >
            <i className="pi pi-building"></i>
            Gateway Projects
          </button>
        </div>

        {/* Tab Content */}
        <div className="give-tabs-content">
          {activeTab === 'ways-to-give' && (
            <WaysToGiveTab copiedId={copiedId} copy={copy} />
          )}
          {activeTab === 'gateway-projects' && (
            <GatewayProjectsTab copiedId={copiedId} copy={copy} />
          )}
        </div>
      </div>
    </section>
  );
};

export default GiveTabs;
