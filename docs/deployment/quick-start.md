# Quick Start Deployment Guide

## 🚀 Deploy to Vercel (5 minutes)

### Step 1: Prepare Clerk

1. Create app at https://dashboard.clerk.com
2. Copy these keys:
   - Publishable Key (`pk_test_...`)
   - Secret Key (`sk_test_...`)

### Step 2: Deploy to Vercel

1. Go to https://vercel.com/dashboard
2. Import `lukishere/v0-vanguard` from GitHub
3. Add environment variables:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth?mode=signup
   ```
4. Deploy

### Step 3: Configure Webhook

1. Clerk Dashboard → Webhooks → Add Endpoint
2. URL: `https://your-app.vercel.app/api/webhooks/clerk`
3. Event: `user.created`
4. Copy Signing Secret
5. Add to Vercel: `CLERK_WEBHOOK_SECRET=whsec_...`
6. Redeploy

### Step 4: Authorize Domain

1. Clerk Dashboard → Domains
2. Add: `https://your-app.vercel.app`

### Step 5: Create Admin User

```bash
pnpm tsx scripts/make-admin.ts your@email.com
```

## ✅ Verification Checklist

- [ ] Site loads without errors
- [ ] Can register new user
- [ ] New user can login
- [ ] User sees `/dashboard`
- [ ] Admin sees `/admin`
- [ ] Webhook receives events
- [ ] Metadata auto-initializes

## 🔧 Common Issues

| Issue               | Solution                 |
| ------------------- | ------------------------ |
| 401 Unauthorized    | Add Clerk env vars       |
| Webhook not working | Check URL and secret     |
| Login error         | Verify domain authorized |
| No metadata         | Configure webhook        |
| Build fails         | Remove `vercel.json`     |

## 📚 Next Steps

- [Full Vercel Setup](./vercel-setup.md)
- [Clerk Configuration](../authentication/clerk-setup.md)
- [User Management](../authentication/user-management.md)

