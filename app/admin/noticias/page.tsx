"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, Newspaper, Eye, EyeOff, Calendar } from "lucide-react"
import { toast } from "sonner"

interface NewsItem {
  id: string
  type: "noticia" | "evento"
  title: string
  content: string
  author: string
  publishedAt: { seconds: number; nanoseconds: number }
  isActive: boolean
  createdAt: { seconds: number; nanoseconds: number }
  updatedAt: { seconds: number; nanoseconds: number }
  eventDate?: string
  eventLocation?: string
  eventLink?: string
  eventImage?: string
  eventSummary?: string
  eventDetails?: string
  showInShowcase?: boolean
}

export default function NewsAdminPage() {
  const [items, setItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null)
  const [currentType, setCurrentType] = useState<"noticia" | "evento">("noticia")

  // Form states comunes
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")
  const [isActive, setIsActive] = useState(true)

  // Form states específicos para eventos
  const [eventDate, setEventDate] = useState("")
  const [eventLocation, setEventLocation] = useState("")
  const [eventLink, setEventLink] = useState("")
  const [eventImage, setEventImage] = useState("")
  const [eventSummary, setEventSummary] = useState("")
  const [eventDetails, setEventDetails] = useState("")
  const [showInShowcase, setShowInShowcase] = useState(false)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/news')
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      }
    } catch (error) {
      console.error('Error fetching items:', error)
      toast.error("Error al cargar los datos")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setTitle("")
    setContent("")
    setAuthor("")
    setIsActive(true)
    setEventDate("")
    setEventLocation("")
    setEventLink("")
    setEventImage("")
    setEventSummary("")
    setEventDetails("")
    setShowInShowcase(false)
  }

  const handleCreate = async () => {
    if (!title.trim() || !content.trim() || !author.trim()) {
      toast.error("Los campos título, contenido y autor son obligatorios")
      return
    }

    try {
      const payload: any = {
        type: currentType,
        title: title.trim(),
        content: content.trim(),
        author: author.trim(),
        isActive,
      }

      if (currentType === "evento") {
        payload.eventDate = eventDate.trim()
        payload.eventLocation = eventLocation.trim()
        payload.eventLink = eventLink.trim()
        payload.eventImage = eventImage.trim()
        payload.eventSummary = eventSummary.trim()
        payload.eventDetails = eventDetails.trim()
        payload.showInShowcase = showInShowcase
      }

      const response = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast.success(`${currentType === "evento" ? "Evento" : "Noticia"} creado exitosamente`)
        setIsCreateDialogOpen(false)
        resetForm()
        fetchItems()
      } else {
        const error = await response.json()
        toast.error(error.error || "Error al crear")
      }
    } catch (error) {
      console.error('Error creating:', error)
      toast.error("Error al crear")
    }
  }

  const handleEdit = async () => {
    if (!editingItem || !title.trim() || !content.trim() || !author.trim()) {
      toast.error("Los campos título, contenido y autor son obligatorios")
      return
    }

    try {
      const payload: any = {
        title: title.trim(),
        content: content.trim(),
        author: author.trim(),
        isActive,
      }

      if (editingItem.type === "evento") {
        payload.eventDate = eventDate.trim()
        payload.eventLocation = eventLocation.trim()
        payload.eventLink = eventLink.trim()
        payload.eventImage = eventImage.trim()
        payload.eventSummary = eventSummary.trim()
        payload.eventDetails = eventDetails.trim()
        payload.showInShowcase = showInShowcase
      }

      const response = await fetch(`/api/news/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast.success(`${editingItem.type === "evento" ? "Evento" : "Noticia"} actualizado exitosamente`)
        setIsEditDialogOpen(false)
        setEditingItem(null)
        resetForm()
        fetchItems()
      } else {
        const error = await response.json()
        toast.error(error.error || "Error al actualizar")
      }
    } catch (error) {
      console.error('Error updating:', error)
      toast.error("Error al actualizar")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success("Eliminado exitosamente")
        fetchItems()
      } else {
        const error = await response.json()
        toast.error(error.error || "Error al eliminar")
      }
    } catch (error) {
      console.error('Error deleting:', error)
      toast.error("Error al eliminar")
    }
  }

  const openEditDialog = (item: NewsItem) => {
    setEditingItem(item)
    setTitle(item.title)
    setContent(item.content)
    setAuthor(item.author)
    setIsActive(item.isActive)

    if (item.type === "evento") {
      setEventDate(item.eventDate || "")
      setEventLocation(item.eventLocation || "")
      setEventLink(item.eventLink || "")
      setEventImage(item.eventImage || "")
      setEventSummary(item.eventSummary || "")
      setEventDetails(item.eventDetails || "")
      setShowInShowcase(item.showInShowcase || false)
    }

    setIsEditDialogOpen(true)
  }

  const formatDate = (timestamp: { seconds: number; nanoseconds: number }) => {
    return new Date(timestamp.seconds * 1000).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const noticias = items.filter(item => item.type === "noticia")
  const eventos = items.filter(item => item.type === "evento")

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Noticias y Eventos</h1>
          <p className="text-muted-foreground">Administra las noticias y eventos públicos</p>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="h-32 bg-muted rounded-lg"></div>
        </div>
      </div>
    )
  }

  const renderItemCard = (item: NewsItem) => (
    <Card key={item.id}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              {item.title}
              {!item.isActive && (
                <span className="text-xs bg-muted px-2 py-1 rounded">
                  <EyeOff className="h-3 w-3 inline mr-1" />
                  Oculta
                </span>
              )}
              {item.isActive && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  <Eye className="h-3 w-3 inline mr-1" />
                  Visible
                </span>
              )}
              {item.type === "evento" && item.showInShowcase && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  🎪 Showcase
                </span>
              )}
            </CardTitle>
            <CardDescription>
              Por {item.author} • {formatDate(item.publishedAt)}
              {item.type === "evento" && item.eventDate && ` • ${item.eventDate}`}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar {item.type === "evento" ? "evento" : "noticia"}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(item.id)}>
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {item.type === "evento" ? (item.eventSummary || item.content) : item.content}
        </p>
        {item.type === "evento" && item.eventLocation && (
          <p className="text-xs text-muted-foreground mt-2">📍 {item.eventLocation}</p>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Noticias y Eventos</h1>
        <p className="text-muted-foreground">
          Gestiona noticias para el dashboard de clientes y eventos para la página pública
        </p>
      </div>

      <Tabs defaultValue="noticias" className="space-y-6">
        <TabsList>
          <TabsTrigger value="noticias">
            <Newspaper className="h-4 w-4 mr-2" />
            Noticias (Dashboard Clientes)
          </TabsTrigger>
          <TabsTrigger value="eventos">
            <Calendar className="h-4 w-4 mr-2" />
            Eventos (Página Pública)
          </TabsTrigger>
        </TabsList>

        {/* TAB NOTICIAS */}
        <TabsContent value="noticias" className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Las noticias se muestran en el dashboard de clientes
            </p>
            <Dialog open={isCreateDialogOpen && currentType === "noticia"} onOpenChange={(open) => {
              setIsCreateDialogOpen(open)
              if (open) {
                setCurrentType("noticia")
                resetForm()
              }
            }}>
              <DialogTrigger asChild>
                <Button onClick={() => { setCurrentType("noticia"); resetForm(); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Noticia
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Noticia</DialogTitle>
                  <DialogDescription>
                    Esta noticia se mostrará en el dashboard de clientes
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título*</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Título de la noticia"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Autor*</Label>
                    <Input
                      id="author"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Nombre del autor"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Contenido*</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Contenido de la noticia..."
                      rows={6}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={isActive}
                      onCheckedChange={setIsActive}
                    />
                    <Label htmlFor="isActive">Publicar inmediatamente</Label>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreate}>Crear Noticia</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {noticias.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Newspaper className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay noticias</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Crea tu primera noticia para el dashboard de clientes
                  </p>
                </CardContent>
              </Card>
            ) : (
              noticias.map(renderItemCard)
            )}
          </div>
        </TabsContent>

        {/* TAB EVENTOS */}
        <TabsContent value="eventos" className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Los eventos se muestran en la página pública /events
            </p>
            <Dialog open={isCreateDialogOpen && currentType === "evento"} onOpenChange={(open) => {
              setIsCreateDialogOpen(open)
              if (open) {
                setCurrentType("evento")
                resetForm()
              }
            }}>
              <DialogTrigger asChild>
                <Button onClick={() => { setCurrentType("evento"); resetForm(); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Evento
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Evento</DialogTitle>
                  <DialogDescription>
                    Este evento se mostrará en la página pública de eventos
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-title">Título del Evento*</Label>
                    <Input
                      id="event-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="ej: Pitch ICE 2026 • Barcelona, España"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-date">Fecha*</Label>
                      <Input
                        id="event-date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        placeholder="ej: Noviembre 2025"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-location">Ubicación</Label>
                      <Input
                        id="event-location"
                        value={eventLocation}
                        onChange={(e) => setEventLocation(e.target.value)}
                        placeholder="ej: Barcelona, España"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-link">Link Externo</Label>
                    <Input
                      id="event-link"
                      value={eventLink}
                      onChange={(e) => setEventLink(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-image">Imagen/Gradient para Showcase</Label>
                    <Input
                      id="event-image"
                      value={eventImage}
                      onChange={(e) => setEventImage(e.target.value)}
                      placeholder="linear-gradient(135deg, #f97316 0%, #fb7185 100%)"
                    />
                    <p className="text-xs text-muted-foreground">
                      URL de imagen o gradient CSS
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-summary">Resumen*</Label>
                    <Textarea
                      id="event-summary"
                      value={eventSummary}
                      onChange={(e) => setEventSummary(e.target.value)}
                      placeholder="Resumen corto del evento..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-details">Detalles Adicionales</Label>
                    <Textarea
                      id="event-details"
                      value={eventDetails}
                      onChange={(e) => setEventDetails(e.target.value)}
                      placeholder="Detalles adicionales del evento..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Autor*</Label>
                    <Input
                      id="author"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Nombre del autor"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Contenido Interno*</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Contenido para uso interno..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="showInShowcase"
                        checked={showInShowcase}
                        onCheckedChange={setShowInShowcase}
                      />
                      <Label htmlFor="showInShowcase">Mostrar en Showcase (FlowingMenu)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive-event"
                        checked={isActive}
                        onCheckedChange={setIsActive}
                      />
                      <Label htmlFor="isActive-event">Publicar inmediatamente</Label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreate}>Crear Evento</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {eventos.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay eventos</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Crea tu primer evento público
                  </p>
                </CardContent>
              </Card>
            ) : (
              eventos.map(renderItemCard)
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog - Dinámico según tipo */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Editar {editingItem?.type === "evento" ? "Evento" : "Noticia"}
            </DialogTitle>
            <DialogDescription>
              Modifica el contenido
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Título*</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título"
              />
            </div>

            {editingItem?.type === "evento" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-event-date">Fecha</Label>
                    <Input
                      id="edit-event-date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      placeholder="ej: Noviembre 2025"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-event-location">Ubicación</Label>
                    <Input
                      id="edit-event-location"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      placeholder="ej: Barcelona, España"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-event-link">Link Externo</Label>
                  <Input
                    id="edit-event-link"
                    value={eventLink}
                    onChange={(e) => setEventLink(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-event-image">Imagen/Gradient</Label>
                  <Input
                    id="edit-event-image"
                    value={eventImage}
                    onChange={(e) => setEventImage(e.target.value)}
                    placeholder="linear-gradient..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-event-summary">Resumen</Label>
                  <Textarea
                    id="edit-event-summary"
                    value={eventSummary}
                    onChange={(e) => setEventSummary(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-event-details">Detalles</Label>
                  <Textarea
                    id="edit-event-details"
                    value={eventDetails}
                    onChange={(e) => setEventDetails(e.target.value)}
                    rows={3}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-author">Autor*</Label>
              <Input
                id="edit-author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Nombre del autor"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-content">Contenido*</Label>
              <Textarea
                id="edit-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
              />
            </div>

            <div className="space-y-3">
              {editingItem?.type === "evento" && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-showInShowcase"
                    checked={showInShowcase}
                    onCheckedChange={setShowInShowcase}
                  />
                  <Label htmlFor="edit-showInShowcase">Mostrar en Showcase</Label>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="edit-isActive">Visible para público</Label>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEdit}>Actualizar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
