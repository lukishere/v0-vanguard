"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Demo, DemoStatus, DemoType } from "@/lib/demos/types"

type DemoEditorProps = {
  demo?: Demo
  trigger?: React.ReactNode
  mode?: "create" | "edit"
}

type DemoFormState = {
  id: string
  name: string
  summary: string
  description: string
  status: DemoStatus
  demoType: DemoType
  interactiveUrl: string
  tags: string
  nextStep?: string
  cta?: string
  estimatedDelivery?: string
  progress?: number
}

// Solo "available" e "in-development" - Las demos activas se asignan desde Admin > Clientes
const STATUS_OPTIONS: DemoStatus[] = ["available", "in-development"]
const TYPE_OPTIONS: DemoType[] = ["bot", "dashboard", "api", "guided"]

const STATUS_DISPLAY: Record<string, string> = {
  "available": "📘 Disponible (aparece en Catálogo de clientes)",
  "in-development": "🔨 En Desarrollo (aparece en En Desarrollo de clientes)",
}

const DEFAULT_FORM_STATE: DemoFormState = {
  id: "",
  name: "",
  summary: "",
  description: "",
  status: "available",
  demoType: "dashboard",
  interactiveUrl: "",
  tags: "",
  nextStep: "",
  cta: "",
  estimatedDelivery: "",
  progress: 0,
}

export function DemoEditor({ demo, trigger, mode = "edit" }: DemoEditorProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState<DemoFormState>(DEFAULT_FORM_STATE)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      if (demo) {
        setForm({
          id: demo.id,
          name: demo.name,
          summary: demo.summary,
          description: demo.description,
          status: demo.status,
          demoType: demo.demoType,
          interactiveUrl: demo.interactiveUrl ?? "",
          tags: demo.tags.join(", "),
          nextStep: demo.nextStep ?? "",
          cta: demo.cta ?? "",
          estimatedDelivery: demo.estimatedDelivery ?? "",
          progress: demo.progress ?? 0,
        })
      } else {
        setForm(DEFAULT_FORM_STATE)
      }
    }
  }, [open, demo])

  const tagsArray = useMemo(
    () =>
      form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [form.tags]
  )

  const isCreateMode = mode === "create" || !demo

  const handleChange = <Key extends keyof DemoFormState>(key: Key, value: DemoFormState[Key]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    if (!form.id || !form.name || !form.summary || !form.description) {
      toast({
        title: "Campos requeridos",
        description: "Completa los campos obligatorios (ID, nombre, resumen y descripción).",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/admin/demos", {
        method: isCreateMode ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isCreateMode ? "create" : "update",
          payload: {
            ...form,
            tags: tagsArray,
          },
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error?.message ?? "No se pudo guardar la demo.")
      }

      toast({
        title: isCreateMode ? "Demo creada" : "Demo actualizada",
        description: isCreateMode
          ? "La demo ha sido añadida al catálogo."
          : "Los cambios fueron guardados correctamente.",
      })

      setOpen(false)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Intenta nuevamente en unos minutos.",
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
            {isCreateMode ? "Nueva demo" : "Editar demo"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-slate-950 text-white sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {isCreateMode ? "Crear nueva demo" : `Editar demo: ${demo?.name ?? ""}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="demo-id">ID (slug)</Label>
              <Input
                id="demo-id"
                value={form.id}
                onChange={(event) => handleChange("id", event.target.value)}
                placeholder="ej. vanguard-copilot"
                disabled={!isCreateMode}
                className="bg-slate-900/60 text-white"
              />
              <p className="text-xs text-white/40">Debe ser único. Úsalo para relacionar accesos y reportes.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="demo-name">Nombre</Label>
              <Input
                id="demo-name"
                value={form.name}
                onChange={(event) => handleChange("name", event.target.value)}
                placeholder="Nombre visible para clientes"
                className="bg-slate-900/60 text-white"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={form.status} onValueChange={(value: DemoStatus) => handleChange("status", value)}>
                <SelectTrigger className="bg-slate-900/60 text-white">
                  <SelectValue>
                    {STATUS_DISPLAY[form.status] || form.status}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-slate-900 text-white">
                  <SelectItem value="available">
                    📘 Disponible (aparece en Catálogo de clientes)
                  </SelectItem>
                  <SelectItem value="in-development">
                    🔨 En Desarrollo (aparece en En Desarrollo de clientes)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo de demo</Label>
              <Select value={form.demoType} onValueChange={(value: DemoType) => handleChange("demoType", value)}>
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
            <Label htmlFor="demo-summary">Resumen</Label>
            <Textarea
              id="demo-summary"
              value={form.summary}
              onChange={(event) => handleChange("summary", event.target.value)}
              className="min-h-[80px] bg-slate-900/60 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="demo-description">Descripción detallada</Label>
            <Textarea
              id="demo-description"
              value={form.description}
              onChange={(event) => handleChange("description", event.target.value)}
              className="min-h-[140px] bg-slate-900/60 text-white"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="demo-tags">Tags (separados por coma)</Label>
              <Input
                id="demo-tags"
                value={form.tags}
                onChange={(event) => handleChange("tags", event.target.value)}
                placeholder="IA, Automatización, Seguridad"
                className="bg-slate-900/60 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demo-url">URL interactiva</Label>
              <Input
                id="demo-url"
                value={form.interactiveUrl}
                onChange={(event) => handleChange("interactiveUrl", event.target.value)}
                placeholder="https://..."
                className="bg-slate-900/60 text-white"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="demo-cta">CTA personalizado</Label>
              <Input
                id="demo-cta"
                value={form.cta ?? ""}
                onChange={(event) => handleChange("cta", event.target.value)}
                placeholder="Texto del botón principal"
                className="bg-slate-900/60 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demo-nextstep">Siguiente paso</Label>
              <Input
                id="demo-nextstep"
                value={form.nextStep ?? ""}
                onChange={(event) => handleChange("nextStep", event.target.value)}
                placeholder="Acción recomendada para el cliente"
                className="bg-slate-900/60 text-white"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="demo-estimated">Entrega estimada</Label>
              <Input
                id="demo-estimated"
                type="date"
                value={form.estimatedDelivery ?? ""}
                onChange={(event) => handleChange("estimatedDelivery", event.target.value)}
                className="bg-slate-900/60 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demo-progress">Progreso (%)</Label>
              <Input
                id="demo-progress"
                type="number"
                min={0}
                max={100}
                value={form.progress ?? 0}
                onChange={(event) => handleChange("progress", Number(event.target.value))}
                className="bg-slate-900/60 text-white"
              />
              <p className="text-xs text-white/40">Utiliza este campo principalmente para demos en desarrollo.</p>
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
              {isSubmitting ? "Guardando..." : isCreateMode ? "Crear demo" : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
