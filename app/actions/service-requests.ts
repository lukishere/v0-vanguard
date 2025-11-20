"use server"

import { revalidatePath } from "next/cache"
import { auth, clerkClient } from "@clerk/nextjs/server"

export type ServiceRequestType = "contract" | "extend"

export interface ServiceRequest {
  id: string
  clientId: string
  clientName: string
  clientEmail: string
  type: ServiceRequestType
  message?: string
  requestedAt: string
  demoId?: string
  demoName?: string
  currentExpiration?: string
  contactPreference?: string
}

// Solicitar contratación de servicio usando Clerk metadata
export async function requestServiceContract(message: string, contactPreference?: string, demoId?: string) {
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
    const clientEmail = user.emailAddresses[0]?.emailAddress || ''

    const requestId = `srv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const request: ServiceRequest = {
      id: requestId,
      clientId: userId,
      clientName,
      clientEmail,
      type: "contract",
      message: `${message}${contactPreference ? `\n\nPreferencia de contacto: ${contactPreference}` : ''}`,
      requestedAt: new Date().toISOString(),
      demoId,
      contactPreference,
    }

    // Store in user metadata
    const serviceRequests = (metadata.serviceRequests || []) as ServiceRequest[]
    serviceRequests.push(request)

    await clerk.users.updateUser(userId, {
      publicMetadata: {
        ...metadata,
        serviceRequests,
      },
    })

    console.log("🚀 [Service Request] Solicitud de contratación:", {
      requestId,
      cliente: clientName,
      email: clientEmail,
    })

    revalidatePath("/admin")

    return { success: true, requestId }
  } catch (error) {
    console.error("Error al solicitar contratación:", error)
    return { success: false, error: "Error al procesar la solicitud" }
  }
}

// Solicitar extensión de demo usando Clerk metadata
export async function requestDemoExtension(demoId: string, demoName: string, currentExpiration: string, reason?: string) {
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
    const clientEmail = user.emailAddresses[0]?.emailAddress || ''

    const requestId = `ext_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const request: ServiceRequest = {
      id: requestId,
      clientId: userId,
      clientName,
      clientEmail,
      type: "extend",
      message: reason || "Solicitud de extensión de demo",
      requestedAt: new Date().toISOString(),
      demoId,
      demoName,
      currentExpiration,
    }

    // Store in user metadata
    const serviceRequests = (metadata.serviceRequests || []) as ServiceRequest[]
    serviceRequests.push(request)

    await clerk.users.updateUser(userId, {
      publicMetadata: {
        ...metadata,
        serviceRequests,
      },
    })

    console.log("⏰ [Service Request] Solicitud de extensión:", {
      requestId,
      cliente: clientName,
      demo: demoName,
      expiraEn: currentExpiration,
    })

    revalidatePath("/admin")

    return { success: true, requestId }
  } catch (error) {
    console.error("Error al solicitar extensión:", error)
    return { success: false, error: "Error al procesar la solicitud" }
  }
}

// Obtener todas las solicitudes de servicio (para admin)
export async function getAllServiceRequests(): Promise<ServiceRequest[]> {
  try {
    const clerk = await clerkClient()
    const users = await clerk.users.getUserList({ limit: 500 })
    const allRequests: ServiceRequest[] = []

    for (const user of users.data) {
      const metadata = (user.publicMetadata || {}) as any
      const serviceRequests = (metadata.serviceRequests || []) as ServiceRequest[]
      allRequests.push(...serviceRequests)
    }

    return allRequests.sort((a, b) =>
      new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
    )
  } catch (error) {
    console.error("Error getting all service requests:", error)
    return []
  }
}

// Obtener solicitudes de un cliente
export async function getClientServiceRequests(clientId: string): Promise<ServiceRequest[]> {
  try {
    const clerk = await clerkClient()
    const user = await clerk.users.getUser(clientId)
    const metadata = (user.publicMetadata || {}) as any
    const serviceRequests = (metadata.serviceRequests || []) as ServiceRequest[]

    return serviceRequests.sort((a, b) =>
      new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
    )
  } catch (error) {
    console.error("Error getting client service requests:", error)
    return []
  }
}
