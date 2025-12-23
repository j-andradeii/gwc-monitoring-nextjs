'use client';

import React from 'react';
import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  date: string;
  day: string;
  time: string;
  location: string;
  image: string;
}

// Upcoming events list
const upcomingEvents: Event[] = [
  {
    id: '1',
    title: 'Marketplace Gathering',
    date: 'Dec 18',
    day: 'Wednesday',
    time: '7:00 PM',
    location: 'Main Hall',
    image: '/assets/images/community.jpg',
  },
  {
    id: '2',
    title: 'Youth Night',
    date: 'Dec 22',
    day: 'Sunday',
    time: '6:00 PM',
    location: 'Youth Center',
    image: '/assets/images/community.jpg',
  },
  {
    id: '3',
    title: 'Christmas Eve Service',
    date: 'Dec 24',
    day: 'Tuesday',
    time: '6:00 PM',
    location: '8th Floor, Golden Peak',
    image: '/assets/images/community.jpg',
  },
  {
    id: '4',
    title: 'Christmas Day Celebration',
    date: 'Dec 25',
    day: 'Wednesday',
    time: '9:30 AM',
    location: '8th Floor, Golden Peak',
    image: '/assets/images/community.jpg',
  },
  {
    id: '5',
    title: 'New Year Prayer & Worship',
    date: 'Dec 31',
    day: 'Tuesday',
    time: '10:00 PM',
    location: '8th Floor, Golden Peak',
    image: '/assets/images/community.jpg',
  },
];

export const EventsSection: React.FC = () => {
  return (
    <section id="events" className="events-grid-section animate-on-scroll">
      <div className="landing-container">
        <div className="events-grid-header">
          <div>
            <span className="section-label">Upcoming</span>
            <h2>Events</h2>
          </div>
          <Link href="#" className="btn-arrow btn-arrow-outline-navy">
            View All Events
            <i className="pi pi-arrow-right arrow-icon"></i>
          </Link>
        </div>

        <div className="events-card-grid">
          {upcomingEvents.map((event) => (
            <Link key={event.id} href="#" className="event-grid-card">
              <div
                className="event-grid-card-image"
                style={{ backgroundImage: `url('${event.image}')` }}
              >
                <div className="event-grid-card-date-badge">
                  <span className="event-grid-day-num">{event.date.split(' ')[1]}</span>
                  <span className="event-grid-month">{event.date.split(' ')[0]}</span>
                </div>
              </div>
              <div className="event-grid-card-body">
                <h3 className="event-grid-card-title">{event.title}</h3>
                <div className="event-grid-card-info">
                  <div className="event-grid-info-row">
                    <i className="pi pi-calendar"></i>
                    <span>{event.day}, {event.date}</span>
                  </div>
                  <div className="event-grid-info-row">
                    <i className="pi pi-clock"></i>
                    <span>{event.time}</span>
                  </div>
                  <div className="event-grid-info-row">
                    <i className="pi pi-map-marker"></i>
                    <span>{event.location}</span>
                  </div>
                </div>
                <div className="event-grid-card-cta">
                  <span>Learn More</span>
                  <i className="pi pi-arrow-right"></i>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
