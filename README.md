# Body Shape Analysis Web Application

A production-ready web application for body shape analysis and personalized styling recommendations. Built with React, TypeScript, Tailwind CSS, and Supabase.

## 🌟 Features

- **Interactive Questionnaire**: Multi-step form with body proportion questions
- **Body Shape Classification**: Rules-based algorithm identifying 5 body shapes
  - Pear
  - Hourglass
  - Apple
  - Rectangle
  - Inverted Triangle
- **Personalized Recommendations**: Detailed styling advice for each body shape
  - Tops, bottoms, dresses, jackets
  - Necklines, patterns, fabrics
  - Color and fit tips
  - What to avoid
- **PDF Generation**: Downloadable analysis reports
- **Email Delivery**: Send results directly to users
- **Admin Dashboard**: Manage submissions, view analytics, export data
- **GDPR Compliant**: Privacy-first design with clear consent
- **Mobile Responsive**: Optimized for all devices
- **Shopify Integration Ready**: Token-based access control prepared

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **UI Components**: shadcn/ui, Radix UI, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Email**: Resend
- **PDF Generation**: jsPDF
- **Authentication**: JWT with bcrypt
- **Routing**: React Router v6

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ and pnpm installed
- A Supabase account and project
- A Resend account for email functionality
- Basic knowledge of React and TypeScript

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
VITE_RESEND_API_KEY=your_resend_api_key
VITE_ADMIN_JWT_SECRET=your_random_secret_key_min_32_characters
VITE_APP_URL=http://localhost:3000
```

### 3. Database Setup

Run the migration files in your Supabase SQL editor:

1. Execute `migrations/001_initial_schema.sql`
2. Execute `migrations/002_seed_admin.sql` (creates default admin user)

### 4. Run Development Server

```bash
pnpm run dev
```

The application will be available at `http://localhost:3000`

### 5. Default Admin Credentials

**⚠️ CHANGE IMMEDIATELY AFTER FIRST LOGIN**

- Email: `admin@example.com`
- Password: `ChangeMe123!`

## 📁 Project Structure

```
body-shape-analysis/
├── src/
│   ├── components/
│   │   └── ui/              # shadcn/ui components
│   ├── config/
│   │   └── stylingRecommendations.json
│   ├── lib/
│   │   ├── analysis/
│   │   │   └── bodyShapeClassifier.ts
│   │   ├── auth.ts
│   │   ├── pdf-generator.ts
│   │   ├── resend.ts
│   │   ├── supabase.ts
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Index.tsx
│   │   ├── Questionnaire.tsx
│   │   ├── Results.tsx
│   │   ├── AdminLogin.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── AdminSubmissionDetail.tsx
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── migrations/
│   ├── 001_initial_schema.sql
│   └── 002_seed_admin.sql
├── docs/
│   ├── DEPLOYMENT.md
│   ├── CUSTOMIZATION.md
│   └── SHOPIFY-INTEGRATION.md
├── .env.example
├── package.json
└── README.md
```

## 🎨 Customization

See [CUSTOMIZATION.md](./docs/CUSTOMIZATION.md) for detailed instructions on:
- Modifying styling recommendations
- Adjusting body shape classification rules
- Customizing email templates
- Changing colors and branding

## 🚢 Deployment

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for step-by-step deployment instructions for:
- Vercel deployment
- Supabase configuration
- Environment variables setup
- Domain configuration

## 🛒 Shopify Integration

See [SHOPIFY-INTEGRATION.md](./docs/SHOPIFY-INTEGRATION.md) for instructions on:
- Setting up webhooks
- Token generation on purchase
- Access control implementation
- Testing the integration

## 📊 Database Schema

### Tables

**submissions**
- Stores all user questionnaire submissions and analysis results
- Fields: id, email, questionnaire_answers (JSON), measurements (JSON), body_shape_result, styling_recommendations (JSON), created_at

**admin_users**
- Stores admin credentials for dashboard access
- Fields: id, email, password_hash, created_at

**access_tokens**
- Manages access tokens for paid users (Shopify integration)
- Fields: id, token, email, tier, is_used, expires_at, created_at, shopify_order_id

## 🔒 Security

- Passwords are hashed using bcrypt (10 rounds)
- JWT tokens for admin authentication
- Environment variables for sensitive data
- HTTPS required in production
- GDPR-compliant data handling

## 🧪 Testing

```bash
# Run linter
pnpm run lint

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

## 📝 License

This project is proprietary software. All rights reserved.

## 🤝 Support

For questions or issues:
- Email: support@example.com
- Documentation: See `/docs` folder

## 🎯 Roadmap

- [ ] Photo upload for enhanced analysis
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Email automation workflows
- [ ] Mobile app version

---

Built with ❤️ for fashion-forward individuals
