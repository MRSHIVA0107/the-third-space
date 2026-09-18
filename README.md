# The Third Space — UTSAAH 3.0 Web Application

> Production-ready, zero-maintenance web platform for **The Third Space** — an MLRIT student-led community dedicated to mental health conversations, creative expression, and authentic connection.

---

## 🌟 Visual System & Background Video Matching

The homepage has been designed to match the reference layout with **100% crisp foreground text visibility over the background video**:

1. **Cinematic Ambient Video Hero (`Hero.jsx` & `BackgroundVideo.jsx`)**:
   - Sequential, seamless video playback from the 44 student art and community videos.
   - Deep cinematic dark scrim (`bg-gradient-to-b from-black/85 via-black/60 to-black/90`).
   - **High-contrast foreground typography**: Luminous cream and vibrant lime highlights with soft text shadows (`drop-shadow-md`), ensuring the headline, date, and venue details pop with razor-sharp legibility over moving video.
   - **Prominent Event Info Bar**: High-contrast pill bar displaying:
     `📅 19 September 2026 | 📍 MLRIT Auditorium | ⏰ 10:00 AM – 4:00 PM`
   - High-contrast **Register Now** CTA button with glowing hover effect.
2. **About Section with Photo Collage (`AboutSection.jsx`)**:
   - Matching the reference layout: Left column features an authentic 5-photo collage grid of real student art moments; right column presents the community narrative.
3. **Impact Stats Bar (`StatsSection.jsx`)**:
   - 4 glassmorphic metric cards (`500+ Attendees`, `100+ Artworks`, `6 Hours`, `3M+ Reach`).
4. **Event Highlights Grid (`HighlightsSection.jsx`)**:
   - 6 curated cards detailing Art Therapy, Keynote Session, Safe Circles, Psychologs Partnership, Stalls, and Open Mic.
5. **Throwback Memories & Gallery (`MetamorphosisPreview.jsx`)**:
   - Curated gallery from the Metamorphosis Edition I art gathering.
6. **Transparent Floating Navbar (`Navbar.jsx`)**:
   - Transparent with crisp white navigation links over the hero video, smoothly blurring into a frosted-glass bar on scroll.

---

## ☁️ Database Architecture: Supabase (Primary)

As requested, **Supabase** is the primary database (providing 500MB PostgreSQL + 1GB free storage).

### How to Stop Supabase from Pausing (100% Free Forever)
Supabase free tier automatically pauses if no queries are made for 7 days. We have solved this completely:
1. **Built-in Keepalive Route (`/api/cron/keepalive`)**:
   - Executes a lightweight query against Supabase to reset its 7-day inactivity timer.
2. **Automated GitHub Action (`.github/workflows/supabase-keepalive.yml`)**:
   - Runs automatically every 3 days for free on GitHub Actions.
   - Pings your deployed website, guaranteeing **Supabase never pauses**!
3. **Resilient Fallback Layer**:
   - If Supabase is ever waking up or tables are empty, `lib/db.js` uses an internal memory cache so the registration form never throws a `503` error or crashes.

---

## 🔄 Free Database Alternatives Comparison

| Database | Free Tier | Pausing Behavior | Storage & Features |
|---|---|---|---|
| **Supabase (Configured)** | 500MB DB + 1GB Files | Pauses after 7 days (Prevented by our free GitHub Action keepalive) | Full relational PostgreSQL, SQL Table Editor, Auth, and Storage. |
| **Neon Postgres** | 500MB DB | Auto-wakes in <500ms on request (never permanently paused) | Pure serverless PostgreSQL with single connection string (`DATABASE_URL`). |
| **MongoDB Atlas** | 512MB DB | **Never pauses** (Always running 24/7/365) | Document database, 1 connection string (`MONGODB_URI`), zero migrations. |
| **Firebase / Firestore** | 1GB DB | **Never pauses** | NoSQL document database by Google Cloud. |

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
cd "the-third-space"
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_PASSWORD=ThirdSpace@2026
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

- **Admin Login**: `http://localhost:3000/admin/login`
- **Default Admin Password**: `ThirdSpace@2026`
- **Admin IDs**: `rikchi940@gmail.com` or `257Y5A6615` or `admin`

---

## 🗄 Supabase Setup & Migrations

If you are setting up a new Supabase project:
1. Go to **Supabase Dashboard > SQL Editor**.
2. Run `supabase/migrations/001_initial_schema.sql` to create the `events`, `registrations`, and `admin_profiles` tables.
3. Run `supabase/migrations/002_rls_policies.sql` to apply Row-Level Security.

---

## 🚢 Deploying to Vercel

1. Push your repository to GitHub.
2. Import the project on [Vercel](https://vercel.com).
3. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD` (e.g. `ThirdSpace@2026`)
4. Deploy!
5. In GitHub, add your Vercel URL as the `SITE_URL` repository secret (optional, defaults to `https://thethirdspace.vercel.app`) so the keep-alive workflow runs automatically.
