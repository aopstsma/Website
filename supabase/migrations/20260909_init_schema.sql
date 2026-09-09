-- ============================================================
-- AOPSTSMA Payment Portal — Database Schema & Row Level Security
-- Source of Truth: SPEC.md Section 6
-- ============================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. Schools Table
create table if not exists schools (
  id            uuid primary key default gen_random_uuid(),
  code          text unique not null,
  name          text not null,
  zone          text not null,
  district      text,
  contact_name  text,
  contact_phone text,
  created_at    timestamptz default now()
);

-- 3. Students Table (fee_amount is stored in paise as integers)
create table if not exists students (
  id          uuid primary key default gen_random_uuid(),
  school_id   uuid not null references schools(id) on delete cascade,
  roll_no     text not null,
  name        text not null,
  fee_amount  integer not null,        -- paise, not rupees (e.g. 50000 = Rs 500)
  created_at  timestamptz default now(),
  unique (school_id, roll_no)
);

-- 4. Demands Table (amount in paise, token unique in payment URL)
create table if not exists demands (
  id          uuid primary key default gen_random_uuid(),
  school_id   uuid not null references schools(id) on delete cascade,
  kind        text not null check (kind in ('legal_assistance','court_expenses')),
  case_ref    text,                    -- e.g. 'WP 146/2009'
  description text,
  amount      integer not null,        -- paise
  token       text unique not null,    -- random, used in the payment URL
  status      text not null default 'open'
              check (status in ('open','paid','cancelled')),
  created_by  uuid references auth.users(id),
  created_at  timestamptz default now()
);

-- 5. Payments Table (Idempotency via unique razorpay_payment_id)
create table if not exists payments (
  id                  uuid primary key default gen_random_uuid(),
  purpose             text not null check (purpose in
                        ('student_registration','school_renewal',
                         'dir_deposit','legal_assistance','court_expenses')),
  fund_type           text not null check (fund_type in
                        ('association_income','case_fund')),
  school_id           uuid references schools(id),
  student_id          uuid references students(id),
  demand_id           uuid references demands(id),
  amount              integer not null,     -- paise
  status              text not null default 'created'
                      check (status in ('created','paid','failed','refunded')),
  razorpay_order_id   text unique,
  razorpay_payment_id text unique,          -- unique: idempotency guard against webhook retries
  payer_name          text,
  payer_phone         text,
  receipt_no          text unique,
  created_at          timestamptz default now(),
  paid_at             timestamptz
);

-- 6. Indexes for High Performance Queries
create index if not exists idx_payments_school_id on payments (school_id);
create index if not exists idx_payments_status on payments (status);
create index if not exists idx_payments_created_at_desc on payments (created_at desc);
create index if not exists idx_students_school_id on students (school_id);
create index if not exists idx_demands_token on demands (token);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

alter table schools enable row level security;
alter table students enable row level security;
alter table demands enable row level security;
alter table payments enable row level security;

-- Policy 1: Schools — Public read of school metadata for dropdowns
create policy "Allow public read of schools for dropdown"
  on schools for select
  using (true);

-- Policy 2: Students — No public read at all
-- Lookups must strictly go through server API using service role key
create policy "No public read for students"
  on students for select
  to service_role
  using (true);

-- Policy 3: Demands — No public read
-- Fetched server-side by token
create policy "Service role access for demands"
  on demands for all
  to service_role
  using (true);

-- Policy 4: Payments — No public read, written only by server webhook
create policy "Service role access for payments"
  on payments for all
  to service_role
  using (true);
