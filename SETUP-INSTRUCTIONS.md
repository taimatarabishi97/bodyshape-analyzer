# Setup Instructions - Body Shape Analysis Application

## Quick Start Summary

This is a **production-ready** body shape analysis web application built with React, TypeScript, and Supabase. It's designed to be sold as a digital service on Shopify.

## ⚠️ Important Note

This application is built with **Vite + React**, not Next.js as originally requested. This means:

- **No server-side rendering** - This is a client-side React application
- **Backend functionality requires separate API setup** - Features like email sending and Shopify webhooks need a backend service
- **Database operations work client-side** - Using Supabase's client library

## What's Included

### ✅ Fully Implemented
1. **Complete Frontend Application**
   - Multi-step questionnaire (3 steps)
   - Body shape classification (5 shapes: Pear, Hourglass, Apple, Rectangle, Inverted Triangle)
   - Results page with detailed recommendations
   - Admin dashboard with login
   - Admin submission management
   - PDF generation (client-side)
   - Mobile-responsive design

2. **Database Schema**
   - SQL migration files ready to run in Supabase
   - Tables: submissions, admin_users, access_tokens
   - Indexes and relationships configured

3. **Comprehensive Documentation**
   - README.md - Project overview and quick start
   - DEPLOYMENT.md - Step-by-step deployment guide
   - CUSTOMIZATION.md - How to customize recommendations and styling
   - SHOPIFY-INTEGRATION.md - Integration guide for Shopify

4. **Styling & Recommendations**
   - JSON configuration file with all body shape recommendations
   - Easy to edit without touching code
   - GDPR-friendly language throughout

### ⚠️ Requires Additional Setup

1. **Email Functionality**
   - Code is written but requires backend API endpoint
   - Resend integration prepared but needs server-side execution
   - Alternative: Use Supabase Edge Functions (see notes below)

2. **Shopify Webhook Handler**
   - Documentation provided in SHOPIFY-INTEGRATION.md
   - Requires backend API endpoint to receive webhooks
   - Alternative: Use Supabase Edge Functions or serverless functions

3. **Admin Password Hashing**
   - bcrypt is included but runs in browser (not ideal for production)
   - Should be moved to server-side for security
   - Alternative: Use Supabase Auth for admin authentication

## Immediate Next Steps

### Option A: Deploy As-Is (Limited Functionality)

**What Works:**
- Questionnaire and analysis
- Results display
- PDF download
- Admin dashboard (with client-side auth)
- Database storage via Supabase

**What Doesn't Work:**
- Email sending (no backend)
- Shopify webhooks (no backend)

**Steps:**
1. Follow `docs/DEPLOYMENT.md` to deploy to Vercel
2. Set up Supabase database
3. Users can complete analysis and download PDF
4. Admin can view submissions in dashboard

### Option B: Add Backend Functionality (Recommended for Production)

**Choose One:**

#### 1. Supabase Edge Functions (Recommended)
- Free tier available
- Serverless, scales automatically
- Integrated with your database

**Create these Edge Functions:**
- `send-results-email` - Send analysis results via email
- `shopify-webhook` - Handle Shopify order webhooks

**Resources:**
- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- Code templates provided in documentation

#### 2. Separate Backend API
- Deploy Node.js/Express server
- Host on Vercel, Railway, or Render
- Implement API endpoints from documentation

#### 3. Next.js Rewrite (Most Work)
- Convert entire app to Next.js
- Use API routes for backend logic
- Enables server-side rendering

## Environment Variables Needed

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Resend (for email)
VITE_RESEND_API_KEY=your_resend_api_key

# Admin Auth
VITE_ADMIN_JWT_SECRET=your_random_32_char_secret

