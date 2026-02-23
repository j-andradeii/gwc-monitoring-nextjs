'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { events } from '@/data/events';
import { EventsCardGrid } from './EventsCardGrid';

export const EventsSection: React.FC = () => {
  const sortedEvents = useMemo(() => {
    return [...events]
      .filter((e) => !e.is_event_finished)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, []);

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

        <EventsCardGrid events={sortedEvents} showDescription={false} />
      </div>
    </section>
  );
};

export default EventsSection;
