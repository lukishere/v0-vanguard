"use server"

import { auth, clerkClient } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export type MeetingMilestoneType =
  | "demo-call"
  | "technical-session"
  | "contract-review"
  | "onboarding-session"
  | "follow-up"
  | "training"
  | "support-call"

export interface MeetingMilestone {
  id: string
  clientId: string
  clientName?: string
  type: MeetingMilestoneType
  title: string
  description?: string
  scheduledFor?: string
  completedAt?: string
  notes?: string
  demoId?: string
  demoName?: string
  createdAt: string
  updatedAt: string
}

// Crear un nuevo milestone de reunión usando Clerk metadata
export async function createMeetingMilestone(
  type: MeetingMilestoneType,
  title: string,
  description?: string,
  scheduledFor?: string,
  demoId?: string,
  demoName?: string
) {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: "Usuario no autenticado" }
  }

  try {
    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId)
    const metadata = (user.publicMetadata || {}) as any

    const clientName = `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
                       user.username ||
                       user.emailAddresses[0]?.emailAddress ||
                       'Cliente'

    const milestoneId = `mtg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const milestone: MeetingMilestone = {
      id: milestoneId,
      clientId: userId,
      clientName,
      type,
      title,
      description,
      scheduledFor,
      demoId,
      demoName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const meetingMilestones = (metadata.meetingMilestones || []) as MeetingMilestone[]
    meetingMilestones.push(milestone)

    await clerk.users.updateUser(userId, {
      publicMetadata: {
        ...metadata,
        meetingMilestones,
      },
    })

    console.log("📅 [Meeting Milestone] Creado:", {
      id: milestoneId,
      type,
      title,
      cliente: clientName,
    })

    revalidatePath("/admin")
    revalidatePath("/dashboard")

    return { success: true, milestoneId, milestone }
  } catch (error) {
    console.error("Error al crear milestone:", error)
    return { success: false, error: "Error al crear milestone" }
  }
}

// Marcar un milestone como completado
export async function completeMeetingMilestone(milestoneId: string, notes?: string) {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: "Usuario no autenticado" }
  }

  try {
    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId)
    const metadata = (user.publicMetadata || {}) as any
    const meetingMilestones = (metadata.meetingMilestones || []) as MeetingMilestone[]

    const milestoneIndex = meetingMilestones.findIndex(m => m.id === milestoneId)

    if (milestoneIndex === -1) {
      return { success: false, error: "Milestone no encontrado" }
    }

    meetingMilestones[milestoneIndex].completedAt = new Date().toISOString()
    meetingMilestones[milestoneIndex].updatedAt = new Date().toISOString()
    if (notes) {
      meetingMilestones[milestoneIndex].notes = notes
    }

    await clerk.users.updateUser(userId, {
      publicMetadata: {
        ...metadata,
        meetingMilestones,
      },
    })

    console.log("✅ [Meeting Milestone] Completado:", { milestoneId })

    revalidatePath("/admin")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error al completar milestone:", error)
    return { success: false, error: "Error al completar milestone" }
  }
}

// Obtener todos los milestones de reuniones (para admin)
export async function getAllMeetingMilestones(): Promise<MeetingMilestone[]> {
  try {
    const clerk = await clerkClient()
    const users = await clerk.users.getUserList({ limit: 500 })
    const allMilestones: MeetingMilestone[] = []

    for (const user of users.data) {
      const metadata = (user.publicMetadata || {}) as any
      const meetingMilestones = (metadata.meetingMilestones || []) as MeetingMilestone[]
      allMilestones.push(...meetingMilestones)
    }

    return allMilestones.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  } catch (error) {
    console.error("Error getting all meeting milestones:", error)
    return []
  }
}

// Obtener milestones de un cliente
export async function getClientMeetingMilestones(clientId?: string): Promise<MeetingMilestone[]> {
  try {
    const { userId: currentUserId } = await auth()
    const targetUserId = clientId || currentUserId

    if (!targetUserId) {
      return []
    }

    const clerk = await clerkClient()
    const user = await clerk.users.getUser(targetUserId)
    const metadata = (user.publicMetadata || {}) as any
    const meetingMilestones = (metadata.meetingMilestones || []) as MeetingMilestone[]

    return meetingMilestones.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  } catch (error) {
    console.error("Error getting client meeting milestones:", error)
    return []
  }
}

// Eliminar un milestone
export async function deleteMeetingMilestone(milestoneId: string) {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: "Usuario no autenticado" }
  }

  try {
    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId)
    const metadata = (user.publicMetadata || {}) as any
    const meetingMilestones = (metadata.meetingMilestones || []) as MeetingMilestone[]

    const filteredMilestones = meetingMilestones.filter(m => m.id !== milestoneId)

    if (filteredMilestones.length === meetingMilestones.length) {
      return { success: false, error: "Milestone no encontrado" }
    }

    await clerk.users.updateUser(userId, {
      publicMetadata: {
        ...metadata,
        meetingMilestones: filteredMilestones,
      },
    })

    console.log("🗑️ [Meeting Milestone] Eliminado:", { milestoneId })

    revalidatePath("/admin")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error al eliminar milestone:", error)
    return { success: false, error: "Error al eliminar milestone" }
  }
}

