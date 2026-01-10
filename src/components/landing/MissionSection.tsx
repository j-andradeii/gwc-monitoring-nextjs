'use client';

import React from 'react';

export interface ProcessStepItem {
  icon: string;
  title: string;
  description: string;
}

export const defaultProcessSteps: ProcessStepItem[] = [
  {
    icon: 'pi pi-user-plus',
    title: 'WIN',
    description: 'Reaching new people for Jesus through sharing the Gospel.',
  },
  {
    icon: 'pi pi-heart',
    title: 'CONSOLIDATE',
    description: 'Taking care of the new believer in the same way a parent takes care of a newborn baby. During this process their faith is affirmed through a personal Encounter with Jesus.',
  },
  {
    icon: 'pi pi-book',
    title: 'DISCIPLE',
    description: 'Reproducing the character of Christ in disciples and equipping them with the necessary tools so that they can become successful leaders who multiply and reproduce the Vision.',
  },
  {
    icon: 'pi pi-globe',
    title: 'SEND',
    description: 'The moment where new leaders are empowered to step into the ministry and fulfill the Great Commission.',
  },
];

interface ProcessStepsProps {
  items?: ProcessStepItem[];
  className?: string;
}

export const ProcessSteps: React.FC<ProcessStepsProps> = ({
  items = defaultProcessSteps,
  className = '',
}) => {
  return (
    <div className={`process-steps-container ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <div className="process-step-card">
            <div className="step-number">
              <span>{index + 1}</span>
            </div>
            <div className="step-icon">
              <i className={item.icon}></i>
            </div>
            <h3 className="step-title">{item.title}</h3>
            <p className="step-description">{item.description}</p>
          </div>
          {index < items.length - 1 && (
            <div className="step-connector">
              <div className="connector-line"></div>
              <i className="pi pi-arrow-right connector-arrow"></i>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export const MissionSection: React.FC = () => {
  return (
    <section className="quick-info-section animate-on-scroll">
      <div className="landing-container">
        <ProcessSteps />
      </div>
    </section>
  );
};

export default MissionSection;
