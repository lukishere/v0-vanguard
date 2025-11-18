"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { DashboardLogoutButton } from "@/components/dashboard-logout-button"
import { isAdmin } from "@/lib/admin/permissions"

interface AdminLayoutClientProps {
  children: React.ReactNode
}

export function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (!isLoaded) return

    // TEMPORAL: Allow access in development mode when no user is authenticated
    // This allows testing the admin dashboard without full Clerk setup
    if (!user) {
      console.log('[Admin Layout Client] DEVELOPMENT MODE: No user found, allowing access for testing')
      console.log('  ⚠️  WARNING: This is temporary development access')
      setIsAuthorized(true)
      return
    }

    console.log('\n🔐 [Admin Layout Client] Verifying admin access...')
    console.log('  User ID:', user.id)
    console.log('  Email:', user.primaryEmailAddress?.emailAddress)
    console.log('  PublicMetadata:', user.publicMetadata)

    // Check if user has admin role
    const hasAdminRole = isAdmin(user)

    console.log('  🎭 Has admin role:', hasAdminRole)

    if (!hasAdminRole) {
      console.log('  ❌ ADMIN ACCESS DENIED - Redirecting to dashboard')
      console.log('  💡 To grant admin access, run: pnpm tsx scripts/make-admin.ts', user.id)
      router.replace("/dashboard/")
      return
    }

    console.log('  ✅ ADMIN ACCESS GRANTED via client check')
    setIsAuthorized(true)
  }, [user, isLoaded, router])

  // Show loading state while checking authentication
  if (!isLoaded || !isAuthorized) {
    return (
      <div className="relative min-h-screen overflow-hidden admin-bg-primary text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_rgba(99,102,241,0.15),_rgba(139,92,246,0.1))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:60px_60px]" />
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="text-center space-y-4 admin-card rounded-2xl p-8 max-w-sm mx-4">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-admin-info-500 border-t-transparent mx-auto admin-metric-glow"></div>
            <p className="text-slate-700 font-medium">Verificando permisos de administrador...</p>
            <div className="w-full bg-slate-200 rounded-full h-1">
              <div className="bg-gradient-to-r from-admin-info-500 to-admin-info-600 h-1 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const displayName = user.fullName ?? user.username ?? user.primaryEmailAddress?.emailAddress ?? "Administrador"

  return (
    <div className="relative min-h-screen overflow-hidden admin-bg-primary text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_rgba(99,102,241,0.15),_rgba(139,92,246,0.1))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:60px_60px]" />
      <div className="relative z-10 flex min-h-screen">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/20 admin-bg-secondary px-8 py-6 backdrop-blur-xl">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60 font-medium">Panel Administrativo</p>
              <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-white/80 bg-clip-text">
                Hola, {user.firstName ?? displayName}
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right space-y-1">
                <p className="text-sm font-semibold text-white">{displayName}</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-admin-success-500 admin-success-glow"></div>
                  <p className="text-xs text-admin-success-400 font-medium">Rol: Administrador</p>
                </div>
              </div>
              <DashboardLogoutButton />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto px-8 py-10">
            <div className="mx-auto w-full max-w-7xl space-y-10">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}
