# Deployment Guide

This guide walks you through deploying the Body Shape Analysis application to production.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Supabase account (free tier works)
- Resend account (free tier works)
- Domain name (optional, Vercel provides free subdomain)

## Step 1: Prepare Your Code

### 1.1 Create GitHub Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Body Shape Analysis app"

# Create repository on GitHub, then:
git remote add origin https://github.com/yourusername/body-shape-analysis.git
git branch -M main
git push -u origin main
```

### 1.2 Verify .gitignore

Ensure `.gitignore` includes:
```
node_modules
.env
.env.local
dist
.DS_Store
```

## Step 2: Set Up Supabase

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and enter:
   - Project name: `body-shape-analysis`
   - Database password: (generate strong password)
   - Region: (choose closest to your users)
4. Wait for project to be created (~2 minutes)

### 2.2 Run Database Migrations

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste contents of `migrations/001_initial_schema.sql`
4. Click "Run"
5. Repeat for `migrations/002_seed_admin.sql`

### 2.3 Update Admin Password

**IMPORTANT**: The seed file creates a default admin. You must change this password:

1. Generate a new password hash:

```javascript
// Run this in Node.js or browser console
const bcrypt = require('bcryptjs');
const newPassword = 'YourSecurePassword123!';
bcrypt.hash(newPassword, 10).then(hash => console.log(hash));
```

2. In Supabase SQL Editor, run:

```sql
UPDATE admin_users 
SET password_hash = 'your_generated_hash_here'
WHERE email = 'admin@example.com';
```

3. Or create a new admin user:

```sql
INSERT INTO admin_users (email, password_hash)
VALUES ('your@email.com', 'your_generated_hash_here');
```

### 2.4 Get API Keys

1. Go to **Settings** → **API**
2. Copy these values (you'll need them for Vercel):
   - Project URL: `VITE_SUPABASE_URL`
   - `anon` `public` key: `VITE_SUPABASE_ANON_KEY`
   - `service_role` `secret` key: `VITE_SUPABASE_SERVICE_ROLE_KEY`

**⚠️ Keep service_role key secret!**

## Step 3: Set Up Resend

### 3.1 Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for free account
3. Verify your email

### 3.2 Add Domain (Optional but Recommended)

1. Go to **Domains** → **Add Domain**
2. Enter your domain (e.g., `example.com`)
3. Add DNS records as instructed:
   - SPF record
   - DKIM records
4. Wait for verification (~15 minutes)

### 3.3 Get API Key

1. Go to **API Keys**
2. Click "Create API Key"
3. Name: `body-shape-analysis-production`
4. Copy the key: `VITE_RESEND_API_KEY`

### 3.4 Update Email Template

In `src/lib/resend.ts`, update the `from` address:

```typescript
from: 'Body Shape Analysis <noreply@yourdomain.com>',
```

## Step 4: Deploy to Vercel

### 4.1 Connect GitHub Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Vite configuration

### 4.2 Configure Build Settings

Vercel should auto-detect these, but verify:

- **Framework Preset**: Vite
- **Build Command**: `pnpm run build`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`

### 4.3 Add Environment Variables

Click "Environment Variables" and add:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
VITE_RESEND_API_KEY=re_your_resend_key
VITE_ADMIN_JWT_SECRET=your_random_32_char_secret
VITE_APP_URL=https://your-app.vercel.app
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4.4 Deploy

1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Your app will be live at `https://your-app.vercel.app`

## Step 5: Configure Custom Domain (Optional)

### 5.1 Add Domain in Vercel

1. Go to project **Settings** → **Domains**
2. Add your domain (e.g., `bodyshapeanalysis.com`)
3. Follow DNS configuration instructions

### 5.2 Update DNS Records

Add these records in your domain registrar:

**For root domain:**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 5.3 Update Environment Variable

Update `VITE_APP_URL` in Vercel:
```
VITE_APP_URL=https://yourdomain.com
```

Redeploy the application.

## Step 6: Verify Deployment

### 6.1 Test User Flow

1. Visit your deployed URL
2. Complete the questionnaire
3. Verify results page loads
4. Test PDF download
5. Check email delivery (if configured)

### 6.2 Test Admin Dashboard

1. Go to `/admin/login`
2. Login with your admin credentials
3. Verify dashboard loads
4. Check submissions table
5. Test CSV export

### 6.3 Check Database

1. In Supabase, go to **Table Editor**
2. Check `submissions` table for test data
3. Verify data is being saved correctly

## Step 7: Production Checklist

- [ ] Admin password changed from default
- [ ] All environment variables set correctly
- [ ] Database migrations run successfully
- [ ] Custom domain configured (if applicable)
- [ ] Email sending tested and working
- [ ] PDF generation tested
- [ ] Admin dashboard accessible
- [ ] Mobile responsiveness verified
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Error tracking configured (optional: Sentry)
- [ ] Analytics configured (optional: Google Analytics)

## Troubleshooting

### Build Fails

**Issue**: TypeScript errors during build

**Solution**: 
```bash
# Run locally first
pnpm run build

# Fix any errors, then commit and push
```

### Database Connection Fails

**Issue**: "Database not configured" error

**Solution**:
- Verify Supabase URL and keys are correct
- Check if Supabase project is active
- Ensure migrations were run

### Email Not Sending

**Issue**: Emails not being delivered

**Solution**:
- Verify Resend API key is correct
- Check domain verification status
- Look at Resend logs for errors
- Ensure `from` address uses verified domain

### Admin Login Fails

**Issue**: Cannot login to admin dashboard

**Solution**:
- Verify admin user exists in database
- Check password hash was generated correctly
- Ensure JWT secret is set
- Clear browser cache/cookies

## Maintenance

### Regular Tasks

1. **Monitor Submissions**: Check admin dashboard weekly
2. **Database Backups**: Supabase auto-backs up, but export monthly
3. **Update Dependencies**: Run `pnpm update` monthly
4. **Review Logs**: Check Vercel logs for errors
5. **Security Updates**: Update packages with security patches

### Scaling Considerations

**If you exceed free tier limits:**

1. **Supabase**: Upgrade to Pro ($25/month)
   - More database storage
   - Higher API limits
   - Better performance

2. **Resend**: Upgrade as needed
   - Free: 100 emails/day
   - Paid: Starts at $20/month

3. **Vercel**: Upgrade to Pro ($20/month)
   - More bandwidth
   - Better performance
   - Team features

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check Supabase logs
3. Review browser console for errors
4. Refer to troubleshooting section above

---

**Next Steps**: See [CUSTOMIZATION.md](./CUSTOMIZATION.md) for customizing the application