"use server"

import { revalidatePath } from "next/cache"
import { auth, clerkClient } from "@clerk/nextjs/server"
import fs from "fs/promises"
import path from "path"
import { upsertClientDemoAccess } from "@/lib/admin/clerk-metadata"
import { sendMessageToClient } from "@/app/actions/messages"
import type { ClientDemoAccess } from "@/lib/demos/types"

export type DemoRequestStatus = "pending" | "approved" | "rejected"

export interface DemoRequest {
  id: string
  clientId: string
  clientName: string
  clientEmail: string
  demoId: string
  demoName: string
  status: DemoRequestStatus
  requestedAt: string
  message?: string
  processedAt?: string
  processedBy?: string
}

// Persistencia con archivos JSON
const DATA_DIR = path.join(process.cwd(), ".data")
const REQUESTS_FILE = path.join(DATA_DIR, "demo-requests.json")

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    // Ignorar si ya existe
  }
}

async function loadRequests(): Promise<Map<string, DemoRequest>> {
  try {
    const data = await fs.readFile(REQUESTS_FILE, "utf-8")
    const obj = JSON.parse(data)
    return new Map(Object.entries(obj))
  } catch (error) {
    // Si el archivo no existe, retornar Map vacío
    return new Map()
  }
}

async function saveRequests(requests: Map<string, DemoRequest>) {
  await ensureDataDir()
  const obj = Object.fromEntries(requests)
  await fs.writeFile(REQUESTS_FILE, JSON.stringify(obj, null, 2), "utf-8")
}

export async function requestDemoAccess(demoId: string, demoName: string, message?: string) {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: "Usuario no autenticado" }
  }

  try {
    const requestsStore = await loadRequests()

    // Verificar si ya existe una solicitud pendiente
    const existingRequest = Array.from(requestsStore.values()).find(
      req => req.clientId === userId && req.demoId === demoId && req.status === "pending"
    )

    if (existingRequest) {
      return { success: false, error: "Ya tienes una solicitud pendiente para esta demo", requestId: existingRequest.id }
    }

    // Obtener información del cliente desde Clerk
    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId)

    const clientName = `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
                       user.username ||
                       user.emailAddresses[0]?.emailAddress ||
                       'Cliente'
    const clientEmail = user.emailAddresses[0]?.emailAddress || ''

    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const request: DemoRequest = {
      id: requestId,
      clientId: userId,
      clientName,
      clientEmail,
      demoId,
      demoName,
      status: "pending",
      requestedAt: new Date().toISOString(),
      message,
    }

    requestsStore.set(requestId, request)
    await saveRequests(requestsStore)

    const pendingCount = Array.from(requestsStore.values()).filter(r => r.status === "pending").length

    console.log("📋 [Demo Request] Nueva solicitud:", {
      requestId,
      cliente: clientName,
      email: clientEmail,
      demo: demoName,
      mensaje: message,
      totalPendientes: pendingCount
    })

    revalidatePath("/admin/solicitudes")
    revalidatePath("/admin")
    revalidatePath("/dashboard")

    return { success: true, requestId }
  } catch (error) {
    console.error("Error al solicitar demo:", error)
    return { success: false, error: "Error al procesar la solicitud" }
  }
}

export async function getPendingRequests(): Promise<DemoRequest[]> {
  const requestsStore = await loadRequests()
  return Array.from(requestsStore.values())
    .filter(req => req.status === "pending")
    .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())
}

export async function getAllRequests(): Promise<DemoRequest[]> {
  const requestsStore = await loadRequests()
  return Array.from(requestsStore.values())
    .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())
}

export async function getClientRequests(clientId: string): Promise<DemoRequest[]> {
  const requestsStore = await loadRequests()
  return Array.from(requestsStore.values())
    .filter(req => req.clientId === clientId)
    .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())
}

export async function approveRequest(requestId: string, durationDays: number = 30) {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: "Usuario no autenticado" }
  }

  const requestsStore = await loadRequests()
  const request = requestsStore.get(requestId)

  if (!request) {
    return { success: false, error: "Solicitud no encontrada" }
  }

  if (request.status !== "pending") {
    return { success: false, error: "Esta solicitud ya fue procesada" }
  }

  try {
    // Actualizar estado de la solicitud
    request.status = "approved"
    request.processedAt = new Date().toISOString()
    request.processedBy = userId
    requestsStore.set(requestId, request)
    await saveRequests(requestsStore)

    // Asignar acceso real a la demo en Clerk
    const now = new Date()
    const expiresAt = new Date(now)
    expiresAt.setDate(expiresAt.getDate() + durationDays)

    // Calcular días restantes correctamente
    const daysRemaining = Math.max(1, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

    const demoAccess: ClientDemoAccess = {
      demoId: request.demoId,
      assignedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      daysRemaining: daysRemaining,
      usageDays: 0,
      totalDays: durationDays,
      sessionsCount: 0,
    }

    await upsertClientDemoAccess(request.clientId, demoAccess)

    // Enviar mensaje automático al cliente notificando la aprobación
    const messageSubject = `¡Tu demo de "${request.demoName}" ha sido aprobada!`
    const messageContent = `¡Hola ${request.clientName}!

