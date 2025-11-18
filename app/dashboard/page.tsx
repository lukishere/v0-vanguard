import { getMyActivities } from "@/app/actions/client-activities"
import { getDeletedDemos } from "@/app/actions/demos"
import { getMyMeetingMilestones } from "@/app/actions/meeting-milestones"
import { ClientDashboardWrapper } from "@/components/dashboard/client-dashboard-wrapper"
import { getClientPublicMetadata } from "@/lib/admin/clerk-metadata"
import { isAdmin } from "@/lib/admin/permissions"
import { getAllDemos } from "@/lib/demos/catalog"
import type { Demo } from "@/lib/demos/types"
import { enrichDemoWithAccess } from "@/lib/demos/utils"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Dashboard de Clientes | Vanguard-IA",
  description: "Accede a demos, avances y recursos personalizados como cliente de Vanguard-IA.",
}

export default async function ClientDashboardPage() {
  const user = await currentUser()
  const userId = user?.id ?? ""
  const firstName = user?.firstName ?? "Cliente"

  if (!userId) {
    console.error("🔒 [Dashboard] No authenticated user found, this should be handled by middleware")
    // This should not happen due to middleware protection, but just in case
    redirect("/clientes/")
  }

  // 🔒 BLOQUEO DE ADMINS: Los administradores deben usar /admin
  const userIsAdmin = isAdmin(user)
  console.log("👤 [Dashboard] Usuario:", user?.primaryEmailAddress?.emailAddress)
  console.log("🎭 [Dashboard] Rol detectado:", userIsAdmin ? "ADMIN" : "CLIENTE")
  console.log("📊 [Dashboard] PublicMetadata:", user?.publicMetadata)

  // Solo redirigir a admin si es explícitamente admin
  if (userIsAdmin === true) {
    console.log("🚫 [Dashboard] Admin detectado, redirigiendo a /admin")
    redirect("/admin/")
  }

  console.log("✅ [Dashboard] Usuario cliente, mostrando dashboard normal")

  // Fetch all data on server side
  const clientMetadata = await getClientPublicMetadata(userId, user)
  const clientAccess = clientMetadata.demoAccess

  // Obtener todas las demos del catálogo y filtrar las eliminadas
  const deletedDemoIds = await getDeletedDemos()
  const allDemosRaw = await getAllDemos()
  const allDemos = allDemosRaw.filter(demo => !deletedDemoIds.includes(demo.id))

  // Demos ACTIVAS: Todas las que el cliente tiene acceso asignado (y no eliminadas)
  let activeDemos: Demo[] = clientAccess
    .map((access) => {
      const demo = allDemos.find((d) => d.id === access.demoId)
      return demo ? enrichDemoWithAccess(demo, access) : null
    })
    .filter((demo): demo is Demo => demo !== null)
    .filter((demo) => demo.status === "active") // Solo demos activas


  // Log básico para desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log(`📊 [Dashboard] ${activeDemos.length} demos activas, ${clientAccess.length} accesos totales`)
  }

  // Demos DISPONIBLES: TODAS las del catálogo con status "available" (sin importar si están asignadas)
  const availableDemos = allDemos.filter(demo => demo.status === "available")

  // Demos EN DESARROLLO: TODAS las con status "in-development" (sin importar si están asignadas)
  const inDevelopmentDemos = allDemos.filter(demo => demo.status === "in-development")

  // Calcular días mínimos restantes para el banner
  const minDaysRemaining = activeDemos.length > 0
    ? Math.min(...activeDemos.map((d) => d.daysRemaining ?? Infinity))
    : null

  // Encontrar la demo con menos días restantes para el banner (demo crítica)
  const criticalDemo = activeDemos.length > 0
    ? activeDemos.reduce((min, demo) => {
        const daysMin = min.daysRemaining ?? Infinity
        const daysCurrent = demo.daysRemaining ?? Infinity
        return daysCurrent < daysMin ? demo : min
      })
    : null

  // Obtener todas las demos próximas a expirar (para el selector en el dialog)
  const expiringDemos = activeDemos.filter(demo =>
    demo.daysRemaining !== null &&
    demo.daysRemaining <= 7 &&
    demo.daysRemaining > 0
  )

  // Debug básico para el banner (solo en desarrollo)
  if (process.env.NODE_ENV === 'development' && minDaysRemaining !== null && minDaysRemaining <= 7) {
    console.log('🚨 [Dashboard] Banner activo:', {
      minDaysRemaining,
      criticalDemo: criticalDemo?.name,
      activeDemosCount: activeDemos.length
    })
  }

  const activities = await getMyActivities(50) // Últimas 50 actividades
  const meetingMilestones = await getMyMeetingMilestones() // Próximos hitos de reuniones

  const initialData = {
    firstName,
    activeDemos,
    availableDemos,
    inDevelopmentDemos,
    activities,
    meetingMilestones,
    minDaysRemaining,
    criticalDemo,
    expiringDemos
  }

  return <ClientDashboardWrapper initialData={initialData} />
}
