"use server"

import { auth } from "@clerk/nextjs/server"
import { hybridChat, type HybridChatResult } from "@/lib/chatbot/hybrid-chat"
import type { ProviderLanguage } from "@/lib/chatbot/providers"

export async function hybridChatAction({
  message,
  history,
  language = "es",
}: {
  message: string
  history?: Array<{ role: "user" | "assistant"; content: string }>
  language?: ProviderLanguage
}): Promise<HybridChatResult> {
  try {
    const { userId } = await auth()

    if (!userId) {
      console.error("[hybridChatAction] No authenticated user")
      return {
        source: "gemini",
        reply: language === "es"
          ? "Por favor, inicia sesión para usar el asistente."
          : "Please sign in to use the assistant.",
        metadata: {
          provider: "gemini",
          model: "unavailable",
          language,
          usage: null,
        },
      }
    }

    return await hybridChat({
      userId,
      message,
      language,
      history,
    })
  } catch (error) {
    console.error("[hybridChatAction] Error:", error)

    return {
      source: "gemini",
      reply: language === "es"
        ? "Lo siento, ocurrió un error al procesar tu mensaje. Por favor intenta de nuevo."
        : "Sorry, an error occurred processing your message. Please try again.",
      metadata: {
        provider: "gemini",
        model: "error",
        language,
        usage: null,
      },
    }
  }
}
