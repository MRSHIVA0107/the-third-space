# Vercel Deployment Guide for The Third Space

This document contains the step-by-step instructions to deploy **The Third Space** website to Vercel in less than 5 minutes.

---

## 1. Environment Variables Needed in Vercel

When importing your project into Vercel, copy and paste these exact Environment Variables in the **Environment Variables** section:

| Variable Name | Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://wfkilscqkmmhbebugdbq.supabase.co` | Supabase Cloud Database URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_Hz6zJ-tbVZc3U5bblOF5Cg__OJ-FGYT` | Supabase Public Anonymous API Key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indma2lsc2Nxa21taGJlYnVnZGJxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTQ3NzgzMCwiZXhwIjoyMTA1MDUzODMwfQ.XDeqL9zT1BztTPEC0c5CZWj5ZXlT9z8Iw7fzyerkdXY` | Supabase Admin Service Key |
| `ADMIN_PASSWORD` | `0107` | Admin Portal Master Password |
| `ADMIN_JWT_SECRET` | `third-space-super-secure-admin-secret-key-0107` | Secret for signing admin session tokens |

> [!NOTE]
> `NEXT_PUBLIC_BASE_URL` is automatically handled by Vercel (`https://your-project.vercel.app`), but you can also set `NEXT_PUBLIC_BASE_URL` to your custom domain once connected.

---

## 2. Step-by-Step Deployment Instructions

### Method A: Deploy via GitHub & Vercel Dashboard (Recommended)

1. **Initialize & Push to GitHub**:
   Open PowerShell in `l:\THE THIRD SPACE\the-third-space` and run:
   ```bash
   git init
   git add .
   git commit -m "feat: The Third Space production full-stack release"
   git branch -M main
   git remote add origin https://github.com/<your-username>/the-third-space.git
   git push -u origin main
   ```

2. **Open Vercel Dashboard**:
   - Go to [https://vercel.com/new](https://vercel.com/new) and log in with your GitHub account.
   - Click **Import** next to your repository `the-third-space`.

3. **Configure Project Settings**:
   - **Framework Preset**: `Next.js` (automatically detected).
   - **Root Directory**: `./` (leave default).
   - **Build Command**: `next build` (leave default).
   - **Output Directory**: `.next` (leave default).

4. **Add Environment Variables**:
   - Expand the **Environment Variables** panel.
   - Paste the 5 variables from Section 1 above.

5. **Click "Deploy"**:
   - Click the green **Deploy** button.
   - Deployment takes ~45 to 60 seconds.
   - Once completed, Vercel will give you a live production URL (e.g. `https://the-third-space.vercel.app`).

---

### Method B: Deploy via Vercel CLI (Direct from Terminal)

1. **Install Vercel CLI globally** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy directly**:
   ```bash
   vercel
   ```
   - Follow the prompts to log in and select your account.
   - Set up and deploy: press `Y`.
   - Which scope do you want to deploy to: select your account.
   - Link to existing project: `N`.
   - What's your project's name: `the-third-space`.
   - In which directory is your code located: `./`.
   - Want to modify these settings: `N`.

3. **Add Environment Variables via CLI**:
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL production
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
   vercel env add SUPABASE_SERVICE_ROLE_KEY production
   vercel env add ADMIN_PASSWORD production
   vercel env add ADMIN_JWT_SECRET production
   ```

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

---

## 3. Post-Deployment Verification Checklist

Once deployed on Vercel, verify the following:

- [ ] **Home Page (`/`)**: Video background auto-loops, hero headline renders.
- [ ] **Registration Form (`/register`)**: Fill out a test registration with Year, Branch, and Section. Verify the themed success state appears with your unique ID (`UTSAAH3-XXX`).
- [ ] **Admin Login (`/admin/login`)**: Log in with `rikchi940@gmail.com` and password `0107`.
- [ ] **Admin Dashboard (`/admin/dashboard`)**: Check registration counter and verify both `[ Download .CSV ]` and `[ Excel (.xls) ]` work.
- [ ] **Attendee Roster (`/admin/registrations`)**: Check sequential `S.No`, inline attendee removal with confirmation, and export options.
- [ ] **Event Manager (`/admin/events`)**: Generate teaser announcements and test inline deletion.
