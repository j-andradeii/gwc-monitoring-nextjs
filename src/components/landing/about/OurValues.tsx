'use client';

import React from 'react';

interface ValueItem {
  icon: string;
  title: string;
  description: string;
}

const coreValues: ValueItem[] = [
  {
    icon: 'pi pi-user',
    title: 'True Discipleship',
    description: 'I am a true disciple with Christ-like character and a multiplying ministry.',
  },
  {
    icon: 'pi pi-eye',
    title: 'Caught by the Vision',
    description: 'I understand, live, and transmit the vision of our church.',
  },
  {
    icon: 'pi pi-users',
    title: 'Committed to Cell Life',
    description: 'I embrace evangelism, leadership development, and multiplication.',
  },
  {
    icon: 'pi pi-heart-fill',
    title: 'Passionate Spirituality',
    description: 'I pursue daily devotions, fasting, prayer, and holiness.',
  },
  {
    icon: 'pi pi-shield',
    title: 'Submission to Authority',
    description: 'I love, honor, and respect my leaders.',
  },
  {
    icon: 'pi pi-clock',
    title: 'Committed to Time',
    description: 'I manage and invest my time for the Kingdom.',
  },
  {
    icon: 'pi pi-link',
    title: 'Lifelong Relationships',
    description: 'I am accountable and responsible in my relationships.',
  },
  {
    icon: 'pi pi-book',
    title: 'I Love Training & Equipping',
    description: 'Training is my happy hour—I pursue continuous growth.',
  },
  {
    icon: 'pi pi-sitemap',
    title: 'Leader of Twelve Disciples',
    description: 'I am born to multiply and raise up leaders.',
  },
  {
    icon: 'pi pi-flag',
    title: 'Accomplishing Church Goals',
    description: 'I support, help, and fulfill our church\'s goals.',
  },
  {
    icon: 'pi pi-chart-line',
    title: 'I Want to See My Church Grow',
    description: 'I pray, work, and pay to see our church flourish.',
  },
  {
    icon: 'pi pi-star',
    title: 'The Importance of Young People',
    description: 'I will prepare and invest in the next generation.',
  },
];

interface BeliefItem {
  title: string;
  description: string;
}

const beliefs: BeliefItem[] = [
  {
    title: 'The Scriptures Inspired',
    description: 'The Scriptures are inspired by God and declare His design and plan for mankind.',
  },
  {
    title: 'The One True God',
    description: 'There is only One True God revealed in three persons: Father, Son, and Holy Spirit.',
  },
  {
    title: 'The Deity of the Lord Jesus Christ',
    description: 'As God\'s Son, Jesus was both fully human and fully divine.',
  },
  {
    title: 'The Fall of Man',
    description: 'Though originally good, man willingly fell to sin, ushering evil and death into the world.',
  },
  {
    title: 'The Salvation of Man',
    description: 'Every person can have restored fellowship with God through salvation in Jesus Christ.',
  },
  {
    title: 'The Ordinances of the Church',
    description: 'Water baptism by immersion and Holy Communion as commanded by our Lord.',
  },
  {
    title: 'The Baptism in the Holy Spirit',
    description: 'All believers are entitled to and should earnestly seek the baptism in the Holy Spirit.',
  },
  {
    title: 'The Initial Physical Evidence',
    description: 'The baptism in the Holy Spirit is witnessed by speaking in other tongues.',
  },
  {
    title: 'Sanctification',
    description: 'A progressive lifelong process of separating from evil and becoming more Christlike.',
  },
  {
    title: 'The Church and Its Mission',
    description: 'The Church is the Body of Christ with a mission to seek and save all who are lost.',
  },
  {
    title: 'The Ministry',
    description: 'A divinely called and scripturally ordained leadership ministry serves the Church.',
  },
  {
    title: 'Divine Healing',
    description: 'Divine healing is an integral part of the gospel and the privilege of all believers.',
  },
  {
    title: 'The Blessed Hope',
    description: 'The resurrection and translation of believers at the coming of the Lord.',
  },
  {
    title: 'The Millennial Reign of Christ',
    description: 'The visible return of Christ with His saints to reign on earth for 1,000 years.',
  },
  {
    title: 'The Final Judgment',
    description: 'There will be a final judgment in which the wicked dead will be raised and judged.',
  },
  {
    title: 'The New Heavens and New Earth',
    description: 'We look for new heavens and a new earth wherein righteousness dwells.',
  },
];

export const OurValues: React.FC = () => {
  return (
    <section id="our-values" className="our-values-section animate-on-scroll">
      <div className="landing-container">
        <div className="values-header">
          <span className="section-label">Our Values</span>
          <h2>What Shapes Us</h2>
          <p className="values-subtitle">
            These core values guide everything we do and who we are as a community.
          </p>
        </div>

        <div className="values-grid">
          {coreValues.map((value, index) => (
            <div key={index} className="value-card">
              <div className="value-icon">
                <i className={value.icon}></i>
              </div>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </div>
          ))}
        </div>

        <div id="what-we-believe" className="beliefs-section">
          <div className="beliefs-header">
            <span className="section-label">What We Believe</span>
            <h2>16 Fundamental Truths</h2>
          </div>

          <div className="beliefs-grid">
            {beliefs.map((belief, index) => (
              <div key={index} className="belief-item">
                <div className="belief-number">{index + 1}</div>
                <div className="belief-content">
                  <h4>{belief.title}</h4>
                  <p>{belief.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurValues;
