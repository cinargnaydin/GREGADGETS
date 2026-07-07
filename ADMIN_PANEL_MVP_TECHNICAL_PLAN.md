# Greenwich Gadgets Admin Panel MVP Technical Plan

## 1. Goal

Build a practical admin panel that lets the shop owner manage the website's core business operations without touching code.

The MVP focuses on:

- Receiving appointments in the admin panel
- Receiving leads and quote requests in the admin panel
- Sending email notifications to an address configured from the admin panel
- Managing booking availability
- Managing essential business settings
- Moving operational data from Firebase/one-off email handling into Supabase

Content and image management should come after this MVP, once the business workflow is stable.

## 2. Current State

The project already has a basic admin and booking foundation.

Existing pieces:

- `src/app/admin/login/page.tsx`
  - Password-based admin login
- `src/app/admin/(dashboard)/page.tsx`
  - Upcoming appointments list
- `src/app/admin/(dashboard)/schedule/page.tsx`
  - Weekly hours and date override UI
- `src/app/api/appointments/book/route.ts`
  - Creates bookings in Firebase Firestore
  - Checks Google Calendar conflicts
  - Sends optional SMS and email confirmations
- `src/app/api/appointments/available-slots/route.ts`
  - Reads schedule from Firebase Firestore
  - Checks Google Calendar busy slots
- `src/app/api/quote/route.ts`
  - Sends quote request emails through Resend
  - Does not persist leads yet
- `src/proxy.ts`
  - Protects `/admin` and `/api/admin` with a JWT cookie

Main issue:

Operational data is split between Firebase, environment variables, Google Calendar, and one-off email sending. For the MVP, Supabase should become the central source of truth.

## 3. MVP Product Scope

### Included

1. Admin authentication
2. Appointment storage in Supabase
3. Lead storage in Supabase
4. Admin appointment list
5. Admin lead list
6. Appointment status updates
7. Lead status updates
8. Admin notes for appointments and leads
9. Weekly availability settings
10. Date-specific availability overrides
11. Business settings
12. Notification settings
13. Email notifications for new appointments and leads

### Not Included In MVP

These should be phase 2:

- Full page content editor
- Image/media library
- Service editor
- FAQ editor
- Reviews editor
- SEO editor
- Multi-admin roles
- Drag-and-drop page builder
- Customer accounts

## 4. Recommended Architecture

Use Supabase as the source of truth for admin operations.

```txt
Next.js App Router
  Public forms
    /book
    quote/contact forms

  Public APIs
    /api/appointments/available-slots
    /api/appointments/book
    /api/leads

  Admin UI
    /admin
    /admin/appointments
    /admin/leads
    /admin/availability
    /admin/settings

  Admin APIs
    /api/admin/appointments
    /api/admin/leads
    /api/admin/availability
    /api/admin/settings

Supabase
  Auth
  Postgres
  Storage later

External services
  Resend for emails
  Google Calendar optional
  Twilio optional later
```

## 5. Supabase Tables

### 5.1 `appointments`

Stores customer bookings.

```sql
create type appointment_status as enum (
  'pending',
  'confirmed',
  'cancelled',
  'completed',
  'no_show'
);

create table appointments (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text,
  customer_phone text not null,
  service_type text,
  device_model text,
  issue_description text,
  appointment_start timestamptz not null,
  appointment_end timestamptz not null,
  status appointment_status not null default 'pending',
  admin_notes text,
  calendar_event_id text,
  notification_sent_at timestamptz,
  notification_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index appointments_start_idx on appointments (appointment_start);
create index appointments_status_idx on appointments (status);
```

### 5.2 `leads`

Stores quote requests, contact messages, and repair enquiries.

```sql
create type lead_status as enum (
  'new',
  'contacted',
  'quoted',
  'converted',
  'closed'
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  phone text not null,
  source text not null default 'website',
  device_model text,
  issue_description text not null,
  message text,
  status lead_status not null default 'new',
  admin_notes text,
  notification_sent_at timestamptz,
  notification_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index leads_status_idx on leads (status);
create index leads_created_at_idx on leads (created_at desc);
```

### 5.3 `availability_rules`

Stores normal weekly opening hours.

```sql
create table availability_rules (
  id uuid primary key default gen_random_uuid(),
  day_of_week int not null check (day_of_week between 0 and 6),
  is_closed boolean not null default false,
  start_time time,
  end_time time,
  slot_minutes int not null default 60,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (day_of_week)
);
```

Day mapping:

```txt
0 = Sunday
1 = Monday
2 = Tuesday
3 = Wednesday
4 = Thursday
5 = Friday
6 = Saturday
```

### 5.4 `availability_overrides`

Stores special dates, such as holidays or custom opening hours.

