/* ============================================================
   Member School Directory & Legal Records
   All Orissa Private Secondary Training Schools Management Association
   ============================================================ */

const ZONES = [
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

const SCHOOLS = [
  // Bhubaneswar Zone (15)
  { slNo: 1,  name: 'Rajadhani School Of Education', zone: 'bhubaneswar', district: 'Bhubaneswar, Khordha' },
  { slNo: 2,  name: 'Odisha Nobel C.T School', zone: 'bhubaneswar', district: 'Khordha' },
  { slNo: 3,  name: 'Lingaraj Secondary Training School', zone: 'bhubaneswar', district: 'Khordha' },
  { slNo: 4,  name: 'Anjali Education', zone: 'bhubaneswar', district: 'Khordha' },
  { slNo: 5,  name: 'Anchalika Secondary Training School', zone: 'bhubaneswar', district: 'Nayagarh' },
  { slNo: 6,  name: 'Bapuji Education Complex', zone: 'bhubaneswar', district: 'Puri' },
  { slNo: 7,  name: 'Bani Bandana Secondary Training School', zone: 'bhubaneswar', district: 'Khordha' },
  { slNo: 8,  name: 'Sri Lokanath Secondary Training School', zone: 'bhubaneswar', district: 'Khordha' },
  { slNo: 9,  name: 'Panchayat Secondary Training School', zone: 'bhubaneswar', district: 'Khordha' },
  { slNo: 10, name: 'Education Universe', zone: 'bhubaneswar', district: 'Bhubaneswar' },
  { slNo: 11, name: 'Kalinga Bharati Secondary Training School', zone: 'bhubaneswar', district: 'Khordha' },
  { slNo: 12, name: 'Abhiram Secondary Training School', zone: 'bhubaneswar', district: 'Khordha' },
  { slNo: 13, name: 'Saswat Education', zone: 'bhubaneswar', district: 'Bhubaneswar' },
  { slNo: 14, name: 'Sree Maa Secondary Training School', zone: 'bhubaneswar', district: 'Khordha' },
  { slNo: 15, name: 'Sahaja Pur Secondary Training School', zone: 'bhubaneswar', district: 'Khordha' },

  // Berhampur Zone (2)
  { slNo: 1, name: 'Sri Aurobinda Secondary Training School', zone: 'ganjam', district: 'Berhampur, Ganjam' },
  { slNo: 2, name: 'Maa Bhagabati Secondary Training School', zone: 'ganjam', district: 'Ganjam' },

  // Central Zone (24)
  { slNo: 1,  name: 'Jagannath Secondary Training School', zone: 'central', district: 'Cuttack' },
  { slNo: 2,  name: 'Bhadreswar Secondary Training School', zone: 'central', district: 'Jagatsinghpur' },
  { slNo: 3,  name: 'Kaduapada Secondary Training School', zone: 'central', district: 'Cuttack' },
  { slNo: 4,  name: 'Tulasi Secondary Training School', zone: 'central', district: 'Kendrapara' },
  { slNo: 5,  name: 'Dhaniso Secondary Training School', zone: 'central', district: 'Cuttack' },
  { slNo: 6,  name: 'Bagdevi Secondary Training School', zone: 'central', district: 'Kendrapada' },
  { slNo: 7,  name: 'Derabis Secondary Training School', zone: 'central', district: 'Kendrapara' },
  { slNo: 8,  name: 'Binapani Secondary Training School', zone: 'central', district: 'Cuttack' },
  { slNo: 9,  name: 'Artreswar Secondary Training School', zone: 'central', district: 'Cuttack' },
  { slNo: 10, name: 'Mahabir Secondary Training School', zone: 'central', district: 'Cuttack' },
  { slNo: 11, name: 'Uchhabeswara Secondary Training School', zone: 'central', district: 'Cuttack' },
  { slNo: 12, name: 'Mangarajpur Secondary Training School', zone: 'central', district: 'Cuttack' },
  { slNo: 13, name: 'Kantabania Secondary Training School', zone: 'central', district: 'Jajapur' },
  { slNo: 14, name: 'Alakunda Secondary Training School', zone: 'central', district: 'Jajpur' },
  { slNo: 15, name: 'Biraja Secondary Training School', zone: 'central', district: 'Jajpur' },
  { slNo: 16, name: 'Regional School of Secondary Training & Pharmaceutical School', zone: 'central', district: 'Cuttack' },
  { slNo: 17, name: 'Mahima Secondary Training School', zone: 'central', district: 'Dhenkanal' },
  { slNo: 18, name: 'Astasambhu Secondary Training School', zone: 'central', district: 'Dhenkanal' },
  { slNo: 19, name: 'Acharya Harihar Secondary Training School', zone: 'central', district: 'Cuttack' },
  { slNo: 20, name: 'Sadashibapur Secondary Training School', zone: 'central', district: 'Dhenkanal' },
  { slNo: 21, name: 'Kameswar Secondary Training School', zone: 'central', district: 'Cuttack' },
  { slNo: 22, name: 'Kanakeswari Secondary Training School', zone: 'central', district: 'Cuttack' },
  { slNo: 23, name: 'Gadamandal Secondary Training School', zone: 'central', district: 'Anugul' },
  { slNo: 24, name: 'Bagedia Secondary Training School', zone: 'central', district: 'Angul' },

  // Baleswar Zone (40)
  { slNo: 1,  name: 'Sugo Secondary Training School', zone: 'balasore', district: 'Baleswar' },
  { slNo: 2,  name: 'Basudevpur Secondary Training School', zone: 'balasore', district: 'Bhadrak' },
  { slNo: 3,  name: 'Sonalpur Secondary Training School', zone: 'balasore', district: 'Baleswar' },
  { slNo: 4,  name: 'Anchalika Secondary Training School', zone: 'balasore', district: 'Baleswar' },
  { slNo: 5,  name: 'Sri Jagannath Secondary Training School', zone: 'balasore', district: 'Baleswar' },
  { slNo: 6,  name: 'Jagabandhu Secondary Training School', zone: 'balasore', district: 'Chandimal' },
  { slNo: 7,  name: 'Jagannath Secondary Training School', zone: 'balasore', district: 'Baleswar' },
  { slNo: 8,  name: 'Madan Mohan Secondary Training School', zone: 'balasore', district: 'Baleswar' },
  { slNo: 9,  name: 'Narasinghpur Secondary Training School', zone: 'balasore', district: 'Baleswar' },
  { slNo: 10, name: 'Chandimata Secondary Training School', zone: 'balasore', district: 'Baleswar' },
  { slNo: 11, name: 'Badama Secondary Training School', zone: 'balasore', district: 'Kendujhar' },
  { slNo: 12, name: 'Jagabandhu Secondary Training School', zone: 'balasore', district: 'Naliapal' },
  { slNo: 13, name: 'Adhalpanka Secondary Training School', zone: 'balasore', district: 'Bhadrak' },
  { slNo: 14, name: 'New Adhalpanka Secondary Training School', zone: 'balasore', district: 'Bhadrak' },
  { slNo: 15, name: 'Gedama Secondary Training School', zone: 'balasore', district: 'Kendujhar' },
  { slNo: 16, name: 'Dahamunda Secondary Training School', zone: 'balasore', district: 'Baleswar' },
  { slNo: 17, name: 'Radhakishore Secondary Training School', zone: 'balasore', district: 'Baleswar' },
  { slNo: 18, name: 'Swarna Chuda Secondary Training School', zone: 'balasore', district: 'Baleswar' },
  { slNo: 19, name: 'Talapada Secondary Training School', zone: 'balasore', district: 'Baleswar' },
  { slNo: 20, name: 'Laxmipriya Secondary Training School', zone: 'balasore', district: 'Baleswar' },
  { slNo: 21, name: 'Kusha Charan Secondary Training School', zone: 'balasore', district: 'Baleswar' },
  { slNo: 22, name: 'Binapani Secondary Training School', zone: 'balasore', district: 'Baleswar' },
  { slNo: 23, name: 'Debagiri Secondary Training School Gopinathpur', zone: 'balasore', district: 'Baleswar' },
  { slNo: 24, name: 'Debagiri Secondary Training School', zone: 'balasore', district: 'Mangalpur' },
  { slNo: 25, name: 'Mahamahima Secondary Training School', zone: 'balasore', district: 'Baleswar' },
  { slNo: 26, name: 'Bhagabat Prasad Secondary Training School', zone: 'balasore', district: 'Baleswar' },
  { slNo: 27, name: 'Durgapur Secondary Training School', zone: 'balasore', district: 'Mayurbhanj' },
  { slNo: 28, name: 'B P Education Centre', zone: 'balasore', district: 'Mayurbhanj' },
  { slNo: 29, name: 'Mayurbhanj Secondary Training School', zone: 'balasore', district: 'Mayurbhanj' },
  { slNo: 30, name: 'Godapalasa Secondary Training School', zone: 'balasore', district: 'Mayurbhanj' },
  { slNo: 31, name: 'Purnima Secondary Training School', zone: 'balasore', district: 'Mayurbhanj' },
  { slNo: 32, name: 'Rasamatala Secondary Training School', zone: 'balasore', district: 'Mayurbhanj' },
  { slNo: 33, name: 'Regional Secondary Training School', zone: 'balasore', district: 'Mayurbhanj' },
  { slNo: 34, name: 'Newlife Secondary Training School', zone: 'balasore', district: 'Mayurbhanj' },
  { slNo: 35, name: 'Baba Jateswar Secondary Training School', zone: 'balasore', district: 'Baleswar' },
  { slNo: 36, name: 'Purusottam Secondary Training School', zone: 'balasore', district: 'Mayurbhanj' },
  { slNo: 37, name: 'Sri Aurobindo Secondary Training School', zone: 'balasore', district: 'Mayurbhanj' },
  { slNo: 38, name: 'Aguad Secondary Training School', zone: 'balasore', district: 'Mayurbhanj' },
  { slNo: 39, name: 'Ajan Secondary Training School', zone: 'balasore', district: 'Mayurbhanj' },
  { slNo: 40, name: 'Bapuji Secondary Training School', zone: 'balasore', district: 'Baleswar' },

  // Sambalpur Zone (9)
  { slNo: 1, name: 'Balijodi Secondary Training School', zone: 'sambalpur', district: 'Sundargarh' },
  { slNo: 2, name: 'Madhusudan Secondary Training School', zone: 'sambalpur', district: 'Sambalpur' },
  { slNo: 3, name: 'Saradhapur Secondary Training School', zone: 'sambalpur', district: 'Sambalpur' },
  { slNo: 4, name: 'Maa Samaleswari Secondary Training School', zone: 'sambalpur', district: 'Sambalpur' },
  { slNo: 5, name: 'Kurda Secondary Training School', zone: 'sambalpur', district: 'Sundargarh' },
  { slNo: 6, name: 'Brahmani Secondary Training School', zone: 'sambalpur', district: 'Sundargarh' },
  { slNo: 7, name: 'Gopana Secondary Training School', zone: 'sambalpur', district: 'Sundargarh' },
  { slNo: 8, name: 'SaleiBahala Secondary Training School', zone: 'sambalpur', district: 'Sambalpur' },
  { slNo: 9, name: 'Lucky Secondary Training School', zone: 'sambalpur', district: 'Sambalpur' }
];

/* Legal Record Archive */
const DOCUMENTS = [
  {
    ref: '5640',
    year: '2009',
    title: 'Writ Petition (C) No. 5640 of 2009',
    note: 'Orissa High Court — Landmark Judgment dated 25.03.2010 by Hon’ble Justice M. M. Das securing student examination rights & affiliation',
    file: 'orissa-high-court-wp-5640-2009-judgment.pdf',
    category: 'court_order',
    badge: 'Landmark Judgment',
    date: '25th March 2010',
    court: 'IN THE HIGH COURT OF ORISSA AT CUTTACK',
    petitioner: 'All Orissa Private Secondary Training Schools Management Association',
    bench: 'The Honourable Shri Justice M. M. Das',
    image: 'assets/img/judgments/wp-5640-2009-judgment-frontpage.jpg'
  },
  {
    ref: '10372',
    year: '2008',
    title: 'Writ Petition (C) No. 10372 of 2008',
    note: 'Orissa High Court — Historic Order dated 24.09.2008 & 12.12.2008 directing verification and granting examination protection',
    file: 'orissa-high-court-wp-5640-2009-judgment.pdf',
    category: 'court_order',
    badge: 'High Court Order',
    date: '24th September 2008',
    court: 'IN THE HIGH COURT OF ORISSA AT CUTTACK',
    bench: 'The Honourable Shri Justice M. M. Das',
    image: 'assets/img/judgments/wp-10372-2008-order-p1.jpg'
  },
  {
    ref: '23411',
    year: '2014',
    title: 'Writ Petition (C) No. 23411 of 2014',
    note: 'Orissa High Court — Original Jurisdiction Petition filed 29.11.2014 protecting association examination fees',
    file: 'orissa-high-court-wp-5640-2009-judgment.pdf',
    category: 'court_order',
    badge: 'Writ Petition',
    date: '29th November 2014',
    court: 'IN THE HIGH COURT OF ORISSA AT CUTTACK',
    image: 'assets/img/judgments/wp-23411-2014-frontpage.jpg'
  },
  {
    ref: 'SC',
    year: '2012',
    title: 'Supreme Court Order on Appeal',
    note: 'Supreme Court of India — Affirmation of member institutions rights',
    file: 'orissa-high-court-wp-5640-2009-judgment.pdf',
    category: 'court_order',
    badge: 'Supreme Court'
  },
  {
    ref: 'CO-08',
    year: '2014',
    title: 'Considered Order on Training Schools',
    note: 'School and Mass Education Department, Govt. of Odisha',
    file: '',
    category: 'department_letter',
    badge: 'Govt Order'
  },
  {
    ref: 'BL-219',
    year: '2016',
    title: 'Board Letter on Exam Center Allocation',
    note: 'Board of Secondary Education, Odisha',
    file: '',
    category: 'department_letter',
    badge: 'Board Letter'
  },
  {
    ref: 'NC-45',
    year: '2018',
    title: 'Note to Cabinet on Policy Framing',
    note: 'General Administration & S&ME Dept, Government of Odisha',
    file: '',
    category: 'department_letter',
    badge: 'Cabinet Note'
  },
  {
    ref: 'AN/26',
    year: '2026',
    title: 'Circular: Member School Directory 2026',
    note: 'Official notice to all five zonal conveners regarding updated 90-school directory',
    file: '',
    category: 'notice',
    badge: 'Official Circular'
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ZONES, SCHOOLS, DOCUMENTS };
}
