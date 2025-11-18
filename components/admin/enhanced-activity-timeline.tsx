"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Activity,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Eye,
  MessageSquare,
  Calendar,
  Users,
  ExternalLink,
  MoreHorizontal
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ActivityType = "feedback" | "meeting" | "access" | "demo"

type EnhancedActivity = {
  id: string
  title: string
  description: string
  timestamp: string
  type: ActivityType
  clientId: string
  clientEmail: string
  priority?: "high" | "medium" | "low"
  expanded?: boolean
  metadata?: {
    demoName?: string
    feedbackScore?: number
    meetingType?: string
    actionRequired?: boolean
  }
}

type EnhancedActivityTimelineProps = {
  activities: EnhancedActivity[]
  title?: string
  maxItems?: number
}

const typeConfig = {
  feedback: {
    icon: MessageSquare,
    color: "text-admin-feedback-600",
    bgColor: "admin-activity-feedback",
    label: "Feedback"
  },
  meeting: {
    icon: Calendar,
    color: "text-admin-meeting-700",
    bgColor: "admin-activity-meeting",
    label: "Reunión"
  },
  access: {
    icon: Users,
    color: "text-admin-access-700",
    bgColor: "admin-activity-access",
    label: "Acceso"
  },
  demo: {
    icon: Activity,
    color: "text-admin-demo-700",
    bgColor: "admin-activity-demo",
    label: "Demo"
  }
}

export function EnhancedActivityTimeline({
  activities,
  title = "Actividad reciente",
  maxItems = 10
}: EnhancedActivityTimelineProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<ActivityType[]>([])
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [showAll, setShowAll] = useState(false)

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(activity.type)

    return matchesSearch && matchesType
  })

  const displayedActivities = showAll ? filteredActivities : filteredActivities.slice(0, maxItems)

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const toggleTypeFilter = (type: ActivityType) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case "high":
        return <Badge className="text-xs bg-admin-error-500 hover:bg-admin-error-600 text-white border-0">Alta</Badge>
      case "medium":
        return <Badge className="text-xs bg-admin-warning-500 hover:bg-admin-warning-600 text-white border-0">Media</Badge>
      case "low":
        return <Badge variant="outline" className="text-xs border-slate-300 text-slate-600 hover:bg-slate-50">Baja</Badge>
      default:
        return null
    }
  }

  return (
    <Card className="admin-card admin-card-hover text-slate-800 border-0">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900">
            <div className="p-2 rounded-lg bg-gradient-to-br from-admin-info-500 to-admin-info-600 text-white shadow-lg">
              <Activity className="h-5 w-5" />
            </div>
            {title}
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Buscar actividad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:border-admin-info-500 focus:ring-admin-info-500/20"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-admin-info-500">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                  {selectedTypes.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-4 w-4 rounded-full p-0 text-xs bg-admin-info-500 text-white">
                      {selectedTypes.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-slate-200 bg-white text-slate-900 shadow-lg">
                {Object.entries(typeConfig).map(([type, config]) => (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => toggleTypeFilter(type as ActivityType)}
                    className="flex items-center gap-2"
                  >
                    <div className={cn(
                      "h-3 w-3 rounded-full",
                      selectedTypes.includes(type as ActivityType) ? config.color : "bg-white/20"
                    )} />
                    {config.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayedActivities.length > 0 ? displayedActivities.map((activity) => {
          const config = typeConfig[activity.type]
          const Icon = config.icon
          const isExpanded = expandedItems.has(activity.id)

          return (
            <div
              key={activity.id}
              className={cn(
                "rounded-xl border border-white/10 bg-slate-900/40 p-4 transition-all duration-200 hover:bg-slate-900/60",
                config.bgColor
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10",
                  config.bgColor
                )}>
                  <Icon className={cn("h-4 w-4", config.color)} />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                        {getPriorityBadge(activity.priority)}
                        <Badge variant="outline" className="text-xs border-slate-300 text-slate-600">
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600">{activity.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <p className="text-xs text-slate-500">{activity.timestamp}</p>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="border-white/20 bg-slate-900 text-white">
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            Ir al cliente
                          </DropdownMenuItem>
                          {activity.metadata?.actionRequired && (
                            <DropdownMenuItem className="flex items-center gap-2 text-amber-400">
                              <Calendar className="h-4 w-4" />
                              Programar seguimiento
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {activity.metadata && (
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        {activity.metadata.demoName && (
                          <span>Demo: {activity.metadata.demoName}</span>
                        )}
                        {activity.metadata.feedbackScore && (
                          <span>Puntuación: {activity.metadata.feedbackScore}/5</span>
                        )}
                        {activity.metadata.meetingType && (
                          <span>Tipo: {activity.metadata.meetingType}</span>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(activity.id)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}

                  {isExpanded && activity.metadata && (
                    <div className="pt-2 border-t border-slate-200 space-y-2">
                      <div className="text-xs text-slate-600 space-y-1">
                        <p><strong>ID Cliente:</strong> {activity.clientId}</p>
                        <p><strong>Email:</strong> {activity.clientEmail}</p>
                        {activity.metadata.actionRequired && (
                          <p className="text-amber-400"><strong>⚠️ Acción requerida:</strong> Esta actividad necesita seguimiento</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        }) : (
          <div className="text-center py-8 text-slate-500">
            <Activity className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p>No hay actividades que coincidan con los filtros</p>
          </div>
        )}

        {filteredActivities.length > maxItems && (
          <div className="text-center pt-4">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            >
              {showAll ? "Mostrar menos" : `Mostrar ${filteredActivities.length - maxItems} más`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
