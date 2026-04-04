export const navigation = [
  {
    label: 'About Us',
    href: '/pages/health-wellness',
    children: [
      { label: 'Who We Are', href: '/pages/health-wellness' },
      { label: 'What We Do', href: '/pages/what-we-do' },
      { label: 'Founder Story', href: '/pages/my-story-%F0%9F%92%99' },
      { label: 'Why It Matters', href: '/pages/join-our-movement' },
    ],
  },
  { label: 'Impact', href: '/pages/global-reach' },
  {
    label: 'Get Involved',
    href: '/pages/join-our-movement',
    children: [
      { label: 'Join The Movement', href: '/pages/join-our-movement' },
      { label: 'Contact Us', href: '/pages/contact' },
      { label: 'Donate', href: '/pages/donation' },
    ],
  },
  {
    label: '🥇 Gold Ambassadors',
    href: '/pages/gold-ambassadors-info',
    children: [
      { label: 'Gold Ambassadors', href: '/pages/gold-ambassadors-info' },
      { label: 'Distinguished Ambassadors', href: '/pages/distinguished-ambassadors' },
    ],
  },
  { label: '🛒 Shop', href: '/pages/shop' },
];

export const heroStats = [
  { value: '42.7M', label: 'Refugees fleeing across borders' },
  { value: '73.5M', label: 'Internally displaced people' },
  { value: '87M', label: 'Children growing up in conflict zones' },
];

export const donationTiers = [
  { value: 25, label: 'Supporter' },
  { value: 50, label: 'Champion' },
  { value: 100, label: 'Hero' },
];

export const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/unitedathletesforpeace/',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@UnitedAthletesForPeace',
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/unitedathletesforpeace/',
  },
];

export const footerColumns = [
  {
    title: 'About Us',
    links: [
      { label: 'Who We Are', href: '/pages/health-wellness' },
      { label: 'What We Do', href: '/pages/what-we-do' },
      { label: 'Founder Story', href: '/pages/my-story-%F0%9F%92%99' },
      { label: 'Why It Matters', href: '/pages/join-our-movement' },
    ],
  },
  {
    title: 'Our Impact',
    links: [{ label: 'Impact', href: '/pages/global-reach' }],
  },
  {
    title: 'Get Involved',
    links: [
      { label: 'Join The Movement', href: '/pages/join-our-movement' },
      { label: 'Contact Us', href: '/pages/contact' },
      { label: 'Donate', href: '/pages/donation' },
    ],
  },
  {
    title: 'Ambassadors',
    links: [
      { label: 'Gold Ambassadors', href: '/pages/gold-ambassadors-info' },
      { label: 'Distinguished Ambassadors', href: '/pages/distinguished-ambassadors' },
    ],
  },
];

export const regions = [
  { id: 'asia', label: 'Asia' },
  { id: 'europe', label: 'Europe' },
  { id: 'africa', label: 'Africa' },
  { id: 'americas', label: 'Americas' },
  { id: 'middle-east', label: 'Middle East' },
];

export const conflictZones = [
  {
    id: 'kashmir',
    name: 'Kashmir',
    coordinates: [34.0837, 74.7973],
    description: 'India-Pakistan territorial dispute and insurgency.',
    region: 'asia',
  },
  {
    id: 'south-china-sea',
    name: 'South China Sea',
    coordinates: [12, 114],
    description: 'Territorial disputes and military tensions.',
    region: 'asia',
  },
  {
    id: 'ukraine',
    name: 'Ukraine',
    coordinates: [48.3794, 31.1656],
    description: 'Full-scale Russian invasion and ongoing war.',
    region: 'europe',
  },
  {
    id: 'nagorno-karabakh',
    name: 'Nagorno-Karabakh',
    coordinates: [39.83, 46.75],
    description: 'Armenia-Azerbaijan territorial conflict.',
    region: 'europe',
  },
  {
    id: 'kosovo',
    name: 'Kosovo',
    coordinates: [42.6026, 20.903],
    description: 'Serbian tensions and ethnic conflicts.',
    region: 'europe',
  },
  {
    id: 'cyprus',
    name: 'Cyprus',
    coordinates: [35.1264, 33.4299],
    description: 'Division and long-standing geopolitical tensions.',
    region: 'europe',
  },
  {
    id: 'ethiopia-tigray',
    name: 'Ethiopia (Tigray)',
    coordinates: [14.1612, 38.8958],
    description: 'Tigray conflict and ethnic tensions.',
    region: 'africa',
  },
  {
    id: 'sudan',
    name: 'Sudan',
    coordinates: [12.8628, 30.2176],
    description: 'Civil war between SAF and RSF.',
    region: 'africa',
  },
  {
    id: 'somalia',
    name: 'Somalia',
    coordinates: [5.1521, 46.1996],
    description: 'Al-Shabaab insurgency and clan conflict.',
    region: 'africa',
  },
  {
    id: 'western-sahara',
    name: 'Western Sahara',
    coordinates: [24.2155, -12.8858],
    description: 'Moroccan occupation and Polisario resistance.',
    region: 'africa',
  },
  {
    id: 'mexico',
    name: 'Mexico (Drug War)',
    coordinates: [23.6345, -102.5528],
    description: 'Cartel violence and state operations.',
    region: 'americas',
  },
  {
    id: 'colombia',
    name: 'Colombia (ELN)',
    coordinates: [4.5709, -74.2973],
    description: 'ELN guerrilla insurgency.',
    region: 'americas',
  },
  {
    id: 'haiti',
    name: 'Haiti',
    coordinates: [18.9712, -72.2852],
    description: 'Gang violence and political instability.',
    region: 'americas',
  },
  {
    id: 'venezuela',
    name: 'Venezuela',
    coordinates: [6.4238, -66.5897],
    description: 'Political crisis and economic collapse.',
    region: 'americas',
  },
  {
    id: 'gaza',
    name: 'Gaza Strip',
    coordinates: [31.3547, 34.3088],
    description: 'Israeli-Palestinian conflict and blockade.',
    region: 'middle-east',
  },
  {
    id: 'west-bank',
    name: 'West Bank',
    coordinates: [31.9522, 35.2332],
    description: 'Occupation and Palestinian resistance.',
    region: 'middle-east',
  },
  {
    id: 'syria',
    name: 'Syria',
    coordinates: [34.8021, 38.9968],
    description: 'Civil war, ISIS remnants, and foreign intervention.',
    region: 'middle-east',
  },
  {
    id: 'yemen',
    name: 'Yemen',
    coordinates: [15.5527, 48.5164],
    description: 'Civil war and humanitarian crisis.',
    region: 'middle-east',
  },
  {
    id: 'iran',
    name: 'Iran',
    coordinates: [32.4279, 53.688],
    description: 'Ongoing tensions, civil protests, and regional instability.',
    region: 'middle-east',
  },
];
