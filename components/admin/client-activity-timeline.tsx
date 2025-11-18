"use client"

import { useEffect, useState } from "react"
import {
  Send,
  UserPlus,
  ThumbsUp,
  ThumbsDown,
  Play,
  Calendar,
  MessageSquare,
  Mail,
  Briefcase,
  Clock,
  Loader2
} from "lucide-react"
import { getClientActivities } from "@/app/actions/client-activities"
import type { ClientActivity, ActivityType } from "@/lib/activities/constants"

const ACTIVITY_ICON_MAP: Record<ActivityType, any> = {
  "demo-requested": Send,
  "access-additional": Send,
  "waitlist-joined": UserPlus,
  "demo-liked": ThumbsUp,
  "demo-unliked": ThumbsDown,
  "demo-opened": Play,
  "meeting-requested": Calendar,
  "chat-opened": MessageSquare,
  "chat-sales": MessageSquare,
  "message-sent": Mail,
  "service-contracted": Briefcase,
  "demo-extended": Clock,
}

interface ClientActivityTimelineProps {
  clientId: string
}

export function ClientActivityTimeline({ clientId }: ClientActivityTimelineProps) {
  const [activities, setActivities] = useState<ClientActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadActivities = async () => {
      setIsLoading(true)
      try {
        const data = await getClientActivities(clientId)
        setActivities(data)
      } catch (error) {
        console.error("Error cargando actividades:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadActivities()
  }, [clientId])

  const groupActivitiesByDate = (activities: ClientActivity[]) => {
    const groups: Record<string, ClientActivity[]> = {}

    activities.forEach((activity) => {
      const date = new Date(activity.timestamp)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      let key: string
      if (date.toDateString() === today.toDateString()) {
        key = "Hoy"
      } else if (date.toDateString() === yesterday.toDateString()) {
        key = "Ayer"
      } else if (date >= new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)) {
        key = "Esta semana"
      } else if (date >= new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)) {
        key = "Este mes"
      } else {
        key = date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
      }

      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(activity)
    })

    return groups
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-vanguard-blue" />
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-12 rounded-lg border border-slate-200 bg-slate-50">
        <p className="text-slate-600">Este cliente aún no tiene actividad registrada.</p>
        <p className="text-xs text-slate-400 mt-2">
          La actividad aparecerá aquí cuando interactúe con las demos
        </p>
      </div>
    )
  }

  const groupedActivities = groupActivitiesByDate(activities)

  return (
    <div className="space-y-8 mt-4">
      {/* Resumen de actividad */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-vanguard-blue/20 bg-vanguard-blue/5 p-4">
          <p className="text-sm text-slate-600 mb-1">Total Acciones</p>
          <p className="text-2xl font-bold text-vanguard-blue">{activities.length}</p>
        </div>
        <div className="rounded-lg border border-emerald-400/20 bg-emerald-50 p-4">
          <p className="text-sm text-slate-600 mb-1">Últimos 7 días</p>
          <p className="text-2xl font-bold text-emerald-600">
            {activities.filter(a => {
              const daysDiff = (Date.now() - new Date(a.timestamp).getTime()) / (1000 * 60 * 60 * 24)
              return daysDiff <= 7
            }).length}
          </p>
        </div>
        <div className="rounded-lg border border-amber-400/20 bg-amber-50 p-4">
          <p className="text-sm text-slate-600 mb-1">Última Actividad</p>
          <p className="text-sm font-medium text-amber-700">
            {activities.length > 0
              ? new Date(activities[0].timestamp).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short'
                })
              : '-'
            }
          </p>
        </div>
      </div>

      {/* Timeline */}
      {Object.entries(groupedActivities).map(([dateGroup, groupActivities]) => (
        <div key={dateGroup}>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            {dateGroup}
          </h3>
          <div className="relative pl-8 space-y-6">
            {/* Timeline line */}
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-200" />

            {groupActivities.map((activity) => {
              const IconComponent = ACTIVITY_ICON_MAP[activity.type] || Play

              return (
                <div key={activity.id} className="relative flex items-start gap-4">
                  {/* Icon */}
                  <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 border-2 border-vanguard-blue/30">
                    <IconComponent className="h-4 w-4 text-vanguard-blue" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pb-2">
                    <p className="text-sm font-medium text-slate-900">{activity.description}</p>
                    {activity.metadata?.demoName && (
                      <p className="text-xs text-vanguard-blue mt-1 font-medium">
                        Demo: {activity.metadata.demoName}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(activity.timestamp).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
