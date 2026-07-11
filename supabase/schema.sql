-- Greenwich Gadgets — Supabase (Postgres) schema
-- Run this once in the Supabase SQL editor (or via the CLI) for your project.
-- Mirrors the four Firestore collections the app previously used:
--   appointments, leads, schedule_settings, schedule_overrides
--
-- The app talks to Supabase with the SERVICE ROLE key from server-side code
-- only, so Row Level Security is left disabled here (service role bypasses RLS
-- anyway). Do NOT expose the anon key with write access to these tables.

create extension if not exists pgcrypto; -- gen_random_uuid()

-- ---------------------------------------------------------------------------
-- appointments
-- ---------------------------------------------------------------------------
create table if not exists public.appointments (
  id                uuid primary key default gen_random_uuid(),
  name              text        not null,
  email             text        not null,
  phone             text        not null,
  issue             text,
  lead_id           text,
  start_time        timestamptz not null,
  end_time          timestamptz not null,
  calendar_event_id text,
  created_at        timestamptz not null default now(),

  -- Atomic, race-proof double-booking guard: Postgres rejects any insert whose
  -- [start_time, end_time) range overlaps an existing appointment. This replaces
  -- the read-then-write Firestore transaction and cannot be raced.
  constraint appointments_no_overlap
    exclude using gist (tstzrange(start_time, end_time) with &&)
);

create index if not exists appointments_start_time_idx
  on public.appointments (start_time);

-- ---------------------------------------------------------------------------
-- leads
-- ---------------------------------------------------------------------------
create table if not exists public.leads (
  id                uuid primary key default gen_random_uuid(),
  type              text        not null default 'repair',
  source_page       text,
  source_url        text,
  name              text,
  phone             text        not null,
  email             text,
  issue             text        not null,
  device            text,
  urgency           text        not null default 'flexible',
  preferred_contact text        not null default 'pending',
  consent           boolean     not null default true,
  stage             text        not null default 'new',
  appointment_id    text,
  notes             text,
  utm               jsonb       not null default '{}'::jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists leads_created_at_idx
  on public.leads (created_at desc);

-- ---------------------------------------------------------------------------
-- schedule_settings — one row per weekday ('monday' .. 'sunday')
-- ---------------------------------------------------------------------------
create table if not exists public.schedule_settings (
  day_of_week text primary key,
  is_closed   boolean not null default false,
  start_time  text,   -- 'HH:mm'
  end_time    text    -- 'HH:mm'
);

-- Default weekly hours (matches the app's dev defaults: Mon–Fri 09:00–17:00,
-- weekends closed). Adjust in the Supabase table editor or a future admin panel.
insert into public.schedule_settings (day_of_week, is_closed, start_time, end_time)
values
  ('monday',    false, '09:00', '17:00'),
  ('tuesday',   false, '09:00', '17:00'),
  ('wednesday', false, '09:00', '17:00'),
  ('thursday',  false, '09:00', '17:00'),
  ('friday',    false, '09:00', '17:00'),
  ('saturday',  true,  '10:00', '14:00'),
  ('sunday',    true,  '10:00', '14:00')
on conflict (day_of_week) do nothing;

-- ---------------------------------------------------------------------------
-- schedule_overrides — one row per specific date ('YYYY-MM-DD')
-- ---------------------------------------------------------------------------
create table if not exists public.schedule_overrides (
  date        text primary key,   -- 'YYYY-MM-DD'
  is_closed   boolean not null default false,
  start_time  text,
  end_time    text
);
