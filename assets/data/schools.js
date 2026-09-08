/* ============================================================
   Member school directory
   Extracted from the association's schoolwise abstract, pages 07-11.
   To add a school: append an object to SCHOOLS below.
   ============================================================ */

const ZONES = [
  { id: 'balasore',    name: 'Balasore Zone',    districts: 'Mayurbhanj, Keonjhar, Balasore, Bhadrak' },
  { id: 'cuttack',     name: 'Cuttack Zone',     districts: 'Recorded as Central Zone in the abstract' },
  { id: 'bhubaneswar', name: 'Bhubaneswar Zone', districts: 'School list awaited' },
  { id: 'zone-four',   name: 'Fourth Zone',      districts: 'Zone name and list awaited', pending: true },
  { id: 'sambalpur',   name: 'Sambalpur Zone',   districts: 'Districts to be confirmed' },
  { id: 'berhampur',   name: 'Berhampur Zone',   districts: 'School list awaited' }
];

const SCHOOLS = [
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

/* Legal record archive.
   Drop scanned PDFs into assets/docs/ and put the filename in `file`
   to turn a row into a working download. */
const DOCUMENTS = [
  { ref: '10372', year: '2008', title: 'Writ petition 10372 of 2008', note: 'Orissa High Court', file: '' },
  { ref: '146',   year: '2009', title: 'Writ petition 146 of 2009',   note: 'Orissa High Court', file: '' },
  { ref: '56140', year: '2010', title: 'Writ petition 56140 of 2010', note: 'Orissa High Court', file: '' },
  { ref: 'SC',    year: '',     title: 'Supreme Court order',         note: 'Order on appeal', file: '' },
  { ref: 'AN',    year: '',     title: 'Association notice',          note: 'Circulated to member schools', file: '' },
  { ref: 'CO',    year: '',     title: 'Considered order',            note: 'School and Mass Education Department', file: '' },
  { ref: 'BL',    year: '',     title: 'Board letter',                note: 'Board of Secondary Education, Odisha', file: '' },
  { ref: 'NC',    year: '',     title: 'Note to Cabinet',             note: 'Government of Odisha', file: '' }
];
