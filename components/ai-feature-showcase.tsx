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
  const [error, setError] = useState<string | null>(null)

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
    setError(null)

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

      const contentType = response.headers.get("content-type") || "";
      if (!response.ok) {
        let errorMsg = "Failed to get response";
        if (contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } else {
          errorMsg = language === "en"
            ? "Server error: Unexpected response format. Please try again later."
            : "Error del servidor: Formato de respuesta inesperado. Por favor, inténtelo de nuevo más tarde.";
        }
        throw new Error(errorMsg);
      }

      if (!contentType.includes("application/json")) {
        throw new Error(
          language === "en"
            ? "Unexpected server response. Please try again later."
            : "Respuesta inesperada del servidor. Por favor, inténtelo de nuevo más tarde."
        );
      }

      const data = await response.json();
      setResponse(data.response)
    } catch (error) {
      console.error("Error getting AI response:", error)
      setError(
        error instanceof Error 
          ? error.message 
          : language === "en"
            ? "I'm sorry, I'm having trouble connecting right now. Please try again later."
            : "Lo siento, estoy teniendo problemas para conectarme en este momento. Por favor, inténtelo de nuevo más tarde."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleExampleClick = (example: string) => {
    setQuery(example)
    setError(null)
  }

  // Helper to format AI response with lists and paragraphs
  function formatResponse(text: string) {
    // If the text contains asterisks for lists, split and render as a list
    if (text.includes('*')) {
      // Split into paragraphs by double line breaks
      const paragraphs = text.split(/\n\n+/)
      return paragraphs.map((para, idx) => {
        // If paragraph contains list items
        if (para.trim().startsWith('*') || para.includes('\n*')) {
          // Split into lines, filter list items
          const items = para.split(/\n|\r/).filter(line => line.trim().startsWith('*'))
          // Remove asterisks and trim
          return (
            <ul className="list-disc pl-6 mb-2" key={idx}>
              {items.map((item, i) => (
                <li key={i}>{item.replace(/^\*\s?/, '').trim()}</li>
              ))}
            </ul>
          )
        } else {
          // Render as paragraph
          return <p className="mb-2" key={idx}>{para}</p>
        }
      })
    } else {
      // Otherwise, split by line breaks and render as paragraphs
      return text.split(/\n+/).map((line, idx) => <p className="mb-2" key={idx}>{line}</p>)
    }
  }

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 h-full overflow-hidden">
      <div className="bg-gradient-to-r from-vanguard-blue to-blue-700 p-4 flex items-center gap-2 border-b">
        <Brain className="h-8 w-8 text-white" />
        <div>
          <h4 className="font-semibold text-white text-lg">
            {language === "en" ? "Google Gemini-Powered Assistance" : "Asistencia Potenciada por Google Gemini"}
          </h4>
        </div>
      </div>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setError(null)
              }}
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {language === "en" ? "Thinking..." : "Pensando..."}
              </>
            ) : (
              language === "en" ? "Ask" : "Preguntar"
            )}
          </Button>
          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}
          {hasInteracted && !isLoading && !error && response && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100 text-gray-800 text-base">
              {formatResponse(response)}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
