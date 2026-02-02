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
    <section id="our-pastors" className="our-pastors-section" style={{ background: '#FFFBF2', padding: '80px 0' }}>
      <div className="landing-container">
        <div className="pastors-split-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>

          {/* Left Side - Image */}
          <div className="pastors-image-wrapper" style={{ position: 'relative', height: '600px', width: '100%', borderRadius: '4px', overflow: 'hidden' }}>
            <img
              src="https://gtxngthtpisigkys.public.blob.vercel-storage.com/balorans.jpg"
              alt="Pastors Jim and Anna Marie Baloran"
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          </div>

          {/* Right Side - Content */}
          <div className="pastors-content" style={{ paddingLeft: '20px' }}>
            <h2 style={{
              fontSize: '48px',
              lineHeight: '1.2',
              marginBottom: '30px',
              fontWeight: '800',
              color: '#000',
              position: 'relative',
              display: 'inline-block'
            }}>
              Meet Our<br />Pastors
              <span style={{
                position: 'absolute',
                bottom: '8px',
                left: '0',
                width: '100%',
                height: '4px',
                background: '#000',
                zIndex: -1
              }}></span>
            </h2>

            <p style={{
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#4b5563',
              marginBottom: '40px',
              maxWidth: '90%'
            }}>
              Ptr. Jim and Ptra. Anna Marie Baloran are the Senior Pastors of Gateway Church Cebu.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
            </p>

            {/* <button style={{
              background: 'transparent',
              border: '2px solid #000',
              padding: '14px 32px',
              fontSize: '14px',
              fontWeight: '700',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: '#000',
              borderRadius: '50px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
              onMouseOver={(e) => { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#000'; }}
            >
              Learn More
            </button> */}
          </div>

        </div>
      </div>
    </section>
  );
};

export default OurPastors;
