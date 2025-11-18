import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { updateUserActivity } from '@/lib/admin/clerk-metadata'
import { logActivity } from '@/app/actions/client-activities'

export async function POST(request: NextRequest) {
  try {
    // Verificar que el usuario esté autenticado
    const user = await currentUser()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Obtener datos del request
    const body = await request.json()
    const { userId, timestamp } = body

    // Verificar que el userId del request coincida con el usuario autenticado
    if (userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Actualizar la actividad del usuario en metadata (para compatibilidad)
    const result = await updateUserActivity(userId, timestamp)

    // Registrar actividad en el sistema de actividades del dashboard
    // Esto es lo que se usará para mostrar "última actividad" en admin
    await logActivity(
      'dashboard-activity',
      'Actividad en el dashboard',
      { timestamp }
    )

    return NextResponse.json({
      success: true,
      lastActivity: result.lastActivity,
      user: user.fullName
    })

  } catch (error) {
    console.error('❌ API /user/activity - Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
