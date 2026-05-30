// Scripture data for Why We Give section
export const scriptures = [
  {
    kicker: 'Cheerful Giving',
    verse: '2 Corinthians 9:7',
    text: 'Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.',
  },
  {
    kicker: 'The Tithe',
    verse: 'Malachi 3:10',
    text: 'Bring the whole tithe into the storehouse, that there may be food in my house. Test me in this, says the Lord Almighty, and see if I will not throw open the floodgates of heaven and pour out so much blessing that there will not be room enough to store it.',
  },
  {
    kicker: 'Generous Measure',
    verse: 'Luke 6:38',
    text: 'Give, and it will be given to you. A good measure, pressed down, shaken together and running over, will be poured into your lap.',
  },
];

// Scripture data for the Firstfruits section
export const firstfruitsScriptures = [
  {
    kicker: 'Honor God First',
    verse: 'Proverbs 3:9-10',
    text: 'Honor the Lord with your wealth, with the firstfruits of all your crops; then your barns will be filled to overflowing, and your vats will brim over with new wine.',
  },
  {
    kicker: 'Bring the Best',
    verse: 'Exodus 23:19',
    text: 'Bring the best of the firstfruits of your soil to the house of the Lord your God.',
  },
  {
    kicker: 'Worshipful Offering',
    verse: 'Deuteronomy 26:10',
    text: 'And now I bring the firstfruits of the soil that you, Lord, have given me. Place the basket before the Lord your God and bow down before him.',
  },
];

// Intro paragraphs for each themed section
export const tithesAndOfferingIntro =
  'Tithes and offerings are an act of worship — returning to God the first ten percent ' +
  'of what He has entrusted to us, plus offerings given as the Spirit leads. Your ' +
  'consistent generosity sustains the day-to-day ministry of Gateway Church: weekly ' +
  'worship, discipleship, outreach, and pastoral care for the church family.';

export const firstfruitsIntro =
  'Firstfruits is the practice of dedicating the first portion of every new increase — ' +
  'a new job, a fresh paycheck cycle, a new business, a year-opening blessing — back ' +
  'to the Lord before anything else is spent. It is a prophetic act that sets the ' +
  'tone for the season ahead and invites God’s favor over everything that follows.';

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
  image: string;
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
  image: string;
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
    'Join us in improving our 8th Floor, Golden Peak Hotel and Suites as our House of Worship. This project will enhance our facilities to better serve our growing congregation and community outreach programs.',
  goalAmount: 1000000,
  currentAmount: 195000,
  milestones: [
    { label: 'Phase 1: Planning & Design', amount: 150000, completed: true },
    { label: 'Phase 2: Interior and Reception', amount: 300000, completed: false },
    { label: 'Phase 3: Airconditioning and Flooring', amount: 400000, completed: false },
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
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
    ' Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur'
  ],
  pastorName: 'Pastor Jimanuel Baloran',
  pastorRole: 'Senior Pastor, Gateway Church Cebu',
  pastorImage:
    'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg',
  scripture: {
    verse: 'Haggai 1:8',
    text: '\u201CGo up into the mountains and bring down timber and build my house, so that I may take pleasure in it and be honored,\u201D says the Lord.',
  },
};

// Gateway Quick Facts — project specifications
export const gatewayQuickFacts: QuickFact[] = [
  {
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/community/1.jpg',
    value: '500+',
    label: 'Worship Capacity',
  },
  {
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/community/2.jpg',
    value: '8th Floor',
    label: 'Golden Peak Hotel & Suites',
  },
  {
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/community/3.jpg',
    value: '4 Phases',
    label: 'Project Roadmap',
  },
  {
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/community/4.jpg',
    value: '2026',
    label: 'Target Completion',
  },
  {
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/community/5.jpg',
    value: 'Full A/V',
    label: 'Sound & Media System',
  },
  {
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/community/6.jpg',
    value: 'Multi-Use',
    label: 'Worship, Fellowship & Ministry',
  },
];

// Gateway Testimonials — leader quote cards
export const gatewayTestimonials: LeaderTestimonial[] = [
  {
    id: 1,
    quote:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    name: 'Pastor Jimanuel Baloran',
    role: 'Senior Pastor',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptr_jim_thumbnail.jpg',
  },
  {
    id: 2,
    quote:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    name: 'Ptr. Anna Marie Baloran',
    role: 'Co-Pastor',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptr_anne.jpg',
  },
  {
    id: 3,
    quote:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    name: 'Justin Marc Tariman',
    role: 'Project Lead',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/just.jpg',
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
