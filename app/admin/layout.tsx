import type { ReactNode } from "react"
import { AdminLayoutClient } from "@/components/admin/admin-layout-client"

export const metadata = {
  title: "Panel de Administración | Vanguard-IA",
  description: "Gestiona clientes, demos y recursos del portal de Vanguard-IA.",
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
