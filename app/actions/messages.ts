"use server"

import { revalidatePath } from "next/cache"
import { auth, clerkClient } from "@clerk/nextjs/server"
import fs from "fs/promises"
import path from "path"

export type MessagePriority = "normal" | "important" | "urgent"

export interface AdminMessage {
  id: string
  clientId: string
  clientName: string
  subject: string
  content: string
  priority: MessagePriority
  sentAt: string
  sentBy: string
  sentByName: string
  read: boolean
  readAt?: string
}

// Persistencia con archivos JSON
const DATA_DIR = path.join(process.cwd(), ".data")
const MESSAGES_FILE = path.join(DATA_DIR, "admin-messages.json")

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    // Ignorar si ya existe
  }
}

async function loadMessages(): Promise<Map<string, AdminMessage>> {
  try {
    const data = await fs.readFile(MESSAGES_FILE, "utf-8")
    const obj = JSON.parse(data)
    return new Map(Object.entries(obj))
  } catch (error) {
    // Si el archivo no existe, retornar Map vacío
    return new Map()
  }
}

async function saveMessages(messages: Map<string, AdminMessage>) {
  await ensureDataDir()
  const obj = Object.fromEntries(messages)
  await fs.writeFile(MESSAGES_FILE, JSON.stringify(obj, null, 2), "utf-8")
}

// Enviar mensaje a un cliente
export async function sendMessageToClient(
  clientId: string,
  subject: string,
  content: string,
  priority: MessagePriority = "normal"
) {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: "Usuario no autenticado" }
  }

  try {
    const messages = await loadMessages()

    // Obtener información del cliente desde Clerk
    const clerk = await clerkClient()
    const clientUser = await clerk.users.getUser(clientId)
    const clientName = `${clientUser.firstName || ''} ${clientUser.lastName || ''}`.trim() ||
                       clientUser.username ||
                       clientUser.emailAddresses[0]?.emailAddress ||
                       'Cliente'

    // Obtener información del admin que envía
    const adminUser = await clerk.users.getUser(userId)
    const adminName = `${adminUser.firstName || ''} ${adminUser.lastName || ''}`.trim() ||
                      adminUser.username ||
                      'Admin'

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const message: AdminMessage = {
      id: messageId,
      clientId,
      clientName,
      subject,
      content,
      priority,
      sentAt: new Date().toISOString(),
      sentBy: userId,
      sentByName: adminName,
      read: false,
    }

    messages.set(messageId, message)
    await saveMessages(messages)

    console.log("📨 [Admin Message] Mensaje enviado:", {
      messageId,
      de: adminName,
      para: clientName,
      asunto: subject,
      prioridad: priority,
    })

    revalidatePath("/admin/clientes")
    revalidatePath("/dashboard")

    return { success: true, messageId }
  } catch (error) {
    console.error("Error al enviar mensaje:", error)
    return { success: false, error: "Error al enviar el mensaje" }
  }
}

// Obtener mensajes de un cliente específico
export async function getClientMessages(clientId: string): Promise<AdminMessage[]> {
  const messages = await loadMessages()
  return Array.from(messages.values())
    .filter(msg => msg.clientId === clientId)
    .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
}

// Contar mensajes no leídos de un cliente
export async function getUnreadCount(clientId: string): Promise<number> {
  const messages = await getClientMessages(clientId)
  return messages.filter(msg => !msg.read).length
}

// Marcar mensaje como leído
export async function markMessageAsRead(messageId: string) {
  try {
    const messages = await loadMessages()
    const message = messages.get(messageId)

    if (!message) {
      return { success: false, error: "Mensaje no encontrado" }
    }

    message.read = true
    message.readAt = new Date().toISOString()
    messages.set(messageId, message)
    await saveMessages(messages)

    console.log("✓ [Admin Message] Mensaje marcado como leído:", messageId)

    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error al marcar mensaje como leído:", error)
    return { success: false, error: "Error al marcar mensaje" }
  }
}

// Marcar todos los mensajes de un cliente como leídos
export async function markAllAsRead(clientId: string) {
  try {
    const messages = await loadMessages()
    let updatedCount = 0

    for (const [id, message] of messages.entries()) {
      if (message.clientId === clientId && !message.read) {
        message.read = true
        message.readAt = new Date().toISOString()
        messages.set(id, message)
        updatedCount++
      }
    }

    if (updatedCount > 0) {
      await saveMessages(messages)
      console.log(`✓ [Admin Message] ${updatedCount} mensajes marcados como leídos para ${clientId}`)
    }

    revalidatePath("/dashboard")

    return { success: true, count: updatedCount }
  } catch (error) {
    console.error("Error al marcar todos como leídos:", error)
    return { success: false, error: "Error al marcar mensajes" }
  }
}

// Eliminar mensaje
export async function deleteMessage(messageId: string) {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: "Usuario no autenticado" }
  }

  try {
    const messages = await loadMessages()
    const deleted = messages.delete(messageId)

    if (!deleted) {
      return { success: false, error: "Mensaje no encontrado" }
    }

    await saveMessages(messages)

    console.log("🗑️ [Admin Message] Mensaje eliminado:", messageId)

    revalidatePath("/admin/clientes")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error al eliminar mensaje:", error)
    return { success: false, error: "Error al eliminar mensaje" }
  }
}
