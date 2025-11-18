"use client"

import { logActivity } from "@/app/actions/client-activities"
import { useKnowledgeBase } from "@/contexts/knowledge-base-context"
import { useLanguage } from "@/contexts/language-context"
import { ResponseGenerator } from "@/lib/knowledge-base/response-generator"
import { useEffect, useState } from "react"
import { Bot } from "lucide-react"

// Temporary icons until lucide-react is resolved
const MessageCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
)

const Sparkles = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
)

const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

interface Message {
  id: string
  user: "Bot" | "You"
  text: string
  timestamp: string
}

const responseGenerator = new ResponseGenerator()

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      user: "Bot",
      text: "¡Hola! Soy PORTAL, tu asistente de IA. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const { language } = useLanguage()
  const { search, isEnabled } = useKnowledgeBase()

  // Auto-abrir chatbot con mensaje de bienvenida para nuevos usuarios
  useEffect(() => {
    // Función para resetear el estado de bienvenida (útil para testing)
    // Para resetear: localStorage.removeItem('portal-welcome-seen')
    const hasSeenWelcome = localStorage.getItem('portal-welcome-seen')

    if (!hasSeenWelcome) {
      const timer = setTimeout(() => {
        // Abrir el chatbot
        setIsOpen(true)

        // Marcar que ya se mostró el mensaje de bienvenida
        localStorage.setItem('portal-welcome-seen', 'true')

        // Agregar mensaje de bienvenida personalizado
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          user: "Bot",
          text: `¡Bienvenido a PORTAL! 👋\n\nEstoy aquí para ayudarte en tu experiencia con nuestras soluciones de IA. Te recomiendo explorar nuestro catálogo de demos disponibles para ver cómo podemos transformar tu negocio.\n\nSi tienes cualquier duda o necesitas más información, no dudes en agendar una reunión con nuestros especialistas. ¿En qué puedo ayudarte hoy?`,
          timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
        }

        setMessages((prev) => [welcomeMessage])
      }, 10000) // 10 segundos

      return () => clearTimeout(timer)
    }
  }, [])

  // Escuchar evento para abrir chatbot con contexto
  useEffect(() => {
    const handleOpenChatbot = (event: CustomEvent) => {
      const { demoName, initialMessage } = event.detail

      // Abrir el chatbot
      setIsOpen(true)

      // Agregar mensaje del bot preguntando sobre la demo
      const botMessage: Message = {
        id: Date.now().toString(),
        user: "Bot",
        text: `¡Hola! Veo que te interesa la demo "${demoName}". ¿Qué dudas tienes sobre ella? Puedo ayudarte con características, casos de uso, implementación y más.`,
        timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, botMessage])
    }

    window.addEventListener('openChatbot', handleOpenChatbot as EventListener)

    return () => {
      window.removeEventListener('openChatbot', handleOpenChatbot as EventListener)
    }
  }, [])

  const handleToggleOpen = async () => {
    if (!isOpen) {
      // Registrar actividad al abrir el chatbot
      await logActivity(
        "chat-opened",
        "Abrió el chatbot de consultas",
        {}
      )
    }
    setIsOpen(true)
  }

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      user: "You",
      text: input,
      timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      // Buscar en la base de conocimiento
      const results = await search(input, language)

      // Generar respuesta
      const response = responseGenerator.generate(
        input,
        results,
        language
      )


      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        user: "Bot",
        text: response,
        timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
      }

      setTimeout(() => {
        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      }, 500)
    } catch (error) {
      console.error("Error generating response:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        user: "Bot",
        text: language === "en"
          ? "I'm sorry, I encountered an error. Please try again."
          : "Lo siento, encontré un error. Por favor intenta de nuevo.",
        timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, errorMessage])
      setIsTyping(false)
    }
  }

  return (
    <>
      {/* Botón flotante */}
      {!isOpen && (
        <button
          onClick={handleToggleOpen}
          className="fixed bottom-6 right-6 z-50 bg-vanguard-blue hover:bg-vanguard-blue/90 text-white rounded-full p-4 shadow-2xl hover:shadow-vanguard-blue/50 transition-all duration-300 hover:scale-110 group"
          aria-label="Abrir chat"
          style={{ zIndex: 9998 }}
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-pulse shadow-lg shadow-amber-400/50" />
        </button>
      )}

      {/* Ventana emergente */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 w-[90vw] max-w-md h-[600px] bg-slate-900 rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
          style={{ zIndex: 9999 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-vanguard-blue/20 to-vanguard-red/20 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-vanguard-blue/20">
                <Bot className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">
                  <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                    PORTAL
                  </span>
                </h3>
                <p className="text-xs text-white/70">En línea</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              aria-label="Cerrar chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-800/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.user === "You" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.user === "You"
                      ? "bg-vanguard-blue text-white"
                      : "bg-white/10 text-white border border-white/20"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs mt-1 opacity-70">{msg.timestamp}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-75" />
                  <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-150" />
                </div>
                <span>Escribiendo...</span>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-white/10 bg-slate-900">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={language === "en" ? "Type your message..." : "Escribe tu mensaje..."}
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-vanguard-blue"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="bg-vanguard-blue hover:bg-vanguard-blue/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
