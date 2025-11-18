import type { ComponentType } from "react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar, MessageSquare, ShieldCheck, Users, Briefcase, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MetricsCard } from "@/components/admin/metrics-card"
import { EnhancedActivityTimeline } from "@/components/admin/enhanced-activity-timeline"
import { EnhancedAdoptionPipeline } from "@/components/admin/enhanced-adoption-pipeline"
import { EnhancedMilestonesWrapper } from "@/components/admin/enhanced-milestones-wrapper"
import { DashboardHeader } from "@/components/admin/real-time-status"
import { RealtimeSimulator } from "@/components/admin/realtime-simulator"
import { cn } from "@/lib/utils"
import { getClientMetadataFromUser } from "@/lib/admin/clerk-metadata"
import { getAllDemos } from "@/lib/demos/catalog"
import { clerkClient } from "@clerk/nextjs/server"
import { getAllActivities } from "@/app/actions/client-activities"
import { getAllDemoLikes } from "@/app/actions/demo-likes"
import { getAllMeetingMilestones, type MeetingMilestone } from "@/app/actions/meeting-milestones"

// Force dynamic rendering since this page uses server-side authentication and real-time data
export const dynamic = 'force-dynamic'

// Importar el tipo Milestone del componente EnhancedMilestones
import type { Milestone } from "@/components/admin/enhanced-milestones"

type PipelineStage = {
  id: string
  stage: string
  percentage: number
  description: string
  clients: number
  targetClients: number
  conversionRate: number
  avgTimeInStage: number
  bottleneckRisk: "low" | "medium" | "high"
  predictedGrowth: number
  keyMetrics: {
    sessionsPerClient: number
    feedbackScore: number
    meetingRequests: number
  }
  actions: string[]
}

type DashboardMetric = {
  title: string
  value: string
  helperText?: string
  change?: {
    value: number
    description?: string
  }
  positive?: boolean
  icon: string
  target?: number
  status?: "normal" | "warning" | "critical" | "excellent"
  actionRequired?: boolean
  actionLabel?: string
  onActionClick?: () => void
}

type DashboardActivity = {
  id: string
  title: string
  description: string
  timestamp: string
  type: "feedback" | "meeting" | "access" | "demo"
  clientId: string
  clientEmail: string
  priority?: "high" | "medium" | "low"
  expanded?: boolean
  metadata?: {
    demoName?: string
    feedbackScore?: number
    meetingType?: string
    actionRequired?: boolean
  }
}


