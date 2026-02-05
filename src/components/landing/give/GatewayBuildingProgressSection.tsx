'use client';

import React from 'react';
import { gatewayProjectsData } from '@/data/giveData';

export const GatewayBuildingProgressSection: React.FC = () => {
  const progressPercentage = (gatewayProjectsData.currentAmount / gatewayProjectsData.goalAmount) * 100;
  const remainingAmount = gatewayProjectsData.goalAmount - gatewayProjectsData.currentAmount;

  return (
    <section
      className="landing-section building-progress-section"
      style={{
        backgroundImage: "url('https://gtxngthtpisigkys.public.blob.vercel-storage.com/center.jpg')",
      }}
    >
      <div className="building-progress-overlay" />
      <div className="landing-container">
        {/* Section Header */}
        <div className="section-header-center animate-on-scroll">
          <span className="section-label">Roadmap</span>
          <h2>Project Milestones</h2>
          <p className="building-progress-section-description">Track our journey to completing the ministry center</p>
        </div>

        <div className="building-progress-grid">
          {/* Left Column: Fundraising Card */}
          <div className="fundraising-card">
            {/* Decorative blur */}
            <div className="fundraising-card-blur" />

            {/* Top: Circle + Headline */}
            <div className="fundraising-header">
              <div className="progress-circle-wrapper">
                <svg className="progress-circle-svg" viewBox="0 0 36 36">
                  <defs>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FCD34D" />
                      <stop offset="100%" stopColor="#D97706" />
                    </linearGradient>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <path
                    className="progress-circle-track"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeWidth="2.5"
                  />
                  <path
                    className="progress-circle-fill"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#goldGradient)"
                    strokeWidth="2.5"
                    strokeDasharray={`${progressPercentage}, 100`}
                    strokeLinecap="round"
                    filter="url(#glow)"
                  />
                </svg>
                <div className="progress-circle-text">
                  <span className="progress-circle-percentage">{progressPercentage.toFixed(0)}%</span>
                  <span className="progress-circle-label">Raised</span>
                </div>
              </div>

              <div className="fundraising-headline">
                <h2>Together We&apos;re<br />Building</h2>
                <p>Your generosity is making a difference</p>
              </div>
            </div>

            {/* Middle: Progress Bar */}
            <div className="fundraising-progress-bar">
              <div className="progress-bar-labels">
                <span>Start</span>
                <span>Goal</span>
              </div>
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Bottom: Stats Cards */}
            <div className="fundraising-stats">
              <div className="stat-card">
                <div className="stat-card-header">
                  <i className="pi pi-wallet" />
                  <span>Raised So Far</span>
                </div>
                <p className="stat-card-value">₱{gatewayProjectsData.currentAmount.toLocaleString()}</p>
              </div>
              <div className="stat-card">
                <div className="stat-card-header">
                  <i className="pi pi-chart-line" />
                  <span>Still Needed</span>
                </div>
                <p className="stat-card-value">₱{remainingAmount.toLocaleString()}</p>
              </div>
              <div className="stat-card">
                <div className="stat-card-header">
                  <i className="pi pi-bullseye" />
                  <span>Goal Amount</span>
                </div>
                <p className="stat-card-value">₱{gatewayProjectsData.goalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Timeline */}
          <div className="milestones-timeline">
            <h3 className="milestones-timeline-header">Project Progress</h3>

            <div className="timeline-container">
              {gatewayProjectsData.milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`timeline-step ${milestone.completed ? 'completed' : ''}`}
                >
                  <div className="timeline-indicator">
                    {milestone.completed ? (
                      <i className="pi pi-check" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <div className="timeline-card">
                    {milestone.completed && (
                      <span className="timeline-badge">
                        <i className="pi pi-check-circle" /> Complete
                      </span>
                    )}
                    <span className="timeline-phase">Phase {index + 1}</span>
                    <h4>{milestone.label.replace(/Phase \d+: /, '')}</h4>
                    <p className="timeline-amount">₱{milestone.amount.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GatewayBuildingProgressSection;
