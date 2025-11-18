import { getClientPublicMetadata } from "@/lib/admin/clerk-metadata"
import { getAllDemos } from "@/lib/demos/catalog"
import type { Demo } from "@/lib/demos/types"
import { resourcesData } from "@/lib/content/resources"
import type { ProviderLanguage } from "@/lib/chatbot/providers"

export type ClientChatContext = {
  summary: string
  assignedDemos: Array<{
    id: string
    name: string
    status: Demo["status"]
    daysRemaining: number
  }>
  recommendedResources: Array<{
    title: string
    url: string
    type: string
  }>
}

let demosCache: Demo[] | null = null

async function getDemosCatalog() {
  if (!demosCache) {
    demosCache = await getAllDemos()
  }
  return demosCache
}

export async function buildClientContext(userId: string, language: ProviderLanguage = "es"): Promise<ClientChatContext> {
  const [metadata, demos] = await Promise.all([getClientPublicMetadata(userId), getDemosCatalog()])

  const assignedDemos = metadata.demoAccess.map((access) => {
    const demo = demos.find((item) => item.id === access.demoId)
    return {
      id: access.demoId,
      name: demo?.name ?? access.demoId,
      status: demo?.status ?? "active",
      daysRemaining: access.daysRemaining,
    }
  })

  const recommendedResources = resourcesData
    .flatMap((category) => category.resources)
    .filter((resource) => assignedDemos.some((demo) => resource.serviceId === demo.id))
    .slice(0, 4)
    .map((resource) => ({
      title: resource.title,
      url: resource.url,
      type: resource.type,
    }))

  const demosLine =
    assignedDemos.length > 0
      ? assignedDemos
          .map(
            (demo) =>
              `${demo.name} (${language === "es" ? "días restantes" : "days remaining"}: ${demo.daysRemaining})`
          )
          .join(", ")
      : language === "es"
      ? "No hay demos asignadas actualmente."
      : "No demos assigned at the moment."

  const resourcesLine =
    recommendedResources.length > 0
      ? recommendedResources.map((resource) => resource.title).join(", ")
      : language === "es"
      ? "Sin recursos recomendados todavía."
      : "No recommended resources yet."

  const summary =
    language === "es"
      ? `Demos asignadas: ${demosLine}. Recursos sugeridos: ${resourcesLine}.`
      : `Assigned demos: ${demosLine}. Suggested resources: ${resourcesLine}.`

  return {
    summary,
    assignedDemos,
    recommendedResources,
  }
}
