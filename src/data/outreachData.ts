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
    'When calamity visits our communities, Gateway Church believes that the body of Christ must be the first to respond — not just with prayers but with hands and feet. Our Gateway Outreach ministry was born out of a deep conviction that the Church is God\'s instrument of restoration in times of crisis.',
    'Over the years, we have seen how typhoons, floods, and other disasters have devastated families across Cebu and the Visayas. Each time, we hear the same call: go, serve, and bring hope. We have answered that call by building disaster response teams, distributing relief goods, and walking alongside communities in their long road to recovery.',
    'This is not just charity work — it is the Gospel in action. When we serve a family in need, we are demonstrating the love of Christ in the most tangible way. We invite you to partner with us so that together, we can reach farther, respond faster, and rebuild stronger.',
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
      'After Typhoon Odette, we lost almost everything. Gateway Church was one of the first to arrive in our barangay. They brought food, water, and most importantly, hope. The volunteers prayed with us and made us feel that God had not forgotten us.',
    name: 'Maria Santos',
    role: 'Community Resident, Mandaue City',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptr_anne.jpg',
  },
  {
    id: 2,
    quote:
      'The Gateway Outreach team helped us repair our roof and clean our home after the flooding. They worked alongside us for three days without complaint. I have never experienced such selfless love from a church community before.',
    name: 'Roberto Dela Cruz',
    role: 'Beneficiary Family, Consolacion, Cebu',
    image: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/ptr_jim_thumbnail.jpg',
  },
  {
    id: 3,
    quote:
      'As a barangay captain, I have worked with many organizations during disasters, but Gateway Church stands out. Their volunteers are organized, compassionate, and always go beyond what is expected. They are true servants of the community.',
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
