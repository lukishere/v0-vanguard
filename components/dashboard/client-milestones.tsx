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
import type { MeetingMilestone, MilestoneStatus } from "@/app/actions/meeting-milestones"

type ClientMilestone = MeetingMilestone

const meetingTypeConfig = {
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
  }
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

export function ClientMilestones({ milestones }: ClientMilestonesProps) {
  const [filter, setFilter] = useState<"all" | "upcoming" | "pending" | "confirmed">("all")

  // Filtrar solo hitos activos (no completados ni cancelados)
  const activeMilestones = milestones.filter(m =>
    m.status !== "completed" && m.status !== "cancelled"
  )

  const getFilteredMilestones = () => {
    const now = new Date()
    return activeMilestones.filter(milestone => {
      switch (filter) {
        case "upcoming":
          return milestone.status === "confirmed" || milestone.status === "upcoming"
        case "pending":
          return milestone.status === "pending"
        case "confirmed":
          return milestone.status === "confirmed"
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
  const pendingCount = activeMilestones.filter(m => m.status === "pending").length
  const confirmedCount = activeMilestones.filter(m => m.status === "confirmed").length
  const upcomingCount = activeMilestones.filter(m => m.status === "upcoming" || m.status === "confirmed").length

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
          const meetingType = meetingTypeConfig[milestone.meetingType]
          const status = statusConfig[milestone.status]
          const MeetingTypeIcon = meetingType.icon

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
                    status.bgColor
                  )}>
                    <MeetingTypeIcon className={cn("h-4 w-4", meetingType.color)} />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-white">{milestone.title}</h3>
                      <Badge className={cn("text-xs", status.color, "bg-white/10 border-white/20 text-white")}>
                        {status.label}
                      </Badge>
                    </div>

                    <p className="text-sm text-white/70">{milestone.description}</p>

                    <div className="flex items-center gap-4 text-xs text-white/60">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span className={cn(
                          milestone.status === "pending" && "text-amber-300 font-medium"
                        )}>
                          {getDateLabel(milestone.preferredDate)} a las {milestone.preferredTime}
                        </span>
                      </div>

                      {milestone.productType && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-white/80">{milestone.productType}</span>
                        </div>
                      )}
                    </div>

                    {milestone.notes && (
                      <p className="text-xs text-white/50 italic">
                        "{milestone.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {milestone.status === "confirmed" && (
                    <div className="text-right text-xs text-white/70">
                      <div>Confirmada</div>
                      {milestone.confirmedAt && (
                        <div>{format(parseISO(milestone.confirmedAt), "d/MM/yyyy")}</div>
                      )}
                    </div>
                  )}
                  {milestone.status === "pending" && (
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
