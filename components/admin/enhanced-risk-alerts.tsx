"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  Activity,
  RefreshCw,
  ExternalLink
} from "lucide-react"
import { cn } from "@/lib/utils"

type AlertLevel = "low" | "medium" | "high" | "critical"
type AlertType = "expiring" | "inactive" | "feedback" | "engagement" | "capacity" | "performance"

type RiskAlert = {
  id: string
  type: AlertType
  title: string
  description: string
  level: AlertLevel
  value: number
  threshold: number
  trend: "up" | "down" | "stable"
  trendValue?: number
  affectedClients?: number
  recommendedAction: string
  actionLabel: string
  lastUpdated: string
  category: string
}

type EnhancedRiskAlertsProps = {
  alerts: RiskAlert[]
}

const alertConfig = {
  low: {
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10 border-emerald-500/20",
    icon: CheckCircle,
    label: "Bajo"
  },
  medium: {
    color: "text-amber-400",
    bgColor: "bg-amber-500/10 border-amber-500/20",
    icon: AlertCircle,
    label: "Medio"
  },
  high: {
    color: "text-orange-400",
    bgColor: "bg-orange-500/10 border-orange-500/20",
    icon: AlertTriangle,
    label: "Alto"
  },
  critical: {
    color: "text-rose-400",
    bgColor: "bg-rose-500/10 border-rose-500/20",
    icon: AlertTriangle,
    label: "Crítico"
  }
}

const typeConfig = {
  expiring: {
    icon: Clock,
    color: "text-blue-400",
    category: "Expiración"
  },
  inactive: {
    icon: Users,
    color: "text-gray-400",
    category: "Inactividad"
  },
  feedback: {
    icon: Activity,
    color: "text-purple-400",
    category: "Feedback"
  },
  engagement: {
    icon: TrendingUp,
    color: "text-emerald-400",
    category: "Engagement"
  },
  capacity: {
    icon: ShieldCheck,
    color: "text-amber-400",
    category: "Capacidad"
  },
  performance: {
    icon: Activity,
    color: "text-red-400",
    category: "Rendimiento"
  }
}

export function EnhancedRiskAlerts({
  alerts
}: EnhancedRiskAlertsProps) {
  const criticalAlerts = alerts.filter(alert => alert.level === "critical")
  const highAlerts = alerts.filter(alert => alert.level === "high")
  const totalRiskScore = alerts.reduce((score, alert) => {
    const levelScore = { low: 1, medium: 2, high: 3, critical: 4 }[alert.level]
    return score + (levelScore * alert.value / alert.threshold)
  }, 0)

  const getOverallRiskLevel = () => {
    if (criticalAlerts.length > 0) return "critical"
    if (highAlerts.length > 2) return "high"
    if (highAlerts.length > 0) return "medium"
    return "low"
  }

  const overallRisk = getOverallRiskLevel()
  const OverallIcon = alertConfig[overallRisk].icon

  // Internal handlers for state management
  const handleActionClick = (alertId: string, action: string) => {
    console.log(`Action clicked for ${alertId}: ${action}`)
    // In a real implementation, this would perform the specific action
  }

  const handleRefresh = () => {
    console.log("Refreshing risk alerts")
    // In a real implementation, this would refresh the data
  }

  return (
    <Card className="border-white/10 bg-white/5 text-white backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-white">
              <ShieldCheck className="h-5 w-5 text-vanguard-blue" />
              Alertas & Riesgos
            </CardTitle>
            <Badge className={cn("flex items-center gap-1", alertConfig[overallRisk].bgColor, alertConfig[overallRisk].color)}>
              <OverallIcon className="h-3 w-3" />
              {alertConfig[overallRisk].label}
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="border-white/20 bg-white/5 text-white hover:bg-white/10"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
        <div className="flex items-center gap-4 text-sm text-white/60">
          <span>Riesgo total: {(totalRiskScore / alerts.length * 100).toFixed(0)}%</span>
          <span>Alertas críticas: {criticalAlerts.length}</span>
          <span>Alertas altas: {highAlerts.length}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.length > 0 ? alerts.map((alert) => {
          const alertLevel = alertConfig[alert.level]
          const alertType = typeConfig[alert.type]
          const TypeIcon = alertType.icon
          const LevelIcon = alertLevel.icon

          const progressValue = Math.min((alert.value / alert.threshold) * 100, 100)
          const isOverThreshold = alert.value > alert.threshold

          return (
            <div
              key={alert.id}
              className={cn(
                "rounded-lg border p-4 space-y-3 transition-all duration-200 hover:scale-[1.01]",
                alertLevel.bgColor
              )}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <TypeIcon className={cn("h-4 w-4", alertType.color)} />
                    <span className="font-medium text-white">{alert.title}</span>
                    <Badge className={cn("text-xs", alertLevel.bgColor, alertLevel.color)}>
                      <LevelIcon className="h-3 w-3 mr-1" />
                      {alertLevel.label}
                    </Badge>
                    <Badge variant="outline" className="text-xs border-white/20 text-white/60">
                      {alertType.category}
                    </Badge>
                  </div>

                  <p className="text-sm text-white/70">{alert.description}</p>

                  <div className="flex items-center gap-4 text-xs text-white/50">
                    <span>Valor actual: {alert.value}</span>
                    <span>Umbral: {alert.threshold}</span>
                    {alert.affectedClients && (
                      <span>{alert.affectedClients} clientes afectados</span>
                    )}
                    <span className="text-white/40">Actualizado: {alert.lastUpdated}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/50">Nivel de riesgo</span>
                      <span className={cn(
                        "font-medium",
                        isOverThreshold ? "text-rose-400" : "text-emerald-400"
                      )}>
                        {progressValue.toFixed(0)}%
                      </span>
                    </div>
                    <Progress
                      value={progressValue}
                      className={cn(
                        "h-2",
                        isOverThreshold ? "bg-rose-500/20" : "bg-white/10"
                      )}
                    />
                  </div>

                  {alert.trend !== "stable" && (
                    <div className="flex items-center gap-1 text-xs">
                      {alert.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-rose-400" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-emerald-400" />
                      )}
                      <span className={cn(
                        "font-medium",
                        alert.trend === "up" ? "text-rose-300" : "text-emerald-300"
                      )}>
                        {alert.trend === "up" ? "+" : "-"}{alert.trendValue}% vs semana anterior
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleActionClick(alert.id, alert.actionLabel)}
                    className={cn(
                      "text-xs",
                      alert.level === "critical" ? "bg-rose-600 hover:bg-rose-700" :
                      alert.level === "high" ? "bg-orange-600 hover:bg-orange-700" :
                      "bg-vanguard-blue hover:bg-blue-700"
                    )}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    {alert.actionLabel}
                  </Button>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <p className="text-xs text-white/60">
                  <strong>Recomendación:</strong> {alert.recommendedAction}
                </p>
              </div>
            </div>
          )
        }) : (
          <div className="text-center py-8 text-white/60">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-emerald-400" />
            <p>No hay alertas activas en este momento</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
