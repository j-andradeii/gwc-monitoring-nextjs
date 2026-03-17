/**
 * Events Data
 *
 * Shared events data used across the application
 */

export enum GatewayEventType {
  SONDAY_SERVICE = 'SONDAY_SERVICE',
  TRAINING = 'TRAINING',
  FELLOWSHIP = 'FELLOWSHIP',
  CONFERENCE = 'CONFERENCE',
  RETREAT = 'RETREAT'
}

export interface Event {
  id: number;
  slug: string;
  title: string;
  date: string;
  displayDate?: string; // Optional display date for date ranges (e.g., "Jan 24-25")
  day: string;
  time: string;
  location: string;
  image: string;
  description?: string;
  category?: string;
  isFeatured?: boolean;
  type: GatewayEventType;
  is_event_finished?: boolean;
  gallery?: string[]; // Optional array of image URLs for the event gallery
}

const getUpcomingSunday = (): string => {
  const date = new Date();
  const day = date.getDay();
  const diff = (7 - day) % 7;
  date.setDate(date.getDate() + diff);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Manila'
  });
};

const upcomingSundayDate = getUpcomingSunday();

export const events: Event[] = [
  {
    id: 1,
    slug: 'sonday-service',
    title: 'SONday Service',
    date: upcomingSundayDate,
    displayDate: upcomingSundayDate.split(',')[0],
    day: 'Sunday',
    time: '9:00 AM',
    location: '8th Floor, Golden Peak',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/sunday_poster.jpg',
    description: `Church isn’t just a place — it’s people.
Join us this Sunday at Gateway Church as we worship and grow together.

🕘 9:00 AM
📍8F Golden Peak Hotel & Suites

We’ve saved you a seat. 🤍

#GatewayChurchCebu #SundayService #ChurchFamily`,
    category: 'SONDAY SERVICE',
    isFeatured: false,
    type: GatewayEventType.SONDAY_SERVICE,
    is_event_finished: false
  },
  {
    id: 2,
    slug: 'gateway-marketplace-x-axis',
    title: 'GATEWAY MARKETPLACE x AXIS',
    date: 'Feb 07, 2026',
    displayDate: 'Feb 07',
    day: 'Saturday',
    time: '3:00 PM',
    location: '8th Floor, Golden Peak',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/mrkplc.jpg',
    description: `“Love is patient, love is kind.”
— 1 Corinthians 13:4

You’re warmly invited to join us for an afternoon of faith, purpose, and God-centered love. A Youth & Young Professionals Gathering—together, 
let’s discover what it truly means to wait, trust, and honor love the way God designed it.

Everyone is invited. See you there! 🫶✨`,
    category: 'Fellowship',
    isFeatured: false,
    type: GatewayEventType.FELLOWSHIP,
    is_event_finished: true,
    gallery: [
      'https://gtxngthtpisigkys.public.blob.vercel-storage.com/mrkplc.jpg',
    ]
  },
  {
    id: 3,
    slug: 'lifeclass-party',
    title: 'Lifeclass Party',
    date: 'Feb 15, 2026',
    displayDate: 'Feb 15',
    day: 'Sunday',
    time: '1:30 PM',
    location: '8th Floor, Golden Peak',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/lifeclass_party_4.jpg',
    description: `Life Class Party gives you a glimpse of what to expect in Life Class. 
    You’ll learn more about what Life Class is all about, why your commitment matters, and meet the team who will journey with you throughout the Life Class. 
    
    It’s also a time of celebration and connection.

    We can’t wait to see you there! 🎉`,
    category: 'Training',
    isFeatured: false,
    type: GatewayEventType.TRAINING,
    is_event_finished: true,
    gallery: [
      'https://gtxngthtpisigkys.public.blob.vercel-storage.com/lifeclass_party_4.jpg',
    ]
  },
  {
    id: 4,
    slug: 'mens-and-womens-gathering',
    title: `Men's and Women's Gathering`,
    date: 'Feb 28, 2026',
    displayDate: 'Feb 28',
    day: 'Saturday',
    time: '2:00 PM',
    location: '8th Floor, Golden Peak',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/men_women.jpg',
    description: 'Gateway monthly gathering for men and women.',
    category: 'Fellowship',
    isFeatured: false,
    type: GatewayEventType.FELLOWSHIP,
    is_event_finished: true,
    gallery: [
      'https://gtxngthtpisigkys.public.blob.vercel-storage.com/men_women.jpg',
    ]
  },
  {
    id: 5,
    slug: 'couples-gathering-march',
    title: `Gateway Couples`,
    date: 'March 14, 2026',
    displayDate: 'March 14',
    day: 'Saturday',
    time: '2:00 PM',
    location: '8th Floor, Golden Peak',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/couple.jpg',
    description: 'Gathering for Gateway Couples.',
    category: 'Fellowship',
    isFeatured: false,
    type: GatewayEventType.FELLOWSHIP,
    is_event_finished: false,
    gallery: [
      'https://gtxngthtpisigkys.public.blob.vercel-storage.com/couple.jpg',
      'https://gtxngthtpisigkys.public.blob.vercel-storage.com/couple.jpg'
    ]
  },
  {
    id: 6,
    slug: 'mens-and-womens-gathering-march-14',
    title: `Men's and Women's Gathering`,
    date: 'March 22, 2026',
    displayDate: 'March 22',
    day: 'Sunday',
    time: '2:00 PM',
    location: '8th Floor, Golden Peak',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/men_women.jpg',
    description: 'Gateway monthly gathering for men and women.',
    category: 'Fellowship',
    isFeatured: false,
    type: GatewayEventType.FELLOWSHIP,
    is_event_finished: false
  },
  {
    id: 7,
    slug: 'lc-encounter-weekend-march',
    title: `Encounter Weekend`,
    date: 'March 20, 2026',
    displayDate: 'March 20 - 21',
    day: 'Friday',
    time: '8:00 AM',
    location: '8th Floor, Golden Peak',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/encounter.jpg',
    description: 'Experience Fire, Freedom and Focus as we Encounter God!',
    category: 'Retreat',
    isFeatured: false,
    type: GatewayEventType.RETREAT,
    is_event_finished: false
  },
];

export const getEventById = (id: number): Event | undefined => {
  return events.find(event => event.id === id);
};

export const getEventBySlug = (slug: string): Event | undefined => {
  return events.find(event => event.slug === slug);
};

export const getFeaturedEvent = (): Event | undefined => {
  return events.find(event => event.isFeatured && !event.is_event_finished);
};

export const getEventsByCategory = (category: string): Event[] => {
  return events.filter(event => event.category === category && !event.is_event_finished);
};

export const getAllCategories = (): string[] => {
  return [...new Set(events.map(event => event.category).filter((c): c is string => c !== undefined))];
};

export const getEventsByType = (type: GatewayEventType): Event[] => {
  return events.filter(event => event.type === type && !event.is_event_finished);
};

export const getNearestSondayService = (): Event | undefined => {
  const sondayServices = events.filter(event => event.type === GatewayEventType.SONDAY_SERVICE && !event.is_event_finished);
  // Return the first one (assuming events are ordered by date)
  return sondayServices[0];
};

export const isEventUpcoming = (event: Event): boolean => {
  const eventDateStr = event.date;

  // Create date object from string (e.g., "Feb 07, 2026")
  const eventDate = new Date(eventDateStr);

  // Get current date
  const now = new Date();

  // Reset time to midnight for both dates to compare just the day
  eventDate.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  // Return true if event is today or in the future
  return eventDate.getTime() >= now.getTime();
};
