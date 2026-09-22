-- ============================================================
-- AOPSTSMA Migration: OTP Auth Schema & 90 Member Schools Seed
-- Execute in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ============================================================

-- 1. School Contacts Table (Stores verified secretaries/headmasters for OTP auth)
create table if not exists school_contacts (
  id              uuid primary key default gen_random_uuid(),
  school_id       uuid references schools(id) on delete cascade,
  authority_name  text not null,
  mobile_number   text not null,
  designation     text default 'Secretary',
  is_verified     boolean default false,
  created_at      timestamptz default now()
);

-- 2. OTP Sessions Table (For persistent multi-instance OTP verification)
create table if not exists otp_sessions (
  id          uuid primary key default gen_random_uuid(),
  identifier  text not null,
  otp_hash    text not null,
  role        text not null default 'school' check (role in ('school', 'student', 'admin')),
  attempts    integer not null default 0,
  metadata    jsonb,
  expires_at  timestamptz not null,
  created_at  timestamptz default now()
);

create index if not exists idx_otp_identifier on otp_sessions (identifier);
create index if not exists idx_school_contacts_mobile on school_contacts (mobile_number);

-- RLS for auth tables
alter table school_contacts enable row level security;
alter table otp_sessions enable row level security;

create policy "Service role access for school_contacts"
  on school_contacts for all to service_role using (true);

create policy "Service role access for otp_sessions"
  on otp_sessions for all to service_role using (true);

-- ============================================================
-- 3. SEED ALL 90 RECOGNIZED MEMBER INSTITUTIONS
-- ============================================================

insert into schools (code, name, zone, district) values
-- BHUBANESWAR ZONE (15 Schools)
('SCH-BBS-01', 'Rajadhani School Of Education', 'bhubaneswar', 'Bhubaneswar, Khordha'),
('SCH-BBS-02', 'Odisha Nobel C.T School', 'bhubaneswar', 'Khordha'),
('SCH-BBS-03', 'Lingaraj Secondary Training School', 'bhubaneswar', 'Khordha'),
('SCH-BBS-04', 'Anjali Education', 'bhubaneswar', 'Khordha'),
('SCH-BBS-05', 'Anchalika Secondary Training School', 'bhubaneswar', 'Nayagarh'),
('SCH-BBS-06', 'Bapuji Education Complex', 'bhubaneswar', 'Puri'),
('SCH-BBS-07', 'Bani Bandana Secondary Training School', 'bhubaneswar', 'Khordha'),
('SCH-BBS-08', 'Sri Lokanath Secondary Training School', 'bhubaneswar', 'Khordha'),
('SCH-BBS-09', 'Panchayat Secondary Training School', 'bhubaneswar', 'Khordha'),
('SCH-BBS-10', 'Education Universe', 'bhubaneswar', 'Bhubaneswar'),
('SCH-BBS-11', 'Kalinga Bharati Secondary Training School', 'bhubaneswar', 'Khordha'),
('SCH-BBS-12', 'Abhiram Secondary Training School', 'bhubaneswar', 'Khordha'),
('SCH-BBS-13', 'Saswat Education', 'bhubaneswar', 'Bhubaneswar'),
('SCH-BBS-14', 'Sree Maa Secondary Training School', 'bhubaneswar', 'Khordha'),
('SCH-BBS-15', 'Sahaja Pur Secondary Training School', 'bhubaneswar', 'Khordha'),

-- BERHAMPUR ZONE (2 Schools)
('SCH-GAN-01', 'Sri Aurobinda Secondary Training School', 'ganjam', 'Berhampur, Ganjam'),
('SCH-GAN-02', 'Maa Bhagabati Secondary Training School', 'ganjam', 'Ganjam'),

