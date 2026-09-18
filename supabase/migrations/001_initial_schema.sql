-- ============================================================
-- Migration 001: Initial Schema
-- The Third Space — UTSAAH 3.0 Database
-- ============================================================
-- Run in: Supabase Dashboard > SQL Editor
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ============================================================
-- Table: events
-- ============================================================
create table if not exists public.events (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text not null unique,
  description   text,
  event_date    date not null,
  start_time    text not null,
  end_time      text,
  venue         text not null,
  registration_open boolean not null default true,
  published     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger events_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- ============================================================
-- Table: registrations
-- ============================================================
create table if not exists public.registrations (
  id              uuid primary key default gen_random_uuid(),
  event_id        uuid not null references public.events(id) on delete restrict,
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

-- Unique: one registration per email per event
create unique index if not exists registrations_event_email_unique
  on public.registrations (event_id, email);

-- Index for admin search performance
create index if not exists registrations_full_name_idx
  on public.registrations using gin (to_tsvector('english', full_name));

create index if not exists registrations_created_at_idx
  on public.registrations (created_at desc);

-- ============================================================
-- Table: admin_profiles
-- ============================================================
create table if not exists public.admin_profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null unique,
  role        text not null default 'admin' check (role in ('admin', 'super_admin')),
  created_at  timestamptz not null default now()
);

-- ============================================================
-- Seed: UTSAAH 3.0 Event
-- ============================================================
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
