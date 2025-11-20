"use server"

import { revalidatePath } from "next/cache"
import { auth, clerkClient } from "@clerk/nextjs/server"
import fs from "fs/promises"
import path from "path"

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
}

// Persistencia con archivos JSON
const DATA_DIR = path.join(process.cwd(), ".data")
const SERVICE_REQUESTS_FILE = path.join(DATA_DIR, "service-requests.json")

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    // Ignorar si ya existe
  }
}

async function loadRequests(): Promise<Map<string, ServiceRequest>> {
  try {
    const data = await fs.readFile(SERVICE_REQUESTS_FILE, "utf-8")
    const obj = JSON.parse(data)
    return new Map(Object.entries(obj))
  } catch (error) {
    return new Map()
  }
}

async function saveRequests(requests: Map<string, ServiceRequest>) {
  await ensureDataDir()
  const obj = Object.fromEntries(requests)
  await fs.writeFile(SERVICE_REQUESTS_FILE, JSON.stringify(obj, null, 2), "utf-8")
}

// Solicitar contratación de servicio
export async function requestServiceContract(message: string, contactPreference?: string, demoId?: string) {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: "Usuario no autenticado" }
  }

  try {
    const requests = await loadRequests()

    // Obtener información del cliente
    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId)

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
    }

    requests.set(requestId, request)
    await saveRequests(requests)

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

// Solicitar extensión de demo
export async function requestDemoExtension(demoId: string, demoName: string, currentExpiration: string, reason?: string) {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: "Usuario no autenticado" }
  }

  try {
    const requests = await loadRequests()

    // Obtener información del cliente
    const clerk = await clerkClient()
    const user = await clerk.users.getUser(userId)

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

    requests.set(requestId, request)
    await saveRequests(requests)

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

// Obtener todas las solicitudes de servicio
export async function getAllServiceRequests(): Promise<ServiceRequest[]> {
  const requests = await loadRequests()
  return Array.from(requests.values())
    .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())
}

// Obtener solicitudes de un cliente
export async function getClientServiceRequests(clientId: string): Promise<ServiceRequest[]> {
  const requests = await loadRequests()
  return Array.from(requests.values())
    .filter(req => req.clientId === clientId)
    .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())
}
