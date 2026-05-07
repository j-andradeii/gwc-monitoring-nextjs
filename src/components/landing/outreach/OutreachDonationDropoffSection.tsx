import React from 'react';
import { CONTACT_INFO } from '@/data/contact';

type DropoffStatusTone = 'steady' | 'critical' | 'stocked';

interface AcceptedItem {
  number: string;
  label: string;
  description: string;
  icon: string;
  status: { label: string; tone: DropoffStatusTone };
  tags: string[];
}

const ACCEPTED_ITEMS: AcceptedItem[] = [
  {
    number: '01',
    label: 'Clothing',
    description:
      "Clean, gently used clothing for all ages — adult, youth, and children's wear.",
    icon: 'pi pi-inbox',
    status: { label: 'Steady Supply', tone: 'steady' },
    tags: ['Adult wear', "Kid's wear", 'Footwear'],
  },
  {
    number: '02',
    label: 'Food',
    description:
      'Non-perishable canned goods and dry pantry staples — sealed and unexpired.',
    icon: 'pi pi-shopping-bag',
    status: { label: 'Critical Need', tone: 'critical' },
    tags: ['Rice', 'Canned goods', 'Noodles', 'Powdered milk'],
  },
  {
    number: '03',
    label: 'Medicine Kits',
    description:
      'Basic first aid supplies and over-the-counter medicines, sealed and within expiry.',
    icon: 'pi pi-heart-fill',
    status: { label: 'Critical Need', tone: 'critical' },
    tags: ['Paracetamol', 'Vitamins', 'Bandages'],
  },
  {
    number: '04',
    label: 'Other Supplies',
    description:
      'Hygiene kits, blankets, school materials and other essentials for daily life.',
    icon: 'pi pi-box',
    status: { label: 'Well Stocked', tone: 'stocked' },
    tags: ['Hygiene', 'Blankets', 'School kits'],
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

        {/* Accepted Items — Card Grid */}
        <div className="outreach-dropoff-grid animate-on-scroll">
          {ACCEPTED_ITEMS.map((item, idx) => (
            <article
              key={item.label}
              className="outreach-dropoff-card"
              style={{ ['--dropoff-card-index' as string]: idx }}
            >
              <header className="outreach-dropoff-card-header">
                <span className="outreach-dropoff-card-number" aria-hidden="true">
                  {item.number}
                </span>
                <span
                  className={`outreach-dropoff-card-status outreach-dropoff-card-status--${item.status.tone}`}
                >
                  <span className="outreach-dropoff-card-status-dot" aria-hidden="true" />
                  {item.status.label}
                </span>
              </header>

              <div className="outreach-dropoff-card-visual" aria-hidden="true">
                <span className="outreach-dropoff-card-bracket outreach-dropoff-card-bracket--tl" />
                <span className="outreach-dropoff-card-bracket outreach-dropoff-card-bracket--tr" />
                <span className="outreach-dropoff-card-bracket outreach-dropoff-card-bracket--bl" />
                <span className="outreach-dropoff-card-bracket outreach-dropoff-card-bracket--br" />
                <i className={`outreach-dropoff-card-icon ${item.icon}`} />
              </div>

              <h3 className="outreach-dropoff-card-title">{item.label}</h3>
              <p className="outreach-dropoff-card-description">{item.description}</p>

              <ul className="outreach-dropoff-card-tags" role="list">
                {item.tags.map((tag) => (
                  <li key={tag} className="outreach-dropoff-card-tag">
                    {tag}
                  </li>
                ))}
              </ul>
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
