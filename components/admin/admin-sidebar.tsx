"use client"

import { useState, type ComponentType } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Boxes, BookOpen, BarChart3, Settings, Bell, Briefcase, ShieldAlert, Newspaper } from "lucide-react"
import { cn } from "@/lib/utils"

type NavItem = {
  href: string
  label: string
  icon: ComponentType<{ className?: string }>
  disabled?: boolean
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/riesgos", label: "Riesgos", icon: ShieldAlert },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/demos", label: "Demos", icon: Boxes },
  { href: "/admin/solicitudes", label: "Solicitudes", icon: Bell },
  { href: "/admin/servicios", label: "Servicios", icon: Briefcase },
  { href: "/admin/recursos", label: "Recursos", icon: BookOpen },
  { href: "/admin/noticias", label: "Noticias y Eventos", icon: Newspaper },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings, disabled: true },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside className={cn(
      "hidden lg:flex flex-col border-r border-white/30 admin-bg-secondary backdrop-blur-xl transition-all duration-300 shadow-2xl",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col gap-6 px-6 py-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center h-12 w-12 rounded-xl admin-card admin-card-hover cursor-pointer group"
            title={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
              <rect width="24" height="24" rx="4" fill="url(#sidebar-icon-grad)" />
              <path d="M7 5h10v2H7V5zm0 3h10v2H7V8zm0 3h6v2H7v-2z" fill="white"/>
              <circle cx="16" cy="15" r="2.5" fill="white"/>
              <defs>
                <linearGradient id="sidebar-icon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </button>
          {!isCollapsed && (
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-white">Vanguard IA</h2>
              <p className="text-xs text-white/60">Panel Admin</p>
            </div>
          )}
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>

      <nav className="flex-1 space-y-2 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.disabled ? "#" : item.href}
              aria-disabled={item.disabled}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                "group flex items-center gap-4 rounded-xl px-4 py-4 text-sm font-semibold transition-all duration-300 relative overflow-hidden",
                isCollapsed && "justify-center px-3 py-3",
                item.disabled
                  ? "cursor-not-allowed opacity-40"
                  : isActive
                  ? "admin-sidebar-active text-white shadow-xl admin-metric-glow"
                  : "text-white/80 hover:text-white admin-sidebar-hover hover:shadow-lg hover:shadow-white/10"
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-admin-info-500/20 via-admin-info-600/20 to-admin-info-700/20 rounded-xl" />
              )}
              <Icon
                className={cn(
                  "h-5 w-5 flex-shrink-0 relative z-10 transition-all duration-300",
                  item.disabled
                    ? "text-white/40"
                    : isActive
                    ? "text-white drop-shadow-lg"
                    : "text-white/70 group-hover:text-white group-hover:scale-110"
                )}
              />
              {!isCollapsed && (
                <span className="relative z-10 truncate">{item.label}</span>
              )}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-admin-info-400 to-admin-info-600 rounded-r-full" />
              )}
            </Link>
          )
        })}
      </nav>

    </aside>
  )
}