-- CENTRAL ZONE (24 Schools)
('SCH-CEN-01', 'Jagannath Secondary Training School', 'central', 'Cuttack'),
('SCH-CEN-02', 'Bhadreswar Secondary Training School', 'central', 'Jagatsinghpur'),
('SCH-CEN-03', 'Kaduapada Secondary Training School', 'central', 'Cuttack'),
('SCH-CEN-04', 'Tulasi Secondary Training School', 'central', 'Kendrapara'),
('SCH-CEN-05', 'Dhaniso Secondary Training School', 'central', 'Cuttack'),
('SCH-CEN-06', 'Bagdevi Secondary Training School', 'central', 'Kendrapada'),
('SCH-CEN-07', 'Derabis Secondary Training School', 'central', 'Kendrapara'),
('SCH-CEN-08', 'Binapani Secondary Training School', 'central', 'Cuttack'),
('SCH-CEN-09', 'Artreswar Secondary Training School', 'central', 'Cuttack'),
('SCH-CEN-10', 'Mahabir Secondary Training School', 'central', 'Cuttack'),
('SCH-CEN-11', 'Uchhabeswara Secondary Training School', 'central', 'Cuttack'),
('SCH-CEN-12', 'Mangarajpur Secondary Training School', 'central', 'Cuttack'),
('SCH-CEN-13', 'Kantabania Secondary Training School', 'central', 'Jajapur'),
('SCH-CEN-14', 'Alakunda Secondary Training School', 'central', 'Jajpur'),
('SCH-CEN-15', 'Biraja Secondary Training School', 'central', 'Jajpur'),
('SCH-CEN-16', 'Regional School of Secondary Training & Pharmaceutical School', 'central', 'Cuttack'),
('SCH-CEN-17', 'Mahima Secondary Training School', 'central', 'Dhenkanal'),
('SCH-CEN-18', 'Astasambhu Secondary Training School', 'central', 'Dhenkanal'),
('SCH-CEN-19', 'Acharya Harihar Secondary Training School', 'central', 'Cuttack'),
('SCH-CEN-20', 'Sadashibapur Secondary Training School', 'central', 'Dhenkanal'),
('SCH-CEN-21', 'Kameswar Secondary Training School', 'central', 'Cuttack'),
('SCH-CEN-22', 'Kanakeswari Secondary Training School', 'central', 'Cuttack'),
('SCH-CEN-23', 'Gadamandal Secondary Training School', 'central', 'Anugul'),
('SCH-CEN-24', 'Bagedia Secondary Training School', 'central', 'Angul'),

