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
}

const getUpcomingSunday = (): string => {
  const date = new Date();
  const day = date.getDay();
  const diff = (7 - day) % 7;
  date.setDate(date.getDate() + diff);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });
};

const upcomingSundayDate = getUpcomingSunday();

export const events: Event[] = [
  {
    id: 1,
    title: 'SONday Service',
    date: upcomingSundayDate,
    displayDate: upcomingSundayDate,
    day: 'Sunday',
    time: '9:00 AM',
    location: '8th Floor, Golden Peak',
    image: '/assets/images/event-placeholder.svg',
    description: 'Join us to praise and worship our Lord as a family.',
    category: 'SONDAY SERVICE',
    isFeatured: false,
    type: GatewayEventType.SONDAY_SERVICE
  },
  {
    id: 2,
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
    type: GatewayEventType.FELLOWSHIP
  },
  {
    id: 3,
    title: 'Lifeclass Party',
    date: 'Feb 15, 2026',
    displayDate: 'Feb 15',
    day: 'Sunday',
    time: '2:00 PM',
    location: '8th Floor, Golden Peak',
    image: '/assets/images/event-placeholder.svg',
    description: 'Lifeclass orientation for new delegates.',
    category: 'Fellowship',
    isFeatured: false,
    type: GatewayEventType.TRAINING
  },
  {
    id: 4,
    title: `Men's and Women's Gathering`,
    date: 'Feb 28, 2026',
    displayDate: 'Feb 28',
    day: 'Saturday',
    time: '2:00 PM',
    location: '8th Floor, Golden Peak',
    image: '/assets/images/event-placeholder.svg',
    description: 'Gateway monthly gathering for men and women.',
    category: 'Fellowship',
    isFeatured: false,
    type: GatewayEventType.FELLOWSHIP
  },
];

export const getEventById = (id: number): Event | undefined => {
  return events.find(event => event.id === id);
};

export const getFeaturedEvent = (): Event | undefined => {
  return events.find(event => event.isFeatured);
};

export const getEventsByCategory = (category: string): Event[] => {
  return events.filter(event => event.category === category);
};

export const getAllCategories = (): string[] => {
  return [...new Set(events.map(event => event.category).filter((c): c is string => c !== undefined))];
};

export const getEventsByType = (type: GatewayEventType): Event[] => {
  return events.filter(event => event.type === type);
};

export const getNearestSondayService = (): Event | undefined => {
  const sondayServices = events.filter(event => event.type === GatewayEventType.SONDAY_SERVICE);
  // Return the first one (assuming events are ordered by date)
  return sondayServices[0];
};
