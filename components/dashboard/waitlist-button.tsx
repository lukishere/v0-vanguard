"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { UserPlus, Check, X, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { logActivity } from "@/app/actions/client-activities"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface WaitlistButtonProps {
  demoId: string
  demoName: string
}

type RequestStatus = "none" | "pending" | "approved" | "rejected"

export function WaitlistButton({ demoId, demoName }: WaitlistButtonProps) {
  const [status, setStatus] = useState<RequestStatus>("none")
  const [isJoining, setIsJoining] = useState(false)
  const [showApprovedDialog, setShowApprovedDialog] = useState(false)
  const [showRejectedDialog, setShowRejectedDialog] = useState(false)
  const { toast } = useToast()

  // Verificar estado de solicitud al cargar y cada 5 segundos
  useEffect(() => {
    const checkRequestStatus = async () => {
      try {
        const response = await fetch(`/api/demo-requests/status?demoId=${demoId}`)
        if (response.ok) {
          const data = await response.json()
          const previousStatus = status

          if (data.status) {
            setStatus(data.status)

            // Mostrar dialogs solo si el estado cambió
            if (previousStatus === "pending" && data.status === "approved") {
              setShowApprovedDialog(true)
            } else if (previousStatus === "pending" && data.status === "rejected") {
              setShowRejectedDialog(true)
            }
          }
        }
      } catch (error) {
        console.error("Error al verificar estado de solicitud:", error)
      }
    }

    checkRequestStatus()
    const interval = setInterval(checkRequestStatus, 5000) // Verificar cada 5 segundos

    return () => clearInterval(interval)
  }, [demoId, status])

  const handleJoinWaitlist = async () => {
    setIsJoining(true)
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          demoId,
          demoName,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setStatus("pending")

        // Registrar actividad
        await logActivity(
          "waitlist-joined",
          `Se apuntó a "${demoName}" (en desarrollo)`,
          { demoId, demoName }
        )

        toast({
          title: "¡Solicitud enviada!",
          description: "Un administrador revisará tu solicitud pronto.",
        })
      } else {
        throw new Error(data.message || 'Error al enviar solicitud')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo enviar la solicitud. Intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsJoining(false)
    }
  }

  // Renderizado según el estado
  if (status === "approved") {
    return (
      <>
        <Button
          disabled
          className="col-span-2 bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 cursor-not-allowed"
        >
          <Check className="mr-2 h-4 w-4" />
          Solicitud Aprobada
        </Button>

        <AlertDialog open={showApprovedDialog} onOpenChange={setShowApprovedDialog}>
          <AlertDialogContent className="bg-white border-2 border-emerald-400/30 text-slate-900">
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Check className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <AlertDialogTitle className="text-xl text-slate-900">¡Solicitud Aprobada!</AlertDialogTitle>
                </div>
              </div>
              <AlertDialogDescription className="text-slate-600 text-base">
                Tu solicitud para acceder a <strong className="text-slate-900">"{demoName}"</strong> ha sido aprobada.
                <br /><br />
                La demo aparecerá en tu panel de "Demos Activas" pronto.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button
                onClick={() => {
                  setShowApprovedDialog(false)
                  window.location.reload() // Recargar para mostrar la demo en activas
                }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white w-full"
              >
                Entendido
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

  if (status === "rejected") {
    return (
      <>
        <Button
          disabled
          className="col-span-2 bg-rose-500/20 text-rose-200 border border-rose-500/30 cursor-not-allowed"
        >
          <X className="mr-2 h-4 w-4" />
          Solicitud Rechazada
        </Button>

        <AlertDialog open={showRejectedDialog} onOpenChange={setShowRejectedDialog}>
          <AlertDialogContent className="bg-white border-2 border-red-400/30 text-slate-900">
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <AlertDialogTitle className="text-xl text-slate-900">Solicitud Rechazada</AlertDialogTitle>
                </div>
              </div>
              <AlertDialogDescription className="text-slate-600 text-base">
                Tu solicitud para acceder a <strong className="text-slate-900">"{demoName}"</strong> no pudo ser aprobada en este momento.
                <br /><br />
                Por favor, ponte en contacto con nuestro equipo técnico para más información.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button
                onClick={() => setShowRejectedDialog(false)}
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-100 flex-1"
              >
                Cerrar
              </Button>
              <Button
                onClick={() => {
                  window.location.href = "mailto:soporte@vanguard-ia.com?subject=Consulta sobre demo rechazada"
                }}
                className="bg-vanguard-blue hover:bg-vanguard-blue/90 text-white flex-1"
              >
                Contactar Soporte
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

  if (status === "pending") {
    return (
      <Button
        disabled
        className="col-span-2 bg-amber-500/20 text-amber-200 border border-amber-500/30 cursor-not-allowed"
      >
        <Clock className="mr-2 h-4 w-4 animate-pulse" />
        Solicitud Pendiente
      </Button>
    )
  }

  // Estado "none" - mostrar botón normal
  return (
    <Button
      onClick={handleJoinWaitlist}
      disabled={isJoining}
      variant="outline"
      className="col-span-2 border-white/30 bg-slate-800/50 text-white hover:bg-slate-800/70 disabled:opacity-50"
    >
      <UserPlus className="mr-2 h-4 w-4" />
      {isJoining ? "Enviando..." : "Apuntarse"}
    </Button>
  )
}
