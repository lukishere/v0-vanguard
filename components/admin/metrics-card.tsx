"use client"

import type { ComponentType } from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, ArrowRight, Activity, AlertTriangle, CheckCircle, Users, Briefcase, MessageSquare, Calendar, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useRealtime } from "@/hooks/use-realtime"
import { realtime } from "@/lib/realtime"

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  Users,
  Briefcase,
  MessageSquare,
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle,
}

export type MetricCardProps = {
  title: string
  value: string
  helperText?: string
  change?: {
    value: number
    description?: string
  }
  positive?: boolean
  icon: string // Changed from ComponentType to string
  target?: number
  status?: "normal" | "warning" | "critical" | "excellent"
  actionRequired?: boolean
  actionLabel?: string
  onActionClick?: () => void
}

export function MetricsCard({
  title,
  value,
  helperText,
  change,
  positive = true,
  icon: iconName,
  target,
  status = "normal",
  actionRequired = false,
  actionLabel,
  onActionClick
}: MetricCardProps) {
  const Icon = iconMap[iconName] || Activity
  const [animatedValue, setAnimatedValue] = useState(value)
  const [isUpdating, setIsUpdating] = useState(false)
  const { isConnected, lastEvent } = useRealtime()

  // Animate value changes
  useEffect(() => {
    if (animatedValue !== value) {
      setIsUpdating(true)
      const timer = setTimeout(() => {
        setAnimatedValue(value)
        setIsUpdating(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [value, animatedValue])

  // Listen for realtime dashboard updates using the simplified realtime system
  useEffect(() => {
    const handleRealtimeUpdate = (data: any) => {
      console.log("MetricsCard received realtime update:", data)

      // Find the matching metric in the update
      const updatedMetric = data.metrics?.find((m: any) => m.title === title)
      if (updatedMetric) {
        setIsUpdating(true)
        // Trigger animation after a brief delay
        setTimeout(() => {
          setIsUpdating(false)
        }, 800)
      }
    }

    // Subscribe to realtime events using the simplified system
    const unsubscribe = realtime.subscribe('dashboard-update', handleRealtimeUpdate)

    return unsubscribe
  }, [title])
  const getStatusColor = () => {
    switch (status) {
      case "excellent":
        return "text-admin-success-400"
      case "warning":
        return "text-admin-warning-400"
      case "critical":
        return "text-admin-error-400"
      default:
        return "text-admin-info-400"
    }
  }

  const getStatusBg = () => {
    switch (status) {
      case "excellent":
        return "admin-status-excellent"
      case "warning":
        return "admin-status-warning"
      case "critical":
        return "admin-status-critical"
      default:
        return "admin-status-normal"
    }
  }

  const getStatusGlow = () => {
    switch (status) {
      case "excellent":
        return "admin-success-glow"
      case "warning":
        return "admin-warning-glow"
      case "critical":
        return "admin-error-glow"
      default:
        return "admin-metric-glow"
    }
  }

  const getProgressValue = () => {
    if (!target) return 0
    const numericValue = parseFloat(value.replace(/[^\d.-]/g, ''))
    return Math.min((numericValue / target) * 100, 100)
  }

  return (
    <Card className={cn(
      "admin-card admin-card-hover text-slate-800 border-0 transition-all duration-300 relative overflow-hidden group",
      getStatusBg(),
      getStatusGlow(),
      isUpdating && "ring-2 ring-admin-info-400/50 shadow-lg shadow-admin-info-400/20"
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {isUpdating && (
        <div className="absolute top-2 right-2 z-20 bg-white/90 rounded-full p-1">
          <RefreshCw className="h-3 w-3 text-admin-info-500 animate-spin" />
        </div>
      )}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
        <div className="flex items-center gap-3">
          <CardTitle className="text-sm font-bold text-slate-100 group-hover:text-white transition-colors duration-300">{title}</CardTitle>
          {status !== "normal" && (
            <div className="flex items-center gap-1">
              {status === "excellent" && <CheckCircle className="h-4 w-4 text-admin-success-600 drop-shadow-sm" />}
              {status === "warning" && <AlertTriangle className="h-4 w-4 text-admin-warning-600 drop-shadow-sm" />}
              {status === "critical" && <Activity className="h-4 w-4 text-admin-error-600 drop-shadow-sm" />}
            </div>
          )}
        </div>
        {Icon && <Icon className={cn("h-6 w-6 transition-all duration-300 group-hover:scale-110", getStatusColor(), isUpdating && "animate-pulse")} />}
      </CardHeader>
      <CardContent className="space-y-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className={cn(
            "text-4xl font-bold tracking-tight transition-all duration-500",
            isUpdating ? "text-admin-info-300 scale-105" : "text-slate-200 group-hover:text-white"
          )}>
            {animatedValue}
          </div>
          {actionRequired && actionLabel && (
            <Badge
              variant="outline"
              className="cursor-pointer border-admin-info-400 text-slate-200 bg-admin-info-50 hover:bg-admin-info-100 hover:border-admin-info-500 transition-all duration-200 hover:scale-105 font-semibold"
              onClick={onActionClick}
            >
              <ArrowRight className="mr-1 h-3 w-3" />
              {actionLabel}
            </Badge>
          )}
        </div>

        {target && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">Progreso hacia meta</span>
              <span className="text-slate-200 font-bold">{getProgressValue().toFixed(0)}%</span>
            </div>
            <div className="relative">
              <Progress value={getProgressValue()} className="h-2 bg-slate-200" />
              <div className={cn(
                "absolute inset-0 rounded-full opacity-20",
                status === "excellent" ? "bg-admin-success-500" :
                status === "warning" ? "bg-admin-warning-500" :
                status === "critical" ? "bg-admin-error-500" : "bg-admin-info-500"
              )} />
            </div>
          </div>
        )}

        {change && (
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100">
              {positive ? (
                <TrendingUp className="h-4 w-4 text-admin-success-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-admin-error-500" />
              )}
              <span className={cn("font-bold text-sm", positive ? "text-admin-success-400" : "text-admin-error-400")}>
                {positive ? "+" : "-"}
                {Math.abs(change.value).toFixed(1)}%
              </span>
            </div>
            {change.description && (
              <span className="text-slate-300 text-xs font-semibold">{change.description}</span>
            )}
          </div>
        )}

        {helperText && (
          <p className="text-sm text-slate-400 font-semibold leading-relaxed">{helperText}</p>
        )}
      </CardContent>
    </Card>
  )
}