// Solicitar una reunión (usado desde el modal de reunión)
export async function requestMeetingMilestone(
  meetingType: string,
  productType: string,
  preferredDate: string,
  preferredTime: string,
  notes?: string
) {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: "Usuario no autenticado" }
  }

  try {
    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId)
    const metadata = (user.publicMetadata || {}) as any

    const clientName = `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
                       user.username ||
                       user.emailAddresses[0]?.emailAddress ||
                       'Cliente'

    // Map meeting type to milestone type
    const typeMap: Record<string, MeetingMilestoneType> = {
      demo: "demo-call",
      consultation: "technical-session",
      implementation: "onboarding-session",
    }

    const milestoneType = typeMap[meetingType] || "demo-call"
    const title = `${meetingType === "demo" ? "Demo" : meetingType === "consultation" ? "Consulta" : "Implementación"} - ${productType}`
    const scheduledFor = `${preferredDate}T${preferredTime}:00`

    const milestoneId = `mtg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const milestone: MeetingMilestone = {
      id: milestoneId,
      clientId: userId,
      clientName,
      type: milestoneType,
      title,
      description: notes,
      scheduledFor,
      demoName: productType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const meetingMilestones = (metadata.meetingMilestones || []) as MeetingMilestone[]
    meetingMilestones.push(milestone)

    await clerk.users.updateUser(userId, {
      publicMetadata: {
        ...metadata,
        meetingMilestones,
      },
    })

    console.log("📅 [Meeting Request] Reunión solicitada:", {
      id: milestoneId,
      type: milestoneType,
      title,
      cliente: clientName,
      scheduledFor,
    })

    revalidatePath("/admin")
    revalidatePath("/dashboard")

    return { success: true, milestoneId, milestone }
  } catch (error) {
    console.error("❌ [Meeting Request] Error al solicitar reunión:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al procesar la solicitud" 
    }
  }
}

// Obtener milestones del usuario actual (alias para compatibilidad)
export async function getMyMeetingMilestones(): Promise<MeetingMilestone[]> {
  return await getClientMeetingMilestones()
}

// Admin: Crear milestone para un cliente específico
export async function adminCreateMilestone(
  clientId: string,
  type: MeetingMilestoneType,
  title: string,
  description?: string,
  scheduledFor?: string,
  demoId?: string,
  demoName?: string
) {
  try {
    const clerk = await clerkClient()
    const user = await clerk.users.getUser(clientId)
    const metadata = (user.publicMetadata || {}) as any

    const milestoneId = `mtg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const milestone: MeetingMilestone = {
      id: milestoneId,
      clientId,
      clientName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.emailAddresses[0]?.emailAddress || 'Cliente',
      type,
      title,
      description,
      scheduledFor,
      demoId,
      demoName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const meetingMilestones = (metadata.meetingMilestones || []) as MeetingMilestone[]
    meetingMilestones.push(milestone)

    await clerk.users.updateUser(clientId, {
      publicMetadata: {
        ...metadata,
        meetingMilestones,
      },
    })

    console.log("📅 [Admin] Milestone creado para cliente:", {
      id: milestoneId,
      clientId,
      type,
      title,
    })

    revalidatePath("/admin")
    revalidatePath("/dashboard")

    return { success: true, milestoneId, milestone }
  } catch (error) {
    console.error("Error al crear milestone (admin):", error)
    return { success: false, error: "Error al crear milestone" }
  }
}

// Admin: Actualizar milestone de un cliente
export async function adminUpdateMilestone(
  clientId: string,
  milestoneId: string,
  updates: Partial<MeetingMilestone>
) {
  try {
    const clerk = await clerkClient()
    const user = await clerk.users.getUser(clientId)
    const metadata = (user.publicMetadata || {}) as any
    const meetingMilestones = (metadata.meetingMilestones || []) as MeetingMilestone[]

    const milestoneIndex = meetingMilestones.findIndex(m => m.id === milestoneId)

    if (milestoneIndex === -1) {
      return { success: false, error: "Milestone no encontrado" }
    }

    meetingMilestones[milestoneIndex] = {
      ...meetingMilestones[milestoneIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    await clerk.users.updateUser(clientId, {
      publicMetadata: {
        ...metadata,
        meetingMilestones,
      },
    })

    console.log("✏️ [Admin] Milestone actualizado:", { clientId, milestoneId })

    revalidatePath("/admin")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error al actualizar milestone (admin):", error)
    return { success: false, error: "Error al actualizar milestone" }
  }
}

// Admin: Enviar notificación a un cliente (placeholder)
export async function adminSendNotification(
  clientId: string,
  title: string,
  message: string
) {
  try {
    // Esta función puede implementarse con un sistema de notificaciones real
    // Por ahora, solo la registramos en los logs
    console.log("📬 [Admin] Notificación enviada:", {
      clientId,
      title,
      message,
    })

    return { success: true }
  } catch (error) {
    console.error("Error al enviar notificación:", error)
    return { success: false, error: "Error al enviar notificación" }
  }
}
