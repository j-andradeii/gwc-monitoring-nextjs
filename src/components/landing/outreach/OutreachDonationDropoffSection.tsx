import React from 'react';
import { CONTACT_INFO } from '@/data/contact';

interface AcceptedItem {
  label: string;
  description: string;
  icon: string;
}

const ACCEPTED_ITEMS: AcceptedItem[] = [
  {
    label: 'Clothing',
    description: 'Clean, gently used clothing for adults, youth, and children.',
    icon: 'pi pi-inbox',
  },
  {
    label: 'Food',
    description: 'Non-perishable canned goods and dry pantry staples, sealed and unexpired.',
    icon: 'pi pi-shopping-bag',
  },
  {
    label: 'Medicine Kits',
    description: 'Basic first aid supplies and over-the-counter medicines within expiry.',
    icon: 'pi pi-heart-fill',
  },
  {
    label: 'Other Supplies',
    description: 'Hygiene kits, blankets, school materials, and other daily essentials.',
    icon: 'pi pi-box',
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
            We accept donations of clothing, food, medicine kits, and essential supplies for
            families in need across Cebu and the Visayas.
          </p>
        </div>

        {/* Accepted Items — Minimal Card Grid */}
        <div className="outreach-dropoff-grid animate-on-scroll">
          {ACCEPTED_ITEMS.map((item, idx) => (
            <article
              key={item.label}
              className="outreach-dropoff-card"
              style={{ ['--dropoff-card-index' as string]: idx }}
            >
              <div className="outreach-dropoff-card-icon-wrap" aria-hidden="true">
                <i className={item.icon} />
              </div>
              <h3 className="outreach-dropoff-card-title">{item.label}</h3>
              <p className="outreach-dropoff-card-description">{item.description}</p>
            </article>
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
