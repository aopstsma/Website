# AOPSTSMA Payment Portal — Build Specification

This file is the single source of truth for the agent. Read it fully before
writing any code. Do not invent requirements that are not in this document.
Where something is marked **TBD**, stop and ask rather than guessing.

---

## 1. What this is

A payment portal for the All Orissa Private Secondary Training Schools
Management Association (established 1980, Odisha, India).

**This is being added to the existing repository, not built as a new project.**

The repository currently holds a finished static website: `index.html`,
`about.html`, `zones.html`, `schools.html`, `achievements.html`,
`services.html`, `contact.html`, plus `assets/css/main.css`,
`assets/js/site.js`, `assets/js/odisha-map.js` and `assets/data/schools.js`.

You will convert this into a Next.js application **in place** and add the
payment portal to it. Everything ships from one repository to `aopstsma.in`.

### Migrating the existing site — do this first, and carefully

The existing site is finished and approved. It must look and behave **exactly
the same** after migration. This is a port, not a redesign.

- Move `assets/css/main.css` into the project and import it globally. Do not
  convert it to Tailwind, do not restructure it, do not rename the CSS custom
  properties. Tailwind is for the new portal pages only.
- Convert each HTML page to a route: `/` , `/about`, `/zones`, `/schools`,
  `/achievements`, `/services`, `/contact`. Keep the markup as it is.
- `assets/js/odisha-map.js` drives the 3D hero on the home page. It uses
  Three.js from a CDN and touches `window` and `document` directly, so it must
  run **client-side only** — dynamic import with `ssr: false`, inside a
  `useEffect`. It will crash the build if it runs on the server.
- `assets/data/schools.js` currently declares `SCHOOLS`, `ZONES` and
  `DOCUMENTS` as globals. Convert it to a module with named exports and import
  it where needed. The data itself does not change.
- The header, footer and nav are repeated in every HTML file. Turn them into
  shared components. This is the one place where restructuring is wanted.
- Keep the same URLs. `aopstsma.in/about` must still work after migration.

Check every page against the original in a browser before moving on. The
existing site is what members and government officers see; a broken migration
is worse than no portal.

### Where the portal lives

Portal routes sit alongside the public pages in the same app, under `/pay`.
See section 7.

## 2. Stack

- **Next.js 15**, App Router, TypeScript
- **Supabase** — Postgres, Auth, Row Level Security
- **Razorpay** — payment gateway (Orders API + webhooks)
- **Tailwind CSS**
- **Vercel** — hosting, serving both the public site and the portal

Public pages are static and must stay that way — they are pre-rendered at build
time with no database calls, so a portal or database outage never takes down the
association's public site.

Use the Supabase **transaction pooler** (port 6543), never a direct connection.
Serverless functions open a new connection per request and will exhaust the
direct connection limit.

## 3. Who uses it

| Role | Count | What they do |
|---|---|---|
| Student | ~45,000 | Pay a registration fee, once |
| School | ~100 | Pay membership renewal and DIR deposit |
| Secretary | 1–3 | Raise demands, view reports, reconcile |

There is **no student login and no student account**. A student identifies
themselves by school plus roll number, pays, and leaves.

---

## 4. The four payment types

Two are self-service with a fixed amount. Two are raised by the office.

### Self-service

**A. Student registration**
School dropdown → enter roll number → system shows the matching student's name
partially masked for confirmation → pay.

**B. School renewal / DIR deposit**
School logs in → sees what is due → pays.
Renewal is Rs 2,500. DIR deposit is Rs 25,000.

### Demand-based

**C. Legal assistance**
**D. Court expenses**

These amounts differ per case and per school. They are **never** entered by the
payer. The secretary creates a demand in the admin panel — naming the case, the
schools involved and the amount for each — and the system issues a payment link
per school with the amount already fixed.

Reason: an open amount field means a school can pay Rs 1 and appear settled, or
pay Rs 50,000 by mistake. It also makes reconciliation impossible, because no
payment would be tied to a case.

---

## 5. Critical rules

