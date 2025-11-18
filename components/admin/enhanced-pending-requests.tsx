"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Calendar,
  User,
  Search,
  Filter,
  ArrowRight,
  Phone,
  Mail,
  MoreHorizontal
} from "lucide-react"
import { cn } from "@/lib/utils"
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
import { Textarea } from "@/components/ui/textarea"

type RequestStatus = "pending" | "in-progress" | "completed" | "cancelled"
type RequestPriority = "alta" | "media" | "baja"

type EnhancedPendingRequest = {
  id: string
  client: string
  clientId: string
  clientEmail: string
  request: string
  priority: RequestPriority
  submittedAt: string
  status: RequestStatus
  assignedTo?: string
  estimatedCompletion?: string
  notes?: string
  category?: string
  contactMethod?: "email" | "phone" | "meeting"
}

type EnhancedPendingRequestsProps = {
  requests: EnhancedPendingRequest[]
}

const priorityConfig = {
  alta: {
    color: "bg-rose-500/20 text-rose-200 border-rose-500/30",
    label: "Alta",
    icon: "🔴"
  },
  media: {
    color: "bg-amber-500/20 text-amber-200 border-amber-500/30",
    label: "Media",
    icon: "🟡"
  },
  baja: {
    color: "bg-emerald-500/20 text-emerald-200 border-emerald-500/30",
    label: "Baja",
    icon: "🟢"
  }
}

const statusConfig = {
  pending: {
    color: "bg-gray-500/20 text-gray-200 border-gray-500/30",
    label: "Pendiente",
    icon: Clock
  },
  "in-progress": {
    color: "bg-blue-500/20 text-blue-200 border-blue-500/30",
    label: "En Progreso",
    icon: MessageSquare
  },
  completed: {
    color: "bg-emerald-500/20 text-emerald-200 border-emerald-500/30",
    label: "Completada",
    icon: CheckCircle
  },
  cancelled: {
    color: "bg-red-500/20 text-red-200 border-red-500/30",
    label: "Cancelada",
    icon: XCircle
  }
}

export function EnhancedPendingRequests({
  requests
}: EnhancedPendingRequestsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPriority, setSelectedPriority] = useState<RequestPriority | "all">("all")
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | "all">("all")
  const [selectedRequest, setSelectedRequest] = useState<EnhancedPendingRequest | null>(null)
  const [noteText, setNoteText] = useState("")

  // Internal handlers for state management
  const handleStatusChange = (requestId: string, status: RequestStatus) => {
    console.log(`Status changed for ${requestId} to ${status}`)
    // In a real implementation, this would update the server state
    // For now, we'll just log it
  }

  const handleAssign = (requestId: string, assignee: string) => {
    console.log(`Assigned ${requestId} to ${assignee}`)
    // In a real implementation, this would update the server state
  }

  const handleAddNote = () => {
    if (selectedRequest && noteText.trim()) {
      console.log(`Added note to ${selectedRequest.id}: ${noteText}`)
      // In a real implementation, this would save the note to the server
      setNoteText("")
      setSelectedRequest(null)
    }
  }

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.request.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPriority = selectedPriority === "all" || request.priority === selectedPriority
    const matchesStatus = selectedStatus === "all" || request.status === selectedStatus

    return matchesSearch && matchesPriority && matchesStatus
  })

  const getContactIcon = (method?: string) => {
    switch (method) {
      case "phone":
        return <Phone className="h-3 w-3" />
      case "meeting":
        return <Calendar className="h-3 w-3" />
      default:
        return <Mail className="h-3 w-3" />
    }
  }

  return (
    <>
      <Card className="border-white/10 bg-white/5 text-white backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-white">Solicitudes pendientes</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                <Input
                  placeholder="Buscar solicitudes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48 border-white/20 bg-white/5 text-white placeholder:text-white/50"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="border-white/20 bg-white/5 text-white">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border-white/20 bg-slate-900 text-white">
                  <div className="p-2 space-y-2">
                    <div>
                      <p className="text-xs font-medium mb-1">Prioridad</p>
                      <div className="flex gap-1">
                        {["all", "alta", "media", "baja"].map((priority) => (
                          <Button
                            key={priority}
                            variant={selectedPriority === priority ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedPriority(priority as RequestPriority | "all")}
                            className="text-xs h-6"
                          >
                            {priority === "all" ? "Todas" : priorityConfig[priority as RequestPriority].label}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-1">Estado</p>
                      <div className="flex gap-1">
                        {["all", "pending", "in-progress", "completed", "cancelled"].map((status) => (
                          <Button
                            key={status}
                            variant={selectedStatus === status ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedStatus(status as RequestStatus | "all")}
                            className="text-xs h-6"
                          >
                            {status === "all" ? "Todos" : statusConfig[status as RequestStatus].label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredRequests.length > 0 ? filteredRequests.map((request) => {
            const priority = priorityConfig[request.priority]
            const status = statusConfig[request.status]
            const StatusIcon = status.icon

            return (
              <div key={request.id} className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{request.client}</span>
                      <Badge className={cn("text-xs", priority.color)}>
                        {priority.icon} {priority.label}
                      </Badge>
                      <Badge className={cn("text-xs flex items-center gap-1", status.color)}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                      {request.contactMethod && (
                        <div className="flex items-center gap-1 text-white/60">
                          {getContactIcon(request.contactMethod)}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-white/70">{request.request}</p>
                    <div className="flex items-center gap-4 text-xs text-white/50">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {request.submittedAt}
                      </span>
                      {request.assignedTo && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {request.assignedTo}
                        </span>
                      )}
                      {request.estimatedCompletion && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Est. {request.estimatedCompletion}
                        </span>
                      )}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="border-white/20 bg-slate-900 text-white">
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(request.id, "in-progress")}
                        disabled={request.status === "in-progress"}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Marcar en progreso
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(request.id, "completed")}
                        disabled={request.status === "completed"}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marcar completada
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setSelectedRequest(request)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Agregar nota
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-amber-400">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Contactar cliente
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {request.notes && (
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-xs text-white/60">
                      <strong>Notas:</strong> {request.notes}
                    </p>
                  </div>
                )}
              </div>
            )
          }) : (
            <div className="text-center py-8 text-white/60">
              <Clock className="h-12 w-12 mx-auto mb-4 text-white/30" />
              <p>No hay solicitudes que coincidan con los filtros</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog for adding notes */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="border-white/20 bg-slate-900 text-white">
          <DialogHeader>
            <DialogTitle>Agregar nota a solicitud</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-white/70 mb-2">
                <strong>Cliente:</strong> {selectedRequest?.client}
              </p>
              <p className="text-sm text-white/70">
                <strong>Solicitud:</strong> {selectedRequest?.request}
              </p>
            </div>
            <Textarea
              placeholder="Escribe una nota sobre esta solicitud..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="border-white/20 bg-white/5 text-white"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedRequest(null)}
                className="border-white/20 text-white"
              >
                Cancelar
              </Button>
              <Button onClick={handleAddNote} disabled={!noteText.trim()}>
                Agregar nota
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
