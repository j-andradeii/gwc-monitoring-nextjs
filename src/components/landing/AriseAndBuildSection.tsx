'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
export const AriseAndBuildSection: React.FC = () => {
  const router = useRouter()
  return (
    <section
      className="arise-build-section"
      style={{
        backgroundImage: "url('https://gtxngthtpisigkys.public.blob.vercel-storage.com/center.jpg')",
      }}
    >
      <div className="arise-build-overlay"></div>
      <div className="landing-container">
        <div className="arise-build-container">
          <span className="arise-build-label">Worship Center</span>
          <h2 className="arise-build-title">Gateway Projects</h2>
          <p className="arise-build-description">
            Join us in improving our 8th Floor, Golden Peak Hotel and Suites Worship Center.
            Help bring heaven to earth and invest in the future of our community.
          </p>
          <Link
            href="/give/gateway-projects"
            className="btn-arrow btn-arrow-white"
            scroll={true}
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0 });
              router.push('/give/gateway-projects');
            }}
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
