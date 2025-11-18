"use client"

import { useEffect, useState } from "react"
import { Bell, X, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface AdminMessage {
  id: string
  subject: string
  content: string
  priority: "normal" | "important" | "urgent"
  sentAt: string
  sentByName: string
  read: boolean
  readAt?: string
}

export function MessagesPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<AdminMessage[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar mensajes
  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/messages", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        // Si la respuesta no es ok, intentar leer el error
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        console.warn("Error al cargar mensajes:", response.status, errorData)

        // Si es un error 401 (no autenticado), no mostrar error, solo dejar vacío
        if (response.status === 401) {
          setMessages([])
          setUnreadCount(0)
          return
        }

        // Para otros errores, mantener el estado actual
        return
      }

      const data = await response.json()
      setMessages(data.messages || [])
      setUnreadCount(data.unreadCount || 0)
    } catch (error) {
      // Solo loggear errores de red reales, no errores de autenticación
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.warn("No se pudo conectar al servidor. Verificando conexión...")
        // En caso de error de red, mantener el estado actual
        return
      }
      console.error("Error al cargar mensajes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Cargar al montar y cada 10 segundos
  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 10000) // 10 segundos
    return () => clearInterval(interval)
  }, [])

  // Marcar mensaje como leído
  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}/read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (response.ok) {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === messageId ? { ...msg, read: true, readAt: new Date().toISOString() } : msg
          )
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      } else {
        console.warn("Error al marcar como leído:", response.status)
      }
    } catch (error) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.warn("No se pudo conectar al servidor para marcar como leído")
        return
      }
      console.error("Error al marcar como leído:", error)
    }
  }

  // Marcar todos como leídos
  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/messages/mark-all-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (response.ok) {
        setMessages(prev =>
          prev.map(msg => ({ ...msg, read: true, readAt: new Date().toISOString() }))
        )
        setUnreadCount(0)
      } else {
        console.warn("Error al marcar todos como leídos:", response.status)
      }
    } catch (error) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.warn("No se pudo conectar al servidor para marcar todos como leídos")
        return
      }
      console.error("Error al marcar todos como leídos:", error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-rose-500/20 text-rose-300 border-rose-500/30"
      case "important":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30"
      default:
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
    }
  }

  const getPriorityIcon = (priority: string) => {
    if (priority === "urgent" || priority === "important") {
      return <AlertCircle className="h-4 w-4" />
    }
    return null
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="default"
          className="relative flex items-center gap-2 text-white hover:bg-amber-500/20 hover:text-amber-100 bg-amber-400/10 border border-amber-400/30 shadow-lg shadow-amber-400/40 hover:shadow-amber-400/60 transition-all duration-300 px-4 py-2 rounded-lg font-medium"
        >
          <Bell className="h-4 w-4" />
          <span>Mensajes</span>
          {unreadCount > 0 && (
            <Badge
              className="h-5 w-5 flex items-center justify-center p-0 bg-rose-500 text-white text-xs border-2 border-slate-900 animate-pulse"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-slate-900 border-white/10 text-white w-full sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-white text-xl">Mensajes</SheetTitle>
              <SheetDescription className="text-white/70">
                Mensajes del equipo de Vanguard-IA
              </SheetDescription>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-vanguard-blue hover:text-vanguard-blue/80 hover:bg-vanguard-blue/10"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Marcar todos
              </Button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6 pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vanguard-blue"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-white/20 mb-4" />
              <p className="text-white/60 text-sm">
                No tienes mensajes aún
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-2xl border p-4 transition-all cursor-pointer ${
                    message.read
                      ? "border-white/10 bg-slate-800/40"
                      : "border-vanguard-blue/40 bg-vanguard-blue/5 shadow-lg shadow-vanguard-blue/10"
                  }`}
                  onClick={() => !message.read && markAsRead(message.id)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {!message.read && (
                          <div className="h-2 w-2 rounded-full bg-vanguard-blue animate-pulse"></div>
                        )}
                        <h4 className={`font-semibold ${!message.read ? "text-white" : "text-white/80"}`}>
                          {message.subject}
                        </h4>
                      </div>
                      <p className="text-xs text-white/50">
                        De: {message.sentByName} ·{" "}
                        {formatDistanceToNow(new Date(message.sentAt), {
                          locale: es,
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    {message.priority !== "normal" && (
                      <Badge
                        variant="outline"
                        className={`text-xs flex items-center gap-1 ${getPriorityColor(message.priority)}`}
                      >
                        {getPriorityIcon(message.priority)}
                        {message.priority === "urgent" ? "Urgente" : "Importante"}
                      </Badge>
                    )}
                  </div>

                  {/* Content */}
                  <p className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>

                  {/* Footer */}
                  {message.read && message.readAt && (
                    <p className="text-xs text-white/40 mt-3 pt-3 border-t border-white/10">
                      Leído{" "}
                      {formatDistanceToNow(new Date(message.readAt), {
                        locale: es,
                        addSuffix: true,
                      })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
