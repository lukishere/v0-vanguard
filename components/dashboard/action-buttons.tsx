"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Users, BookOpen, MessageCircle, TrendingUp } from "lucide-react"
import { MeetingModal } from "./meeting-modal"
import { MeetingButton } from "./meeting-button"

type RequestType =
  | "meeting"
  | "quote"
  | "contracts"
  | "access"
  | "success-cases"
  | "resources"
  | "sales-chat"

export function ActionButtons() {
  const [openModal, setOpenModal] = useState<RequestType | null>(null)

  return (
    <>
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="flex flex-col gap-3">
            <MeetingButton />
          </div>
          <Button
            className="bg-white text-slate-900 hover:bg-white/90"
            onClick={() => setOpenModal("sales-chat")}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Chat con ventas
          </Button>
          <Button
            className="bg-white text-slate-900 hover:bg-white/90"
            onClick={() => setOpenModal("contracts")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Contratos digitales
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Button
            className="bg-white text-slate-900 hover:bg-white/90"
            onClick={() => setOpenModal("access")}
          >
            <Users className="mr-2 h-4 w-4" />
            Solicitar acceso adicional
          </Button>
          <Button
            className="bg-white text-slate-900 hover:bg-white/90"
            onClick={() => setOpenModal("resources")}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Recursos y tutoriales
          </Button>
          <Button
            className="bg-white text-slate-900 hover:bg-white/90"
            onClick={() => setOpenModal("success-cases")}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Rendimientos
          </Button>
        </div>
      </div>

      {/* Modal único que cambia según el tipo de solicitud */}
      <MeetingModal
        open={openModal !== null}
        onOpenChange={(open) => !open && setOpenModal(null)}
        requestType={openModal || "meeting"}
      />
    </>
  )
}
