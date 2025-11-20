"use server"

import { revalidatePath } from "next/cache"
import { auth, clerkClient } from "@clerk/nextjs/server"
import fs from "fs/promises"
import path from "path"

export type MeetingType = "demo" | "consultation" | "implementation"
export type MilestoneStatus = "upcoming" | "pending" | "confirmed" | "completed" | "cancelled"

export interface MeetingMilestone {
  id: string
  clientId: string
  clientName: string
  clientEmail: string
  title: string
  description: string
  meetingType: MeetingType
  productType?: string
  preferredDate: string
  preferredTime: string
  status: MilestoneStatus
  notes?: string
  requestedAt: string
  confirmedAt?: string
  completedAt?: string
}

// Persistencia con archivos JSON
const DATA_DIR = path.join(process.cwd(), ".data")
const MILESTONES_FILE = path.join(DATA_DIR, "meeting-milestones.json")

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    // Ignorar si ya existe
  }
}

async function loadMilestones(): Promise<Map<string, MeetingMilestone>> {
  try {
    const data = await fs.readFile(MILESTONES_FILE, "utf-8")
    const obj = JSON.parse(data)
    return new Map(Object.entries(obj))
  } catch (error) {
    return new Map()
  }
}

async function saveMilestones(milestones: Map<string, MeetingMilestone>) {
  await ensureDataDir()
  const obj = Object.fromEntries(milestones)
  await fs.writeFile(MILESTONES_FILE, JSON.stringify(obj, null, 2), "utf-8")
}

// Solicitar una reunión como hito
export async function requestMeetingMilestone(
  meetingType: MeetingType,
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
    const milestones = await loadMilestones()

    // Obtener información del cliente
    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId)

    const clientName = `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
                       user.username ||
                       user.emailAddresses[0]?.emailAddress ||
                       'Cliente'
    const clientEmail = user.emailAddresses[0]?.emailAddress || ''

    const milestoneId = `milestone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const meetingTypeLabels = {
      demo: "Demo guiada",
      consultation: "Consulta",
      implementation: "Discutir implementación"
    }

    const milestone: MeetingMilestone = {
      id: milestoneId,
      clientId: userId,
      clientName,
      clientEmail,
      title: `${meetingTypeLabels[meetingType]} - ${productType}`,
      description: `Petición de ${meetingTypeLabels[meetingType].toLowerCase()} para ${productType}`,
      meetingType,
      productType,
      preferredDate,
      preferredTime,
      status: "pending",
      notes,
      requestedAt: new Date().toISOString(),
    }

    milestones.set(milestoneId, milestone)
    await saveMilestones(milestones)

    console.log("📅 [Meeting Milestone] Nueva petición de reunión:", {
      milestoneId,
      cliente: clientName,
      tipo: meetingType,
      producto: productType,
      fecha: preferredDate,
      hora: preferredTime,
    })

    revalidatePath("/dashboard")

    return { success: true, milestoneId }
  } catch (error) {
    console.error("Error al solicitar reunión:", error)
    return { success: false, error: "Error al procesar la solicitud de reunión" }
  }
}

// Obtener hitos de reuniones del cliente actual
export async function getMyMeetingMilestones(): Promise<MeetingMilestone[]> {
  const { userId } = await auth()

  if (!userId) {
    return []
  }

  const milestones = await loadMilestones()
  return Array.from(milestones.values())
    .filter(milestone => milestone.clientId === userId)
    .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())
}

// Obtener todos los hitos de reuniones (para admin)
export async function getAllMeetingMilestones(): Promise<MeetingMilestone[]> {
  const milestones = await loadMilestones()
  return Array.from(milestones.values())
    .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())
}

