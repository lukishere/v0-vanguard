import { NextRequest, NextResponse } from "next/server"
import { getDashboardMetrics } from "@/app/admin/page"
import { getRecentActivities } from "@/app/admin/page"

// This is a workaround since we can't import server functions directly
// We'll recreate the logic here
async function getDashboardMetricsData() {
  try {
    // Obtener datos reales
    const { getAllDemos } = await import("@/lib/demos/catalog")
    const { clerkClient } = await import("@clerk/nextjs/server")
    const { getClientMetadataFromUser } = await import("@/lib/admin/clerk-metadata")
    const { getAllActivities } = await import("@/app/actions/client-activities")
    const { getAllDemoLikes } = await import("@/app/actions/demo-likes")

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

export async function GET(request: NextRequest) {
  try {
    const metrics = await getDashboardMetricsData()

    return NextResponse.json({
      success: true,
      data: {
        metrics,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error in dashboard refresh API:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to refresh dashboard data'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // This could be used for manual refresh triggers
  try {
    const metrics = await getDashboardMetricsData()

    return NextResponse.json({
      success: true,
      data: {
        metrics,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error in dashboard refresh API:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to refresh dashboard data'
      },
      { status: 500 }
    )
  }
}
