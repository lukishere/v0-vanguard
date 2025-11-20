# User Management

## 👥 User Roles

### Available Roles

- **admin**: Full access to admin panel and management features
- **user**: Access to client dashboard and assigned demos

## 🔧 Managing Users

### Make User Admin

```bash
pnpm tsx scripts/make-admin.ts user@example.com
```

### Make User Client

```bash
pnpm tsx scripts/make-client.ts user@example.com
```

### Manual Configuration (Clerk Dashboard)

1. Go to https://dashboard.clerk.com
2. Users → Select user
3. Metadata → Public Metadata
4. Edit JSON:

**For Admin:**

```json
{
  "role": "admin",
  "demoAccess": []
}
```

**For User:**

```json
{
  "role": "user",
  "demoAccess": []
}
```

## 📊 Demo Access Management

### Assign Demo Access

Demo access is managed through `publicMetadata.demoAccess`:

```json
{
  "role": "user",
  "demoAccess": [
    {
      "demoId": "automata-rrhh",
      "assignedAt": "2024-01-01T00:00:00.000Z",
      "expiresAt": "2024-12-31T23:59:59.000Z",
      "daysRemaining": 365,
      "usageDays": 0,
      "totalDays": 365,
      "sessionsCount": 0
    }
  ]
}
```

### Via Admin Panel

1. Login as admin
2. Go to `/admin/clientes`
3. Select user
4. Assign/revoke demo access

### Via API

```typescript
import { upsertClientDemoAccess } from "@/lib/admin/clerk-metadata";

await upsertClientDemoAccess(userId, {
  demoId: "automata-rrhh",
  assignedAt: new Date().toISOString(),
  expiresAt: new Date("2024-12-31").toISOString(),
  daysRemaining: 365,
  usageDays: 0,
  totalDays: 365,
  sessionsCount: 0,
});
```

## 🔄 Automatic Initialization

### New User Flow

1. User registers via Clerk
2. Webhook triggers `/api/webhooks/clerk`
3. System creates metadata:
   ```json
   {
     "role": "user",
     "demoAccess": [],
     "lastActivity": "2024-01-01T00:00:00.000Z"
   }
   ```
4. User can login and access dashboard

### Backup Initialization

If webhook fails, `proxy.ts` initializes metadata on first protected route access.

## 🚫 Access Control

### Route Protection Matrix

| Route        | Public | User | Admin |
| ------------ | ------ | ---- | ----- |
| `/`          | ✅     | ✅   | ✅    |
| `/dashboard` | ❌     | ✅   | ❌\*  |
| `/admin`     | ❌     | ❌\* | ✅    |
| `/clientes`  | ✅     | ✅   | ✅    |

\*Automatically redirected to appropriate dashboard

### Redirect Logic

- Admin accessing `/dashboard` → `/admin`
- User accessing `/admin` → `/dashboard`
- Unauthenticated accessing protected → `/sign-in`

## 📋 User Metadata Schema

```typescript
interface ClientPublicMetadata {
  role: "admin" | "user";
  demoAccess: ClientDemoAccess[];
  lastActivity?: string;
  customContent?: Record<string, unknown>;
}

interface ClientDemoAccess {
  demoId: string;
  assignedAt: string;
  expiresAt: string;
  daysRemaining: number;
  usageDays: number;
  totalDays: number;
  sessionsCount: number;
}
```

## 🔍 Querying Users

### Get User Metadata

```typescript
import { getClientPublicMetadata } from "@/lib/admin/clerk-metadata";

const metadata = await getClientPublicMetadata(userId);
console.log(metadata.role); // 'admin' | 'user'
console.log(metadata.demoAccess); // Array of demo access
```

### Check User Role

```typescript
import { isAdmin } from "@/lib/admin/permissions";
import { currentUser } from "@clerk/nextjs/server";

const user = await currentUser();
if (isAdmin(user)) {
  // User is admin
}
```

## 🛠️ Utility Functions

### Update Last Activity

```typescript
import { updateUserActivity } from "@/lib/admin/clerk-metadata";

await updateUserActivity(userId);
```

### Remove Demo Access

```typescript
import { removeClientDemoAccess } from "@/lib/admin/clerk-metadata";

await removeClientDemoAccess(userId, "automata-rrhh");
```

## 📚 Related Files

- `lib/admin/clerk-metadata.ts` - Metadata management
- `lib/admin/permissions.ts` - Permission checking
- `scripts/make-admin.ts` - Admin creation script
- `scripts/make-client.ts` - Client creation script
- `app/api/webhooks/clerk/route.ts` - Webhook handler