```sql
create table availability_overrides (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  is_closed boolean not null default true,
  start_time time,
  end_time time,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 5.5 `business_settings`

Stores public business details used across the website.

```sql
create table business_settings (
  id uuid primary key default gen_random_uuid(),
  business_name text not null default 'Greenwich Gadgets',
  phone text,
  whatsapp text,
  email text,
  address text,
  google_maps_url text,
  updated_at timestamptz not null default now()
);
```

For MVP, this can use a single row. The app should fetch the first row or a fixed row.

### 5.6 `notification_settings`

Stores admin-configurable notification preferences.

```sql
create table notification_settings (
  id uuid primary key default gen_random_uuid(),
  notification_email text not null,
  notify_new_appointment boolean not null default true,
  notify_new_lead boolean not null default true,
  email_from_name text not null default 'Greenwich Gadgets',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

For MVP, use one row.

### 5.7 `audit_logs`

Optional but useful. Can be skipped if MVP time is tight.

```sql
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);
```

## 6. Supabase Auth And Security

Recommended MVP auth:

- Use Supabase Auth for admin login
- Only invited/admin-created users should log in
- Protect admin pages server-side
- Protect admin APIs server-side
- Public insert routes should use server-side API routes, not direct browser writes

Recommended environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
EMAIL_FROM=
NEXT_PUBLIC_SITE_URL=
```

Important:

- `SUPABASE_SERVICE_ROLE_KEY` must only be used on the server
- Public forms should call Next.js API routes
- Admin APIs should verify the admin session before reading or mutating data

## 7. Row Level Security

Enable RLS on operational tables.

MVP approach:

- Browser clients do not write directly to operational tables
- Public inserts happen through Next.js route handlers using validated input
- Admin reads/writes happen through protected Next.js route handlers

Example policy direction:

```txt
appointments:
  public direct access: none
  admin access: through server routes

leads:
  public direct access: none
  admin access: through server routes

settings:
  public direct access: read-only only if needed
  admin write: through server routes
```

This is simpler and safer for MVP than exposing table writes from the browser.

## 8. Email Notification Flow

Use Resend because it is already installed in the project.

### 8.1 New Appointment

```txt
Customer submits booking form
  -> POST /api/appointments/book
  -> Validate with Zod
  -> Check availability
  -> Insert appointment in Supabase with status 'pending'
  -> Read notification_settings
  -> If notify_new_appointment is true, send email
  -> Save notification_sent_at or notification_error
  -> Return success to customer
```

Email failure should not fail the customer booking.

If the appointment insert succeeds but email fails:

- Return success to customer
- Save the error in `appointments.notification_error`
- Show a small warning in admin later if needed

### 8.2 New Lead

```txt
Customer submits quote/contact form
  -> POST /api/leads
  -> Validate with Zod
  -> Insert lead in Supabase with status 'new'
  -> Read notification_settings
  -> If notify_new_lead is true, send email
  -> Save notification_sent_at or notification_error
  -> Return success to customer
```

### 8.3 Appointment Email Template

Subject:

```txt
New appointment - Greenwich Gadgets
```

Body:

```txt
New appointment received.

Name:
Phone:
Email:
Service:
Device:
Date:
Time:
Issue:

Open admin panel:
{SITE_URL}/admin/appointments
```

### 8.4 Lead Email Template

Subject:

```txt
New lead - Greenwich Gadgets
```

Body:

```txt
New customer enquiry received.

Name:
Phone:
Email:
Device:
Issue:
Message:
Source:

Open admin panel:
{SITE_URL}/admin/leads
```

## 9. API Routes

### Public APIs

```txt
GET  /api/appointments/available-slots?date=YYYY-MM-DD
POST /api/appointments/book
POST /api/leads
```

### Admin APIs

```txt
GET    /api/admin/appointments
PATCH  /api/admin/appointments/:id
DELETE /api/admin/appointments/:id

GET    /api/admin/leads
PATCH  /api/admin/leads/:id

GET    /api/admin/availability
POST   /api/admin/availability/rules
POST   /api/admin/availability/overrides
DELETE /api/admin/availability/overrides/:id

GET    /api/admin/settings
PATCH  /api/admin/settings/business
PATCH  /api/admin/settings/notifications
```

Next.js App Router can implement dynamic IDs as folders:

```txt
src/app/api/admin/appointments/[id]/route.ts
src/app/api/admin/leads/[id]/route.ts
```

## 10. Admin UI Structure

Recommended MVP admin routes:

```txt
/admin
/admin/appointments
/admin/leads
/admin/availability
/admin/settings
```

### Dashboard

Show:

- Today appointments
- New leads count
- Pending appointments count
- Recent leads
- Recent appointments

### Appointments

Show:

- Customer name
- Phone
- Email
- Date/time
- Service/device
- Status
- Admin notes

Actions:

- Change status
- Add/edit notes
- Cancel appointment
- Mark completed

### Leads

Show:

- Name
- Phone
- Email
- Device
- Issue/message
- Source
- Status
- Admin notes

Actions:

- Change status
- Add/edit notes
- Convert manually by creating an appointment later

### Availability

Show:

- Weekly opening hours
- Open/closed toggles
- Slot duration
- Date overrides

Actions:

- Save weekly hours
- Add holiday/closed date
- Add custom hours for a date

### Settings

Sections:

- Business details
- Notification settings

Fields:

- Business phone
- WhatsApp number
- Email
- Address
- Google Maps URL
- Notification email
- New appointment email toggle
- New lead email toggle

## 11. Migration Plan

### Step 1: Add Supabase Dependencies

Install:

```bash
npm install @supabase/supabase-js @supabase/ssr
```

Add server/client helpers:

```txt
src/lib/supabase/client.ts
src/lib/supabase/server.ts
src/lib/supabase/admin.ts
```

### Step 2: Create Supabase Schema

Create the tables in Supabase SQL editor or through migrations.

Recommended repo folder:

```txt
supabase/migrations/
```

### Step 3: Replace Admin Auth

Move from `ADMIN_PASSWORD` JWT auth to Supabase Auth.

Update:

```txt
src/app/admin/login/page.tsx
src/proxy.ts
src/lib/auth.ts
```

### Step 4: Move Appointments To Supabase

Update:

```txt
src/app/api/appointments/book/route.ts
src/app/api/appointments/available-slots/route.ts
src/app/api/admin/appointments/route.ts
src/app/admin/(dashboard)/page.tsx
```

Keep Google Calendar conflict checks if credentials are already working, but Supabase should be the booking source of truth.

### Step 5: Add Leads Persistence

Create:

```txt
src/app/api/leads/route.ts
src/app/api/admin/leads/route.ts
src/app/api/admin/leads/[id]/route.ts
src/app/admin/(dashboard)/leads/page.tsx
```

Update quote/contact forms to call `/api/leads`.

The current `/api/quote` can either:

- Be replaced by `/api/leads`
- Or become a thin wrapper around the new lead creation helper

### Step 6: Add Notification Settings

Create:

```txt
src/app/api/admin/settings/route.ts
src/app/admin/(dashboard)/settings/page.tsx
src/lib/notifications.ts
```

`src/lib/notifications.ts` should contain:

- `sendAppointmentNotification`
- `sendLeadNotification`
- `getNotificationSettings`

### Step 7: Move Availability To Supabase

Update:

```txt
src/app/api/admin/schedule/route.ts
src/app/api/appointments/available-slots/route.ts
src/app/admin/(dashboard)/schedule/page.tsx
```

Optionally rename schedule to availability later.

### Step 8: Remove Firebase Dependency

After Supabase appointment and availability flows are working:

- Remove Firebase imports from active routes
- Remove Firebase env vars from deployment if unused
- Remove Firebase dependencies if no longer needed

## 12. Validation Rules

Use Zod at API boundaries.

Appointment create:

```txt
name: required, min 2
email: optional email
phone: required, min 8
date: required YYYY-MM-DD
time: required HH:mm
service_type: optional
device_model: optional
issue_description: optional
```

Lead create:

```txt
name: optional
email: optional email
phone: required, min 8
device_model: optional
issue_description: required, min 8
message: optional
source: default website
```

Settings:

```txt
notification_email: valid email
notification toggles: boolean
business URLs: valid URL or empty
```

## 13. Timezone Rules

The business is in London.

Use:

```txt
Europe/London
```

Rules:

- Store appointment times as `timestamptz`
- Display in London local time
- Generate availability slots in London local time
- Be careful around daylight saving time

## 14. Acceptance Criteria

The MVP is complete when:

1. Admin can log in through Supabase Auth
2. Customer can submit an appointment
3. Appointment is saved in Supabase
4. Appointment appears in admin panel
5. Admin receives an email for new appointment if enabled
6. Customer can submit a lead/quote request
7. Lead is saved in Supabase
8. Lead appears in admin panel
9. Admin receives an email for new lead if enabled
10. Admin can update appointment status
11. Admin can update lead status
12. Admin can edit notification email from settings
13. Admin can turn appointment/lead notifications on or off
14. Admin can edit weekly availability
15. Admin can add closed/custom dates
16. Public booking slots respect Supabase availability and existing bookings
17. A failed email send does not lose the appointment or lead

## 15. Testing Checklist

Manual tests:

- Login with valid admin user
- Reject invalid admin login
- Create appointment from public form
- Verify appointment row in Supabase
- Verify appointment visible in admin
- Verify appointment email notification arrives
- Disable appointment notifications and verify no email is sent
- Create lead from quote/contact form
- Verify lead row in Supabase
- Verify lead visible in admin
- Verify lead email notification arrives
- Disable lead notifications and verify no email is sent
- Change appointment status
- Change lead status
- Add admin notes
- Change weekly hours and verify available slots
- Add closed date and verify no slots show
- Add custom date hours and verify slots match

Automated tests later:

- API validation tests
- Availability conflict tests
- Notification helper tests with mocked Resend
- Admin authorization tests

## 16. Implementation Priority

Recommended order:

1. Supabase schema and helpers
2. Admin auth
3. Appointment create/list/update
4. Appointment notification email
5. Lead create/list/update
6. Lead notification email
7. Notification settings UI
8. Availability migration
9. Dashboard summary cards
10. Firebase cleanup

This order gives the shop owner usable business value early, before broader website content management starts.

