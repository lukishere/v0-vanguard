import { GoogleGenerativeAI } from "@google/generative-ai"

type MessageContext = Array<{ role: "user" | "assistant"; content: string }>

export type ProviderLanguage = "es" | "en"

const DEFAULT_PERPLEXITY_MODEL = "pplx-70b-chat"
const DEFAULT_GEMINI_MODEL = "gemini-1.5-flash"
const PERPLEXITY_ENDPOINT = "https://api.perplexity.ai/chat/completions"

function buildPerplexitySystemPrompt(language: ProviderLanguage) {
  if (language === "es") {
    return "Eres un asesor especializado en Vanguard-IA. Responde en español de forma concreta, con pasos y referencias a servicios cuando aplique."
  }
  return "You are a Vanguard-IA advisor. Respond in English with concise, actionable guidance referencing services when relevant."
}

function buildGeminiPrompt(message: string, context: MessageContext | undefined, language: ProviderLanguage) {
  const instruction =
    language === "es"
      ? "Actúa como consultor senior de Vanguard-IA. Responde en español, orientado a negocio y con recomendaciones prácticas."
      : "Act as a senior consultant from Vanguard-IA. Respond in English with business-focused, practical recommendations."

  const history =
    context
      ?.map((entry) => `${entry.role === "assistant" ? "Vanguard" : "Cliente"}: ${entry.content}`)
      .join("\n") ?? ""

  return `${instruction}

Historial:
${history}

Mensaje:
${message}
`
}

export async function callPerplexity({
  message,
  context,
  language = "es",
}: {
  message: string
  context?: MessageContext
  language?: ProviderLanguage
}) {
  const apiKey = process.env.PERPLEXITY_API_KEY
  if (!apiKey) {
    throw new Error("PERPLEXITY_API_KEY is not configured")
  }

  const systemPrompt = buildPerplexitySystemPrompt(language)
  const response = await fetch(PERPLEXITY_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEFAULT_PERPLEXITY_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...(context ?? []),
        { role: "user", content: message },
      ],
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(`Perplexity API error: ${JSON.stringify(error)}`)
  }

  const completion = await response.json()
  const reply = completion?.choices?.[0]?.message?.content ?? ""

  return {
    reply,
    usage: completion?.usage ?? null,
    model: DEFAULT_PERPLEXITY_MODEL,
    provider: "perplexity" as const,
  }
}

export async function callGemini({
  message,
  context,
  language = "es",
}: {
  message: string
  context?: MessageContext
  language?: ProviderLanguage
}) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured")
  }

  const prompt = buildGeminiPrompt(message, context, language)
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: DEFAULT_GEMINI_MODEL })

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  })

  const reply = result.response.text()

  return {
    reply,
    usage: result.response.usageMetadata ?? null,
    model: DEFAULT_GEMINI_MODEL,
    provider: "gemini" as const,
  }
}



