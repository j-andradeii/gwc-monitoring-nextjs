'use client';

import React from 'react';
import Link from 'next/link';

export const AriseAndBuildSection: React.FC = () => {
  return (
    <section
      className="arise-build-section animate-on-scroll"
      style={{
        backgroundImage: "url('/assets/images/community.jpg')",
      }}
    >
      <div className="arise-build-overlay"></div>
      <div className="landing-container">
        <div className="arise-build-container">
          <span className="arise-build-label">Worship Center</span>
          <h2 className="arise-build-title">Gateway Projects</h2>
          <p className="arise-build-description">
            Join us in improving 8th Floor Golden Peak as our House of Worship.
            Help bring heaven to earth and invest in the future of our community.
          </p>
          <Link
            href="/give?tab=gateway-projects"
            className="btn-arrow btn-arrow-white"
            scroll={true}
            onClick={() => window.scrollTo(0, 0)}
          >
            Learn More
            <i className="pi pi-arrow-right arrow-icon"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AriseAndBuildSection;
