"use client"

import { EnhancedMilestones, type Milestone } from "./enhanced-milestones"
import { adminUpdateMilestone, adminSendNotification, adminCreateMilestone, getAllMeetingMilestones, type MeetingType } from "@/app/actions/meeting-milestones"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Calendar, Clock, Package, Users } from "lucide-react"
import { servicesContent } from "@/lib/content/services"

interface EnhancedMilestonesWrapperProps {
  milestones: Milestone[]
}

export function EnhancedMilestonesWrapper({ milestones }: EnhancedMilestonesWrapperProps) {
  const { toast } = useToast()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null)
  const [clients, setClients] = useState<Array<{id: string, name: string, email: string}>>([])

  // Estado del formulario de agregar
  const [addForm, setAddForm] = useState({
    title: "",
    description: "",
    meetingType: "demo" as MeetingType,
    productType: "",
    preferredDate: "",
    preferredTime: "",
    clientId: "",
    clientName: "",
    clientEmail: "",
    notes: ""
  })

  // Estado del formulario de editar
  const [editForm, setEditForm] = useState({
    notes: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handler para cambiar el estado de un milestone
  const handleStatusChange = async (milestoneId: string, status: "upcoming" | "today" | "overdue" | "completed") => {
    try {
      // Convertir el status del Milestone al status del MeetingMilestone
      let meetingMilestoneStatus: "upcoming" | "pending" | "confirmed" | "completed" | "cancelled"

      switch (status) {
        case "completed":
          meetingMilestoneStatus = "completed"
          break
        case "today":
        case "upcoming":
          meetingMilestoneStatus = "confirmed"
          break
        case "overdue":
          meetingMilestoneStatus = "pending"
          break
        default:
          meetingMilestoneStatus = "pending"
      }

      const result = await adminUpdateMilestone(milestoneId, {
        status: meetingMilestoneStatus,
        ...(meetingMilestoneStatus === "confirmed" ? { confirmedAt: new Date().toISOString() } : {}),
        ...(meetingMilestoneStatus === "completed" ? { completedAt: new Date().toISOString() } : {})
      })

      if (result.success) {
        toast({
          title: "Estado actualizado",
          description: `El hito ha sido marcado como ${status === "completed" ? "completado" : status === "confirmed" ? "confirmado" : status}.`,
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error al actualizar estado:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del hito.",
        variant: "destructive",
      })
    }
  }

  // Handler para toggle de notificaciones (envía notificación interna)
  const handleNotificationToggle = async (milestoneId: string) => {
    await handleSendNotification(milestoneId)
  }

  // Cargar lista de clientes
  const loadClients = async () => {
    try {
      // Aquí podríamos hacer una llamada a la API para obtener clientes
      // Por ahora simulamos algunos clientes de ejemplo
      const mockClients = [
        { id: "client-001", name: "Juan Pérez", email: "juan@empresa.com" },
        { id: "client-002", name: "María García", email: "maria@empresa.com" },
        { id: "client-003", name: "Carlos López", email: "carlos@empresa.com" },
      ]
      setClients(mockClients)
    } catch (error) {
      console.error("Error al cargar clientes:", error)
    }
  }

  // Handler para agregar un nuevo milestone
  const handleAddMilestone = () => {
    loadClients()
    setShowAddModal(true)
  }

  // Handler para editar un milestone
  const handleEditMilestone = async (milestoneId: string) => {
    try {
      // Encontrar el milestone a editar
      const milestoneToEdit = milestones.find(m => m.id === milestoneId)
      if (!milestoneToEdit) {
        toast({
          title: "Error",
          description: "No se encontró el hito a editar.",
          variant: "destructive",
        })
        return
      }

      // Obtener el milestone completo de la base de datos
      const allMilestones = await getAllMeetingMilestones()
      const fullMilestone = allMilestones.find(m => m.id === milestoneId)

      if (fullMilestone) {
        setEditingMilestone(milestoneToEdit)
        setEditForm({
          notes: fullMilestone.notes || ""
        })
        setShowEditModal(true)
      } else {
        toast({
          title: "Error",
          description: "No se pudo cargar la información del hito.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al editar milestone:", error)
      toast({
        title: "Error",
        description: "No se pudo editar el hito.",
        variant: "destructive",
      })
    }
  }

  // Handler para enviar notificación
  const handleSendNotification = async (milestoneId: string) => {
    try {
      const result = await adminSendNotification(milestoneId, "internal")
      if (result.success) {
        toast({
          title: "Notificación enviada",
          description: result.message,
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error al enviar notificación:", error)
      toast({
        title: "Error",
        description: "No se pudo enviar la notificación.",
        variant: "destructive",
      })
    }
  }

  // Handler para crear nuevo hito
  const handleCreateMilestone = async () => {
    // Validar formulario
    if (!addForm.title || !addForm.description || !addForm.preferredDate || !addForm.preferredTime || !addForm.clientId) {
      toast({
        title: "Campos requeridos",
        description: "Completa todos los campos obligatorios.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const result = await adminCreateMilestone(addForm)
      if (result.success) {
        toast({
          title: "Hito creado",
          description: "El hito ha sido creado exitosamente y se ha enviado notificación al cliente.",
        })
        setShowAddModal(false)
        // Resetear formulario
        setAddForm({
          title: "",
          description: "",
          meetingType: "demo",
          productType: "",
          preferredDate: "",
          preferredTime: "",
          clientId: "",
          clientName: "",
          clientEmail: "",
          notes: ""
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error al crear hito:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo crear el hito.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handler para actualizar hito
  const handleUpdateMilestone = async () => {
    if (!editingMilestone) return

    setIsSubmitting(true)
    try {
      const result = await adminUpdateMilestone(editingMilestone.id, {
        notes: editForm.notes
      })
      if (result.success) {
        toast({
          title: "Hito actualizado",
          description: "Los cambios han sido guardados exitosamente.",
        })
        setShowEditModal(false)
        setEditingMilestone(null)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error al actualizar hito:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el hito.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handler para selección de cliente
  const handleClientSelect = (clientId: string) => {
    const selectedClient = clients.find(c => c.id === clientId)
    if (selectedClient) {
      setAddForm(prev => ({
        ...prev,
        clientId,
        clientName: selectedClient.name,
        clientEmail: selectedClient.email
      }))
    }
  }

  // Obtener lista de servicios/productos
  const services = servicesContent.es.services.map((service) => service.title)

  return (
    <>
      <EnhancedMilestones
        milestones={milestones}
        onStatusChange={handleStatusChange}
        onNotificationToggle={handleNotificationToggle}
        onAddMilestone={handleAddMilestone}
        onEditMilestone={handleEditMilestone}
      />

      {/* Modal para agregar nuevo hito */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl bg-slate-900 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl">Crear Nuevo Hito</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4 max-h-[600px] overflow-y-auto">
            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">Título *</Label>
              <Input
                id="title"
                value={addForm.title}
                onChange={(e) => setAddForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ej: Demo guiada de CRM"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">Descripción *</Label>
              <Textarea
                id="description"
                value={addForm.description}
                onChange={(e) => setAddForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe el propósito de esta reunión..."
                className="bg-white/10 border-white/20 text-white min-h-[80px]"
              />
            </div>

            {/* Tipo de reunión */}
            <div className="space-y-3">
              <Label className="text-white">Tipo de reunión *</Label>
              <RadioGroup
                value={addForm.meetingType}
                onValueChange={(value) => setAddForm(prev => ({ ...prev, meetingType: value as MeetingType }))}
              >
                <div className="flex items-center space-x-2 p-3 rounded-lg border border-white/10 bg-white/5">
                  <RadioGroupItem value="demo" id="demo-add" className="border-white/30" />
                  <Label htmlFor="demo-add" className="text-white cursor-pointer flex-1">
                    Demo guiada - Exploración detallada de la demo
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border border-white/10 bg-white/5">
                  <RadioGroupItem value="consultation" id="consultation-add" className="border-white/30" />
                  <Label htmlFor="consultation-add" className="text-white cursor-pointer flex-1">
                    Consulta - Resolver dudas y preguntas
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border border-white/10 bg-white/5">
                  <RadioGroupItem value="implementation" id="implementation-add" className="border-white/30" />
                  <Label htmlFor="implementation-add" className="text-white cursor-pointer flex-1">
                    Implementación - Planificar la integración
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Servicio/Producto */}
            <div className="space-y-2">
              <Label htmlFor="product-add" className="text-white flex items-center gap-2">
                <Package className="h-4 w-4" />
                Servicio/Producto *
              </Label>
              <Select value={addForm.productType} onValueChange={(value) => setAddForm(prev => ({ ...prev, productType: value }))}>
                <SelectTrigger id="product-add" className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Selecciona un servicio/producto" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/20 text-white">
                  {services.map((service) => (
                    <SelectItem key={service} value={service} className="focus:bg-white/10 focus:text-white">
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fecha y Hora */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date-add" className="text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Fecha *
                </Label>
                <Input
                  id="date-add"
                  type="date"
                  value={addForm.preferredDate}
                  onChange={(e) => setAddForm(prev => ({ ...prev, preferredDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time-add" className="text-white flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Hora *
                </Label>
                <Input
                  id="time-add"
                  type="time"
                  value={addForm.preferredTime}
                  onChange={(e) => setAddForm(prev => ({ ...prev, preferredTime: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>

            {/* Cliente */}
            <div className="space-y-2">
              <Label htmlFor="client-add" className="text-white flex items-center gap-2">
                <Users className="h-4 w-4" />
                Cliente *
              </Label>
              <Select value={addForm.clientId} onValueChange={handleClientSelect}>
                <SelectTrigger id="client-add" className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Selecciona un cliente" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/20 text-white">
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id} className="focus:bg-white/10 focus:text-white">
                      {client.name} ({client.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notas */}
            <div className="space-y-2">
              <Label htmlFor="notes-add" className="text-white">Notas adicionales</Label>
              <Textarea
                id="notes-add"
                value={addForm.notes}
                onChange={(e) => setAddForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Información adicional relevante..."
                className="bg-white/10 border-white/20 text-white min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddModal(false)}
              className="border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateMilestone}
              disabled={isSubmitting}
              className="bg-vanguard-blue text-white hover:bg-vanguard-blue/90"
            >
              {isSubmitting ? "Creando..." : "Crear Hito"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para editar hito */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-lg bg-slate-900 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">Editar Hito</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {editingMilestone && (
              <div className="space-y-2">
                <Label htmlFor="notes-edit" className="text-white">Notas adicionales</Label>
                <Textarea
                  id="notes-edit"
                  value={editForm.notes}
                  onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Información adicional relevante..."
                  className="bg-white/10 border-white/20 text-white min-h-[100px]"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditModal(false)}
              className="border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpdateMilestone}
              disabled={isSubmitting}
              className="bg-vanguard-blue text-white hover:bg-vanguard-blue/90"
            >
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