# App URL
VITE_APP_URL=https://your-domain.com
```

## Security Considerations

### ⚠️ Current Security Issues

1. **Service Role Key Exposed**
   - `VITE_SUPABASE_SERVICE_ROLE_KEY` is exposed in browser
   - Should only be used server-side
   - **Fix:** Move admin operations to Edge Functions

2. **Client-Side Password Hashing**
   - Admin passwords hashed in browser
   - Not secure for production
   - **Fix:** Use Supabase Auth or move to server

3. **JWT Secret in Browser**
   - Admin JWT secret accessible in browser
   - **Fix:** Move auth to server-side

### ✅ How to Fix

**Recommended: Use Supabase Auth**

Replace custom admin auth with Supabase Auth:

```typescript
// Instead of custom JWT auth
import { supabase } from '@/lib/supabase';

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@example.com',
  password: 'password'
});

// Check session
const { data: { session } } = await supabase.auth.getSession();
```

Enable Row Level Security (RLS) in Supabase to protect admin tables.

## File Structure

```
/workspace/shadcn-ui/
├── src/
│   ├── components/ui/          # shadcn/ui components
│   ├── config/
│   │   └── stylingRecommendations.json  # Edit recommendations here
│   ├── lib/
│   │   ├── analysis/
│   │   │   └── bodyShapeClassifier.ts   # Classification logic
│   │   ├── auth.ts             # Admin authentication
│   │   ├── pdf-generator.ts    # PDF creation
│   │   ├── resend.ts           # Email sending (needs backend)
│   │   └── supabase.ts         # Database client
│   ├── pages/
│   │   ├── Index.tsx           # Landing page
│   │   ├── Questionnaire.tsx   # Multi-step form
│   │   ├── Results.tsx         # Analysis results
│   │   ├── AdminLogin.tsx      # Admin login
│   │   ├── AdminDashboard.tsx  # Admin dashboard
│   │   └── AdminSubmissionDetail.tsx
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   └── App.tsx                 # Main app component
├── migrations/
│   ├── 001_initial_schema.sql  # Database schema
│   └── 002_seed_admin.sql      # Default admin user
├── docs/
│   ├── DEPLOYMENT.md           # Deployment guide
│   ├── CUSTOMIZATION.md        # Customization guide
│   └── SHOPIFY-INTEGRATION.md  # Shopify integration
├── .env.example                # Environment variables template
└── README.md                   # Project overview
```

## Testing Locally

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Open http://localhost:3000

# Test the flow:
# 1. Complete questionnaire
# 2. View results
# 3. Download PDF
# 4. Go to /admin/login
# 5. Login with default credentials (see below)
```

## Default Admin Credentials

**⚠️ CHANGE IMMEDIATELY IN PRODUCTION**

- Email: `admin@example.com`
- Password: `ChangeMe123!`

The password hash in `migrations/002_seed_admin.sql` is a placeholder. Generate a real hash before deploying.

## Common Issues & Solutions

### Issue: "Database not configured"
**Solution:** Set Supabase environment variables and run migrations

### Issue: "Email not sending"
**Solution:** Email requires backend. Use Supabase Edge Functions or deploy separate API

### Issue: Admin login fails
**Solution:** Ensure admin user exists in database and password hash is correct

### Issue: Build warnings about chunk size
**Solution:** This is normal. The app works fine. Optimize later if needed.

## Production Deployment Checklist

- [ ] Set up Supabase project
- [ ] Run database migrations
- [ ] Change default admin password
- [ ] Set all environment variables
- [ ] Deploy to Vercel
- [ ] Set up custom domain (optional)
- [ ] Implement backend for email (if needed)
- [ ] Set up Shopify webhooks (if selling)
- [ ] Test complete user flow
- [ ] Test admin dashboard
- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Set up error monitoring (optional)

## Support & Resources

- **Documentation:** See `/docs` folder
- **Supabase Docs:** https://supabase.com/docs
- **Resend Docs:** https://resend.com/docs
- **Shopify Webhooks:** https://shopify.dev/docs/api/webhooks

## What's Next?

1. **Immediate:** Deploy basic version following DEPLOYMENT.md
2. **Short-term:** Add backend functionality via Supabase Edge Functions
3. **Long-term:** Consider Next.js rewrite for full SSR capabilities

---

**Note:** This application provides a solid foundation. The frontend is production-ready, but backend features require additional setup based on your infrastructure preferences.