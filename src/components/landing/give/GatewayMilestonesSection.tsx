'use client';

import React from 'react';
import { gatewayProjectsData } from '@/data/giveData';

export const GatewayMilestonesSection: React.FC = () => {
  return (
    <section className="landing-section gateway-milestones-section section-white">
      <div className="landing-container">
        <div className="section-header-center animate-on-scroll">
          <span className="section-label">Roadmap</span>
          <h2>Project Milestones</h2>
          <p>Track our journey to completing the ministry center</p>
        </div>

        <div className="milestones-stepper vertical animate-on-scroll">
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
    </section>
  );
};

export default GatewayMilestonesSection;
