/* ============================================================
   Member School Directory & Legal Records
   All Orissa Private Secondary Training Schools Management Association
   ============================================================ */

export interface ZoneOfficer {
  name: string;
  designation: string;
  subRole: string;
  idCardNo: string;
  phone: string;
  whatsapp: string;
  photo: string;
  reportsTo: string;
}

export interface CentreInvigilator {
  centreNo: number;
  centreName: string;
  name: string;
  designation: string;
  idCardNo: string;
  phone: string;
  whatsapp: string;
  photo: string;
  reportsTo: string;
}

export interface AcademicBatchInfo {
  order: string;
  batchLabel: string;
  session: string;
  remarks: string;
}

export interface SchoolCandidateRecord {
  slNo: number;
  rollLabel: string;
  name: string;
  listType: 'Regular DR List (01–109)' | 'Supplementary DR List (01–06)';
  pageNo: number;
}

export interface SchoolFullDetails {
  schoolCode: string;
  slNo: number;
  name: string;
  zoneId: string;
  zoneName: string;
  zoneShortCode: string;
  district: string;
  address: {
    at: string;
    po: string;
    via?: string;
    circle?: string;
    educationalDistrict?: string;
    block?: string;
    telegraphOffice?: string;
    landline?: string;
    atPo: string;
    dist: string;
    pin: string;
  };
  secretary: {
    name: string;
    designation: string;
    idCardNo: string;
    phone: string;
    whatsapp: string;
    email: string;
    photo: string;
  };
  batches: AcademicBatchInfo[];
  invigilators: CentreInvigilator[];
  drFormPdf?: string;
  drFormDate?: string;
  drExamYear?: string;
  candidates?: SchoolCandidateRecord[];
}

export interface Zone {
  id: string;
  code?: string;
  fullTitle?: string;
  name: string;
  districts: string;
  schoolCount: number;
  badge: string;
  status: string;
  pending?: boolean;
  email?: string;
  president?: ZoneOfficer;
  adminOfficer?: ZoneOfficer;
  centres?: CentreInvigilator[];
}

export interface School {
  name: string;
  zone: string;
  district: string;
  slNo?: number;
  code?: string;
  atPo?: string;
  pin?: string;
  secretaryName?: string;
  secretaryPhone?: string;
  email?: string;
}

