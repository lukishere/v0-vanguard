"use client"

import { useMemo, useState, useTransition } from "react"
import { hybridChatAction } from "@/app/dashboard/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Sparkles, Database } from "lucide-react"

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  source?: "knowledge-base" | "perplexity" | "gemini"
  snippets?: Array<{ title?: string; content: string }>
}

const SUGGESTIONS = [
  "¿Cómo puedo extender mi demo actual?",
  "Recuérdame los próximos pasos para onboarding.",
  "Recomiéndame recursos para mi equipo.",
]

export function ChatbotWidget() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isPending, startTransition] = useTransition()

  const assistantTyping = isPending

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    startTransition(async () => {
      try {
        const result = await hybridChatAction({
          message: trimmed,
          history: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        })

        if (result.source === "knowledge-base") {
          setMessages((prev) => [
            ...prev,
            {
              id: `assistant-${Date.now()}`,
              role: "assistant",
              content: result.reply,
              source: "knowledge-base",
              snippets: result.snippets ?? [],
            },
          ])
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: `assistant-${Date.now()}`,
              role: "assistant",
              content: result.reply,
              source: result.source,
            },
          ])
        }
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content:
              "No pude procesar tu mensaje en este momento. Vuelve a intentarlo o contacta a tu representante.",
          },
        ])
        console.error("ChatbotWidget error", error)
      }
    })
  }

  const renderMessage = (message: ChatMessage) => {
    if (message.role === "user") {
      return (
        <div
          key={message.id}
          className="ml-auto max-w-[75%] rounded-2xl bg-vanguard-blue/90 px-4 py-3 text-sm text-white shadow-lg shadow-vanguard-blue/30"
        >
          {message.content}
        </div>
      )
    }

    return (
      <div
        key={message.id}
        className="max-w-[80%] rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/90 shadow-md shadow-black/20"
      >
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/40">
          {message.source === "knowledge-base" ? (
            <>
              <Database className="h-4 w-4 text-vanguard-blue" />
              Base interna
            </>
          ) : message.source === "perplexity" ? (
            <>
              <Sparkles className="h-4 w-4 text-emerald-300" />
              Perplexity
            </>
          ) : message.source === "gemini" ? (
            <>
              <Sparkles className="h-4 w-4 text-amber-300" />
              Gemini
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-white/40" />
              Vanguard IA
            </>
          )}
        </div>
        <p className="mt-2 leading-relaxed text-white/90">{message.content}</p>
        {message.snippets && message.snippets.length > 0 ? (
          <div className="mt-3 space-y-2 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/70">
            <p className="font-semibold uppercase tracking-[0.2em] text-white/40">Fuentes internas</p>
            {message.snippets.map((snippet, index) => (
              <div key={index} className="space-y-1 rounded-lg border border-white/10 bg-white/5 p-2">
                {snippet.title ? (
                  <p className="text-xs font-semibold text-white">{snippet.title}</p>
                ) : null}
                <p className="text-[11px] leading-snug">{snippet.content}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <Card className="border-white/10 bg-slate-900/60 text-white backdrop-blur">
      <CardHeader className="flex flex-col gap-2 border-b border-white/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white">Asistente Vanguard</CardTitle>
          <Badge variant="outline" className="border-emerald-300/40 text-emerald-200">
            Activo
          </Badge>
        </div>
        <p className="text-xs text-white/50">
          Consulta a tu copiloto híbrido. Respuestas rápidas con contexto de tus demos y la IA de Perplexity/Gemini.
        </p>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        {messages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-white/60">
            <p className="font-medium text-white">Sugerencias rápidas:</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={() => setInput(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        ) : null}

        <ScrollArea className="h-64 space-y-3 rounded-2xl border border-white/10 bg-slate-900/40 p-4">
          <div className="flex flex-col gap-3">
            {messages.map(renderMessage)}
            {assistantTyping ? (
              <div className="flex items-center gap-2 text-xs text-white/50">
                <Loader2 className="h-4 w-4 animate-spin text-vanguard-blue" />
                Vanguard está escribiendo...
              </div>
            ) : null}
          </div>
        </ScrollArea>

        <div className="space-y-3">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Escribe tu pregunta..."
            className="min-h-[80px] bg-white/5 text-white"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault()
                if (!isPending) {
                  handleSend()
                }
              }
            }}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">
              Respuestas impulsadas por conocimiento interno y IA generativa.
            </span>
            <Button
              onClick={handleSend}
              disabled={isPending || !input.trim()}
              className="bg-vanguard-blue text-white hover:bg-vanguard-blue/90"
            >
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Enviar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}



