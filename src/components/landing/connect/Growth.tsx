'use client';

import React from 'react';
import Link from 'next/link';
import { ProcessSteps } from '../MissionSection';

export const Growth: React.FC = () => {
  return (
    <section className="connect-panel landing-container" style={{ padding: '48px 24px' }}>
      <div className="mission-content" style={{ marginBottom: '36px' }}>
        <span className="section-label">Growth</span>
        <h2>Win. Consolidate. Disciple. Send.</h2>
      </div>

      <ProcessSteps className="mission-process-steps" showConnectors={false} />

      {/* <Link
        href="/about"
        className="landing-btn landing-btn-primary"
        style={{ marginTop: '36px', alignSelf: 'flex-start' }}
      >
        <i className="pi pi-arrow-right" aria-hidden="true" />
        Grow With Us
      </Link> */}
    </section>
  );
};

export default Growth;
