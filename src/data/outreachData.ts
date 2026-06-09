// Outreach data for Gateway Outreach — Disaster Response Ministry

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

// Impact stat interface
export interface OutreachImpactStat {
  icon: string;
  value: string;
  label: string;
  image: string;
}

// -------------------------------------------
// Pastor's Vision for Disaster Response
// -------------------------------------------
export const outreachVisionData: VisionData = {
  sectionLabel: 'Our Calling',
  heading: 'Bringing Hope When Disaster Strikes',
  paragraphs: [
    'When disaster strikes, Gateway Church believes the body of Christ must be the first to respond — not with prayers alone, but with hands and feet. Gateway Outreach was born from one conviction: the Church is God\'s instrument of restoration in times of crisis.',
    'Across Cebu and the Visayas, we\'ve answered that call — mobilizing relief teams, distributing goods, and walking with families on the long road to recovery. This is the Gospel in action, and we invite you to partner with us so we can reach farther, respond faster, and rebuild stronger.',
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
// Disaster Response Initiatives
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
    label: 'Volunteer',
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
// -------------------------------------------
export const outreachGalleryImages: GalleryImage[] = [
  {
    id: 1,
    src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/outreach/10.jpg',
    alt: 'Relief distribution — volunteers packing goods',
    caption: 'Emergency Relief Distribution',
  },
  {
    id: 2,
    src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/outreach/12.jpg',
    alt: 'Disaster recovery team clearing debris',
    caption: 'Disaster Recovery Operations',
  },
  {
    id: 3,
    src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/outreach/13.jpg',
    alt: 'Community preparedness training session',
    caption: 'Community Preparedness Training',
  },
  {
    id: 4,
    src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/outreach/7.jpg',
    alt: 'Feeding program inside evacuation center',
    caption: 'Evacuation Center Support',
  },
  {
    id: 5,
    src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/outreach/6.jpg',
    alt: 'Pastoral care and counseling session',
    caption: 'Post-Disaster Counseling',
  },
  {
    id: 6,
    src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/outreach/8.jpg',
    alt: 'Church volunteers in community prayer',
    caption: 'Prayer and Community Care',
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
