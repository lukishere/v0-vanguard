"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Clock,
  Users,
  Bell,
  CheckCircle,
  AlertCircle,
  MapPin,
  Phone,
  Video,
  ExternalLink,
  Plus,
  BellOff,
  BellRing,
  Calendar as CalendarIcon,
  MoreHorizontal
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format, isToday, isTomorrow, isThisWeek, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type MilestoneType = "meeting" | "deadline" | "demo" | "presentation" | "review" | "training"
type MilestoneStatus = "upcoming" | "today" | "overdue" | "completed"
type NotificationStatus = "none" | "pending" | "sent" | "read"

type Milestone = {
  id: string
  title: string
  description: string
  type: MilestoneType
  status: MilestoneStatus
  date: string
  time: string
  duration?: number // minutos
  attendees?: string[]
  location?: string
  meetingType?: "in-person" | "virtual" | "phone"
  meetingLink?: string
  priority: "low" | "medium" | "high" | "critical"
  assignedTo: string[]
  client?: string
  clientId?: string
  notificationStatus: NotificationStatus
  reminderSent: boolean
  notes?: string
  relatedItems?: {
    type: "demo" | "request" | "project"
    id: string
    title: string
  }[]
}

type EnhancedMilestonesProps = {
  milestones: Milestone[]
  onStatusChange?: (milestoneId: string, status: MilestoneStatus) => Promise<void>
  onNotificationToggle?: (milestoneId: string) => Promise<void>
  onAddMilestone?: () => void
  onEditMilestone?: (milestoneId: string) => Promise<void>
}

const typeConfig = {
  meeting: {
    icon: Users,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10 border-blue-500/20",
    label: "Reunión"
  },
  deadline: {
    icon: Clock,
    color: "text-rose-400",
    bgColor: "bg-rose-500/10 border-rose-500/20",
    label: "Fecha límite"
  },
  demo: {
    icon: Calendar,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10 border-purple-500/20",
    label: "Demo"
  },
  presentation: {
    icon: Users,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10 border-emerald-500/20",
    label: "Presentación"
  },
  review: {
    icon: CheckCircle,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10 border-amber-500/20",
    label: "Revisión"
  },
  training: {
    icon: Users,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10 border-indigo-500/20",
    label: "Entrenamiento"
  }
}

const priorityConfig = {
  low: { color: "text-gray-400", label: "Baja" },
  medium: { color: "text-blue-400", label: "Media" },
  high: { color: "text-orange-400", label: "Alta" },
  critical: { color: "text-rose-400", label: "Crítica" }
}

