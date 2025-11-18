import { aboutContent } from "@/lib/content/about"
import { faqContent } from "@/lib/content/faq"
import { servicesContent } from "@/lib/content/services"
import { contactInfo } from "@/lib/content/contact"

type ServicesContent = (typeof servicesContent)["en"]
type FAQContent = (typeof faqContent)["en"]
type AboutContent = (typeof aboutContent)["en"]
type ContactContent = typeof contactInfo

export type KnowledgeEntry =
  | {
      type: "services"
      language: "en" | "es"
      content: ServicesContent
      title?: string
    }
  | {
      type: "faq"
      language: "en" | "es"
      content: FAQContent
      title?: string
    }
  | {
      type: "about"
      language: "en" | "es"
      content: AboutContent
      title?: string
    }
  | {
      type: "contact"
      language: "en" | "es"
      content: ContactContent
      title?: string
    }

export function getKnowledgeEntries(): KnowledgeEntry[] {
  const entries: KnowledgeEntry[] = []

  ;(["en", "es"] as const).forEach((language) => {
    entries.push({
      type: "services",
      language,
      content: servicesContent[language],
      title: servicesContent[language].title,
    })

    entries.push({
      type: "faq",
      language,
      content: faqContent[language],
      title: faqContent[language].title,
    })

    entries.push({
      type: "about",
      language,
      content: aboutContent[language],
      title: aboutContent[language].title,
    })
  })

  entries.push({
    type: "contact",
    language: "es",
    content: contactInfo,
    title: "Información de Contacto",
  })

  entries.push({
    type: "contact",
    language: "en",
    content: contactInfo,
    title: "Contact Information",
  })

  return entries
}

