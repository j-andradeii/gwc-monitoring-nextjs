// Outreach data for Gateway Outreach — Community Outreach Ministry
//
// FOCUS: the ministry's everyday work is community outreach (goods, feeding,
// home visitation, children, prayer, barangay partnerships) — see
// `outreachPrograms`. The readiness to respond when disaster strikes is carried
// in the page copy (hero, vision, give, drop-off), not in a section of its own.

import type { VisionData, LeaderTestimonial, GalleryImage } from '@/data/giveData';

// Re-export types for use by outreach components
export type { VisionData, LeaderTestimonial, GalleryImage };

// Outreach Initiative interface
export interface OutreachInitiative {
  id: number;
  title: string;
  description: string;
  icon: string;
  image: string;
}

// Ongoing community outreach program (icon-only card — no photo dependency)
export interface OutreachProgram {
  id: number;
  title: string;
  description: string;
  icon: string;
}

// Impact stat interface
export interface OutreachImpactStat {
  icon: string;
  value: string;
  label: string;
  image: string;
}

// -------------------------------------------
// Pastor's Vision — community outreach first,
// with disaster response as the closing beat
// -------------------------------------------
export const outreachVisionData: VisionData = {
  sectionLabel: 'Our Calling',
  heading: 'Loving Our City, One Community at a Time',
  paragraphs: [
    'Gateway Outreach exists to carry the love of Christ past our church doors and into the streets, barangays, and homes around us. Our volunteers bring rice and clean water to families who are barely getting by, share meals with children, sit with the elderly, and pray with neighbors carrying more than anyone can see.',
    'This is ordinary, steady work — a van loaded at night, a table set up along the roadside, a home visited because someone could not come out to meet us. We keep returning to the same communities, because relationships, not one-time events, are what actually change a neighborhood.',
    'And when disaster strikes those same communities, we are already there. The teams, partnerships, and trust built week after week are exactly what let us move quickly when a typhoon, flood, fire, or earthquake turns a neighborhood upside down.',
  ],
  pastorName: 'Pastor Jimanuel Baloran',
  pastorRole: 'Senior Pastor, Gateway Church Cebu',
  pastorImage:
    'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptrjim_compressed.jpg',
  scripture: {
    verse: 'Isaiah 58:7',
    text: '"Share your food with the hungry, and give shelter to the homeless. Give clothes to those who need them, and do not hide from relatives who need your help."',
  },
};

// -------------------------------------------
// Ongoing Community Outreach Programs
// (the page's primary focus — what we do week to week)
// -------------------------------------------
export const outreachPrograms: OutreachProgram[] = [
  {
    id: 1,
    title: 'Relief Goods Distribution',
    description:
      'Rice, canned goods, clean drinking water, clothing, and household essentials brought directly to families in the communities we serve.',
    icon: 'pi pi-box',
  },
  {
    id: 2,
    title: 'Feeding & Refreshment',
    description:
      'Meals and drinks for children and families on outreach days — often the reason a whole neighborhood comes out to meet us.',
    icon: 'pi pi-shopping-bag',
  },
  {
    id: 3,
    title: 'Home & Family Visitation',
    description:
      'Volunteers go house to house to pray with families, check on the elderly, and hand-carry food packs to those who cannot come out.',
    icon: 'pi pi-home',
  },
  {
    id: 4,
    title: 'Children & Youth Outreach',
    description:
      'Games, lessons, and small gifts that give the kids in a community something to look forward to — and a church that knows their names.',
    icon: 'pi pi-star',
  },
  {
    id: 5,
    title: 'Prayer & Pastoral Care',
    description:
      'Our team listens, prays, and walks with neighbors carrying grief, illness, or hardship, long after the goods have been handed out.',
    icon: 'pi pi-heart-fill',
  },
  {
    id: 6,
    title: 'Barangay Partnerships',
    description:
      'We coordinate with barangay officials and local leaders so that help reaches the households who genuinely need it most.',
    icon: 'pi pi-users',
  },
];

// -------------------------------------------
// Disaster Response Initiatives
// NOTE: legacy data for <OutreachInitiativesSection />, which is not rendered
// on the page. Images 1, 2, 4 and 5 are no longer present in blob storage —
// remap them before re-enabling that section.
// -------------------------------------------
export const outreachInitiatives: OutreachInitiative[] = [
  {
    id: 1,
    title: 'Emergency Relief Distribution',
    description:
      
      'When disaster strikes, our teams mobilize within 24 hours to distribute food packs, clean water, hygiene kits, and essential supplies to affected families. We partner with local barangay officials to ensure aid reaches the most vulnerable.',
    icon: 'pi pi-box',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/outreach/1.jpg',
  },
  {
    id: 2,
    title: 'Disaster Recovery Teams',
    description:
      'Our trained volunteer teams assist communities in debris clearing, home repair, and rebuilding damaged structures. We believe in restoring dignity alongside physical structures, ensuring families can return home as quickly as possible.',
    icon: 'pi pi-wrench',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/outreach/2.jpg',
  },
  {
    id: 3,
    title: 'Community Preparedness Training',
    description:
      'Prevention is as important as response. We conduct disaster preparedness seminars, first-aid training, and evacuation drills in partner communities, equipping residents with the knowledge and skills to protect themselves before disasters occur.',
    icon: 'pi pi-shield',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/outreach/3.jpg',
  },
  {
    id: 4,
    title: 'Evacuation Center Support',
    description:
      'During active disaster situations, we set up feeding programs, children\'s activities, and prayer centers inside evacuation areas. Our presence brings comfort and calm in the midst of chaos, reminding evacuees that they are not alone.',
    icon: 'pi pi-home',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/outreach/4.jpg',
  },
  {
    id: 5,
    title: 'Post-Disaster Counseling and Care',
    description:
      'Recovery extends beyond the physical. Our trained pastoral care volunteers offer trauma counseling, prayer, and emotional support for individuals and families dealing with loss, grief, and the mental toll of disaster. Healing the whole person is central to our mission.',
    icon: 'pi pi-heart',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/outreach/5.jpg',
  },
];

