/* ============================================================
   Member School Directory & Legal Records
   All Orissa Private Secondary Training Schools Management Association
   ============================================================ */

export interface Zone {
  id: string;
  name: string;
  districts: string;
  schoolCount: number;
  badge: string;
  status: string;
  pending?: boolean;
}

export interface School {
  name: string;
  zone: string;
  district: string;
  slNo?: number;
}

export interface DocumentRecord {
  ref: string;
  year: string;
  title: string;
  note: string;
  file: string;
  category: 'court_order' | 'department_letter' | 'notice';
  badge?: string;
  date?: string;
  court?: string;
  petitioner?: string;
  respondent?: string;
  bench?: string;
  image?: string;
  operativeParagraph?: string;
}

export const ZONES: Zone[] = [
  {
    id: 'balasore',
    name: 'Baleswar Zone',
    districts: 'Mayurbhanj, Keonjhar, Balasore, Bhadrak',
    schoolCount: 40,
    badge: 'North Coastal & Tribal Range',
    status: 'Active Registered Zone (40 Institutions)'
  },
  {
    id: 'central',
    name: 'Central Zone',
    districts: 'Cuttack, Kendrapara, Jajpur, Dhenkanal, Angul',
    schoolCount: 24,
    badge: 'Judicial & Mahanadi Belt',
    status: 'High Court Jurisdiction (24 Institutions)'
  },
  {
    id: 'bhubaneswar',
    name: 'Bhubaneswar Zone',
    districts: 'Khordha, Nayagarh, Puri (State Capital HQ)',
    schoolCount: 15,
    badge: 'State Secretariat & Apex Liaison',
    status: 'Central Command & Secretariat (15 Institutions)'
  },
  {
    id: 'sambalpur',
    name: 'Sambalpur Zone',
    districts: 'Sambalpur, Sundargarh, Bargarh, Jharsuguda',
    schoolCount: 9,
    badge: 'Western Range',
    status: 'Western Educational Division (9 Institutions)'
  },
  {
    id: 'ganjam',
    name: 'Berhampur Zone',
    districts: 'Ganjam, Gajapati, Southern Range',
    schoolCount: 2,
    badge: 'Southern Coastal Division',
    status: 'Southern Regional Registry (2 Institutions)'
  }
];

