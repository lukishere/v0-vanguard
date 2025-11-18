"use client"

import { useState, useEffect } from "react"

interface DashboardMetrics {
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
}

interface DashboardData {
  metrics: DashboardMetrics[]
  timestamp: string
}

export function useDashboardRefresh() {
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const handleDashboardRefresh = (event: CustomEvent<DashboardData>) => {
      console.log("Dashboard refresh event received:", event.detail)
      setLastRefresh(new Date(event.detail.timestamp))
      setIsRefreshing(false)

      // Store the refreshed data in localStorage for persistence
      localStorage.setItem('dashboardData', JSON.stringify(event.detail))
      localStorage.setItem('dashboardLastRefresh', event.detail.timestamp)
    }

    const handleRefreshStart = () => {
      setIsRefreshing(true)
    }

    window.addEventListener('dashboardDataRefreshed', handleDashboardRefresh as EventListener)
    window.addEventListener('dashboardRefreshStart', handleRefreshStart)

    // Load cached data on mount
    const cachedData = localStorage.getItem('dashboardData')
    const cachedTimestamp = localStorage.getItem('dashboardLastRefresh')
    if (cachedData && cachedTimestamp) {
      setLastRefresh(new Date(cachedTimestamp))
    }

    return () => {
      window.removeEventListener('dashboardDataRefreshed', handleDashboardRefresh as EventListener)
      window.removeEventListener('dashboardRefreshStart', handleRefreshStart)
    }
  }, [])

  const getCachedData = (): DashboardData | null => {
    try {
      const cachedData = localStorage.getItem('dashboardData')
      return cachedData ? JSON.parse(cachedData) : null
    } catch {
      return null
    }
  }

  return {
    lastRefresh,
    isRefreshing,
    getCachedData
  }
}