Tu solicitud para acceder a la demo "${request.demoName}" ha sido aprobada.

📅 **Detalles del acceso:**
- Demo: ${request.demoName}
- Duración: ${durationDays} días
- Fecha de expiración: ${expiresAt.toLocaleDateString('es-ES', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})}

⏰ **Próximos pasos:**
- Ve a tu dashboard y haz clic en "Abrir Demo" para comenzar
- Explora todas las funcionalidades disponibles
- Si necesitas más tiempo, puedes solicitar una extensión

¿Tienes alguna pregunta? No dudes en contactarnos.

¡Bienvenido a Vanguard-IA!

Equipo de Soporte`

    const messageResult = await sendMessageToClient(
      request.clientId,
      messageSubject,
      messageContent,
      "important"
    )

    if (!messageResult.success) {
      console.warn("⚠️ No se pudo enviar el mensaje de notificación al cliente:", messageResult.error)
    }

    console.log("✅ [Demo Request] Solicitud aprobada y acceso asignado:", {
      requestId,
      cliente: request.clientName,
      email: request.clientEmail,
      demo: request.demoName,
      días: durationDays,
      expira: expiresAt.toISOString(),
      mensajeEnviado: messageResult.success,
    })

    revalidatePath("/admin/solicitudes")
    revalidatePath("/admin")
    revalidatePath("/admin/clientes")
    revalidatePath("/dashboard")

    return { success: true, request }
  } catch (error) {
    console.error("Error al aprobar solicitud:", error)
    return { success: false, error: "Error al aprobar la solicitud" }
  }
}

export async function rejectRequest(requestId: string, reason?: string) {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: "Usuario no autenticado" }
  }

  const requestsStore = await loadRequests()
  const request = requestsStore.get(requestId)

  if (!request) {
    return { success: false, error: "Solicitud no encontrada" }
  }

  if (request.status !== "pending") {
    return { success: false, error: "Esta solicitud ya fue procesada" }
  }

  try {
    request.status = "rejected"
    request.processedAt = new Date().toISOString()
    request.processedBy = userId
    request.message = reason
    requestsStore.set(requestId, request)
    await saveRequests(requestsStore)

    console.log("❌ [Demo Request] Solicitud rechazada:", {
      requestId,
      cliente: request.clientName,
      demo: request.demoName,
      razón: reason,
    })

    revalidatePath("/admin/solicitudes")
    revalidatePath("/admin")
    revalidatePath("/dashboard")

    return { success: true, request }
  } catch (error) {
    console.error("Error al rechazar solicitud:", error)
    return { success: false, error: "Error al rechazar la solicitud" }
  }
}
