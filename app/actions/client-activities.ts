"use server"

import { auth } from "@clerk/nextjs/server"
import fs from "fs/promises"
import path from "path"
import type { ActivityType, ClientActivity } from "@/lib/activities/constants"

// Re-export types for convenience
export type { ActivityType, ClientActivity }

const DATA_DIR = path.join(process.cwd(), ".data")
const ACTIVITIES_FILE = path.join(DATA_DIR, "client-activities.json")

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    // Ignorar si ya existe
  }
}

async function loadActivities(): Promise<ClientActivity[]> {
  try {
    const data = await fs.readFile(ACTIVITIES_FILE, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

async function saveActivities(activities: ClientActivity[]) {
  await ensureDataDir()
  await fs.writeFile(ACTIVITIES_FILE, JSON.stringify(activities, null, 2), "utf-8")
}

// Registrar una actividad
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
    const activities = await loadActivities()

    const newActivity: ClientActivity = {
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      clientId: userId,
      type,
      description,
      timestamp: new Date().toISOString(),
      metadata,
    }

    activities.push(newActivity)
    await saveActivities(activities)

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

  const activities = await loadActivities()
  const myActivities = activities
    .filter(act => act.clientId === userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return limit ? myActivities.slice(0, limit) : myActivities
}

// Obtener actividades de un cliente específico (para admin)
export async function getClientActivities(clientId: string): Promise<ClientActivity[]> {
  const activities = await loadActivities()
  return activities
    .filter(act => act.clientId === clientId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

// Obtener todas las actividades (para analytics admin)
export async function getAllActivities(limit?: number): Promise<ClientActivity[]> {
  const activities = await loadActivities()
  const sorted = activities.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return limit ? sorted.slice(0, limit) : sorted
}

// Obtener estadísticas de actividad de un cliente
export async function getClientActivityStats(clientId: string) {
  const activities = await loadActivities()
  const clientActivities = activities.filter(act => act.clientId === clientId)

  const byType: Record<string, number> = {}
  clientActivities.forEach(act => {
    byType[act.type] = (byType[act.type] || 0) + 1
  })

  const last7Days = clientActivities.filter(act => {
    const daysDiff = (Date.now() - new Date(act.timestamp).getTime()) / (1000 * 60 * 60 * 24)
    return daysDiff <= 7
  })

  return {
    total: clientActivities.length,
    byType,
    last7Days: last7Days.length,
    lastActivity: clientActivities.length > 0
      ? clientActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
      : null,
  }
}
