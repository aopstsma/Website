/* ============================================================
   Member school directory
   Extracted from the association's schoolwise abstract, pages 07-11.
   ============================================================ */

export interface Zone {
  id: string;
  name: string;
  districts: string;
  pending?: boolean;
}

export interface School {
  name: string;
  zone: string;
  district: string;
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
  operativeParagraph?: string;
}

export const ZONES: Zone[] = [
  { id: 'balasore',    name: 'Balasore Zone',    districts: 'Mayurbhanj, Keonjhar, Balasore, Bhadrak' },
  { id: 'cuttack',     name: 'Cuttack Zone',     districts: 'Recorded as Central Zone in the abstract' },
  { id: 'bhubaneswar', name: 'Bhubaneswar Zone', districts: 'School list awaited' },
  { id: 'zone-four',   name: 'Fourth Zone',      districts: 'Zone name and list awaited', pending: true },
  { id: 'sambalpur',   name: 'Sambalpur Zone',   districts: 'Districts to be confirmed' },
  { id: 'berhampur',   name: 'Berhampur Zone',   districts: 'School list awaited' }
];

export const SCHOOLS: School[] = [
  { name: 'Durgapur STS',              zone: 'balasore', district: 'Mayurbhanj' },
  { name: 'B.P. Education Centre',     zone: 'balasore', district: 'Mayurbhanj' },
  { name: 'New Life STS, Baripada',    zone: 'balasore', district: 'Mayurbhanj' },
  { name: 'Regional STS, Morada',      zone: 'balasore', district: 'Mayurbhanj' },
  { name: 'Baba Jateswar STS',         zone: 'balasore', district: 'Mayurbhanj' },
  { name: 'Mayurbhanj STS',            zone: 'balasore', district: 'Mayurbhanj' },
  { name: 'Godapalasa STS',            zone: 'balasore', district: 'Mayurbhanj' },
  { name: 'Purusottam STS',            zone: 'balasore', district: 'Mayurbhanj' },
  { name: 'Rasamtala STS',             zone: 'balasore', district: 'Mayurbhanj' },
  { name: 'Purnima STS',               zone: 'balasore', district: 'Mayurbhanj' },
  { name: 'Sri Aurobinda STS',         zone: 'balasore', district: 'Mayurbhanj' },
  { name: 'Aguad STS',                 zone: 'balasore', district: 'Mayurbhanj' },
  { name: 'Ajan STS',                  zone: 'balasore', district: 'Mayurbhanj' },
  { name: 'Bapuji STS',                zone: 'balasore', district: 'Mayurbhanj' },
  { name: 'Gedma STS',                 zone: 'balasore', district: 'Keonjhar' },
  { name: 'Laxmi Priya STS',           zone: 'balasore', district: 'Balasore' },
  { name: 'Kusha Charan STS',          zone: 'balasore', district: 'Balasore' },
  { name: 'Dahamunda STS',             zone: 'balasore', district: 'Balasore' },
  { name: 'Beenapani STS',             zone: 'balasore', district: 'Balasore' },
  { name: 'Debagiri STS, Gopinathpur', zone: 'balasore', district: 'Balasore' },
  { name: 'Debagiri STS, Mangalpur',   zone: 'balasore', district: 'Balasore' },
  { name: 'Mahamahima STS',            zone: 'balasore', district: 'Balasore' },
  { name: 'Radhakishore STS',          zone: 'balasore', district: 'Balasore' },
  { name: 'Jagabandhu STS',            zone: 'balasore', district: 'Bhadrak' },
  { name: 'Adhalpank STS',             zone: 'balasore', district: 'Bhadrak' },
  { name: 'New Adhalpank STS',         zone: 'balasore', district: 'Bhadrak' },
  { name: 'Basudevpur STS',            zone: 'balasore', district: 'Bhadrak' },
  { name: 'Sonalpur STS',              zone: 'balasore', district: 'Bhadrak' },
  { name: 'Anchalik STS',              zone: 'balasore', district: 'Bhadrak' },
  { name: 'Sri Jagannath STS',         zone: 'balasore', district: 'Bhadrak' },

  { name: 'Jagannath STS',             zone: 'cuttack', district: '' },
  { name: 'Bhadreswar STS',            zone: 'cuttack', district: '' },
  { name: 'Kaduapada STS',             zone: 'cuttack', district: '' },
  { name: 'Tulasi STS',                zone: 'cuttack', district: '' },
  { name: 'Dhaniso STS',               zone: 'cuttack', district: '' },
  { name: 'Bagdevi STS',               zone: 'cuttack', district: '' },
  { name: 'Binapani STS',              zone: 'cuttack', district: '' },
  { name: 'Derabis STS',               zone: 'cuttack', district: '' },
  { name: 'Artreswar STS',             zone: 'cuttack', district: '' },
  { name: 'Mahabir STS',               zone: 'cuttack', district: '' },
  { name: 'Bagdia STS',                zone: 'cuttack', district: '' },
  { name: 'Mahima STS',                zone: 'cuttack', district: '' },
  { name: 'Gadamandal STS',            zone: 'cuttack', district: '' },
  { name: 'Astasambhu STS, Kualo',     zone: 'cuttack', district: '' },
  { name: 'Acharya Harihar STS',       zone: 'cuttack', district: '' },
  { name: 'Kameswar STS',              zone: 'cuttack', district: '' },
  { name: 'Sadasiba STS',              zone: 'cuttack', district: '' },
  { name: 'Uchhabeswar STS',           zone: 'cuttack', district: '' },

  { name: 'Saradhapur STS',            zone: 'sambalpur', district: '' },
  { name: 'Madhusudan STS',            zone: 'sambalpur', district: '' },
  { name: 'Balijodi STS',              zone: 'sambalpur', district: '' },
  { name: 'Maa Samaleswari STS',       zone: 'sambalpur', district: '' },
  { name: 'Kuruda STS',                zone: 'sambalpur', district: '' },
  { name: 'Brahmani STS',              zone: 'sambalpur', district: '' },
  { name: 'Gopana STS',                zone: 'sambalpur', district: '' },
  { name: 'Saleibahal STS',            zone: 'sambalpur', district: '' }
];

