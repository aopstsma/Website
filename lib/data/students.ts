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

// Verified Roster Data (Populated dynamically via school uploads or registrations)
export const INITIAL_STUDENTS: StudentRecord[] = [];


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
