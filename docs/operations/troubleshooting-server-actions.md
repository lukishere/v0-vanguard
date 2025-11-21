# Troubleshooting: Failed to Fetch Error in Server Actions

## Error
```
TypeError: Failed to fetch
at fetchServerAction (webpack-internal:///.../server-action-reducer.js:50:23)
```

## Quick Fix Checklist

### 1. **Ensure Development Server is Running**
```bash
pnpm dev
# or
npm run dev
```
- Server should be running on `http://localhost:3000`
- Check terminal for any startup errors

### 2. **Check Environment Variables**

Create a `.env.local` file in the project root with:

```env
# Clerk Authentication (REQUIRED)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth?mode=signup

# AI Provider Keys (Optional - only needed for chatbot)
GEMINI_API_KEY=your_gemini_key
PERPLEXITY_API_KEY=your_perplexity_key
```

**Important:** Restart your dev server after adding environment variables!

### 3. **Verify Clerk Authentication**

The server action requires authentication. Make sure:
- You have a Clerk account at https://clerk.com
- Your Clerk keys are correctly configured
- You're signed in when testing the chatbot

### 4. **Test Authentication Status**

Add this debug component to check auth:

```tsx
// components/debug-auth.tsx
"use client"
import { useUser } from "@clerk/nextjs"

export function DebugAuth() {
  const { user, isLoaded, isSignedIn } = useUser()

  return (
    <div className="fixed bottom-20 left-6 p-4 bg-black/80 text-white text-xs rounded">
      <p>Loaded: {isLoaded ? "✅" : "❌"}</p>
      <p>Signed In: {isSignedIn ? "✅" : "❌"}</p>
      <p>User ID: {user?.id || "none"}</p>
    </div>
  )
}
```

### 5. **Check Browser Console**

Open Developer Tools (F12) and check:
- Console tab for JavaScript errors
- Network tab for failed requests
- Look for 401 (unauthorized) or 500 (server error) responses

## Common Issues & Solutions

### Issue: "Unauthorized" Error
**Cause:** Not signed in with Clerk
**Solution:**
- Visit `/auth` and authenticate
- Ensure Clerk middleware is not blocking the route

### Issue: API Key Errors
**Cause:** Missing `GEMINI_API_KEY` or `PERPLEXITY_API_KEY`
**Solution:**
- The error is now handled gracefully
- Chatbot will return a fallback message
- Add keys only if you need AI features

### Issue: CORS Errors
**Cause:** Cross-origin request blocked
**Solution:**
- Ensure you're accessing via `localhost:3000` (not IP)
- Check `next.config.mjs` for allowed origins

### Issue: Server Action Not Found
**Cause:** Build cache or routing issue
**Solution:**
```bash
rm -rf .next
pnpm dev
```

## Improved Error Handling

The following improvements were made:

1. ✅ **Server Action** now catches all errors and returns user-friendly messages
2. ✅ **API Providers** log detailed errors to console for debugging
3. ✅ **Authentication** returns helpful message instead of throwing
4. ✅ **Graceful Fallbacks** when AI services are unavailable

## Testing the Fix

1. Start dev server: `pnpm dev`
2. Navigate to `/dashboard` or wherever the chatbot is
3. Open browser console
4. Try sending a message
5. Check console for detailed error logs (if any)

## Need More Help?

Check these files for detailed logs:
- Browser Console (F12)
- Terminal where `pnpm dev` is running
- Look for `[hybridChatAction]`, `[Gemini]`, or `[Perplexity]` prefixes

## Environment Setup Summary

**Minimum Required** (for basic functionality):
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

**Optional** (for full chatbot features):
- `GEMINI_API_KEY` - Get from https://makersuite.google.com/app/apikey
- `PERPLEXITY_API_KEY` - Get from https://www.perplexity.ai/settings/api

**After adding variables:**
```bash
# Kill the dev server (Ctrl+C)
# Restart it
pnpm dev
```
