"use client"

import { useEffect, useState, useRef } from "react"
import { realtime } from "@/lib/realtime"

type RealtimeEventData = {
  dashboard: {
    update: {
      metrics: Array<{
        title: string
        value: string
        helperText?: string
        change?: {
          value: number
          description?: string
        }
        positive?: boolean
        icon: string
        target?: number
        status?: "normal" | "warning" | "critical" | "excellent"
        actionRequired?: boolean
        actionLabel?: string
      }>
      timestamp: string
    }
  }
  system: {
    status: {
      status: "online" | "offline" | "maintenance"
      message?: string
      timestamp: string
    }
  }
}

type EventHandlers = {
  [K in keyof RealtimeEventData]?: {
    [E in keyof RealtimeEventData[K]]?: (data: RealtimeEventData[K][E]) => void
  }
}

export function useRealtime(handlers: EventHandlers = {}) {
  const [isConnected, setIsConnected] = useState(true) // Always connected in mock
  const [lastEvent, setLastEvent] = useState<Date | null>(null)
  const handlersRef = useRef(handlers)
  const unsubscribersRef = useRef<(() => void)[]>([])

  // Update handlers ref when handlers change
  useEffect(() => {
    handlersRef.current = handlers
  }, [handlers])

  useEffect(() => {
    // Subscribe to realtime events
    const unsubscribeDashboard = realtime.subscribe('dashboard-update', (data) => {
      handlersRef.current.dashboard?.update?.(data)
      setLastEvent(new Date())
      console.log("Realtime dashboard update received:", data)
    })

    const unsubscribeSystem = realtime.subscribe('system-status', (data) => {
      handlersRef.current.system?.status?.(data)
      setLastEvent(new Date())
      console.log("Realtime system status received:", data)
    })

    unsubscribersRef.current = [unsubscribeDashboard, unsubscribeSystem]

    return () => {
      unsubscribersRef.current.forEach(unsubscribe => unsubscribe())
      unsubscribersRef.current = []
    }
  }, [])

  return {
    isConnected,
    lastEvent
  }
}
