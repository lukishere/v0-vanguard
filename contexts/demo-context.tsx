"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Demo } from "@/lib/demos/types"
import { logActivity } from "@/app/actions/client-activities"

interface DemoContextType {
  activeDemo: Demo | null
  openDemo: (demo: Demo) => Promise<void>
  closeDemo: () => void
  demoHistory: Demo[]
  isLoading: boolean
  error: string | null
}

const DemoContext = createContext<DemoContextType | undefined>(undefined)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [activeDemo, setActiveDemo] = useState<Demo | null>(null)
  const [demoHistory, setDemoHistory] = useState<Demo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const openDemo = useCallback(async (demo: Demo) => {
    if (!demo.interactiveUrl) {
      setError("Esta demo no tiene una URL interactiva configurada")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Registrar actividad de apertura de demo
      await logActivity(
        "demo-opened",
        `Abrió la demo "${demo.name}"`,
        {
          demoId: demo.id,
          demoName: demo.name,
          demoType: demo.demoType,
          timestamp: new Date().toISOString()
        }
      )

      setActiveDemo(demo)
      setDemoHistory(prev => {
        // Evitar duplicados en el historial
        const filtered = prev.filter(d => d.id !== demo.id)
        return [...filtered, demo].slice(-10) // Mantener solo las últimas 10
      })

      // Analytics opcional con gtag
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'demo_opened', {
          demo_name: demo.name,
          demo_type: demo.demoType,
          demo_id: demo.id
        })
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al abrir la demo'
      setError(errorMessage)
      console.error('Error opening demo:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const closeDemo = useCallback(() => {
    setActiveDemo(null)
    setError(null)
  }, [])

  const value: DemoContextType = {
    activeDemo,
    openDemo,
    closeDemo,
    demoHistory,
    isLoading,
    error
  }

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  )
}

export function useDemo() {
  const context = useContext(DemoContext)
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider')
  }
  return context
}

// Hook adicional para verificar si una demo está disponible
export function useDemoAvailability(demo: Demo | null) {
  const { demoHistory } = useDemo()

  const isRecentlyOpened = demo ? demoHistory.some(d => d.id === demo.id) : false
  const hasValidUrl = demo?.interactiveUrl ? true : false
  const isAvailable = hasValidUrl && demo?.status === 'active'

  return {
    isAvailable,
    isRecentlyOpened,
    hasValidUrl,
    canOpen: isAvailable && hasValidUrl
  }
}

