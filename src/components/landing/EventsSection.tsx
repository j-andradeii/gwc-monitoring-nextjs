'use client';

import React from 'react';
import Link from 'next/link';
import { events } from '@/data/events';
import { EventsCardGrid } from './EventsCardGrid';

export const EventsSection: React.FC = () => {
  return (
    <section id="events" className="events-grid-section animate-on-scroll">
      <div className="landing-container">
        <div className="events-grid-header">
          <div>
            <span className="section-label">Upcoming</span>
            <h2>Events</h2>
          </div>
          <Link href="/events" className="btn-arrow btn-arrow-outline-navy">
            View All Events
            <i className="pi pi-arrow-right arrow-icon"></i>
          </Link>
        </div>

        <EventsCardGrid events={events} showDescription={false} />
      </div>
    </section>
  );
};

export default EventsSection;