// -------------------------------------------
// Impact Statistics
// -------------------------------------------
export const outreachImpactStats: OutreachImpactStat[] = [
  {
    icon: 'pi pi-users',
    value: '50+',
    label: 'Families Served',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/outreach/7.jpg',
  },
  {
    icon: 'pi pi-map-marker',
    value: '2+',
    label: 'Relief Operations',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/outreach/13.jpg',
  },
  {
    icon: 'pi pi-clock',
    value: '20',
    label: 'Volunteers',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/outreach/8.jpg',
  },
  {
    icon: 'pi pi-globe',
    value: '8+',
    label: 'Communities Reached',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/outreach/10.jpg',
  },
];

// -------------------------------------------
// Community Testimonials
// -------------------------------------------
export const outreachTestimonials: LeaderTestimonial[] = [
  {
    id: 1,
    quote:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    name: 'Maria Santos',
    role: 'Community Resident, Mandaue City',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptr_anne.jpg',
  },
  {
    id: 2,
    quote:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    name: 'Roberto Dela Cruz',
    role: 'Beneficiary Family, Consolacion, Cebu',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptr_jim_thumbnail.jpg',
  },
  {
    id: 3,
    quote:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    name: 'Capt. Lorna Villanueva',
    role: 'Barangay Captain, Liloan, Cebu',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/just.jpg',
  },
];

// -------------------------------------------
// Gallery Images
// Captions and alt text describe what is actually in each photo.
// -------------------------------------------
export const outreachGalleryImages: GalleryImage[] = [
  {
    id: 1,
    src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/outreach/7.jpg',
    alt: 'Outreach team and community families gathered behind sacks of rice, water containers, and bags of goods',
    caption: 'Goods Ready for the Families We Serve',
  },
  {
    id: 2,
    src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/outreach/12.jpg',
    alt: 'Neighbors gathering along a roadside for a community outreach distribution',
    caption: 'Meeting Families Where They Are',
  },
  {
    id: 3,
    src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/outreach/13.jpg',
    alt: 'Volunteers setting out drinks on a table at a community outreach stop',
    caption: 'Feeding and Refreshment',
  },
  {
    id: 4,
    src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/outreach/6.jpg',
    alt: 'An elderly woman at home with bags of rice delivered by the outreach team',
    caption: 'Home and Family Visitation',
  },
  {
    id: 5,
    src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/outreach/8.jpg',
    alt: 'Volunteers packing bags of relief goods on the floor the night before an outreach',
    caption: 'Packing Night',
  },
  {
    id: 6,
    src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/outreach/3.jpg',
    alt: 'Volunteers loading bags of goods into a vehicle after dark',
    caption: 'Loading Up to Roll Out',
  },
];

// -------------------------------------------
// Relief Fund — Fundraising Goal + Items
// -------------------------------------------
export interface OutreachReliefItem {
  icon: string;        // PrimeIcons class
  label: string;
  unitCost: number;    // PHP
  description: string;
}

export const outreachReliefFund = {
  label: 'Relief Fund',
  heading: 'Fuel the Next Relief Operation',
  description:
    'When the next storm hits, we need to move fast. Your gift to the Gateway Outreach relief fund lets our teams pre-position food, water, and emergency supplies so help arrives within hours — not days.',
  goalCaption: 'to fund the next wave of relief operations across Cebu and the Visayas',
  goalAmount: 300000,
  currentAmount: 96000,
  targetFamilies: 400,
  targetFamiliesCaption: 'families targeted for immediate food relief',
};

export const outreachReliefItems: OutreachReliefItem[] = [
  { icon: 'pi pi-shopping-bag', label: 'Family Food Pack', unitCost: 750, description: 'Rice, canned goods, and dry staples to feed one family for a week.' },
  { icon: 'pi pi-heart-fill', label: 'Hygiene Kit', unitCost: 350, description: 'Soap, toothbrush, towels, and sanitary essentials for a household.' },
  { icon: 'pi pi-inbox', label: 'Clean Water (10L)', unitCost: 120, description: 'Safe drinking water for families cut off after a disaster.' },
  { icon: 'pi pi-home', label: 'Emergency Shelter Tarp', unitCost: 800, description: 'Heavy-duty tarpaulin to shelter a family who lost their roof.' },
  { icon: 'pi pi-box', label: 'Blanket & Sleeping Mat', unitCost: 600, description: 'Warmth and rest for those sheltering in evacuation centers.' },
  { icon: 'pi pi-shield', label: 'First-Aid & Medicine Kit', unitCost: 450, description: 'Basic medical supplies to treat minor injuries on the ground.' },
];