export function EnhancedMilestones({
  milestones,
  onStatusChange,
  onNotificationToggle,
  onAddMilestone,
  onEditMilestone
}: EnhancedMilestonesProps) {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)
  const [filter, setFilter] = useState<"all" | "today" | "week" | "overdue">("all")

  // Default handlers if not provided
  const handleStatusChange = async (milestoneId: string, status: MilestoneStatus) => {
    if (onStatusChange) {
      await onStatusChange(milestoneId, status)
    } else {
      console.log(`Milestone ${milestoneId} status changed to ${status}`)
      // In a real implementation, this would update the server state
    }
  }

  const handleNotificationToggle = async (milestoneId: string) => {
    if (onNotificationToggle) {
      await onNotificationToggle(milestoneId)
    } else {
      console.log(`Notification toggled for ${milestoneId}`)
      // In a real implementation, this would update notification settings
    }
  }

  const handleAddMilestone = () => {
    if (onAddMilestone) {
      onAddMilestone()
    } else {
      console.log("Add new milestone")
      // In a real implementation, this would open an add milestone dialog
    }
  }

  const handleEditMilestone = async (milestoneId: string) => {
    if (onEditMilestone) {
      await onEditMilestone(milestoneId)
    } else {
      console.log(`Edit milestone ${milestoneId}`)
      // In a real implementation, this would open an edit dialog
    }
  }

  const getFilteredMilestones = () => {
    const now = new Date()
    return milestones.filter(milestone => {
      const milestoneDate = parseISO(milestone.date)

      switch (filter) {
        case "today":
          return isToday(milestoneDate)
        case "week":
          return isThisWeek(milestoneDate) || isToday(milestoneDate)
        case "overdue":
          return milestone.status === "overdue"
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

  const getMeetingIcon = (type?: string) => {
    switch (type) {
      case "virtual":
        return <Video className="h-3 w-3" />
      case "phone":
        return <Phone className="h-3 w-3" />
      default:
        return <MapPin className="h-3 w-3" />
    }
  }

  const filteredMilestones = getFilteredMilestones()
  const upcomingCount = milestones.filter(m => m.status === "upcoming").length
  const todayCount = milestones.filter(m => isToday(parseISO(m.date))).length
  const overdueCount = milestones.filter(m => m.status === "overdue").length

  return (
    <>
      <Card className="admin-card admin-card-hover text-slate-800 border-0">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900">
                <div className="p-2 rounded-lg bg-gradient-to-br from-admin-info-500 to-admin-info-600 text-white shadow-lg">
                  <CalendarIcon className="h-5 w-5" />
                </div>
                Próximos hitos
              </CardTitle>
              <div className="flex items-center gap-1">
                {todayCount > 0 && (
                  <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-400">
                    {todayCount} hoy
                  </Badge>
                )}
                {overdueCount > 0 && (
                  <Badge variant="outline" className="text-xs border-rose-500/50 text-rose-400">
                    {overdueCount} vencidos
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("all")}
                  className="text-xs h-7"
                >
                  Todos ({milestones.length})
                </Button>
                <Button
                  variant={filter === "today" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("today")}
                  className="text-xs h-7"
                >
                  Hoy ({todayCount})
                </Button>
                <Button
                  variant={filter === "week" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("week")}
                  className="text-xs h-7"
                >
                  Semana
                </Button>
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={handleAddMilestone}
                className="bg-vanguard-blue text-white hover:bg-vanguard-blue/90 border-vanguard-blue"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredMilestones.length > 0 ? filteredMilestones.map((milestone) => {
            const type = typeConfig[milestone.type]
            const priority = priorityConfig[milestone.priority]
            const TypeIcon = type.icon
            const isOverdue = milestone.status === "overdue"

            return (
              <div
                key={milestone.id}
                className={cn(
                  "rounded-lg border p-4 space-y-3 transition-all duration-200 hover:scale-[1.01] cursor-pointer",
                  type.bgColor,
                  isOverdue && "border-rose-500/50 bg-rose-500/5"
                )}
                onClick={() => setSelectedMilestone(milestone)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={cn(
                      "mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full border",
                      type.bgColor
                    )}>
                      <TypeIcon className={cn("h-4 w-4", type.color)} />
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-slate-900">{milestone.title}</h3>
                        <Badge className={cn("text-xs", priority.color)}>
                          {priority.label}
                        </Badge>
                        {milestone.status === "completed" && (
                          <CheckCircle className="h-4 w-4 text-admin-success-500" />
                        )}
                        {isOverdue && (
                          <AlertCircle className="h-4 w-4 text-admin-error-500" />
                        )}
                      </div>

                      <p className="text-sm text-slate-600">{milestone.description}</p>

                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span className={cn(
                            isOverdue && "text-rose-400 font-medium"
                          )}>
                            {getDateLabel(milestone.date)} a las {milestone.time}
                          </span>
                        </div>

                        {milestone.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{milestone.duration}min</span>
                          </div>
                        )}

                        {milestone.location && (
                          <div className="flex items-center gap-1">
                            {getMeetingIcon(milestone.meetingType)}
                            <span>{milestone.location}</span>
                          </div>
                        )}

                        {milestone.attendees && (
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{milestone.attendees.length} asistentes</span>
                          </div>
                        )}
                      </div>

                      {milestone.client && (
                        <p className="text-xs text-slate-500">
                          Cliente: <span className="font-medium text-slate-700">{milestone.client}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleNotificationToggle(milestone.id)
                      }}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      {milestone.notificationStatus === "none" ? (
                        <BellOff className="h-4 w-4" />
                      ) : (
                        <BellRing className="h-4 w-4" />
                      )}
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="border-white/20 bg-slate-900 text-white">
                        <DropdownMenuItem onClick={() => handleEditMilestone(milestone.id)}>
                          Editar hito
                        </DropdownMenuItem>
                        {milestone.meetingLink && (
                          <DropdownMenuItem className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            Unirse a reunión
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(milestone.id, "completed")}
                          disabled={milestone.status === "completed"}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Marcar completado
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {milestone.relatedItems && milestone.relatedItems.length > 0 && (
                  <div className="pt-2 border-t border-slate-200">
                    <p className="text-xs text-slate-500 mb-2">Elementos relacionados:</p>
                    <div className="flex flex-wrap gap-1">
                      {milestone.relatedItems.map((item, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-slate-300 text-slate-600">
                          {item.title}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          }) : (
            <div className="text-center py-8 text-slate-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p>No hay hitos que coincidan con el filtro seleccionado</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Milestone details dialog */}
      <Dialog open={!!selectedMilestone} onOpenChange={() => setSelectedMilestone(null)}>
        <DialogContent className="border-white/20 bg-slate-900 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedMilestone && (
                <>
                  {React.createElement(typeConfig[selectedMilestone.type].icon, {
                    className: cn("h-5 w-5", typeConfig[selectedMilestone.type].color)
                  })}
                  {selectedMilestone.title}
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedMilestone && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-white/70 mb-1">Tipo</p>
                  <Badge className={cn(typeConfig[selectedMilestone.type].bgColor, typeConfig[selectedMilestone.type].color)}>
                    {typeConfig[selectedMilestone.type].label}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-white/70 mb-1">Prioridad</p>
                  <Badge className={priorityConfig[selectedMilestone.priority].color}>
                    {priorityConfig[selectedMilestone.priority].label}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-white/70 mb-1">Fecha y hora</p>
                  <p className="text-white">{getDateLabel(selectedMilestone.date)} a las {selectedMilestone.time}</p>
                </div>

                <div>
                  <p className="text-sm text-white/70 mb-1">Estado</p>
                  <Badge className={cn(
                    selectedMilestone.status === "completed" ? "text-emerald-400" :
                    selectedMilestone.status === "overdue" ? "text-rose-400" :
                    "text-blue-400"
                  )}>
                    {selectedMilestone.status === "completed" ? "Completado" :
                     selectedMilestone.status === "overdue" ? "Vencido" :
                     selectedMilestone.status === "today" ? "Hoy" : "Próximo"}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm text-white/70 mb-2">Descripción</p>
                <p className="text-white">{selectedMilestone.description}</p>
              </div>

              {selectedMilestone.attendees && selectedMilestone.attendees.length > 0 && (
                <div>
                  <p className="text-sm text-white/70 mb-2">Asistentes</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedMilestone.attendees.map((attendee, index) => (
                      <Badge key={index} variant="outline" className="border-white/20 text-white/70">
                        {attendee}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedMilestone.notes && (
                <div>
                  <p className="text-sm text-white/70 mb-2">Notas</p>
                  <p className="text-white/80">{selectedMilestone.notes}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-white/10">
                {selectedMilestone.meetingLink && (
                  <Button className="flex-1">
                    <Video className="h-4 w-4 mr-2" />
                    Unirse a reunión
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => handleEditMilestone(selectedMilestone.id)}
                  className="border-white/20 text-white"
                >
                  Editar
                </Button>
                {selectedMilestone.status !== "completed" && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleStatusChange(selectedMilestone.id, "completed")
                      setSelectedMilestone(null)
                    }}
                    className="border-white/20 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Completar
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
