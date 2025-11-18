"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { requestDemoAccess } from "@/app/actions/demo-requests"
import { logActivity } from "@/app/actions/client-activities"
import { toast } from "sonner"

interface RequestDemoButtonProps {
  demoId: string
  demoName: string
}

export function RequestDemoButton({ demoId, demoName }: RequestDemoButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRequest = async () => {
    setIsSubmitting(true)
    try {
      const result = await requestDemoAccess(demoId, demoName, message)

      if (result.success) {
        // Registrar actividad
        await logActivity(
          "demo-requested",
          `Solicitó acceso a "${demoName}"`,
          { demoId, demoName, requestId: result.requestId }
        )

        toast.success("Solicitud enviada", {
          description: `Tu solicitud para "${demoName}" ha sido enviada al equipo. Te notificaremos cuando sea aprobada.`,
        })
        setIsOpen(false)
        setMessage("")
      } else {
        toast.error("Error", {
          description: result.error || "No se pudo enviar la solicitud",
        })
      }
    } catch (error) {
      toast.error("Error", {
        description: "Ocurrió un error al enviar la solicitud",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-vanguard-blue text-white hover:bg-vanguard-blue/90 h-10 w-full"
        >
          <Send className="mr-1.5 h-3.5 w-3.5" />
          <span className="text-xs font-medium">Solicitar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white border-2 border-vanguard-blue/30 text-slate-900">
        <DialogHeader>
          <DialogTitle className="text-xl text-slate-900 flex items-center gap-2">
            <div className="p-2 rounded-lg bg-vanguard-blue/10">
              <Send className="h-5 w-5 text-vanguard-blue" />
            </div>
            Solicitar demo
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Solicita acceso a <strong className="text-slate-900">"{demoName}"</strong>.
            El equipo de Vanguard-IA revisará tu solicitud y te dará acceso.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-slate-700">
              Mensaje (opcional)
            </label>
            <Textarea
              id="message"
              placeholder="Cuéntanos por qué te interesa esta demo o qué caso de uso tienes..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 min-h-[100px] focus:border-vanguard-blue focus:ring-vanguard-blue"
            />
          </div>

          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
            <p className="text-xs text-blue-700 font-medium">
              💡 Recibirás una notificación cuando tu solicitud sea revisada
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleRequest}
            disabled={isSubmitting}
            className="bg-vanguard-blue hover:bg-vanguard-blue/90 text-white"
          >
            {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
