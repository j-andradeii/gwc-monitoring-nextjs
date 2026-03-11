import React from 'react';
import { CONTACT_INFO } from '@/data/contact';

const ACCEPTED_ITEMS = [
  {
    icon: 'pi pi-shopping-bag',
    label: 'Clothing',
    description: 'Clean, gently used clothing for all ages',
  },
  {
    icon: 'pi pi-apple',
    label: 'Food',
    description: 'Non-perishable canned goods and dry pantry staples',
  },
  {
    icon: 'pi pi-heart',
    label: 'Medicine Kits',
    description: 'Basic first aid supplies and over-the-counter medicines',
  },
  {
    icon: 'pi pi-box',
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
            We accept
            physical donations of clothing, food, medicine kits, and other essential supplies for
            families in need across Cebu and the Visayas.
          </p>
        </div>

        {/* Accepted Items Grid */}
        <div className="outreach-dropoff-items-grid animate-on-scroll">
          {ACCEPTED_ITEMS.map((item) => (
            <div key={item.label} className="outreach-dropoff-item-card">
              <div className="outreach-dropoff-item-icon">
                <i className={item.icon}></i>
              </div>
              <h3 className="outreach-dropoff-item-label">{item.label}</h3>
              <p className="outreach-dropoff-item-description">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Drop-off Location Card */}
        <div className="outreach-dropoff-location-wrapper animate-on-scroll">
          <div className="outreach-dropoff-location-card">
            <div className="outreach-dropoff-location-header">
              <div className="outreach-dropoff-location-icon">
                <i className="pi pi-map-marker"></i>
              </div>
              <div>
                <h3 className="outreach-dropoff-location-title">Drop-off Location</h3>
                <p className="outreach-dropoff-location-subtitle">
                  Bring your donations directly to us
                </p>
              </div>
            </div>

            <div className="outreach-dropoff-location-body">
              {/* Address */}
              <div className="outreach-dropoff-contact-row">
                <div className="outreach-dropoff-contact-icon">
                  <i className="pi pi-map-marker"></i>
                </div>
                <div className="outreach-dropoff-contact-details">
                  <span className="outreach-dropoff-contact-label">Address</span>
                  <span className="outreach-dropoff-contact-value">{CONTACT_INFO.address}</span>
                </div>
              </div>

              {/* Email */}
              <div className="outreach-dropoff-contact-row">
                <div className="outreach-dropoff-contact-icon">
                  <i className="pi pi-envelope"></i>
                </div>
                <div className="outreach-dropoff-contact-details">
                  <span className="outreach-dropoff-contact-label">Email</span>
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="outreach-dropoff-contact-value outreach-dropoff-contact-link"
                  >
                    {CONTACT_INFO.email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="outreach-dropoff-contact-row">
                <div className="outreach-dropoff-contact-icon">
                  <i className="pi pi-phone"></i>
                </div>
                <div className="outreach-dropoff-contact-details">
                  <span className="outreach-dropoff-contact-label">Phone</span>
                  <a
                    href={`tel:${CONTACT_INFO.phoneRaw}`}
                    className="outreach-dropoff-contact-value outreach-dropoff-contact-link"
                  >
                    {CONTACT_INFO.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="outreach-dropoff-location-note">
              <i className="pi pi-info-circle"></i>
              <span>
                Please contact us before dropping off large donations so we can be ready to receive
                them.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OutreachDonationDropoffSection;
