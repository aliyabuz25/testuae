'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import AOS from 'aos';
import { ClipLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  conflictZones,
  donationTiers,
  footerColumns,
  navigation,
  regions,
  socialLinks,
} from './siteData';

const HERO_VIDEO =
  'https://www.youtube.com/embed/R9_gAW_sZn0?autoplay=1&mute=1&controls=0&loop=1&playlist=R9_gAW_sZn0&playsinline=1&rel=0&enablejsapi=1&modestbranding=1';

const conflictQuotes = [
  {
    text: 'International cooperation is one of the most powerful tools we have at our disposal for significant change. The fact is that no country, no matter how strong, can solve the intricate and cross-border problems of today by itself. No person or community is left behind thanks to enduring freedom and competent governance.',
    source: 'UN Press Conference, September 2024',
  },
  {
    text: 'People who are forcibly displaced include refugees who are fleeing their nations (42.7 million people) and those who are displaced by conflict within their own country, which increased dramatically by 6.3 million to 73.5 million by the end of 2024.',
    source: 'USA for Refugee Agency',
  },
  {
    text: 'More than 60 million individuals have had to leave their homes in quest of a better life due to wars and conflicts over the last ten years. A startling 87 million children under the age of seven have lived in conflict areas their whole lives, endangering the development of their brains.',
    source: 'UNICEF Global Report',
  },
];

const impactNarrative = [
  'Our impact is fueled by the courage, conviction, and commitment of athletes who, in the face of violent conflict, keep defining what peace means in practical human terms.',
  'Each training session, each story shared, and every visible act of resilience expands a larger movement. These athletes step forward not only to compete, but to defend the possibility of a more peaceful future.',
  'Their example travels beyond the field of play. It reaches communities, institutions, and younger generations that need a language of hope they can recognize and trust.',
  'The result is not only measured in sporting outcomes, but in the legacy of dignity, visibility, and peace carried forward.',
];

const impactPrograms = [
  {
    image:
      'https://unitedathletesforpeace.org/cdn/shop/files/Screenshot_2026-01-03_at_10.37.57_180x180.png?v=1767425910',
    text: 'Build connections across cultures and borders.',
  },
  {
    image:
      'https://unitedathletesforpeace.org/cdn/shop/files/a9553ce7ae794f67b5602132d6648403Rowing_Representation__29618_b23ae2a9-a518-412d-a8a7-dfb04b013ecf_180x180.jpg?v=1767425737',
    text: 'Empower para and multi-abled bodies to be visible and valued.',
  },
  {
    image:
      'https://unitedathletesforpeace.org/cdn/shop/files/steptodown.com512898_180x180.jpg?v=1765126065',
    text: 'Inspire young people to dream beyond war and conflict.',
  },
  {
    image:
      'https://unitedathletesforpeace.org/cdn/shop/files/WhatsApp_Image_2025-09-19_at_23.13.46_180x180.jpg?v=1758369428',
    text: 'Champion for global peace through sustained, credible representation.',
  },
];

const donationCampaign = {
  goal: 50000,
  raised: 32500,
};

const DONATION_TOAST_ICON =
  'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Money%20Bag.png';

function DonationToastContent({ title, body }) {
  return (
    <div className="site-toastify-card">
      <div className="site-toastify-card__icon-shell" aria-hidden="true">
        <img className="site-toastify-card__icon" src={DONATION_TOAST_ICON} alt="" />
      </div>
      <div className="site-toastify-card__copy">
        <strong>{title}</strong>
        <span>{body}</span>
      </div>
    </div>
  );
}

const fallbackTickerItems = [
  'Daily Crisis • Sudan conflict displacement update',
  'Daily Crisis • Gaza humanitarian access constraints',
  'Monthly Brief • Ukraine humanitarian situation overview',
  'Monthly Brief • Afghanistan response planning update',
];
const fallbackInstagramPosts = [
  {
    caption: 'Coming together to make sport accessible for all children and inspire them to reach their dreams.',
    imageUrl: '/api/instagram-image?src=https%3A%2F%2Finstagram.fist4-1.fna.fbcdn.net%2Fv%2Ft51.82787-15%2F551075701_17847589302563297_8035186261338182065_n.jpg%3Fstp%3Ddst-jpg_e35_s640x640_sh0.08_tt6%26_nc_cat%3D103%26ig_cache_key%3DMzcyNDU0NTEwNDQzOTc3MDgwMg%253D%253D.3-ccb7-5%26ccb%3D7-5%26_nc_sid%3D58cdad%26efg%3DeyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjg5NXg4OTUuc2RyLkMzIn0%253D%26_nc_ohc%3DquYQCxr32PMQ7kNvwEERdK8%26_nc_oc%3DAdoM5rd_wITtANi2_LAA32re9n5mIWg4WKfE_EXSEypgBZRxtKH9iEaPPkSMp8pRelY%26_nc_ad%3Dz-m%26_nc_cid%3D0%26_nc_zt%3D23%26_nc_ht%3Dinstagram.fist4-1.fna%26_nc_gid%3DVTkjHM-l9UAbysSsinAFsg%26_nc_ss%3D7a32e%26oh%3D00_Af33X08ErVAJdQixy8i5PA-o7gtOeYNefhCSrjFFMvdlRg%26oe%3D69D54EF3',
    url: 'https://www.instagram.com/p/DOwPgn8DX6y/',
  },
  {
    caption: 'Every stroke builds strength, discipline, and solidarity.',
    imageUrl: '/api/instagram-image?src=https%3A%2F%2Finstagram.fist4-1.fna.fbcdn.net%2Fv%2Ft51.82787-15%2F550257587_17847587547563297_1288578385354600333_n.jpg%3Fstp%3Dc0.166.1347.1347a_dst-jpg_e35_s1080x1080_sh0.08_tt6%26_nc_ht%3Dinstagram.fist4-1.fna.fbcdn.net%26_nc_cat%3D105%26_nc_oc%3DQ6cZ2gGMFWolnyYXIIqdCQpHH23HL2yJIXobd53cQ65gBMinrXN8lAvBx6wyfPuwnHMqYGQ%26_nc_ohc%3DmdEqHlFNZL0Q7kNvwEqKpyF%26_nc_gid%3DVTkjHM-l9UAbysSsinAFsg%26edm%3DACWDqb8BAAAA%26ccb%3D7-5%26oh%3D00_Af06t18ZlWlFtx0E0szpusZia4M0lfDP7GaikVCKg5joBw%26oe%3D69D54B12%26_nc_sid%3Dee9879',
    url: 'https://www.instagram.com/p/DOwOUeVDZpm/',
  },
  {
    caption: 'They have no flag. No national anthem. But when they step onto the Olympic stage, they carry something even stronger.',
    imageUrl: '/api/instagram-image?src=https%3A%2F%2Finstagram.fist4-1.fna.fbcdn.net%2Fv%2Ft51.82787-15%2F550445178_17847587703563297_8593129906486537265_n.jpg%3Fstp%3Dc0.166.1347.1347a_dst-jpg_e35_s1080x1080_sh0.08_tt6%26_nc_ht%3Dinstagram.fist4-1.fna.fbcdn.net%26_nc_cat%3D105%26_nc_oc%3DQ6cZ2gGyuQqc7Pc0bJ-8oTNyl08cKwF9RTwX09OjOmRcUg2KTNYDpt8MA_Ka3YdQI5RJLgY%26_nc_ohc%3DJ5IKgoGWH1QQ7kNvwF1OB6N%26_nc_gid%3DHCRbUhw5snzrRzyuocNxsQ%26edm%3DACWDqb8BAAAA%26ccb%3D7-5%26oh%3D00_Af16qkQEoo8yzya33rY19Ghm__1NnJ1AO4UPsXRJsQsONA%26oe%3D69D537F8%26_nc_sid%3Dee9879',
    url: 'https://www.instagram.com/p/DOwOdRdjStb/',
  },
];

const pageAliases = {
  '/pages/join-movement': '/pages/join-our-movement',
  '/pages/donate': '/pages/donation',
  '/pages/founder-story': '/pages/my-story-%F0%9F%92%99',
};

const founderHighlights = ['Tristan Delacroix', 'United Athletes for Peace', 'Peace Ambassadors'];
const commonPageHighlights = ['United Athletes for Peace', 'Athletes for Peace', 'Peace Ambassadors'];

