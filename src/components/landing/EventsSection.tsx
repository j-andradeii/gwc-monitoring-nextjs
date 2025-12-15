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

const events: Event[] = [
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
    title: 'Christmas Service',
    date: 'Dec 25',
    time: '9:30 AM',
    location: 'Lex Hotel',
    type: 'Worship',
  },
];

export const EventsSection: React.FC = () => {
  return (
    <section id="events" className="events-section animate-on-scroll">
      <div className="landing-container">
        <div className="section-header-inline">
          <div>
            <span className="section-label">Upcoming</span>
            <h2>Events</h2>
          </div>
          <Link href="#" className="view-all-link">
            View Calendar <i className="pi pi-arrow-right"></i>
          </Link>
        </div>

        <div className="events-list">
          {events.map((event) => (
            <Link key={event.id} href="#" className="event-card animate-on-scroll">
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
    </section>
  );
};

export default EventsSection;
