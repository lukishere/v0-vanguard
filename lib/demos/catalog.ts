import type { Demo } from "./types"
import { getDemoUpdates } from "@/app/actions/demos"

/**
 * CATÁLOGO DE DEMOS - FLUJO DE ESTADOS
 *
 * - "available": Demo lista para solicitar. Aparece en la sección "Catálogo" de TODOS los clientes.
 * - "in-development": Demo en construcción. Aparece en la sección "En Desarrollo" de TODOS los clientes.
 * - "active": NO se usa en este catálogo. Las demos activas son aquellas que se ASIGNAN
 *             específicamente a un cliente desde Admin > Clientes.
 *
 * Cuando un admin asigna acceso a un cliente desde Admin > Clientes, la demo cambia
 * automáticamente a status "active" solo para ese cliente específico.
 */
export const DEMO_CATALOG: Demo[] = [
  {
    id: "automata-rrhh",
    name: "Automata de Recursos Humanos",
    summary: "Sistema automatizado de reclutamiento con IA para entrevistas y evaluación de candidatos.",
    description: "Plataforma integral de RRHH que automatiza el proceso de reclutamiento: desde la carga del CV hasta la entrevista automatizada, análisis de candidatos y envío de reportes por email. Incluye evaluación por IA, análisis de compatibilidad cultural y recomendaciones automáticas.",
    status: "available",
    tags: ["RRHH", "Reclutamiento", "IA", "Automatización", "Evaluación"],
    demoType: "dashboard",
    interactiveUrl: "https://vanguard-demos.vercel.app/demos/automata-rrhh",
    icon: "👥",
    nextStep: "Integración con sistema de RRHH existente y personalización de criterios de evaluación.",
    cta: "Experimentar reclutamiento automatizado",
  },
  {
    id: "vanguard-copilot",
    name: "Vanguard Copilot",
    summary: "Automatización de soporte con IA generativa y flujos de revisión humana.",
    description: "Bot de soporte inteligente que utiliza IA generativa para resolver consultas automáticamente, con escalamiento humano cuando es necesario. Incluye análisis de sentimiento y personalización por cliente.",
    status: "available",
    tags: ["IA Generativa", "Automatización", "CX"],
    demoType: "bot",
    interactiveUrl: "/copilot-simple",
    icon: "🤖",
    nextStep: "Esperando feedback del equipo comercial para ajustar prompts críticos.",
    cta: "Probar flujo conversacional",
  },
  {
    id: "insights360",
    name: "Insights 360",
    summary: "Panel de analítica que fusiona métricas de negocio con datos operativos en tiempo real.",
    description: "Dashboard completo de analítica que combina métricas de negocio, KPIs operativos y forecasting predictivo. Visualizaciones interactivas y reportes automatizados.",
    status: "available",
    tags: ["Analytics", "Forecasting", "DataOps"],
    demoType: "dashboard",
    interactiveUrl: "/dashboard",
    icon: "📊",
    nextStep: "Coordinar sesión hands-on para evaluar escenarios de forecasting.",
    cta: "Explorar panel interactivo",
  },
  {
    id: "guardian-ai",
    name: "Guardian AI",
    summary: "Monitor de seguridad preventiva con alertas inteligentes y priorización automática.",
    description: "Sistema de monitoreo de seguridad que utiliza IA para detectar amenazas, priorizar alertas y sugerir acciones preventivas. Integración con múltiples fuentes de datos de seguridad.",
    status: "in-development",
    tags: ["Seguridad", "Alerting", "Risk"],
    demoType: "dashboard",
    icon: "🛡️",
    progress: 60,
    milestones: [
      { label: "Dataset configurado", completed: true, date: "2024-01-10" },
      { label: "Prompts ajustados", completed: true, date: "2024-01-15" },
      { label: "Testing pendiente", completed: false },
      { label: "Integración con APIs", completed: false },
    ],
    estimatedDelivery: "2024-02-15",
    nextStep: "Validar reglas de correlación con el equipo de ciberseguridad.",
    cta: "Ver demo guiada",
  },
  {
    id: "data-pipeline-pro",
    name: "Data Pipeline Pro",
    summary: "Automatización de pipelines de datos con transformaciones inteligentes.",
    description: "Plataforma para diseñar, ejecutar y monitorear pipelines de datos con transformaciones automatizadas usando IA.",
    status: "available",
    tags: ["DataOps", "ETL", "Automatización"],
    demoType: "api",
    icon: "⚙️",
    cta: "Solicitar acceso",
  },
]

// Aplica overrides a una demo específica
async function applyDemoOverrides(demo: Demo): Promise<Demo> {
  const updates = await getDemoUpdates(demo.id)
  if (updates && typeof updates === 'object' && !(updates instanceof Map)) {
    return { ...demo, ...updates }
  }
  return demo
}

// Aplica overrides a un array de demos
async function applyOverridesToDemos(demos: Demo[]): Promise<Demo[]> {
  const updatesMap = await getDemoUpdates()
  if (!updatesMap || !(updatesMap instanceof Map)) {
    return demos
  }

  return demos.map(demo => {
    const updates = updatesMap.get(demo.id)
    if (updates) {
      return { ...demo, ...updates }
    }
    return demo
  })
}

export async function getDemoById(id: string): Promise<Demo | undefined> {
  const demo = DEMO_CATALOG.find((demo) => demo.id === id)
  if (!demo) return undefined
  return applyDemoOverrides(demo)
}

export async function getDemosByStatus(status: Demo['status']): Promise<Demo[]> {
  const demos = DEMO_CATALOG.filter((demo) => demo.status === status)
  return applyOverridesToDemos(demos)
}

export async function getAllDemos(): Promise<Demo[]> {
  return applyOverridesToDemos(DEMO_CATALOG)
}
