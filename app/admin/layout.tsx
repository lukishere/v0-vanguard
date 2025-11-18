import type { ReactNode } from "react"
import { AdminLayoutClient } from "@/components/admin/admin-layout-client"

// Force dynamic rendering for all admin pages since they use Clerk authentication
export const dynamic = 'force-dynamic'

export const metadata = {
  title: "Panel de Administración | Vanguard-IA",
  description: "Gestiona clientes, demos y recursos del portal de Vanguard-IA.",
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