// Actualizar estado de un hito (para admin)
export async function updateMilestoneStatus(
  milestoneId: string,
  status: MilestoneStatus,
  confirmedAt?: string,
  completedAt?: string
) {
  try {
    const milestones = await loadMilestones()
    const milestone = milestones.get(milestoneId)

    if (!milestone) {
      return { success: false, error: "Hito no encontrado" }
    }

    milestone.status = status
    if (confirmedAt) milestone.confirmedAt = confirmedAt
    if (completedAt) milestone.completedAt = completedAt

    await saveMilestones(milestones)

    console.log(`📅 [Meeting Milestone] Estado actualizado: ${milestoneId} -> ${status}`)

    revalidatePath("/admin")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error al actualizar estado del hito:", error)
    return { success: false, error: "Error al actualizar el estado" }
  }
}

// Función específica para el admin dashboard que permite actualizar múltiples aspectos del milestone
export async function adminUpdateMilestone(
  milestoneId: string,
  updates: {
    status?: MilestoneStatus
    confirmedAt?: string
    completedAt?: string
    notes?: string
  }
) {
  try {
    const milestones = await loadMilestones()
    const milestone = milestones.get(milestoneId)

    if (!milestone) {
      return { success: false, error: "Hito no encontrado" }
    }

    // Aplicar las actualizaciones
    if (updates.status) milestone.status = updates.status
    if (updates.confirmedAt) milestone.confirmedAt = updates.confirmedAt
    if (updates.completedAt) milestone.completedAt = updates.completedAt
    if (updates.notes !== undefined) milestone.notes = updates.notes

    await saveMilestones(milestones)

    console.log(`📅 [Meeting Milestone] Admin actualizó hito ${milestoneId}:`, updates)

    revalidatePath("/admin")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error al actualizar hito desde admin:", error)
    return { success: false, error: "Error al actualizar el hito" }
  }
}

// Función para enviar notificación por correo
export async function adminSendNotification(milestoneId: string, type: "internal" | "client" = "internal") {
  try {
    const milestones = await loadMilestones()
    const milestone = milestones.get(milestoneId)

    if (!milestone) {
      return { success: false, error: "Hito no encontrado" }
    }

    // Aquí iría la lógica para enviar el correo
    // Por ahora solo simulamos el envío
    console.log(`📧 [Notification] Enviando ${type} para hito ${milestoneId}:`, {
      title: milestone.title,
      client: milestone.clientName,
      email: milestone.clientEmail,
      date: milestone.preferredDate,
      time: milestone.preferredTime
    })

    // Simular envío exitoso
    await new Promise(resolve => setTimeout(resolve, 500))

    return {
      success: true,
      message: `Notificación ${type} enviada exitosamente para ${milestone.title}`
    }
  } catch (error) {
    console.error("Error al enviar notificación:", error)
    return { success: false, error: "Error al enviar notificación" }
  }
}

// Función para crear un nuevo hito desde el admin
export async function adminCreateMilestone(data: {
  title: string
  description: string
  meetingType: MeetingType
  productType?: string
  preferredDate: string
  preferredTime: string
  clientId: string
  clientName: string
  clientEmail: string
  priority?: "low" | "medium" | "high" | "critical"
  notes?: string
}) {
  try {
    const milestones = await loadMilestones()

    const milestoneId = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const milestone: MeetingMilestone = {
      id: milestoneId,
      clientId: data.clientId,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      title: data.title,
      description: data.description,
      meetingType: data.meetingType,
      productType: data.productType,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      status: "confirmed", // Los hitos creados por admin empiezan como confirmados
      notes: data.notes,
      requestedAt: new Date().toISOString(),
      confirmedAt: new Date().toISOString(), // Marcar como confirmado inmediatamente
    }

    milestones.set(milestoneId, milestone)
    await saveMilestones(milestones)

    console.log("📅 [Meeting Milestone] Admin creó nuevo hito:", milestone)

    // Enviar notificación al cliente
    const notificationResult = await adminSendNotification(milestoneId, "client")
    if (!notificationResult.success) {
      console.warn("⚠️ No se pudo enviar notificación al cliente:", notificationResult.error)
    }

    revalidatePath("/admin")
    revalidatePath("/dashboard")

    return { success: true, milestoneId }
  } catch (error) {
    console.error("Error al crear hito desde admin:", error)
    return { success: false, error: "Error al crear el hito" }
  }
}
