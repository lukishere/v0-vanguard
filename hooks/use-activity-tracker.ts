"use client"

import { useUser } from "@clerk/nextjs"
import { useCallback, useEffect, useRef } from "react"

export function useActivityTracker() {
  const { user } = useUser()
  const lastUpdateRef = useRef<number>(0)
  const ACTIVITY_UPDATE_INTERVAL = 30 * 1000 // 30 segundos para testing (cambiar a 5 minutos en producción)

  const updateActivity = useCallback(async () => {
    if (!user?.id) {
      console.log('⚠️ No hay usuario para actualizar actividad')
      return
    }

    const now = Date.now()
    const timeSinceLastUpdate = now - lastUpdateRef.current

    // Solo actualizar si han pasado más de 30 segundos desde la última actualización
    if (timeSinceLastUpdate > ACTIVITY_UPDATE_INTERVAL) {
      try {
        const timestamp = new Date().toISOString()
        console.log('📊 Actualizando actividad del usuario:', user.fullName, 'timestamp:', timestamp)

        // Llamar a API route para actualizar actividad
        const response = await fetch('/api/user/activity', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            timestamp
          })
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        lastUpdateRef.current = now
        console.log('✅ Actividad actualizada correctamente:', result)
      } catch (error) {
        console.error('❌ Error updating user activity:', error)
      }
    } else {
      console.log('⏱️ Actividad no actualizada (muy reciente):', Math.round(timeSinceLastUpdate / 1000), 'segundos desde última actualización')
    }
  }, [user?.id, user?.fullName])

  // Actualizar actividad en eventos importantes
  useEffect(() => {
    const handleUserActivity = () => {
      updateActivity()
    }

    // Eventos que indican actividad del usuario
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ]

    // Agregar listeners con throttling
    let timeoutId: NodeJS.Timeout
    const throttledHandler = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleUserActivity, 1000) // Esperar 1 segundo de inactividad
    }

    events.forEach(event => {
      document.addEventListener(event, throttledHandler, { passive: true })
    })

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, throttledHandler)
      })
      clearTimeout(timeoutId)
    }
  }, [updateActivity])

  // Actualizar actividad al montar el componente (cuando el usuario llega a la página)
  useEffect(() => {
    updateActivity()
  }, [updateActivity])

  return { updateActivity }
}