These are not preferences. Breaking any of them causes real financial damage.

### 5.1 Never trust the client for the amount

The amount always comes from the database on the server. The browser sends an
identifier (student ID, demand ID), never a rupee value. Anyone can edit what
the browser sends.

### 5.2 Payment is confirmed by webhook only

Mark a payment successful **only** when Razorpay's webhook arrives and its
signature verifies. Never on the frontend callback — a user can close the tab, a
network can drop, and a callback can be forged.

The frontend callback may show "we are confirming your payment" and poll for
status. It must never write `paid` to the database.

### 5.3 Verify the webhook signature

Use `crypto.createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)` over the **raw**
request body. In Next.js App Router the body must be read as text before any JSON
parsing, or the signature will not match.

Reject any request whose signature fails. Log it. Do not process it.

### 5.4 Webhooks arrive more than once

Razorpay retries. Store `razorpay_payment_id` with a **unique constraint** and
handle a duplicate as a no-op returning 200. If a webhook is processed twice
without this, one payment is recorded twice and the books stop balancing.

### 5.5 Respond to the webhook fast

Return 200 within a few seconds. Do the minimum synchronously: verify signature,
insert or update the payment row. Anything slower — receipt PDF, SMS, email —
happens afterwards, triggered from the stored row, not inside the webhook
handler.

### 5.6 Never expose student lists

A student must not be able to browse the students of any school. Given a school
and a roll number, return **that one student only**. Returning a list would
expose 45,000 names publicly and reveal who has not paid.

Rate-limit the lookup endpoint (10 attempts per IP per minute) so it cannot be
used to enumerate roll numbers.

### 5.7 Keep the two funds apart

Every payment row carries `fund_type`:

- `association_income` — student registration, school renewal
- `case_fund` — legal assistance, court expenses, DIR deposit

Case fund money belongs to the member schools; the association only holds and
spends it on their behalf. Association income is the association's own. Reports
must never mix them.

### 5.8 Secrets stay out of the repository

`RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` and
`SUPABASE_SERVICE_ROLE_KEY` are set in the Vercel dashboard only. `.env.local`
is gitignored. The service role key is never imported into any file under
`app/` that renders on the client.

---

## 6. Database schema

```sql
create table schools (
  id            uuid primary key default gen_random_uuid(),
  code          text unique not null,
  name          text not null,
  zone          text not null,
  district      text,
  contact_name  text,
  contact_phone text,
  created_at    timestamptz default now()
);

create table students (
  id          uuid primary key default gen_random_uuid(),
  school_id   uuid not null references schools(id),
  roll_no     text not null,
  name        text not null,
  fee_amount  integer not null,        -- paise, not rupees
  created_at  timestamptz default now(),
  unique (school_id, roll_no)
);

create table demands (
  id          uuid primary key default gen_random_uuid(),
  school_id   uuid not null references schools(id),
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

create table payments (
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
  razorpay_payment_id text unique,          -- unique: this is the idempotency guard
  payer_name          text,
  payer_phone         text,
  receipt_no          text unique,
  created_at          timestamptz default now(),
  paid_at             timestamptz
);

create index on payments (school_id);
create index on payments (status);
create index on payments (created_at desc);
create index on students (school_id);
```

**All amounts are stored in paise as integers.** Razorpay works in paise, and
floats lose money. Rs 2,500 is `250000`.

### Row Level Security

Enable RLS on every table.

- `schools` — public read of `id`, `code`, `name`, `zone` only, for the dropdown
- `students` — **no public read at all**; lookups go through a server route
  using the service role key
- `demands` — no public read; fetched server-side by token
- `payments` — no public read; written only by the server

---

## 7. Routes

### Public site — static, ported from the existing HTML

```
/                        Home, with the 3D Odisha map hero
/about                   History and office bearers
/zones                   The six zones
/schools                 Member school directory
/achievements            Legal records
/services                Services and fees
/contact                 Contact and enquiry form
```

These are pre-rendered. They must not import the Supabase client or read from
the database.

### Portal

