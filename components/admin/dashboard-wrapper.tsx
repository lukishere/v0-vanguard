'use client'

import { useEffect, useState } from 'react'
import { DashboardHeader } from './real-time-status'
import { MetricsCard } from './metrics-card'
import { EnhancedActivityTimeline } from './enhanced-activity-timeline'
import { EnhancedAdoptionPipeline } from './enhanced-adoption-pipeline'
import { EnhancedMilestonesWrapper } from './enhanced-milestones-wrapper'
import { RealtimeSimulator } from './realtime-simulator'

interface DashboardData {
  dynamicMetrics: any[]
  recentActivities: any[]
  adoptionPipeline: any[]
  activeClients: number
  convertedMilestones: any[]
}

export function DashboardWrapper() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const response = await fetch('/api/admin/dashboard')
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }
        const dashboardData = await response.json()
        setData(dashboardData)
      } catch (err) {
        console.error('Error loading dashboard data:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Cargando dashboard...</div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-400">Error: {error || 'No data available'}</div>
      </div>
    )
  }

  const { dynamicMetrics, recentActivities, adoptionPipeline, activeClients, convertedMilestones } = data

  return (
    <div className="space-y-10">
      <DashboardHeader
        title="Resumen ejecutivo"
        description="Visión general de clientes activos, adopción de demos y prioridades para el equipo de cuentas."
        enabled={true}
        interval={60000} // 1 minute refresh
      />

      <section className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dynamicMetrics.map((metric) => (
            <MetricsCard key={metric.title} {...metric} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-3">
          <EnhancedActivityTimeline activities={recentActivities} />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <EnhancedAdoptionPipeline
          stages={adoptionPipeline}
          totalActiveClients={activeClients}
        />

        <EnhancedMilestonesWrapper
          milestones={convertedMilestones}
        />
      </section>

      {/* Realtime Controls */}
      <section className="flex justify-end">
        <RealtimeSimulator />
      </section>
    </div>
  )
}
