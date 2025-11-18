"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Resource, ResourceCategory } from "@/lib/content/resources"

type ResourceEditorProps = {
  resource?: Resource
  categoryId?: ResourceCategory["id"]
  trigger?: React.ReactNode
  mode?: "create" | "edit"
}

type ResourceFormState = {
  id: string
  title: string
  description: string
  type: Resource["type"]
  url: string
  duration?: string
  fileSize?: string
  serviceId?: string
  category: Resource["category"]
  thumbnail?: string
}

const TYPE_OPTIONS: Array<Resource["type"]> = ["video", "document", "guide"]
const CATEGORY_OPTIONS: Resource["category"][] = ["getting-started", "advanced", "troubleshooting", "best-practices"]

const DEFAULT_FORM_STATE: ResourceFormState = {
  id: "",
  title: "",
  description: "",
  type: "video",
  url: "",
  duration: "",
  fileSize: "",
  serviceId: "",
  category: "getting-started",
  thumbnail: "",
}

export function ResourceEditor({ resource, categoryId, trigger, mode = "edit" }: ResourceEditorProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState<ResourceFormState>(DEFAULT_FORM_STATE)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      if (resource) {
        setForm({
          id: resource.id,
          title: resource.title,
          description: resource.description,
          type: resource.type,
          url: resource.url,
          duration: resource.duration ?? "",
          fileSize: resource.fileSize ?? "",
          serviceId: resource.serviceId ?? "",
          category: resource.category,
          thumbnail: resource.thumbnail ?? "",
        })
      } else {
        setForm({
          ...DEFAULT_FORM_STATE,
          category: categoryId ?? "getting-started",
        })
      }
    }
  }, [open, resource, categoryId])

  const isCreateMode = mode === "create" || !resource

  const handleChange = <Key extends keyof ResourceFormState>(key: Key, value: ResourceFormState[Key]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    if (!form.id || !form.title || !form.description || !form.url) {
      toast({
        title: "Campos requeridos",
        description: "Completa ID interno, título, descripción y URL.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // TODO: Integrar con API real
      toast({
        title: "Pendiente de integración",
        description: "La gestión de recursos se conectará a la API cuando esté disponible.",
      })
      console.info("[ResourceEditor] payload", {
        action: isCreateMode ? "create" : "update",
        payload: form,
      })
      setOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo procesar la acción.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant={isCreateMode ? "default" : "outline"}>
            {isCreateMode ? "Nuevo recurso" : "Editar recurso"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-slate-950 text-white sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isCreateMode ? "Crear nuevo recurso" : `Editar recurso: ${resource?.title ?? ""}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="resource-id">ID interno</Label>
              <Input
                id="resource-id"
                value={form.id}
                onChange={(event) => handleChange("id", event.target.value)}
                placeholder="Ej. intro-crm"
                disabled={!isCreateMode}
                className="bg-slate-900/60 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de recurso</Label>
              <Select value={form.type} onValueChange={(value: Resource["type"]) => handleChange("type", value)}>
                <SelectTrigger className="bg-slate-900/60 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 text-white">
                  {TYPE_OPTIONS.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resource-title">Título</Label>
            <Input
              id="resource-title"
              value={form.title}
              onChange={(event) => handleChange("title", event.target.value)}
              placeholder="Nombre visible del recurso"
              className="bg-slate-900/60 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resource-description">Descripción</Label>
            <Textarea
              id="resource-description"
              value={form.description}
              onChange={(event) => handleChange("description", event.target.value)}
              className="min-h-[100px] bg-slate-900/60 text-white"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="resource-url">URL</Label>
              <Input
                id="resource-url"
                value={form.url}
                onChange={(event) => handleChange("url", event.target.value)}
                placeholder="https://..."
                className="bg-slate-900/60 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select value={form.category} onValueChange={(value: Resource["category"]) => handleChange("category", value)}>
                <SelectTrigger className="bg-slate-900/60 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 text-white">
                  {CATEGORY_OPTIONS.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="resource-duration">Duración (videos)</Label>
              <Input
                id="resource-duration"
                value={form.duration ?? ""}
                onChange={(event) => handleChange("duration", event.target.value)}
                placeholder="Ej. 12:45"
                className="bg-slate-900/60 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resource-filesize">Tamaño de archivo</Label>
              <Input
                id="resource-filesize"
                value={form.fileSize ?? ""}
                onChange={(event) => handleChange("fileSize", event.target.value)}
                placeholder="Ej. 3.2 MB"
                className="bg-slate-900/60 text-white"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="resource-service">Servicio asociado</Label>
              <Input
                id="resource-service"
                value={form.serviceId ?? ""}
                onChange={(event) => handleChange("serviceId", event.target.value)}
                placeholder="Opcional: ID del servicio"
                className="bg-slate-900/60 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resource-thumbnail">Thumbnail</Label>
              <Input
                id="resource-thumbnail"
                value={form.thumbnail ?? ""}
                onChange={(event) => handleChange("thumbnail", event.target.value)}
                placeholder="URL de imagen (opcional)"
                className="bg-slate-900/60 text-white"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-white/20 text-white hover:bg-white/10"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-vanguard-blue text-white hover:bg-vanguard-blue/90"
            >
              {isSubmitting ? "Procesando..." : isCreateMode ? "Crear recurso" : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}


