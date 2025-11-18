import { getAllDemos } from "@/lib/demos/catalog"
import type { Demo } from "@/lib/demos/types"
import { KnowledgeBase } from "@/lib/knowledge-base"
import type { ProviderLanguage } from "@/lib/chatbot/providers"
import { callPerplexity, callGemini } from "@/lib/chatbot/providers"
import { buildClientContext } from "@/lib/chatbot/context-enricher"

type ChatHistory = Array<{ role: "user" | "assistant"; content: string }>

export type HybridChatOptions = {
  userId: string
  message: string
  language?: ProviderLanguage
  history?: ChatHistory
  preferProvider?: "perplexity" | "gemini"
}

export type HybridChatResult =
  | {
      source: "knowledge-base"
      reply: string
      snippets: Array<{ content: string; source?: string; title?: string }>
      metadata: {
        demosAsignados: string[]
        confidence: "high" | "medium"
      }
    }
  | {
      source: "perplexity" | "gemini"
      reply: string
      metadata: {
        provider: "perplexity" | "gemini"
        model: string
        language: ProviderLanguage
        usage?: unknown
      }
    }

let knowledgeBaseSingleton: KnowledgeBase | null = null
let demosCache: Demo[] | null = null

async function getKnowledgeBaseInstance() {
  if (!knowledgeBaseSingleton) {
    knowledgeBaseSingleton = new KnowledgeBase()
    await knowledgeBaseSingleton.initialize()
    await knowledgeBaseSingleton.ensureDefaultContentLoaded()
  }
  return knowledgeBaseSingleton
}

async function getDemosCatalog() {
  if (!demosCache) {
    demosCache = await getAllDemos()
  }
  return demosCache
}

export async function hybridChat({
  userId,
  message,
  language = "es",
  history,
  preferProvider = "perplexity",
}: HybridChatOptions): Promise<HybridChatResult> {
  const kb = await getKnowledgeBaseInstance()
  const demos = await getDemosCatalog()

  const [clientContext, matches] = await Promise.all([
    buildClientContext(userId, language),
    kb.search(message, language === "es" ? "es" : "en", 3),
  ])

  const assignedDemos = clientContext.assignedDemos.map((item) => item.name)

  if (matches.length > 0) {
    const snippets = matches.map((doc) => ({
      content: doc.pageContent,
      source: doc.metadata?.source as string | undefined,
      title: doc.metadata?.title as string | undefined,
    }))

    const highlighted = snippets
      .map((snippet) => {
        const excerpt = snippet.content.length > 380 ? `${snippet.content.slice(0, 380)}...` : snippet.content
        return `• ${excerpt}`
      })
      .join("\n\n")

    const demosLine =
      assignedDemos.length > 0
        ? language === "es"
          ? `\n\nDemos asignadas relevantes: ${assignedDemos.join(", ")}.`
          : `\n\nRelevant assigned demos: ${assignedDemos.join(", ")}.`
        : ""

    const reply =
      language === "es"
        ? `Información encontrada en la base de conocimiento:\n\n${highlighted}${demosLine}\n\n${clientContext.summary}`
        : `Information retrieved from the knowledge base:\n\n${highlighted}${demosLine}\n\n${clientContext.summary}`

    return {
      source: "knowledge-base",
      reply,
      snippets,
      metadata: {
        demosAsignados: assignedDemos,
        confidence: matches.length >= 2 ? "high" : "medium",
      },
    }
  }

  const providers: Array<"perplexity" | "gemini"> =
    preferProvider === "perplexity" ? ["perplexity", "gemini"] : ["gemini", "perplexity"]

  const assistantContext = [{ role: "assistant" as const, content: clientContext.summary }]

  for (const provider of providers) {
    try {
      const completion =
        provider === "perplexity"
          ? await callPerplexity({
              message,
              context: [...(history ?? []), ...assistantContext],
              language,
            })
          : await callGemini({
              message,
              context: [...(history ?? []), ...assistantContext],
              language,
            })

      return {
        source: provider,
        reply: completion.reply,
        metadata: {
          provider,
          model: completion.model,
          language,
          usage: completion.usage ?? null,
        },
      }
    } catch (error) {
      console.error(`[HybridChat] ${provider} fallback failed`, error)
    }
  }

  const fallback =
    language === "es"
      ? "No pude encontrar información relevante en este momento. Nuestro equipo te contactará para darte seguimiento personal."
      : "I couldn't find relevant information right now. Our team will reach out to provide a personalised follow-up."

  return {
    source: preferProvider,
    reply: fallback,
    metadata: {
      provider: preferProvider,
      model: "unavailable",
      language,
      usage: null,
    },
  }
}
