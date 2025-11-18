"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity
} from "lucide-react"
import { cn } from "@/lib/utils"

type PipelineStage = {
  id: string
  stage: string
  percentage: number
  description: string
  clients: number
  targetClients: number
  conversionRate: number
  avgTimeInStage: number // días
  bottleneckRisk: "low" | "medium" | "high"
  predictedGrowth: number // porcentaje
  keyMetrics: {
    sessionsPerClient: number
    feedbackScore: number
    meetingRequests: number
  }
  actions: string[]
}

type EnhancedAdoptionPipelineProps = {
  stages: PipelineStage[]
  totalActiveClients?: number
}

const bottleneckConfig = {
  low: {
    color: "text-admin-success-600",
    bgColor: "admin-status-excellent",
    label: "Fluido"
  },
  medium: {
    color: "text-admin-warning-600",
    bgColor: "admin-status-warning",
    label: "Atención"
  },
  high: {
    color: "text-admin-error-600",
    bgColor: "admin-status-critical",
    label: "Cuello de botella"
  }
}

export function EnhancedAdoptionPipeline({
  stages,
  totalActiveClients
}: EnhancedAdoptionPipelineProps) {
  const [animatedProgress, setAnimatedProgress] = useState<Record<string, number>>({})

  // Handle stage click - can be extended for future functionality
  const handleStageClick = (stageId: string) => {
    console.log(`Stage clicked: ${stageId}`)
    // Future: Could show stage details or navigate to detailed view
  }

  useEffect(() => {
    // Animate progress bars on mount
    const timer = setTimeout(() => {
      const newAnimatedProgress: Record<string, number> = {}
      stages.forEach(stage => {
        newAnimatedProgress[stage.id] = stage.percentage
      })
      setAnimatedProgress(newAnimatedProgress)
    }, 100)

    return () => clearTimeout(timer)
  }, [stages])

  const totalClients = totalActiveClients ?? stages.reduce((sum, stage) => sum + stage.targetClients, 0)
  const avgConversionRate = stages.reduce((sum, stage) => sum + stage.conversionRate, 0) / stages.length
  const overallProgress = stages.reduce((sum, stage, index) => {
    const weight = 1 / (index + 1) // Más peso a etapas iniciales
    return sum + (stage.percentage * weight)
  }, 0) / stages.reduce((sum, _, index) => sum + 1 / (index + 1), 0)


  return (
    <Card className="admin-card admin-card-hover text-slate-800 border-0">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-admin-info-500 to-admin-info-600 text-white shadow-lg">
                <Target className="h-5 w-5" />
              </div>
              Follow-up
            </CardTitle>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm text-slate-600 font-medium">
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {totalClients} clientes totales
          </span>
          <span className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Tasa de conversión: {avgConversionRate.toFixed(1)}%
          </span>
          <span className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Progreso general: {overallProgress.toFixed(0)}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {stages.map((stage, index) => {
          const bottleneck = bottleneckConfig[stage.bottleneckRisk]
          const progressValue = animatedProgress[stage.id] || 0

          return (
            <div
              key={stage.id}
              className={cn(
                "admin-card admin-card-hover rounded-xl p-6 space-y-4 transition-all duration-300 relative overflow-hidden group",
                bottleneck.bgColor
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-admin-info-500 to-admin-info-600 text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-slate-800 transition-colors duration-300">{stage.stage}</h3>
                    <p className="text-sm text-slate-600 font-medium">{stage.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Badge className={cn("text-xs font-semibold flex items-center gap-1 border-0 text-white", bottleneck.bgColor.replace('admin-status-', 'bg-admin-').replace('-excellent', '-success-500').replace('-warning', '-warning-500').replace('-critical', '-error-500'))}>
                    {stage.bottleneckRisk === "high" && <AlertTriangle className="h-3 w-3" />}
                    {stage.bottleneckRisk === "medium" && <Clock className="h-3 w-3" />}
                    {stage.bottleneckRisk === "low" && <CheckCircle className="h-3 w-3" />}
                    {bottleneck.label}
                  </Badge>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">{stage.percentage}%</div>
                    <div className="text-xs text-slate-500 font-medium">
                      {stage.clients}/{stage.targetClients} clientes
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-2">
                    <span>Progreso</span>
                    <span>{progressValue.toFixed(0)}%</span>
                  </div>
                  <Progress value={progressValue} className="h-3 bg-slate-200" />
                </div>

                <div className="grid grid-cols-3 gap-6 text-xs">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                    <Users className="h-4 w-4 text-admin-info-500" />
                    <span className="text-slate-700 font-semibold">{stage.clients} clientes</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                    <Target className="h-4 w-4 text-admin-success-500" />
                    <span className="text-slate-700 font-semibold">{stage.conversionRate.toFixed(1)}% conversión</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                    <Clock className="h-4 w-4 text-admin-demo-500" />
                    <span className="text-slate-700 font-semibold">{stage.avgTimeInStage}d promedio</span>
                  </div>
                </div>
              </div>

              {stage.predictedGrowth !== 0 && (
                <div className="flex items-center gap-2 text-xs p-2 rounded-lg bg-slate-50">
                  {stage.predictedGrowth > 0 ? (
                    <TrendingUp className="h-4 w-4 text-admin-success-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-admin-error-500" />
                  )}
                  <span className={cn(
                    "font-semibold",
                    stage.predictedGrowth > 0 ? "text-admin-success-600" : "text-admin-error-600"
                  )}>
                    {stage.predictedGrowth > 0 ? "+" : ""}{stage.predictedGrowth.toFixed(1)}% crecimiento previsto
                  </span>
                  <span className="text-slate-500 font-medium">próximos 30 días</span>
                </div>
              )}

            </div>
          )
        })}

        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-admin-success-500"></div>
                <span className="text-slate-600">Fluido</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-admin-warning-500"></div>
                <span className="text-slate-600">Requiere atención</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-admin-error-500"></div>
                <span className="text-slate-600">Cuello de botella</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
