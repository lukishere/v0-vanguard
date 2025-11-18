import { Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getClientMetadataFromUser } from "@/lib/admin/clerk-metadata"
import { getAllDemos } from "@/lib/demos/catalog"
import { clerkClient } from "@clerk/nextjs/server"
import { ClientTable } from "@/components/admin/client-table"
import { getClientActivityStats } from "@/app/actions/client-activities"

// Force dynamic rendering since this page uses server-side authentication
export const dynamic = 'force-dynamic'

async function getClients() {
  const demos = await getAllDemos()

  try {
    // Obtener usuarios reales de Clerk
    const clerk = await clerkClient()
    const users = await clerk.users.getUserList({
      limit: 200,
      orderBy: "-created_at"
    })

    // Filtrar usuarios: mostrar todos EXCEPTO admins
    const clients = await Promise.all(
      users.data
        .filter((user) => {
          const metadata = getClientMetadataFromUser(user)
          return metadata.role !== "admin"
        })
        .map(async (user) => {
          const metadata = getClientMetadataFromUser(user)

          // Obtener última actividad del sistema de actividades del dashboard
          let lastActive: string | null = null
          try {
            const activityStats = await getClientActivityStats(user.id)
            if (activityStats.lastActivity) {
              lastActive = activityStats.lastActivity.timestamp
            }
          } catch (activityError) {
            console.warn(`No se pudieron obtener actividades para usuario ${user.id}:`, activityError)
          }

          // Si no hay actividad en el dashboard, usar lastActiveAt de Clerk como fallback
          if (!lastActive && user.lastActiveAt) {
            lastActive = new Date(user.lastActiveAt).toISOString()
          }

          return {
            id: user.id,
            name: user.fullName ?? user.username ?? user.emailAddresses.at(0)?.emailAddress ?? "Usuario",
            email: user.emailAddresses.at(0)?.emailAddress ?? null,
            metadata,
            lastActive,
          }
        })
    )

    return { clients, demos }
  } catch (error) {
    console.error('Error al obtener clientes de Clerk:', error)
    return { clients: [], demos }
  }
}

export default async function AdminClientsPage() {
  const { clients, demos } = await getClients()

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Gestión de clientes</h2>
        <p className="text-sm text-white/60">
          Asigna o revoca acceso a demos, revisa su actividad reciente y controla la experiencia del portal de clientes.
        </p>
      </header>

      <Card className="border-gray-200 bg-white/80 text-gray-900 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Users className="h-5 w-5 text-vanguard-blue" />
            Clientes activos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ClientTable clients={clients} demos={demos} />
        </CardContent>
      </Card>
    </div>
  )
}
