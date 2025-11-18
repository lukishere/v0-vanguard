import type { Demo, ClientDemoAccess } from "./types"

export function calculateDaysRemaining(expiresAt: string | undefined): number | null {
  if (!expiresAt) return null

  const expiryDate = new Date(expiresAt)
  const now = new Date()

  // Calcular diferencia en días de manera más simple y confiable
  const diffTime = expiryDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // Log solo para demos próximas a expirar (desarrollo)
  if (process.env.NODE_ENV === 'development' && diffDays <= 7 && diffDays > 0) {
    console.log(`🔍 [Demo] "${expiresAt?.split('T')[0]}" expira en ${diffDays} días`)
  }

  return diffDays > 0 ? diffDays : 0
}

export function calculateUsagePercentage(usageDays: number, totalDays: number): number {
  if (totalDays === 0) return 0
  return Math.round((usageDays / totalDays) * 100)
}

export function formatDaysRemaining(days: number | null): string {
  if (days === null) return "Sin fecha de expiración"
  if (days === 0) return "Expira hoy"
  if (days === 1) return "Expira mañana"
  if (days < 7) return `Expira en ${days} días`
  if (days < 30) return `Expira en ${days} días`
  return `Expira en ${Math.floor(days / 30)} meses`
}

export function getExpirationStatus(daysRemaining: number | null): "safe" | "warning" | "critical" | "expired" {
  if (daysRemaining === null) return "safe"
  if (daysRemaining === 0) return "expired"
  if (daysRemaining <= 3) return "critical"
  if (daysRemaining <= 7) return "warning"
  return "safe"
}

export function enrichDemoWithAccess(demo: Demo, access?: ClientDemoAccess): Demo {
  if (!access) return demo

  // Verificar si la demo ha expirado
  const isExpired = access.daysRemaining !== null && access.daysRemaining <= 0

  return {
    ...demo,
    status: isExpired ? "expired" : "active", // Cambiar a "expired" si ha expirado
    assignedAt: access.assignedAt,
    expiresAt: access.expiresAt,
    daysRemaining: access.daysRemaining,
    usageDays: access.usageDays,
    totalDays: access.totalDays,
    sessionsCount: access.sessionsCount,
    lastUsedAt: access.lastUsedAt,
  }
}

export function shouldShowConversionBanner(daysRemaining: number | null): boolean {
  if (daysRemaining === null) return false
  return daysRemaining <= 7 && daysRemaining > 0
}
