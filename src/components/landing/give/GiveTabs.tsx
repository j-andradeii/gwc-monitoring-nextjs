'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type TabType = 'ways-to-give' | 'build-and-rise';

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

// Build & Rise project data
const buildAndRiseData = {
  title: 'Arise & Build',
  subtitle: 'Worship Center Improvement Project',
  description:
    'Join us in improving the 8th Floor Golden Peak as our House of Worship. This project will enhance our facilities to better serve our growing congregation and community outreach programs.',
  goalAmount: 5000000,
  currentAmount: 2750000,
  milestones: [
    { label: 'Phase 1: Planning & Design', amount: 500000, completed: true },
    { label: 'Phase 2: Sound System Upgrade', amount: 1500000, completed: true },
    { label: 'Phase 3: Lighting & Stage', amount: 2000000, completed: false },
    { label: 'Phase 4: Seating & Finishing', amount: 1000000, completed: false },
  ],
};

export const GiveTabs: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('ways-to-give');

  // Read tab from URL on mount and when searchParams change
  useEffect(() => {
    const tab = searchParams.get('tab') as TabType;
    if (tab === 'ways-to-give' || tab === 'build-and-rise') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    router.push(`/give?tab=${tab}`, { scroll: false });
  };

  const progressPercentage = (buildAndRiseData.currentAmount / buildAndRiseData.goalAmount) * 100;

  return (
    <section id="give-content" className="give-tabs-section">
      <div className="landing-container">
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
            className={`give-tab-btn ${activeTab === 'build-and-rise' ? 'active' : ''}`}
            onClick={() => handleTabChange('build-and-rise')}
          >
            <i className="pi pi-building"></i>
            Arise & Build
          </button>
        </div>

        {/* Tab Content */}
        <div className="give-tabs-content">
          {/* Ways to Give Tab */}
          {activeTab === 'ways-to-give' && (
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
                      <div key={index} className="scripture-card">
                        <div className="scripture-icon">
                          <i className="pi pi-book"></i>
                        </div>
                        <p className="scripture-text">&ldquo;{scripture.text}&rdquo;</p>
                        <span className="scripture-verse">{scripture.verse}</span>
                      </div>
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

                <div className="giving-channels-grid">
                  {givingChannels.map((channel) => (
                    <div key={channel.id} className="giving-channel-card">
                      <div className="channel-header">
                        <div className="channel-logo-placeholder" style={{ backgroundColor: channel.color }}>
                          <i className={channel.icon}></i>
                        </div>
                        <h3>{channel.name}</h3>
                      </div>

                      <div className="channel-details">
                        <div className="channel-info-row">
                          <span className="channel-label">Account Name:</span>
                          <span className="channel-value">{channel.accountName}</span>
                        </div>
                        <div className="channel-info-row">
                          <span className="channel-label">Account Number:</span>
                          <span className="channel-value account-number">{channel.accountNumber}</span>
                        </div>
                      </div>

                      <div className="channel-instructions">
                        <h4>Instructions:</h4>
                        <ol>
                          {channel.instructions.map((instruction, idx) => (
                            <li key={idx}>{instruction}</li>
                          ))}
                        </ol>
                      </div>

                      <div className="channel-qr-placeholder">
                        <div className="qr-placeholder-box">
                          <i className="pi pi-qrcode"></i>
                          <span>QR Code</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Build & Rise Tab */}
          {activeTab === 'build-and-rise' && (
            <div className="give-tab-panel build-and-rise-panel">
              {/* Project Overview */}
              <div className="project-overview">
                <div className="project-header">
                  <span className="section-label">{buildAndRiseData.subtitle}</span>
                  <h2>{buildAndRiseData.title}</h2>
                  <p className="project-description">{buildAndRiseData.description}</p>
                </div>

                {/* Progress Section */}
                <div className="project-progress">
                  <div className="progress-stats">
                    <div className="progress-stat">
                      <span className="stat-label">Current</span>
                      <span className="stat-value current">
                        &#8369;{buildAndRiseData.currentAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="progress-stat">
                      <span className="stat-label">Goal</span>
                      <span className="stat-value goal">
                        &#8369;{buildAndRiseData.goalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="progress-bar-container">
                    <div className="progress-bar">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <span className="progress-percentage">{progressPercentage.toFixed(0)}%</span>
                  </div>
                </div>

                {/* Milestones Stepper */}
                <div className="milestones-section">
                  <h3>Project Milestones</h3>
                  <div className="milestones-stepper">
                    {buildAndRiseData.milestones.map((milestone, index) => (
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
                        <div className="milestone-content">
                          <h4>{milestone.label}</h4>
                          <span className="milestone-amount">
                            &#8369;{milestone.amount.toLocaleString()}
                          </span>
                        </div>
                        {index < buildAndRiseData.milestones.length - 1 && (
                          <div className={`milestone-connector ${milestone.completed ? 'completed' : ''}`}></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Giving Channels for Build & Rise */}
              <div className="giving-channels build-rise-channels">
                <div className="giving-channels-header">
                  <span className="section-label">Contribute</span>
                  <h2>Give to Arise & Build</h2>
                  <p>Support the worship center improvement project</p>
                </div>

                <div className="giving-channels-grid">
                  {givingChannels.map((channel) => (
                    <div key={channel.id} className="giving-channel-card">
                      <div className="channel-header">
                        <div className="channel-logo-placeholder" style={{ backgroundColor: channel.color }}>
                          <i className={channel.icon}></i>
                        </div>
                        <h3>{channel.name}</h3>
                      </div>

                      <div className="channel-details">
                        <div className="channel-info-row">
                          <span className="channel-label">Account Name:</span>
                          <span className="channel-value">{channel.accountName}</span>
                        </div>
                        <div className="channel-info-row">
                          <span className="channel-label">Account Number:</span>
                          <span className="channel-value account-number">{channel.accountNumber}</span>
                        </div>
                        <div className="channel-info-row highlight">
                          <span className="channel-label">Reference:</span>
                          <span className="channel-value">Arise & Build</span>
                        </div>
                      </div>

                      <div className="channel-instructions">
                        <h4>Instructions:</h4>
                        <ol>
                          {channel.instructions.map((instruction, idx) => (
                            <li key={idx}>{instruction}</li>
                          ))}
                          <li className="highlight-instruction">
                            <strong>Important:</strong> Add &ldquo;Arise & Build&rdquo; as reference/message
                          </li>
                        </ol>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GiveTabs;
