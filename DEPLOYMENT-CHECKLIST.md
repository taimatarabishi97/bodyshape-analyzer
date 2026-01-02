# Deployment Checklist - Vercel + Supabase

Complete guide for deploying Colors Code Body Shape Analysis application.

## Prerequisites

- [ ] GitHub account
- [ ] Vercel account (free tier works)
- [ ] Supabase account (free tier works)
- [ ] Resend account (optional, for FULL_MODE email functionality)
- [ ] Domain name (optional, Vercel provides free subdomain)

---

## Part 1: Supabase Setup (15 minutes)

### Step 1: Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in:
   - **Name:** colors-code-body-shape
   - **Database Password:** (generate strong password and save it)
   - **Region:** Choose closest to your users
4. Wait 2-3 minutes for project creation

### Step 2: Get Supabase Credentials

1. In your project dashboard, go to **Settings** → **API**
2. Copy these values (you'll need them for environment variables):
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon public key:** `eyJhbGc...` (long string)
   - **service_role key:** `eyJhbGc...` (different long string)

### Step 3: Run Database Migrations

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Run migrations in this exact order:

**Migration 1: Initial Schema**
```sql
-- Copy entire contents of migrations/001_initial_schema.sql
-- Click "Run" button
```

**Migration 2: Setup Auth**
```sql
-- Copy entire contents of migrations/002_setup_auth.sql
-- Click "Run" button
```

**Migration 3: Seed Data (Optional)**
```sql
-- Copy entire contents of migrations/003_seed_data.sql
-- Click "Run" button
```

### Step 4: Enable Supabase Auth

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Disable "Confirm email" (or configure SMTP if you want email confirmation)
4. Save changes

### Step 5: Create Admin User

1. Go to **Authentication** → **Users**
2. Click "Add User" → "Create new user"
3. Fill in:
   - **Email:** admin@colorscodestyle.com (or your email)
   - **Password:** (strong password)
   - **Auto Confirm User:** YES
4. Click "Create user"

5. Go back to **SQL Editor** and run:
```sql
SELECT make_admin('admin@colorscodestyle.com');
```
Replace with your actual admin email.

### Step 6: Verify Database Setup

1. Go to **Table Editor**
2. Verify these tables exist:
   - `submissions` (0 rows initially)
   - `access_tokens` (3 test tokens if you ran migration 003)
   - `admin_metadata` (1 row with your admin user)

---

## Part 2: Resend Setup (Optional - Only for FULL_MODE)

Skip this section if using BASIC_MODE.

### Step 1: Create Resend Account

1. Go to https://resend.com
2. Sign up for free account
3. Verify your email

### Step 2: Verify Domain (Recommended)

1. Go to **Domains** → **Add Domain**
2. Enter your domain: `colorscodestyle.com`
3. Add DNS records shown by Resend to your domain DNS
4. Wait for verification (5-30 minutes)

**OR use Resend's test domain:**
- From: `onboarding@resend.dev`
- Limited to 100 emails/day
- Only sends to verified emails

### Step 3: Get API Key

1. Go to **API Keys**
2. Click "Create API Key"
3. Name: "Colors Code Production"
4. Copy the key (starts with `re_...`)

---

## Part 3: GitHub Setup (5 minutes)

### Step 1: Push Code to GitHub

```bash
# In your project directory
git init
git add .
git commit -m "Initial commit - Colors Code Body Shape Analysis"

# Create new repository on GitHub, then:
git remote add origin https://github.com/yourusername/colors-code-body-shape.git
git branch -M main
git push -u origin main
```

---

## Part 4: Vercel Deployment (10 minutes)

### Step 1: Import Project

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Click "Import"

### Step 2: Configure Build Settings

Vercel should auto-detect these, but verify:

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`
- **Node Version:** 18.x or 20.x

### Step 3: Add Environment Variables

Click "Environment Variables" and add these:

#### Required for BASIC_MODE:

| Variable Name | Value | Where Used in Code |
|--------------|-------|-------------------|
| `VITE_MODE` | `BASIC` | `src/pages/AccessGate.tsx` (line 16)<br>`src/pages/Index.tsx` (line 9) |
| `VITE_SUPABASE_URL` | Your Supabase project URL | `src/lib/supabase.ts` (line 4) |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | `src/lib/supabase.ts` (line 5) |

#### Additional for FULL_MODE:

| Variable Name | Value | Where Used in Code |
|--------------|-------|-------------------|
| `VITE_MODE` | `FULL` | `src/pages/AccessGate.tsx` (line 16)<br>`src/pages/Index.tsx` (line 9) |
| `VITE_RESEND_API_KEY` | Your Resend API key | `src/lib/resend.ts` (line 3) |
| `VITE_APP_URL` | `https://your-app.vercel.app` | `src/lib/resend.ts` (line 45) |

**Important:** 
- All variables starting with `VITE_` are exposed to the browser
- Set these for "Production", "Preview", and "Development" environments
- Click "Add" after each variable

### Step 4: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. Click "Visit" to see your live site

### Step 5: Configure Custom Domain (Optional)

1. Go to your project → **Settings** → **Domains**
2. Add your domain: `colorscodestyle.com`
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic, 5-10 minutes)

---

## Part 5: Testing Deployment (10 minutes)

### Test User Flow (BASIC_MODE)

1. Visit your deployed URL
2. Click "Start Your Analysis"
3. Should go directly to questionnaire
4. Complete all 3 steps
5. Submit with your email
6. Verify you see results page
7. Download PDF - should work
8. Check Supabase **Table Editor** → **submissions** - should see your entry

