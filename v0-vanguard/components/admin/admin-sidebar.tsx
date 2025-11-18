"use client"

import type { ComponentType } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Boxes, BookOpen, BarChart3, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"

type NavItem = {
  href: string
  label: string
  icon: ComponentType<{ className?: string }>
  disabled?: boolean
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/demos", label: "Demos", icon: Boxes },
  { href: "/admin/recursos", label: "Recursos", icon: BookOpen },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings, disabled: true },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex w-72 flex-col border-r border-white/10 bg-slate-950/95 backdrop-blur">
      <div className="flex flex-col gap-6 px-6 py-8">
        <Link href="/dashboard/" className="flex items-center gap-3">
          <Logo className="h-10 w-auto text-white" />
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">Vanguard-IA</p>
            <p className="text-lg font-semibold text-white">Admin Portal</p>
          </div>
        </Link>
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.disabled ? "#" : item.href}
              aria-disabled={item.disabled}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                "border border-transparent",
                item.disabled
                  ? "cursor-not-allowed opacity-40"
                  : isActive
                  ? "bg-white/10 border-white/20 text-white shadow-lg shadow-vanguard-blue/10"
                  : "text-white/60 hover:text-white hover:bg-white/5 hover:border-white/10"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  item.disabled
                    ? "text-white/40"
                    : isActive
                    ? "text-vanguard-blue"
                    : "text-white/50 group-hover:text-vanguard-blue"
                )}
              />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-6 py-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
          <p className="font-semibold text-white">Estados del sistema</p>
          <ul className="mt-3 space-y-2 text-xs">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              API Perplexity
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              API Gemini
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Clerk
            </li>
          </ul>
        </div>
      </div>
    </aside>
  )
}
