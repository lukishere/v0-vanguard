"use client"

import { useState, useEffect } from "react"

export default function CopilotDemo() {
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([
    {
      role: 'assistant',
      content: '¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte hoy? Puedo responder preguntas sobre nuestros servicios, automatización de procesos, y mucho más.'
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return

    const userMessage = { role: 'user' as const, content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "¡Excelente pregunta! Basándome en nuestros servicios, te recomiendo implementar un sistema de automatización que puede reducir los tiempos de respuesta en un 60%.",
        "Según nuestros casos de éxito, las empresas que implementan IA generativa ven mejoras significativas en la satisfacción del cliente. ¿Te gustaría que profundice en algún aspecto específico?",
        "Puedo ayudarte a diseñar un flujo de trabajo personalizado. ¿Qué tipo de procesos buscas automatizar?",
        "Nuestros modelos de IA están entrenados con datos de más de 500 empresas. Esto nos permite ofrecer recomendaciones altamente precisas para tu sector."
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setMessages(prev => [...prev, { role: 'assistant', content: randomResponse }])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Vanguard Copilot</h1>
              <p className="text-white/70">Asistente de IA para soporte y automatización</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-white border border-white/20'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-white border border-white/20 px-4 py-2 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-white/20 p-4">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu pregunta aquí..."
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-3">Características de la Demo</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-white/70">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Procesamiento de lenguaje natural</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Respuestas contextuales</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Aprendizaje continuo</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Integración multi-canal</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Análisis de sentimientos</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Reportes en tiempo real</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