async function getAdoptionPipeline(): Promise<PipelineStage[]> {
  try {
    // Obtener datos reales
    const clerk = await clerkClient()
    const users = await clerk.users.getUserList({ limit: 200, orderBy: "-created_at" })

    // Filtrar clientes (usuarios no admin)
    const clients = users.data
      .map((user) => {
        const metadata = getClientMetadataFromUser(user)
        return {
          id: user.id,
          metadata,
          lastActive: user.lastActiveAt,
          createdAt: user.createdAt,
        }
      })
      .filter((entry) => entry.metadata.role !== "admin")

    // Obtener actividades
    const activities = await getAllActivities()
    const demoLikesStats = await getAllDemoLikes()

    // Calcular estadísticas por cliente
    const clientStats = clients.map(client => {
      const clientActivities = activities.filter(a => a.clientId === client.id)
      const hasDemoAccess = client.metadata.demoAccess.some(access =>
        new Date(access.expiresAt) > new Date()
      )
      const daysSinceCreated = Math.floor((Date.now() - new Date(client.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      const recentActivityCount = clientActivities.filter(a => {
        const activityDate = new Date(a.timestamp)
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        return activityDate >= oneWeekAgo
      }).length

      return {
        ...client,
        activities: clientActivities,
        hasDemoAccess,
        daysSinceCreated,
        recentActivityCount,
        meetingRequests: clientActivities.filter(a => a.type === 'meeting-requested').length,
        feedbackScore: clientActivities.filter(a => a.type === 'demo-liked').length > 0 ? 4.5 : 3.8,
      }
    })

    // Calcular métricas por etapa
    const totalClients = clients.length

    // Etapa 1: Descubrimiento (clientes nuevos sin actividad significativa)
    const discoveryClients = clientStats.filter(c =>
      c.daysSinceCreated <= 7 && c.recentActivityCount < 3
    ).length
    const discoveryConversion = totalClients > 0 ? (discoveryClients / totalClients) * 100 : 0

    // Etapa 2: Experimentación guiada (clientes con acceso a demos y actividad moderada)
    const experimentationClients = clientStats.filter(c =>
      c.hasDemoAccess && c.recentActivityCount >= 3 && c.daysSinceCreated <= 30
    ).length
    const experimentationConversion = totalClients > 0 ? (experimentationClients / totalClients) * 100 : 0

    // Etapa 3: Validación de negocio (clientes con reuniones o feedback alto)
    const validationClients = clientStats.filter(c =>
      c.meetingRequests > 0 || c.feedbackScore > 4.2
    ).length
    const validationConversion = totalClients > 0 ? (validationClients / totalClients) * 100 : 0

    // Etapa 4: Implementación (clientes con actividad consistente > 30 días)
    const implementationClients = clientStats.filter(c =>
      c.daysSinceCreated > 30 && c.recentActivityCount >= 5
    ).length
    const implementationConversion = totalClients > 0 ? (implementationClients / totalClients) * 100 : 0

    // Calcular riesgos de cuello de botella
    const avgActivitiesPerClient = clientStats.reduce((sum, c) => sum + c.recentActivityCount, 0) / Math.max(clientStats.length, 1)
    const bottleneckRisk = (conversionRate: number) => {
      if (conversionRate < 30) return "high" as const
      if (conversionRate < 60) return "medium" as const
      return "low" as const
    }

    return [
      {
        id: "discovery",
        stage: "Descubrimiento",
        percentage: Math.min(Math.round(discoveryConversion), 100),
        description: "Clientes explorando demos iniciales",
        clients: discoveryClients,
        targetClients: Math.max(Math.round(totalClients * 0.4), 5),
        conversionRate: discoveryConversion,
        avgTimeInStage: 5,
        bottleneckRisk: bottleneckRisk(discoveryConversion),
        predictedGrowth: 15.2,
        keyMetrics: {
          sessionsPerClient: 1.8,
          feedbackScore: 3.8,
          meetingRequests: clientStats.reduce((sum, c) => sum + c.meetingRequests, 0)
        },
        actions: [
          "Enviar emails de bienvenida personalizados",
          "Ofrecer sesiones de onboarding virtual",
          "Proporcionar guías de inicio rápido"
        ]
      },
      {
        id: "guided-experimentation",
        stage: "Experimentación guiada",
        percentage: Math.min(Math.round(experimentationConversion), 100),
        description: "Sesiones de co-creación en curso",
        clients: experimentationClients,
        targetClients: Math.max(Math.round(totalClients * 0.35), 4),
        conversionRate: experimentationConversion,
        avgTimeInStage: 12,
        bottleneckRisk: bottleneckRisk(experimentationConversion),
        predictedGrowth: 8.7,
        keyMetrics: {
          sessionsPerClient: avgActivitiesPerClient,
          feedbackScore: clientStats.reduce((sum, c) => sum + c.feedbackScore, 0) / Math.max(clientStats.length, 1),
          meetingRequests: clientStats.filter(c => c.meetingRequests > 0).length
        },
        actions: [
          "Aumentar frecuencia de check-ins",
          "Proporcionar soporte técnico dedicado",
          "Crear casos de uso específicos por industria"
        ]
      },
      {
        id: "business-validation",
        stage: "Validación de negocio",
        percentage: Math.min(Math.round(validationConversion), 100),
        description: "Evaluación de ROI y beneficios",
        clients: validationClients,
        targetClients: Math.max(Math.round(totalClients * 0.25), 3),
        conversionRate: validationConversion,
        avgTimeInStage: 18,
        bottleneckRisk: bottleneckRisk(validationConversion),
        predictedGrowth: 5.3,
        keyMetrics: {
          sessionsPerClient: avgActivitiesPerClient * 1.5,
          feedbackScore: 4.2,
          meetingRequests: clientStats.filter(c => c.meetingRequests > 1).length
        },
        actions: [
          "Presentar estudios de caso similares",
          "Ofrecer pruebas piloto extendidas",
          "Desarrollar propuestas de valor cuantificadas"
        ]
      },
      {
        id: "implementation",
        stage: "Implementación",
        percentage: Math.min(Math.round(implementationConversion), 100),
        description: "Despliegue y adopción completa",
        clients: implementationClients,
        targetClients: Math.max(Math.round(totalClients * 0.2), 2),
        conversionRate: implementationConversion,
        avgTimeInStage: 30,
        bottleneckRisk: bottleneckRisk(implementationConversion),
        predictedGrowth: 2.8,
        keyMetrics: {
          sessionsPerClient: avgActivitiesPerClient * 2,
          feedbackScore: 4.5,
          meetingRequests: clientStats.filter(c => c.meetingRequests > 2).length
        },
        actions: [
          "Establecer equipos de soporte dedicados",
          "Crear programas de capacitación avanzada",
          "Implementar dashboards de seguimiento"
        ]
      }
    ]
  } catch (error) {
    console.error("Error calculando embudo de adopción:", error)
    // Retornar datos por defecto en caso de error
    return [
      {
        id: "discovery",
        stage: "Descubrimiento",
        percentage: 75,
        description: "Clientes explorando demos iniciales",
        clients: 15,
        targetClients: 20,
        conversionRate: 75,
        avgTimeInStage: 5,
        bottleneckRisk: "low" as const,
        predictedGrowth: 15.2,
        keyMetrics: { sessionsPerClient: 1.8, feedbackScore: 3.8, meetingRequests: 3 },
        actions: ["Enviar emails de bienvenida", "Sesiones de onboarding", "Guías de inicio"]
      },
      {
        id: "guided-experimentation",
        stage: "Experimentación guiada",
        percentage: 45,
        description: "Sesiones de co-creación en curso",
        clients: 9,
        targetClients: 15,
        conversionRate: 60,
        avgTimeInStage: 12,
        bottleneckRisk: "medium" as const,
        predictedGrowth: 8.7,
        keyMetrics: { sessionsPerClient: 3.2, feedbackScore: 4.1, meetingRequests: 5 },
        actions: ["Check-ins frecuentes", "Soporte técnico", "Casos de uso por industria"]
      },
      {
        id: "business-validation",
        stage: "Validación de negocio",
        percentage: 25,
        description: "Evaluación de ROI y beneficios",
        clients: 5,
        targetClients: 10,
        conversionRate: 50,
        avgTimeInStage: 18,
        bottleneckRisk: "medium" as const,
        predictedGrowth: 5.3,
        keyMetrics: { sessionsPerClient: 4.8, feedbackScore: 4.2, meetingRequests: 8 },
        actions: ["Estudios de caso", "Pruebas piloto", "Propuestas cuantificadas"]
      },
      {
        id: "implementation",
        stage: "Implementación",
        percentage: 10,
        description: "Despliegue y adopción completa",
        clients: 2,
        targetClients: 8,
        conversionRate: 25,
        avgTimeInStage: 30,
        bottleneckRisk: "high" as const,
        predictedGrowth: 2.8,
        keyMetrics: { sessionsPerClient: 6.5, feedbackScore: 4.5, meetingRequests: 12 },
        actions: ["Equipos de soporte", "Capacitación avanzada", "Dashboards de seguimiento"]
      }
    ]
  }
}

async function getDashboardMetrics(): Promise<DashboardMetric[]> {
  try {
    // Obtener datos reales
    const demos = await getAllDemos()
    const clerk = await clerkClient()
    const users = await clerk.users.getUserList({ limit: 200, orderBy: "-created_at" })

    // Filtrar clientes (usuarios no admin)
    const clients = users.data
      .map((user) => {
        const metadata = getClientMetadataFromUser(user)
        return {
          id: user.id,
          metadata,
          lastActive: user.lastActiveAt,
        }
      })
      .filter((entry) => entry.metadata.role !== "admin")

    // Obtener actividades recientes
    const activities = await getAllActivities()
    const recentActivities = activities.filter(activity => {
      const activityDate = new Date(activity.timestamp)
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      return activityDate >= oneWeekAgo
    })

    // Obtener likes de demos
    const demoLikesStats = await getAllDemoLikes()

    // Calcular métricas con lógica mejorada
    const activeClients = clients.filter(client =>
      client.metadata.demoAccess.some(access =>
        new Date(access.expiresAt) > new Date()
      )
    ).length

    // Demos con engagement (que tienen likes o han sido accedidas recientemente)
    const engagedDemos = Object.keys(demoLikesStats).length

    // Actividades de feedback (comentarios o ratings)
    const feedbackActivities = recentActivities.filter(activity =>
      activity.type === "demo-liked" || activity.type === "demo-unliked"
    ).length

    // Próximas reuniones (actividades de meeting)
    const upcomingMeetings = recentActivities.filter(activity =>
      activity.type === "meeting-requested"
    ).length

    // Calcular tendencias (simuladas por ahora - en producción usar datos históricos)
    const getRandomTrend = () => Math.random() * 20 - 10 // -10% a +10%

    // Determinar status basado en valores y objetivos
    const getClientStatus = (count: number) => {
      if (count >= 25) return "excellent"
      if (count >= 15) return "normal"
      if (count >= 8) return "warning"
      return "critical"
    }

    const getEngagementStatus = (count: number) => {
      if (count >= 8) return "excellent"
      if (count >= 5) return "normal"
      if (count >= 2) return "warning"
      return "critical"
    }

    const getFeedbackStatus = (count: number) => {
      if (count >= 15) return "excellent"
      if (count >= 8) return "normal"
      if (count >= 3) return "warning"
      return "critical"
    }

    return [
      {
        title: "Clientes activos",
        value: activeClients.toString(),
        helperText: "Clientes con acceso vigente a demos",
        change: { value: getRandomTrend(), description: "vs semana anterior" },
        positive: activeClients > 10,
        icon: "Users",
        target: 30,
        status: getClientStatus(activeClients),
        actionRequired: activeClients < 15,
        actionLabel: "Ver clientes",
      },
      {
        title: "Demos con engagement",
        value: engagedDemos.toString(),
        helperText: "Demos con interacciones en la última semana",
        change: { value: getRandomTrend(), description: "actividad reciente" },
        positive: engagedDemos > 3,
        icon: "Briefcase",
        target: 12,
        status: getEngagementStatus(engagedDemos),
        actionRequired: engagedDemos < 6,
        actionLabel: "Promocionar",
      },
      {
        title: "Feedback recibido",
        value: feedbackActivities.toString(),
        helperText: "Interacciones de clientes en la última semana",
        change: { value: getRandomTrend(), description: "retroalimentación reciente" },
        positive: feedbackActivities > 5,
        icon: "MessageSquare",
        target: 20,
        status: getFeedbackStatus(feedbackActivities),
        actionRequired: feedbackActivities < 10,
        actionLabel: "Revisar feedback",
      },
      {
        title: "Solicitudes recientes",
        value: upcomingMeetings.toString(),
        helperText: "Solicitudes de reunión en la última semana",
        positive: upcomingMeetings > 0,
        change: { value: getRandomTrend(), description: "requieren atención" },
        icon: "Calendar",
        target: 8,
        status: upcomingMeetings > 3 ? "excellent" : upcomingMeetings > 0 ? "normal" : "warning",
        actionRequired: upcomingMeetings > 0,
        actionLabel: "Gestionar",
      },
    ]
  } catch (error) {
    console.error('Error obteniendo métricas del dashboard:', error)
    // Retornar métricas por defecto en caso de error
    return [
      {
        title: "Clientes activos",
        value: "0",
        helperText: "Error al cargar datos",
        icon: "Users",
        status: "critical",
      },
      {
        title: "Demos con engagement",
        value: "0",
        helperText: "Error al cargar datos",
        icon: "Briefcase",
        status: "critical",
      },
      {
        title: "Feedback recibido",
        value: "0",
        helperText: "Error al cargar datos",
        icon: "MessageSquare",
        status: "critical",
      },
      {
        title: "Solicitudes recientes",
        value: "0",
        helperText: "Error al cargar datos",
        icon: "Calendar",
        status: "critical",
      },
    ]
  }
}

async function getRecentActivities(): Promise<DashboardActivity[]> {
  try {
    const activities = await getAllActivities()

    // Obtener lista de clientes para mapear IDs a emails
    const clerk = await clerkClient()
    const users = await clerk.users.getUserList({ limit: 200, orderBy: "-created_at" })
    const clientEmailMap: Record<string, string> = {}

    users.data.forEach(user => {
      const email = user.emailAddresses.at(0)?.emailAddress
      if (email) {
        clientEmailMap[user.id] = email
      }
    })

    // Tomar las últimas 10 actividades más recientes para mejor timeline
    const recentActivities = activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)

    // Mapear tipos de actividad a los tipos del dashboard
    const typeMapping: Record<string, DashboardActivity['type']> = {
      "demo-requested": "access",
      "waitlist-joined": "access",
      "demo-liked": "feedback",
      "demo-unliked": "feedback",
      "demo-opened": "demo",
      "meeting-requested": "meeting",
      "chat-opened": "feedback",
      "chat-sales": "meeting",
      "service-contracted": "meeting",
      "demo-extended": "demo",
    }

    // Función para determinar prioridad basada en el tipo de actividad
    const getPriority = (type: string, description: string): "high" | "medium" | "low" | undefined => {
      if (type === "meeting-requested") return "high"
      if (type === "demo-requested") return "medium"
      if (description.toLowerCase().includes("urgente") || description.toLowerCase().includes("importante")) return "high"
      return "low"
    }

    // Función para obtener metadatos adicionales
    const getMetadata = (activity: any) => {
      const metadata: any = {}

      // Simular datos adicionales basados en el tipo de actividad
      if (activity.type === "demo-liked" || activity.type === "demo-unliked") {
        metadata.feedbackScore = Math.floor(Math.random() * 5) + 1
        metadata.actionRequired = metadata.feedbackScore < 3
      }

      if (activity.type === "meeting-requested") {
        metadata.meetingType = ["Descubrimiento", "Demo técnica", "Negociación", "Seguimiento"][Math.floor(Math.random() * 4)]
        metadata.actionRequired = true
      }

      if (activity.type === "demo-opened") {
        const demoNames = ["CRM Integration", "Contract Automation", "Digital Signatures", "Document Workflow"]
        metadata.demoName = demoNames[Math.floor(Math.random() * demoNames.length)]
      }

      return Object.keys(metadata).length > 0 ? metadata : undefined
    }

    return recentActivities.map(activity => ({
      id: activity.id,
      title: activity.description.length > 50 ? activity.description.substring(0, 50) + "..." : activity.description,
      description: `Cliente: ${clientEmailMap[activity.clientId] || activity.clientId}`,
      timestamp: formatDistanceToNow(new Date(activity.timestamp), { locale: es, addSuffix: true }),
      type: typeMapping[activity.type] || "feedback",
      clientId: activity.clientId,
      clientEmail: clientEmailMap[activity.clientId] || activity.clientId,
      priority: getPriority(activity.type, activity.description),
      metadata: getMetadata(activity),
    }))
  } catch (error) {
    console.error('Error obteniendo actividades recientes:', error)
    // Retornar actividades por defecto en caso de error
    return [
      {
        id: "1",
        title: "Sistema inicializado",
        description: "Dashboard operativo",
        timestamp: "Ahora",
        type: "feedback",
        clientId: "system",
        clientEmail: "system@vanguard.com",
      },
    ]
  }
}



// Función para convertir MeetingMilestone a Milestone para EnhancedMilestones
function convertMeetingMilestonesToMilestones(meetingMilestones: MeetingMilestone[]): Milestone[] {
  return meetingMilestones.map(meetingMilestone => {
    // Convertir el tipo de reunión al tipo esperado por Milestone
    const milestoneType: "meeting" | "deadline" | "demo" | "presentation" | "review" | "training" = "meeting"

    // Convertir el status del meeting milestone al status esperado por Milestone
    let milestoneStatus: "upcoming" | "today" | "overdue" | "completed"
    const today = new Date().toISOString().split('T')[0]
    const meetingDate = meetingMilestone.preferredDate

    if (meetingMilestone.status === "completed") {
      milestoneStatus = "completed"
    } else if (meetingMilestone.status === "confirmed") {
      milestoneStatus = meetingDate === today ? "today" : "upcoming"
    } else if (meetingMilestone.status === "pending") {
      milestoneStatus = meetingDate < today ? "overdue" : "upcoming"
    } else {
      milestoneStatus = "upcoming"
    }

    // Convertir el tipo de reunión al meetingType esperado
    let meetingType: "in-person" | "virtual" | "phone" | undefined
    switch (meetingMilestone.meetingType) {
      case "demo":
      case "consultation":
      case "implementation":
        meetingType = "virtual" // Por defecto virtual para reuniones de servicio
        break
      default:
        meetingType = "virtual"
    }

    // Determinar prioridad basada en el tipo de reunión
    let priority: "low" | "medium" | "high" | "critical"
    switch (meetingMilestone.meetingType) {
      case "demo":
        priority = "medium"
        break
      case "consultation":
        priority = "high"
        break
      case "implementation":
        priority = "critical"
        break
      default:
        priority = "medium"
    }

    // Determinar el status de notificación
    let notificationStatus: "none" | "pending" | "sent" | "read"
    switch (meetingMilestone.status) {
      case "confirmed":
        notificationStatus = "sent"
        break
      case "completed":
        notificationStatus = "read"
        break
      case "pending":
        notificationStatus = "pending"
        break
      default:
        notificationStatus = "none"
    }

    return {
      id: meetingMilestone.id,
      title: meetingMilestone.title,
      description: meetingMilestone.description,
      type: milestoneType,
      status: milestoneStatus,
      date: meetingMilestone.preferredDate,
      time: meetingMilestone.preferredTime,
      duration: 60, // Duración por defecto de 60 minutos
      attendees: [meetingMilestone.clientName],
      location: meetingType === "virtual" ? "Videoconferencia" : "Por definir",
      meetingType: meetingType,
      priority: priority,
      assignedTo: ["Equipo de cuentas"], // Por defecto asignado al equipo de cuentas
      client: meetingMilestone.clientName,
      clientId: meetingMilestone.clientId,
      notificationStatus: notificationStatus,
      reminderSent: meetingMilestone.status === "confirmed",
      notes: meetingMilestone.notes,
      relatedItems: meetingMilestone.productType ? [
        {
          type: "request" as const,
          id: meetingMilestone.id,
          title: `Solicitud: ${meetingMilestone.productType}`
        }
      ] : undefined
    }
  })
}

async function getDashboardData() {
  const dynamicMetrics = await getDashboardMetrics()
  const recentActivities = await getRecentActivities()
  const adoptionPipeline = await getAdoptionPipeline()

  // Obtener los meeting milestones reales y convertirlos
  const meetingMilestones = await getAllMeetingMilestones()
  const convertedMilestones = convertMeetingMilestonesToMilestones(meetingMilestones)

  // Calcular clientes activos para el embudo
  const clerk = await clerkClient()
  const users = await clerk.users.getUserList({ limit: 200, orderBy: "-created_at" })
  const clients = users.data
    .map((user) => {
      const metadata = getClientMetadataFromUser(user)
      return {
        id: user.id,
        metadata,
        lastActive: user.lastActiveAt,
      }
    })
    .filter((entry) => entry.metadata.role !== "admin")

  const activeClients = clients.filter(client =>
    client.metadata.demoAccess.some(access =>
      new Date(access.expiresAt) > new Date()
    )
  ).length

  return {
    dynamicMetrics,
    recentActivities,
    adoptionPipeline,
    activeClients,
    convertedMilestones
  }
}

export default async function AdminDashboardPage() {
  const { dynamicMetrics, recentActivities, adoptionPipeline, activeClients, convertedMilestones } = await getDashboardData()

  return (
    <div className="space-y-10">
      <DashboardHeader
        title="Resumen ejecutivo"
        description="Visión general de clientes activos, adopción de demos y prioridades para el equipo de cuentas."
        enabled={true}
        interval={60000} // 1 minute refresh
      />

      <section className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dynamicMetrics.map((metric) => (
            <MetricsCard key={metric.title} {...metric} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-3">
          <EnhancedActivityTimeline activities={recentActivities} />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <EnhancedAdoptionPipeline
          stages={adoptionPipeline}
          totalActiveClients={activeClients}
        />

        <EnhancedMilestonesWrapper
          milestones={convertedMilestones}
        />
      </section>

      {/* Realtime Controls */}
      <section className="flex justify-end">
        <RealtimeSimulator />
      </section>
    </div>
  )
}
