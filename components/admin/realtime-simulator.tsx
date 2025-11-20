"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Play, Square, RotateCcw } from "lucide-react"
import { realtime } from "@/lib/realtime"

export function RealtimeSimulator() {
  const [isRunning, setIsRunning] = useState(false)
  const [updateCount, setUpdateCount] = useState(0)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)

  // Generate random dashboard data
  const generateRandomMetrics = () => {
    const baseMetrics = [
      {
        title: "Clientes activos",
        value: (Math.floor(Math.random() * 50) + 10).toString(),
        helperText: "Clientes con acceso vigente a demos",
        change: { value: Math.random() * 20 - 10, description: "vs semana anterior" },
        positive: Math.random() > 0.3,
        icon: "Users",
        target: 30,
        status: Math.random() > 0.7 ? "excellent" : Math.random() > 0.4 ? "normal" : "warning",
        actionRequired: Math.random() > 0.7,
        actionLabel: "Ver clientes",
      },
      {
        title: "Demos con engagement",
        value: (Math.floor(Math.random() * 15) + 2).toString(),
        helperText: "Demos con interacciones en la última semana",
        change: { value: Math.random() * 20 - 10, description: "actividad reciente" },
        positive: Math.random() > 0.4,
        icon: "Briefcase",
        target: 12,
        status: Math.random() > 0.6 ? "excellent" : Math.random() > 0.3 ? "normal" : "warning",
        actionRequired: Math.random() > 0.8,
        actionLabel: "Promocionar",
      },
      {
        title: "Feedback recibido",
        value: (Math.floor(Math.random() * 25) + 5).toString(),
        helperText: "Interacciones de clientes en la última semana",
        change: { value: Math.random() * 20 - 10, description: "retroalimentación reciente" },
        positive: Math.random() > 0.3,
        icon: "MessageSquare",
        target: 20,
        status: Math.random() > 0.5 ? "excellent" : Math.random() > 0.2 ? "normal" : "warning",
        actionRequired: Math.random() > 0.6,
        actionLabel: "Revisar feedback",
      },
      {
        title: "Solicitudes recientes",
        value: (Math.floor(Math.random() * 10)).toString(),
        helperText: "Solicitudes de reunión en la última semana",
        positive: Math.random() > 0.5,
        change: { value: Math.random() * 20 - 10, description: "requieren atención" },
        icon: "Calendar",
        target: 8,
        status: Math.random() > 0.6 ? "excellent" : Math.random() > 0.3 ? "normal" : "warning",
        actionRequired: Math.random() > 0.7,
        actionLabel: "Gestionar",
      },
    ]

    return baseMetrics
  }

  // Emit realtime dashboard update
  const emitDashboardUpdate = async () => {
    try {
      const metrics = generateRandomMetrics()
      const data = {
        metrics,
        timestamp: new Date().toISOString()
      }

      await realtime.dashboard.update.emit(data)
      setUpdateCount(prev => prev + 1)

      console.log("Realtime simulator emitted update:", data)
    } catch (error) {
      console.error("Error emitting realtime update:", error)
    }
  }

  // Start automatic updates
  const startSimulation = () => {
    if (isRunning) return

    setIsRunning(true)
    emitDashboardUpdate() // Emit immediately

    const id = setInterval(() => {
      emitDashboardUpdate()
    }, 8000) // Every 8 seconds for demo purposes

    setIntervalId(id)
  }

  // Stop automatic updates
  const stopSimulation = () => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
    }
    setIsRunning(false)
  }

  // Manual update
  const manualUpdate = () => {
    emitDashboardUpdate()
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [intervalId])

  return (
    <Card className="admin-card admin-card-hover">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="h-5 w-5 text-admin-info-500" />
          Simulador de Actualizaciones en Tiempo Real
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={isRunning ? "default" : "secondary"} className={isRunning ? "bg-admin-success-500" : ""}>
              {isRunning ? "Ejecutándose" : "Detenido"}
            </Badge>
            <span className="text-sm text-slate-600">
              Actualizaciones: {updateCount}
            </span>
          </div>
          <div className="text-xs text-slate-500">
            Cada 8 segundos
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={startSimulation}
            disabled={isRunning}
            size="sm"
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            Iniciar
          </Button>

          <Button
            onClick={stopSimulation}
            disabled={!isRunning}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Square className="h-4 w-4" />
            Detener
          </Button>

          <Button
            onClick={manualUpdate}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Manual
          </Button>
        </div>

        <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
          💡 Este simulador demuestra actualizaciones en tiempo real usando Upstash Realtime.
          Las tarjetas de métricas se actualizarán automáticamente cuando se emitan eventos.
        </div>
      </CardContent>
    </Card>
  )
}


