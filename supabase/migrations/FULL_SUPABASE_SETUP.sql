-- ============================================================
-- The Third Space — Complete Supabase Database Setup
-- UTSAAH 3.0 Campaign Schema, RLS & Seed
-- ============================================================
-- How to run:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Go to: SQL Editor > New query
-- 3. Paste this entire file and click "Run" (green button)
-- ============================================================

-- Enable pgcrypto for UUIDs
create extension if not exists "pgcrypto";

-- ============================================================
-- 1. EVENTS TABLE
-- ============================================================
create table if not exists public.events (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  slug              text not null unique,
  description       text,
  event_date        date not null,
  start_time        text not null,
  end_time          text,
  venue             text not null,
  registration_open boolean not null default true,
  published         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Seed UTSAAH 3.0 event if not already present
insert into public.events (
  title, slug, description, event_date, start_time, end_time, venue,
  registration_open, published
) values (
  'UTSAAH 3.0',
  'utsaah-3',
  'UTSAAH 3.0 is a mental health awareness campaign by Psychologs, brought to MLRIT by The Third Space.',
  '2026-09-19',
  '10:00 AM',
  '04:00 PM',
  'MLRIT Auditorium',
  true,
  true
) on conflict (slug) do update set
  registration_open = true,
  published = true;

-- ============================================================
-- 2. REGISTRATIONS TABLE
-- ============================================================
create table if not exists public.registrations (
  id              uuid primary key default gen_random_uuid(),
  event_id        uuid references public.events(id) on delete set null,
  registration_id text not null unique,
  full_name       text not null,
  email           text not null,
  phone           text not null,
  college         text not null,
  year            text not null,
  branch          text not null,
  student_id      text not null,
  social_handle   text,
  created_at      timestamptz not null default now()
);

-- Unique index to prevent duplicate registrations per email per event
create unique index if not exists registrations_email_unique
  on public.registrations (lower(email));

create index if not exists registrations_created_at_idx
  on public.registrations (created_at desc);

-- ============================================================
-- 3. ADMIN PROFILES TABLE
-- ============================================================
create table if not exists public.admin_profiles (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  role        text not null default 'admin',
  created_at  timestamptz not null default now()
);

-- Pre-seed master admin profile for rikchi940@gmail.com
insert into public.admin_profiles (email, role)
values ('rikchi940@gmail.com', 'admin')
on conflict (email) do nothing;

-- ============================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
alter table public.events enable row level security;
alter table public.registrations enable row level security;
alter table public.admin_profiles enable row level security;

-- Events: Everyone can read published events
drop policy if exists "Public can view published events" on public.events;
create policy "Public can view published events"
  on public.events for select
  to anon, authenticated
  using (published = true);

-- Registrations: Public can insert new registrations
drop policy if exists "Public can submit registrations" on public.registrations;
create policy "Public can submit registrations"
  on public.registrations for insert
  to anon, authenticated
  with check (true);

-- Service role bypasses RLS automatically for secure server-side admin reading and CSV export.