const countryOptions = ['United States', 'United Kingdom', 'Canada', 'Germany', 'France', 'Italy', 'Spain', 'Turkey', 'Romania', 'Ukraine', 'Other'];
const ageOptions = ['Under 18', '18-24', '25-34', '35-44', '45-54', '55+'];
const athleteLevelOptions = ['Youth', 'Amateur', 'Semi-Professional', 'Professional', 'National Team', 'Other'];
const coachLevelOptions = ['Youth', 'School', 'Club', 'University', 'Professional', 'National Team', 'Other'];
const availabilityOptions = ['1-2 hours / week', '3-5 hours / week', '6-10 hours / week', '10+ hours / week', 'Flexible'];
const achievement3dIcons = {
  bronze: {
    alt: '3D medal icon',
    className: 'achievement-icon-image achievement-icon-image--bronze',
    src: 'https://bvconuycpdvgzbvbkijl.supabase.co/storage/v1/object/public/sizes/39121b-medal/front/400/color.webp',
  },
  gold: {
    alt: '3D medal icon',
    className: 'achievement-icon-image achievement-icon-image--gold',
    src: 'https://bvconuycpdvgzbvbkijl.supabase.co/storage/v1/object/public/sizes/39121b-medal/front/400/color.webp',
  },
  silver: {
    alt: '3D medal icon',
    className: 'achievement-icon-image achievement-icon-image--silver',
    src: 'https://bvconuycpdvgzbvbkijl.supabase.co/storage/v1/object/public/sizes/39121b-medal/front/400/color.webp',
  },
  star: {
    alt: '3D star icon',
    className: 'achievement-icon-image achievement-icon-image--star',
    src: 'https://bvconuycpdvgzbvbkijl.supabase.co/storage/v1/object/public/sizes/17125d-star/front/400/color.webp',
  },
  trophy: {
    alt: '3D trophy icon',
    className: 'achievement-icon-image achievement-icon-image--trophy',
    src: 'https://bvconuycpdvgzbvbkijl.supabase.co/storage/v1/object/public/sizes/49654f-trophy/front/400/color.webp',
  },
};
const ambassadorsPerPage = 30;
const highPriorityCodes = ['us', 'gb', 'ca', 'au', 'nz'];
const mediumPriorityCodes = ['de', 'fr', 'it', 'es', 'nl', 'ch', 'se', 'no', 'dk', 'fi', 'be', 'at', 'jp', 'kr', 'ie', 'sg'];
const countryNameToCode = {
  Afghanistan: 'af',
  Albania: 'al',
  Algeria: 'dz',
  Andorra: 'ad',
  Angola: 'ao',
  Argentina: 'ar',
  Armenia: 'am',
  Australia: 'au',
  Austria: 'at',
  Azerbaijan: 'az',
  Bahamas: 'bs',
  Bahrain: 'bh',
  Bangladesh: 'bd',
  Barbados: 'bb',
  Belarus: 'by',
  Belgium: 'be',
  Belize: 'bz',
  Benin: 'bj',
  Bhutan: 'bt',
  Bolivia: 'bo',
  'Bosnia and Herzegovina': 'ba',
  Botswana: 'bw',
  Brazil: 'br',
  Brunei: 'bn',
  Bulgaria: 'bg',
  'Burkina Faso': 'bf',
  Burundi: 'bi',
  Cambodia: 'kh',
  Cameroon: 'cm',
  Canada: 'ca',
  Chad: 'td',
  Chile: 'cl',
  China: 'cn',
  Colombia: 'co',
  Comoros: 'km',
  Croatia: 'hr',
  Cuba: 'cu',
  Cyprus: 'cy',
  'Czech Republic': 'cz',
  Denmark: 'dk',
  Djibouti: 'dj',
  Dominica: 'dm',
  Ecuador: 'ec',
  Egypt: 'eg',
  Eritrea: 'er',
  Estonia: 'ee',
  Eswatini: 'sz',
  Ethiopia: 'et',
  Fiji: 'fj',
  Finland: 'fi',
  France: 'fr',
  Gabon: 'ga',
  Gambia: 'gm',
  Georgia: 'ge',
  Germany: 'de',
  Ghana: 'gh',
  Greece: 'gr',
  Grenada: 'gd',
  Guatemala: 'gt',
  Guinea: 'gn',
  Guyana: 'gy',
  Haiti: 'ht',
  Honduras: 'hn',
  Hungary: 'hu',
  Iceland: 'is',
  India: 'in',
  Indonesia: 'id',
  Iran: 'ir',
  Iraq: 'iq',
  Ireland: 'ie',
  Israel: 'il',
  Italy: 'it',
  Jamaica: 'jm',
  Japan: 'jp',
  Jordan: 'jo',
  Kazakhstan: 'kz',
  Kenya: 'ke',
  Kosovo: 'xk',
  Kuwait: 'kw',
  Kyrgyzstan: 'kg',
  Laos: 'la',
  Latvia: 'lv',
  Lebanon: 'lb',
  Liberia: 'lr',
  Libya: 'ly',
  Liechtenstein: 'li',
  Lithuania: 'lt',
  Luxembourg: 'lu',
  Madagascar: 'mg',
  Malawi: 'mw',
  Malaysia: 'my',
  Maldives: 'mv',
  Mali: 'ml',
  Malta: 'mt',
  Mauritania: 'mr',
  Mauritius: 'mu',
  Mexico: 'mx',
  Moldova: 'md',
  Monaco: 'mc',
  Mongolia: 'mn',
  Montenegro: 'me',
  Morocco: 'ma',
  Mozambique: 'mz',
  Myanmar: 'mm',
  Namibia: 'na',
  Nepal: 'np',
  Netherlands: 'nl',
  'New Zealand': 'nz',
  Nicaragua: 'ni',
  Niger: 'ne',
  Nigeria: 'ng',
  'North Macedonia': 'mk',
  Norway: 'no',
  Oman: 'om',
  Pakistan: 'pk',
  Palestine: 'ps',
  Panama: 'pa',
  Paraguay: 'py',
  Peru: 'pe',
  Philippines: 'ph',
  Poland: 'pl',
  Portugal: 'pt',
  Qatar: 'qa',
  Romania: 'ro',
  Russia: 'ru',
  Rwanda: 'rw',
  Samoa: 'ws',
  'Saudi Arabia': 'sa',
  Senegal: 'sn',
  Serbia: 'rs',
  Seychelles: 'sc',
  Singapore: 'sg',
  Slovakia: 'sk',
  Slovenia: 'si',
  Somalia: 'so',
  'South Africa': 'za',
  'South Sudan': 'ss',
  Spain: 'es',
  'Sri Lanka': 'lk',
  Sudan: 'sd',
  Suriname: 'sr',
  Sweden: 'se',
  Switzerland: 'ch',
  Syria: 'sy',
  Taiwan: 'tw',
  Tajikistan: 'tj',
  Tanzania: 'tz',
  Thailand: 'th',
  Togo: 'tg',
  Tonga: 'to',
  Tunisia: 'tn',
  Turkey: 'tr',
  Turkmenistan: 'tm',
  Uganda: 'ug',
  Ukraine: 'ua',
  'United Arab Emirates': 'ae',
  'United Kingdom': 'gb',
  'United States': 'us',
  Uruguay: 'uy',
  Uzbekistan: 'uz',
  Vanuatu: 'vu',
  Venezuela: 've',
  Vietnam: 'vn',
  Yemen: 'ye',
  Zambia: 'zm',
  Zimbabwe: 'zw',
};
const manualPersonMapping = {
  'Gabriel Vodă': 'ro',
  'Mariia Prodan': 'ua',
  'Cristian Malis': 'ro',
  'Anthony Jenkins': 'us',
  'Jarek Szymczyk': 'pl',
  'Alexandru Gheorghe': 'ro',
  'Dorin Alupei': 'ro',
};
const specialAchievements = {
  'Cristian Malis': 'Director Olympic National Team U19',
  'Gabriel Voda': 'Romanian National Coach',
  'Gabriel Vodă': 'Romanian National Coach',
  'Mariia Prodan': '1st US NATS U17’24',
  'Maria Prodan': '1st US NATS U17’24',
  'Denisa Vasilica': '1st WRCH ERCH U19',
  'Cosmin Mateus': '1st WRCH U19 ’23',
  'Mateus Cozminciuc': '1st WRCH U19 ’23',
  'Sava Danci': '1st ERCH U19',
  'Sava Elena Danci': '1st ERCH U19',
  'Daniel Chitic': '1st ERCH U19',
  'Robert Muraru': '1st ERCH',
  'Andrea Paduret': '2nd ERCH',
  'Andreea Paduret': '2nd ERCH',
  'Bita Sonia': '2nd ERCH U19',
  'Elena Legacy': '1st RO NAT U19',
  'Baciu Elena-Denisa': '1st RO NAT U19',
  'Ursaciuc Madalina': '1st RO NAT U19',
  'Bionca Nitu': '2nd RO NAT',
  'Bianca Nitu': '2nd RO NAT',
  'Rosemarie Benciu': '1st ERCH U17 & U20, 2nd ERCH U17, 5th ERCH U17, 5x NAT Champion',
  'Jarek Szymczyk': 'Coach Mentor',
  'Jaroslaw Szymczyk': 'Coach Mentor',
  'Alexandru Gheorghe': 'Multiple times National MVP, National Team World Championships',
  'Dorin Alupei': 'Led Romanian National Rowing Team to Olympic, World & European Medals, Guided crews to Olympic Gold, Built High-Performance System',
};
const manualAmbassadorEntries = [
  {
    country: 'Romania',
    name: 'Alexandru Gheorghe',
    role: 'Multiple times National MVP, National Team World Championships',
    sport: 'Waterpolo',
  },
  {
    country: 'Romania',
    name: 'Dorin Alupei',
    role: 'Head Coach',
    sport: 'Rowing',
  },
  {
    country: 'Poland',
    name: 'Jarek Szymczyk',
    role: 'Olympic Coach',
    sport: 'Rowing',
  },
];

const volunteerFormConfigs = {
  'Athlete Volunteer': {
    title: 'Athlete Volunteer Application',
    fields: [
      { name: 'firstName', label: 'First Name *', type: 'text', required: true },
      { name: 'lastName', label: 'Last Name *', type: 'text', required: true },
      { name: 'email', label: 'Email *', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'tel' },
      { name: 'country', label: 'Country *', type: 'select', required: true, options: countryOptions },
      { name: 'age', label: 'Age', type: 'select', options: ageOptions },
      { name: 'sport', label: 'Sport *', type: 'text', required: true },
      { name: 'club', label: 'Current Club / Team', type: 'text' },
      { name: 'level', label: 'Level', type: 'select', options: athleteLevelOptions },
      { name: 'experienceYears', label: 'Years of Experience', type: 'number' },
      { name: 'achievements', label: 'Key Achievements', type: 'textarea' },
      { name: 'motivation', label: 'Motivation to Join', type: 'textarea' },
      { name: 'availability', label: 'Availability (Weekly)', type: 'select', options: availabilityOptions },
      { name: 'notes', label: 'Additional Notes', type: 'textarea' },
    ],
  },
  'Coach Mentor': {
    title: 'Mentor Coach Application',
    fields: [
      { name: 'firstName', label: 'First Name *', type: 'text', required: true },
      { name: 'lastName', label: 'Last Name *', type: 'text', required: true },
      { name: 'email', label: 'Email *', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'tel' },
      { name: 'country', label: 'Country *', type: 'select', required: true, options: countryOptions },
      { name: 'age', label: 'Age', type: 'select', options: ageOptions },
      { name: 'discipline', label: 'Coaching Sport / Discipline *', type: 'text', required: true },
      { name: 'organization', label: 'Club / Organization you Coach', type: 'text' },
      { name: 'level', label: 'What level sport you coach', type: 'select', options: coachLevelOptions },
      { name: 'experienceYears', label: 'Coaching Experience (Years)', type: 'number' },
      { name: 'achievements', label: 'Coaching Achievements', type: 'textarea' },
      { name: 'motivation', label: 'Motivation to Join', type: 'textarea' },
      { name: 'availability', label: 'Availability (Weekly)', type: 'select', options: availabilityOptions },
      { name: 'notes', label: 'Additional Notes', type: 'textarea' },
    ],
  },
  'Mental Health Mentor': {
    title: 'Volunteer Application',
    fields: [
      { name: 'firstName', label: 'First Name *', type: 'text', required: true },
      { name: 'lastName', label: 'Last Name *', type: 'text', required: true },
      { name: 'email', label: 'Email *', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'tel' },
      { name: 'country', label: 'Country *', type: 'select', required: true, options: countryOptions },
      { name: 'age', label: 'Age', type: 'select', options: ageOptions },
      { name: 'experience', label: 'Relevant Experience', type: 'textarea' },
      { name: 'motivation', label: 'Motivation to Volunteer', type: 'textarea' },
      { name: 'availability', label: 'Availability (Weekly)', type: 'select', options: availabilityOptions },
      { name: 'notes', label: 'Additional Notes', type: 'textarea' },
    ],
  },
};

const emptyVolunteerForm = {
  achievements: '',
  age: '',
  availability: '',
  club: '',
  country: '',
  discipline: '',
  email: '',
  experience: '',
  experienceYears: '',
  firstName: '',
  lastName: '',
  level: '',
  motivation: '',
  notes: '',
  organization: '',
  phone: '',
  sport: '',
};

