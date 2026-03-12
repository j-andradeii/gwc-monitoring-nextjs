import React from 'react';
import { CONTACT_INFO } from '@/data/contact';

const ACCEPTED_ITEMS = [
  {
    number: '01',
    label: 'Clothing',
    description: 'Clean, gently used clothing for all ages',
  },
  {
    number: '02',
    label: 'Food',
    description: 'Non-perishable canned goods and dry pantry staples',
  },
  {
    number: '03',
    label: 'Medicine Kits',
    description: 'Basic first aid supplies and over-the-counter medicines',
  },
  {
    number: '04',
    label: 'Other Supplies',
    description: 'Hygiene kits, blankets, school materials, and more',
  },
];

export const OutreachDonationDropoffSection: React.FC = () => {
  return (
    <section id="donation-dropoff" className="outreach-dropoff-section">
      <div className="landing-container">
        {/* Section Header */}
        <div className="section-header-center animate-on-scroll">
          <span className="section-label outreach-dropoff-label">Drop Off Donations</span>
          <h2 className="outreach-dropoff-title">Donate Goods &amp; Supplies</h2>
          <p className="outreach-dropoff-subtitle">
            We accept physical donations of clothing, food, medicine kits, and other essential
            supplies for families in need across Cebu and the Visayas.
          </p>
        </div>

        {/* Infographic Timeline */}
        <div className="outreach-dropoff-timeline animate-on-scroll">
          {ACCEPTED_ITEMS.map((item, index) => (
            <div
              key={item.label}
              className={`outreach-dropoff-timeline-row ${index % 2 === 0 ? 'timeline-row-left' : 'timeline-row-right'}`}
            >
              {/* Left slot */}
              <div className="outreach-dropoff-timeline-content outreach-dropoff-timeline-content-left">
                {index % 2 === 0 && (
                  <>
                    <h3 className="outreach-dropoff-timeline-label">{item.label}</h3>
                    <p className="outreach-dropoff-timeline-description">{item.description}</p>
                  </>
                )}
              </div>

              {/* Center node */}
              <div className="outreach-dropoff-timeline-node">
                <div className="outreach-dropoff-timeline-number">{item.number}</div>
                {index < ACCEPTED_ITEMS.length - 1 && (
                  <div className="outreach-dropoff-timeline-connector"></div>
                )}
              </div>

              {/* Right slot */}
              <div className="outreach-dropoff-timeline-content outreach-dropoff-timeline-content-right">
                {index % 2 !== 0 && (
                  <>
                    <h3 className="outreach-dropoff-timeline-label">{item.label}</h3>
                    <p className="outreach-dropoff-timeline-description">{item.description}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Drop-off Location Bar */}
        <div className="outreach-dropoff-location-wrapper animate-on-scroll">
          <div className="outreach-dropoff-location-bar">
            <div className="outreach-dropoff-location-bar-title">Drop-off Location</div>

            <div className="outreach-dropoff-location-bar-divider"></div>

            <div className="outreach-dropoff-location-bar-items">
              <div className="outreach-dropoff-bar-item">
                <span className="outreach-dropoff-bar-label">Address</span>
                <span className="outreach-dropoff-bar-value">{CONTACT_INFO.address}</span>
              </div>

              <div className="outreach-dropoff-bar-item">
                <span className="outreach-dropoff-bar-label">Email</span>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="outreach-dropoff-bar-value outreach-dropoff-bar-link"
                >
                  {CONTACT_INFO.email}
                </a>
              </div>

              <div className="outreach-dropoff-bar-item">
                <span className="outreach-dropoff-bar-label">Phone</span>
                <a
                  href={`tel:${CONTACT_INFO.phoneRaw}`}
                  className="outreach-dropoff-bar-value outreach-dropoff-bar-link"
                >
                  {CONTACT_INFO.phone}
                </a>
              </div>
            </div>

            <div className="outreach-dropoff-location-bar-note">
              Contact us before dropping off large donations.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OutreachDonationDropoffSection;
