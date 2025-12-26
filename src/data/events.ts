/**
 * Events Data
 *
 * Shared events data used across the application
 */

export interface Event {
  id: string;
  title: string;
  date: string;
  day: string;
  time: string;
  location: string;
  image: string;
  description?: string;
  category?: string;
  isFeatured?: boolean;
}

export const events: Event[] = [
  {
    id: '1',
    title: 'Marketplace Gathering',
    date: 'Dec 18',
    day: 'Wednesday',
    time: '7:00 PM',
    location: 'Main Hall',
    image: '/assets/images/community.jpg',
    description: 'Join us for a special gathering where professionals and entrepreneurs come together for fellowship, networking, and inspiration.',
    category: 'Fellowship',
  },
  {
    id: '2',
    title: 'Youth Night',
    date: 'Dec 22',
    day: 'Sunday',
    time: '6:00 PM',
    location: 'Youth Center',
    image: '/assets/images/community.jpg',
    description: 'An exciting night for our youth with games, worship, and a powerful message. Bring your friends!',
    category: 'Youth',
  },
  {
    id: '3',
    title: 'Christmas Eve Service',
    date: 'Dec 24',
    day: 'Tuesday',
    time: '6:00 PM',
    location: '8th Floor, Golden Peak',
    image: '/assets/images/community.jpg',
    description: 'Celebrate the birth of our Savior with a beautiful candlelight service featuring worship, carols, and a special message of hope.',
    category: 'Worship',
    isFeatured: false,
  },
  {
    id: '4',
    title: 'Christmas Day Celebration',
    date: 'Dec 25',
    day: 'Wednesday',
    time: '9:30 AM',
    location: '8th Floor, Golden Peak',
    image: '/assets/images/community.jpg',
    description: 'Join us on Christmas morning as we celebrate together with joyful worship and fellowship.',
    category: 'Worship',
  },
  {
    id: '5',
    title: 'New Year Prayer & Worship',
    date: 'Dec 31',
    day: 'Tuesday',
    time: '10:00 PM',
    location: '8th Floor, Golden Peak',
    image: '/assets/images/community.jpg',
    description: 'End the year in God\'s presence! Join us for a powerful night of prayer, worship, and thanksgiving as we usher in the New Year together.',
    category: 'Prayer',
    isFeatured: false,
  },
];

export const getEventById = (id: string): Event | undefined => {
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
