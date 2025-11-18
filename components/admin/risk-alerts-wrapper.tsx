'use client'

import { useEffect, useState } from 'react'
import { EnhancedRiskAlerts } from './enhanced-risk-alerts'

interface RiskAlert {
  id: string
  type: string
  title: string
  description: string
  level: string
  value: number
  threshold: number
  trend: string
  trendValue: number
  affectedClients: number
  recommendedAction: string
  actionLabel: string
  lastUpdated: string
  category: string
}

export function RiskAlertsWrapper() {
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadRiskAlerts() {
      try {
        // You could create an API route for this, or handle it client-side
        // For now, we'll use a simple approach
        const alerts: RiskAlert[] = [
          {
            id: "expiring-demos",
            type: "expiring",
            title: "Demos por expirar próximamente",
            description: "3 accesos a demos expiran en los próximos 5 días",
            level: "medium",
            value: 3,
            threshold: 3,
            trend: "up",
            trendValue: 15,
            affectedClients: 3,
            recommendedAction: "Contactar clientes para renovación o extensión de acceso",
            actionLabel: "Gestionar renovaciones",
            lastUpdated: "Hace 5 min",
            category: "Expiración"
          },
          {
            id: "inactive-clients",
            type: "inactive",
            title: "Clientes inactivos",
            description: "2 clientes sin actividad en los últimos 30 días",
            level: "low",
            value: 2,
            threshold: 8,
            trend: "stable",
            affectedClients: 2,
            recommendedAction: "Enviar emails de re-engagement y agendar follow-ups",
            actionLabel: "Iniciar re-engagement",
            lastUpdated: "Hace 12 min",
            category: "Inactividad"
          },
          {
            id: "low-feedback",
            type: "feedback",
            title: "Bajo volumen de feedback",
            description: "Solo 2 interacciones de feedback en la última semana",
            level: "low",
            value: 2,
            threshold: 10,
            trend: "down",
            trendValue: 8,
            affectedClients: 2,
            recommendedAction: "Implementar campañas de feedback proactivo y encuestas automatizadas",
            actionLabel: "Mejorar feedback",
            lastUpdated: "Hace 8 min",
            category: "Feedback"
          },
          {
            id: "engagement-risk",
            type: "engagement",
            title: "Riesgo de engagement",
            description: "1 demo con engagement por debajo del promedio",
            level: "low",
            value: 1,
            threshold: 4,
            trend: "up",
            trendValue: 12,
            affectedClients: 1,
            recommendedAction: "Revisar contenido de demos y implementar mejoras de UX",
            actionLabel: "Optimizar demos",
            lastUpdated: "Hace 15 min",
            category: "Engagement"
          }
        ]

        setRiskAlerts(alerts)
      } catch (err) {
        console.error('Error loading risk alerts:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    loadRiskAlerts()
  }, [])

  if (loading) {
    return (
      <div className="space-y-10">
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Gestión de Riesgos</h1>
            <p className="text-white/70">
              Cargando alertas de riesgo...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-10">
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Gestión de Riesgos</h1>
            <p className="text-red-400">
              Error al cargar alertas: {error}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Riesgos</h1>
          <p className="text-white/70">
            Monitorea alertas críticas, clientes inactivos y riesgos de engagement para mantener el crecimiento saludable del negocio.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <EnhancedRiskAlerts alerts={riskAlerts} />
      </div>
    </div>
  )
}
