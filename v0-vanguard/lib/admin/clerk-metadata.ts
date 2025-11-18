import { clerkClient } from "@clerk/nextjs/server"
import type { User } from "@clerk/nextjs/server"
import type { ClientDemoAccess } from "@/lib/demos/types"
import type { VanguardRole } from "./permissions"
import { getUserRole } from "./permissions"

export type ClientCustomContent = Record<string, unknown>

export interface ClientPublicMetadata {
  role: VanguardRole
  demoAccess: ClientDemoAccess[]
  customContent?: ClientCustomContent
}

const DEFAULT_METADATA: ClientPublicMetadata = {
  role: "client",
  demoAccess: [],
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isClientDemoAccess(value: unknown): value is ClientDemoAccess {
  if (!isRecord(value)) return false

  return (
    typeof value.demoId === "string" &&
    typeof value.assignedAt === "string" &&
    typeof value.expiresAt === "string" &&
    typeof value.daysRemaining === "number" &&
    typeof value.usageDays === "number" &&
    typeof value.totalDays === "number" &&
    typeof value.sessionsCount === "number"
  )
}

function normalizeDemoAccess(value: unknown): ClientDemoAccess[] {
  if (!Array.isArray(value)) return []
  return value.filter(isClientDemoAccess)
}

function normalizeCustomContent(value: unknown): ClientCustomContent | undefined {
  return isRecord(value) ? value : undefined
}

function mergeMetadata(base: ClientPublicMetadata, updates: Partial<ClientPublicMetadata>): ClientPublicMetadata {
  return {
    role: updates.role ?? base.role,
    demoAccess: updates.demoAccess ?? base.demoAccess,
    customContent: updates.customContent ?? base.customContent,
  }
}

export function getClientMetadataFromUser(user: User | null): ClientPublicMetadata {
  if (!user) return { ...DEFAULT_METADATA }

  const metadata = user.publicMetadata ?? {}

  const role = getUserRole(user) ?? DEFAULT_METADATA.role
  const demoAccess = normalizeDemoAccess(metadata.demoAccess)
  const customContent = normalizeCustomContent(metadata.customContent)

  return {
    role,
    demoAccess,
    ...(customContent ? { customContent } : {}),
  }
}

export async function getClientPublicMetadata(userId: string): Promise<ClientPublicMetadata> {
  const user = await (await clerkClient()).users.getUser(userId)
  return getClientMetadataFromUser(user)
}

export async function setClientPublicMetadata(userId: string, metadata: ClientPublicMetadata): Promise<ClientPublicMetadata> {
  await (await clerkClient()).users.updateUserMetadata(userId, {
    publicMetadata: {
      role: metadata.role,
      demoAccess: metadata.demoAccess,
      ...(metadata.customContent ? { customContent: metadata.customContent } : {}),
    },
  })

  return getClientPublicMetadata(userId)
}

export async function updateClientPublicMetadata(
  userId: string,
  updates: Partial<ClientPublicMetadata>
): Promise<ClientPublicMetadata> {
  const current = await getClientPublicMetadata(userId)
  const merged = mergeMetadata(current, updates)
  return setClientPublicMetadata(userId, merged)
}

export async function upsertClientDemoAccess(userId: string, access: ClientDemoAccess): Promise<ClientPublicMetadata> {
  const current = await getClientPublicMetadata(userId)
  const existingIndex = current.demoAccess.findIndex((item) => item.demoId === access.demoId)

  if (existingIndex >= 0) {
    current.demoAccess[existingIndex] = access
  } else {
    current.demoAccess.push(access)
  }

  return setClientPublicMetadata(userId, current)
}

export async function removeClientDemoAccess(userId: string, demoId: string): Promise<ClientPublicMetadata> {
  const current = await getClientPublicMetadata(userId)
  const filtered = current.demoAccess.filter((item) => item.demoId !== demoId)

  return setClientPublicMetadata(userId, {
    ...current,
    demoAccess: filtered,
  })
}

export async function clearClientDemoAccess(userId: string): Promise<ClientPublicMetadata> {
  return setClientPublicMetadata(userId, {
    ...(await getClientPublicMetadata(userId)),
    demoAccess: [],
  })
}

export async function setClientRole(userId: string, role: VanguardRole): Promise<ClientPublicMetadata> {
  const current = await getClientPublicMetadata(userId)
  return setClientPublicMetadata(userId, { ...current, role })
}

export async function ensureClientRole(userId: string, fallbackRole: VanguardRole = "client"): Promise<ClientPublicMetadata> {
  const current = await getClientPublicMetadata(userId)
  if (current.role === fallbackRole) {
    return current
  }
  return setClientPublicMetadata(userId, { ...current, role: fallbackRole })
}
