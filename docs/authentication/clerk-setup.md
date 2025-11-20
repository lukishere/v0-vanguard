# Clerk Authentication Setup

## 📋 Initial Configuration

### 1. Create Clerk Application

1. Go to https://dashboard.clerk.com
2. Create new application
3. Select authentication methods (Email, Google, etc.)
4. Copy API keys

### 2. Environment Variables

Add to `.env.local` and Vercel:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

## 🔐 User Roles & Metadata

### Default User Structure

```json
{
  "role": "user",
  "demoAccess": [],
  "lastActivity": "2024-01-01T00:00:00.000Z"
}
```

### Admin User Structure

```json
{
  "role": "admin",
  "demoAccess": []
}
```

### Configure Roles Manually

1. Dashboard → Users → Select user
2. Metadata → Public Metadata
3. Add JSON structure above

### Configure Roles via Scripts

```bash
# Make user admin
pnpm tsx scripts/make-admin.ts user@example.com

# Make user client
pnpm tsx scripts/make-client.ts user@example.com
```

## 🪝 Webhook Configuration (Automatic User Setup)

### 1. Create Webhook Endpoint

1. Clerk Dashboard → Webhooks → Add Endpoint
2. **URL**: `https://your-domain.vercel.app/api/webhooks/clerk`
3. **Events**: Select `user.created`
4. **Copy Signing Secret** (starts with `whsec_`)

### 2. Add Webhook Secret

Add to Vercel environment variables:

```bash
CLERK_WEBHOOK_SECRET=whsec_...
```

### 3. Verify Webhook

- New users automatically get `role: "user"` and `demoAccess: []`
- Check webhook logs in Clerk Dashboard
- Test with new user registration

## 🛡️ Authorize Vercel Domains

### Add Allowed Domains

1. Clerk Dashboard → Domains
2. Add each deployment domain:
   ```
   https://your-app.vercel.app
   https://your-app-git-branch.vercel.app
   http://localhost:3000
   ```

### Important

- Do NOT use wildcards with `https://`
- Add each domain individually
- Include preview deployments if needed

## 🔄 Automatic Metadata Initialization

### Two-Layer System

#### 1. Webhook (Primary)

- Triggers on `user.created`
- Initializes metadata immediately
- Endpoint: `/api/webhooks/clerk/route.ts`

#### 2. Proxy Middleware (Backup)

- Runs on first protected route access
- Only if webhook failed
- File: `proxy.ts`

### How It Works

```
New user registers
  ↓
Webhook initializes metadata
  ↓
User logs in
  ↓
Proxy verifies metadata exists
  ↓
If missing → Initialize and redirect
  ↓
User accesses dashboard
```

## 🎯 Access Control

### Route Protection

- **Public**: `/`, `/about`, `/services`, etc.
- **User**: `/dashboard`, `/clientes`
- **Admin**: `/admin/*`

### Automatic Redirects

- Admin accessing `/dashboard` → Redirected to `/admin`
- User accessing `/admin` → Redirected to `/dashboard`
- Unauthenticated → Redirected to `/sign-in`

## 🔍 Troubleshooting

### Login Errors

- **"Application error during login"**: Check webhook configuration
- **Brief unauthorized access**: Verify proxy.ts excludes auth routes
- **401 on all routes**: Missing environment variables

### Metadata Issues

- **User has no role**: Webhook not configured or failed
- **Role not detected**: Check Session Token Template (optional)
- **Metadata not updating**: Clear browser cache, re-login

### Webhook Issues

- **Not receiving webhooks**: Verify URL is correct and accessible
- **401 on webhook**: Wrong signing secret
- **Webhook timeout**: Check server response time

## 📚 Key Files

- `proxy.ts` - Route protection and metadata initialization
- `app/api/webhooks/clerk/route.ts` - Webhook handler
- `components/clerk-provider-wrapper.tsx` - Clerk provider wrapper
- `lib/admin/permissions.ts` - Role checking utilities
- `lib/admin/clerk-metadata.ts` - Metadata management