-- BALESWAR ZONE (40 Schools)
('SCH-BAL-01', 'Sugo Secondary Training School', 'balasore', 'Baleswar'),
('SCH-BAL-02', 'Basudevpur Secondary Training School', 'balasore', 'Bhadrak'),
('SCH-BAL-03', 'Sonalpur Secondary Training School', 'balasore', 'Baleswar'),
('SCH-BAL-04', 'Anchalika Secondary Training School', 'balasore', 'Baleswar'),
('SCH-BAL-05', 'Sri Jagannath Secondary Training School', 'balasore', 'Baleswar'),
('SCH-BAL-06', 'Jagabandhu Secondary Training School', 'balasore', 'Chandimal'),
('SCH-BAL-07', 'Jagannath Secondary Training School', 'balasore', 'Baleswar'),
('SCH-BAL-08', 'Madan Mohan Secondary Training School', 'balasore', 'Baleswar'),
('SCH-BAL-09', 'Narasinghpur Secondary Training School', 'balasore', 'Baleswar'),
('SCH-BAL-10', 'Chandimata Secondary Training School', 'balasore', 'Baleswar'),
('SCH-BAL-11', 'Badama Secondary Training School', 'balasore', 'Kendujhar'),
('SCH-BAL-12', 'Jagabandhu Secondary Training School', 'balasore', 'Naliapal'),
('SCH-BAL-13', 'Adhalpanka Secondary Training School', 'balasore', 'Bhadrak'),
('SCH-BAL-14', 'New Adhalpanka Secondary Training School', 'balasore', 'Bhadrak'),
('SCH-BAL-15', 'Gedama Secondary Training School', 'balasore', 'Kendujhar'),
('SCH-BAL-16', 'Dahamunda Secondary Training School', 'balasore', 'Baleswar'),
('SCH-BAL-17', 'Radhakishore Secondary Training School', 'balasore', 'Baleswar'),
('SCH-BAL-18', 'Swarna Chuda Secondary Training School', 'balasore', 'Baleswar'),
('SCH-BAL-19', 'Talapada Secondary Training School', 'balasore', 'Baleswar'),
('SCH-BAL-20', 'Laxmipriya Secondary Training School', 'balasore', 'Baleswar'),
('SCH-BAL-21', 'Kusha Charan Secondary Training School', 'balasore', 'Baleswar'),
('SCH-BAL-22', 'Binapani Secondary Training School', 'balasore', 'Baleswar'),
('SCH-BAL-23', 'Debagiri Secondary Training School Gopinathpur', 'balasore', 'Baleswar'),
('SCH-BAL-24', 'Debagiri Secondary Training School', 'balasore', 'Mangalpur'),
('SCH-BAL-25', 'Mahamahima Secondary Training School', 'balasore', 'Baleswar'),
('SCH-BAL-26', 'Bhagabat Prasad Secondary Training School', 'balasore', 'Baleswar'),
('SCH-BAL-27', 'Durgapur Secondary Training School', 'balasore', 'Mayurbhanj'),
('SCH-BAL-28', 'B P Education Centre', 'balasore', 'Mayurbhanj'),
('SCH-BAL-29', 'Mayurbhanj Secondary Training School', 'balasore', 'Mayurbhanj'),
('SCH-BAL-30', 'Godapalasa Secondary Training School', 'balasore', 'Mayurbhanj'),
('SCH-BAL-31', 'Purnima Secondary Training School', 'balasore', 'Mayurbhanj'),
('SCH-BAL-32', 'Rasamatala Secondary Training School', 'balasore', 'Mayurbhanj'),
('SCH-BAL-33', 'Regional Secondary Training School', 'balasore', 'Mayurbhanj'),
('SCH-BAL-34', 'Newlife Secondary Training School', 'balasore', 'Mayurbhanj'),
('SCH-BAL-35', 'Baba Jateswar Secondary Training School', 'balasore', 'Baleswar'),
('SCH-BAL-36', 'Purusottam Secondary Training School', 'balasore', 'Mayurbhanj'),
('SCH-BAL-37', 'Sri Aurobindo Secondary Training School', 'balasore', 'Mayurbhanj'),
('SCH-BAL-38', 'Aguad Secondary Training School', 'balasore', 'Mayurbhanj'),
('SCH-BAL-39', 'Ajan Secondary Training School', 'balasore', 'Mayurbhanj'),
('SCH-BAL-40', 'Bapuji Secondary Training School', 'balasore', 'Baleswar'),

-- SAMBALPUR ZONE (9 Schools)
('SCH-SAM-01', 'Balijodi Secondary Training School', 'sambalpur', 'Sundargarh'),
('SCH-SAM-02', 'Madhusudan Secondary Training School', 'sambalpur', 'Sambalpur'),
('SCH-SAM-03', 'Saradhapur Secondary Training School', 'sambalpur', 'Sambalpur'),
('SCH-SAM-04', 'Maa Samaleswari Secondary Training School', 'sambalpur', 'Sambalpur'),
('SCH-SAM-05', 'Kurda Secondary Training School', 'sambalpur', 'Sundargarh'),
('SCH-SAM-06', 'Brahmani Secondary Training School', 'sambalpur', 'Sundargarh'),
('SCH-SAM-07', 'Gopana Secondary Training School', 'sambalpur', 'Sundargarh'),
('SCH-SAM-08', 'SaleiBahala Secondary Training School', 'sambalpur', 'Sambalpur'),
('SCH-SAM-09', 'Lucky Secondary Training School', 'sambalpur', 'Sambalpur')
on conflict (code) do update set
  name = excluded.name,
  zone = excluded.zone,
  district = excluded.district;
