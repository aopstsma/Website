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
export const INITIAL_STUDENTS: StudentRecord[] = [
  {
    studentId: 'STU-BBS-2026-001',
    studentName: 'Rajesh Kumar Das',
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
    studentId: 'STU-BBS-2026-002',
    studentName: 'Priyanka Mohapatra',
    mobileNumber: '9437098765',
    zoneId: 'bhubaneswar',
    zoneName: 'Bhubaneswar Zone',
    schoolId: 'SCH-BBS-01',
    schoolName: 'Rajadhani School Of Education',
    district: 'Khordha',
    feeAmount: 2500,
    paymentStatus: 'Pending',
  },
  {
    studentId: 'STU-BBS-2026-003',
    studentName: 'Soumya Ranjan Nayak',
    mobileNumber: '7008123456',
    zoneId: 'bhubaneswar',
    zoneName: 'Bhubaneswar Zone',
    schoolId: 'SCH-BBS-02',
    schoolName: 'Odisha Nobel C.T School',
    district: 'Khordha',
    feeAmount: 2500,
    paymentStatus: 'Pending',
  },
  {
    studentId: 'STU-CEN-2026-001',
    studentName: 'Amitav Pradhan',
    mobileNumber: '9853214567',
    zoneId: 'central',
    zoneName: 'Central Zone',
    schoolId: 'SCH-CEN-01',
    schoolName: 'Jagannath Secondary Training School',
    district: 'Cuttack',
    feeAmount: 2500,
    paymentStatus: 'Pending',
  },
  {
    studentId: 'STU-CEN-2026-002',
    studentName: 'Subhashree Mishra',
    mobileNumber: '9124567890',
    zoneId: 'central',
    zoneName: 'Central Zone',
    schoolId: 'SCH-CEN-01',
    schoolName: 'Jagannath Secondary Training School',
    district: 'Cuttack',
    feeAmount: 2500,
    paymentStatus: 'Pending',
  },
  {
    studentId: 'STU-GAN-2026-001',
    studentName: 'Deepak Rout',
    mobileNumber: '9439123456',
    zoneId: 'ganjam',
    zoneName: 'Berhampur Zone',
    schoolId: 'SCH-GAN-01',
    schoolName: 'Sri Aurobinda Secondary Training School',
    district: 'Ganjam',
    feeAmount: 2500,
    paymentStatus: 'Pending',
  },
  {
    studentId: 'STU-BAL-2026-001',
    studentName: 'Smruti Rekha Behera',
    mobileNumber: '9938765432',
    zoneId: 'balasore',
    zoneName: 'Baleswar Zone',
    schoolId: 'SCH-BAL-01',
    schoolName: 'Balasore Training School',
    district: 'Balasore',
    feeAmount: 2500,
    paymentStatus: 'Pending',
  },
  {
    studentId: 'STU-SAM-2026-001',
    studentName: 'Bikash Kumar Patel',
    mobileNumber: '9861234567',
    zoneId: 'sambalpur',
    zoneName: 'Sambalpur Zone',
    schoolId: 'SCH-SAM-01',
    schoolName: 'Sambalpur Secondary Training School',
    district: 'Sambalpur',
    feeAmount: 2500,
    paymentStatus: 'Pending',
  },
];

// In-memory runtime store for school uploaded records
declare global {
  // eslint-disable-next-line no-var
  var __AOPSTSMA_UPLOADED_STUDENTS__: StudentRecord[] | undefined;
}

export function getUploadedStudents(): StudentRecord[] {
  if (!globalThis.__AOPSTSMA_UPLOADED_STUDENTS__) {
    globalThis.__AOPSTSMA_UPLOADED_STUDENTS__ = [];
  }
  return globalThis.__AOPSTSMA_UPLOADED_STUDENTS__;
}

export function saveUploadedStudents(records: StudentRecord[]) {
  const current = getUploadedStudents();
  globalThis.__AOPSTSMA_UPLOADED_STUDENTS__ = [...records, ...current];
  return globalThis.__AOPSTSMA_UPLOADED_STUDENTS__;
}

export function getAllStudents(): StudentRecord[] {
  return [...getUploadedStudents(), ...INITIAL_STUDENTS];
}

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
