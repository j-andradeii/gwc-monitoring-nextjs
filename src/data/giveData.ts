// Scripture data for Why We Give section
export const scriptures = [
  {
    verse: '2 Corinthians 9:7',
    text: 'Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.',
  },
  {
    verse: 'Proverbs 3:9-10',
    text: 'Honor the Lord with your wealth, with the firstfruits of all your crops; then your barns will be filled to overflowing.',
  },
  {
    verse: 'Luke 6:38',
    text: 'Give, and it will be given to you. A good measure, pressed down, shaken together and running over, will be poured into your lap.',
  },
];

// Giving channel interface
export interface GivingChannel {
  id: string;
  name: string;
  accountName: string;
  accountNumber: string;
  icon: string;
  color: string;
  instructions: string[];
  swiftCode?: string;
  qrCode?: string;
}

// Giving channels for Ways to Give
export const givingChannels: GivingChannel[] = [
  {
    id: 'gcash',
    name: 'GCash',
    accountName: 'Gateway Church Cebu',
    accountNumber: '0928-252-4463',
    icon: 'pi pi-mobile',
    color: '#007DFE',
    instructions: [
      'Open your GCash app',
      'Tap "Send Money"',
      'Enter the GCash number above',
      'Enter the amount and add a message (optional)',
      'Confirm and send',
    ],
  },
  {
    id: 'bpi',
    name: 'BPI',
    accountName: 'Anna Marie Baloran',
    accountNumber: '0206007186',
    icon: 'pi pi-building',
    color: '#A6192E',
    qrCode: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/bpi.jpg',
    instructions: [
      'Log in to BPI Online or Mobile App',
      'Select "Transfer"',
      'Choose "Transfer to BPI Account"',
      'Enter the account number above',
      'Enter amount and confirm',
    ],
  },
  {
    id: 'bdo',
    name: 'BDO',
    accountName: 'Anna Marie Baloran/Jimanuel Baloran',
    accountNumber: '002428024627',
    icon: 'pi pi-credit-card',
    color: '#003087',
    qrCode: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/bdo.jpg',
    instructions: [
      'Log in to BDO Online or Mobile App',
      'Select "Send Money"',
      'Choose "Transfer to BDO Account"',
      'Enter the account number above',
      'Enter amount and confirm',
    ],
  },
];

// Gateway Projects giving channel (Gotyme Bank only)
export const gatewayProjectsChannel: GivingChannel = {
  id: 'gotyme',
  name: 'Gotyme Bank',
  accountName: 'Justin Marc Tariman',
  accountNumber: '016765188731',
  swiftCode: 'GOTYPHM2XXX',
  icon: 'pi pi-wallet',
  color: '#00A651',
  qrCode: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/cc5dbe5a-cc42-495c-b17c-c77e7a73686f.jpeg',
  instructions: [
    'Log in to your Gotyme Bank app or any banking app',
    'Select "Transfer" or "Send Money"',
    'Choose "Transfer to Other Banks" if using another bank',
    'Enter the account number above',
    'Use Swift Code for international transfers',
    'Enter amount and confirm',
  ],
};

// Milestone interface
export interface Milestone {
  label: string;
  amount: number;
  completed: boolean;
}

// Gallery image interface
export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  caption: string;
}

// Quick fact interface
export interface QuickFact {
  icon: string;
  value: string;
  label: string;
}

// Vision data interface
export interface VisionData {
  sectionLabel: string;
  heading: string;
  paragraphs: string[];
  pastorName: string;
  pastorRole: string;
  pastorImage: string;
  scripture: {
    verse: string;
    text: string;
  };
}

// Testimonial interface
export interface LeaderTestimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  icon: string;
}

// Section nav link interface
export interface SectionNavLink {
  id: string;
  label: string;
  icon: string;
}

// Gateway Projects data
export const gatewayProjectsData = {
  title: 'Gateway Projects',
  subtitle: 'Ministry Center Improvement Project',
  description:
    'Join us in improving the 8th Floor Golden Peak as our House of Worship. This project will enhance our facilities to better serve our growing congregation and community outreach programs.',
  goalAmount: 1000000,
  currentAmount: 195000,
  milestones: [
    { label: 'Phase 1: Planning & Design', amount: 150000, completed: true },
    { label: 'Phase 2: Airconditioning and Flooring', amount: 400000, completed: false },
    { label: 'Phase 3: Interior and Reception', amount: 300000, completed: false },
    { label: 'Phase 4: Completion', amount: 150000, completed: false },
  ] as Milestone[],
  gallery: [
    {
      id: 1,
      src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/community/1.jpg',
      alt: 'Ministry Center - Main Hall',
      caption: 'Main Worship Hall',
    },
    {
      id: 2,
      src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/community/2.jpg',
      alt: 'Ministry Center - Stage Area',
      caption: 'Stage & Platform',
    },
    {
      id: 3,
      src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/community/3.jpg',
      alt: 'Ministry Center - Congregation',
      caption: 'Congregation Area',
    },
    {
      id: 4,
      src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/community/4.jpg',
      alt: 'Ministry Center - Sound System',
      caption: 'Sound & Media Setup',
    },
    {
      id: 5,
      src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/community/5.jpg',
      alt: 'Ministry Center - Lighting',
      caption: 'Lighting System',
    },
    {
      id: 6,
      src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/community/6.jpg',
      alt: 'Ministry Center - Fellowship Area',
      caption: 'Fellowship Space',
    },
  ] as GalleryImage[],
};

