import { genkit } from "genkit"
import { googleAI, gemini20Flash } from "@genkit-ai/googleai"
import { defineSecret } from "firebase-functions/params"
import { logger } from "firebase-functions"
import { z } from "zod"
import { hasClaim, onCallGenkit } from "firebase-functions/https"

const apiKey = defineSecret("GEMINI_API_KEY")

const ai = genkit({
  plugins: [googleAI()],
  model: gemini20Flash,
})

const guardbotMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
})

const guardbotInputSchema = z.object({
  message: z.string().min(1).max(2000),
  context: z.array(guardbotMessageSchema).max(12).optional(),
  locale: z.enum(["en", "es"]).optional(),
})

const guardbotOutputSchema = z.object({
  response: z.string(),
  context: z.array(guardbotMessageSchema),
})

type GuardbotMessage = z.infer<typeof guardbotMessageSchema>
type GuardbotInput = z.infer<typeof guardbotInputSchema>
type GuardbotOutput = z.infer<typeof guardbotOutputSchema>

const MAX_CONTEXT_MESSAGES = 8

type GuardbotLocale = "en" | "es"

const SYSTEM_PROMPT = `You are GuardBot, the official AI assistant for VANGUARD. 
- Maintain a concise, professional tone that reflects a trusted technology consultancy.
- Base every answer solely on verified company information or the provided knowledge base context.
- When unsure, acknowledge the limitation and offer to connect the user with a human via email (contacto@vanguard-ia.tech).
- Adopt the role that best fits the topic (consultant, architect, security specialist) and ask 1–3 diagnostic questions before proposing next steps.
- Reference proven client outcomes (TechNova +40% efficiency, Global Financial Group security improvements, HealthPlus digital growth) when relevant.
- Always close with a clear call to action (audit, consultation, demo, call).
- Never fabricate contacts, pricing, or commitments.
- If the user asks for pricing, quotes, budgets, or estimates, decline to invent figures and instead invite them to share requirements via contacto@vanguard-ia.tech or schedule a quick call.` 

const FALLBACK: Record<GuardbotLocale, string> = {
  en: "I ran into an issue composing that answer. Please try again or email us at contacto@vanguard-ia.tech.",
  es: "Tuve un problema al preparar la respuesta. Inténtalo de nuevo o escríbenos a contacto@vanguard-ia.tech.",
}

const chatFlow = ai.defineFlow({
  name: "chat",
  inputSchema: guardbotInputSchema,
  outputSchema: guardbotOutputSchema,
}, async ({ message, context = [], locale }: GuardbotInput) => {
  const trimmedMessage = message.trim()
  if (!trimmedMessage) {
    const notice =
      (locale ?? "en") === "es"
        ? "No pude procesar un mensaje vacío. ¿Podrías reformularlo?"
        : "I couldn't process an empty message. Could you rephrase it?"

    return { response: notice, context }
  }

  const sanitizedHistory = sanitizeContext(context)
  const recentHistory = sanitizedHistory.slice(-MAX_CONTEXT_MESSAGES)
  const activeLocale: GuardbotLocale = locale ?? "en"

  logger.debug("GuardBot request received", {
    locale: activeLocale,
    messageLength: trimmedMessage.length,
    contextMessages: recentHistory.length,
  })

  const prompt = buildPrompt(trimmedMessage, recentHistory, activeLocale)

  try {
    const { text } = await ai.generate(prompt)
    const safeResponse = (text ?? "").trim() || FALLBACK[activeLocale]

    logger.debug("GuardBot response generated", {
      locale: activeLocale,
      responseLength: safeResponse.length,
    })

    const newContext = [
      ...recentHistory,
      { role: "user", content: trimmedMessage },
      { role: "assistant", content: safeResponse },
    ].slice(-MAX_CONTEXT_MESSAGES) as GuardbotMessage[]

    return {
      response: safeResponse,
      context: newContext,
    }
  } catch (error) {
    logger.error("GuardBot generation failed", { error })

    return {
      response: FALLBACK[activeLocale],
      context: recentHistory,
    }
  }
})

export const chatFunction = onCallGenkit(
  {
    secrets: [apiKey],
    authPolicy: hasClaim("email_verified"),
    enforceAppCheck: true,
  },
  chatFlow as unknown as (...args: unknown[]) => unknown
)

function sanitizeContext(history: GuardbotMessage[]): GuardbotMessage[] {
  return history
    .map<GuardbotMessage>((entry) => ({
      role: entry.role,
      content: entry.content.trim().slice(0, 800),
    }))
    .filter((entry) => entry.content.length > 0)
}

function buildPrompt(message: string, history: GuardbotMessage[], locale: GuardbotLocale) {
  const tone =
    locale === "es"
      ? "Responde en español neutro y mantén un tono profesional y directo."
      : "Respond in neutral English with a professional, direct tone."

  const historyText = history
    .map((entry) => `${entry.role === "user" ? "User" : "GuardBot"}: ${entry.content}`)
    .join("\n")

  const conversationBlock = historyText ? `Conversation so far:\n${historyText}\n\n` : ""

  return `${SYSTEM_PROMPT}\n${tone}\n\n${conversationBlock}Latest user request: ${message}`
}

