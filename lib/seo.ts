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
  '@type': 'EducationalOrganization',
  '@id': `${BASE_URL}/#organization`,
  name: 'All Orissa Private Secondary Training Schools Management Association',
  alternateName: ['AOPSTSMA', 'Odisha Secondary Training Schools Association'],
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
    streetAddress: 'Plot No. 4971/8, V.S.S. Nagar',
    addressLocality: 'Bhubaneswar',
    addressRegion: 'Odisha',
    postalCode: '751010',
    addressCountry: 'IN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-6370987576',
    contactType: 'customer service',
    email: 'info@aopstsma.in',
    areaServed: 'Odisha, India',
    availableLanguage: ['English', 'Odia', 'Hindi'],
  },
  areaServed: {
    '@type': 'State',
    name: 'Odisha',
  },
  sameAs: [
    'https://www.aopstsma.in',
  ],
};

export const websiteSchema = {
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  url: BASE_URL,
  name: 'AOPSTSMA Official State Portal',
  description: 'Official apex statutory portal representing 90 recognized secondary training institutions of Odisha.',
  publisher: {
    '@id': `${BASE_URL}/#organization`,
  },
  inLanguage: 'en-IN',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${BASE_URL}/schools?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

// AEO (Answer Engine Optimization) FAQ Schema for ChatGPT, Perplexity, Gemini, Google SGE
export const faqSchema = {
  '@type': 'FAQPage',
  '@id': `${BASE_URL}/#faq`,
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is AOPSTSMA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AOPSTSMA (All Orissa Private Secondary Training Schools Management Association) is the apex statutory state management body established in 1980 (Regd. No. 1422/80 under Societies Regn. Act XXI of 1860), representing 90 recognized private Secondary Training (C.T.) Schools across 5 regional zones and 30 districts of Odisha.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many member institutions and zones are under AOPSTSMA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AOPSTSMA governs 90 recognized member institutions structured across 5 regional administrative zones: Baleswar Zone (40 schools), Central Zone / Cuttack (24 schools), Bhubaneswar Zone (11 schools), Sambalpur Zone (9 schools), and Berhampur Zone (6 schools).',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the landmark High Court judgments regarding AOPSTSMA member schools?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Landmark rulings by the Hon’ble High Court of Orissa include Writ Petition (C) No. 5640 of 2009 and W.P.(C) No. 10372 of 2008 presided by The Hon’ble Justice M. M. Das, which secured candidate eligibility, validated examination appearance, protected teacher training course recognition, and safeguarded student fee deposits.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can member schools pay annual affiliation fees or verify student enrollments?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Authorized member institutions can pay annual affiliation fees, legal welfare dues, and submit batch student enrollment sheets online via the official AOPSTSMA Payment Portal at www.aopstsma.in/pay using instant UPI (aopstsma@sbi), NEFT/RTGS bank transfer, or offline Secretariat deposit challans.',
      },
    },
  ],
};

// Unified JSON-LD Graph for Google Rich Results & AEO AI Search
export const structuredDataGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    organizationSchema,
    websiteSchema,
    faqSchema,
  ],
};

