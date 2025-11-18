"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Activity } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ClientActivityTimeline } from "./client-activity-timeline"

interface ClientActivityButtonProps {
  clientId: string
  clientName: string
}

export function ClientActivityButton({ clientId, clientName }: ClientActivityButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-vanguard-300/40 bg-vanguard-400/10 text-vanguard-300 hover:bg-vanguard-400/20 hover:border-vanguard-300/60 transition-all"
        >
          <Activity className="mr-2 h-4 w-4" />
          Actividad
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-white/10 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white flex items-center gap-2">
            <div className="p-2 rounded-lg bg-vanguard-blue/20">
              <Activity className="h-5 w-5 text-vanguard-blue" />
            </div>
            Actividad de {clientName}
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Historial completo de interacciones y engagement del cliente
          </DialogDescription>
        </DialogHeader>

        <ClientActivityTimeline clientId={clientId} />
      </DialogContent>
    </Dialog>
  )
}
