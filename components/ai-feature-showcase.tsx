"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Brain, Sparkles, Loader2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function AIFeatureShowcase() {
  const { language } = useLanguage()
  const [query, setQuery] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const examples = [
    language === "en" ? "How can AI help my business?" : "¿Cómo puede la IA ayudar a mi negocio?",
    language === "en" ? "What security services do you offer?" : "¿Qué servicios de seguridad ofrecen?",
    language === "en" ? "Tell me about your web branding services" : "Háblame sobre sus servicios de branding web",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || isLoading) return

    setIsLoading(true)
    setHasInteracted(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: query }],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()
      setResponse(data.response)
    } catch (error) {
      console.error("Error getting AI response:", error)
      setResponse(
        language === "en"
          ? "I'm sorry, I'm having trouble connecting right now. Please try again later."
          : "Lo siento, estoy teniendo problemas para conectarme en este momento. Por favor, inténtelo de nuevo más tarde.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleExampleClick = (example: string) => {
    setQuery(example)
  }

  return (
    <Card className="border-0 shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-vanguard-blue to-blue-700 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="h-6 w-6" />
          <CardTitle>{language === "en" ? "Groq-Powered Assistance" : "Asistencia Potenciada por Groq"}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={language === "en" ? "Ask about our services..." : "Pregunte sobre nuestros servicios..."}
              className="w-full"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {examples.map((example, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleExampleClick(example)}
                  className="text-xs flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" />
                  {example}
                </Button>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full bg-vanguard-blue hover:bg-vanguard-blue/90" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {language === "en" ? "Processing..." : "Procesando..."}
              </>
            ) : language === "en" ? (
              "Get Response"
            ) : (
              "Obtener Respuesta"
            )}
          </Button>
        </form>

        {(response || isLoading) && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-2">{language === "en" ? "Response:" : "Respuesta:"}</h4>
            {isLoading ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{language === "en" ? "Generating response..." : "Generando respuesta..."}</span>
              </div>
            ) : (
              <p className="text-gray-700">{response}</p>
            )}
          </div>
        )}

        {!hasInteracted && !isLoading && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 text-center">
            <p className="text-vanguard-blue">
              {language === "en"
                ? "Ask about our services using the examples above."
                : "Pregunte sobre nuestros servicios usando los ejemplos anteriores."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
