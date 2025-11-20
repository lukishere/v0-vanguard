"use server"

import { revalidatePath } from "next/cache"
import { auth, clerkClient } from "@clerk/nextjs/server"
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

/**
 * NUEVO SISTEMA DE PERSISTENCIA - Clerk privateMetadata
 * 
 * Las solicitudes se almacenan en el privateMetadata de un usuario "admin especial"
 * o en una colección centralizada. Para simplificar, usaremos el privateMetadata
 * del primer admin encontrado o crearemos un sistema de almacenamiento global.
 * 
 * Estructura en Clerk:
 * privateMetadata: {
 *   demoRequests: {
 *     [requestId]: DemoRequest
 *   }
 * }
 */

const STORAGE_USER_EMAIL = "demo-requests-storage@vanguard-ia.internal"

/**
 * Obtiene o crea un usuario especial para almacenar las solicitudes de demos
 */
async function getStorageUser() {
  const clerk = await clerkClient()
  
  try {
    // Buscar usuario de almacenamiento
    const users = await clerk.users.getUserList({
      emailAddress: [STORAGE_USER_EMAIL],
    })
    
    if (users.data.length > 0) {
      return users.data[0]
    }
    
    // Si no existe, usar el sistema de metadata global
    // En su lugar, almacenaremos en el privateMetadata de cada usuario individual
    console.log("⚠️ [Demo Requests] Usando almacenamiento distribuido por usuario")
    return null
  } catch (error) {
    console.error("❌ [Demo Requests] Error obteniendo usuario de almacenamiento:", error)
    return null
  }
}

/**
 * Carga todas las solicitudes desde Clerk metadata
 * Busca en todos los usuarios con rol admin para encontrar solicitudes almacenadas
 */
async function loadRequests(): Promise<Map<string, DemoRequest>> {
  const clerk = await clerkClient()
  const allRequests = new Map<string, DemoRequest>()
  
  try {
    // Obtener todos los usuarios para buscar solicitudes en sus privateMetadata
    const users = await clerk.users.getUserList({ limit: 500 })
    
    for (const user of users.data) {
      const metadata = user.privateMetadata as any
      const userRequests = metadata?.demoRequests || {}
      
      // Agregar solicitudes de este usuario al mapa global
      for (const [requestId, request] of Object.entries(userRequests)) {
        allRequests.set(requestId, request as DemoRequest)
      }
    }
    
    return allRequests
  } catch (error) {
    console.error("❌ [Demo Requests] Error cargando solicitudes:", error)
    return new Map()
  }
}

/**
 * Guarda una solicitud en el privateMetadata del usuario que la creó
 */
async function saveRequest(request: DemoRequest) {
  const clerk = await clerkClient()
  
  try {
    // Obtener metadata actual del usuario
    const user = await clerk.users.getUser(request.clientId)
    const metadata = user.privateMetadata as any
    const userRequests = metadata?.demoRequests || {}
    
    // Agregar/actualizar la solicitud
    userRequests[request.id] = request
    
    // Guardar en Clerk
    await clerk.users.updateUser(request.clientId, {
      privateMetadata: {
        ...metadata,
        demoRequests: userRequests,
      },
    })
    
    console.log("✅ [Demo Requests] Solicitud guardada en Clerk:", request.id)
  } catch (error) {
    console.error("❌ [Demo Requests] Error guardando solicitud:", error)
    throw error
  }
}

export async function requestDemoAccess(demoId: string, demoName: string, message?: string) {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: "Usuario no autenticado" }
  }

  try {
    // Obtener información del cliente desde Clerk
    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId)
    
    // Verificar si ya existe una solicitud pendiente en el privateMetadata del usuario
    const metadata = user.privateMetadata as any
    const userRequests = metadata?.demoRequests || {}
    
    const existingRequest = Object.values(userRequests).find(
      (req: any) => req.demoId === demoId && req.status === "pending"
    )

    if (existingRequest) {
      return { 
        success: false, 
        error: "Ya tienes una solicitud pendiente para esta demo", 
        requestId: (existingRequest as DemoRequest).id 
      }
    }

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

    // Guardar solicitud en Clerk privateMetadata del usuario
    await saveRequest(request)

    console.log("📋 [Demo Request] Nueva solicitud guardada en Clerk:", {
      requestId,
      cliente: clientName,
      email: clientEmail,
      demo: demoName,
      mensaje: message,
    })

    revalidatePath("/admin/solicitudes")
    revalidatePath("/admin")
    revalidatePath("/dashboard")

    return { success: true, requestId }
  } catch (error) {
    console.error("❌ [Demo Request] Error al solicitar demo:", error)
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
    
    // Guardar en Clerk privateMetadata del usuario
    await saveRequest(request)

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
    
    // Guardar en Clerk privateMetadata del usuario
    await saveRequest(request)

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
