import type { Metadata } from 'next';

export const BASE_URL = 'https://www.aopstsma.in';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'AOPSTSMA — All Orissa Private Secondary Training Schools Management Association (Estd. 1980)',
    template: '%s | AOPSTSMA Official State Portal',
  },
  description:
    'Official apex statutory portal of All Orissa Private Secondary Training Schools Management Association (Regd No. 1422/80). Representing 90 recognized member institutions across 5 administrative zones of Odisha. High Court precedent decrees, student fee verification, and government circulars.',
  keywords: [
    'AOPSTSMA',
    'All Orissa Private Secondary Training Schools Management Association',
    'Odisha Teacher Training Schools',
    'Secondary Training School Odisha',
    'CT School Odisha Registration',
    'Orissa High Court School Precedent Judgment',
    'S&ME Department Odisha Circulars',
    'Bhubaneswar Zone Member Schools',
    'Baleswar Zone Member Schools',
    'Cuttack Zone Member Schools',
    'Sambalpur Zone Member Schools',
    'Berhampur Zone Member Schools',
    'Teacher Training College Fee Portal Odisha',
  ],
  authors: [{ name: 'AOPSTSMA Central Secretariat' }],
  creator: 'AOPSTSMA Secretariat',
  publisher: 'All Orissa Private Secondary Training Schools Management Association',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: BASE_URL,
    siteName: 'AOPSTSMA Official Portal',
    title: 'AOPSTSMA — All Orissa Private Secondary Training Schools Management Association',
    description:
      'Apex statutory management association representing 90 recognized private secondary teacher training schools in Odisha since 1980.',
    images: [
      {
        url: `${BASE_URL}/assets/img/aopstsma-seal.jpg`,
        width: 1200,
        height: 630,
        alt: 'AOPSTSMA Official Emblem & Seal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AOPSTSMA — Apex Teacher Education Body of Odisha',
    description:
      'Official portal for 90 recognized private secondary training schools across Odisha. High Court landmark orders and verification.',
    images: [`${BASE_URL}/assets/img/aopstsma-seal.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-placeholder-aopstsma',
  },
};

// JSON-LD Structured Data for Google Rich Snippets & AI Engines (AEO)
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  '@id': `${BASE_URL}/#organization`,
  name: 'All Orissa Private Secondary Training Schools Management Association',
  alternateName: 'AOPSTSMA',
  url: BASE_URL,
  logo: `${BASE_URL}/assets/img/aopstsma-seal.jpg`,
  image: `${BASE_URL}/assets/img/aopstsma-seal.jpg`,
  foundingDate: '1980',
  identifier: 'Regd. No. 1422/80',
  registrationDate: '1980',
  description:
    'Apex statutory management association representing 90 recognized private secondary training schools across 5 regional zones and 30 districts of Odisha under Societies Regn. Act XXI of 1860.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bhubaneswar',
    addressRegion: 'Odisha',
    addressCountry: 'IN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-6370987576',
    contactType: 'customer service',
    email: 'info.aopstsma@gmail.com',
    areaServed: 'Odisha, India',
    availableLanguage: ['English', 'Odia'],
  },
  areaServed: {
    '@type': 'State',
    name: 'Odisha',
  },
  sameAs: [
    'https://www.aopstsma.in',
  ],
};