export const DOCUMENTS: DocumentRecord[] = [
  // Court orders & Writ Petitions
  { ref: '10372', year: '2008', title: 'Writ petition 10372 of 2008', note: 'Orissa High Court — Petition challenging recognition directives', file: '', category: 'court_order', badge: 'Court Order' },
  { ref: '146',   year: '2009', title: 'Writ petition 146 of 2009',   note: 'Orissa High Court — Order granting interim stay and protection',   file: '', category: 'court_order', badge: 'Court Order' },
  { ref: '56140', year: '2010', title: 'Writ petition 56140 of 2010', note: 'Orissa High Court — Final judgment on affiliation and student intake', file: '', category: 'court_order', badge: 'Court Order' },
  { ref: 'SC/SLP', year: '2012', title: 'Supreme Court order on Appeal', note: 'Supreme Court of India — Affirmation of member institutions rights', file: '', category: 'court_order', badge: 'Supreme Court' },

  // Departmental letters & Government notifications
  { ref: 'CO-08', year: '2014', title: 'Considered order on Training Schools', note: 'School and Mass Education Department, Govt. of Odisha', file: '', category: 'department_letter', badge: 'Govt Order' },
  { ref: 'BL-219', year: '2016', title: 'Board letter on Exam Center Allocation', note: 'Board of Secondary Education, Odisha', file: '', category: 'department_letter', badge: 'Board Letter' },
  { ref: 'NC-45',  year: '2018', title: 'Note to Cabinet on Policy Framing', note: 'General Administration & S&ME Dept, Government of Odisha', file: '', category: 'department_letter', badge: 'Cabinet Note' },

  // Recent Association notices & circulars
  { ref: 'AN/26', year: '2026', title: 'Circular: Member School Directory 2026', note: 'Notice to all six zonal conveners and headmasters', file: '', category: 'notice', badge: 'Recent Notice', date: 'Jan 2026' },
  { ref: 'AN/25', year: '2025', title: 'Advisory on DIR Renewal & Deposits', note: 'Guidelines for submission of renewal files for 2025-26', file: '', category: 'notice', badge: 'Circular', date: 'Nov 2025' }
];
