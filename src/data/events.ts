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
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short'
  }).formatToParts(new Date());
  const get = (type: string) => parts.find(p => p.type === type)!.value;
  const dayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const currentDay = dayMap[get('weekday')];
  const diff = (7 - currentDay) % 7;
  const sunday = new Date(Date.UTC(
    parseInt(get('year')),
    parseInt(get('month')) - 1,
    parseInt(get('day')) + diff
  ));
  return sunday.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'UTC'
  });
};

export const events: Event[] = [
  {
    id: 1,
    slug: 'sonday-service',
    title: 'SONday Service',
    get date() { return getUpcomingSunday(); },
    get displayDate() { return getUpcomingSunday().split(',')[0]; },
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
    is_event_finished: true,
    gallery: []
  },
  {
    id: 6,
    slug: 'mens-and-womens-gathering-march-28',
    title: `Men's and Women's Gathering`,
    date: 'March 28, 2026',
    displayDate: 'March 28',
    day: 'Saturday',
    time: '3:00 PM',
    location: '8th Floor, Golden Peak',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/men_women.jpg',
    description: 'You’re invited to our Men’s and Women’s Gathering. Come and be encouraged, connect, and grow together.',
    category: 'Fellowship',
    isFeatured: false,
    type: GatewayEventType.FELLOWSHIP,
    is_event_finished: true,
    gallery: [
      'https://gtxngthtpisigkys.public.blob.vercel-storage.com/men_women_gathering/women_march_promotional.jpg',
      'https://gtxngthtpisigkys.public.blob.vercel-storage.com/men_women_gathering/men_march_28.png',
      'https://gtxngthtpisigkys.public.blob.vercel-storage.com/men_women_gathering/men.jpg',
      'https://gtxngthtpisigkys.public.blob.vercel-storage.com/men_women_gathering/women.jpg',
      'https://gtxngthtpisigkys.public.blob.vercel-storage.com/men_women_gathering/women_activity.jpg'
    ]
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
    is_event_finished: true
  },
  {
    id: 8,
    slug: 'lc-water-baptism-may-2026',
    title: `Lifeclass Water Baptism`,
    date: 'May 10, 2026',
    displayDate: 'May 10',
    day: 'Sunday',
    time: '2:00 PM',
    location: '11th Floor, Golden Peak',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/events/baptism.jpg',
    description: `"Therefore, if anyone is in Christ, he is a new creation." — 2 Cor. 5:17`,
    category: 'Retreat',
    isFeatured: false,
    type: GatewayEventType.RETREAT,
    is_event_finished: false
  },
  {
    id: 9,
    slug: 'lc-graduation-batch-may-2026',
    title: `Lifeclass Graduation`,
    date: 'May 17, 2026',
    displayDate: 'May 17',
    day: 'Sunday',
    time: '2:00 PM',
    location: '8th Floor, Golden Peak',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/events/lc-grad.jpg',
    description: 'Witness LC Delegates commencement ceremony',
    category: 'Training',
    isFeatured: false,
    type: GatewayEventType.TRAINING,
    is_event_finished: false
  },
  {
    id: 10,
    slug: 'mens-and-womens-gathering-may-2026',
    title: `Men's and Women's Gathering`,
    date: 'May 30, 2026',
    displayDate: 'May 30',
    day: 'Saturday',
    time: '3:00 PM',
    location: '8th Floor, Golden Peak',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/men_women.jpg',
    description: 'You’re invited to our Men’s and Women’s Gathering. Come and be encouraged, connect, and grow together.',
    category: 'Fellowship',
    isFeatured: false,
    type: GatewayEventType.FELLOWSHIP,
    is_event_finished: false,
    gallery: [
      'https://gtxngthtpisigkys.public.blob.vercel-storage.com/men_women_gathering/women_march_promotional.jpg',
      'https://gtxngthtpisigkys.public.blob.vercel-storage.com/men_women_gathering/men_march_28.png',
      'https://gtxngthtpisigkys.public.blob.vercel-storage.com/men_women_gathering/men.jpg',
      'https://gtxngthtpisigkys.public.blob.vercel-storage.com/men_women_gathering/women.jpg',
      'https://gtxngthtpisigkys.public.blob.vercel-storage.com/men_women_gathering/women_activity.jpg'
    ]
  },
  {
    id: 11,
    slug: 'gateway-axis-may-2026',
    title: 'GATEWAY AXIS',
    date: 'May 31, 2026',
    displayDate: 'May 31',
    day: 'Sunday',
    time: '2:00 PM',
    location: '8th Floor, Golden Peak',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/events/axis.png',
    description: `
You’re warmly invited to join us for an afternoon of faith, purpose, and God-centered love. A Youth & Young Professionals Gathering—together.
Everyone is invited. See you there! 🫶✨`,
    category: 'Fellowship',
    isFeatured: false,
    type: GatewayEventType.FELLOWSHIP,
    is_event_finished: false,
    gallery: [
    ]
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