### Test User Flow (FULL_MODE)

1. Visit your deployed URL
2. Click "Start Your Analysis"
3. Should show access gate
4. Enter test token: `test-basic-token-123`
5. Complete questionnaire
6. Submit
7. Check email for results (if Resend configured)
8. Verify token marked as used in Supabase

### Test Admin Flow

1. Go to `https://your-app.vercel.app/admin/login`
2. Login with admin credentials you created
3. Should see dashboard with submissions
4. Click "View" on a submission
5. Verify all data displays correctly
6. Test CSV export
7. Logout

---

## Part 6: Environment Variables Reference

Complete list of all environment variables and their usage:

### `VITE_MODE`
- **Values:** `BASIC` or `FULL`
- **Default:** `BASIC`
- **Used in:**
  - `src/pages/AccessGate.tsx:16` - Skips access gate if BASIC
  - `src/pages/Index.tsx:9` - Routes to questionnaire or access gate
  - `src/lib/resend.ts:3` - Enables/disables email sending
- **Purpose:** Toggle between basic (no backend) and full (with backend) modes

### `VITE_SUPABASE_URL`
- **Format:** `https://xxxxx.supabase.co`
- **Used in:**
  - `src/lib/supabase.ts:4` - Initialize Supabase client
- **Purpose:** Connect to your Supabase database
- **Required:** YES (both modes)

### `VITE_SUPABASE_ANON_KEY`
- **Format:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long JWT)
- **Used in:**
  - `src/lib/supabase.ts:5` - Initialize Supabase client
- **Purpose:** Public API key for client-side database access
- **Required:** YES (both modes)

### `VITE_RESEND_API_KEY`
- **Format:** `re_123456789...`
- **Used in:**
  - `src/lib/resend.ts:3` - Initialize Resend client
  - `src/lib/resend.ts:15` - Send results email
- **Purpose:** Send emails with analysis results
- **Required:** Only for FULL_MODE

### `VITE_APP_URL`
- **Format:** `https://colorscodestyle.com` or `https://your-app.vercel.app`
- **Used in:**
  - `src/lib/resend.ts:45` - Generate access links in emails
- **Purpose:** Base URL for generating links
- **Required:** Only for FULL_MODE

---

## Part 7: Post-Deployment Tasks

### Security

- [ ] Change default admin password
- [ ] Review Supabase RLS policies
- [ ] Enable Vercel password protection for preview deployments (optional)
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)

### Monitoring

- [ ] Set up Vercel Analytics (free)
- [ ] Monitor Supabase dashboard for database usage
- [ ] Check Resend dashboard for email delivery (if using)

### Customization

- [ ] Update `src/config/stylingRecommendations.json` with your recommendations
- [ ] Replace placeholder links in footer (privacy policy, terms, etc.)
- [ ] Update brand colors if desired
- [ ] Add your logo/favicon

### Testing

- [ ] Test on mobile devices
- [ ] Test in different browsers (Chrome, Safari, Firefox)
- [ ] Test email delivery (if FULL_MODE)
- [ ] Test PDF downloads
- [ ] Test admin dashboard on mobile

---

## Part 8: Troubleshooting

### Build Fails on Vercel

**Error:** `Module not found` or `Cannot find module`
- **Solution:** Check `package.json` dependencies
- Run `npm install` locally and commit `package-lock.json`

**Error:** `Build exceeded maximum duration`
- **Solution:** Check for infinite loops in components
- Reduce bundle size by code splitting

### Database Connection Fails

**Error:** `Database not configured`
- **Solution:** Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Check Supabase project is not paused (free tier pauses after 1 week inactivity)

### Admin Login Fails

**Error:** `Invalid credentials or not an admin user`
- **Solution:** Verify admin user exists in Supabase Auth
- Run `SELECT make_admin('your@email.com');` in SQL Editor
- Check `admin_metadata` table has entry for user

### Email Not Sending

**Error:** Email never arrives
- **Solution:** Check Resend dashboard for delivery status
- Verify `VITE_RESEND_API_KEY` is correct
- Check spam folder
- Verify sender domain is verified in Resend

### Access Gate Not Working

**Error:** "Invalid access token"
- **Solution:** Verify token exists in `access_tokens` table
- Check token is not expired (`expires_at` > now)
- Check token is not used (`is_used` = false)

---

## Part 9: Maintenance

### Weekly

- [ ] Check Supabase dashboard for database size
- [ ] Review error logs in Vercel
- [ ] Check email delivery stats (if FULL_MODE)

### Monthly

- [ ] Export submission data backup from Supabase
- [ ] Review and clean up old submissions if needed
- [ ] Update dependencies: `npm update`
- [ ] Check for Supabase/Vercel service updates

### As Needed

- [ ] Add new body shape recommendations
- [ ] Update questionnaire questions
- [ ] Adjust classification algorithm
- [ ] Add new features

---

## Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Resend Docs:** https://resend.com/docs
- **Project Docs:** See `/docs` folder in repository

---

## Success Checklist

Your deployment is successful when:

- [ ] Application loads at your Vercel URL
- [ ] User can complete questionnaire
- [ ] Results display correctly
- [ ] PDF download works
- [ ] Submissions save to Supabase
- [ ] Admin can login
- [ ] Admin dashboard shows submissions
- [ ] CSV export works
- [ ] Mobile responsive design works
- [ ] All environment variables are set correctly

---

**Congratulations!** Your Colors Code Body Shape Analysis application is now live! 🎉

For questions or issues, refer to the troubleshooting section or check the project documentation in the `/docs` folder.