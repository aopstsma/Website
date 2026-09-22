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
    file: 'orissa-high-court-wp-5640-2009-judgment.pdf',
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
    file: 'orissa-high-court-wp-5640-2009-judgment.pdf',
    category: 'court_order',
    subCategory: 'high_court',
    badge: 'Correction Order',
    date: '12th December 2008',
    court: 'IN THE HIGH COURT OF ORISSA AT CUTTACK',
    petitioner: 'All Orissa Private Secondary Training Schools Management Association',
    respondent: 'State of Orissa represented through Commissioner-cum-Secretary & Director Secondary Education',
    bench: 'The Honourable Shri Justice M. M. Das',
    operativeParagraph: 'Upon mention, the clerical corrections in the order dated 24.09.2008 stand rectified. State respondents are instructed to treat member institution representations with immediate priority.'
  },
  {
    ref: 'WA-146',
    year: '2009',
    title: 'Writ Appeal No. 146 of 2009',
    note: 'Orissa High Court — Appellate Division Bench order affirming single judge directions and securing candidate examination protections against state interference.',
    file: 'orissa-high-court-wp-5640-2009-judgment.pdf',
    category: 'court_order',
    subCategory: 'high_court',
    badge: 'Writ Appeal',
    date: '2009',
    court: 'IN THE HIGH COURT OF ORISSA AT CUTTACK',
    petitioner: 'All Orissa Private Secondary Training Schools Management Association',
    respondent: 'State of Orissa & Board of Secondary Education',
    bench: 'Hon’ble Division Bench of Orissa High Court',
    operativeParagraph: 'The Division Bench reviewed the writ petitions and maintained interim protective relief for candidate examination forms and institutional recognition status.'
  },
  {
    ref: 'WA-142',
    year: '2009',
    title: 'Writ Appeal No. 142 of 2009',
    note: 'Orissa High Court — Companion Writ Appeal upholding procedural fairness, fee regularization, and institutional autonomy across all 5 zones.',
    file: 'orissa-high-court-wp-5640-2009-judgment.pdf',
    category: 'court_order',
    subCategory: 'high_court',
    badge: 'Writ Appeal',
    date: '2009',
    court: 'IN THE HIGH COURT OF ORISSA AT CUTTACK',
    petitioner: 'All Orissa Private Secondary Training Schools Management Association',
    respondent: 'State of Orissa & Ors.',
    bench: 'Hon’ble Division Bench of Orissa High Court',
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
    file: 'orissa-high-court-wp-5640-2009-judgment.pdf',
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
    file: 'orissa-high-court-wp-5640-2009-judgment.pdf',
    category: 'supreme_court',
    subCategory: 'supreme_court',
    badge: 'Supreme Court SLP',
    date: '2014',
    court: 'SUPREME COURT OF INDIA, NEW DELHI',
    petitioner: 'All Orissa Private Secondary Training Schools Management Association & Ors.',
    respondent: 'State of Odisha & Ors.',
    bench: 'Hon’ble Supreme Court of India',
    operativeParagraph: 'Special Leave Petition entertained in the Apex Court safeguarding the collective interest of member training institutions across Odisha.'
  },
  {
    ref: 'SLP-24707-A',
    year: '2014',
    title: 'SLP (Civil) No. 24707 of 2014 (Order dated 06.02.2015)',
    note: 'Supreme Court of India — Landmark interim proceedings dated 06/02/2015 protecting the ongoing status of member institutions and examination conduct.',
    file: 'orissa-high-court-wp-5640-2009-judgment.pdf',
    category: 'supreme_court',
    subCategory: 'supreme_court',
    badge: 'Supreme Court Order',
    date: '6th February 2015',
    court: 'SUPREME COURT OF INDIA, NEW DELHI',
    petitioner: 'AOPSTSMA & Member Institutions',
    respondent: 'State of Odisha, BSE & Dept of School and Mass Education',
    bench: 'Hon’ble Supreme Court of India',
    operativeParagraph: 'Order dated 06.02.2015 issued in SLP(C) 24707/2014 granting interim consideration and directing status examination of trainee batches.'
  },
  {
    ref: 'SLP-24707-B',
    year: '2014',
    title: 'SLP (Civil) No. 24707 of 2014 (Order dated 30.03.2015)',
    note: 'Supreme Court of India — Apex Court order dated 30/03/2015 establishing binding legal framework and judicial safeguards for association schools.',
    file: 'orissa-high-court-wp-5640-2009-judgment.pdf',
    category: 'supreme_court',
    subCategory: 'supreme_court',
    badge: 'Supreme Court Order',
    date: '30th March 2015',
    court: 'SUPREME COURT OF INDIA, NEW DELHI',
    petitioner: 'AOPSTSMA & Member Institutions',
    respondent: 'State of Odisha & Ors.',
    bench: 'Hon’ble Supreme Court of India',
    operativeParagraph: 'Final proceedings in SLP 24707/2014 dated 30.03.2015 directing authorities to safeguard genuine educational infrastructure and candidate qualifications.'
  },

  // ==================== 3. BSE & GOVT COMMUNICATED ORDERS (3 Letters) ====================
  {
    ref: 'BSE-896',
    year: '2009',
    title: 'Board of Secondary Education Communicated Order — Letter No. 896',
    note: 'Board of Secondary Education (BSE), Odisha — Official letter dated 05/02/2009 communicating examination center allocations, candidate roll verification, and center superintendence.',
    file: '',
    category: 'bse_order',
    subCategory: 'bse_letter',
    badge: 'BSE Letter 896',
    date: '5th February 2009',
    court: 'BOARD OF SECONDARY EDUCATION, ODISHA, CUTTACK',
    petitioner: 'BSE Examination Directorate',
    respondent: 'Member Training Schools, AOPSTSMA',
    operativeParagraph: 'Communication of examination logistics and center notifications for private secondary training candidates under BSE auspices.'
  },
  {
    ref: 'GO-118/8',
    year: '2009',
    title: 'Government Order No. 118/8 dated 27.01.2009',
    note: 'School & Mass Education Department, Govt. of Odisha — Executive government order directing regulatory review and structural verification for training schools.',
    file: '',
    category: 'department_letter',
    subCategory: 'govt_order',
    badge: 'Govt Order 118/8',
    date: '27th January 2009',
    court: 'GOVERNMENT OF ODISHA, SCHOOL & MASS EDUCATION DEPARTMENT',
    petitioner: 'Govt. Secretariat, Bhubaneswar',
    respondent: 'Director Secondary Education / BSE',
    operativeParagraph: 'Executive notification directing the assessment and structured integration of private teacher education institutions.'
  },
  {
    ref: 'BSE-249(5)',
    year: '2009',
    title: 'BSE / Department Communication No. 249(5) dated 12.05.2009',
    note: 'Board of Secondary Education & Departmental Joint Communication dated 12/05/2009 formalizing examination protocols and admission guidelines.',
    file: '',
    category: 'bse_order',
    subCategory: 'bse_letter',
    badge: 'Communication 249(5)',
    date: '12th May 2009',
    court: 'BOARD OF SECONDARY EDUCATION, ODISHA',
    petitioner: 'Controller of Examinations, BSE',
    respondent: 'Principals / Secretaries of Affiliated Training Schools',
    operativeParagraph: 'Official notification communicating administrative compliance parameters, enrollment roll validation, and certification protocol.'
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
    title: 'Advisory on DIR Renewal & Deposits',
    note: 'Guidelines for submission of renewal files, legal fee contributions, and annual portal registration for 2025-26.',
    file: '',
    category: 'notice',
    subCategory: 'notice',
    badge: 'Advisory',
    date: 'Nov 2025'
  }
];
