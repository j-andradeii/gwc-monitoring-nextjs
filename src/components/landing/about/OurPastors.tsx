'use client';

import React from 'react';

interface PastorBio {
  id: string;
  eyebrow: string;
  name: string;
  icon: string;
  paragraph: string;
}

const pastorBios: PastorBio[] = [
  {
    id: 'senior',
    eyebrow: 'Senior Pastor',
    name: 'Rev. Jimanuel Baloran',
    icon: 'pi pi-bookmark-fill',
    paragraph:
      "Senior Pastor of Gateway Church Cebu and an ordained minister of the Philippine General Council of the Assemblies of God. He graduated from Immanuel Bible College with a Bachelor of Arts in Music and has served as a faculty member since 2013. He was recently appointed as the District Youth Director of PGCAG's CVLL (Central Visayas–Lower Leyte) District.",
  },
  {
    id: 'admin',
    eyebrow: 'Administrative Pastor',
    name: 'Ptra. Anna Marie Baloran',
    icon: 'pi pi-graduation-cap',
    paragraph:
      'Earned her Bachelor’s degree from the University of San Carlos and a Doctorate in Business Administration at the University of San Jose–Recoletos. She is a Full-time Professor at the University of San Carlos under the Department of Business Administration and currently serves as Finance and Church Administrator of Gateway Church.',
  },
  {
    id: 'family',
    eyebrow: 'The Baloran Family',
    name: 'Annuelle Joyce, Keren Jana & Derick Jeshurun',
    icon: 'pi pi-heart-fill',
    paragraph:
      'The children are actively involved in various ministries of Gateway Church: youth ministry, ushering, tech team, worship team, and kids ministry. Both girls also serve as cell group leaders. Joyce and Keren study at the University of San Carlos (BS Nursing 3 and BS Tourism Management 2), while Derick is in Senior High School at Cebu Bradford School, Inc.',
  },
];

export const OurPastors: React.FC = () => {
  return (
    <section id="our-pastors" className="our-pastors-section pastors-modern animate-on-scroll">
      <div className="landing-container">
        <div className="pastors-modern-header">
          <span className="section-label">Spiritual Leadership</span>
          <h2 className="pastors-modern-title">
            Meet Our <span className="pastors-modern-title-accent">Pastors</span>
          </h2>
          <p className="pastors-modern-subtitle">
            Shepherding Gateway Church Cebu with conviction, scholarship, and a heart for community.
          </p>
        </div>

        <div className="pastors-modern-layout">
          {/* Left — Portrait with corner brackets, gold offset frame, floating identity card */}
          <div className="pastors-modern-visual">
            <span className="pastors-modern-frame" aria-hidden="true" />
            <div className="pastors-modern-image">
              <span className="pastors-modern-bracket pastors-modern-bracket--tl" aria-hidden="true" />
              <span className="pastors-modern-bracket pastors-modern-bracket--tr" aria-hidden="true" />
              <span className="pastors-modern-bracket pastors-modern-bracket--bl" aria-hidden="true" />
              <span className="pastors-modern-bracket pastors-modern-bracket--br" aria-hidden="true" />
              <img
                src="https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrs.webp"
                alt="Pastors Jim and Anna Marie Baloran"
              />
              <span className="pastors-modern-image-veil" aria-hidden="true" />
              <div className="pastors-modern-identity">
                <span className="pastors-modern-identity-eyebrow">
                  <i className="pi pi-star-fill" aria-hidden="true" />
                  Senior Pastors
                </span>
                <span className="pastors-modern-identity-name">
                  Ptr. Jim &amp; Ptra. Anna Marie Baloran
                </span>
              </div>
            </div>
            <span className="pastors-modern-watermark" aria-hidden="true">GCC</span>
          </div>

          {/* Right — Editorial bio stack */}
          <div className="pastors-modern-content">
            <ul className="pastors-modern-bios" role="list">
              {pastorBios.map((bio, idx) => (
                <li
                  key={bio.id}
                  className="pastors-modern-bio"
                  style={{ ['--pastor-index' as string]: idx }}
                >
                  <div className="pastors-modern-bio-marker" aria-hidden="true">
                    <i className={bio.icon} />
                  </div>
                  <div className="pastors-modern-bio-body">
                    <span className="pastors-modern-bio-eyebrow">{bio.eyebrow}</span>
                    <h3 className="pastors-modern-bio-name">{bio.name}</h3>
                    <p className="pastors-modern-bio-text">{bio.paragraph}</p>
                  </div>
                </li>
              ))}
            </ul>


          </div>
        </div>
      </div>
    </section>
  );
};

export default OurPastors;
