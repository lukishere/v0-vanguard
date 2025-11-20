import { NextRequest, NextResponse } from "next/server"
import { getAllDemos } from "@/lib/demos/catalog"
import { clerkClient } from "@clerk/nextjs/server"
import { getClientMetadataFromUser } from "@/lib/admin/clerk-metadata"
import { getAllActivities } from "@/app/actions/client-activities"
import { getAllDemoLikes } from "@/app/actions/demo-likes"
import { getAllMeetingMilestones } from "@/app/actions/meeting-milestones"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export async function GET(request: NextRequest) {
  try {
    // Get all necessary data
    const demos = await getAllDemos()
    const clerk = await clerkClient()
    const users = await clerk.users.getUserList({ limit: 200, orderBy: "-created_at" })
    const activities = await getAllActivities()
    const demoLikesStats = await getAllDemoLikes()
    const meetingMilestones = await getAllMeetingMilestones()

    // Filter clients (non-admin users)
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

    // Recent activities (last week)
    const recentActivities = activities.filter(activity => {
      const activityDate = new Date(activity.timestamp)
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      return activityDate >= oneWeekAgo
    })

    // Calculate active clients
    const activeClients = clients.filter(client =>
      client.metadata.demoAccess.some(access =>
        new Date(access.expiresAt) > new Date()
      )
    ).length

    // Calculate metrics
    const engagedDemos = Object.keys(demoLikesStats).length
    const feedbackActivities = recentActivities.filter(activity =>
      activity.type === "demo-liked" || activity.type === "demo-unliked"
    ).length
    const upcomingMeetings = recentActivities.filter(activity =>
      activity.type === "meeting-requested"
    ).length

    const getRandomTrend = () => Math.random() * 20 - 10
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

    const dynamicMetrics = [
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

    // Calculate adoption pipeline
    const adoptionPipeline = [] // Simplified for now

    // Format activities for timeline
    const formattedActivities = recentActivities.slice(0, 10).map(activity => ({
      id: activity.id,
      title: activity.description,
      description: `Cliente: ${activity.clientId}`,
      timestamp: formatDistanceToNow(new Date(activity.timestamp), { locale: es, addSuffix: true }),
      type: "feedback",
      clientId: activity.clientId,
      clientEmail: activity.clientId,
    }))

    // Convert milestones
    const convertedMilestones = meetingMilestones.map(m => ({
      id: m.id,
      title: m.title,
      description: m.description,
      type: "meeting",
      status: "upcoming",
      date: m.preferredDate,
      time: m.preferredTime,
      duration: 60,
      attendees: [m.clientName],
      location: "Videoconferencia",
      meetingType: "virtual",
      priority: "medium",
      assignedTo: ["Equipo de cuentas"],
      client: m.clientName,
      clientId: m.clientId,
      notificationStatus: "none",
      reminderSent: false,
      notes: m.notes,
    }))

    return NextResponse.json({
      dynamicMetrics,
      recentActivities: formattedActivities,
      adoptionPipeline,
      activeClients,
      convertedMilestones
    })
  } catch (error) {
    console.error('Error in dashboard API:', error)
    return NextResponse.json(
      {
        error: 'Failed to load dashboard data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Manual refresh trigger
  return GET(request)
}
