-- ============================================================
-- Migration 002: Row Level Security Policies
-- The Third Space — UTSAAH 3.0 Database
-- ============================================================
-- Run AFTER migration 001.
-- ============================================================

-- Enable RLS on all tables
alter table public.events enable row level security;
alter table public.registrations enable row level security;
alter table public.admin_profiles enable row level security;

-- ============================================================
-- EVENTS table policies
-- ============================================================

-- Anyone can read published events (for the public website)
create policy "Public can view published events"
  on public.events
  for select
  to anon, authenticated
  using (published = true);

-- Only admins can manage events
create policy "Admins can manage events"
  on public.events
  for all
  to authenticated
  using (
    exists (
      select 1 from public.admin_profiles
      where id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.admin_profiles
      where id = auth.uid()
    )
  );

-- ============================================================
-- REGISTRATIONS table policies
-- ============================================================

-- Public (unauthenticated) can only INSERT — no SELECT, UPDATE, DELETE
create policy "Public can submit registrations"
  on public.registrations
  for insert
  to anon
  with check (
    -- Verify the event actually exists and registration is open
    exists (
      select 1 from public.events
      where id = event_id
        and registration_open = true
        and published = true
    )
  );

-- Authenticated admins can do everything
create policy "Admins can manage registrations"
  on public.registrations
  for all
  to authenticated
  using (
    exists (
      select 1 from public.admin_profiles
      where id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.admin_profiles
      where id = auth.uid()
    )
  );

-- ============================================================
-- ADMIN_PROFILES table policies
-- ============================================================

-- Admins can only see their own profile
create policy "Admins can read their own profile"
  on public.admin_profiles
  for select
  to authenticated
  using (id = auth.uid());

-- Only super_admins can manage admin profiles (via service role)
-- No direct policies needed — the service role bypasses RLS