export interface DocumentRecord {
  ref: string;
  year: string;
  title: string;
  note: string;
  file: string;
  category: 'court_order' | 'supreme_court' | 'department_letter' | 'bse_order' | 'notice' | 'achievement';
  subCategory?: 'high_court' | 'supreme_court' | 'bse_letter' | 'govt_order' | 'academic_achievement' | 'notice';
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
    code: 'BZB',
    fullTitle: 'Baleswar Zone (BZB)',
    name: 'Baleswar Zone',
    districts: 'Mayurbhanj, Keonjhar, Balasore, Bhadrak',
    schoolCount: 40,
    badge: 'North Coastal & Tribal Range',
    status: 'Active Registered Zone (40 Institutions)',
    email: 'baleswar.zone@aopstsma.in',
    president: {
      name: 'President (Baleswar Zone)',
      designation: 'President (Baleswar Zone)',
      subRole: 'Incharge Additional President',
      idCardNo: 'AOP-BZB-PRES-01',
      phone: '+91 63709 87576',
      whatsapp: '916370987576',
      photo: '/assets/img/president-nirmal-kanta-mohanty.jpg',
      reportsTo: 'Reports to Association (AOPSTSMA State HQ)'
    },
    adminOfficer: {
      name: 'Administrative Officer (Baleswar Zone)',
      designation: 'Administrative Officer',
      subRole: 'Name Incharge Officer',
      idCardNo: 'AOP-BZB-AO-01',
      phone: '+91 63709 87576',
      whatsapp: '916370987576',
      photo: '/assets/img/secretary-alia-pradhan.jpg',
      reportsTo: 'Reports to Zonal President (Baleswar Zone)'
    },
    centres: [
      {
        centreNo: 1,
        centreName: 'Baleswar Zonal Centre – I (Balasore HQ)',
        name: 'Centre Invigilator / Inspector – I',
        designation: 'Invigilator / Centre Inspector',
        idCardNo: 'BZB-INV-01',
        phone: '+91 63709 87576',
        whatsapp: '916370987576',
        photo: '/assets/img/president-avatar.svg',
        reportsTo: 'Administrative Officer (Baleswar Zone)'
      },
      {
        centreNo: 2,
        centreName: 'Baleswar Zonal Centre – II (Mayurbhanj / Baripada)',
        name: 'Centre Invigilator / Inspector – II',
        designation: 'Invigilator / Centre Inspector',
        idCardNo: 'BZB-INV-02',
        phone: '+91 63709 87576',
        whatsapp: '916370987576',
        photo: '/assets/img/secretary-avatar.svg',
        reportsTo: 'Administrative Officer (Baleswar Zone)'
      },
      {
        centreNo: 3,
        centreName: 'Baleswar Zonal Centre – III (Bhadrak / Keonjhar)',
        name: 'Centre Invigilator / Inspector – III',
        designation: 'Invigilator / Centre Inspector',
        idCardNo: 'BZB-INV-03',
        phone: '+91 63709 87576',
        whatsapp: '916370987576',
        photo: '/assets/img/president-avatar.svg',
        reportsTo: 'Administrative Officer (Baleswar Zone)'
      }
    ]
  },
  {
    id: 'central',
    code: 'CZC',
    fullTitle: 'Central Zone Cuttack (CZC)',
    name: 'Central Zone Cuttack',
    districts: 'Cuttack, Kendrapara, Jajpur, Dhenkanal, Angul',
    schoolCount: 24,
    badge: 'Judicial & Mahanadi Belt',
    status: 'High Court Jurisdiction (24 Institutions)',
    email: 'czc.cuttack@aopstsma.in',
    president: {
      name: 'Nirmal Kanta Mohanty',
      designation: 'President (Central Zone Cuttack)',
      subRole: 'Incharge Additional President',
      idCardNo: 'AOP-CZC-PRES-01',
      phone: '+91 63709 87576',
      whatsapp: '916370987576',
      photo: '/assets/img/president-nirmal-kanta-mohanty.jpg',
      reportsTo: 'Reports to Association (AOPSTSMA State HQ)'
    },
    adminOfficer: {
      name: 'Administrative Officer (CZC)',
      designation: 'Administrative Officer (Central Zone Cuttack)',
      subRole: 'Name Incharge Officer',
      idCardNo: 'AOP-CZC-AO-01',
      phone: '+91 63709 87576',
      whatsapp: '916370987576',
      photo: '/assets/img/secretary-alia-pradhan.jpg',
      reportsTo: 'Reports to President (Central Zone Cuttack)'
    },
    centres: [
      {
        centreNo: 1,
        centreName: 'Central Zone Exam Centre – I (Cuttack HQ)',
        name: 'Centre Invigilator / Inspector – I',
        designation: 'Invigilator / Inspector (Centre-1)',
        idCardNo: 'CZC-INV-01',
        phone: '+91 63709 87576',
        whatsapp: '916370987576',
        photo: '/assets/img/president-avatar.svg',
        reportsTo: 'Administrative Officer (Central Zone Cuttack)'
      },
      {
        centreNo: 2,
        centreName: 'Central Zone Exam Centre – II (Kendrapara / Jajpur)',
        name: 'Centre Invigilator / Inspector – II',
        designation: 'Invigilator / Inspector (Centre-2)',
        idCardNo: 'CZC-INV-02',
        phone: '+91 63709 87576',
        whatsapp: '916370987576',
        photo: '/assets/img/secretary-avatar.svg',
        reportsTo: 'Administrative Officer (Central Zone Cuttack)'
      },
      {
        centreNo: 3,
        centreName: 'Central Zone Exam Centre – III (Dhenkanal / Angul)',
        name: 'Centre Invigilator / Inspector – III',
        designation: 'Invigilator / Inspector (Centre-3)',
        idCardNo: 'CZC-INV-03',
        phone: '+91 63709 87576',
        whatsapp: '916370987576',
        photo: '/assets/img/president-avatar.svg',
        reportsTo: 'Administrative Officer (Central Zone Cuttack)'
      }
    ]
  },
  {
    id: 'bhubaneswar',
    code: 'BZB-HQ',
    fullTitle: 'Bhubaneswar Zone (BBS)',
    name: 'Bhubaneswar Zone',
    districts: 'Khordha, Nayagarh, Puri (State Capital HQ)',
    schoolCount: 15,
    badge: 'State Secretariat & Apex Liaison',
    status: 'Central Command & Secretariat (15 Institutions)',
    email: 'bbsr.zone@aopstsma.in',
    president: {
      name: 'Nirmal Kanta Mohanty',
      designation: 'President (Bhubaneswar Zone)',
      subRole: 'Incharge Additional President',
      idCardNo: 'AOP-BBS-PRES-01',
      phone: '+91 63709 87576',
      whatsapp: '916370987576',
      photo: '/assets/img/president-nirmal-kanta-mohanty.jpg',
      reportsTo: 'Reports to Association (AOPSTSMA State HQ)'
    },
    adminOfficer: {
      name: 'Alia Pradhan',
      designation: 'Administrative Officer (Bhubaneswar Zone)',
      subRole: 'Name Incharge Officer',
      idCardNo: 'AOP-BBS-AO-01',
      phone: '+91 63709 87576',
      whatsapp: '916370987576',
      photo: '/assets/img/secretary-alia-pradhan.jpg',
      reportsTo: 'Reports to President (Bhubaneswar Zone)'
    },
    centres: [
      {
        centreNo: 1,
        centreName: 'Bhubaneswar Zonal Centre – I (Khordha / BBSR)',
        name: 'Centre Invigilator / Inspector – I',
        designation: 'Invigilator / Centre Inspector',
        idCardNo: 'BBS-INV-01',
        phone: '+91 63709 87576',
        whatsapp: '916370987576',
        photo: '/assets/img/president-avatar.svg',
        reportsTo: 'Administrative Officer (Bhubaneswar Zone)'
      },
      {
        centreNo: 2,
        centreName: 'Bhubaneswar Zonal Centre – II (Puri / Nayagarh)',
        name: 'Centre Invigilator / Inspector – II',
        designation: 'Invigilator / Centre Inspector',
        idCardNo: 'BBS-INV-02',
        phone: '+91 63709 87576',
        whatsapp: '916370987576',
        photo: '/assets/img/secretary-avatar.svg',
        reportsTo: 'Administrative Officer (Bhubaneswar Zone)'
      }
    ]
  },
  {
    id: 'sambalpur',
    code: 'SZS',
    fullTitle: 'Sambalpur Zone (SZS)',
    name: 'Sambalpur Zone',
    districts: 'Sambalpur, Sundargarh, Bargarh, Jharsuguda',
    schoolCount: 9,
    badge: 'Western Range',
    status: 'Western Educational Division (9 Institutions)',
    email: 'sambalpur.zone@aopstsma.in',
    president: {
      name: 'President (Sambalpur Zone)',
      designation: 'President (Sambalpur Zone)',
      subRole: 'Incharge Additional President',
      idCardNo: 'AOP-SZS-PRES-01',
      phone: '+91 63709 87576',
      whatsapp: '916370987576',
      photo: '/assets/img/president-nirmal-kanta-mohanty.jpg',
      reportsTo: 'Reports to Association (AOPSTSMA State HQ)'
    },
    adminOfficer: {
      name: 'Administrative Officer (Sambalpur Zone)',
      designation: 'Administrative Officer',
      subRole: 'Name Incharge Officer',
      idCardNo: 'AOP-SZS-AO-01',
      phone: '+91 63709 87576',
      whatsapp: '916370987576',
      photo: '/assets/img/secretary-alia-pradhan.jpg',
      reportsTo: 'Reports to President (Sambalpur Zone)'
    },
    centres: [
      {
        centreNo: 1,
        centreName: 'Sambalpur Zonal Centre – I (Sambalpur HQ)',
        name: 'Centre Invigilator / Inspector – I',
        designation: 'Invigilator / Centre Inspector',
        idCardNo: 'SZS-INV-01',
        phone: '+91 63709 87576',
        whatsapp: '916370987576',
        photo: '/assets/img/president-avatar.svg',
        reportsTo: 'Administrative Officer (Sambalpur Zone)'
      },
      {
        centreNo: 2,
        centreName: 'Sambalpur Zonal Centre – II (Sundargarh)',
        name: 'Centre Invigilator / Inspector – II',
        designation: 'Invigilator / Centre Inspector',
        idCardNo: 'SZS-INV-02',
        phone: '+91 63709 87576',
        whatsapp: '916370987576',
        photo: '/assets/img/secretary-avatar.svg',
        reportsTo: 'Administrative Officer (Sambalpur Zone)'
      }
    ]
  },
  {
    id: 'ganjam',
    code: 'BZG',
    fullTitle: 'Berhampur Zone (BZG)',
    name: 'Berhampur Zone',
    districts: 'Ganjam, Gajapati, Southern Range',
    schoolCount: 2,
    badge: 'Southern Coastal Division',
    status: 'Southern Regional Registry (2 Institutions)',
    email: 'berhampur.zone@aopstsma.in',
    president: {
      name: 'President (Berhampur Zone)',
      designation: 'President (Berhampur Zone)',
      subRole: 'Incharge Additional President',
      idCardNo: 'AOP-BZG-PRES-01',
      phone: '+91 63709 87576',
      whatsapp: '916370987576',
      photo: '/assets/img/president-nirmal-kanta-mohanty.jpg',
      reportsTo: 'Reports to Association (AOPSTSMA State HQ)'
    },
    adminOfficer: {
      name: 'Administrative Officer (Berhampur Zone)',
      designation: 'Administrative Officer',
      subRole: 'Name Incharge Officer',
      idCardNo: 'AOP-BZG-AO-01',
      phone: '+91 63709 87576',
      whatsapp: '916370987576',
      photo: '/assets/img/secretary-alia-pradhan.jpg',
      reportsTo: 'Reports to President (Berhampur Zone)'
    },
    centres: [
      {
        centreNo: 1,
        centreName: 'Berhampur Zonal Centre – I (Ganjam HQ)',
        name: 'Centre Invigilator / Inspector – I',
        designation: 'Invigilator / Centre Inspector',
        idCardNo: 'BZG-INV-01',
        phone: '+91 63709 87576',
        whatsapp: '916370987576',
        photo: '/assets/img/president-avatar.svg',
        reportsTo: 'Administrative Officer (Berhampur Zone)'
      }
    ]
  }
];

