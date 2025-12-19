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
    <section id="our-pastors" className="our-pastors-section animate-on-scroll">
      <div className="landing-container">
        <div className="pastors-header">
          <span className="section-label">Our Pastors</span>
          <h2>Meet Our Leadership</h2>
          <p className="pastors-subtitle">
            Serving and leading our church family with love and dedication.
          </p>
        </div>

        <div className="pastors-grid">
          {pastors.map((pastor, index) => (
            <div key={index} className="pastor-card">
              <div className="pastor-image-placeholder">
                <i className="pi pi-user"></i>
              </div>
              <div className="pastor-info">
                <h3>{pastor.name}</h3>
                <p className="pastor-title">{pastor.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurPastors;
