-- ============================================================
-- THE THIRD SPACE — SUPABASE DATABASE SETUP
-- ============================================================
-- Run this in your Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Enable UUID extension
create extension if not exists "pgcrypto";

-- 2. Create events table
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  event_date date not null,
  start_time text not null,
  end_time text,
  venue text not null,
  registration_open boolean not null default true,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Create registrations table
create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete restrict,
  registration_id text not null unique,
  full_name text not null,
  email text not null,
  phone text not null,
  college text not null,
  year text not null,
  branch text not null,
  student_id text not null,
  social_handle text,
  created_at timestamptz not null default now()
);

-- Unique index: prevent duplicate email for same event
create unique index if not exists registrations_event_email_unique
  on public.registrations (event_id, lower(trim(email)));

-- 4. Create admin_profiles table
create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

-- 5. Seed UTSAAH 3.0 event
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
) on conflict (slug) do nothing;

-- 6. Enable Row Level Security (RLS)
alter table public.events enable row level security;
alter table public.registrations enable row level security;
alter table public.admin_profiles enable row level security;

-- Policies for events: public can read published events
drop policy if exists "Public can view published events" on public.events;
create policy "Public can view published events"
  on public.events for select
  to anon, authenticated
  using (published = true);

-- Policies for registrations:
-- Public can INSERT if event is open
drop policy if exists "Public can submit registrations" on public.registrations;
create policy "Public can submit registrations"
  on public.registrations for insert
  to anon, authenticated
  with check (
    exists (
      select 1 from public.events
      where id = event_id and registration_open = true and published = true
    )
  );

-- Admins can read registrations
drop policy if exists "Admins can view registrations" on public.registrations;
create policy "Admins can view registrations"
  on public.registrations for select
  to authenticated
  using (
    exists (
      select 1 from public.admin_profiles
      where id = auth.uid()
    )
  );

-- Policies for admin_profiles:
drop policy if exists "Admins can read own profile" on public.admin_profiles;
create policy "Admins can read own profile"
  on public.admin_profiles for select
  to authenticated
  using (id = auth.uid());

-- Seed 257Y5A6615 admin account (Auth User UID: 90c25837-c885-45bb-82fb-5c95583c801a)
insert into public.admin_profiles (id, email, role)
values (
  '90c25837-c885-45bb-82fb-5c95583c801a',
  '257Y5A6615@thethirdspace.in',
  'admin'
) on conflict (id) do nothing;

