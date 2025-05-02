"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Send, X, Loader2 } from "lucide-react"

type Message = {
  text: string
  isUser: boolean
}

export function Chatbot() {
  const { language, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([{ text: t("chat.greeting"), isUser: false }])
  const [input, setInput] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Periodic subtle animation for the chat button
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setIsAnimating(false)
      }, 1500) // Vibration lasts for 1.5 seconds
    }, 25000) // Run every 25 seconds

    // Initial animation after 2 seconds
    const initialTimeout = setTimeout(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setIsAnimating(false)
      }, 2000)
    }, 2000)

    return () => {
      clearInterval(animationInterval)
      clearTimeout(initialTimeout)
    }
  }, [])

  // Update greeting when language changes
  useEffect(() => {
    setMessages([{ text: t("chat.greeting"), isUser: false }])
  }, [language, t])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return

    // Add user message
    const userMessage = { text: input, isUser: true }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      // Prepare messages for the API
      const apiMessages = [
        ...messages.map((msg) => ({
          role: msg.isUser ? "user" : "assistant",
          content: msg.text,
        })),
        { role: "user", content: input },
      ]

      // Call the API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: apiMessages }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      // Add AI response
      setMessages((prev) => [...prev, { text: data.response, isUser: false }])
    } catch (error) {
      console.error("Error getting chat response:", error)
      setMessages((prev) => [
        ...prev,
        {
          text:
            language === "en"
              ? "I'm sorry, I'm having trouble connecting right now. Please try again later."
              : "Lo siento, estoy teniendo problemas para conectarme en este momento. Por favor, inténtelo de nuevo más tarde.",
          isUser: false,
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <>
      {/* Enhanced Chat button */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
        <Button
          onClick={() => setIsOpen(true)}
          className={`rounded-full p-4 bg-vanguard-blue hover:bg-vanguard-blue/90 shadow-md transition-all duration-300 transform hover:scale-105 ${isAnimating ? "animate-vibrate" : ""}`}
          size="icon"
          aria-label={t("chat.open")}
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>

      {/* Chat window */}
      {isOpen && (
        <Card className="fixed bottom-8 right-8 w-80 sm:w-96 shadow-md z-50 border-0 vanguard-card overflow-hidden animate-fade-in">
          <CardHeader className="bg-vanguard-blue text-white py-3 px-4 flex flex-row justify-between items-center">
            <CardTitle className="text-lg font-medium">{t("chat.title")}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-white hover:bg-vanguard-blue/80 transition-all duration-300"
            >
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-4 h-80 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 transition-all duration-300 animate-fade-in ${
                      message.isUser ? "bg-vanguard-blue text-white" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2 flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span>{language === "en" ? "Thinking..." : "Pensando..."}</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("chat.placeholder")}
                className="flex-1 transition-all duration-300 focus:border-vanguard-blue focus:ring-vanguard-blue"
                disabled={isTyping}
              />
              <Button
                type="submit"
                size="icon"
                className="bg-vanguard-blue hover:bg-vanguard-blue/90 transition-all duration-300 transform hover:scale-110"
                disabled={isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  )
}