```
/pay                     Landing: four payment options
/pay/student             School dropdown → roll number → confirm → pay
/pay/school/login        School sign-in (phone OTP via Supabase Auth)
/pay/school              Dues and payment history
/pay/d/[token]           Demand payment page, amount fixed and shown
/pay/status/[orderId]    Post-payment status, polls until webhook lands
/pay/admin               Secretary: raise demands, reports, reconciliation

/api/student/lookup      POST { schoolId, rollNo } → one student or 404
/api/order/create        POST { type, refId } → Razorpay order (amount from DB)
/api/razorpay/webhook    POST, signature verified, idempotent
```

Add a "Pay fees" link to the site header once `/pay` exists, not before.

---

## 8. Student payment flow

1. Student picks their school from a dropdown of ~100 names
2. Enters roll number
3. `POST /api/student/lookup` returns one record: name masked as `RAJ**** K****`,
   the fee amount, and whether it is already paid
4. Student confirms it is them
5. `POST /api/order/create` with the student id — **the server reads the amount
   from the students table**
6. Razorpay Checkout opens
7. On completion the browser goes to `/pay/status/[orderId]`, which polls every 2
   seconds for up to 60 seconds
8. Meanwhile the webhook arrives and marks the payment `paid`
9. Status page shows the receipt number

If a student is already paid, step 3 says so and offers the receipt instead of
another payment. Do not let anyone pay twice.

---

## 9. Build order

Do not build everything at once. Each phase must run and be tested before the
next begins.

**Phase 0 — migrate the existing site**
Convert the seven HTML pages to Next.js routes in this same repository, with
shared header and footer components and the 3D hero working client-side. No
Supabase, no portal, no Tailwind on these pages. Deploy it and confirm every
page matches the original before touching anything else.

**Phase 1 — foundation**
Supabase client with the pooler, schema and RLS applied, seed script for
schools, `/pay` landing page. Nothing payment-related yet.

**Phase 2 — student lookup**
`/pay/student` page and `/api/student/lookup`. No payment. Confirm one student is
returned, masking works, rate limiting works, and no list can be extracted.

**Phase 3 — payment core**
`/api/order/create`, Razorpay Checkout, `/api/razorpay/webhook` with signature
verification and idempotency, `/pay/status/[orderId]`.
Test in Razorpay **test mode** until every case passes.

**Phase 4 — school and demands**
School login, dues page, admin demand creation, `/pay/d/[token]`.

**Phase 5 — admin reports**
Collection by school, by zone, by purpose, by fund type. Outstanding lists.
CSV export.

**Phase 6 — after payment**
Receipt PDF, SMS confirmation.

---

## 10. Tests that must pass before going live

Run these in Razorpay test mode. Every one of them.

1. Successful payment marks exactly one row `paid`
2. The same webhook delivered twice produces **one** paid row, not two
3. A webhook with a wrong signature is rejected and nothing is written
4. Closing the browser mid-payment still results in `paid` when the webhook lands
5. A modified amount in the browser request is ignored; the DB amount is charged
6. An already-paid student cannot pay again
7. The lookup endpoint cannot be made to return more than one student
8. Rate limiting blocks rapid roll-number guessing
9. A failed payment leaves the row `failed`, and the student can retry
10. Load test: 500 concurrent lookups and 100 concurrent order creations
11. Every public page still renders correctly, and the 3D hero still runs
12. The public pages still load when the database is unreachable

Do not accept "it worked once in the browser" as a pass for any of these.

---

## 11. Open questions — must be answered before Phase 1

- **Where is the student data?** Excel, or on paper? If on paper, data entry is
  the real deadline, not the code.
- **What is the student registration fee?** Same for every school?
- **Whose name is the Razorpay account in?** It must be the registered
  association, not an individual, and KYC takes a few days.
- **What identifies a student** — roll number, date of birth, or both?
- **After payment**: receipt PDF, SMS, both?
- **Launch date?**

Do not begin Phase 1 until the first three are answered. Phase 0 can start
immediately — it does not depend on any of them.