const sitePages = {
  '/pages/health-wellness': {
    layout: 'principles',
    eyebrow: 'About Us',
    title: 'Who We Are: Athletes for Peace',
    lead:
      'We are Athletes for Peace, a global organization that empowers and enables athletes of all skill levels to become effective spokespersons for inclusivity, peace, and significant social change.',
    image: 'https://unitedathletesforpeace.org/cdn/shop/files/athletesr_1200x400.jpg?v=1758310653',
    paragraphs: [
      'We are Athletes for Peace, a global organization that empowers and enables athletes of all skill levels to become effective spokespersons for inclusivity, peace, and significant social change.',
      'We believe in promoting healing, constructing bridges, and establishing harmony across all boundaries through the global language of sport.',
      'Our athletes are united in their goal to use their love of athletics as a tool to transform communities, break down boundaries, and foster lasting peace via polite, open dialogue.',
    ],
    sectionTitle: 'Inspired by the water, rowers embody our fundamental principles',
    gallery: [
      'https://unitedathletesforpeace.org/cdn/shop/files/steptodown.com512898_160x160.jpg?v=1765126065',
      'https://unitedathletesforpeace.org/cdn/shop/files/usa_rowers_160x160.jpg?v=1757860177',
      'https://unitedathletesforpeace.org/cdn/shop/files/pexels-runffwpu-3554634_160x160.jpg?v=1765126122',
      'https://unitedathletesforpeace.org/cdn/shop/files/pexels-borishamer-17886365_160x160.jpg?v=1765126303',
    ],
    quote:
      'Like the endless horizon of open waters, our vision knows no limits or barriers. Peace flows through every current, uniting us all in one powerful stream.',
    quoteStrong: true,
    highlights: commonPageHighlights,
  },
  '/pages/what-we-do': {
    layout: 'what-we-do',
    eyebrow: 'About Us',
    title: 'What We Do',
    lead:
      'We work with athletes in regions affected by war and instability, where opportunities to grow through sport are often limited.',
    image:
      'https://unitedathletesforpeace.org/cdn/shop/files/a9553ce7ae794f67b5602132d6648403Rowing_Representation__29618_b23ae2a9-a518-412d-a8a7-dfb04b013ecf_1400x.jpg?v=1767425737',
    introParagraphs: [
      'We work with athletes in regions affected by war and instability, where opportunities to grow through sport are often limited. By providing essential equipment, safe training environments, and sustainable facilities, we help athletes reclaim not only the chance to play, but their dignity, purpose, and strength.',
      'Our work extends to disabled young athletes and others with various types of challenges, opening doors that society has too often kept closed. Where there is despair, we bring hope. Where there is invisibility, we bring recognition.',
      'Through sport, we empower voices to rise above barriers, uniting communities and showing the world what true resilience looks like.',
    ],
    gallery: [
      'https://unitedathletesforpeace.org/cdn/shop/files/9-karapiro-2010_jpg_1000x.webp?v=1767425830',
      'https://unitedathletesforpeace.org/cdn/shop/files/Screenshot_2026-01-03_at_10.37.57_1400x.png?v=1767425910',
    ],
    closingParagraphs: [
      'Our mission isn’t only about today. We are planting seeds for tomorrow. By making athletes’ stories known and amplifying their voices, we nurture a new generation of leaders and advocates.',
      'These athletes become ambassadors of peace, showing how sport can heal, unite communities, and move the world toward a fairer and more compassionate future.',
    ],
    highlights: commonPageHighlights,
  },
  '/pages/my-story-%F0%9F%92%99': {
    layout: 'founder',
    eyebrow: 'Founder Story',
    title: 'Tristan Delacroix',
    lead:
      'Seventeen year old Tristan Delacroix has won medals in the ultra challenging sport of rowing.',
    image:
      'https://unitedathletesforpeace.org/cdn/shop/files/WhatsApp_Image_2025-12-07_at_20.04.18_1200x.jpg?v=1765127450',
    paragraphs: [
      'Seventeen year old Tristan Delacroix has won medals in the ultra challenging sport of rowing. Born and raised in New York, he played in a variety of sports before deciding to concentrate his focus on rowing at age 14.',
      'With two to three practice sessions six days a week, rowing is considered by many to be among the most demanding sports because it combines every training discipline.',
      'Tristan is combining his discipline and focus to launch United Athletes for Peace. Competing internationally, including in Romania, he saw the mutual respect among athletes regardless of language and took that experience as proof that sport can build real connection.',
      'He has assembled a team to recruit athletes, coaches, and rowing clubs to become Peace Ambassadors and advocate for a world beyond war, while continuing his studies in Psychology, Economics, History, and Brain Health.',
    ],
    gallery: [
      'https://unitedathletesforpeace.org/cdn/shop/files/WhatsApp_Image_2025-12-07_at_20.04.18_1200x.jpg?v=1765127450',
      'https://unitedathletesforpeace.org/cdn/shop/files/WhatsApp_Image_2025-12-07_at_20.05.16_1200x.jpg?v=1765127351',
      'https://unitedathletesforpeace.org/cdn/shop/files/WhatsApp_Image_2025-12-07_at_20.05.16_1_1200x.jpg?v=1765127350',
    ],
    quotes: [
      {
        text: '“Aside from the loss of lives and widespread destruction, the stress of war has taken a toll on mental health. I firmly believe in the need for active steps towards peace.”',
        source: 'Founder’s Statement',
      },
      {
        text: '“Every lofty and ambitious journey starts with a single step. Together we will empower our next generation of young peace ambassadors that our world needs now more than ever.”',
      },
    ],
  },
  '/pages/join-our-movement': {
    layout: 'volunteer',
    eyebrow: 'Get Involved',
    title: 'Join Our Movement',
    lead:
      'Become a member of the United Athletes For Peace family and use sports to transform the world.',
    image: 'https://unitedathletesforpeace.org/cdn/shop/files/athletesr_400x300.jpg?v=1758310653',
    paragraphs: [
      'Become a member of the United Athletes for Peace family and use sports to transform the world. The organization presents athletics as a path to peace, unity, and social impact for people of all ages and levels.',
    ],
    roles: [
      {
        title: 'Athlete Volunteer',
        subtitle: 'Join as an Athlete Volunteer',
        image: 'https://unitedathletesforpeace.org/cdn/shop/files/athletesr_400x300.jpg?v=1758310653',
        text: 'Bring your love for sports into something bigger than the game. As an Athlete Volunteer, you will be part of something bigger than the game, helping athletes in conflict zones and para-athletes fighting for inclusion. You will help organize events, mentor the next generation, and use your skills to open doors where they are needed most.',
      },
      {
        title: 'Coach Mentor',
        subtitle: 'Become a Mentor Coach',
        image: 'https://unitedathletesforpeace.org/cdn/shop/files/WhatsApp_Image_2025-09-19_at_23.13.46_400x300.jpg?v=1758369428',
        text: 'Give your time and change a life. Step into the role of mentor and coach for young athletes, including para-athletes, who are growing up in areas of conflict, violence, and displacement. Your time and guidance can help them stay strong, push through hardship, and hold on to their dreams despite the turmoil around them.',
      },
      {
        title: 'Mental Health Mentor',
        subtitle: 'Become a Volunteer',
        image: 'https://unitedathletesforpeace.org/cdn/shop/files/psyh_400x300.webp?v=1758310888',
        text: 'Be a strong part of a movement dedicated to peace, unity, and real social change. Mental health mentors who volunteer to support athletes in conflict regions or para-athletes facing unique challenges provide more than care. They offer hope, stability, and strength while helping people cope with trauma, rebuild confidence, and keep moving forward.',
      },
    ],
    highlights: [...commonPageHighlights, 'United Athletes'],
  },
  '/pages/contact': {
    type: 'contact',
    eyebrow: 'Contact',
    title: 'Contact Us',
    lead: 'Contact form',
    image: '/assets/community.png',
  },
  '/pages/donation': {
    type: 'donation',
    eyebrow: 'Donate',
    title: 'Support Our Mission',
    lead:
      'Make a quick donation. Enter your details below or scan the QR to open a fast payment flow. Payments are processed via PayPal.',
    image: '/assets/hero.jpg',
    paragraphs: [
      'Scan to Donate.',
      'Scan with your phone to open a quick PayPal donation link.',
    ],
    qrImage: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://paypal.com',
  },
  '/pages/gold-ambassadors-info': {
    eyebrow: 'Ambassadors',
    title: 'Gold Ambassadors',
    lead:
      'This page is currently presented by the source site as a placeholder while the program details are being prepared.',
    image: '/assets/representation.jpg',
    paragraphs: ['Coming soon.'],
  },
  '/pages/distinguished-ambassadors': {
    type: 'distinguished',
    eyebrow: 'Ambassadors',
    title: 'Distinguished Ambassadors',
    lead:
      'Elite athletes and visible leaders dedicated to using their influence to foster peace and unity across the globe.',
    image: '/assets/community.png',
    paragraphs: [
      'Our Distinguished Ambassadors are elite athletes and visionary leaders dedicated to using their influence to foster peace and unity across the globe.',
      'This list is loaded from the project backend and updates as new ambassadors are added.',
    ],
  },
};

