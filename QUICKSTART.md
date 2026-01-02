# Quickstart Guide - Colors Code Body Shape Analysis

## Project Information

**Build Command:** `npm run build` (or `pnpm run build`)  
**Output Folder:** `dist/`  
**Node Version:** 18.x or 20.x  
**Package Manager:** pnpm (npm and yarn also work)

## Download Full Project

To download the complete project:
1. Click the **Editor** button in the right sidebar
2. Select all files you want to download
3. Click the **Export** button to download as a ZIP file

Alternatively, use the Share button in the top-right corner to export all code files.

## Quick Setup (5 Minutes)

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Required for BASIC_MODE
VITE_MODE=BASIC

# Required for database (Supabase)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional - Only needed for FULL_MODE
VITE_MODE=FULL
VITE_RESEND_API_KEY=your_resend_api_key
VITE_APP_URL=http://localhost:3000
```

### 3. Start Development Server

```bash
npm run dev
# or
pnpm run dev
```

Open http://localhost:3000 in your browser.

## Key Files & Locations

### Edit Styling Recommendations
**File:** `/src/config/stylingRecommendations.json`

This JSON file contains all body shape recommendations. Edit directly:
- Body shape descriptions
- Clothing recommendations by category
- Color tips
- Fit tips
- What to avoid

### Submissions Storage
**Database Table:** `submissions`

**Location:** Supabase PostgreSQL database

**Columns:**
- `id` (UUID) - Primary key
- `email` (VARCHAR) - User email
- `questionnaire_answers` (JSONB) - All questionnaire responses
- `measurements` (JSONB) - Optional body measurements
- `body_shape_result` (VARCHAR) - Classified body shape
- `styling_recommendations` (JSONB) - Full analysis results
- `access_token_id` (UUID) - Reference to access token (if used)
- `created_at` (TIMESTAMP) - Submission timestamp

**View Submissions:**
- Admin Dashboard: http://localhost:3000/admin/login
- Default credentials: See SETUP-INSTRUCTIONS.md

### Access Tokens Storage
**Database Table:** `access_tokens`

**Columns:**
- `id` (UUID) - Primary key
- `token` (VARCHAR) - Unique access token
- `email` (VARCHAR) - Customer email
- `tier` (VARCHAR) - Service tier (basic/standard/premium)
- `is_used` (BOOLEAN) - Whether token has been used
- `expires_at` (TIMESTAMP) - Expiration date
- `used_at` (TIMESTAMP) - When token was used
- `shopify_order_id` (VARCHAR) - Shopify order reference
- `created_at` (TIMESTAMP) - Creation timestamp

## Operating Modes

### BASIC_MODE (Default)
Works immediately without backend setup:
- ✅ Questionnaire
- ✅ Body shape analysis
- ✅ Styling recommendations
- ✅ PDF download
- ✅ Save to database
- ❌ Email delivery (disabled)
- ❌ Shopify webhooks (disabled)

**Set in `.env`:**
```env
VITE_MODE=BASIC
```

### FULL_MODE
Requires backend setup (Supabase Edge Functions or API):
- ✅ All BASIC_MODE features
- ✅ Email delivery of results
- ✅ Shopify webhook handling
- ✅ Access token system

**Set in `.env`:**
```env
VITE_MODE=FULL
```

## Database Setup

### 1. Create Supabase Project
1. Go to https://supabase.com
2. Create a new project
3. Copy your project URL and anon key

### 2. Run SQL Migrations (In Order)

**Step 1:** Run `migrations/001_initial_schema.sql`
- Creates tables: submissions, admin_users, access_tokens
- Sets up indexes and constraints

**Step 2:** Run `migrations/002_setup_auth.sql`
- Configures Supabase Auth for admin users
- Sets up Row Level Security (RLS) policies

**Step 3:** Run `migrations/003_seed_data.sql`
- Creates default admin user
- Adds sample access tokens (optional)

### 3. Enable Supabase Auth

In Supabase Dashboard:
1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Disable email confirmations (or configure SMTP)

## Test the Application

### User Flow
1. Go to http://localhost:3000
2. Click "Start Analysis"
3. Enter access token or email (in BASIC_MODE, this is optional)
4. Complete 3-step questionnaire
5. View results with styling recommendations
6. Download PDF report

### Admin Flow
1. Go to http://localhost:3000/admin/login
2. Login with Supabase Auth credentials
3. View all submissions
4. Export data as CSV
5. View detailed submission information

## Common Issues

### "Database not configured"
**Solution:** Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`

### "Access denied"
**Solution:** In BASIC_MODE, access gate is optional. In FULL_MODE, you need a valid token or paid email.

### Admin login fails
**Solution:** Ensure you've run migration 002 and created an admin user in Supabase Auth

### Build errors
**Solution:** Delete `node_modules` and `package-lock.json`, then run `npm install` again

## Build for Production

```bash
# Build the application
npm run build

# Output will be in dist/ folder
# Upload dist/ folder to Vercel or any static host
```

## Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts to link project and set environment variables
```

See `DEPLOYMENT-CHECKLIST.md` for complete deployment guide.

## Project Structure

```
/workspace/shadcn-ui/
├── src/
│   ├── components/ui/          # shadcn/ui components
│   ├── config/
│   │   └── stylingRecommendations.json  # ← EDIT RECOMMENDATIONS HERE
│   ├── lib/
│   │   ├── analysis/           # Body shape classification
│   │   ├── supabase.ts         # Database client
│   │   └── pdf-generator.ts    # PDF creation
│   ├── pages/
│   │   ├── Index.tsx           # Landing page
│   │   ├── AccessGate.tsx      # Token/email validation
│   │   ├── Questionnaire.tsx   # Multi-step form
│   │   ├── Results.tsx         # Analysis results
│   │   └── AdminDashboard.tsx  # Admin interface
│   └── types/
│       └── index.ts            # TypeScript types
├── migrations/                  # Database SQL files
│   ├── 001_initial_schema.sql
│   ├── 002_setup_auth.sql
│   └── 003_seed_data.sql
├── .env                        # Environment variables (create this)
├── .env.example                # Template
└── package.json
```

## Next Steps

1. **Customize Branding:** Edit colors, logo, and text in components
2. **Edit Recommendations:** Modify `/src/config/stylingRecommendations.json`
3. **Set Up Shopify:** Follow `docs/SHOPIFY-INTEGRATION.md`
4. **Deploy:** Follow `DEPLOYMENT-CHECKLIST.md`

## Support

- **Documentation:** See `/docs` folder for detailed guides
- **Supabase Issues:** Check Supabase dashboard logs
- **Build Issues:** Run `npm run lint` to check for errors

---

**Ready to deploy?** See `DEPLOYMENT-CHECKLIST.md` for the complete Vercel + Supabase deployment guide.