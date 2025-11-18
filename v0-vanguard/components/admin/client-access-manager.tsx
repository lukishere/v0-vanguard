"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import type { ClientDemoAccess, Demo } from "@/lib/demos/types"

type ClientAccessManagerProps = {
  clientId: string
  clientName: string
  demoAccess: ClientDemoAccess[]
  availableDemos: Demo[]
}

const DEFAULT_DURATION_DAYS = 30

export function ClientAccessManager({ clientId, clientName, demoAccess, availableDemos }: ClientAccessManagerProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedDemo, setSelectedDemo] = useState<string>("")
  const [durationDays, setDurationDays] = useState<number>(DEFAULT_DURATION_DAYS)
  const [isPending, startTransition] = useTransition()

  const unassignedDemos = useMemo(
    () => availableDemos.filter((demo) => !demoAccess.some((access) => access.demoId === demo.id)),
    [availableDemos, demoAccess]
  )

  const handleAssign = () => {
    if (!selectedDemo) {
      toast({
        title: "Selecciona una demo",
        description: "Elige la demo que quieres asignar al cliente.",
        variant: "destructive",
      })
      return
    }

    if (!Number.isFinite(durationDays) || durationDays < 1) {
      toast({
        title: "Duración inválida",
        description: "La duración debe ser mayor a 0 días.",
        variant: "destructive",
      })
      return
    }

    const normalizedDuration = Math.floor(durationDays)

    startTransition(async () => {
      try {
        const response = await fetch("/api/admin/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "assign",
            clientId,
            demoId: selectedDemo,
            durationDays: normalizedDuration,
          }),
        })

        if (!response.ok) {
          const error = await response.json().catch(() => ({}))
          throw new Error(error?.message ?? "No se pudo asignar la demo.")
        }

        toast({
          title: "Demo asignada",
          description: `Ahora ${clientName} tiene acceso a la demo seleccionada.`,
        })

        setSelectedDemo("")
        setDurationDays(DEFAULT_DURATION_DAYS)
        router.refresh()
      } catch (error) {
        toast({
          title: "Error al asignar",
          description: error instanceof Error ? error.message : "Inténtalo nuevamente en unos minutos.",
          variant: "destructive",
        })
      }
    })
  }

  const handleRevoke = (demoId: string) => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/admin/clients", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "revoke",
            clientId,
            demoId,
          }),
        })

        if (!response.ok) {
          const error = await response.json().catch(() => ({}))
          throw new Error(error?.message ?? "No se pudo revocar el acceso.")
        }

        toast({
          title: "Acceso revocado",
          description: "El cliente ya no podrá acceder a la demo seleccionada.",
        })

        router.refresh()
      } catch (error) {
        toast({
          title: "Error al revocar",
          description: error instanceof Error ? error.message : "Inténtalo nuevamente en unos minutos.",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-5">
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-white">Asignar nueva demo</h4>
        <p className="text-xs text-white/50">
          Controla qué productos puede explorar {clientName}. La asignación actualiza métricas y el acceso en tiempo real.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr_auto]">
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wide text-white/50">Demo disponible</Label>
          <Select value={selectedDemo} onValueChange={setSelectedDemo}>
            <SelectTrigger className="bg-slate-900/60 text-white">
              <SelectValue placeholder="Selecciona una demo" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 text-white">
              {unassignedDemos.length === 0 ? (
                <SelectItem value="none" disabled>
                  Todas las demos fueron asignadas
                </SelectItem>
              ) : (
                unassignedDemos.map((demo) => (
                  <SelectItem key={demo.id} value={demo.id}>
                    {demo.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`duration-${clientId}`} className="text-xs uppercase tracking-wide text-white/50">
            Duración (días)
          </Label>
          <Input
            id={`duration-${clientId}`}
            type="number"
            min={1}
            value={Number.isFinite(durationDays) ? durationDays : ""}
            onChange={(event) => {
              const raw = event.target.value
              if (raw === "") {
                setDurationDays(Number.NaN)
              } else {
                setDurationDays(Number(raw))
              }
            }}
            className="bg-slate-900/60 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wide text-white/50">Fecha estimada de expiración</Label>
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white/70">
            <Calendar className="h-4 w-4 text-vanguard-blue" />
            {calculateEndDate(durationDays)}
          </div>
        </div>
        <div className="flex items-end">
          <Button
            onClick={handleAssign}
            disabled={isPending || !selectedDemo || unassignedDemos.length === 0}
            className="w-full bg-vanguard-blue text-white hover:bg-vanguard-blue/90"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Asignar acceso"}
          </Button>
        </div>
      </div>

      {demoAccess.length > 0 ? (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white">Accesos vigentes</h4>
          <div className="grid gap-3 md:grid-cols-2">
            {demoAccess.map((access) => (
              <div key={access.demoId} className="flex items-start justify-between rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">{resolveDemoName(access.demoId, availableDemos)}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-white/60">
                    <Badge variant="outline" className="border-white/20 text-white">
                      {access.daysRemaining} días restantes
                    </Badge>
                    <span>Sesiones: {access.sessionsCount}</span>
                  </div>
                  <p className="text-[11px] uppercase tracking-wide text-white/40">
                    Expira el {new Date(access.expiresAt).toLocaleDateString("es-ES")}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  className="h-8 w-8 text-white hover:bg-rose-500/10 hover:text-rose-300"
                  onClick={() => handleRevoke(access.demoId)}
                  disabled={isPending}
                  title="Revocar acceso"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-xs text-white/50">Este cliente aún no tiene demos activas.</p>
      )}
    </div>
  )
}

function calculateEndDate(durationDays: number): string {
  if (!Number.isFinite(durationDays) || durationDays <= 0) return "—"
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + durationDays)
  return endDate.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function resolveDemoName(demoId: string, demos: Demo[]): string {
  return demos.find((demo) => demo.id === demoId)?.name ?? demoId
}
