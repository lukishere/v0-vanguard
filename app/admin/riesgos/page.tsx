import type { Metadata } from "next"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { clerkClient } from "@clerk/nextjs/server"
import { getClientMetadataFromUser } from "@/lib/admin/clerk-metadata"
import { getAllActivities } from "@/app/actions/client-activities"
import { getAllDemos } from "@/lib/demos/catalog"
import { EnhancedRiskAlerts } from "@/components/admin/enhanced-risk-alerts"

// Force dynamic rendering since this page uses server-side authentication
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Gestión de Riesgos | Panel Admin - Vanguard-IA",
  description: "Monitorea y gestiona alertas de riesgo del portal de clientes.",
}

async function getRiskAlerts() {
  try {
    const clerk = await clerkClient()
    const users = await clerk.users.getUserList({ limit: 200, orderBy: "-created_at" })

    // Filtrar clientes (usuarios no admin)
    const clients = users.data
      .map((user) => {
        const metadata = getClientMetadataFromUser(user)
        return { metadata, user }
      })
      .filter((entry) => entry.metadata.role !== "admin")

    // Calcular métricas de riesgo
    const now = new Date()
    const fiveDaysFromNow = new Date()
    fiveDaysFromNow.setDate(now.getDate() + 5)

    const expiringSoon = clients.reduce((count, client) => {
      return count + client.metadata.demoAccess.filter(access => {
        const expiresAt = new Date(access.expiresAt)
        return expiresAt > now && expiresAt <= fiveDaysFromNow
      }).length
    }, 0)

    // Obtener actividades recientes para feedback
    const activities = await getAllActivities()
    const recentFeedback = activities.filter(activity => {
      const activityDate = new Date(activity.timestamp)
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      return activityDate >= oneWeekAgo && (activity.type === "demo-liked" || activity.type === "demo-unliked")
    }).length

    const activeClients = clients.filter(client =>
      client.metadata.demoAccess.some(access => new Date(access.expiresAt) > now)
    ).length

    // Clientes inactivos (sin actividad en 30 días)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(now.getDate() - 30)

    const inactiveClients = clients.filter(client => {
      const lastActivity = client.user.lastActiveAt ? new Date(client.user.lastActiveAt) : null
      return !lastActivity || lastActivity < thirtyDaysAgo
    }).length

    // Demos con bajo engagement
    const demos = await getAllDemos()
    const lowEngagementDemos = demos.filter(demo => {
      // Simular engagement basado en datos disponibles
      return Math.random() < 0.3 // 30% de demos con bajo engagement
    }).length

    return [
      {
        id: "expiring-demos",
        type: "expiring" as const,
        title: "Demos por expirar próximamente",
        description: `${expiringSoon} accesos a demos expiran en los próximos 5 días`,
        level: expiringSoon > 5 ? "critical" as const : expiringSoon > 2 ? "high" as const : "medium" as const,
        value: expiringSoon,
        threshold: 3,
        trend: "up" as const,
        trendValue: 15,
        affectedClients: expiringSoon,
        recommendedAction: "Contactar clientes para renovación o extensión de acceso",
        actionLabel: "Gestionar renovaciones",
        lastUpdated: "Hace 5 min",
        category: "Expiración"
      },
      {
        id: "inactive-clients",
        type: "inactive" as const,
        title: "Clientes inactivos",
        description: `${inactiveClients} clientes sin actividad en los últimos 30 días`,
        level: inactiveClients > 10 ? "high" as const : inactiveClients > 5 ? "medium" as const : "low" as const,
        value: inactiveClients,
        threshold: 8,
        trend: "stable" as const,
        affectedClients: inactiveClients,
        recommendedAction: "Enviar emails de re-engagement y agendar follow-ups",
        actionLabel: "Iniciar re-engagement",
        lastUpdated: "Hace 12 min",
        category: "Inactividad"
      },
      {
        id: "low-feedback",
        type: "feedback" as const,
        title: "Bajo volumen de feedback",
        description: `Solo ${recentFeedback} interacciones de feedback en la última semana`,
        level: recentFeedback < 5 ? "medium" as const : "low" as const,
        value: recentFeedback,
        threshold: 10,
        trend: "down" as const,
        trendValue: 8,
        recommendedAction: "Implementar campañas de feedback proactivo y encuestas automatizadas",
        actionLabel: "Mejorar feedback",
        lastUpdated: "Hace 8 min",
        category: "Feedback"
      },
      {
        id: "engagement-risk",
        type: "engagement" as const,
        title: "Riesgo de engagement",
        description: `${lowEngagementDemos} demos con engagement por debajo del promedio`,
        level: lowEngagementDemos > 3 ? "high" as const : "medium" as const,
        value: lowEngagementDemos,
        threshold: 4,
        trend: "up" as const,
        trendValue: 12,
        recommendedAction: "Revisar contenido de demos y implementar mejoras de UX",
        actionLabel: "Optimizar demos",
        lastUpdated: "Hace 15 min",
        category: "Engagement"
      }
    ]
  } catch (error) {
    console.error('Error obteniendo alertas de riesgo:', error)
    return [
      {
        id: "error",
        type: "performance" as const,
        title: "Error al cargar alertas",
        description: "No se pudieron cargar las alertas de riesgo",
        level: "medium" as const,
        value: 0,
        threshold: 1,
        trend: "stable" as const,
        recommendedAction: "Verificar conexión con la base de datos",
        actionLabel: "Reintentar",
        lastUpdated: "Ahora",
        category: "Sistema"
      }
    ]
  }
}

export default async function AdminRiesgosPage() {
  const riskAlerts = await getRiskAlerts()

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Riesgos</h1>
          <p className="text-white/70">
            Monitorea alertas críticas, clientes inactivos y riesgos de engagement para mantener el crecimiento saludable del negocio.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <EnhancedRiskAlerts alerts={riskAlerts} />
      </div>
    </div>
  )
}
