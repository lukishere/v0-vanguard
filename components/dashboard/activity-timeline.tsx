"use client"

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
  Clock
} from "lucide-react"
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

interface ActivityTimelineProps {
  activities: ClientActivity[]
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
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

  const groupedActivities = groupActivitiesByDate(activities)

  if (activities.length === 0) {
    return (
      <div className="text-center py-12 rounded-3xl border border-white/20 bg-slate-800/60">
        <p className="text-white/70">Aún no tienes actividad registrada.</p>
        <p className="text-sm text-white/50 mt-2">Tu actividad aparecerá aquí cuando interactúes con las demos.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedActivities).map(([dateGroup, groupActivities]) => (
        <div key={dateGroup}>
          <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
            {dateGroup}
          </h3>
          <div className="relative pl-8 space-y-6">
            {/* Timeline line */}
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-white/10" />

            {groupActivities.map((activity) => {
              const IconComponent = ACTIVITY_ICON_MAP[activity.type] || Play

              return (
              <div key={activity.id} className="relative flex items-start gap-4">
                {/* Icon */}
                <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/60 border border-white/30">
                    <IconComponent className="h-4 w-4 text-vanguard-blue" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/90">{activity.description}</p>
                  {activity.metadata?.demoName && (
                    <p className="text-xs text-vanguard-300 mt-1">
                      Demo: {activity.metadata.demoName}
                    </p>
                  )}
                  <p className="text-xs text-white/50 mt-1">
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
