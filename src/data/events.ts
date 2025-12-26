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

export const events: Event[] = [
  {
    id: 1,
    title: 'SONday Service',
    date: 'Dec 28, 2025',
    displayDate: 'Dec 28',
    day: 'Sunday',
    time: '9:00 AM',
    location: '8th Floor, Golden Peak',
    image: '/assets/images/event-placeholder.svg',
    description: 'Join us to praise and worship our Lord as a family.',
    category: 'Fellowship',
    isFeatured: false,
    type: GatewayEventType.SONDAY_SERVICE
  },
  {
    id: 2,
    title: 'WELCOME HOME SUNDAY',
    date: 'Jan 4, 2026',
    displayDate: 'Jan 4',
    day: 'Sunday',
    time: '9:00 AM',
    location: '8th Floor, Golden Peak',
    image: '/assets/images/event-placeholder.svg',
    description: 'Join us to praise and worship our Lord as a family.',
    category: 'Fellowship',
    isFeatured: false,
    type: GatewayEventType.SONDAY_SERVICE
  },
  {
    id: 3,
    title: 'PLAN 40: LESSON 1',
    date: 'Jan 4, 2026',
    displayDate: 'Jan 4',
    day: 'Sunday',
    time: '2:00 PM',
    location: '8th Floor, Golden Peak',
    image: '/assets/images/event-placeholder.svg',
    description: 'Traning and Equipping is our Happy Hour!',
    category: 'Training',
    isFeatured: false,
    type: GatewayEventType.TRAINING
  },
  {
    id: 4,
    title: 'SONday Service',
    date: 'Jan 11, 2026',
    displayDate: 'Jan 11',
    day: 'Sunday',
    time: '9:00 AM',
    location: '8th Floor, Golden Peak',
    image: '/assets/images/event-placeholder.svg',
    description: 'Join us to praise and worship our Lord as a family.',
    category: 'Fellowship',
    isFeatured: false,
    type: GatewayEventType.SONDAY_SERVICE
  },
  {
    id: 5,
    title: 'PLAN 40: LESSON 2',
    date: 'Jan 11, 2026',
    displayDate: 'Jan 11',
    day: 'Sunday',
    time: '2:00 PM',
    location: '8th Floor, Golden Peak',
    image: '/assets/images/event-placeholder.svg',
    description: 'Traning and Equipping is our Happy Hour!',
    category: 'Training',
    isFeatured: false,
    type: GatewayEventType.TRAINING
  },
  {
    id: 6,
    title: 'SONday Service',
    date: 'Jan 18, 2026',
    displayDate: 'Jan 18',
    day: 'Sunday',
    time: '9:00 AM',
    location: '8th Floor, Golden Peak',
    image: '/assets/images/event-placeholder.svg',
    description: 'Join us to praise and worship our Lord as a family.',
    category: 'Fellowship',
    isFeatured: false,
    type: GatewayEventType.SONDAY_SERVICE
  },
  {
    id: 7,
    title: 'PLAN 40: LESSON 3',
    date: 'Jan 18, 2026',
    displayDate: 'Jan 18',
    day: 'Sunday',
    time: '2:00 PM',
    location: '8th Floor, Golden Peak',
    image: '/assets/images/event-placeholder.svg',
    description: 'Traning and Equipping is our Happy Hour!',
    category: 'Training',
    isFeatured: false,
    type: GatewayEventType.TRAINING
  },
  {
    id: 8,
    title: 'Consecration Nights',
    date: 'Jan 24, 2026',
    displayDate: 'Jan 24-25',
    day: 'Friday',
    time: '2:00 PM',
    location: '8th Floor, Golden Peak',
    image: '/assets/images/event-placeholder.svg',
    description: 'Traning and Equipping is our Happy Hour!',
    category: 'Training',
    isFeatured: false,
    type: GatewayEventType.CONFERENCE
  },
  {
    id: 9,
    title: 'GATEWAY CHURCH 1st Anniversarry',
    date: 'Feb 01, 2026',
    displayDate: 'Feb 01',
    day: 'Sunday',
    time: '9:00 AM',
    location: '8th Floor, Golden Peak',
    image: '/assets/images/event-placeholder.svg',
    description: 'Join us to praise and worship our Lord as a family.',
    category: 'Fellowship',
    isFeatured: true,
    type: GatewayEventType.SONDAY_SERVICE
  },
  {
    id: 11,
    title: 'GATEWAY MARKETPLACE',
    date: 'Jan 17, 2026',
    displayDate: 'Jan 17',
    day: 'Saturday',
    time: '6:00 PM',
    location: '8th Floor, Golden Peak',
    image: '/assets/images/event-placeholder.svg',
    description: 'A Christ-centered community for young professionals, entrepreneurs, and families growing together in faith and purpose.',
    category: 'Fellowship',
    isFeatured: false,
    type: GatewayEventType.FELLOWSHIP
  },
  {
    id: 12,
    title: 'GATEWAY AXIS',
    date: 'Jan 18, 2026',
    displayDate: 'Jan 18',
    day: 'Sunday',
    time: '4:00 PM',
    location: '8th Floor, Golden Peak',
    image: '/assets/images/event-placeholder.svg',
    description: 'Join us in reaching out the youth of this generation',
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