export const SCHOOLS: School[] = [
  // ==================== BHUBANESWAR ZONE (15 Schools) ====================
  { slNo: 1,  name: 'Rajadhani School Of Education', zone: 'bhubaneswar', district: 'Bhubaneswar, Khordha' },
  { slNo: 2,  name: 'Odisha Nobel C.T School', zone: 'bhubaneswar', district: 'Khordha' },
  { slNo: 3,  name: 'Lingaraj Secondary Training School', zone: 'bhubaneswar', district: 'Khordha' },
  { slNo: 4,  name: 'Anjali Education', zone: 'bhubaneswar', district: 'Khordha' },
  { slNo: 5,  name: 'Anchalika Secondary Training School', zone: 'bhubaneswar', district: 'Nayagarh' },
  { slNo: 6,  name: 'Bapuji Education Complex', zone: 'bhubaneswar', district: 'Khordha' },
  { slNo: 7,  name: 'Bani Bandana Secondary Training School', zone: 'bhubaneswar', district: 'Khordha' },
  { slNo: 8,  name: 'Sri Lokanath Secondary Training School', zone: 'bhubaneswar', district: 'Puri / Khordha' },
  { slNo: 9,  name: 'Panchagat Secondary Training School', zone: 'bhubaneswar', district: 'Khordha' },
  { slNo: 10, name: 'Education Universe', zone: 'bhubaneswar', district: 'Bhubaneswar' },
  { slNo: 11, name: 'Kalinga Bharati Secondary Training School', zone: 'bhubaneswar', district: 'Khordha' },
  { slNo: 12, name: 'Abhiram Secondary Training School', zone: 'bhubaneswar', district: 'Khordha' },
  { slNo: 13, name: 'Samanta Education', zone: 'bhubaneswar', district: 'Bhubaneswar' },
  { slNo: 14, name: 'Sree Maa Secondary Training School', zone: 'bhubaneswar', district: 'Khordha' },
  { slNo: 15, name: 'Sahaja Pur Secondary Training School', zone: 'bhubaneswar', district: 'Khordha' },

  // ==================== BERHAMPUR ZONE (2 Schools) ====================
  { slNo: 1, name: 'Sri Aurobinda Secondary Training School', zone: 'ganjam', district: 'Ganjam' },
  { slNo: 2, name: 'Maa Bhagabati Secondary Training School', zone: 'ganjam', district: 'Ganjam' },

  // ==================== CENTRAL ZONE (24 Schools) ====================
  { slNo: 1,  name: 'Jagannath Secondary Training School', zone: 'central', district: 'Cuttack' },
  { slNo: 2,  name: 'Bhadreswar Secondary Training School', zone: 'central', district: 'Cuttack' },
  { slNo: 3,  name: 'Kaduapada Secondary Training School', zone: 'central', district: 'Jagatsinghpur / Cuttack' },
  { slNo: 4,  name: 'Tulasi Secondary Training School', zone: 'central', district: 'Kendrapara' },
  { slNo: 5,  name: 'Dhaniso Secondary Training School', zone: 'central', district: 'Cuttack' },
  { slNo: 6,  name: 'Bagdevi Secondary Training School', zone: 'central', district: 'Cuttack' },
  { slNo: 7,  name: 'Derabis Secondary Training School', zone: 'central', district: 'Kendrapara' },
  { slNo: 8,  name: 'Binapani Secondary Training School', zone: 'central', district: 'Cuttack' },
  { slNo: 9,  name: 'Artreswar Secondary Training School', zone: 'central', district: 'Cuttack' },
  { slNo: 10, name: 'Mahabir Secondary Training School', zone: 'central', district: 'Cuttack' },
  { slNo: 11, name: 'Uchhabeswara Secondary Training School', zone: 'central', district: 'Cuttack' },
  { slNo: 12, name: 'Kantabania Secondary Training School', zone: 'central', district: 'Dhenkanal' },
  { slNo: 13, name: 'Alakunda Secondary Training School', zone: 'central', district: 'Jajpur' },
  { slNo: 14, name: 'Biraja Secondary Training School', zone: 'central', district: 'Jajpur' },
  { slNo: 15, name: 'Regional School of Secondary Training & Farmastical School', zone: 'central', district: 'Cuttack' },
  { slNo: 16, name: 'Mahima Secondary Training School', zone: 'central', district: 'Dhenkanal' },
  { slNo: 17, name: 'Astasambhu Secondary Training School', zone: 'central', district: 'Dhenkanal' },
  { slNo: 18, name: 'Acharya Harihar Secondary Training School', zone: 'central', district: 'Cuttack' },
  { slNo: 19, name: 'Sadashiba Secondary Training School', zone: 'central', district: 'Cuttack' },
  { slNo: 20, name: 'Kameswar Secondary Training School', zone: 'central', district: 'Cuttack' },
  { slNo: 21, name: 'Kanakeswari Secondary Training School', zone: 'central', district: 'Cuttack' },
  { slNo: 22, name: 'Gadamandal Secondary Training School', zone: 'central', district: 'Cuttack' },
  { slNo: 23, name: 'Bagedia Secondary Training School', zone: 'central', district: 'Angul' },
  { slNo: 24, name: 'Mangarajpur Secondary Training School', zone: 'central', district: 'Cuttack' },

  // ==================== BALESWAR ZONE (40 Schools) ====================
  { slNo: 1,  name: 'Basudevpur Secondary Training School', zone: 'balasore', district: 'Bhadrak' },
  { slNo: 2,  name: 'Sonalpur Secondary Training School', zone: 'balasore', district: 'Bhadrak' },
  { slNo: 3,  name: 'Anchalika Secondary Training School', zone: 'balasore', district: 'Bhadrak' },
  { slNo: 4,  name: 'Sri Jagannath Secondary Training School', zone: 'balasore', district: 'Bhadrak' },
  { slNo: 5,  name: 'Jagabandhu Secondary Training School', zone: 'balasore', district: 'Bhadrak' },
  { slNo: 6,  name: 'Jagannath Secondary Training School', zone: 'balasore', district: 'Balasore' },
  { slNo: 7,  name: 'Madan Mohan Secondary Training School', zone: 'balasore', district: 'Balasore' },
  { slNo: 8,  name: 'Narasinghpur Secondary Training School', zone: 'balasore', district: 'Balasore' },
  { slNo: 9,  name: 'Chandimata Secondary Training School', zone: 'balasore', district: 'Balasore' },
  { slNo: 10, name: 'Badama Secondary Training School', zone: 'balasore', district: 'Kendujhar' },
  { slNo: 11, name: 'Dahamunda Secondary Training School', zone: 'balasore', district: 'Balasore' },
  { slNo: 12, name: 'Jagabandhu Secondary Training School (Naliapal)', zone: 'balasore', district: 'Balasore' },
  { slNo: 13, name: 'Adhakpanka Secondary Training School', zone: 'balasore', district: 'Bhadrak' },
  { slNo: 14, name: 'New See Adhalpanka Secondary Training School', zone: 'balasore', district: 'Bhadrak' },
  { slNo: 15, name: 'Gadama Secondary Training School', zone: 'balasore', district: 'Kendujhar' },
  { slNo: 16, name: 'Dahamunda Secondary Training School (Unit 2)', zone: 'balasore', district: 'Balasore' },
  { slNo: 17, name: 'Nandakishore Secondary Training School', zone: 'balasore', district: 'Balasore' },
  { slNo: 18, name: 'SwarnaChanda Secondary Training School', zone: 'balasore', district: 'Balasore' },
  { slNo: 19, name: 'Talapada Secondary Training School', zone: 'balasore', district: 'Balasore' },
  { slNo: 20, name: 'Laxmipriya Secondary Training School', zone: 'balasore', district: 'Balasore' },
  { slNo: 21, name: 'Kanhu Charan Secondary Training School', zone: 'balasore', district: 'Balasore' },
  { slNo: 22, name: 'Binapani Secondary Training School', zone: 'balasore', district: 'Balasore' },
  { slNo: 23, name: 'Debagini Secondary Training School (Gopinathpur)', zone: 'balasore', district: 'Balasore' },
  { slNo: 24, name: 'Debangini Secondary Training School (Mangalpur)', zone: 'balasore', district: 'Balasore' },
  { slNo: 25, name: 'Mahamahina Secondary Training School', zone: 'balasore', district: 'Balasore' },
  { slNo: 26, name: 'Bhagabat Prasad Secondary Training School', zone: 'balasore', district: 'Balasore' },
  { slNo: 27, name: 'Durgapur Secondary Training School', zone: 'balasore', district: 'Mayurbhanj' },
  { slNo: 28, name: 'B P Education Center', zone: 'balasore', district: 'Mayurbhanj' },
  { slNo: 29, name: 'Mayurbhanj Secondary Training School', zone: 'balasore', district: 'Mayurbhanj' },
  { slNo: 30, name: 'Gadapandab Secondary Training School', zone: 'balasore', district: 'Mayurbhanj' },
  { slNo: 31, name: 'Purnima Secondary Training School', zone: 'balasore', district: 'Mayurbhanj' },
  { slNo: 32, name: 'Renubala Secondary Training School', zone: 'balasore', district: 'Mayurbhanj' },
  { slNo: 33, name: 'Regional Secondary Training School', zone: 'balasore', district: 'Mayurbhanj' },
  { slNo: 34, name: 'Newlife Secondary Training School', zone: 'balasore', district: 'Mayurbhanj' },
  { slNo: 35, name: 'Balia Jadupur Secondary Training School', zone: 'balasore', district: 'Balasore' },
  { slNo: 36, name: 'Purusottam Secondary Training School', zone: 'balasore', district: 'Mayurbhanj' },
  { slNo: 37, name: 'Sri Aurobindo Secondary Training School', zone: 'balasore', district: 'Mayurbhanj' },
  { slNo: 38, name: 'Aguad Secondary Training School', zone: 'balasore', district: 'Mayurbhanj' },
  { slNo: 39, name: 'Ajan Secondary Training School', zone: 'balasore', district: 'Mayurbhanj' },
  { slNo: 40, name: 'Sugo Secondary Training School', zone: 'balasore', district: 'Balasore / Mayurbhanj' },

  // ==================== SAMBALPUR ZONE (9 Schools) ====================
  { slNo: 1, name: 'Baliguda Secondary Training School', zone: 'sambalpur', district: 'Sundargarh' },
  { slNo: 2, name: 'Madhusudan Secondary Training School', zone: 'sambalpur', district: 'Sambalpur' },
  { slNo: 3, name: 'Saradhapur Secondary Training School', zone: 'sambalpur', district: 'Sambalpur' },
  { slNo: 4, name: 'Maa Samaleswari Secondary Training School', zone: 'sambalpur', district: 'Sambalpur' },
  { slNo: 5, name: 'Khonda Secondary Training School', zone: 'sambalpur', district: 'Sundargarh' },
  { slNo: 6, name: 'Brahmani Secondary Training School', zone: 'sambalpur', district: 'Sundargarh' },
  { slNo: 7, name: 'Gopana Secondary Training School', zone: 'sambalpur', district: 'Sundargarh' },
  { slNo: 8, name: 'SaleiBahala Secondary Training School', zone: 'sambalpur', district: 'Sambalpur' },
  { slNo: 9, name: 'Lucky Secondary Training School', zone: 'sambalpur', district: 'Sambalpur' }
];

