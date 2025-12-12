# Vercel Deployment Setup

## 📋 Environment Variables

### Required Variables

#### Clerk Authentication

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_c2VsZWN0ZWQtcGFuZGEtMC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_5Ej1XoMPNqjfBT4WEXiH0VTR0CjuNARhGHPSC4kO9O
CLERK_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth?mode=signup
```

#### Firebase Configuration

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyApFVqxGU8bcPrGmnaQK3GvdBjLzSZGFow
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=v0-vanguard.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=v0-vanguard
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=v0-vanguard.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=779844653714
NEXT_PUBLIC_FIREBASE_APP_ID=1:779844653714:web:4b09d2647185e97f098c4b
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-4BDJL1V5MN
```

### Optional Variables

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key
GEMINI_API_KEY=your_gemini_key
PERPLEXITY_API_KEY=your_perplexity_key
```

## 🚀 Deployment Steps

1. **Connect Repository**

   - Go to https://vercel.com/dashboard
   - Click "Add New Project"
   - Import from GitHub: `lukishere/v0-vanguard`

2. **Configure Environment Variables**

   - Settings → Environment Variables
   - Add all required variables
   - Environment: Production, Preview, Development

3. **Deploy**
   - Vercel auto-detects Next.js
   - No `vercel.json` needed
   - Build command: `pnpm run build`
   - Output directory: `.next`

## ⚠️ Important Notes

- Remove `vercel.json` if exists (causes conflicts)
- Use auto-detection for Next.js projects
- Configure webhook before first user signup
- Variables with `NEXT_PUBLIC_` are client-side visible

## 🔍 Troubleshooting

### Build Errors

- **"Function Runtimes must have a valid version"**: Delete `vercel.json`
- **"Turbopack parsing error"**: Check code formatting consistency
- **"Dynamic server usage"**: Add `export const dynamic = 'force-dynamic'`

### Runtime Errors

- **401 Unauthorized**: Missing Clerk environment variables
- **500 Internal Server Error**: Check Clerk webhook configuration
- **Client-side exception**: Verify metadata initialization in webhook
