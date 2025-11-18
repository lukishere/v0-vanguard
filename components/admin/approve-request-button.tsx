"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { approveRequest, rejectRequest, type DemoRequest } from "@/app/actions/demo-requests"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface ApproveRequestButtonProps {
  request: DemoRequest
}

export function ApproveRequestButton({ request }: ApproveRequestButtonProps) {
  const [isApproveOpen, setIsApproveOpen] = useState(false)
  const [isRejectOpen, setIsRejectOpen] = useState(false)
  const [durationDays, setDurationDays] = useState(30)
  const [rejectReason, setRejectReason] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const handleApprove = async () => {
    setIsProcessing(true)
    try {
      const result = await approveRequest(request.id, durationDays)

      if (result.success) {
        toast.success("Solicitud aprobada", {
          description: `${request.clientName || "Cliente"} ahora tiene acceso a "${request.demoName}" por ${durationDays} días.`,
        })
        setIsApproveOpen(false)
        router.refresh()
      } else {
        toast.error("Error", {
          description: result.error || "No se pudo aprobar la solicitud",
        })
      }
    } catch (error) {
      toast.error("Error", {
        description: "Ocurrió un error al aprobar la solicitud",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    setIsProcessing(true)
    try {
      const result = await rejectRequest(request.id, rejectReason)

      if (result.success) {
        toast.success("Solicitud rechazada", {
          description: `La solicitud de "${request.demoName}" ha sido rechazada.`,
        })
        setIsRejectOpen(false)
        router.refresh()
      } else {
        toast.error("Error", {
          description: result.error || "No se pudo rechazar la solicitud",
        })
      }
    } catch (error) {
      toast.error("Error", {
        description: "Ocurrió un error al rechazar la solicitud",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex gap-2">
      {/* Aprobar */}
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogTrigger asChild>
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white flex-1">
            <Check className="mr-2 h-4 w-4" />
            Aprobar
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white border-2 border-emerald-400/30 text-slate-900">
          <DialogHeader>
            <DialogTitle className="text-xl text-slate-900 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-100">
                <Check className="h-5 w-5 text-emerald-600" />
              </div>
              Aprobar solicitud
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Otorgar acceso a <strong className="text-slate-900">"{request.demoName}"</strong> para{" "}
              <strong className="text-slate-900">{request.clientName || request.clientId}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="duration" className="text-sm font-medium text-slate-700">
                Duración (días)
              </label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="365"
                value={durationDays}
                onChange={(e) => setDurationDays(parseInt(e.target.value) || 30)}
                className="bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
              <p className="text-xs text-emerald-700 font-medium">
                ✓ El cliente recibirá una notificación automática
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsApproveOpen(false)}
              className="border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isProcessing}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {isProcessing ? "Aprobando..." : "Aprobar Solicitud"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rechazar */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="border-rose-500/40 text-rose-300 hover:bg-rose-500/10 flex-1">
            <X className="mr-2 h-4 w-4" />
            Rechazar
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white border-2 border-red-400/30 text-slate-900">
          <DialogHeader>
            <DialogTitle className="text-xl text-slate-900 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-red-100">
                <X className="h-5 w-5 text-red-600" />
              </div>
              Rechazar solicitud
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              ¿Estás seguro que deseas rechazar esta solicitud?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium text-slate-700">
                Razón (opcional)
              </label>
              <Input
                id="reason"
                placeholder="Ej: La demo no está lista aún..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500"
              />
            </div>

            <div className="rounded-lg bg-red-50 border border-red-200 p-3">
              <p className="text-xs text-red-700 font-medium">
                ⚠️ El cliente recibirá una notificación de rechazo
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRejectOpen(false)}
              className="border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleReject}
              disabled={isProcessing}
              className="bg-rose-500 hover:bg-rose-600 text-white"
            >
              {isProcessing ? "Rechazando..." : "Rechazar Solicitud"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