export const DOCUMENTS: DocumentRecord[] = [
  // ==================== AUTHENTIC HIGH COURT JUDGMENTS & WRIT PETITIONS ====================
  {
    ref: '5640',
    year: '2009',
    title: 'Writ Petition (C) No. 5640 of 2009',
    note: 'Orissa High Court — Landmark Final Judgment dated 25.03.2010 by The Hon’ble Shri Justice M. M. Das securing examination appearance and affiliation rights',
    file: 'orissa-high-court-wp-5640-2009-judgment.pdf',
    category: 'court_order',
    badge: 'Landmark Judgment',
    date: '25th March 2010',
    court: 'IN THE HIGH COURT OF ORISSA AT CUTTACK',
    petitioner: 'All Orissa Private Secondary Training Schools Management Association represented by its General Secretary Raj Kishore Jena',
    respondent: 'State of Orissa represented through Secy School & Mass Education Dept., Director Secondary Education & Board of Secondary Education (BSE) Cuttack',
    bench: 'The Honourable Shri Justice M. M. Das',
    image: '/assets/img/judgments/wp-5640-2009-judgment-frontpage.jpg',
    operativeParagraph: 'In the interest of justice, the opposite parties should be directed to examine as to whether the institutions which are members of the petitioner-association had the infrastructure facilities for imparting such course and as to whether, as a matter of fact, students completed their course in those schools. If on inquiry findings are in the affirmative, the Government may consider allowing such students to appear in future examination in the C.T course. While considering thus, the Government should also take into account as to whether any prior approval or affiliation was necessary of any University or Board for imparting such course. The writ petition is accordingly disposed of.'
  },
  {
    ref: '10372',
    year: '2008',
    title: 'Writ Petition (C) No. 10372 of 2008',
    note: 'Orissa High Court — Historic Order dated 24.09.2008 (corrected 12.12.2008) by Hon’ble Justice M. M. Das protecting candidate eligibility',
    file: 'orissa-high-court-wp-5640-2009-judgment.pdf',
    category: 'court_order',
    badge: 'High Court Order',
    date: '24th September 2008',
    court: 'IN THE HIGH COURT OF ORISSA AT CUTTACK',
    petitioner: 'All Orissa Private Secondary Training Schools Management Association represented by General Secretary Raj Kishore Jena',
    respondent: 'State of Orissa, S&ME Dept. & Director Secondary Education',
    bench: 'The Honourable Shri Justice M. M. Das',
    image: '/assets/img/judgments/wp-10372-2008-order-p1.jpg',
    operativeParagraph: 'Heard learned counsel for the petitioner and the learned counsel for the State. Considering the case of the petitioner that students in many of the institutions have prosecuted their studies... the opposite parties should be directed to examine infrastructure facilities... findings in affirmative shall allow students to appear in examination.'
  },
  {
    ref: '23411',
    year: '2014',
    title: 'Writ Petition (C) No. 23411 of 2014',
    note: 'Orissa High Court — Original Jurisdiction Petition filed 29.11.2014 challenging arbitrary fee refund directives & protecting association member deposits',
    file: 'orissa-high-court-wp-5640-2009-judgment.pdf',
    category: 'court_order',
    badge: 'Writ Petition',
    date: '29th November 2014',
    court: 'IN THE HIGH COURT OF ORISSA AT CUTTACK',
    petitioner: 'All Orissa Private Secondary Training School Management Association represented through Secy. Shri Raj Kishore Jena',
    respondent: 'State of Orissa represented through its Secy, School and Mass Education Dept. & Board of Secondary Education',
    bench: 'Hon’ble Division Bench of Orissa High Court',
    image: '/assets/img/judgments/wp-23411-2014-frontpage.jpg',
    operativeParagraph: 'An application challenging the arbitrary action of the O.P. No. 1 in directing the board to take action to refund the examination fees already deposited by the petitioner’s association; ensuring association legitimacy and safeguarding student fees.'
  },
  {
    ref: 'SC/SLP',
    year: '2012',
    title: 'Supreme Court Order on Appeal',
    note: 'Supreme Court of India — Affirmation of member institutions rights and examination validity',
    file: 'orissa-high-court-wp-5640-2009-judgment.pdf',
    category: 'court_order',
    badge: 'Supreme Court',
    date: '2012',
    court: 'SUPREME COURT OF INDIA, NEW DELHI',
    petitioner: 'AOPSTSMA & Member Institutions',
    respondent: 'State of Odisha & Ors.'
  },

  // ==================== DEPARTMENTAL LETTERS & GOVT NOTIFICATIONS ====================
  {
    ref: 'CO-08',
    year: '2014',
    title: 'Considered Order on Secondary Training Schools',
    note: 'School and Mass Education Department, Govt. of Odisha — Regulatory compliance and recognition framework',
    file: '',
    category: 'department_letter',
    badge: 'Govt Order',
    date: '2014'
  },
  {
    ref: 'BL-219',
    year: '2016',
    title: 'Board Letter on Exam Center Allocation',
    note: 'Board of Secondary Education (BSE), Odisha — Examination center allocation for private CT institutions',
    file: '',
    category: 'department_letter',
    badge: 'Board Letter',
    date: '2016'
  },
  {
    ref: 'NC-45',
    year: '2018',
    title: 'Note to Cabinet on Policy Framing',
    note: 'General Administration & S&ME Dept, Government of Odisha — Comprehensive policy for teacher training institutions',
    file: '',
    category: 'department_letter',
    badge: 'Cabinet Note',
    date: '2018'
  },

  // ==================== ASSOCIATION NOTICES & CIRCULARS ====================
  {
    ref: 'AN/26',
    year: '2026',
    title: 'Circular: Member School Directory 2026',
    note: 'Official notice to all five zonal conveners and headmasters regarding updated 90-school directory registration',
    file: '',
    category: 'notice',
    badge: 'Official Circular',
    date: 'Jan 2026'
  },
  {
    ref: 'AN/25',
    year: '2025',
    title: 'Advisory on DIR Renewal & Deposits',
    note: 'Guidelines for submission of renewal files, legal fee contributions, and annual portal registration for 2025-26',
    file: '',
    category: 'notice',
    badge: 'Advisory',
    date: 'Nov 2025'
  }
];
