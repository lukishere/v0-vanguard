import type { User } from '@clerk/nextjs/server'
import { getUserRole, type VanguardRole } from './permissions'
import type { ClientDemoAccess } from '@/lib/demos/types'
import { calculateDaysRemaining } from '@/lib/demos/utils'

export interface ClientPublicMetadata {
  role: VanguardRole
  demoAccess: ClientDemoAccess[]
  lastActivity?: string // Timestamp ISO de última actividad en la aplicación
  customContent?: Record<string, unknown>
}

const DEFAULT_METADATA: ClientPublicMetadata = {
  role: 'user',
  demoAccess: [],
}

function normalizeDemoAccess(
  access: unknown
): ClientDemoAccess[] {
  if (!Array.isArray(access)) return []

  return access.filter((item): item is ClientDemoAccess => {
    return (
      typeof item === 'object' &&
      item !== null &&
      typeof item.demoId === 'string' &&
      typeof item.assignedAt === 'string' &&
      typeof item.expiresAt === 'string' &&
      typeof item.daysRemaining === 'number' &&
      typeof item.usageDays === 'number' &&
      typeof item.totalDays === 'number' &&
      typeof item.sessionsCount === 'number'
    )
  })
}

function normalizeCustomContent(content: unknown): Record<string, unknown> | undefined {
  if (!content || typeof content !== 'object' || content === null) {
    return undefined
  }
  return content as Record<string, unknown>
}

function mergeMetadata(
  base: ClientPublicMetadata,
  updates: Partial<ClientPublicMetadata>
): ClientPublicMetadata {
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
  const lastActivity = typeof metadata.lastActivity === 'string' ? metadata.lastActivity : undefined
  const customContent = normalizeCustomContent(metadata.customContent)

  return {
    role,
    demoAccess,
    ...(lastActivity ? { lastActivity } : {}),
    ...(customContent ? { customContent } : {}),
  }
}

export async function getClientPublicMetadata(
  userId: string,
  user?: User | null
): Promise<ClientPublicMetadata> {
  // Si ya tenemos el usuario, procesarlo
  if (user) {
    const metadata = getClientMetadataFromUser(user)
    // Recalcular daysRemaining dinámicamente
    const updatedDemoAccess = metadata.demoAccess.map(access => ({
      ...access,
      daysRemaining: calculateDaysRemaining(access.expiresAt) ?? 0
    }))
    return { ...metadata, demoAccess: updatedDemoAccess }
  }

  // Si no, obtenerlo de Clerk
  try {
    // Importar clerkClient dinámicamente para evitar problemas de inicialización
    const { clerkClient } = await import('@clerk/nextjs/server')
    const client = await clerkClient()
    const fetchedUser = await client.users.getUser(userId)
    const metadata = getClientMetadataFromUser(fetchedUser)
    // Recalcular daysRemaining dinámicamente
    const updatedDemoAccess = metadata.demoAccess.map(access => {
      const daysRemaining = calculateDaysRemaining(access.expiresAt) ?? 0

      return {
        ...access,
        daysRemaining: daysRemaining
      }
    })
    return { ...metadata, demoAccess: updatedDemoAccess }
  } catch (error) {
    console.error('Failed to fetch user metadata:', error)
    return { ...DEFAULT_METADATA }
  }
}

export async function setClientPublicMetadata(
  userId: string,
  metadata: ClientPublicMetadata
): Promise<ClientPublicMetadata> {
  try {
    const { clerkClient } = await import('@clerk/nextjs/server')
    const client = await clerkClient()
    const currentUser = await client.users.getUser(userId)
    const currentMetadata = getClientMetadataFromUser(currentUser)
    const merged = mergeMetadata(currentMetadata, metadata)

    await client.users.updateUser(userId, {
      publicMetadata: {
        role: merged.role,
        demoAccess: merged.demoAccess,
        ...(merged.lastActivity ? { lastActivity: merged.lastActivity } : {}),
        ...(merged.customContent ? { customContent: merged.customContent } : {}),
      },
    })

    return merged
  } catch (error) {
    console.error('Failed to update user metadata:', error)
    throw error
  }
}

export async function upsertClientDemoAccess(
  userId: string,
  newAccess: ClientDemoAccess
): Promise<ClientPublicMetadata> {
  const current = await getClientPublicMetadata(userId)
  const existingIndex = current.demoAccess.findIndex(a => a.demoId === newAccess.demoId)

  const updatedAccess = existingIndex >= 0
    ? current.demoAccess.map((a, i) => i === existingIndex ? newAccess : a)
    : [...current.demoAccess, newAccess]

  return setClientPublicMetadata(userId, {
    ...current,
    demoAccess: updatedAccess,
  })
}

export async function removeClientDemoAccess(
  userId: string,
  demoId: string
): Promise<ClientPublicMetadata> {
  const current = await getClientPublicMetadata(userId)
  const updatedAccess = current.demoAccess.filter(a => a.demoId !== demoId)

  return setClientPublicMetadata(userId, {
    ...current,
    demoAccess: updatedAccess,
  })
}

export async function updateUserActivity(
  userId: string,
  activityTimestamp?: string
): Promise<ClientPublicMetadata> {
  const timestamp = activityTimestamp || new Date().toISOString()
  const current = await getClientPublicMetadata(userId)

  return setClientPublicMetadata(userId, {
    ...current,
    lastActivity: timestamp,
  })
}
