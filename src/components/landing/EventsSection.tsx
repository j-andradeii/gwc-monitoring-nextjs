'use client';

import React from 'react';
import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
}

// Featured event data
const featuredEvent = {
  title: 'Christmas at Gateway',
  dateRange: 'December 22 - 25, 2024',
  description:
    'Join us for a special Christmas celebration as we come together to worship and celebrate the birth of our Savior. Experience meaningful worship, powerful messages, and the joy of community.',
  image: '/assets/images/community.jpg',
};

// Upcoming events list
const upcomingEvents: Event[] = [
  {
    id: '1',
    title: 'Marketplace Gathering',
    date: 'Dec 18',
    time: '7:00 PM',
    location: 'Main Hall',
    type: 'Fellowship',
  },
  {
    id: '2',
    title: 'Youth Night',
    date: 'Dec 22',
    time: '6:00 PM',
    location: 'Youth Center',
    type: 'Youth',
  },
  {
    id: '3',
    title: 'Christmas Eve Service',
    date: 'Dec 24',
    time: '6:00 PM',
    location: '8th Floor, Golden Peak',
    type: 'Worship',
  },
  {
    id: '4',
    title: 'Christmas Day Celebration',
    date: 'Dec 25',
    time: '9:30 AM',
    location: '8th Floor, Golden Peak',
    type: 'Worship',
  },
  {
    id: '5',
    title: 'New Year Prayer & Worship',
    date: 'Dec 31',
    time: '10:00 PM',
    location: '8th Floor, Golden Peak',
    type: 'Prayer',
  },
];


export const EventsSection: React.FC = () => {
  return (
    <section id="events" className="bethel-events-section animate-on-scroll">
      {/* Featured Event - Bethel Style */}
      <div className="featured-event-bethel">
        <div
          className="featured-event-bg"
          style={{ backgroundImage: `url('${featuredEvent.image}')` }}
        />
        <div className="featured-event-overlay"></div>
        <div className="landing-container">
          <div className="featured-event-inner">
            <div className="featured-event-image-side">
              <div
                className="featured-event-img"
                style={{ backgroundImage: `url('${featuredEvent.image}')` }}
              />
            </div>
            <div className="featured-event-content-side">
              <span className="featured-event-date-label">{featuredEvent.dateRange}</span>
              <h2 className="featured-event-heading">{featuredEvent.title}</h2>
              <p className="featured-event-desc">{featuredEvent.description}</p>
              <Link href="#" className="btn-arrow btn-arrow-white">
                Register Now
                <i className="pi pi-arrow-right arrow-icon"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events List */}
      <div className="upcoming-events-section">
        <div className="landing-container">
          <div className="section-header-inline">
            <div>
              <span className="section-label">What&apos;s Coming</span>
              <h2>Upcoming Events</h2>
            </div>
            <Link href="#" className="view-all-link">
              View Calendar <i className="pi pi-arrow-right"></i>
            </Link>
          </div>

          <div className="events-list">
            {upcomingEvents.map((event) => (
              <Link key={event.id} href="#" className="event-card">
                <div className="event-date-badge">
                  <span className="event-date-day">{event.date.split(' ')[1]}</span>
                  <span className="event-date-month">{event.date.split(' ')[0]}</span>
                </div>
                <div className="event-info">
                  <span className="event-type">{event.type}</span>
                  <h3>{event.title}</h3>
                  <div className="event-details">
                    <span><i className="pi pi-clock"></i> {event.time}</span>
                    <span><i className="pi pi-map-marker"></i> {event.location}</span>
                  </div>
                </div>
                <div className="event-action">
                  <i className="pi pi-chevron-right"></i>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>


    </section>
  );
};

export default EventsSection;
