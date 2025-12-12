import type { User } from "@clerk/nextjs/server"

export type VanguardRole = "admin" | "client"

type MetadataCarrier = {
  publicMetadata?: Record<string, unknown>
  privateMetadata?: Record<string, unknown>
  unsafeMetadata?: Record<string, unknown>
}

type SessionClaims = {
  metadata?: Record<string, unknown>
  [key: string]: unknown
}

const ROLE_KEY = "role"
const ADMIN_ROLE: VanguardRole = "admin"

function readRole(source?: Record<string, unknown>): VanguardRole | null {
  if (!source) return null
  const value = source[ROLE_KEY]
  return typeof value === "string" ? (value as VanguardRole) : null
}

export function getUserRole(user: (MetadataCarrier & Partial<User>) | null | undefined): VanguardRole | null {
  if (!user) return null

  const publicRole = readRole(user.publicMetadata)
  if (publicRole) return publicRole

  const privateRole = readRole(user.privateMetadata)
  if (privateRole) return privateRole

  const unsafeRole = readRole(user.unsafeMetadata)
  if (unsafeRole) return unsafeRole

  return null
}

export function isAdmin(user: (MetadataCarrier & Partial<User>) | null | undefined): boolean {
  return getUserRole(user) === ADMIN_ROLE
}

export function getRoleFromSessionClaims(claims: SessionClaims | null | undefined): VanguardRole | null {
  if (!claims) return null

  const metadataRole = readRole(claims.metadata)
  if (metadataRole) return metadataRole

  const directRole = readRole(claims as Record<string, unknown>)
  if (directRole) return directRole

  return null
}

export function isAdminFromSessionClaims(claims: SessionClaims | null | undefined): boolean {
  return getRoleFromSessionClaims(claims) === ADMIN_ROLE
}




