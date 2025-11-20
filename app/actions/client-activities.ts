"use server"

import { auth, clerkClient } from "@clerk/nextjs/server"
import type { ActivityType, ClientActivity } from "@/lib/activities/constants"

// Re-export types for convenience
export type { ActivityType, ClientActivity }

// Registrar una actividad usando Clerk privateMetadata
export async function logActivity(
  type: ActivityType,
  description: string,
  metadata?: ClientActivity["metadata"]
) {
  const { userId } = await auth()

  if (!userId) {
    console.warn("⚠️ [Activities] Intento de log sin autenticación")
    return { success: false, error: "Usuario no autenticado" }
  }

  try {
    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId)
    const privateData = (user.privateMetadata || {}) as any
    const publicData = (user.publicMetadata || {}) as any
    const activities = (privateData.activityLog || []) as ClientActivity[]

    const newActivity: ClientActivity = {
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      clientId: userId,
      type,
      description,
      timestamp: new Date().toISOString(),
      metadata,
    }

    // Keep last 100 activities per user
    const updatedActivities = [newActivity, ...activities].slice(0, 100)

    await clerk.users.updateUser(userId, {
      privateMetadata: {
        ...privateData,
        activityLog: updatedActivities,
      },
      publicMetadata: {
        ...publicData,
        lastActivity: newActivity.timestamp,
      },
    })

    console.log(`📊 [Activities] ${type}:`, {
      clientId: userId,
      description,
      metadata,
    })

    return { success: true, activityId: newActivity.id }
  } catch (error) {
    console.error("Error al registrar actividad:", error)
    return { success: false, error: "Error al registrar actividad" }
  }
}

// Obtener actividades del cliente actual
export async function getMyActivities(limit?: number): Promise<ClientActivity[]> {
  const { userId } = await auth()

  if (!userId) {
    return []
  }

  try {
    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId)
    const privateData = (user.privateMetadata || {}) as any
    const activities = (privateData.activityLog || []) as ClientActivity[]

    return limit ? activities.slice(0, limit) : activities
  } catch (error) {
    console.error("Error al obtener actividades:", error)
    return []
  }
}

// Obtener todas las actividades (para admin)
export async function getAllActivities(): Promise<ClientActivity[]> {
  try {
    const clerk = await clerkClient()
    const users = await clerk.users.getUserList({ limit: 500 })
    const allActivities: ClientActivity[] = []

    for (const user of users.data) {
      const privateData = (user.privateMetadata || {}) as any
      const activities = (privateData.activityLog || []) as ClientActivity[]
      allActivities.push(...activities)
    }

    // Sort by timestamp descending
    return allActivities.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  } catch (error) {
    console.error("Error al obtener todas las actividades:", error)
    return []
  }
}

// Obtener actividades de un cliente específico (para admin)
export async function getClientActivities(clientId: string): Promise<ClientActivity[]> {
  try {
    const clerk = await clerkClient()
    const user = await clerk.users.getUser(clientId)
    const privateData = (user.privateMetadata || {}) as any
    return (privateData.activityLog || []) as ClientActivity[]
  } catch (error) {
    console.error("Error al obtener actividades del cliente:", error)
    return []
  }
}

// Limpiar actividades antiguas (más de 90 días)
export async function cleanOldActivities() {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: "Usuario no autenticado" }
  }

  try {
    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId)
    const privateData = (user.privateMetadata || {}) as any
    const activities = (privateData.activityLog || []) as ClientActivity[]

    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

    const recentActivities = activities.filter(
      (activity) => new Date(activity.timestamp) > ninetyDaysAgo
    )

    if (recentActivities.length < activities.length) {
      await clerk.users.updateUser(userId, {
        privateMetadata: {
          ...privateData,
          activityLog: recentActivities,
        },
      })

      console.log(`🧹 [Activities] Limpiadas ${activities.length - recentActivities.length} actividades antiguas`)
      return { success: true, cleaned: activities.length - recentActivities.length }
    }

    return { success: true, cleaned: 0 }
  } catch (error) {
    console.error("Error al limpiar actividades:", error)
    return { success: false, error: "Error al limpiar actividades" }
  }
}
