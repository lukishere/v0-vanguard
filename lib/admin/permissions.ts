import type { User } from '@clerk/nextjs/server'

export type VanguardRole = 'admin' | 'client' | 'user'

const ADMIN_ROLE: VanguardRole = 'admin'

interface MetadataCarrier {
  publicMetadata?: Record<string, unknown>
  privateMetadata?: Record<string, unknown>
}

function readRole(source?: Record<string, unknown>): VanguardRole | null {
  if (!source) return null

  const value = source.role
  if (!value || typeof value !== 'string') return null

  // Normalize to lowercase for comparison
  const normalizedValue = value.toLowerCase().trim()

  // Check valid roles
  if (normalizedValue === 'admin') return 'admin'
  if (normalizedValue === 'client') return 'client'
  if (normalizedValue === 'user') return 'user'

  return null
}

export function getUserRole(
  user: (MetadataCarrier & Partial<User>) | null | undefined
): VanguardRole | null {
  if (!user) return null

  const publicRole = readRole(user.publicMetadata)
  if (publicRole) return publicRole

  const privateRole = readRole(user.privateMetadata)
  if (privateRole) return privateRole

  return null
}

export function isAdmin(user: (MetadataCarrier & Partial<User>) | null | undefined): boolean {
  return getUserRole(user) === ADMIN_ROLE
}

export function getRoleFromSessionClaims(
  claims: SessionClaims | null | undefined
): VanguardRole | null {
  if (!claims) return null

  // Try different possible locations for role in session claims
  // According to Clerk docs, it might be in claims.metadata.role
  const metadataRole = readRole((claims as any).metadata as Record<string, unknown>)
  if (metadataRole) return metadataRole

  // Or in publicMetadata.role
  const publicRole = readRole(claims.publicMetadata as Record<string, unknown>)
  if (publicRole) return publicRole

  // Or directly in claims
  const directRole = readRole(claims as Record<string, unknown>)
  if (directRole) return directRole

  // Or in privateMetadata.role
  const privateRole = readRole(claims.privateMetadata as Record<string, unknown>)
  if (privateRole) return privateRole

  return null
}

export function isAdminFromSessionClaims(claims: SessionClaims | null | undefined): boolean {
  return getRoleFromSessionClaims(claims) === ADMIN_ROLE
}
