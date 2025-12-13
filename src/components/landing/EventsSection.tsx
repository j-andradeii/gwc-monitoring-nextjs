'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Event {
  id: string;
  title: string;
  day: string;
  monthYear: string;
  location: string;
  timeInfo: string;
  image: string;
}

const events: Event[] = [
  {
    id: '1',
    title: 'Marketplace Gathering',
    day: '18',
    monthYear: 'Jul, 2025',
    location: 'New York',
    timeInfo: 'July 18, 2025 10:30 am - July 24, 2026 5:00 pm',
    image: 'https://placehold.co/150x100/6c757d/ffffff?text=Event',
  },
  {
    id: '2',
    title: 'Youth Fellowship',
    day: '22',
    monthYear: 'Aug, 2026',
    location: 'New York',
    timeInfo: 'August 22, 2026 3:30 pm - September 4, 2026 7:00 pm',
    image: 'https://placehold.co/150x100/adb5bd/ffffff?text=Event',
  },
  {
    id: '3',
    title: 'Godpreneurs',
    day: '06',
    monthYear: 'Sep, 2026',
    location: 'New York',
    timeInfo: 'September 6, 2026 10:00 am - September 20, 2026 5:00 pm',
    image: 'https://placehold.co/150x100/495057/ffffff?text=Event',
  },
];

export const EventsSection: React.FC = () => {
  return (
    <section id="events" className="our-events-section animate-on-scroll">
      <div className="landing-container">
        <div className="section-header">
          <div className="section-header-content">
            <p className="events-pre-title">CALENDAR</p>
            <h2>Our Events</h2>
          </div>
          <div className="section-header-description">
            <p>
              Join us for our upcoming events and gatherings. From worship services to
              community outreach, there&apos;s something for everyone to get involved and grow
              in faith.
            </p>
          </div>
          <div>
            <Link href="#" className="view-more-link">
              View More <i className="pi pi-arrow-right"></i>
            </Link>
          </div>
        </div>

        <div className="events-list-wrapper">
          {events.map((event) => (
            <div key={event.id} className="event-list-item animate-on-scroll">
              <div className="event-date">
                <span className="day">{event.day}</span>
                <span className="month-year">{event.monthYear}</span>
              </div>
              <div className="event-image">
                <Image
                  src={event.image}
                  alt={event.title}
                  width={150}
                  height={100}
                  unoptimized
                />
              </div>
              <div className="event-details">
                <h3>
                  <Link href="#">{event.title}</Link>
                </h3>
                <p className="location">{event.location}</p>
                <p className="time-info">
                  <i className="pi pi-calendar"></i> {event.timeInfo}
                </p>
              </div>
              <div className="event-status">
                <span>Join</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
