"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { MeetingModal } from "./meeting-modal"

export function MeetingButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
        onClick={() => setOpen(true)}
      >
        <Calendar className="mr-2 h-4 w-4" />
        Sesión de servicio/producto
      </Button>
      <MeetingModal open={open} onOpenChange={setOpen} />
    </>
  )
}
