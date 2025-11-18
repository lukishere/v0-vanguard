"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface RealTimeOptions {
  enabled?: boolean
  interval?: number // milliseconds
  onRefresh?: () => Promise<void> | void
  onError?: (error: Error) => void
}

interface RealTimeState {
  isOnline: boolean
  lastUpdate: Date | null
  isRefreshing: boolean
  timeSinceLastUpdate: number
  nextUpdateIn: number
}

export function useRealTimeDashboard(options: RealTimeOptions = {}) {
  const {
    enabled = true,
    interval = 30000, // 30 seconds default
    onRefresh,
    onError
  } = options

  const [state, setState] = useState<RealTimeState>(() => ({
    isOnline: typeof window !== 'undefined' ? navigator.onLine : true,
    lastUpdate: null,
    isRefreshing: false,
    timeSinceLastUpdate: 0,
    nextUpdateIn: interval
  }))

  const intervalRef = useRef<NodeJS.Timeout | undefined>()
  const lastUpdateRef = useRef<Date>()

  const updateState = useCallback((updates: Partial<RealTimeState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  const handleRefresh = useCallback(async () => {
    if (state.isRefreshing) return

    updateState({ isRefreshing: true })

    try {
      await onRefresh?.()
      const now = new Date()
      lastUpdateRef.current = now
      updateState({
        lastUpdate: now,
        isRefreshing: false,
        timeSinceLastUpdate: 0,
        nextUpdateIn: interval
      })
    } catch (error) {
      updateState({ isRefreshing: false })
      onError?.(error as Error)
    }
  }, [state.isRefreshing, onRefresh, onError, interval, updateState])

  const manualRefresh = useCallback(async () => {
    await handleRefresh()
  }, [handleRefresh])

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => updateState({ isOnline: true })
    const handleOffline = () => updateState({ isOnline: false })

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [updateState])

  // Auto-refresh timer
  useEffect(() => {
    if (!enabled || !state.isOnline) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = undefined
      }
      return
    }

    intervalRef.current = setInterval(async () => {
      await handleRefresh()
    }, interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = undefined
      }
    }
  }, [enabled, state.isOnline, interval, handleRefresh])

  // Update counters
  useEffect(() => {
    if (!lastUpdateRef.current) return

    const counterInterval = setInterval(() => {
      const now = Date.now()
      const lastUpdate = lastUpdateRef.current?.getTime() || now
      const timeSinceLastUpdate = now - lastUpdate
      const nextUpdateIn = Math.max(0, interval - timeSinceLastUpdate)

      updateState({
        timeSinceLastUpdate,
        nextUpdateIn
      })
    }, 1000)

    return () => clearInterval(counterInterval)
  }, [interval, updateState])

  // Initial load
  useEffect(() => {
    if (enabled && state.isOnline) {
      handleRefresh()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const formatTime = useCallback((milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) return `${hours}h ${minutes % 60}m`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
  }, [])

  const getStatusColor = useCallback(() => {
    if (!state.isOnline) return "text-gray-400"
    if (state.isRefreshing) return "text-blue-400"
    if (state.timeSinceLastUpdate > interval * 1.5) return "text-amber-400"
    return "text-emerald-400"
  }, [state.isOnline, state.isRefreshing, state.timeSinceLastUpdate, interval])

  const getStatusText = useCallback(() => {
    if (!state.isOnline) return "Sin conexión"
    if (state.isRefreshing) return "Actualizando..."
    if (!state.lastUpdate) return "Nunca actualizado"
    return `Actualizado ${formatTime(state.timeSinceLastUpdate)}`
  }, [state.isOnline, state.isRefreshing, state.lastUpdate, state.timeSinceLastUpdate, formatTime])

  return {
    ...state,
    manualRefresh,
    formatTime,
    getStatusColor,
    getStatusText,
    isStale: state.timeSinceLastUpdate > interval * 1.5
  }
}

// Hook for managing multiple dashboard components with coordinated updates
export function useDashboardRefreshManager(components: string[]) {
  const [refreshingComponents, setRefreshingComponents] = useState<Set<string>>(new Set())
  const [lastRefreshes, setLastRefreshes] = useState<Record<string, Date>>({})

  const startRefresh = useCallback((componentId: string) => {
    setRefreshingComponents(prev => new Set(prev).add(componentId))
  }, [])

  const endRefresh = useCallback((componentId: string) => {
    setRefreshingComponents(prev => {
      const newSet = new Set(prev)
      newSet.delete(componentId)
      return newSet
    })
    setLastRefreshes(prev => ({ ...prev, [componentId]: new Date() }))
  }, [])

  const isRefreshing = useCallback((componentId: string) => {
    return refreshingComponents.has(componentId)
  }, [refreshingComponents])

  const getLastRefresh = useCallback((componentId: string) => {
    return lastRefreshes[componentId]
  }, [lastRefreshes])

  const refreshAll = useCallback(async (refreshFunctions: Record<string, () => Promise<void> | void>) => {
    const promises = components.map(async (componentId) => {
      if (refreshFunctions[componentId]) {
        startRefresh(componentId)
        try {
          await refreshFunctions[componentId]()
        } finally {
          endRefresh(componentId)
        }
      }
    })

    await Promise.all(promises)
  }, [components, startRefresh, endRefresh])

  return {
    isRefreshing,
    getLastRefresh,
    refreshAll,
    refreshingComponents: Array.from(refreshingComponents),
    anyRefreshing: refreshingComponents.size > 0
  }
}