const socialIcons = {
  Instagram: (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  YouTube: (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.9 4.8 12 4.8 12 4.8s-5.9 0-7.6.4a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2 12a29 29 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.7.4 7.6.4 7.6.4s5.9 0 7.6-.4a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22 12a29 29 0 0 0-.4-4.8Z" />
      <path d="M10 15.5v-7l6 3.5-6 3.5Z" fill="currentColor" stroke="none" />
    </svg>
  ),
  TikTok: (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M14.5 3c.3 2.1 1.5 3.9 3.5 4.8v2.8a8.3 8.3 0 0 1-3.5-1V15a5 5 0 1 1-5-5c.4 0 .8 0 1.2.1v2.9a2.4 2.4 0 0 0-1.2-.3 2.3 2.3 0 1 0 2.3 2.3V3h2.7Z" />
    </svg>
  ),
};

const navIcons = {
  'About Us': 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Blue%20Book.png',
  Impact: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Globe%20Showing%20Europe-Africa.png',
  'Get Involved': 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/People%20Hugging.png',
  Ambassadors: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/1st%20Place%20Medal.png',
  Contact: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/E-Mail.png',
};

function App() {
  const router = useRouter();
  const pathname = usePathname() || '/';
  const heroVideoRef = useRef(null);
  const heroShellRef = useRef(null);
  const heroAutoPausedRef = useRef(false);
  const donationFeedReadyRef = useRef(false);
  const latestDonationTimestampRef = useRef('');
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [isSplashExiting, setIsSplashExiting] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [donationOpen, setDonationOpen] = useState(false);
  const [volunteerRole, setVolunteerRole] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isHeroMuted, setIsHeroMuted] = useState(true);
  const [isHeroPlaying, setIsHeroPlaying] = useState(true);
  const [pageStage, setPageStage] = useState('is-visible');
  const [activeRegion, setActiveRegion] = useState('asia');
  const [selectedZoneId, setSelectedZoneId] = useState('afghanistan');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [volunteerForm, setVolunteerForm] = useState(emptyVolunteerForm);
  const [volunteerError, setVolunteerError] = useState('');
  const [volunteerSuccessRole, setVolunteerSuccessRole] = useState(null);
  const [tickerItems, setTickerItems] = useState(fallbackTickerItems);
  const [liveZones, setLiveZones] = useState(conflictZones);
  const [instagramPosts, setInstagramPosts] = useState(fallbackInstagramPosts);

  const regionZones = useMemo(
    () => liveZones.filter((zone) => zone.region === activeRegion),
    [activeRegion, liveZones],
  );

  useEffect(() => {
    setSelectedZoneId(regionZones[0]?.id ?? null);
  }, [regionZones]);

  useEffect(() => {
    if (prefersReducedMotion) {
      const timeoutId = window.setTimeout(() => setIsSplashVisible(false), 520);
      return () => window.clearTimeout(timeoutId);
    }

    const exitTimeoutId = window.setTimeout(() => setIsSplashExiting(true), 820);
    const hideTimeoutId = window.setTimeout(() => setIsSplashVisible(false), 1560);

    return () => {
      window.clearTimeout(exitTimeoutId);
      window.clearTimeout(hideTimeoutId);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);

    return () => {
      mediaQuery.removeEventListener('change', updatePreference);
    };
  }, []);

  useEffect(() => {
    AOS.init({
      disable: prefersReducedMotion || window.innerWidth < 900,
      duration: 560,
      easing: 'ease-out-cubic',
      once: true,
      offset: 48,
    });
  }, [prefersReducedMotion]);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      const nextY = window.scrollY;

      setIsScrolled((current) => {
        const nextScrolled = nextY > 24;
        return current === nextScrolled ? current : nextScrolled;
      });

      if (prefersReducedMotion || !heroShellRef.current || ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(() => {
        const depth = Math.min(nextY / 520, 1);
        const heroShell = heroShellRef.current;

        if (heroShell) {
          heroShell.style.setProperty('--hero-depth', depth.toFixed(3));
          heroShell.style.setProperty('--hero-rotate-x', `${(3.4 - depth * 2.2).toFixed(3)}deg`);
          heroShell.style.setProperty('--hero-rotate-y', `${(-1.8 + depth * 1.1).toFixed(3)}deg`);
          heroShell.style.setProperty('--hero-frame-scale', (1.03 + depth * 0.035).toFixed(4));
          heroShell.style.setProperty('--hero-video-scale', (1.02 + depth * 0.05).toFixed(4));
          heroShell.style.setProperty('--hero-video-shift', `${Math.round(-46 + depth * -22)}px`);
        }

        ticking = false;
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!isSplashVisible && !donationOpen && !volunteerRole && !volunteerSuccessRole && !mobileNavOpen) {
      document.body.style.overflow = '';
      return undefined;
    }

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [donationOpen, isSplashVisible, mobileNavOpen, volunteerRole, volunteerSuccessRole]);

  useEffect(() => {
    setPageStage(prefersReducedMotion ? 'is-visible' : 'is-entering');
    setMobileNavOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: prefersReducedMotion ? 'auto' : 'auto' });

    if (prefersReducedMotion) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setPageStage('is-visible'), 220);
    return () => window.clearTimeout(timeoutId);
  }, [pathname, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion || window.innerWidth < 900) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      AOS.refresh();
    }, 180);

    return () => window.clearTimeout(timeoutId);
  }, [pathname, pageStage, isSplashVisible, prefersReducedMotion]);

  useEffect(() => {
    const controller = new AbortController();

    const loadTicker = async () => {
      try {
        const response = await fetch('/api/crisis-updates', {
          cache: 'no-store',
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Ticker request failed with ${response.status}`);
        }

        const payload = await response.json();
        if (Array.isArray(payload.items) && payload.items.length > 0) {
          setTickerItems(payload.items);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          setTickerItems(fallbackTickerItems);
        }
      }
    };

    loadTicker();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const loadCurrentCrises = async () => {
      try {
        const response = await fetch('/api/current-crises', {
          cache: 'no-store',
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Current crises request failed with ${response.status}`);
        }

        const payload = await response.json();
        if (Array.isArray(payload.items) && payload.items.length > 0) {
          setLiveZones(payload.items);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          setLiveZones(conflictZones);
        }
      }
    };

    loadCurrentCrises();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const loadInstagramPosts = async () => {
      try {
        const response = await fetch('/api/instagram-feed', {
          cache: 'no-store',
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Instagram feed request failed with ${response.status}`);
        }

        const payload = await response.json();
        if (Array.isArray(payload.items) && payload.items.length > 0) {
          setInstagramPosts(payload.items.slice(0, 5));
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          setInstagramPosts(fallbackInstagramPosts);
        }
      }
    };

    loadInstagramPosts();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    let isDisposed = false;

    const syncDonationFeed = async (primeOnly = false) => {
      try {
        const query = latestDonationTimestampRef.current
          ? `?since=${encodeURIComponent(latestDonationTimestampRef.current)}`
          : '?limit=12';

        const response = await fetch(`/api/donations${query}`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`Donation feed request failed with ${response.status}`);
        }

        const payload = await response.json();
        const donations = Array.isArray(payload.donations) ? payload.donations : [];

        if (donations.length > 0) {
          latestDonationTimestampRef.current = donations[donations.length - 1].receivedAt;
        }

        if (primeOnly || !donationFeedReadyRef.current || isDisposed) {
          return;
        }

        donations.forEach((donation) => {
          toast.info(
            <DonationToastContent
              title="New Donation"
              body={`${donation.name} donated $${donation.donationAmount} from ${donation.donationCountry}${donation.comment ? ` • ${donation.comment}` : ''}`}
            />,
            {
              autoClose: 5200,
              closeOnClick: true,
              pauseOnHover: true,
            },
          );
        });
      } catch {
        return;
      }
    };

    syncDonationFeed(true).finally(() => {
      donationFeedReadyRef.current = true;
    });

    const intervalId = window.setInterval(() => {
      syncDonationFeed(false);
    }, 5000);

    return () => {
      isDisposed = true;
      window.clearInterval(intervalId);
    };
  }, []);

  const effectiveAmount = customAmount ? Number(customAmount) : selectedAmount;
  const canonicalPath = pageAliases[pathname] || pathname;
  const isImpactPage = canonicalPath === '/pages/global-reach';
  const currentPage = sitePages[canonicalPath] ?? null;

  const navigateTo = (href) => {
    const url = new URL(href, window.location.origin);
    const nextPathname = url.pathname || '/';
    const nextHash = url.hash;
    const currentUrl = `${pathname}${window.location.hash}`;
    const targetUrl = `${nextPathname}${nextHash}`;

    if (currentUrl === targetUrl) {
      setMobileNavOpen(false);
      return;
    }

    if (nextPathname === pathname && nextHash) {
      const target = document.querySelector(nextHash);
      setMobileNavOpen(false);
      if (target) {
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      } else {
        router.push(targetUrl, { scroll: false });
      }
      return;
    }

    setPageStage('is-leaving');
    setMobileNavOpen(false);

    window.setTimeout(() => {
      router.push(targetUrl, { scroll: false });
    }, 220);
  };

  const handleInternalNavigation = (event, href) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    if (/^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return;
    }

    event.preventDefault();
    navigateTo(href);
  };

  const submitDonation = () => {
    if (!effectiveAmount || Number.isNaN(effectiveAmount) || effectiveAmount <= 0) {
      setFormError('Please select or enter a donation amount.');
      return;
    }

    setDonationOpen(false);
    setFormError('');
    toast.success(
      <DonationToastContent
        title="Donation Received"
        body={`Thank you for pledging $${effectiveAmount}${message ? ` • ${message}` : ''}.`}
      />,
      {
        autoClose: 4200,
        closeOnClick: true,
        pauseOnHover: true,
      },
    );
    setSelectedAmount(null);
    setCustomAmount('');
    setMessage('');
  };

  const openVolunteerForm = (role) => {
    setVolunteerRole(role);
    setVolunteerSuccessRole(null);
    setVolunteerForm(emptyVolunteerForm);
    setVolunteerError('');
  };

  const closeVolunteerForm = () => {
    setVolunteerRole(null);
    setVolunteerSuccessRole(null);
    setVolunteerForm(emptyVolunteerForm);
    setVolunteerError('');
  };

  const submitVolunteerForm = () => {
    const config = volunteerRole ? volunteerFormConfigs[volunteerRole.title] : null;
    const missingField = config?.fields.find((field) => field.required && !String(volunteerForm[field.name] ?? '').trim());

    if (missingField) {
      setVolunteerError(`Please complete ${missingField.label.replace(' *', '')}.`);
      return;
    }

    setVolunteerSuccessRole(volunteerRole);
    setVolunteerError('');
    setVolunteerRole(null);
    setVolunteerForm(emptyVolunteerForm);
  };

  const updateVolunteerField = (name, value) => {
    setVolunteerForm((current) => ({ ...current, [name]: value }));
    setVolunteerError('');
  };

  const sendHeroCommand = (func, args = []) => {
    const iframe = heroVideoRef.current;
    if (!iframe?.contentWindow) return;

    iframe.contentWindow.postMessage(
      JSON.stringify({
        event: 'command',
        func,
        args,
      }),
      '*',
    );
  };

  const toggleHeroMute = () => {
    if (isHeroMuted) {
      sendHeroCommand('unMute');
      setIsHeroMuted(false);
      return;
    }

    sendHeroCommand('mute');
    setIsHeroMuted(true);
  };

  const toggleHeroPlayback = () => {
    if (isHeroPlaying) {
      sendHeroCommand('pauseVideo');
      heroAutoPausedRef.current = false;
      setIsHeroPlaying(false);
      return;
    }

    sendHeroCommand('playVideo');
    heroAutoPausedRef.current = false;
    setIsHeroPlaying(true);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isHeroPlaying) {
          sendHeroCommand('pauseVideo');
          heroAutoPausedRef.current = true;
          setIsHeroPlaying(false);
        }
        return;
      }

      if (heroAutoPausedRef.current) {
        sendHeroCommand('playVideo');
        heroAutoPausedRef.current = false;
        setIsHeroPlaying(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isHeroPlaying]);

  return (
    <div className="page-shell">
      {isSplashVisible ? (
        <div className={isSplashExiting ? 'splash-screen splash-screen--exiting' : 'splash-screen'} aria-hidden="true">
          <div className="splash-screen__brand">
            <img alt="United Athletes for Peace logo" className="splash-screen__logo" src="/logo-navbar-light.png" />
          </div>
          <ClipLoader className="splash-screen__spinner" color="#0e1b4d" size={18} speedMultiplier={0.82} />
        </div>
      ) : null}

      <nav className={isScrolled ? 'navbar navbar--scrolled' : 'navbar'}>
        <div className="navbar-shimmer"></div>
        <div className="navbar-world" aria-hidden="true"></div>
        <div className="navbar-left">
          <a
            className="logo"
            href="/"
            onClick={(event) => handleInternalNavigation(event, '/')}
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
          >
            <img className="logo__image" src="/logo-navbar-light.png" alt="United Athletes Logo" width="50" height="50" style={{ display: 'block', objectFit: 'contain' }} />
          </a>
        </div>

        <div className="navbar-center">
          <ul className="nav-links">
            {navigation.map((item) => (
              <li className={item.children ? 'nav-item nav-item--has-children' : 'nav-item'} key={item.label}>
                <a href={item.href} onClick={(event) => handleInternalNavigation(event, item.href)}>
                  {item.label}
                </a>
                {item.children ? (
                  <div className="nav-dropdown">
                    {item.children.map((child) => (
                      <a
                        className="nav-dropdown__link"
                        href={child.href}
                        key={child.label}
                        onClick={(event) => handleInternalNavigation(event, child.href)}
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </div>

        <div className="navbar-right">
          <button className="members-button" type="button" onClick={() => setDonationOpen(true)}>
            <img
              src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Red%20Heart.png"
              alt="Heart"
              width="22"
              height="22"
              style={{ filter: 'drop-shadow(0 3px 6px rgba(14, 27, 77, 0.2))' }}
            />
            Donate
          </button>
          <button
            aria-expanded={mobileNavOpen}
            aria-label="Toggle menu"
            className="navbar-toggler"
            type="button"
            onClick={() => setMobileNavOpen((current) => !current)}
          >
            {mobileNavOpen ? (
              <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                <line x1="5" y1="5" x2="19" y2="19"></line>
                <line x1="19" y1="5" x2="5" y2="19"></line>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                <line x1="3" y1="7" x2="21" y2="7"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="17" x2="21" y2="17"></line>
              </svg>
            )}
          </button>
        </div>

        {mobileNavOpen ? (
          <div className="mobile-nav-overlay" role="presentation" onClick={() => setMobileNavOpen(false)}>
            <div className="mobile-nav" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
              <div className="mobile-nav__header">
                <span>Menu</span>
                <button
                  aria-label="Close menu"
                  className="mobile-nav__close"
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                >
                  ×
                </button>
              </div>
              {navigation.map((item) => (
                <div className="mobile-nav__group" key={item.label}>
                  <a href={item.href} onClick={(event) => handleInternalNavigation(event, item.href)}>
                    {item.label}
                  </a>
                  {item.children ? (
                    <div className="mobile-nav__children">
                      {item.children.map((child) => (
                        <a
                          href={child.href}
                          key={child.label}
                          onClick={(event) => handleInternalNavigation(event, child.href)}
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </nav>

      <main className={`page-transition ${pageStage}`}>
        {isImpactPage ? (
          <ImpactPage onDonateClick={() => setDonationOpen(true)} />
        ) : currentPage ? (
          <SitePage
            onDonateClick={() => setDonationOpen(true)}
            onNavigate={navigateTo}
            onToast={setToast}
            onVolunteerApply={openVolunteerForm}
            page={currentPage}
          />
        ) : (
          <>
            <section className="hero" id="top">
                <div
                  ref={heroShellRef}
                  className="hero__shell"
                  style={prefersReducedMotion ? {
                    '--hero-depth': 0,
                    '--hero-rotate-x': '0deg',
                    '--hero-rotate-y': '0deg',
                    '--hero-frame-scale': 1,
                    '--hero-video-scale': 1.02,
                    '--hero-video-shift': '-46px',
                  } : undefined}
              >
                <div className="hero__video-frame" aria-hidden="true">
                  <iframe
                    allow="autoplay; encrypted-media; fullscreen"
                    allowFullScreen
                    className="hero__video"
                    fetchPriority="high"
                    loading="eager"
                    referrerPolicy="strict-origin-when-cross-origin"
                    ref={heroVideoRef}
                    src={HERO_VIDEO}
                    title="United Athletes for Peace background video"
                  />
                </div>
                <div className="hero__overlay" />
                <div className="hero__controls">
                  <button className="hero__control" type="button" onClick={toggleHeroPlayback}>
                    {isHeroPlaying ? 'Pause' : 'Play'}
                  </button>
                  <button className="hero__control" type="button" onClick={toggleHeroMute}>
                    {isHeroMuted ? 'Unmute' : 'Mute'}
                  </button>
                </div>
              </div>
            </section>

            <div className="events-banner" data-aos="fade-up" data-aos-delay="40">
              <div className="events-content">
                {[...tickerItems, ...tickerItems].map((item, index) => (
                  <span className="event-item" key={`${item}-${index}`}>{item}</span>
                ))}
              </div>
            </div>

            <section className="section section--conflicts" data-aos="fade-up" data-aos-delay="70">
              <div className="conflicts-shell">
                <div className="conflicts-heading">
                  <p className="eyebrow">Conflicts Today</p>
                  <h2>Key realities shaping why this mission matters now</h2>
                  <p className="conflicts-intro conflicts-intro--lead">
                    International cooperation is one of the most powerful tools we have at our disposal for significant change. The fact is that no country, no matter how strong, can solve the intricate and cross-border problems of today by itself. No person or community is left behind thanks to enduring freedom and competent governance.
                  </p>
                </div>
                <div className="conflicts-list">
                  {conflictQuotes.slice(1).map((quote, index) => (
                    <article className="conflict-quote" key={quote.source}>
                      <div className="conflict-quote__meta">
                        <strong>{String(index + 1).padStart(2, '0')}</strong>
                        <span>{quote.source}</span>
                      </div>
                      <p>{quote.text}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section className="section section--map" data-aos="fade-up" data-aos-delay="90" id="conflict-zones">
              <div className="map-layout">
                <div className="map-copy section-copy-card">
                  <p className="eyebrow">Global Conflict Zones</p>
                  <h2>Interactive map showing current conflict zones around the world</h2>
                  <p>
                    This map displays active conflict zones worldwide. Each red circle represents an area experiencing ongoing conflict, political instability, or humanitarian crisis. Click on any marker to learn more about the specific situation in that region.
                  </p>
                  <p className="map-copy__label">Conflict Zones by Region</p>

                  <div className="region-tabs" role="tablist" aria-label="Conflict regions">
                    {regions.map((region) => (
                      <button
                        aria-selected={activeRegion === region.id}
                        className={activeRegion === region.id ? 'is-active' : ''}
                        key={region.id}
                        type="button"
                        onClick={() => setActiveRegion(region.id)}
                      >
                        {region.label}
                      </button>
                    ))}
                  </div>

                  <div className="zone-list">
                    {regionZones.slice(0, 6).map((zone) => (
                      <button
                        className={
                          zone.id === selectedZoneId ? 'zone-row zone-row--active' : 'zone-row'
                        }
                        key={zone.id}
                        type="button"
                        onClick={() => setSelectedZoneId(zone.id)}
                      >
                        <strong>{zone.name}</strong>
                        <span>{zone.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="map-panel">
                  <div className="map-panel__inner">
                    <ConflictMap selectedZoneId={selectedZoneId} zones={liveZones} />
                  </div>
                </div>
              </div>
            </section>

            <div className="anchor-offset" id="donate" />
            <section className="section section--donation-home" data-aos="fade-up" data-aos-delay="110" id="contact">
              <div className="donation-home">
                <div className="donation-home__head">
                  <p className="eyebrow">Support Our Mission</p>
                  <h2>Help us create opportunities for athletes with intellectual disabilities</h2>
                  <p className="donation-home__summary">
                    A clear, direct giving path for supporters who want visible humanitarian impact through sport, inclusion, and peace-centered advocacy.
                  </p>
                  <p>Goal: ${donationCampaign.goal.toLocaleString()} | Raised: ${donationCampaign.raised.toLocaleString()}</p>
                  <p className="donation-home__trust">Secure & Trusted • 501(c)(3) Non-Profit</p>
                </div>
                <div className="donation-home__tiers">
                  {donationTiers.map((tier) => (
                    <button
                      key={tier.value}
                      type="button"
                      className="donation-home__tier"
                      onClick={() => {
                        setSelectedAmount(tier.value);
                        setCustomAmount('');
                        setDonationOpen(true);
                      }}
                    >
                      <strong>${tier.value}</strong>
                      <span>{tier.label}</span>
                    </button>
                  ))}
                </div>
                <div className="donation-home__actions">
                  <button className="button button--text" type="button" onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })}>
                    Maybe Later
                  </button>
                  <button className="button button--primary" type="button" onClick={() => setDonationOpen(true)}>
                    Donate Securely
                  </button>
                </div>
              </div>
            </section>

            <section className="section section--instagram" data-aos="fade-up" data-aos-delay="120">
              <div className="instagram-section">
                <div className="instagram-section__head">
                  <p className="eyebrow">Instagram</p>
                  <h2>Latest updates from United Athletes for Peace</h2>
                </div>

                <div className="instagram-showcase">
                  {instagramPosts[0] ? (
                    <a
                      className="instagram-showcase__featured"
                      href={instagramPosts[0].url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <img alt="" decoding="async" loading="lazy" src={instagramPosts[0].imageUrl} />
                      <div className="instagram-showcase__overlay">
                        <span className="instagram-showcase__label">Featured Post</span>
                        <strong>{instagramPosts[0].caption}</strong>
                        <span>View on Instagram</span>
                      </div>
                    </a>
                  ) : null}

                  <div className="instagram-showcase__rail">
                    {instagramPosts.slice(1, 5).map((post) => (
                      <a
                        className="instagram-showcase__item"
                        href={post.url}
                        key={post.url}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <img alt="" decoding="async" loading="lazy" src={post.imageUrl} />
                        <div className="instagram-showcase__body">
                          <strong>{post.caption}</strong>
                          <span>Open post</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="footer-simple" data-aos="fade-up" data-aos-delay="80">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3>United Athletes for Peace</h3>
              <p>
                Building bridges through sports, creating lasting peace through the power of
                athletics.
              </p>
              <div className="footer-social">
                {socialLinks.map((link) => (
                  <a href={link.href} key={link.label} rel="noreferrer" target="_blank">
                    <span className="social-icon">{socialIcons[link.label]}</span>
                    <span className="sr-only">{link.label}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="footer-menus">
                  {footerColumns.map((column) => (
                <div className="footer-menu" key={column.title}>
                  <h4>{column.title}</h4>
                  {column.links.map((link) => (
                    <a
                      href={link.href}
                      key={link.label}
                      onClick={(event) => handleInternalNavigation(event, link.href)}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="footer-bottom">© 2025 United Athletes for Peace. All rights reserved.</div>
        </div>
      </footer>

      <ToastContainer
        autoClose={4200}
        closeButton={false}
        draggable={false}
        hideProgressBar={false}
        newestOnTop
        pauseOnFocusLoss
        pauseOnHover
        position="bottom-right"
        theme="dark"
        toastClassName="site-toastify__toast"
        bodyClassName="site-toastify__body"
        progressClassName="site-toastify__progress"
      />

      <DonationModal
        customAmount={customAmount}
        formError={formError}
        isOpen={donationOpen}
        message={message}
        onAmountSelect={(amount) => {
          setSelectedAmount(amount);
          setCustomAmount('');
          setFormError('');
        }}
        onClose={() => {
          setDonationOpen(false);
          setFormError('');
        }}
        onCustomAmountChange={(value) => {
          setCustomAmount(value);
          setSelectedAmount(null);
          setFormError('');
        }}
        onMessageChange={setMessage}
        onSubmit={submitDonation}
        selectedAmount={selectedAmount}
      />
      <VolunteerFormModal
        error={volunteerError}
        form={volunteerForm}
        isOpen={Boolean(volunteerRole || volunteerSuccessRole)}
        onClose={closeVolunteerForm}
        onFieldChange={updateVolunteerField}
        onSubmit={submitVolunteerForm}
        role={volunteerRole}
        successRole={volunteerSuccessRole}
      />
    </div>
  );
}

function SitePage({ onDonateClick, onNavigate, onToast, onVolunteerApply, page }) {
  if (page.type === 'contact') {
    return <ContactPage onToast={onToast} page={page} />;
  }

  if (page.type === 'donation') {
    return <DonationPage onDonateClick={onDonateClick} page={page} />;
  }

  if (page.type === 'distinguished') {
    return <DistinguishedAmbassadorsPage page={page} />;
  }

  if (page.layout === 'what-we-do') {
    return <WhatWeDoPage onNavigate={onNavigate} page={page} />;
  }

  return <StandardPage onNavigate={onNavigate} onVolunteerApply={onVolunteerApply} page={page} />;
}

function StandardPage({ onNavigate, onVolunteerApply, page }) {
  const activeHighlights = page.layout === 'founder' ? founderHighlights : page.highlights ?? [];
  const shouldHighlight = activeHighlights.length > 0;

  return (
    <section className="content-page">
      {page.layout !== 'founder' ? (
        <ContentPageHero alt={page.title} src={page.image} />
      ) : null}

      <div className="section content-page__body" data-aos="fade-up">
        <div className="content-page__intro">
          <div>
            <p className="content-page__eyebrow">{page.eyebrow}</p>
            <h1>{page.title}</h1>
          </div>
          <p className="content-page__lead">
            {shouldHighlight ? renderHighlightedText(page.lead, activeHighlights) : page.lead}
          </p>
        </div>

        <div className="content-page__grid">
          <div className="content-page__main">
            <div className={page.layout === 'founder' ? 'content-page__copy content-page__copy--founder' : 'content-page__copy'}>
              {page.paragraphs?.map((paragraph) => (
                <p key={paragraph}>
                  {shouldHighlight ? renderHighlightedText(paragraph, activeHighlights) : paragraph}
                </p>
              ))}
            </div>

            {page.quotes ? (
              <div className="content-page__quotes">
                {page.quotes.map((quote) => (
                  <blockquote className="content-page__editorial-quote" key={quote.text}>
                    <p>{quote.text}</p>
                    {quote.source ? <cite>{quote.source}</cite> : null}
                  </blockquote>
                ))}
              </div>
            ) : null}

            {page.layout === 'editorial' && page.gallery ? (
              <div className="content-page__editorial">
                {page.gallery.map((image) => (
                  <BlurImageFrame alt="" className="content-page__editorial-image" key={image} src={image} />
                ))}
              </div>
            ) : null}

            {page.layout === 'principles' && page.gallery ? (
              <section className="content-page__principles">
                <h3>{page.sectionTitle}</h3>
                <div className="content-page__principles-grid">
                  {page.gallery.map((image) => (
                    <BlurImageFrame alt="" className="content-page__principles-image" key={image} src={image} />
                  ))}
                </div>
              </section>
            ) : null}

            {page.roles ? (
              <div className="content-page__roles">
                {page.roles.map((role) => (
                  <article className="content-page__role" key={role.title}>
                    {role.image ? <BlurImageFrame alt={role.title} className="content-page__role-image" src={role.image} /> : null}
                    <h3>{role.title}</h3>
                    {role.subtitle ? <h4>{shouldHighlight ? renderHighlightedText(role.subtitle, activeHighlights) : role.subtitle}</h4> : null}
                    <p>{shouldHighlight ? renderHighlightedText(role.text, activeHighlights) : role.text}</p>
                    <button className="button button--primary content-page__role-button" type="button" onClick={() => onVolunteerApply(role)}>
                      Open Application Form
                    </button>
                  </article>
                ))}
              </div>
            ) : null}
          </div>

          {page.layout === 'founder' && page.gallery ? (
            <aside className="content-page__aside content-page__aside--gallery">
              {page.gallery.map((image) => (
                <BlurImageFrame alt="" className="content-page__stack-image" key={image} src={image} />
              ))}
            </aside>
          ) : (
            <aside className="content-page__aside">
              <p className="content-page__aside-label">Explore More</p>
              <a className="button button--primary" href="/pages/contact" onClick={(event) => { event.preventDefault(); onNavigate('/pages/contact'); }}>
                Contact Us
              </a>
              <a className="button button--ghost" href="/pages/donation" onClick={(event) => { event.preventDefault(); onNavigate('/pages/donation'); }}>
                Make a Contribution
              </a>
              {page.quote ? (
                <blockquote className="content-page__quote">
                  {page.quoteStrong ? (
                    <strong className="content-page__highlight">{page.quote}</strong>
                  ) : shouldHighlight ? (
                    renderHighlightedText(page.quote, activeHighlights)
                  ) : (
                    page.quote
                  )}
                </blockquote>
              ) : null}
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}

function WhatWeDoPage({ onNavigate, page }) {
  const activeHighlights = page.highlights ?? [];

  return (
    <section className="content-page content-page--what-we-do">
      <div className="section content-page__body" data-aos="fade-up">
        <div className="content-page__intro content-page__intro--single">
          <div>
            <p className="content-page__eyebrow">{page.eyebrow}</p>
            <h1>{page.title}</h1>
          </div>
        </div>

        <div className="content-page__flow">
          <BlurImageFrame alt={page.title} className="content-page__feature-image" src={page.image} />

          <div className="content-page__copy">
            {page.introParagraphs?.map((paragraph) => (
              <p key={paragraph}>{renderHighlightedText(paragraph, activeHighlights)}</p>
            ))}
          </div>

          <div className="content-page__editorial">
            {page.gallery?.map((image) => (
              <BlurImageFrame alt="" className="content-page__editorial-image" key={image} src={image} />
            ))}
          </div>

          <div className="content-page__copy">
            {page.closingParagraphs?.map((paragraph) => (
              <p key={paragraph}>{renderHighlightedText(paragraph, activeHighlights)}</p>
            ))}
          </div>

          <div className="content-page__actions">
            <a
              className="button button--primary"
              href="/pages/contact"
              onClick={(event) => {
                event.preventDefault();
                onNavigate('/pages/contact');
              }}
            >
              Contact Us
            </a>
            <a
              className="button button--ghost"
              href="/pages/donation"
              onClick={(event) => {
                event.preventDefault();
                onNavigate('/pages/donation');
              }}
            >
              Make a Contribution
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContentPageHero({ alt, src }) {
  return (
    <div className="content-page__hero" style={{ '--content-hero-image': `url(${src})` }}>
      <div className="content-page__hero-blur" aria-hidden="true" />
      <img alt={alt} className="content-page__image" src={src} />
      <div className="content-page__scrim" />
    </div>
  );
}

function BlurImageFrame({ alt, className, src }) {
  return (
    <div className={`${className} image-frame`} style={{ '--image-url': `url(${src})` }}>
      <img alt={alt} className="image-frame__img" src={src} />
    </div>
  );
}

function renderHighlightedText(text, highlights) {
  if (!highlights?.length) {
    return text;
  }

  const pattern = new RegExp(`(${highlights.map(escapeRegExp).join('|')})`, 'g');
  return text.split(pattern).map((part, index) =>
    highlights.includes(part) ? (
      <strong className="content-page__highlight" key={`${part}-${index}`}>
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function ContactPage({ onToast, page }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');

  const submitForm = (event) => {
    event.preventDefault();
    onToast('Contact request captured locally. Connect a backend or form service to send it.');
    setName('');
    setEmail('');
    setPhone('');
    setComment('');
  };

  return (
    <section className="content-page">
      <ContentPageHero alt={page.title} src={page.image} />

      <div className="section content-page__body" data-aos="fade-up">
        <div className="content-page__intro">
          <div>
            <p className="content-page__eyebrow">{page.eyebrow}</p>
            <h1>{page.title}</h1>
          </div>
          <p className="content-page__lead">{page.lead}</p>
        </div>

        <div className="content-page__grid">
          <form className="contact-form" onSubmit={submitForm}>
            <div className="contact-form__row">
              <input placeholder="Name" type="text" value={name} onChange={(event) => setName(event.target.value)} />
              <input placeholder="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
            <input placeholder="Phone number" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} />
            <textarea placeholder="Comment" rows="7" value={comment} onChange={(event) => setComment(event.target.value)} />
            <button className="button button--primary" type="submit">Send</button>
          </form>

          <aside className="content-page__aside">
            <p className="content-page__aside-label">Public Channels</p>
            {socialLinks.map((link) => (
              <a className="content-page__channel" href={link.href} key={link.label} rel="noreferrer" target="_blank">
                <span className="social-icon">{socialIcons[link.label]}</span>
                <span>{link.label}</span>
              </a>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}

function DonationPage({ onDonateClick, page }) {
  return (
    <section className="content-page">
      <ContentPageHero alt={page.title} src={page.image} />

      <div className="section content-page__body" data-aos="fade-up">
        <div className="content-page__intro">
          <div>
            <p className="content-page__eyebrow">{page.eyebrow}</p>
            <h1>{page.title}</h1>
          </div>
          <p className="content-page__lead">{page.lead}</p>
        </div>

        <div className="content-page__grid">
          <div className="content-page__main">
            <div className="content-page__copy">
              {page.paragraphs?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <aside className="content-page__aside">
            <p className="content-page__aside-label">Ways to Give</p>
            {page.qrImage ? <BlurImageFrame alt="Donation QR code" className="content-page__qr" src={page.qrImage} /> : null}
            <button className="button button--primary" type="button" onClick={onDonateClick}>
              Open Donation Form
            </button>
            <a className="button button--ghost" href="https://www.paypal.com" rel="noreferrer" target="_blank">
              PayPal
            </a>
            <p className="content-page__note">
              {page.paragraphs?.[0]} {page.paragraphs?.[1]}
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

function normalizeSportLabel(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function getSportIcon(value) {
  const sport = normalizeSportLabel(value);

  if (sport.includes('rowing') || sport.includes('canotaj')) {
    return {
      label: 'Rowing icon',
      symbol: '🚣',
    };
  }

  if (sport.includes('golf')) {
    return {
      label: 'Golf icon',
      symbol: '⛳',
    };
  }

  if (sport.includes('soccer') || sport.includes('football')) {
    return {
      label: 'Soccer icon',
      symbol: '⚽',
    };
  }

  if (sport.includes('tennis')) {
    return {
      label: 'Tennis icon',
      symbol: '🎾',
    };
  }

  if (sport.includes('fencing')) {
    return {
      label: 'Fencing icon',
      symbol: '🤺',
    };
  }

  if (sport.includes('waterpolo') || sport.includes('water polo')) {
    return {
      label: 'Water polo icon',
      symbol: '🤽',
    };
  }

  if (sport.includes('boxing') || sport.includes('kickboxing')) {
    return {
      label: 'Boxing icon',
      symbol: '🥊',
    };
  }

  if (sport.includes('lacrosse')) {
    return {
      label: 'Lacrosse icon',
      symbol: '🥍',
    };
  }

  return {
    label: 'Sport icon',
    symbol: '🏅',
  };
}

function getCountryFlag(value) {
  const code = String(value ?? '').trim().toLowerCase();
  if (!code || code === 'un') {
    return '🌍';
  }

  return code
    .slice(0, 2)
    .toUpperCase()
    .split('')
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join('');
}

function findMatchingKey(input, mapping) {
  const normalized = String(input ?? '').trim().toLowerCase();
  return Object.keys(mapping).find((key) => normalized.includes(key.toLowerCase()));
}

function getCountryCode(country, name) {
  const manualKey = findMatchingKey(name, manualPersonMapping);
  if (manualKey) {
    return manualPersonMapping[manualKey];
  }

  const cleanedCountry = String(country ?? '').trim();
  if (countryNameToCode[cleanedCountry]) {
    return countryNameToCode[cleanedCountry];
  }

  return 'un';
}

function parseAchievementText(value) {
  const base = String(value ?? '').trim();
  if (!base) {
    return 'Distinguished Ambassador';
  }

  return base
    .replace(/\bWRCH\b/gi, 'World Rowing Championships')
    .replace(/\bERCH\b/gi, 'European Rowing Championships')
    .replace(/\bRO NAT\b/gi, 'Romanian Nationals')
    .replace(/\bUS NATS\b/gi, 'US Nationals')
    .replace(/\bU(\d{1,2})\b/gi, 'U$1')
    .replace(/\bNATS\b/gi, 'Nationals')
    .replace(/\bNATS\b/gi, 'Nationals')
    .replace(/\b2ST\b/gi, '2nd')
    .replace(/\s*&\s*/g, ' and ')
    .replace(/\s+/g, ' ')
    .replace(/,\s*/g, ', ')
    .trim();
}

function getResolvedAchievement(name, role) {
  const matchingKey = findMatchingKey(name, specialAchievements);
  return parseAchievementText(matchingKey ? specialAchievements[matchingKey] : role);
}

function getRoleMeta(value) {
  const achievement = parseAchievementText(value);
  const normalized = achievement.toLowerCase();
  const isCoach =
    normalized.includes('coach') ||
    normalized.includes('director') ||
    normalized.includes('mentor') ||
    normalized.includes('guided') ||
    normalized.includes('led') ||
    normalized.includes('trainer');
  const isFirst = normalized.includes('1st') || normalized.includes('gold') || normalized.includes('winner') || normalized.includes('champion') || normalized.includes('mvp');
  const isSecond = normalized.includes('2nd') || normalized.includes('2st') || normalized.includes('silver') || normalized.includes('runner-up');
  const isThird = normalized.includes('3rd') || normalized.includes('bronze');
  const isOlympic = normalized.includes('olympic') || normalized.includes('olympia');
  const isWorldLevel = normalized.includes('wrch') || normalized.includes('world') || normalized.includes('mondial') || isOlympic;

  const icons = [];
  let tier = 1;
  let category = 'athlete';

  if (isCoach) {
    icons.push('star');
    tier = 5;
    category = 'mentor';
  } else {
    if (isWorldLevel && isFirst) {
      icons.push('trophy');
    }

    if (isFirst) {
      icons.push('gold');
      tier = 4;
    } else if (isSecond || normalized.includes('erch')) {
      icons.push('silver');
      tier = 3;
    } else if (isThird) {
      icons.push('bronze');
      tier = 2;
    }
  }

  const cleanTitle = achievement
    .replace(/\b1st\b/gi, 'Gold')
    .replace(/\b2nd\b/gi, 'Silver')
    .replace(/\b3rd\b/gi, 'Bronze')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    category,
    cleanTitle: cleanTitle || achievement,
    icons,
    tier,
  };
}

function AchievementIcons({ icons }) {
  if (!icons?.length) {
    return null;
  }

  return (
    <span className="achievement-icons" aria-hidden="true">
      {icons.map((iconName, index) => {
        const config = achievement3dIcons[iconName];
        if (!config) {
          return null;
        }

        return (
          <span className="achievement-icon-shell" key={`${iconName}-${index}`}>
            <img alt={config.alt} className={config.className} src={config.src} />
          </span>
        );
      })}
    </span>
  );
}

function getCountryPriority(code) {
  if (code === 'us') {
    return 1000;
  }

  if (code === 'ro') {
    return 10;
  }

  if (highPriorityCodes.includes(code)) {
    return 500;
  }

  if (mediumPriorityCodes.includes(code)) {
    return 300;
  }

  return 100;
}

function DistinguishedAmbassadorsPage({ page }) {
  const [ambassadors, setAmbassadors] = useState([]);
  const [status, setStatus] = useState('loading');
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [sportFilter, setSportFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const controller = new AbortController();

    const loadAmbassadors = async () => {
      try {
        const response = await fetch('/api/distinguished-ambassadors', {
          cache: 'no-store',
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Distinguished ambassadors request failed with ${response.status}`);
        }

        const payload = await response.json();
        setAmbassadors(Array.isArray(payload.items) ? payload.items : []);
        setStatus('ready');
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }

        setAmbassadors([]);
        setStatus('error');
      }
    };

    loadAmbassadors();
    return () => controller.abort();
  }, []);

  const normalizedAmbassadors = useMemo(() => {
    const merged = [...ambassadors];

    manualAmbassadorEntries.forEach((entry) => {
      const exists = merged.some((item) => String(item.name ?? '').trim().toLowerCase() === entry.name.toLowerCase());
      if (!exists) {
        merged.push({
          ...entry,
          id: `manual-${entry.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        });
      }
    });

    return merged
      .map((item, index) => {
        const name = String(item.name ?? '').trim() || `Ambassador ${index + 1}`;
        const sport = String(item.sport ?? '').trim() || 'Sport not specified';
        const country = String(item.country ?? '').trim() || 'International';
        const resolvedAchievement = getResolvedAchievement(name, item.role);
        const roleMeta = getRoleMeta(resolvedAchievement);
        const countryCode = getCountryCode(country, name);

        return {
          category: roleMeta.category,
          country,
          countryCode,
          countryPriority: getCountryPriority(countryCode),
          id: item.id ?? `${name}-${country}-${index}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name,
          role: resolvedAchievement,
          roleMeta,
          sport,
        };
      })
      .filter((item, index, array) => {
        const key = `${item.name}-${item.country}-${item.sport}`.toLowerCase();
        return array.findIndex((candidate) => `${candidate.name}-${candidate.country}-${candidate.sport}`.toLowerCase() === key) === index;
      });
  }, [ambassadors]);

  const countryOptions = useMemo(() => {
    return [...new Set(normalizedAmbassadors.map((item) => item.country).filter(Boolean))].sort();
  }, [normalizedAmbassadors]);

  const sportOptions = useMemo(() => {
    return [...new Set(normalizedAmbassadors.map((item) => item.sport).filter(Boolean))].sort();
  }, [normalizedAmbassadors]);

  const filteredAmbassadors = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const filtered = normalizedAmbassadors.filter((item) => {
      const name = item.name;
      const country = item.country;
      const sport = item.sport;
      const role = item.role;
      const haystack = `${name} ${country} ${sport} ${role}`.toLowerCase();

      if (query && !haystack.includes(query)) {
        return false;
      }

      if (countryFilter !== 'all' && country !== countryFilter) {
        return false;
      }

      if (sportFilter !== 'all' && sport !== sportFilter) {
        return false;
      }

      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false;
      }

      return true;
    });

    const sorted = [...filtered];
    sorted.sort((left, right) => {
      if (sortBy === 'featured') {
        if (left.roleMeta.tier !== right.roleMeta.tier) {
          return right.roleMeta.tier - left.roleMeta.tier;
        }

        if (left.countryPriority !== right.countryPriority) {
          return right.countryPriority - left.countryPriority;
        }

        return left.name.localeCompare(right.name);
      }

      if (sortBy === 'name-desc') {
        return right.name.localeCompare(left.name);
      }

      if (sortBy === 'country-asc') {
        return left.country.localeCompare(right.country);
      }

      if (sortBy === 'sport-asc') {
        return left.sport.localeCompare(right.sport);
      }

      return left.name.localeCompare(right.name);
    });

    return sorted;
  }, [categoryFilter, countryFilter, normalizedAmbassadors, searchTerm, sortBy, sportFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredAmbassadors.length / ambassadorsPerPage));
  const paginatedAmbassadors = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * ambassadorsPerPage;
    return filteredAmbassadors.slice(start, start + ambassadorsPerPage);
  }, [currentPage, filteredAmbassadors, totalPages]);
  const visibleRangeStart = filteredAmbassadors.length === 0 ? 0 : (currentPage - 1) * ambassadorsPerPage + 1;
  const visibleRangeEnd = Math.min(currentPage * ambassadorsPerPage, filteredAmbassadors.length);

  const athleteCount = useMemo(() => normalizedAmbassadors.filter((item) => item.category === 'athlete').length, [normalizedAmbassadors]);
  const mentorCount = useMemo(() => normalizedAmbassadors.filter((item) => item.category === 'mentor').length, [normalizedAmbassadors]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, countryFilter, sportFilter, categoryFilter, sortBy]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <section className="content-page">
      <ContentPageHero alt={page.title} src={page.image} />

      <div className="section content-page__body" data-aos="fade-up">
        <div className="content-page__intro">
          <div>
            <p className="content-page__eyebrow">{page.eyebrow}</p>
            <h1>{page.title}</h1>
          </div>
          <p className="content-page__lead">{page.lead}</p>
        </div>

        <div className="content-page__flow">
          <div className="content-page__copy">
            {page.paragraphs?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <section className="ambassadors-directory">
            <div className="ambassadors-directory__head">
              <div>
                <p className="content-page__eyebrow">Live Directory</p>
                <h2 className="ambassadors-directory__title">Distinguished Ambassadors Registry</h2>
                <p className="ambassadors-directory__meta">
                  {status === 'loading'
                    ? 'Loading ambassador records...'
                    : `${filteredAmbassadors.length} of ${normalizedAmbassadors.length} ambassadors shown`}
                </p>
              </div>

              <button
                className="ambassadors-directory__reset"
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setCountryFilter('all');
                  setSportFilter('all');
                  setCategoryFilter('all');
                  setSortBy('featured');
                }}
              >
                Reset filters
              </button>
            </div>

            {status === 'error' ? (
              <p className="ambassadors-directory__empty">
                Ambassador records could not be loaded right now.
              </p>
            ) : status === 'loading' ? (
              <p className="ambassadors-directory__empty">Loading ambassador records...</p>
            ) : (
              <>
                <div className="ambassadors-directory__summary">
                  <span>{athleteCount} athlete profiles</span>
                  <span>{mentorCount} coach and mentor profiles</span>
                  <span>{totalPages} pages</span>
                </div>

                <div className="ambassadors-directory__filters">
                  <label className="ambassadors-filter">
                    <span>Search</span>
                    <input
                      type="search"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search by name, sport, role, country"
                    />
                  </label>

                  <label className="ambassadors-filter">
                    <span>Country</span>
                    <select value={countryFilter} onChange={(event) => setCountryFilter(event.target.value)}>
                      <option value="all">All countries</option>
                      {countryOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="ambassadors-filter">
                    <span>Sport</span>
                    <select value={sportFilter} onChange={(event) => setSportFilter(event.target.value)}>
                      <option value="all">All sports</option>
                      {sportOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="ambassadors-filter">
                    <span>Category</span>
                    <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                      <option value="all">All categories</option>
                      <option value="athlete">Athletes</option>
                      <option value="mentor">Coaches and mentors</option>
                    </select>
                  </label>

                  <label className="ambassadors-filter">
                    <span>Sort</span>
                    <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                      <option value="featured">Featured ranking</option>
                      <option value="name-asc">Name A-Z</option>
                      <option value="name-desc">Name Z-A</option>
                      <option value="country-asc">Country A-Z</option>
                      <option value="sport-asc">Sport A-Z</option>
                    </select>
                  </label>
                </div>

                {filteredAmbassadors.length === 0 ? (
                  <p className="ambassadors-directory__empty">
                    No ambassadors match the current filters.
                  </p>
                ) : (
                  <div className="ambassadors-table-shell">
                    <table className="ambassadors-table">
                      <thead>
                        <tr>
                          <th scope="col">Rank</th>
                          <th scope="col">Name</th>
                          <th scope="col">Country</th>
                          <th scope="col">Sport</th>
                          <th scope="col">Achievement</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedAmbassadors.map((ambassador, index) => {
                          const sportIcon = getSportIcon(ambassador.sport);
                          const tableIndex = (currentPage - 1) * ambassadorsPerPage + index + 1;

                          return (
                            <tr key={ambassador.id}>
                              <td>
                                <span className="ambassador-rank">#{tableIndex}</span>
                              </td>
                              <td>
                                <div className="ambassador-cell ambassador-cell--name">
                                  <span className="ambassador-cell__flag" aria-hidden="true">
                                    {getCountryFlag(ambassador.countryCode)}
                                  </span>
                                  <span className="ambassador-cell__name">{ambassador.name}</span>
                                </div>
                              </td>
                              <td>{ambassador.country}</td>
                              <td>
                                <span className="ambassador-pill">
                                  <span aria-label={sportIcon.label} role="img">
                                    {sportIcon.symbol}
                                  </span>
                                  <span>{ambassador.sport}</span>
                                </span>
                              </td>
                              <td>
                                <span className="ambassador-pill ambassador-pill--role">
                                  <AchievementIcons icons={ambassador.roleMeta.icons} />
                                  <span>{ambassador.roleMeta.cleanTitle}</span>
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {filteredAmbassadors.length > 0 ? (
                  <div className="ambassadors-pagination">
                    <button type="button" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                      First
                    </button>
                    <button type="button" onClick={() => setCurrentPage((pageNumber) => Math.max(1, pageNumber - 1))} disabled={currentPage === 1}>
                      Prev
                    </button>
                    <span className="ambassadors-pagination__info">
                      {visibleRangeStart}-{visibleRangeEnd} of {filteredAmbassadors.length} | Page {currentPage} / {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentPage((pageNumber) => Math.min(totalPages, pageNumber + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                    <button type="button" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                      Last
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}

function ImpactPage({ onDonateClick }) {
  return (
    <>
      <section className="impact-page">
        <div className="impact-page__hero">
          <BlurImageFrame
            alt="Athletes leading change"
            className="impact-page__image"
            src="https://unitedathletesforpeace.org/cdn/shop/files/pexels-runffwpu-3554634_1200x400.jpg?v=1765126122"
          />
          <div className="impact-page__scrim" />
        </div>

        <div className="section impact-page__body" data-aos="fade-up">
          <div className="impact-page__intro">
            <div>
              <p className="impact-page__eyebrow">Our Impact</p>
              <h1>Sport becomes credible civic infrastructure when it protects dignity and visibility.</h1>
            </div>
            <div className="impact-page__lead">
              <p>
                This page adapts the original impact content to the current site language: cleaner,
                calmer, and more institutional. The focus stays on outcomes, not storefront
                effects.
              </p>
              <button className="button button--primary" type="button" onClick={onDonateClick}>
                Support the Mission
              </button>
            </div>
          </div>

          <section className="impact-page__section">
            <div className="impact-page__copy">
              {impactNarrative.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="impact-page__section">
            <div className="impact-page__section-head">
              <p className="impact-page__eyebrow">Our Programs</p>
              <h2>Where the work becomes visible</h2>
            </div>

            <div className="impact-programs">
              {impactPrograms.map((program) => (
                <article className="impact-program" key={program.text}>
                  <BlurImageFrame alt="" className="impact-program__image" src={program.image} />
                  <p>{program.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="impact-page__section">
            <blockquote className="impact-quote">
              <p>We champion for tomorrow.</p>
              <p>We champion for lasting peace.</p>
              <p>We champion for world peace.</p>
            </blockquote>
          </section>
        </div>
      </section>
    </>
  );
}

function ConflictMap({ selectedZoneId, zones }) {
  const mapElementRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef(new Map());

  const createMarkerMarkup = (zone) => {
    const severityClass =
      zone.region === 'middle-east' || zone.region === 'africa'
        ? 'is-high'
        : zone.region === 'europe'
          ? 'is-medium'
          : 'is-low';

    return `
      <div class="crisis-marker ${severityClass}" data-zone="${zone.id}">
        <span class="crisis-marker__pulse"></span>
        <span class="crisis-marker__ring"></span>
        <span class="crisis-marker__core"></span>
      </div>
    `;
  };

  useEffect(() => {
    if (!mapElementRef.current || mapInstanceRef.current) {
      return undefined;
    }

    let isCancelled = false;
    let nextMap = null;

    const initMap = async () => {
      const L = await import('leaflet');
      if (isCancelled || !mapElementRef.current) {
        return;
      }

      const map = L.map(mapElementRef.current, {
        attributionControl: false,
        boxZoom: false,
        doubleClickZoom: false,
        dragging: true,
        keyboard: false,
        scrollWheelZoom: false,
        tap: false,
        touchZoom: true,
        zoomControl: false,
      }).setView([20, 0], 2);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '',
        subdomains: 'abcd',
      }).addTo(map);

      const bounds = [];

      zones.forEach((zone) => {
        const marker = L.marker(zone.coordinates, {
          icon: L.divIcon({
            className: 'crisis-marker-wrapper',
            html: createMarkerMarkup(zone),
            iconSize: [34, 34],
            iconAnchor: [17, 17],
            popupAnchor: [0, -16],
          }),
        })
          .addTo(map)
          .bindPopup(`<strong>${zone.name}</strong><br/>${zone.description}`);

        markersRef.current.set(zone.id, marker);
        bounds.push(zone.coordinates);
      });

      map.fitBounds(bounds, { padding: [28, 28] });
      mapInstanceRef.current = map;
      nextMap = map;
      window.requestAnimationFrame(() => {
        map.invalidateSize();
      });
    };

    initMap();

    return () => {
      isCancelled = true;
      if (nextMap) {
        nextMap.remove();
      }
      mapInstanceRef.current = null;
      markersRef.current.clear();
    };
  }, [zones]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const marker = selectedZoneId ? markersRef.current.get(selectedZoneId) : null;

    markersRef.current.forEach((entry, zoneId) => {
      const element = entry.getElement();
      if (!element) return;
      element.classList.toggle('is-selected', zoneId === selectedZoneId);
    });

    if (!marker || !map) return;
    map.setView(marker.getLatLng(), 5, { animate: true, duration: 1.2 });
    marker.openPopup();
  }, [selectedZoneId]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return undefined;

    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);

    const timeoutId = window.setTimeout(() => {
      map.invalidateSize();
    }, 180);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.clearTimeout(timeoutId);
    };
  }, []);

  return <div className="map" ref={mapElementRef} />;
}

function DonationModal({
  customAmount,
  formError,
  isOpen,
  message,
  onAmountSelect,
  onClose,
  onCustomAmountChange,
  onMessageChange,
  onSubmit,
  selectedAmount,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        aria-modal="true"
        className="modal"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <button aria-label="Close donation modal" className="modal__close" type="button" onClick={onClose}>
          ×
        </button>
        <p className="eyebrow">Contribution</p>
        <h2>Support the mission with a direct donation.</h2>
        <p className="modal__copy">
          Choose a contribution level or enter a custom amount. This local prototype confirms the
          donation flow and presentation.
        </p>
        <div className="modal__tiers">
          {donationTiers.map((tier) => (
            <button
              className={selectedAmount === tier.value ? 'is-selected' : ''}
              key={tier.value}
              type="button"
              onClick={() => onAmountSelect(tier.value)}
            >
              <strong>${tier.value}</strong>
              <span>{tier.label}</span>
            </button>
          ))}
        </div>
        <input
          min="1"
          placeholder="Enter custom amount"
          type="number"
          value={customAmount}
          onChange={(event) => onCustomAmountChange(event.target.value)}
        />
        <textarea
          placeholder="Optional note"
          rows="4"
          value={message}
          onChange={(event) => onMessageChange(event.target.value)}
        />
        {formError ? <p className="modal__error">{formError}</p> : null}
        <div className="modal__actions">
          <button className="button button--text" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="button button--primary" type="button" onClick={onSubmit}>
            Confirm Donation
          </button>
        </div>
      </div>
    </div>
  );
}

function VolunteerFormModal({
  error,
  form,
  isOpen,
  onClose,
  onFieldChange,
  onSubmit,
  role,
  successRole,
}) {
  if (!isOpen) return null;

  if (successRole) {
    return (
      <div className="volunteer-modal-backdrop" role="presentation" onClick={onClose}>
        <div
          aria-modal="true"
          className="volunteer-modal volunteer-modal--success"
          role="dialog"
          onClick={(event) => event.stopPropagation()}
        >
          <button aria-label="Close volunteer form" className="volunteer-modal__close" type="button" onClick={onClose}>
            ×
          </button>
          <div className="volunteer-success">
            <div className="volunteer-success__badge" aria-hidden="true">
              ✓
            </div>
            <p className="eyebrow">Application Received</p>
            <h2>Congratulations</h2>
            <p className="volunteer-success__lead">
              Your {successRole.title} application has been captured successfully.
            </p>
            <p className="volunteer-success__copy">
              Thank you for stepping forward. Your interest in supporting athletes, peace, and
              inclusion matters. The next step can now be reviewed with the organization.
            </p>
            <div className="volunteer-success__actions">
              <button className="button button--text" type="button" onClick={onClose}>
                Close
              </button>
              <button className="button button--primary" type="button" onClick={onClose}>
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!role) return null;

  const config = volunteerFormConfigs[role.title];
  const fields = config?.fields ?? [];

  return (
    <div className="volunteer-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        aria-modal="true"
        className="volunteer-modal"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <button aria-label="Close volunteer form" className="volunteer-modal__close" type="button" onClick={onClose}>
          ×
        </button>
        <div className="volunteer-modal__grid">
          <div className="volunteer-modal__summary">
            {role.image ? <BlurImageFrame alt={role.title} className="volunteer-modal__image" src={role.image} /> : null}
            <p className="eyebrow">Join Our Movement</p>
            <h2>{role.title}</h2>
            {role.subtitle ? <h3>{role.subtitle}</h3> : null}
            <p className="volunteer-modal__copy">{role.text}</p>
          </div>

          <form className="volunteer-form" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
            <div className="volunteer-form__head">
              <h2>{config?.title ?? 'Application'}</h2>
            </div>

            <div className="volunteer-form__fields">
              {fields.map((field) => (
                field.type === 'textarea' ? (
                  <label className="volunteer-form__field volunteer-form__field--full" key={field.name}>
                    <span>{field.label}</span>
                    <textarea
                      required={field.required}
                      rows="5"
                      value={form[field.name] ?? ''}
                      onChange={(event) => onFieldChange(field.name, event.target.value)}
                    />
                  </label>
                ) : field.type === 'select' ? (
                  <label className="volunteer-form__field" key={field.name}>
                    <span>{field.label}</span>
                    <select
                      required={field.required}
                      value={form[field.name] ?? ''}
                      onChange={(event) => onFieldChange(field.name, event.target.value)}
                    >
                      <option value="">Select</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <label className="volunteer-form__field" key={field.name}>
                    <span>{field.label}</span>
                    <input
                      inputMode={field.type === 'number' ? 'numeric' : undefined}
                      required={field.required}
                      type={field.type}
                      value={form[field.name] ?? ''}
                      onChange={(event) => onFieldChange(field.name, event.target.value)}
                    />
                  </label>
                )
              ))}
            </div>
            {error ? <p className="modal__error">{error}</p> : null}
            <div className="volunteer-form__actions">
              <button className="button button--text" type="button" onClick={onClose}>
                Cancel
              </button>
              <button className="button button--primary" type="submit">
                Apply
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