export const SCHOOLS: School[] = [
  // ==================== BHUBANESWAR ZONE (15 Schools) ====================
  { slNo: 1,  name: 'Rajadhani School Of Education', zone: 'bhubaneswar', district: 'Bhubaneswar, Khordha' },
  {
    slNo: 2,
    name: 'Orissa Noble C.T. School',
    zone: 'bhubaneswar',
    district: 'Khurda',
    atPo: 'At: Surya Nagar, Post: Surya Nagar, Via: Bhubaneswar',
    pin: '751003',
    secretaryName: 'Santosh Kumar Behera (Headmaster)',
    secretaryPhone: '0674-2397022',
    email: 'orissa.noble.ct@aopstsma.in',
  },
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

  // ==================== BERHAMPUR ZONE (2 Schools) ====================
  { slNo: 1, name: 'Sri Aurobinda Secondary Training School', zone: 'ganjam', district: 'Berhampur, Ganjam' },
  { slNo: 2, name: 'Maa Bhagabati Secondary Training School', zone: 'ganjam', district: 'Ganjam' },

  // ==================== CENTRAL ZONE (24 Schools) ====================
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

  // ==================== BALESWAR ZONE (40 Schools) ====================
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

  // ==================== SAMBALPUR ZONE (9 Schools) ====================
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

export const DOCUMENTS: DocumentRecord[] = [
  // ==================== 1. ORISSA HIGH COURT ORDERS (6 Authentic Records) ====================
  {
    ref: '10372',
    year: '2008',
    title: 'Writ Petition (C) No. 10372 of 2008',
    note: 'Orissa High Court — Historic Order dated 24.09.2008 by Hon’ble Justice M. M. Das protecting candidate eligibility & directing inquiry into institutional infrastructure facilities.',
    file: 'orissa-high-court-wp-10372-2008-petition.pdf',
    category: 'court_order',
    subCategory: 'high_court',
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
    ref: '10372-MOD',
    year: '2008',
    title: 'Writ Petition (C) No. 10372 of 2008 (Correction Order Dec 2008)',
    note: 'Orissa High Court — Modification & Correction Order dated 12.12.2008 amending operational directives and ensuring immediate government compliance.',
    file: 'orissa-high-court-wp-10372-2008-petition.pdf',
    category: 'court_order',
    subCategory: 'high_court',
    badge: 'Correction Order',
    date: '12th December 2008',
    court: 'IN THE HIGH COURT OF ORISSA AT CUTTACK',
    petitioner: 'All Orissa Private Secondary Training Schools Management Association',
    respondent: 'State of Orissa represented through Commissioner-cum-Secretary & Director Secondary Education',
    bench: 'The Honourable Shri Justice M. M. Das',
    image: '/assets/img/judgments/wp-10372-2008-order-p2.jpg',
    operativeParagraph: 'Upon mention, the clerical corrections in the order dated 24.09.2008 stand rectified. State respondents are instructed to treat member institution representations with immediate priority.'
  },
  {
    ref: 'WA-146',
    year: '2009',
    title: 'Writ Appeal No. 146 of 2009',
    note: 'Orissa High Court — Appellate Division Bench order affirming single judge directions and securing candidate examination protections against state interference.',
    file: 'orissa-high-court-writ-appeal-146-2009.pdf',
    category: 'court_order',
    subCategory: 'high_court',
    badge: 'Writ Appeal',
    date: '2009',
    court: 'IN THE HIGH COURT OF ORISSA AT CUTTACK',
    petitioner: 'All Orissa Private Secondary Training Schools Management Association',
    respondent: 'State of Orissa & Board of Secondary Education',
    bench: 'Hon’ble Acting Chief Justice I. M. Quddusi & Hon’ble Shri Justice Sanju Panda',
    image: '/assets/img/judgments/wp-wa-146-2009-frontpage.jpg',
    operativeParagraph: 'The Division Bench reviewed the writ appeals and maintained interim protective relief for candidate examination forms and institutional recognition status.'
  },
  {
    ref: 'WA-142',
    year: '2009',
    title: 'Writ Appeal No. 142 of 2009',
    note: 'Orissa High Court — Division Bench Appeal by BSE Odisha upholding procedural fairness, fee regularization, and institutional autonomy across all 5 zones.',
    file: 'orissa-high-court-writ-appeal-142-2009.pdf',
    category: 'court_order',
    subCategory: 'high_court',
    badge: 'Writ Appeal',
    date: '2009',
    court: 'IN THE HIGH COURT OF ORISSA AT CUTTACK',
    petitioner: 'Board of Secondary Education, Orissa',
    respondent: 'All Orissa Private Secondary Training School Management Association & Ors.',
    bench: 'Hon’ble Acting Chief Justice I. M. Quddusi & Hon’ble Shri Justice Sanju Panda',
    image: '/assets/img/judgments/wp-wa-142-2009-frontpage.jpg',
    operativeParagraph: 'Appeal disposed of with binding directions upon the authorities to safeguard student academic tenures without arbitrary exclusion.'
  },
  {
    ref: '5640',
    year: '2009',
    title: 'Writ Petition (C) No. 5640 of 2009',
    note: 'Orissa High Court — Landmark Final Judgment dated 25.03.2010 by The Hon’ble Shri Justice M. M. Das securing examination appearance and affiliation rights.',
    file: 'orissa-high-court-wp-5640-2009-judgment.pdf',
    category: 'court_order',
    subCategory: 'high_court',
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
    ref: '23411',
    year: '2014',
    title: 'Writ Petition (C) No. 23411 of 2014',
    note: 'Orissa High Court — Original Jurisdiction Petition filed 29.11.2014 challenging arbitrary fee refund directives & protecting association member deposits.',
    file: 'orissa-high-court-wp-23411-2014.pdf',
    category: 'court_order',
    subCategory: 'high_court',
    badge: 'Writ Petition',
    date: '29th November 2014',
    court: 'IN THE HIGH COURT OF ORISSA AT CUTTACK',
    petitioner: 'All Orissa Private Secondary Training School Management Association represented through Secy. Shri Raj Kishore Jena',
    respondent: 'State of Orissa represented through its Secy, School and Mass Education Dept. & Board of Secondary Education',
    bench: 'Hon’ble Division Bench of Orissa High Court',
    image: '/assets/img/judgments/wp-23411-2014-frontpage.jpg',
    operativeParagraph: 'An application challenging the arbitrary action of the O.P. No. 1 in directing the board to take action to refund the examination fees already deposited by the petitioner’s association; ensuring association legitimacy and safeguarding student fees.'
  },

  // ==================== 2. SUPREME COURT OF INDIA ORDERS (3 SLP Orders) ====================
  {
    ref: 'SLP-12896',
    year: '2014',
    title: 'Special Leave Petition (Civil) CC No. 12896 of 2014',
    note: 'Supreme Court of India — Apex court petition safeguarding state-wide private training school validity and teacher candidate certifications.',
    file: 'supreme-court-slp-cc-12896-2014.pdf',
    category: 'supreme_court',
    subCategory: 'supreme_court',
    badge: 'Supreme Court SLP',
    date: '8th September 2014',
    court: 'SUPREME COURT OF INDIA, NEW DELHI',
    petitioner: 'All Orissa Private Secondary Training Schools Management Association & Ors.',
    respondent: 'State of Odisha & Ors.',
    bench: 'Hon’ble Mr. Justice Dipak Misra & Hon’ble Mr. Justice Vikramajit Sen',
    image: '/assets/img/judgments/supreme-court-slp-12896-frontpage.jpg',
    operativeParagraph: 'Special Leave Petition entertained in the Apex Court safeguarding the collective interest of member training institutions across Odisha.'
  },
  {
    ref: 'SLP-24707-A',
    year: '2014',
    title: 'SLP (Civil) No. 24707 of 2014 (Order dated 06.02.2015)',
    note: 'Supreme Court of India — Landmark interim proceedings dated 06/02/2015 protecting the ongoing status of member institutions and examination conduct.',
    file: 'supreme-court-slp-cc-12896-2014.pdf',
    category: 'supreme_court',
    subCategory: 'supreme_court',
    badge: 'Supreme Court Order',
    date: '6th February 2015',
    court: 'SUPREME COURT OF INDIA, NEW DELHI',
    petitioner: 'AOPSTSMA & Member Institutions',
    respondent: 'State of Odisha, BSE & Dept of School and Mass Education',
    bench: 'Hon’ble Supreme Court of India',
    image: '/assets/img/judgments/supreme-court-slp-12896-frontpage.jpg',
    operativeParagraph: 'Order dated 06.02.2015 issued in SLP(C) 24707/2014 granting interim consideration and directing status examination of trainee batches.'
  },
  {
    ref: 'SLP-24707-B',
    year: '2014',
    title: 'SLP (Civil) No. 24707 of 2014 (Order dated 30.03.2015)',
    note: 'Supreme Court of India — Apex Court order dated 30/03/2015 establishing binding legal framework and judicial safeguards for association schools.',
    file: 'supreme-court-slp-cc-12896-2014.pdf',
    category: 'supreme_court',
    subCategory: 'supreme_court',
    badge: 'Supreme Court Order',
    date: '30th March 2015',
    court: 'SUPREME COURT OF INDIA, NEW DELHI',
    petitioner: 'AOPSTSMA & Member Institutions',
    respondent: 'State of Odisha & Ors.',
    bench: 'Hon’ble Supreme Court of India',
    image: '/assets/img/judgments/supreme-court-slp-12896-frontpage.jpg',
    operativeParagraph: 'Final proceedings in SLP 24707/2014 dated 30.03.2015 directing authorities to safeguard genuine educational infrastructure and candidate qualifications.'
  },

  // ==================== 3. BSE & GOVT COMMUNICATED ORDERS (4 Records) ====================
  {
    ref: 'LAW-DEPT-2009',
    year: '2009',
    title: 'Law Department, Govt. of Odisha — Official Note Sheet dated 05.01.2009',
    note: 'Govt. of Odisha Law Department Official Opinion & Note Sheet by Additional Secretary D. Dash regarding institutional recognition, CT teacher examination eligibility, and compliance with High Court directives.',
    file: 'law-department-govt-odisha-note-sheet-2009.pdf',
    category: 'department_letter',
    subCategory: 'govt_order',
    badge: 'Law Dept Note Sheet',
    date: '5th January 2009',
    court: 'GOVERNMENT OF ODISHA, LAW DEPARTMENT, BHUBANESWAR',
    petitioner: 'Law Department, Govt. of Odisha',
    respondent: 'School & Mass Education Department / Director Secondary Education',
    image: '/assets/img/judgments/law-dept-note-sheet-frontpage.jpg',
    operativeParagraph: 'Detailed legal scrutiny and advisory issued to the School & Mass Education Department affirming procedural regularisation, legal status of member institutions, and student examination rights pursuant to the orders in W.P.(C) No. 10372 of 2008.'
  },
  {
    ref: 'BSE-249(5)',
    year: '2009',
    title: 'BSE / Department Communication No. 249(5) dated 12.05.2009',
    note: 'Board of Secondary Education & Departmental Joint Communication dated 12/05/2009 formalizing examination protocols and admission guidelines.',
    file: 'bse-odisha-communicated-order-249-5-2009.pdf',
    category: 'bse_order',
    subCategory: 'bse_letter',
    badge: 'Communication 249(5)',
    date: '12th May 2009',
    court: 'BOARD OF SECONDARY EDUCATION, ODISHA',
    petitioner: 'Secretary, Board of Secondary Education, Odisha, Cuttack',
    respondent: 'Principals / Centre Superintendents of Member Training Schools',
    image: '/assets/img/judgments/bse-order-249-5-frontpage.jpg',
    operativeParagraph: 'Official notification communicating administrative compliance parameters, enrollment roll validation, and examination center conductance protocol.'
  },
  {
    ref: 'BSE-896',
    year: '2009',
    title: 'Board of Secondary Education Communicated Order — Letter No. 896',
    note: 'Board of Secondary Education (BSE), Odisha — Official letter dated 05/02/2009 communicating examination center allocations, candidate roll verification, and center superintendence.',
    file: 'bse-odisha-communicated-order-249-5-2009.pdf',
    category: 'bse_order',
    subCategory: 'bse_letter',
    badge: 'BSE Letter 896',
    date: '5th February 2009',
    court: 'BOARD OF SECONDARY EDUCATION, ODISHA, CUTTACK',
    petitioner: 'BSE Examination Directorate',
    respondent: 'Member Training Schools, AOPSTSMA',
    image: '/assets/img/judgments/bse-order-249-5-frontpage.jpg',
    operativeParagraph: 'Communication of examination logistics and center notifications for private secondary training candidates under BSE auspices.'
  },
  {
    ref: 'GO-118/8',
    year: '2009',
    title: 'Government Order No. 118/8 dated 27.01.2009',
    note: 'School & Mass Education Department, Govt. of Odisha — Executive government order directing regulatory review and structural verification for training schools.',
    file: 'law-department-govt-odisha-note-sheet-2009.pdf',
    category: 'department_letter',
    subCategory: 'govt_order',
    badge: 'Govt Order 118/8',
    date: '27th January 2009',
    court: 'GOVERNMENT OF ODISHA, SCHOOL & MASS EDUCATION DEPARTMENT',
    petitioner: 'Govt. Secretariat, Bhubaneswar',
    respondent: 'Director Secondary Education / BSE',
    image: '/assets/img/judgments/law-dept-note-sheet-frontpage.jpg',
    operativeParagraph: 'Executive notification directing the assessment and structured integration of private teacher education institutions.'
  },

  // ==================== 4. ASSOCIATION ACADEMIC ACHIEVEMENTS ====================
  {
    ref: 'SYLLABUS-2009',
    year: '2009',
    title: 'Official State Syllabus 2009 (45-Page Comprehensive Framework)',
    note: 'Comprehensive 45-page standardized pedagogical curriculum formulated by AOPSTSMA for 2-Year Certified Teacher (C.T.) education across Odisha.',
    file: '',
    category: 'achievement',
    subCategory: 'academic_achievement',
    badge: 'Academic Milestone',
    date: '2009',
    court: 'ACADEMIC COUNCIL & CURRICULUM COMMITTEE, AOPSTSMA',
    operativeParagraph: 'Standardized 45-page curriculum spanning Educational Psychology, School Management, Pedagogy of Language, Mathematics, Science, and Social Studies, adopted across 90 member institutions.'
  },
  {
    ref: 'EXAM-10YR',
    year: '2010s',
    title: '10 Years CT Examination Question & Answer Archive',
    note: 'A decade-long standardized Question & Answer bank providing past paper archives, model answer keys, and pedagogical evaluation benchmarks.',
    file: '',
    category: 'achievement',
    subCategory: 'academic_achievement',
    badge: '10-Year Q&A Archive',
    date: 'Comprehensive',
    court: 'EXAMINATION & PEDAGOGY WING, AOPSTSMA',
    operativeParagraph: 'Compilation of 10 years of Board examination question papers with authenticated solutions, marking rubrics, and pedagogical guides for student success.'
  },
  {
    ref: 'ONLINE-QBANK',
    year: 'Digital',
    title: 'Online Class Digital Access & Sample Question Bank',
    note: 'Modern digital educational infrastructure providing online instructional access, e-learning materials, and curated sample examination questions for teacher trainees.',
    file: '',
    category: 'achievement',
    subCategory: 'academic_achievement',
    badge: 'Digital Innovation',
    date: 'Continuous Access',
    court: 'DIGITAL LEARNING & DISTANCE EDUCATION CELL',
    operativeParagraph: 'State-wide digital learning portal offering open access to video lectures, interactive test modules, and model question papers for all 90 member colleges.'
  },

  // ==================== 5. ASSOCIATION NOTICES & CIRCULARS ====================
  {
    ref: 'AN/26',
    year: '2026',
    title: 'Circular: Member School Directory 2026',
    note: 'Official notice to all five zonal conveners and headmasters regarding updated 90-school directory registration.',
    file: '',
    category: 'notice',
    subCategory: 'notice',
    badge: 'Official Circular',
    date: 'Jan 2026'
  },
  {
    ref: 'AN/25',
    year: '2025',
    title: 'Advisory on DR Deposit & Renewals',
    note: 'Guidelines for submission of renewal files, legal fee contributions, and annual portal registration for 2025-26.',
    file: '',
    category: 'notice',
    subCategory: 'notice',
    badge: 'Advisory',
    date: 'Nov 2025'
  }
];

const DISTRICT_PIN_MAP: Record<string, string> = {
  'Cuttack': '753001',
  'Jagatsinghpur': '754103',
  'Kendrapara': '754211',
  'Kendrapada': '754211',
  'Jajpur': '755001',
  'Jajapur': '755001',
  'Dhenkanal': '759001',
  'Angul': '759122',
  'Anugul': '759122',
  'Bhubaneswar, Khordha': '751010',
  'Bhubaneswar': '751010',
  'Khordha': '752055',
  'Nayagarh': '752069',
  'Puri': '752001',
  'Berhampur, Ganjam': '760001',
  'Ganjam': '761026',
  'Baleswar': '756001',
  'Bhadrak': '756100',
  'Chandimal': '756025',
  'Naliapal': '756036',
  'Kendujhar': '758001',
  'Mangalpur': '756042',
  'Mayurbhanj': '757001',
  'Sundargarh': '770001',
  'Sambalpur': '768001',
};

const ZONE_PREFIX_MAP: Record<string, string> = {
  central: 'CEN',
  balasore: 'BAL',
  bhubaneswar: 'BBS',
  sambalpur: 'SAM',
  ganjam: 'GAN',
};

export function getZoneDetails(zoneId: string): Zone {
  const normalized = zoneId === 'cuttack' ? 'central' : zoneId === 'berhampur' ? 'ganjam' : zoneId;
  return ZONES.find((z) => z.id === normalized) || ZONES[1]; // Default to Central Zone Cuttack
}

export const ORISSA_NOBLE_CT_CANDIDATES: SchoolCandidateRecord[] = [
  // Page 1 (Sl. No. 01 to 20)
  { slNo: 1, rollLabel: '01', name: 'ABADHUTA MAHARANA', listType: 'Regular DR List (01–109)', pageNo: 1 },
  { slNo: 2, rollLabel: '02', name: 'AJAYA KUMAR SETHY', listType: 'Regular DR List (01–109)', pageNo: 1 },
  { slNo: 3, rollLabel: '03', name: 'AKHILA KUMAR PRADHAN', listType: 'Regular DR List (01–109)', pageNo: 1 },
  { slNo: 4, rollLabel: '04', name: 'AKSHYA PATRA', listType: 'Regular DR List (01–109)', pageNo: 1 },
  { slNo: 5, rollLabel: '05', name: 'BABAJI KHAMARI', listType: 'Regular DR List (01–109)', pageNo: 1 },
  { slNo: 6, rollLabel: '06', name: 'BALMIKI BISHOYI', listType: 'Regular DR List (01–109)', pageNo: 1 },
  { slNo: 7, rollLabel: '07', name: 'BASANT KUMAR BALIARISINGH', listType: 'Regular DR List (01–109)', pageNo: 1 },
  { slNo: 8, rollLabel: '08', name: 'BHASKAR CHANDRA JENA', listType: 'Regular DR List (01–109)', pageNo: 1 },
  { slNo: 9, rollLabel: '09', name: 'BIBHUTI RANJAN BISWAL', listType: 'Regular DR List (01–109)', pageNo: 1 },
  { slNo: 10, rollLabel: '10', name: 'BIDYUTA LATA SAHOO', listType: 'Regular DR List (01–109)', pageNo: 1 },
  { slNo: 11, rollLabel: '11', name: 'BIJAYA KUMAR SAHOO', listType: 'Regular DR List (01–109)', pageNo: 1 },
  { slNo: 12, rollLabel: '12', name: 'BINAPANI DASH', listType: 'Regular DR List (01–109)', pageNo: 1 },
  { slNo: 13, rollLabel: '13', name: 'BINAYAKA SARANGI', listType: 'Regular DR List (01–109)', pageNo: 1 },
  { slNo: 14, rollLabel: '14', name: 'BINODA BIHARI PRADHAN', listType: 'Regular DR List (01–109)', pageNo: 1 },
  { slNo: 15, rollLabel: '15', name: 'BIPIN BIHARI SUBUDHI', listType: 'Regular DR List (01–109)', pageNo: 1 },
  { slNo: 16, rollLabel: '16', name: 'BIRANCHI NARAYAN SAHOO', listType: 'Regular DR List (01–109)', pageNo: 1 },
  { slNo: 17, rollLabel: '17', name: 'BIRENDRA KUMAR TARASIA', listType: 'Regular DR List (01–109)', pageNo: 1 },
  { slNo: 18, rollLabel: '18', name: 'BISWAMBHARA PANIGRAHI', listType: 'Regular DR List (01–109)', pageNo: 1 },
  { slNo: 19, rollLabel: '19', name: 'CHANDRA SEKHAR PRADHAN', listType: 'Regular DR List (01–109)', pageNo: 1 },
  { slNo: 20, rollLabel: '20', name: 'DANARDAN PANDA', listType: 'Regular DR List (01–109)', pageNo: 1 },

  // Page 2 (Sl. No. 21 to 40)
  { slNo: 21, rollLabel: '21', name: 'DILLIP KUMAR MANADHATA', listType: 'Regular DR List (01–109)', pageNo: 2 },
  { slNo: 22, rollLabel: '22', name: 'DINABANDHU BERIA', listType: 'Regular DR List (01–109)', pageNo: 2 },
  { slNo: 23, rollLabel: '23', name: 'DOLAMANI MEHER', listType: 'Regular DR List (01–109)', pageNo: 2 },
  { slNo: 24, rollLabel: '24', name: 'DIPAK KUMAR KHUNTIA', listType: 'Regular DR List (01–109)', pageNo: 2 },
  { slNo: 25, rollLabel: '25', name: 'DHUKHISYAM PRADHAN', listType: 'Regular DR List (01–109)', pageNo: 2 },
  { slNo: 26, rollLabel: '26', name: 'GANGADHAR SAHOO', listType: 'Regular DR List (01–109)', pageNo: 2 },
  { slNo: 27, rollLabel: '27', name: 'GANGADHAR SANDHA', listType: 'Regular DR List (01–109)', pageNo: 2 },
  { slNo: 28, rollLabel: '28', name: 'GAYATRI BHUYAN', listType: 'Regular DR List (01–109)', pageNo: 2 },
  { slNo: 29, rollLabel: '29', name: 'GELAMANI DEI', listType: 'Regular DR List (01–109)', pageNo: 2 },
  { slNo: 30, rollLabel: '30', name: 'GOPAL GAUDU', listType: 'Regular DR List (01–109)', pageNo: 2 },
  { slNo: 31, rollLabel: '31', name: 'GOURI SUKLA', listType: 'Regular DR List (01–109)', pageNo: 2 },
  { slNo: 32, rollLabel: '32', name: 'HRUSIKESH BEHERA', listType: 'Regular DR List (01–109)', pageNo: 2 },
  { slNo: 33, rollLabel: '33', name: 'JANARDAN BHANJA', listType: 'Regular DR List (01–109)', pageNo: 2 },
  { slNo: 34, rollLabel: '34', name: 'JANMEJAYA BEHERA', listType: 'Regular DR List (01–109)', pageNo: 2 },
  { slNo: 35, rollLabel: '35', name: 'JOCHHANA RANI DAS', listType: 'Regular DR List (01–109)', pageNo: 2 },
  { slNo: 36, rollLabel: '36', name: 'KABITA KUMARI PRADHAN', listType: 'Regular DR List (01–109)', pageNo: 2 },
  { slNo: 37, rollLabel: '37', name: 'KABITA PUROHIT', listType: 'Regular DR List (01–109)', pageNo: 2 },
  { slNo: 38, rollLabel: '38', name: 'KALU CHARAN PANDA', listType: 'Regular DR List (01–109)', pageNo: 2 },
  { slNo: 39, rollLabel: '39', name: 'KANHU CHARAN MEHER', listType: 'Regular DR List (01–109)', pageNo: 2 },
  { slNo: 40, rollLabel: '40', name: 'KHAGESWAR MEHER', listType: 'Regular DR List (01–109)', pageNo: 2 },

  // Page 3 (Sl. No. 41 to 60)
  { slNo: 41, rollLabel: '41', name: 'KUBER PRADHAN', listType: 'Regular DR List (01–109)', pageNo: 3 },
  { slNo: 42, rollLabel: '42', name: 'KUNTALA KUMARI DEI', listType: 'Regular DR List (01–109)', pageNo: 3 },
  { slNo: 43, rollLabel: '43', name: 'MAMATA PANIGRAHI', listType: 'Regular DR List (01–109)', pageNo: 3 },
  { slNo: 44, rollLabel: '44', name: 'MANJULATA BARIK', listType: 'Regular DR List (01–109)', pageNo: 3 },
  { slNo: 45, rollLabel: '45', name: 'MANJUSHREE MISHRA', listType: 'Regular DR List (01–109)', pageNo: 3 },
  { slNo: 46, rollLabel: '46', name: 'MANORAMA PADHI', listType: 'Regular DR List (01–109)', pageNo: 3 },
  { slNo: 47, rollLabel: '47', name: 'MEENAKETAN BHOI', listType: 'Regular DR List (01–109)', pageNo: 3 },
  { slNo: 48, rollLabel: '48', name: 'TARINI CHARAN SAHU', listType: 'Regular DR List (01–109)', pageNo: 3 },
  { slNo: 49, rollLabel: '49', name: 'MOHAMMED JAN', listType: 'Regular DR List (01–109)', pageNo: 3 },
  { slNo: 50, rollLabel: '50', name: 'MOHAN SAHOO', listType: 'Regular DR List (01–109)', pageNo: 3 },
  { slNo: 51, rollLabel: '51', name: 'MURALIDHAR BEHERA', listType: 'Regular DR List (01–109)', pageNo: 3 },
  { slNo: 52, rollLabel: '52', name: 'NIRMALA JENA', listType: 'Regular DR List (01–109)', pageNo: 3 },
  { slNo: 53, rollLabel: '53', name: 'NIRANJAN BISWAL', listType: 'Regular DR List (01–109)', pageNo: 3 },
  { slNo: 54, rollLabel: '54', name: 'NIRUPAMA BISWAL', listType: 'Regular DR List (01–109)', pageNo: 3 },
  { slNo: 55, rollLabel: '55', name: 'PRADEEPTA KUMAR ACHARYA', listType: 'Regular DR List (01–109)', pageNo: 3 },
  { slNo: 56, rollLabel: '56', name: 'PANCHANANA DALAI', listType: 'Regular DR List (01–109)', pageNo: 3 },
  { slNo: 57, rollLabel: '57', name: 'PANDABA SUNA', listType: 'Regular DR List (01–109)', pageNo: 3 },
  { slNo: 58, rollLabel: '58', name: 'PANGARI SUSANTA KUMAR UDAYABHANU', listType: 'Regular DR List (01–109)', pageNo: 3 },
  { slNo: 59, rollLabel: '59', name: 'PARAKSHITA BHOI', listType: 'Regular DR List (01–109)', pageNo: 3 },
  { slNo: 60, rollLabel: '60', name: 'PRABASINI NAYAK', listType: 'Regular DR List (01–109)', pageNo: 3 },

  // Page 4 (Sl. No. 61 to 80)
  { slNo: 61, rollLabel: '61', name: 'PRADEEP KUMAR BISWAL', listType: 'Regular DR List (01–109)', pageNo: 4 },
  { slNo: 62, rollLabel: '62', name: 'PRADEEPTA KUMAR ROUTRAY', listType: 'Regular DR List (01–109)', pageNo: 4 },
  { slNo: 63, rollLabel: '63', name: 'PRAFULLA KUMAR BEHERA', listType: 'Regular DR List (01–109)', pageNo: 4 },
  { slNo: 64, rollLabel: '64', name: 'PRAFULLA KUMAR DASH', listType: 'Regular DR List (01–109)', pageNo: 4 },
  { slNo: 65, rollLabel: '65', name: 'PRAFULLA KUMAR PARIDA', listType: 'Regular DR List (01–109)', pageNo: 4 },
  { slNo: 66, rollLabel: '66', name: 'PRAHALLADA BEHERA', listType: 'Regular DR List (01–109)', pageNo: 4 },
  { slNo: 67, rollLabel: '67', name: 'PRANAB KUMAR MOHANTY', listType: 'Regular DR List (01–109)', pageNo: 4 },
  { slNo: 68, rollLabel: '68', name: 'PRASANNA KUMAR BHANJA', listType: 'Regular DR List (01–109)', pageNo: 4 },
  { slNo: 69, rollLabel: '69', name: 'PRASANTA KUMAR NAYAK', listType: 'Regular DR List (01–109)', pageNo: 4 },
  { slNo: 70, rollLabel: '70', name: 'PRASANTA KUMAR PANI', listType: 'Regular DR List (01–109)', pageNo: 4 },
  { slNo: 71, rollLabel: '71', name: 'PRATAP CHANDRA BISWAL', listType: 'Regular DR List (01–109)', pageNo: 4 },
  { slNo: 72, rollLabel: '72', name: 'PURNAMASI BISWAL', listType: 'Regular DR List (01–109)', pageNo: 4 },
  { slNo: 73, rollLabel: '73', name: 'PUSPALATA PUHAN', listType: 'Regular DR List (01–109)', pageNo: 4 },
  { slNo: 74, rollLabel: '74', name: 'RABINARAYAN NATH SHARMA', listType: 'Regular DR List (01–109)', pageNo: 4 },
  { slNo: 75, rollLabel: '75', name: 'RABINDRA KUMAR BEHERA', listType: 'Regular DR List (01–109)', pageNo: 4 },
  { slNo: 76, rollLabel: '76', name: 'RABINDRA KUMAR NAYAK', listType: 'Regular DR List (01–109)', pageNo: 4 },
  { slNo: 77, rollLabel: '77', name: 'RAGHUNATH BHOI', listType: 'Regular DR List (01–109)', pageNo: 4 },
  { slNo: 78, rollLabel: '78', name: 'RAJALAXMI MOHAPATRA', listType: 'Regular DR List (01–109)', pageNo: 4 },
  { slNo: 79, rollLabel: '79', name: 'RAJANI KANTA ROUT', listType: 'Regular DR List (01–109)', pageNo: 4 },
  { slNo: 80, rollLabel: '80', name: 'RAJA KISHOR MUDULI', listType: 'Regular DR List (01–109)', pageNo: 4 },

  // Page 5 (Sl. No. 81 to 100)
  { slNo: 81, rollLabel: '81', name: 'RAMANANDA KAMPA', listType: 'Regular DR List (01–109)', pageNo: 5 },
  { slNo: 82, rollLabel: '82', name: 'RENUBALA MOHANTY', listType: 'Regular DR List (01–109)', pageNo: 5 },
  { slNo: 83, rollLabel: '83', name: 'RITANJALI PADHY', listType: 'Regular DR List (01–109)', pageNo: 5 },
  { slNo: 84, rollLabel: '84', name: 'ROHITA TANDI', listType: 'Regular DR List (01–109)', pageNo: 5 },
  { slNo: 85, rollLabel: '85', name: 'SAILA BALA ROUT', listType: 'Regular DR List (01–109)', pageNo: 5 },
  { slNo: 86, rollLabel: '86', name: 'SAHADEV KUMAR SAHA', listType: 'Regular DR List (01–109)', pageNo: 5 },
  { slNo: 87, rollLabel: '87', name: 'SANGHAMITRA MOHANTY', listType: 'Regular DR List (01–109)', pageNo: 5 },
  { slNo: 88, rollLabel: '88', name: 'SANGRAM KESHARI BHANJA', listType: 'Regular DR List (01–109)', pageNo: 5 },
  { slNo: 89, rollLabel: '89', name: 'SANKARSAN PANDA', listType: 'Regular DR List (01–109)', pageNo: 5 },
  { slNo: 90, rollLabel: '90', name: 'SANTOSH KUMAR JENA', listType: 'Regular DR List (01–109)', pageNo: 5 },
  { slNo: 91, rollLabel: '91', name: 'SAROJINI DEI', listType: 'Regular DR List (01–109)', pageNo: 5 },
  { slNo: 92, rollLabel: '92', name: 'SATYA PRIYA ROUT', listType: 'Regular DR List (01–109)', pageNo: 5 },
  { slNo: 93, rollLabel: '93', name: 'SUPRAVA PRADHAN', listType: 'Regular DR List (01–109)', pageNo: 5 },
  { slNo: 94, rollLabel: '94', name: 'SURATHA NAIK', listType: 'Regular DR List (01–109)', pageNo: 5 },
  { slNo: 95, rollLabel: '95', name: 'SURENDRA MAHAKUR', listType: 'Regular DR List (01–109)', pageNo: 5 },
  { slNo: 96, rollLabel: '96', name: 'SURJYAMANI BUDHIA', listType: 'Regular DR List (01–109)', pageNo: 5 },
  { slNo: 97, rollLabel: '97', name: 'SURYA NARAYAN PANDA', listType: 'Regular DR List (01–109)', pageNo: 5 },
  { slNo: 98, rollLabel: '98', name: 'SWADHIN KUMAR ROUT', listType: 'Regular DR List (01–109)', pageNo: 5 },
  { slNo: 99, rollLabel: '99', name: 'TRINATH NAYAK', listType: 'Regular DR List (01–109)', pageNo: 5 },
  { slNo: 100, rollLabel: '100', name: 'TUSHAR RANJAN PANDA', listType: 'Regular DR List (01–109)', pageNo: 5 },

  // Page 6 (Sl. No. 101 to 109)
  { slNo: 101, rollLabel: '101', name: 'BISHNU CHARAN RATH', listType: 'Regular DR List (01–109)', pageNo: 6 },
  { slNo: 102, rollLabel: '102', name: 'B. PRADEEP KUMAR PATRA', listType: 'Regular DR List (01–109)', pageNo: 6 },
  { slNo: 103, rollLabel: '103', name: 'HARIHAR SA', listType: 'Regular DR List (01–109)', pageNo: 6 },
  { slNo: 104, rollLabel: '104', name: 'JHUNUBALA NAYAK', listType: 'Regular DR List (01–109)', pageNo: 6 },
  { slNo: 105, rollLabel: '105', name: 'KRUSHNA CHANDRA MOHARANA', listType: 'Regular DR List (01–109)', pageNo: 6 },
  { slNo: 106, rollLabel: '106', name: 'MAMATA MAYEE MOHANTY', listType: 'Regular DR List (01–109)', pageNo: 6 },
  { slNo: 107, rollLabel: '107', name: 'PRADEEP KUMAR SINGH BABU', listType: 'Regular DR List (01–109)', pageNo: 6 },
  { slNo: 108, rollLabel: '108', name: 'SATYA NARAYAN PANIGRAHI', listType: 'Regular DR List (01–109)', pageNo: 6 },
  { slNo: 109, rollLabel: '109', name: 'SUSANT KUMAR DASH', listType: 'Regular DR List (01–109)', pageNo: 6 },

  // Page 7 (Supplementary DR List Sl. No. 01 to 06 — Total 115 Candidates)
  { slNo: 110, rollLabel: 'S-01', name: 'MANJULA MEKAP', listType: 'Supplementary DR List (01–06)', pageNo: 7 },
  { slNo: 111, rollLabel: 'S-02', name: 'RANJANA MEKAP', listType: 'Supplementary DR List (01–06)', pageNo: 7 },
  { slNo: 112, rollLabel: 'S-03', name: 'PURNA CHANDRA MANDAL', listType: 'Supplementary DR List (01–06)', pageNo: 7 },
  { slNo: 113, rollLabel: 'S-04', name: 'NRUSINGH CHARAN SAHOO', listType: 'Supplementary DR List (01–06)', pageNo: 7 },
  { slNo: 114, rollLabel: 'S-05', name: 'AKHILA KUMAR POLAI', listType: 'Supplementary DR List (01–06)', pageNo: 7 },
  { slNo: 115, rollLabel: 'S-06', name: 'MANOJ MOHAN BARAL', listType: 'Supplementary DR List (01–06)', pageNo: 7 },
];

export function getSchoolFullDetails(school: School, fallbackIndex = 1): SchoolFullDetails {
  const zone = getZoneDetails(school.zone);
  const sl = school.slNo || fallbackIndex;
  const prefix = ZONE_PREFIX_MAP[zone.id] || 'SCH';
  const schoolCode = school.code || `SCH-${prefix}-${String(sl).padStart(2, '0')}`;

  const isOrissaNoble =
    school.name.toLowerCase().includes('noble') || school.name.toLowerCase().includes('nobel');

  if (isOrissaNoble) {
    return {
      schoolCode: 'SCH-BBS-02',
      slNo: sl,
      name: 'Orissa Noble C.T. School',
      zoneId: 'bhubaneswar',
      zoneName: zone.fullTitle || 'Bhubaneswar Zone (BBS)',
      zoneShortCode: zone.code || 'BZB-HQ',
      district: 'Khurda',
      address: {
        at: 'Surya Nagar',
        po: 'Surya Nagar',
        via: 'Bhubaneswar',
        circle: 'Khurda',
        educationalDistrict: 'Bhubaneswar',
        block: 'Bhubaneswar',
        telegraphOffice: 'Bhubaneswar',
        landline: '0674-2397022',
        atPo: 'At: Surya Nagar, Post: Surya Nagar, Via: Bhubaneswar',
        dist: 'Khurda',
        pin: '751003',
      },
      secretary: {
        name: 'Santosh Kumar Behera',
        designation: 'Headmaster / Head of the Institution',
        idCardNo: 'AOP-HM-BBS-02',
        phone: '0674-2397022 / +91 63709 87576',
        whatsapp: '916370987576',
        email: 'orissa.noble.ct@aopstsma.in',
        photo: '/assets/img/secretary-avatar.svg',
      },
      batches: [
        {
          order: '1st Batch',
          batchLabel: '1989 - 1990 Batch',
          session: '1989 - 1990 Batch',
          remarks: '1st Recognized C.T. Training Batch — Verified under BSE Exam Form No. 29 (2009)',
        },
        {
          order: '2nd Batch',
          batchLabel: '1990 - 1991 Batch',
          session: '1990 - 1991 Batch',
          remarks: '2nd Recognized C.T. Training Batch — Verified under BSE Exam Form No. 29 (2009)',
        },
        {
          order: '3rd Batch',
          batchLabel: '1991 - 1992 Batch',
          session: '1991 - 1992 Batch',
          remarks: '3rd Recognized C.T. Training Batch — Verified under BSE Exam Form No. 29 (2009)',
        },
        {
          order: 'Other Batch',
          batchLabel: '1992 - 1993 Other Batch (115 DR Candidates)',
          session: '1992 - 1993 Other Batch',
          remarks: '115 Verified Candidates (109 Regular + 06 Supplementary) in BSE Form No. 29 dated 22/06/2009',
        },
      ],
      invigilators: zone.centres || [],
      drFormPdf: '/assets/docs/orissa-noble-ct-school-dr-2009.pdf',
      drFormDate: '22/06/2009',
      drExamYear: '2009',
      candidates: ORISSA_NOBLE_CT_CANDIDATES,
    };
  }

  // Derive clean locality name from school title for At/P.O.
  const cleanLocality = school.name
    .replace(/Secondary Training School/gi, '')
    .replace(/School Of Education/gi, '')
    .replace(/C\.T School/gi, '')
    .replace(/Education Complex/gi, '')
    .replace(/Education Centre/gi, '')
    .replace(/& Pharmaceutical School/gi, '')
    .trim();

  const atPoLocality = school.atPo || (cleanLocality ? `${cleanLocality}, P.O. – ${cleanLocality}` : `At/P.O. – ${school.district}`);
  const pin = school.pin || DISTRICT_PIN_MAP[school.district] || '751010';
  const slug = school.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.|\.$/g, '')
    .slice(0, 22);

  return {
    schoolCode,
    slNo: sl,
    name: school.name,
    zoneId: zone.id,
    zoneName: zone.fullTitle || zone.name,
    zoneShortCode: zone.code || 'CZC',
    district: school.district || 'Odisha',
    address: {
      at: cleanLocality || school.district || 'Odisha',
      po: cleanLocality || school.district || 'Odisha',
      atPo: atPoLocality,
      dist: school.district || 'Odisha',
      pin,
    },
    secretary: {
      name: school.secretaryName || `Secretary (${cleanLocality || school.name})`,
      designation: 'Secretary',
      idCardNo: `AOP-SEC-${prefix}-${String(sl).padStart(2, '0')}`,
      phone: school.secretaryPhone || '+91 63709 87576',
      whatsapp: '916370987576',
      email: school.email || `${slug}@aopstsma.in`,
      photo: '/assets/img/secretary-avatar.svg',
    },
    batches: [
      {
        order: '1st Batch',
        batchLabel: '1989 - 1990 Batch',
        session: '1989 - 1990 Batch',
        remarks: '1st Recognized C.T. Training Batch (1989–1990)',
      },
      {
        order: '2nd Batch',
        batchLabel: '1990 - 1991 Batch',
        session: '1990 - 1991 Batch',
        remarks: '2nd Recognized C.T. Training Batch (1990–1991)',
      },
      {
        order: '3rd Batch',
        batchLabel: '1991 - 1992 Batch',
        session: '1991 - 1992 Batch',
        remarks: '3rd Recognized C.T. Training Batch (1991–1992)',
      },
      {
        order: 'Other Batch',
        batchLabel: '1992 - 1993 Other Batch',
        session: '1992 - 1993 Other Batch',
        remarks: 'Subsequent & Additional Batch Records (1992–1993)',
      },
    ],
    invigilators: zone.centres || [],
  };
}
