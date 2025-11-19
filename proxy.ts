import { NextResponse } from 'next/server'
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { getRoleFromSessionClaims } from '@/lib/admin/permissions'

const isPublicRoute = createRouteMatcher([
  '/',
  '/about',
  '/about/',
  '/services',
  '/services/',
  '/events',
  '/events/',
  '/contact',
  '/contact/',
  '/faq',
  '/faq/',
  '/privacy',
  '/privacy/',
  '/terms',
  '/terms/',
  '/auth(.*)',
  '/clientes(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api(.*)', // API routes are handled separately
])

const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isDashboardRoute = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware(async (auth, req) => {
  // Get auth data using await auth() (recommended approach)
  const { userId, sessionClaims } = await auth()

  // Initialize metadata for new users
  if (userId && sessionClaims) {
    const publicMetadata = sessionClaims.publicMetadata as Record<string, unknown> | undefined;
    
    // If user has no role, initialize with default metadata
    if (!publicMetadata?.role) {
      try {
        const { clerkClient } = await import("@clerk/nextjs/server");
        const client = await clerkClient();
        
        // Set default user role and empty demoAccess
        await client.users.updateUser(userId, {
          publicMetadata: {
            role: "user",
            demoAccess: [],
            lastActivity: new Date().toISOString(),
          },
        });
        
        console.log(`✅ [Proxy] Initialized metadata for new user: ${userId}`);
      } catch (error) {
        console.error("❌ [Proxy] Failed to initialize user metadata:", error);
      }
    }
  }

  // Get user role from session claims
  const userRole = getRoleFromSessionClaims(sessionClaims)
  const isUserAdmin = userRole === 'admin'

  // 🚫 BLOQUEO: Redirigir admins que intentan acceder a /dashboard
  if (isDashboardRoute(req) && userId && isUserAdmin) {
    console.log('🚫 [Proxy] Admin intentando acceder a /dashboard, redirigiendo a /admin')
    const adminUrl = new URL('/admin/', req.url)
    return NextResponse.redirect(adminUrl)
  }

  // Handle admin routes first
  if (isAdminRoute(req)) {
    if (!userId) {
      console.log('[Proxy] Admin route: No userId, redirecting to sign in')
      const signInUrl = new URL('/clientes/', req.url)
      signInUrl.searchParams.set('redirect_url', req.url)
      return NextResponse.redirect(signInUrl)
    }

    console.log('\n🔍 [Proxy] Admin route check for:', req.url)
    console.log('  User ID:', userId)
    console.log('  🎭 Detected role from sessionClaims:', userRole || 'none')

    if (isUserAdmin) {
      console.log('  ✅ ADMIN ACCESS GRANTED - User has admin role in sessionClaims')
      return NextResponse.next()
    }

    // If role is not in sessionClaims, let the layout verify with clerkClient
    // This is a fallback until Clerk Session Token Template is configured
    console.log('  ⚠️ Role not found in sessionClaims')
    console.log('  💡 Letting admin layout verify with clerkClient...')
    console.log('  💡 If this fails, you need to configure Clerk Session Token Template')

    // Allow the request to continue to the layout
    // The layout will do a more thorough check using clerkClient
    return NextResponse.next()
  }

  // Protect non-public routes (dashboard, etc.)
  if (!isPublicRoute(req)) {
    if (!userId) {
      const signInUrl = new URL('/clientes/', req.url)
      signInUrl.searchParams.set('redirect_url', req.url)
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