// Gateway Vision data — Pastor's vision narrative
export const gatewayVisionData: VisionData = {
  sectionLabel: 'Our Vision',
  heading: 'Building a House for God\u2019s Glory',
  paragraphs: [
    'Gateway Church has always been a community that believes in the power of gathering together in worship. As our congregation grows, so does the need for a space that reflects the excellence of our God and the warmth of our fellowship.',
    'The Ministry Center Improvement Project at the 8th Floor Golden Peak is more than a renovation -- it is a declaration of faith. We are preparing a place where lives will be transformed, families will be strengthened, and the Gospel will go forth with greater impact.',
    'We invite every member and partner to be part of this legacy. Whether through prayer, giving, or volunteering, your contribution is an investment in eternity. Together, we are building not just walls, but a future for generations to come.',
  ],
  pastorName: 'Pastor Jimanuel Baloran',
  pastorRole: 'Senior Pastor, Gateway Church Cebu',
  pastorImage:
    'https://gtxngthtpisigkys.public.blob.vercel-storage.com/community/1.jpg',
  scripture: {
    verse: 'Haggai 1:8',
    text: '\u201CGo up into the mountains and bring down timber and build my house, so that I may take pleasure in it and be honored,\u201D says the Lord.',
  },
};

// Gateway Quick Facts — project specifications
export const gatewayQuickFacts: QuickFact[] = [
  {
    icon: 'pi pi-users',
    value: '500+',
    label: 'Worship Capacity',
  },
  {
    icon: 'pi pi-building',
    value: '8th Floor',
    label: 'Golden Peak Tower',
  },
  {
    icon: 'pi pi-th-large',
    value: '4 Phases',
    label: 'Project Roadmap',
  },
  {
    icon: 'pi pi-calendar',
    value: '2026',
    label: 'Target Completion',
  },
  {
    icon: 'pi pi-volume-up',
    value: 'Full A/V',
    label: 'Sound & Media System',
  },
  {
    icon: 'pi pi-heart',
    value: 'Multi-Use',
    label: 'Worship, Fellowship & Ministry',
  },
];

// Gateway Testimonials — leader quote cards
export const gatewayTestimonials: LeaderTestimonial[] = [
  {
    id: 1,
    quote:
      'This project is an expression of our faith. We are not just building a facility -- we are preparing a place where heaven meets earth and lives are forever changed.',
    name: 'Pastor Jimanuel Baloran',
    role: 'Senior Pastor',
    icon: 'pi pi-star',
  },
  {
    id: 2,
    quote:
      'Every peso given is a seed planted for future generations. I see a ministry center that will be the heart of outreach in Cebu for decades to come.',
    name: 'Ptr. Anna Marie Baloran',
    role: 'Co-Pastor',
    icon: 'pi pi-heart',
  },
  {
    id: 3,
    quote:
      'Imagine a space where youth are equipped, families are restored, and the community finds hope. That is what we are building together.',
    name: 'Justin Marc Tariman',
    role: 'Project Lead',
    icon: 'pi pi-bolt',
  },
];

// Gateway Section Nav links
export const gatewaySectionNavLinks: SectionNavLink[] = [
  { id: 'gateway-vision', label: 'Vision', icon: 'pi pi-eye' },
  { id: 'gateway-about', label: 'About', icon: 'pi pi-info-circle' },
  { id: 'gateway-facts', label: 'Quick Facts', icon: 'pi pi-list' },
  { id: 'gateway-testimonials', label: 'Testimonials', icon: 'pi pi-comments' },
  { id: 'gateway-progress', label: 'Progress', icon: 'pi pi-chart-bar' },
  { id: 'gateway-give', label: 'Give', icon: 'pi pi-wallet' },
  { id: 'contact', label: 'Contact', icon: 'pi pi-envelope' },
];

// Gateway giving channels — all channels available for Gateway Projects
export const gatewayGivingChannels: GivingChannel[] = [
  {
    ...gatewayProjectsChannel,
    // Gotyme is the primary / featured channel
  },
  {
    id: 'gcash-gateway',
    name: 'GCash',
    accountName: 'Gateway Church Cebu',
    accountNumber: '0928-252-4463',
    icon: 'pi pi-mobile',
    color: '#007DFE',
    instructions: [
      'Open your GCash app',
      'Tap "Send Money"',
      'Enter the GCash number above',
      'Enter the amount and add "Gateway Projects" as message',
      'Confirm and send',
    ],
  },
  {
    id: 'bpi-gateway',
    name: 'BPI',
    accountName: 'Anna Marie Baloran',
    accountNumber: '0206007186',
    icon: 'pi pi-building',
    color: '#A6192E',
    qrCode: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/bpi.jpg',
    instructions: [
      'Log in to BPI Online or Mobile App',
      'Select "Transfer"',
      'Choose "Transfer to BPI Account"',
      'Enter the account number above',
      'Add "Gateway Projects" as reference',
      'Enter amount and confirm',
    ],
  },
  {
    id: 'bdo-gateway',
    name: 'BDO',
    accountName: 'Anna Marie Baloran/Jimanuel Baloran',
    accountNumber: '002428024627',
    icon: 'pi pi-credit-card',
    color: '#003087',
    qrCode: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/bdo.jpg',
    instructions: [
      'Log in to BDO Online or Mobile App',
      'Select "Send Money"',
      'Choose "Transfer to BDO Account"',
      'Enter the account number above',
      'Add "Gateway Projects" as reference',
      'Enter amount and confirm',
    ],
  },
];
