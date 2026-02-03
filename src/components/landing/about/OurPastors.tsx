'use client';

import React from 'react';

interface PastorInfo {
  name: string;
  title: string;
  image?: string;
}

const pastors: PastorInfo[] = [
  {
    name: 'Ptr. Jim Baloran',
    title: 'Senior Pastor',
  },
  {
    name: 'Ptra. Anna Marie Baloran',
    title: 'Administrative Pastor',
  },
];

export const OurPastors: React.FC = () => {
  return (
    <section id="our-pastors" className="our-pastors-section">
      <div className="landing-container">
        <div className="pastors-split-layout">

          {/* Left Side - Image */}
          <div className="pastors-image-wrapper">
            <img
              src="https://gtxngthtpisigkys.public.blob.vercel-storage.com/balorans.jpg"
              alt="Pastors Jim and Anna Marie Baloran"
            />
          </div>

          {/* Right Side - Content */}
          <div className="pastors-content">
            <h2 className="pastors-title">
              Meet Our<br />
              <span className="highlight" style={{ color: '#C9973F' }}>Pastors</span>
              <span className="pastors-title-underline"></span>
            </h2>

            <p className="pastors-description">
              Ptr. Jim and Ptra. Anna Marie Baloran are the Senior Pastors of Gateway Church Cebu.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
            </p>

            <div style={{ marginTop: '40px' }}>
              <button className="landing-btn landing-btn-outline pastors-action-btn"
                style={{
                  borderRadius: '4px',
                  letterSpacing: '2px',
                  fontSize: '13px',
                  padding: '16px 40px',
                  borderWidth: '1px'
                }}
              >
                Learn More
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default OurPastors;
