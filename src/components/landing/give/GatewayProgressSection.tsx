'use client';

import React from 'react';
import { gatewayProjectsData } from '@/data/giveData';

export const GatewayProgressSection: React.FC = () => {
  const progressPercentage = (gatewayProjectsData.currentAmount / gatewayProjectsData.goalAmount) * 100;
  const remainingAmount = gatewayProjectsData.goalAmount - gatewayProjectsData.currentAmount;

  return (
    <section className="landing-section gateway-progress-section section-dark">
      <div className="landing-container">
        <div className="progress-content animate-on-scroll">
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
      </div>
    </section>
  );
};

export default GatewayProgressSection;
