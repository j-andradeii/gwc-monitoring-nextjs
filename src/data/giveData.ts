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
