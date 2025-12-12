"use client"

import React, { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  MapPin,
  Phone,
  Video,
  ExternalLink,
  CalendarIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format, isToday, isTomorrow, isThisWeek, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import type { MeetingMilestone } from "@/app/actions/meeting-milestones"

type ClientMilestone = MeetingMilestone

type MilestoneStatus = "pending" | "confirmed" | "upcoming" | "completed" | "cancelled"

const meetingTypeConfig: Record<string, {
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  label: string
}> = {
  demo: {
    icon: Calendar,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10 border-blue-500/20",
    label: "Demo guiada"
  },
  consultation: {
    icon: Users,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10 border-emerald-500/20",
    label: "Consulta"
  },
  implementation: {
    icon: ExternalLink,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10 border-purple-500/20",
    label: "Implementación"
  },
  "demo-call": {
    icon: Calendar,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10 border-blue-500/20",
    label: "Llamada demo"
  },
  "technical-session": {
    icon: Users,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10 border-emerald-500/20",
    label: "Sesión técnica"
  },
  "contract-review": {
    icon: ExternalLink,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10 border-purple-500/20",
    label: "Revisión de contrato"
  },
  "onboarding-session": {
    icon: Users,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10 border-indigo-500/20",
    label: "Sesión de onboarding"
  },
  "follow-up": {
    icon: Phone,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10 border-cyan-500/20",
    label: "Seguimiento"
  },
  training: {
    icon: Users,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10 border-amber-500/20",
    label: "Entrenamiento"
  },
  "support-call": {
    icon: Phone,
    color: "text-rose-400",
    bgColor: "bg-rose-500/10 border-rose-500/20",
    label: "Llamada de soporte"
  }
}

// Default config for unknown types
const defaultMeetingTypeConfig = {
  icon: Calendar,
  color: "text-gray-400",
  bgColor: "bg-gray-500/10 border-gray-500/20",
  label: "Reunión"
}

const statusConfig = {
  pending: { color: "text-amber-400", label: "Pendiente", bgColor: "bg-amber-500/10 border-amber-500/20" },
  confirmed: { color: "text-blue-400", label: "Confirmada", bgColor: "bg-blue-500/10 border-blue-500/20" },
  upcoming: { color: "text-green-400", label: "Próxima", bgColor: "bg-green-500/10 border-green-500/20" },
  completed: { color: "text-gray-400", label: "Completada", bgColor: "bg-gray-500/10 border-gray-500/20" },
  cancelled: { color: "text-red-400", label: "Cancelada", bgColor: "bg-red-500/10 border-red-500/20" }
}

interface ClientMilestonesProps {
  milestones: ClientMilestone[]
}

// Helper to derive status from milestone
const getMilestoneStatus = (milestone: ClientMilestone): MilestoneStatus => {
  if (milestone.completedAt) {
    return "completed"
  }
  if (milestone.scheduledFor) {
    const scheduledDate = parseISO(milestone.scheduledFor)
    const now = new Date()
    if (scheduledDate < now) {
      return "completed"
    }
    if (isToday(scheduledDate) || isTomorrow(scheduledDate)) {
      return "upcoming"
    }
    return "confirmed"
  }
  return "pending"
}

export function ClientMilestones({ milestones }: ClientMilestonesProps) {
  const [filter, setFilter] = useState<"all" | "upcoming" | "pending" | "confirmed">("all")

  // Filtrar solo hitos activos (no completados ni cancelados)
  const activeMilestones = milestones.filter(m => {
    const status = getMilestoneStatus(m)
    return status !== "completed" && status !== "cancelled"
  })

  const getFilteredMilestones = () => {
    return activeMilestones.filter(milestone => {
      const status = getMilestoneStatus(milestone)
      switch (filter) {
        case "upcoming":
          return status === "confirmed" || status === "upcoming"
        case "pending":
          return status === "pending"
        case "confirmed":
          return status === "confirmed"
        default:
          return true
      }
    })
  }

  const getDateLabel = (dateString: string) => {
    const date = parseISO(dateString)
    if (isToday(date)) return "Hoy"
    if (isTomorrow(date)) return "Mañana"
    return format(date, "EEEE d 'de' MMMM", { locale: es })
  }

  const filteredMilestones = getFilteredMilestones()
  const pendingCount = activeMilestones.filter(m => getMilestoneStatus(m) === "pending").length
  const confirmedCount = activeMilestones.filter(m => getMilestoneStatus(m) === "confirmed").length
  const upcomingCount = activeMilestones.filter(m => {
    const status = getMilestoneStatus(m)
    return status === "upcoming" || status === "confirmed"
  }).length

  return (
    <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-vanguard-blue/20 via-white/5 to-vanguard-red/30 p-8 shadow-2xl backdrop-blur">
      <div className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="flex items-center gap-3 text-xl font-bold text-white">
              <div className="p-2 rounded-lg bg-gradient-to-br from-vanguard-blue/20 to-vanguard-red/30 text-slate-900 shadow-lg">
                <CalendarIcon className="h-5 w-5" />
              </div>
              Próximos hitos
            </h2>
            <div className="flex items-center gap-1">
              {pendingCount > 0 && (
                <Badge variant="outline" className="text-xs border-amber-400/70 text-amber-200 bg-amber-500/10">
                  {pendingCount} pendiente{pendingCount !== 1 ? 's' : ''}
                </Badge>
              )}
              {confirmedCount > 0 && (
                <Badge variant="outline" className="text-xs border-blue-400/70 text-blue-200 bg-blue-500/10">
                  {confirmedCount} confirmada{confirmedCount !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-1 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilter("all")}
            className={cn(
              "text-xs h-7 border-slate-600 bg-slate-800/50 text-slate-200 hover:bg-slate-700 hover:text-white",
              filter === "all" && "bg-slate-600 text-white border-slate-500"
            )}
          >
            Todos ({activeMilestones.length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilter("pending")}
            className={cn(
              "text-xs h-7 border-amber-600 bg-amber-900/50 text-amber-200 hover:bg-amber-800 hover:text-amber-100",
              filter === "pending" && "bg-amber-700 text-white border-amber-500"
            )}
          >
            Pendientes ({pendingCount})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilter("confirmed")}
            className={cn(
              "text-xs h-7 border-blue-600 bg-blue-900/50 text-blue-200 hover:bg-blue-800 hover:text-blue-100",
              filter === "confirmed" && "bg-blue-700 text-white border-blue-500"
            )}
          >
            Confirmadas ({confirmedCount})
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredMilestones.length > 0 ? filteredMilestones.map((milestone) => {
          // Map milestone.type to meetingTypeConfig, with fallback
          const meetingTypeKey = milestone.type || "demo"
          const meetingType = meetingTypeConfig[meetingTypeKey] || defaultMeetingTypeConfig
          const status = getMilestoneStatus(milestone)
          const statusConfigItem = statusConfig[status] || statusConfig.pending
          const MeetingTypeIcon = meetingType.icon

          // Parse scheduledFor to get date and time
          const scheduledDate = milestone.scheduledFor ? parseISO(milestone.scheduledFor) : null
          const dateStr = scheduledDate ? format(scheduledDate, "yyyy-MM-dd") : ""
          const timeStr = scheduledDate ? format(scheduledDate, "HH:mm") : ""

          return (
            <div
              key={milestone.id}
              className={cn(
                "rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm p-4 space-y-3 transition-all duration-200",
                "hover:bg-white/10 hover:scale-[1.01] cursor-pointer"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={cn(
                    "mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full border",
                    statusConfigItem.bgColor
                  )}>
                    <MeetingTypeIcon className={cn("h-4 w-4", meetingType.color)} />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-white">{milestone.title}</h3>
                      <Badge className={cn("text-xs", statusConfigItem.color, "bg-white/10 border-white/20 text-white")}>
                        {statusConfigItem.label}
                      </Badge>
                    </div>

                    {milestone.description && (
                      <p className="text-sm text-white/70">{milestone.description}</p>
                    )}

                    {scheduledDate && (
                      <div className="flex items-center gap-4 text-xs text-white/60">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span className={cn(
                            status === "pending" && "text-amber-300 font-medium"
                          )}>
                            {getDateLabel(dateStr)} a las {timeStr}
                          </span>
                        </div>

                        {milestone.demoName && (
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-white/80">{milestone.demoName}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {milestone.notes && (
                      <p className="text-xs text-white/50 italic">
                        "{milestone.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {status === "confirmed" && (
                    <div className="text-right text-xs text-white/70">
                      <div>Confirmada</div>
                      {milestone.scheduledFor && (
                        <div>{format(parseISO(milestone.scheduledFor), "d/MM/yyyy")}</div>
                      )}
                    </div>
                  )}
                  {status === "pending" && (
                    <div className="text-right text-xs text-amber-300">
                      <div>Esperando</div>
                      <div>confirmación</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        }) : (
          <div className="text-center py-8 text-white/70">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-white/40" />
            <p>No hay hitos que coincidan con el filtro seleccionado</p>
            {filter === "all" && activeMilestones.length === 0 && (
              <p className="text-sm mt-2">Solicita una reunión para ver tus próximos hitos aquí</p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
