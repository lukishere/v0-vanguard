import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/services",
  "/contact",
  "/faq",
  "/news",
  "/events",
  "/privacy",
  "/terms",
  "/cookies",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/contact",
  "/api/waitlist",
  "/api/news",
  "/api/news/(.*)",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isClientRoute = createRouteMatcher(["/dashboard(.*)", "/clientes(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Protect non-public routes
  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

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
        
        console.log(`✅ [Middleware] Initialized metadata for new user: ${userId}`);
      } catch (error) {
        console.error("❌ [Middleware] Failed to initialize user metadata:", error);
      }
    }
  }

  // Admin route protection
  if (isAdminRoute(req)) {
    const role = sessionClaims?.publicMetadata?.role as string | undefined;
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Client route protection
  if (isClientRoute(req)) {
    const role = sessionClaims?.publicMetadata?.role as string | undefined;
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

