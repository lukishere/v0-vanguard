"use client"

import { useState } from "react"
import { Send, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { sendMessageToClient, type MessagePriority } from "@/app/actions/messages"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface SendMessageButtonProps {
  clientId: string
  clientName: string
}

export function SendMessageButton({ clientId, clientName }: SendMessageButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [priority, setPriority] = useState<MessagePriority>("normal")
  const [isSending, setIsSending] = useState(false)
  const router = useRouter()

  const handleSend = async () => {
    if (!subject.trim() || !content.trim()) {
      toast.error("Error", {
        description: "El asunto y el contenido son obligatorios",
      })
      return
    }

    setIsSending(true)
    try {
      const result = await sendMessageToClient(clientId, subject, content, priority)

      if (result.success) {
        toast.success("Mensaje enviado", {
          description: `El mensaje ha sido enviado a ${clientName}`,
        })
        setIsOpen(false)
        setSubject("")
        setContent("")
        setPriority("normal")
        router.refresh()
      } else {
        toast.error("Error", {
          description: result.error || "No se pudo enviar el mensaje",
        })
      }
    } catch (error) {
      toast.error("Error", {
        description: "Ocurrió un error al enviar el mensaje",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-vanguard-300/40 bg-vanguard-400/10 text-vanguard-300 hover:bg-vanguard-400/20 hover:border-vanguard-300/60 transition-all"
        >
          <Send className="mr-2 h-4 w-4" />
          Enviar Mensaje
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-white/10 text-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Enviar mensaje a {clientName}</DialogTitle>
          <DialogDescription className="text-white/70">
            El cliente recibirá una notificación en su dashboard y podrá leer el mensaje.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Asunto */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-white/90">
              Asunto *
            </Label>
            <Input
              id="subject"
              placeholder="Ej: Actualización sobre tu demo"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          {/* Prioridad */}
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-white/90">
              Prioridad
            </Label>
            <Select value={priority} onValueChange={(value: MessagePriority) => setPriority(value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-white">
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="important">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-400" />
                    Importante
                  </div>
                </SelectItem>
                <SelectItem value="urgent">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-rose-400" />
                    Urgente
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contenido */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-white/90">
              Mensaje *
            </Label>
            <Textarea
              id="content"
              placeholder="Escribe tu mensaje aquí..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px] bg-white/10 border-white/20 text-white placeholder:text-white/50 resize-none"
            />
            <p className="text-xs text-white/50">
              {content.length} caracteres
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSend}
            disabled={isSending || !subject.trim() || !content.trim()}
            className="bg-vanguard-blue hover:bg-vanguard-blue/90 text-white"
          >
            {isSending ? (
              <>Enviando...</>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar Mensaje
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
