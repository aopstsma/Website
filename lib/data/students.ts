/* ============================================================
   AOPSTSMA — Verified Student & Member School Database
   ============================================================ */

export interface StudentRecord {
  studentId: string;
  studentName: string;
  mobileNumber: string;
  zoneId: string;
  zoneName: string;
  schoolId: string;
  schoolName: string;
  district: string;
  feeAmount: number;
  paymentStatus: 'Pending' | 'Paid';
  transactionId?: string;
  paidAt?: string;
}

export interface SchoolAccount {
  schoolId: string;
  schoolName: string;
  zoneId: string;
  district: string;
  username: string;
  passwordHash: string;
  contactEmail?: string;
  contactPhone?: string;
}

// Initial Verified Roster Data (Searchable by Student ID / Roll No + Mobile + Zone)
export const INITIAL_STUDENTS: StudentRecord[] = [
  {
    studentId: 'STU-2026-001',
    studentName: 'Suryakanta Mohanty',
    mobileNumber: '9861012345',
    zoneId: 'bhubaneswar',
    zoneName: 'Bhubaneswar Zone',
    schoolId: 'SCH-BBS-01',
    schoolName: 'Rajadhani School Of Education',
    district: 'Khordha',
    feeAmount: 2500,
    paymentStatus: 'Pending',
  },
  {
    studentId: 'STU-2026-002',
    studentName: 'Priyanka Das',
    mobileNumber: '9437098765',
    zoneId: 'bhubaneswar',
    zoneName: 'Bhubaneswar Zone',
    schoolId: 'SCH-BBS-02',
    schoolName: 'Odisha Nobel C.T School',
    district: 'Khordha',
    feeAmount: 2500,
    paymentStatus: 'Pending',
  },
  {
    studentId: 'STU-2026-003',
    studentName: 'Manas Kumar Sahoo',
    mobileNumber: '7008123456',
    zoneId: 'central',
    zoneName: 'Central Zone',
    schoolId: 'SCH-CEN-01',
    schoolName: 'Jagannath Secondary Training School',
    district: 'Cuttack',
    feeAmount: 2500,
    paymentStatus: 'Pending',
  },
  {
    studentId: 'STU-2026-004',
    studentName: 'Deepak Ranjan Nayak',
    mobileNumber: '9124567890',
    zoneId: 'balasore',
    zoneName: 'Baleswar Zone',
    schoolId: 'SCH-BAL-01',
    schoolName: 'Bhadrak Secondary Training School',
    district: 'Bhadrak',
    feeAmount: 2500,
    paymentStatus: 'Pending',
  },
  {
    studentId: 'STU-2026-005',
    studentName: 'Smruti Rekha Swain',
    mobileNumber: '8249011223',
    zoneId: 'ganjam',
    zoneName: 'Berhampur Zone',
    schoolId: 'SCH-GAN-01',
    schoolName: 'Sri Aurobinda Secondary Training School',
    district: 'Ganjam',
    feeAmount: 2500,
    paymentStatus: 'Pending',
  },
];

// Member School Accounts (For Login)
export const SCHOOL_ACCOUNTS: SchoolAccount[] = [
  {
    schoolId: 'SCH-BBS-01',
    schoolName: 'Rajadhani School Of Education',
    zoneId: 'bhubaneswar',
    district: 'Khordha',
    username: 'rajadhani.bbs',
    passwordHash: 'aopstsma1980',
    contactEmail: 'contact@rajadhani.edu.in',
    contactPhone: '+91 63709 87576',
  },
  {
    schoolId: 'SCH-BBS-02',
    schoolName: 'Odisha Nobel C.T School',
    zoneId: 'bhubaneswar',
    district: 'Khordha',
    username: 'nobel.bbs',
    passwordHash: 'aopstsma1980',
    contactEmail: 'info@nobelct.org',
    contactPhone: '+91 94370 98765',
  },
  {
    schoolId: 'SCH-CEN-01',
    schoolName: 'Jagannath Secondary Training School',
    zoneId: 'central',
    district: 'Cuttack',
    username: 'jagannath.cuttack',
    passwordHash: 'aopstsma1980',
    contactEmail: 'jsts.cuttack@gmail.com',
    contactPhone: '+91 70081 23456',
  },
];
