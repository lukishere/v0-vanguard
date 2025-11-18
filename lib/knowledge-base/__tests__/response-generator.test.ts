import { describe, expect, it } from "vitest"
import { Document } from "langchain/document"

import { ResponseGenerator } from "@/lib/knowledge-base/response-generator"

const generator = new ResponseGenerator()

const createDoc = (content: string, metadata?: Record<string, unknown>) =>
  new Document({
    pageContent: content,
    metadata: {
      type: "services",
      title: "Our Services",
      language: "en",
      ...metadata,
    },
  })

describe("ResponseGenerator", () => {
  it("returns a concise services summary with sources in English", () => {
    const result = generator.generate(
      "What services do you offer?",
      [
        createDoc(
          "AI Development. Leverage the power of artificial intelligence. Features: AI Strategy, ML Implementation, NLP, Computer Vision, System Integration."
        ),
      ],
      "en"
    )

    expect(result).toContain("🧭")
    expect(result).toContain("Here is how we can help:")
    expect(result).toContain("- AI Development")
    expect(result.length).toBeLessThan(800)
  })

  it("provides contact details in Spanish", () => {
    const result = generator.generate(
      "¿Cómo los contacto?",
      [
        new Document({
          pageContent: "Email: info@vanguard.ai. Phone: +1-555-1234. Location: Mexico City, Mexico.",
          metadata: { type: "contact", title: "Información de Contacto", language: "es" },
        }),
      ],
      "es"
    )

    expect(result).toContain("✉️")
    expect(result).toContain("Puedes escribirnos")
  })

  it("falls back gracefully when no knowledge is available", () => {
    const response = generator.generate("Explain quantum entanglement please", [], "en")

    expect(response).toContain("couldn't find")
    expect(response).toContain("contacto@vanguard-ia.tech")
  })

  it("handles budget requests with a directed CTA", () => {
    const response = generator.generate("Necesito un presupuesto detallado", [], "es")

    expect(response).toContain("💼")
    expect(response).toContain("Obtendrás el mejor valor con una propuesta a medida.")
    expect(response).toContain("coordinemos una llamada breve")
    expect(response).toContain("contacto@vanguard-ia.tech")
    expect(response).not.toContain("Respuestas rápidas")
  })

  it("guides AI optimisation requests with diagnostics", () => {
    const response = generator.generate("How can AI improve our processes?", [], "en")

    expect(response).toContain("🤖")
    expect(response).toContain("AI shines when we anchor it to outcomes")
    expect(response).toContain("TechNova Solutions")
    expect(response).toContain("What processes slow you down today?")
  })

  it("provides infrastructure roadmap in Spanish", () => {
    const response = generator.generate("Necesitamos escalar nuestra infraestructura", [], "es")

    expect(response).toContain("🏗️")
    expect(response).toContain("Como arquitecto de infraestructura")
    expect(response).toContain("auditoría → planificación de capacidad → blueprint de arquitectura → implementación")
    expect(response).toContain("Global Financial Group")
  })

  it("highlights differentiators when asked why choose Vanguard", () => {
    const response = generator.generate("Why should we choose VANGUARD-IA over others?", [], "en")

    expect(response).toContain("🚀")
    expect(response).toContain("Why VANGUARD-IA? We focus on business transformation")
    expect(response).toContain("TechNova")
    expect(response).toContain("Let’s schedule a tailored demo")
  })
})