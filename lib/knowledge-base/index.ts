import { Document } from "langchain/document"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { getKnowledgeEntries, KnowledgeEntry } from "./data-loader"

// Feature flag to completely disable transformers import
const ENABLE_TRANSFORMERS = false // Set to true only when transformers is working

export type ContentMetadata = {
  source: string
  type: KnowledgeEntry["type"]
  language: KnowledgeEntry["language"]
  title?: string
}

type KnowledgeDocument = {
  doc: Document
  embedding: number[]
}

export class KnowledgeBase {
  private model: any
  private documents: KnowledgeDocument[] = []
  private splitter: RecursiveCharacterTextSplitter
  private initialized = false
  private loadedDefaultContent = false

  constructor() {
    this.splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    })
  }

  async initialize() {
    if (this.initialized) {
      return
    }

    // Completely disable transformers when flag is false
    if (!ENABLE_TRANSFORMERS) {
      console.warn("Transformers disabled via feature flag - KnowledgeBase will operate in degraded mode")
      this.initialized = false
      return
    }

    // Prevent initialization in browser environment
    if (typeof window !== 'undefined') {
      console.warn("KnowledgeBase initialization skipped in browser environment")
      this.initialized = false
      return
    }

    try {
      console.log("Initializing transformers model...")

      // Add timeout and better error handling for the import
      const importPromise = import("@xenova/transformers")
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Transformers import timeout")), 30000)
      )

      const { pipeline } = await Promise.race([importPromise, timeoutPromise]) as any

      console.log("Pipeline imported successfully, creating model...")
      this.model = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2")
      this.initialized = true
      console.log("Transformers model initialized successfully")
    } catch (error) {
      console.error("Error initializing transformers pipeline:", error)
      console.error("Stack trace:", error instanceof Error ? error.stack : "No stack trace")
      // Don't throw - allow graceful degradation
      this.initialized = false
      console.warn("KnowledgeBase will operate in degraded mode without embeddings")
    }
  }

  async ensureDefaultContentLoaded() {
    if (!this.initialized) {
      await this.initialize()
    }

    if (this.loadedDefaultContent) {
      return
    }

    const entries = getKnowledgeEntries()
    await this.addEntries(entries)
    this.loadedDefaultContent = true
  }

  async addEntries(entries: KnowledgeEntry[]) {
    for (const entry of entries) {
      await this.addEntry(entry)
    }
  }

  async addEntry(entry: KnowledgeEntry) {
    if (!this.initialized) {
      console.warn("Knowledge base not initialized, skipping entry:", entry.title)
      return // Graceful degradation - don't throw
    }

    const text = this.formatEntry(entry)
    const chunks = await this.splitter.createDocuments([text], [
      {
        source: `/${entry.type}`,
        type: entry.type,
        language: entry.language,
        title: entry.title ?? ("title" in entry.content ? entry.content.title : entry.type),
      },
    ])

    for (const chunk of chunks) {
      const embedding = await this.getEmbedding(chunk.pageContent)
      this.documents.push({ doc: chunk, embedding })
    }
  }

  private formatEntry(entry: KnowledgeEntry): string {
    switch (entry.type) {
      case "services":
        return entry.content.services
          .map(
            (s) =>
              `${s.title}. ${s.description}. Features: ${Array.isArray(s.features) ? s.features.join(", ") : ""}`
          )
          .join("\n\n")
      case "faq":
        return entry.content.faqs.map((f) => `Q: ${f.question} A: ${f.answer}`).join("\n\n")
      case "about":
        return [
          `${entry.content.mission.title}: ${entry.content.mission.content}`,
          `${entry.content.vision.title}: ${entry.content.vision.content}`,
          entry.content.values?.items
            ? `Values: ${entry.content.values.items.map((item) => `${item.title} - ${item.description}`).join("; ")}`
            : "",
          entry.content.approach?.steps
            ? `Approach: ${entry.content.approach.steps
                .map((step) => `${step.number} ${step.title}: ${step.description}`)
                .join("; ")}`
            : "",
        ]
          .filter(Boolean)
          .join("\n\n")
      case "contact":
        return `Email: ${entry.content.email}. Phone: ${entry.content.phone}. Location: ${entry.content.address}, ${entry.content.city}, ${entry.content.country}.`
      default:
        return JSON.stringify(entry.content)
    }
  }

  async search(query: string, language: ContentMetadata["language"] = "en", k: number = 3): Promise<Document[]> {
    if (!this.initialized) {
      console.warn("Knowledge base not initialized, returning empty results")
      return [] // Return empty results instead of throwing
    }

    const queryEmbedding = await this.getEmbedding(query)
    const scores = this.documents.map(({ doc, embedding }) => ({
      doc,
      score: this.cosineSimilarity(queryEmbedding, embedding),
    }))

    return scores
      .filter(({ doc }) => doc.metadata.language === language)
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .map((item) => item.doc)
  }

  private async getEmbedding(text: string): Promise<number[]> {
    const output = await this.model(text, { pooling: "mean", normalize: true })
    return Array.from(output.data)
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
    return dotProduct / (magnitudeA * magnitudeB)
  }
}
