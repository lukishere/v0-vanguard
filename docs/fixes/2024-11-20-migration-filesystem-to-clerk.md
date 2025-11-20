# 🚨 CRITICAL: Migration from Filesystem to Clerk Metadata

**Date:** 2024-11-20  
**Status:** IN PROGRESS  
**Priority:** CRITICAL

---

## 🔥 Problem

ALL user interactions (service requests, demo extensions, activities, likes, messages, meetings, news) are currently stored in filesystem (`.data` folder) which:

1. **Does NOT work in Vercel** (read-only filesystem in production)
2. **Causes ALL buttons to fail silently** in production
3. **Activity tracking doesn't work** (no logs saved)
4. **Onboarding modal repeats** because state isn't persisting

## ❌ Affected Files

```
app/actions/service-requests.ts     → Uses .data/service-requests.json
app/actions/client-activities.ts    → Uses .data/client-activities.json
app/actions/demo-likes.ts           → Uses .data/demo-likes.json
app/actions/messages.ts             → Uses .data/messages.json
app/actions/meeting-milestones.ts   → Uses .data/meeting-milestones.json
app/actions/news.ts                 → Uses .data/news.json
app/actions/demos.ts                → Uses .data/demos.json
```

## ✅ Solution

Migrate to **Clerk `publicMetadata` and `privateMetadata`** for immediate fix:

### Data Architecture

```typescript
// Clerk User Metadata Structure
{
  publicMetadata: {
    role: "client" | "admin",
    onboardingCompleted: boolean,
    companyProfile: {...},
    demoAccess: DemoAccess[],
    
    // NEW: User-specific data
    likedDemos: string[],              // ["demo-1", "demo-2"]
    lastActivity: string,              // ISO timestamp
    serviceRequests: string[],         // ["srv_123", "ext_456"]
    meetingMilestones: MeetingMilestone[]
  },
  
  privateMetadata: {
    // Admin-only data
    internalNotes: string,
    activityLog: ActivityEntry[]      // Last 50 activities
  }
}
```

### Global Admin Data (Separate API Endpoints)

For admin-wide data (all requests, all activities), use:
- **Option A:** Clerk Organization metadata (if using Clerk orgs)
- **Option B:** Firebase Firestore collections
- **Option C:** Vercel KV/Postgres

**Decision:** Use Clerk for per-user data, Firebase for global/admin data.

---

## 🔄 Migration Plan

### Phase 1: User-Specific Data → Clerk Metadata ✅

**Target:** Immediate production fix

1. **Demo Likes** → `publicMetadata.likedDemos: string[]`
2. **Service Requests** → `publicMetadata.serviceRequests: string[]`
3. **Meeting Milestones** → `publicMetadata.meetingMilestones: MeetingMilestone[]`
4. **Activity Tracking** → `privateMetadata.activityLog: ActivityEntry[]`

### Phase 2: Global Admin Data → Firebase Firestore

**Target:** Within 24h

Collections:
```
/serviceRequests/{requestId}
/activities/{activityId}
/news/{newsId}
/messages/{messageId}
```

---

## 🔧 Implementation

### 1. Fix `app/actions/demo-likes.ts`

Before (filesystem):
```typescript
const LIKES_FILE = path.join(DATA_DIR, "demo-likes.json")
```

After (Clerk):
```typescript
export async function toggleDemoLike(demoId: string) {
  const { userId } = await auth();
  if (!userId) return { success: false };
  
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const metadata = user.publicMetadata as any;
  const likedDemos = metadata.likedDemos || [];
  
  const isLiked = likedDemos.includes(demoId);
  const updatedLikes = isLiked
    ? likedDemos.filter(id => id !== demoId)
    : [...likedDemos, demoId];
  
  await clerk.users.updateUser(userId, {
    publicMetadata: {
      ...metadata,
      likedDemos: updatedLikes
    }
  });
  
  return { success: true, isLiked: !isLiked };
}
```

### 2. Fix `app/actions/service-requests.ts`

Use Clerk for user's request IDs, Firebase for request details:

```typescript
// Store request ID in user metadata
await clerk.users.updateUser(userId, {
  publicMetadata: {
    ...metadata,
    serviceRequests: [...(metadata.serviceRequests || []), requestId]
  }
});

// Store full request in Firebase (for admin dashboard)
await setDoc(doc(db, "serviceRequests", requestId), {
  ...request,
  createdAt: serverTimestamp()
});
```

### 3. Fix `app/actions/client-activities.ts`

Store last 50 activities in `privateMetadata`:

```typescript
export async function logActivity(type, description, metadata) {
  const { userId } = await auth();
  if (!userId) return { success: false };
  
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const privateData = user.privateMetadata as any;
  const activities = privateData.activityLog || [];
  
  const newActivity = {
    id: `act_${Date.now()}`,
    type,
    description,
    timestamp: new Date().toISOString(),
    metadata
  };
  
  // Keep last 50 activities
  const updatedActivities = [newActivity, ...activities].slice(0, 50);
  
  await clerk.users.updateUser(userId, {
    privateMetadata: {
      ...privateData,
      activityLog: updatedActivities
    },
    publicMetadata: {
      ...(user.publicMetadata as any),
      lastActivity: newActivity.timestamp
    }
  });
  
  return { success: true };
}
```

---

## 📋 Checklist

### Immediate (Phase 1)
- [ ] Fix `app/actions/demo-likes.ts`
- [ ] Fix `app/actions/service-requests.ts`
- [ ] Fix `app/actions/client-activities.ts`
- [ ] Fix `app/actions/meeting-milestones.ts`
- [ ] Update all components consuming these actions
- [ ] Test in production (Vercel)

### Short-term (Phase 2)
- [ ] Set up Firebase Firestore
- [ ] Create collections schema
- [ ] Migrate admin global data to Firestore
- [ ] Create admin API endpoints for Firestore data
- [ ] Update admin dashboard to fetch from Firestore

---

## 🎯 Success Criteria

- [x] Identify all filesystem-dependent actions
- [ ] Service contract button works in production
- [ ] Demo extension button works in production
- [ ] Activity tracking persists in production
- [ ] Onboarding modal only shows once
- [ ] Meeting request button works
- [ ] "Me interesa" button works
- [ ] Admin can see all service requests

---

## 🚀 Deployment

1. Implement Phase 1 changes
2. Test locally with Clerk
3. Deploy to Vercel preview
4. Validate all buttons work
5. Merge to main
6. Monitor production logs

---

**Next Action:** Start implementing fixes for each action file.

