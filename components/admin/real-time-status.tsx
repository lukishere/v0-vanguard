"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Clock,
  AlertCircle,
  CheckCircle,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { realtime } from "@/lib/realtime"

interface RealTimeStatusProps {
  enabled?: boolean
  interval?: number
  compact?: boolean
  showControls?: boolean
}

export function RealTimeStatus({
  enabled = true,
  interval = 30000,
  compact = false,
  showControls = true
}: RealTimeStatusProps) {
  // Handle refresh - now triggers realtime updates instead of polling
  const handleRefresh = async () => {
    console.log("Manual refresh triggered")

    // Dispatch event to indicate refresh is starting
    window.dispatchEvent(new CustomEvent('dashboardRefreshStart'))

    try {
      // Get fresh dashboard data
      const response = await fetch('/api/admin/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const result = await response.json()
      console.log("Dashboard data fetched:", result)

      // Emit realtime event using Upstash Realtime (mock implementation)
      await realtime.dashboard.update.emit(result.data)

    } catch (error) {
      console.error("Error refreshing dashboard data:", error)
      window.dispatchEvent(new CustomEvent('dashboardRefreshError'))
      throw error
    }
  }

  const handleError = (error: Error) => {
    console.error("RealTimeStatus error:", error)
  }

  // Simplified state management for manual refresh only
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const manualRefresh = async () => {
    setIsRefreshing(true)
    try {
      await handleRefresh()
      setLastUpdate(new Date())
    } catch (error) {
      console.error("Manual refresh failed:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) return `${hours}h ${minutes % 60}m`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
  }

  const getStatusColor = () => "text-admin-success-400"
  const getStatusText = () => lastUpdate ? `Actualizado ${formatTime(Date.now() - lastUpdate.getTime())}` : "Nunca actualizado"

  // Simplified status - always online for manual refresh component
  const isOnline = true
  const isStale = false

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className={cn("flex items-center gap-1 text-xs", getStatusColor())}>
          {isOnline ? (
            isRefreshing ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : isStale ? (
              <AlertCircle className="h-3 w-3" />
            ) : (
              <CheckCircle className="h-3 w-3" />
            )
          ) : (
            <WifiOff className="h-3 w-3" />
          )}
          <span className="hidden sm:inline">{getStatusText()}</span>
        </div>
        {showControls && (
          <Button
            variant="ghost"
            size="sm"
            onClick={manualRefresh}
            disabled={!isOnline || isRefreshing}
            className="h-6 w-6 p-0"
          >
            <RefreshCw className={cn("h-3 w-3", isRefreshing && "animate-spin")} />
          </Button>
        )}
      </div>
    )
  }

  return (
    <Card className="admin-card admin-card-hover text-slate-800 border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-xl relative overflow-hidden",
              isOnline ? "bg-gradient-to-br from-admin-success-500 to-admin-success-600" : "bg-gradient-to-br from-slate-400 to-slate-500"
            )}>
              {isOnline && <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />}
              {isOnline ? (
                <Wifi className={cn("h-5 w-5 text-white relative z-10", isRefreshing ? "animate-pulse" : "")} />
              ) : (
                <WifiOff className="h-5 w-5 text-white relative z-10" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-slate-900">Estado en tiempo real</h3>
                <Badge
                  className={cn(
                    "text-xs font-semibold border-0",
                    isOnline
                      ? (enabled ? "bg-admin-success-500 text-white hover:bg-admin-success-600" : "bg-admin-warning-500 text-white hover:bg-admin-warning-600")
                      : "bg-admin-error-500 text-white hover:bg-admin-error-600"
                  )}
                >
                  {isOnline ? (enabled ? "Activo" : "Pausado") : "Sin conexión"}
                </Badge>
              </div>

              <p className={cn("text-sm mt-1 font-medium", isOnline ? "text-admin-success-600" : "text-admin-error-600")}>
                {getStatusText()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {enabled && isOnline && (
              <div className="text-right">
                <p className="text-xs text-slate-500 font-medium">Próxima actualización</p>
                <p className="text-sm font-bold text-slate-900">
                  {formatTime(nextUpdateIn)}
                </p>
              </div>
            )}

            {showControls && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={manualRefresh}
                  disabled={!isOnline || isRefreshing}
                  className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-admin-info-500 transition-all duration-200"
                >
                  <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
                  {isRefreshing ? "Actualizando..." : "Actualizar"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {enabled && isOnline && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-slate-500 font-medium">Última actualización</p>
                <p className="text-sm font-bold text-slate-900">
                  {lastUpdate ? formatTime(timeSinceLastUpdate) : "Nunca"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Intervalo</p>
                <p className="text-sm font-bold text-slate-900">
                  {formatTime(interval)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Estado</p>
                <div className="flex items-center justify-center gap-1">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    isStale ? "bg-admin-warning-500" : "bg-admin-success-500"
                  )} />
                  <span className="text-sm font-bold text-slate-900">
                    {isStale ? "Anticuado" : "Actual"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {isStale && (
          <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-400" />
              <p className="text-sm text-amber-200">
                Los datos pueden estar desactualizados. Considera refrescar manualmente.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Compact status indicator for headers
export function RealTimeIndicator({
  enabled = true,
  interval = 30000
}: Omit<RealTimeStatusProps, 'compact' | 'showControls'>) {
  return (
    <RealTimeStatus
      enabled={enabled}
      interval={interval}
      compact={true}
      showControls={true}
    />
  )
}

// Dashboard header with real-time status - Client component wrapper
interface DashboardHeaderProps {
  title: string
  description?: string
  enabled?: boolean
  interval?: number
  actions?: React.ReactNode
}

export function DashboardHeader({
  title,
  description,
  enabled = true,
  interval = 30000,
  actions
}: DashboardHeaderProps) {
  // Handle refresh internally within the client component
  const handleRefresh = async () => {
    console.log("Dashboard header refresh triggered")
    // This would typically trigger a page refresh or data refetch
    // For now, we'll just log it
    window.location.reload()
  }

  const handleError = (error: Error) => {
    console.error("Dashboard header error:", error)
  }

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">{title}</h1>
          <RealTimeIndicator
            enabled={enabled}
            interval={interval}
            onRefresh={handleRefresh}
            onError={handleError}
          />
        </div>
        {description && (
          <p className="text-white/90 font-medium drop-shadow-md">{description}</p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  )
}
