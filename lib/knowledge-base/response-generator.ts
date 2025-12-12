import { Document } from "langchain/document"
import { servicesContent } from "@/lib/content/services"
import { faqContent } from "@/lib/content/faq"
import { aboutContent } from "@/lib/content/about"
import { contactInfo } from "@/lib/content/contact"

type Locale = "en" | "es"

const MAX_SERVICE_FEATURES = 2
const MAX_SERVICE_RESULTS = 2

const CONVERSATIONS_DOC = {
  en: "10 Most Common VANGUARD-IA Conversations",
  es: "10 Conversaciones Más Comunes",
}

type IntentId =
  | "services"
  | "aiOptimisation"
  | "infrastructure"
  | "security"
  | "pricing"
  | "branding"
  | "integration"
  | "support"
  | "differentiators"
  | "gettingStarted"
  | "contact"
  | "about"
  | "faq"

type IntentConfig = {
  keywords: Record<Locale, string[]>
  resolver: (language: Locale) => string
}

const INTENT_CONFIG: Record<IntentId, IntentConfig> = {
  services: {
    keywords: {
      en: ["service", "services", "offer", "provide", "portfolio"],
      es: ["servicio", "servicios", "ofrecen", "portafolio"],
    },
    resolver: generateServicesOverview,
  },
  aiOptimisation: {
    keywords: {
      en: ["optimization", "optimize", "process", "processes", "automation", "efficiency", "ai help"],
      es: ["optimizar", "optimización", "procesos", "automatizar", "eficiencia", "ayuda ia"],
    },
    resolver: generateAiOptimisation,
  },
  infrastructure: {
    keywords: {
      en: ["infrastructure", "scale", "scalable", "cloud architecture", "capacity planning"],
      es: ["infraestructura", "escalar", "escalable", "arquitectura", "capacidad"],
    },
    resolver: generateInfrastructure,
  },
  security: {
    keywords: {
      en: ["security", "data protection", "breach", "compliance", "privacy"],
      es: ["seguridad", "datos", "cumplimiento", "brecha", "protección"],
    },
    resolver: generateSecurity,
  },
  pricing: {
    keywords: {
      en: ["price", "pricing", "budget", "quote", "quotation", "estimate", "cost"],
      es: ["precio", "presupuesto", "cotización", "cotizacion", "costo", "coste"],
    },
    resolver: generatePricing,
  },
  branding: {
    keywords: {
      en: ["branding", "brand", "web presence", "online presence", "digital strategy"],
      es: ["branding", "marca", "presencia web", "presencia online", "estrategia digital"],
    },
    resolver: generateBranding,
  },
  integration: {
    keywords: {
      en: ["integrate", "integration", "legacy system", "api", "existing system"],
      es: ["integrar", "integración", "sistema existente", "api", "ecosistema"],
    },
    resolver: generateIntegration,
  },
  support: {
    keywords: {
      en: ["support", "maintenance", "post implementation", "sla", "monitoring"],
      es: ["soporte", "mantenimiento", "post implementación", "sla", "monitoreo"],
    },
    resolver: generateSupport,
  },
  differentiators: {
    keywords: {
      en: ["why choose", "should we choose", "differentiator", "competitive", "unique", "versus"],
      es: ["por qué elegir", "diferenciador", "competencia", "único"],
    },
    resolver: generateDifferentiators,
  },
  gettingStarted: {
    keywords: {
      en: ["first step", "start working", "how to begin", "process to start"],
      es: ["primer paso", "comenzar", "cómo empezar", "proceso de venta"],
    },
    resolver: generateGettingStarted,
  },
  contact: {
    keywords: {
      en: ["contact", "email", "phone", "call", "reach", "address"],
      es: ["contacto", "correo", "teléfono", "llamar", "ubicación"],
    },
    resolver: generateContact,
  },
  about: {
    keywords: {
      en: ["about", "mission", "vision", "values", "team", "approach", "work"],
      es: ["sobre", "misión", "visión", "valores", "equipo", "enfoque"],
    },
    resolver: generateAbout,
  },
  faq: {
    keywords: {
      en: ["faq", "question", "help", "support", "how"],
      es: ["pregunta", "ayuda", "soporte", "cómo"],
    },
    resolver: () => "",
  },
}

export class ResponseGenerator {
  generate(query: string, documents: Document[], language: Locale): string {
    const normalizedQuery = query.trim().toLowerCase()
    const topDocuments = documents.slice(0, 3)

    const matchedIntent = this.detectIntent(normalizedQuery, language)

    if (matchedIntent === "services") {
      const servicesDocs = this.filterByType(topDocuments, "services")
      const message = this.generateServicesResponse(normalizedQuery, language, servicesDocs)
      return this.applyIntentIcon(
        matchedIntent,
        this.withSourceLine(message, servicesDocs.length > 0 ? servicesDocs : topDocuments, language)
      )
    }

    if (matchedIntent === "faq") {
      const faqDocs = this.filterByType(topDocuments, "faq")
      const message = this.generateFAQResponse(normalizedQuery, language, faqDocs)
      return this.applyIntentIcon(matchedIntent, this.withSourceLine(message, faqDocs, language))
    }

    if (matchedIntent === "about") {
      const aboutDocs = this.filterByType(topDocuments, "about")
      return this.applyIntentIcon(matchedIntent, this.withSourceLine(generateAbout(language), aboutDocs, language))
    }

    if (matchedIntent === "contact") {
      return this.applyIntentIcon(matchedIntent, this.withSourceLine(generateContact(language), topDocuments, language))
    }

    if (matchedIntent) {
      return this.applyIntentIcon(matchedIntent, INTENT_CONFIG[matchedIntent].resolver(language))
    }

    const knowledgeSummary = this.summarizeDocuments(topDocuments, language)
    if (knowledgeSummary) {
      return knowledgeSummary
    }

    return language === "en"
      ? `I couldn't find that in our current library. Please rephrase or email us at ${contactInfo.email} so we can help.`
      : `No encontré esa información en nuestra biblioteca actual. Reformula la pregunta o escríbenos a ${contactInfo.email} para ayudarte.`
  }

  private detectIntent(query: string, language: Locale): IntentId | null {
    for (const [intent, config] of Object.entries(INTENT_CONFIG)) {
      if (config.keywords[language].some((keyword) => keyword && query.includes(keyword))) {
        return intent as IntentId
      }
    }

    if (this.isAboutIntent(query, language)) {
      return "about"
    }

    return null
  }

  private filterByType(documents: Document[], type: string) {
    return documents.filter((doc) => doc.metadata?.type === type)
  }

  private generateServicesResponse(
    normalizedQuery: string,
    language: Locale,
    servicesDocs: Document[]
  ) {
    const content = servicesContent[language]
    const matchingServices = content.services.filter((service) =>
      normalizedQuery.includes(service.title.toLowerCase())
    )

    const servicesToDescribe = (matchingServices.length > 0 ? matchingServices : content.services).slice(
      0,
      MAX_SERVICE_RESULTS
    )

    const bullets = servicesToDescribe.map((service) => {
      const featurePreview = service.features.slice(0, MAX_SERVICE_FEATURES).join(", ")
      const description = firstSentence(service.description)
      return language === "en"
        ? `- ${service.title}: ${description} Key strengths: ${featurePreview}.`
        : `- ${service.title}: ${description} Fortalezas clave: ${featurePreview}.`
    })

    return [
      language === "en" ? "Here is how we can help:" : "Así podemos ayudarte:",
      ...bullets,
      language === "en"
        ? "Let us know if you'd like to explore a specific solution."
        : "Avísanos si quieres profundizar en una solución específica.",
    ].join("\n")
  }

  private generateFAQResponse(normalizedQuery: string, language: Locale, faqDocs: Document[]) {
    const content = faqContent[language]
    const matchingFaqs = content.faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(normalizedQuery) || faq.answer.toLowerCase().includes(normalizedQuery)
    )

    const faqsToInclude = (matchingFaqs.length > 0 ? matchingFaqs : content.faqs.slice(0, 2)).map(
      (faq) =>
        language === "en"
          ? `• ${faq.question}\n  ${firstSentence(faq.answer)}`
          : `• ${faq.question}\n  ${firstSentence(faq.answer)}`
    )

    return [
      language === "en" ? "Quick answers:" : "Respuestas rápidas:",
      ...faqsToInclude,
      language === "en"
        ? "Need more detail? Let me know and I can dig deeper."
        : "¿Necesitas más detalle? Dímelo y profundizo.",
    ].join("\n")
  }

  private summarizeDocuments(documents: Document[], language: Locale) {
    if (documents.length === 0) {
      return ""
    }

    const summaries = documents
      .map((doc) => {
        const title = typeof doc.metadata?.title === "string" ? doc.metadata.title : doc.metadata?.type
        const snippet = firstSentence(doc.pageContent)
        if (!snippet) return ""
        return title ? `${title}: ${snippet}` : snippet
      })
      .filter(Boolean)

    if (summaries.length === 0) {
      return ""
    }

    const header = language === "en" ? "Here's what I found:" : "Esto es lo que encontré:"
    return this.withSourceLine([header, ...summaries.map((summary) => `- ${summary}`)].join("\n"), documents, language)
  }

  private withSourceLine(message: string, _documents: Document[], _language: Locale) {
    return message
  }

  private applyIntentIcon(intent: IntentId, message: string) {
    const icon = INTENT_ICONS[intent]
    return icon ? `${icon} ${message}` : message
  }

  private isAboutIntent(query: string, language: Locale) {
    const brandTerms =
      language === "en"
        ? /(vanguard|your|company|business|team|culture|history)/
        : /(vanguard|tu|su|empresa|negocio|equipo|cultura|historia)/

    if (language === "en") {
      if (/(mission|vision|values|approach|leadership|team)/.test(query)) {
        return true
      }
      return query.includes("about") && brandTerms.test(query)
    }

    if (/(misión|visión|valores|enfoque|liderazgo|equipo)/.test(query)) {
      return true
    }
    return query.includes("sobre") && brandTerms.test(query)
  }
}

const INTENT_ICONS: Partial<Record<IntentId, string>> = {
  services: "🧭",
  aiOptimisation: "🤖",
  infrastructure: "🏗️",
  security: "🛡️",
  pricing: "💼",
  branding: "🎨",
  integration: "🔗",
  support: "🛠️",
  differentiators: "🚀",
  gettingStarted: "📅",
  contact: "✉️",
  about: "ℹ️",
  faq: "❓",
}

function generateServicesOverview(language: Locale) {
  if (language === "en") {
    return formatResponse(
      [
      "As your VANGUARD-IA advisor, here’s our core portfolio:",
      "• AI Development: strategy, machine learning, NLP, computer vision.",
      "• IT Consulting: architecture design, stack optimisation, digital transformation.",
      "• Web Branding & Innovation: end-to-end brand refresh, UX, immersive sites.",
      "• Infrastructure Consulting: cloud, hybrid, scalability, resilience.",
      "• Security Solutions: assessments, proactive monitoring, compliance readiness.",
      "Success highlight: TechNova Solutions boosted delivery efficiency by 40% with our AI + infra programme.",
      "Next step: let’s schedule a 30-minute call to map your priorities and tailor a roadmap.",
      ],
      language,
      {
        en: [servicesContent.en.title, faqContent.en.title],
        es: [servicesContent.es.title, faqContent.es.title],
      }
    )
  }

  return formatResponse(
    [
    "Como asesor de VANGUARD-IA, este es nuestro portafolio principal:",
    "• Desarrollo de IA: estrategia, machine learning, NLP, visión por computadora.",
    "• Consultoría TI: diseño de arquitectura, optimización del stack, transformación digital.",
    "• Branding e Innovación Web: refresh de marca, UX, experiencias inmersivas.",
    "• Consultoría de Infraestructura: nube, híbrido, escalabilidad, resiliencia.",
    "• Soluciones de Seguridad: auditorías, monitoreo proactivo, cumplimiento.",
    "Caso destacado: TechNova Solutions elevó un 40% su eficiencia operativa con nuestro programa IA + infraestructura.",
    "Siguiente paso: coordinemos una llamada de 30 minutos para mapear tus prioridades y personalizar la hoja de ruta.",
    ],
    language,
    {
      en: [servicesContent.en.title, faqContent.en.title],
      es: [servicesContent.es.title, faqContent.es.title],
    }
  )
}

function generateAiOptimisation(language: Locale) {
  if (language === "en") {
    return formatResponse(
      [
      "Great question—AI shines when we anchor it to outcomes:",
      "• TechNova Solutions cut cycle time 40% by automating forecasting and QA pipelines.",
      "• Typical levers: repetitive task automation, predictive insights, smarter customer journeys.",
      "Diagnostic questions:",
      "  1. What processes slow you down today?",
      "  2. How much curated data do you have available?",
      "  3. What compliance constraints should we respect?",
      "Next step: share those details and we’ll design a rapid pilot proposal within 24 hours.",
      ],
      language,
      {
        en: [servicesContent.en.title, CONVERSATIONS_DOC.en],
        es: [servicesContent.es.title, CONVERSATIONS_DOC.es],
      }
    )
  }

  return formatResponse(
    [
    "Excelente pregunta: la IA genera valor cuando la conectamos a resultados concretos:",
    "• TechNova Solutions redujo 40% su tiempo de ciclo automatizando pronósticos y QA.",
    "• Palancas típicas: automatizar tareas repetitivas, generar insights predictivos, mejorar experiencias de cliente.",
    "Preguntas diagnósticas:",
    "  1. ¿Qué procesos hoy generan cuellos de botella?",
    "  2. ¿Con qué volumen y calidad de datos contamos?",
    "  3. ¿Qué requisitos regulatorios debemos respetar?",
    "Siguiente paso: comparte estas respuestas y preparamos un piloto en menos de 24 horas.",
    ],
    language,
    {
      en: [servicesContent.en.title, CONVERSATIONS_DOC.en],
      es: [servicesContent.es.title, CONVERSATIONS_DOC.es],
    }
  )
}

function generateInfrastructure(language: Locale) {
  if (language === "en") {
    return formatResponse(
      [
      "Acting as your infrastructure architect, we start by understanding context:",
      "• Current stack and workloads?",
      "• User volumes and growth projections?",
      "• Reliability and security objectives?",
      "Our framework: audit → capacity planning → architecture blueprint → implementation.",
      "We recently helped Global Financial Group harden a hybrid cloud resistant to regional outages.",
      "Let’s book a 30-minute technical discovery to map integrations and constraints.",
      ],
      language,
      {
        en: [servicesContent.en.title, CONVERSATIONS_DOC.en],
        es: [servicesContent.es.title, CONVERSATIONS_DOC.es],
      }
    )
  }

  return formatResponse(
    [
    "Como arquitecto de infraestructura, primero mapeamos el contexto:",
    "• ¿Cuál es el stack y las cargas actuales?",
    "• ¿Qué volúmenes de usuarios y proyecciones manejan?",
    "• ¿Qué objetivos de resiliencia y seguridad necesitan?",
    "Nuestro proceso: auditoría → planificación de capacidad → blueprint de arquitectura → implementación.",
    "Recientemente reforzamos la nube híbrida de Global Financial Group contra caídas regionales.",
    "Agendemos una discovery técnica de 30 minutos para alinear integraciones y restricciones.",
    ],
    language,
    {
      en: [servicesContent.en.title, CONVERSATIONS_DOC.en],
      es: [servicesContent.es.title, CONVERSATIONS_DOC.es],
    }
  )
}

function generateSecurity(language: Locale) {
  if (language === "en") {
    return formatResponse(
      [
      "Security is non-negotiable. Here’s how we protect client data:",
      "• Compliance-first policies aligned with ISO and regional standards.",
      "• Multi-layer defensive architecture with proactive SOC monitoring.",
      "• Case in point: Global Financial Group cut critical incidents 60% with our continuous monitoring.",
      "We start with a complimentary security assessment—shall I set that up?",
      ],
      language,
      {
        en: [servicesContent.en.title, CONVERSATIONS_DOC.en],
        es: [servicesContent.es.title, CONVERSATIONS_DOC.es],
      }
    )
  }

  return formatResponse(
    [
    "La seguridad es innegociable. Así protegemos los datos de nuestros clientes:",
    "• Políticas de cumplimiento alineadas con ISO y normativas regionales.",
    "• Arquitectura defensiva multicapa con monitoreo SOC proactivo.",
    "• Caso: Global Financial Group redujo 60% incidentes críticos con nuestro monitoreo continuo.",
    "Comencemos con una auditoría de seguridad gratuita, ¿la agendamos?",
    ],
    language,
    {
      en: [servicesContent.en.title, CONVERSATIONS_DOC.en],
      es: [servicesContent.es.title, CONVERSATIONS_DOC.es],
    }
  )
}

function generatePricing(language: Locale) {
  if (language === "en") {
    return formatResponse(
      [
      "You’ll get the best value with a tailored proposal.",
      "Investment depends on scope, integrations, and delivery timelines.",
      "Key questions: project objectives, timeline constraints, ballpark budget, success criteria.",
      `Share those via ${contactInfo.email} or let’s schedule a quick scoping call—custom quote delivered within 24 hours.`,
      ],
      language,
      {
        en: [servicesContent.en.title, CONVERSATIONS_DOC.en],
        es: [servicesContent.es.title, CONVERSATIONS_DOC.es],
      }
    )
  }

  return formatResponse(
    [
    "Obtendrás el mejor valor con una propuesta a medida.",
    "La inversión depende de alcance, integraciones y plazos de entrega.",
    "Preguntas clave: objetivos del proyecto, restricciones de timeline, presupuesto estimado, criterios de éxito.",
    `Envíanos esa información a ${contactInfo.email} o coordinemos una llamada breve; entregamos cotización personalizada en 24 horas.`,
    ],
    language,
    {
      en: [servicesContent.en.title, CONVERSATIONS_DOC.en],
      es: [servicesContent.es.title, CONVERSATIONS_DOC.es],
    }
  )
}

function generateBranding(language: Locale) {
  if (language === "en") {
    return formatResponse(
      [
      "From a creative director’s lens, our web branding playbook is:",
      "1. Brand analysis and positioning refresh.",
      "2. Digital strategy and content roadmap.",
      "3. Experience design and prototyping.",
      "4. Full-stack implementation and launch.",
      "Highlight: HealthPlus Systems transformed their digital presence with us, tripling qualified leads.",
      "Let’s discuss your target audience and value proposition so we tailor the creative sprint.",
      ],
      language,
      {
        en: [servicesContent.en.title, CONVERSATIONS_DOC.en],
        es: [servicesContent.es.title, CONVERSATIONS_DOC.es],
      }
    )
  }

  return formatResponse(
    [
    "Como director creativo, nuestro playbook de branding web es:",
    "1. Análisis de marca y reposicionamiento.",
    "2. Estrategia digital y mapa de contenidos.",
    "3. Diseño de experiencias y prototipado.",
    "4. Implementación full-stack y lanzamiento.",
    "Caso: HealthPlus Systems transformó su presencia digital con nosotros y triplicó leads calificados.",
    "Conversemos sobre tu público objetivo y propuesta de valor para personalizar el sprint creativo.",
    ],
    language,
    {
      en: [servicesContent.en.title, CONVERSATIONS_DOC.en],
      es: [servicesContent.es.title, CONVERSATIONS_DOC.es],
    }
  )
}

function generateIntegration(language: Locale) {
  if (language === "en") {
    return formatResponse(
      [
      "As your solutions architect, I’d start with these diagnostics:",
      "• What systems and data sources power your core processes?",
      "• Which APIs or integration points are already available?",
      "• Any technical or regulatory constraints we must respect?",
      "Methodology: landscape analysis → integration blueprint → staged testing → coordinated rollout.",
      "We can run a technical assessment to confirm compatibility—shall I introduce our integration squad?",
      ],
      language,
      {
        en: [servicesContent.en.title, CONVERSATIONS_DOC.en],
        es: [servicesContent.es.title, CONVERSATIONS_DOC.es],
      }
    )
  }

  return formatResponse(
    [
    "Como arquitecto de soluciones, primero alineamos estos puntos:",
    "• ¿Qué sistemas y fuentes de datos soportan tus procesos críticos?",
    "• ¿Qué APIs o puntos de integración existen hoy?",
    "• ¿Hay restricciones técnicas o regulatorias que debamos respetar?",
    "Metodología: análisis del ecosistema → blueprint de integración → testing incremental → despliegue coordinado.",
    "Podemos realizar una auditoría técnica para confirmar compatibilidad, ¿te conecto con nuestro squad de integración?",
    ],
    language,
    {
      en: [servicesContent.en.title, CONVERSATIONS_DOC.en],
      es: [servicesContent.es.title, CONVERSATIONS_DOC.es],
    }
  )
}

function generateSupport(language: Locale) {
  if (language === "en") {
    return formatResponse(
      [
      "Post-launch, we stay close as your account manager:",
      "• Tiered SLA with 24/7 monitoring and proactive alerts.",
      "• Monthly health reports and optimisation workshops.",
      "• Security updates and regression testing baked into retainers.",
      "Global Financial Group cites our proactive monitoring as their differentiator.",
      "Shall we review support tiers together and align on response times?",
      ],
      language,
      {
        en: [servicesContent.en.title, CONVERSATIONS_DOC.en],
        es: [servicesContent.es.title, CONVERSATIONS_DOC.es],
      }
    )
  }

  return formatResponse(
    [
    "Tras la implementación seguimos acompañándote como tu gerente de cuentas:",
    "• SLA escalonado con monitoreo 24/7 y alertas proactivas.",
    "• Reportes mensuales de salud y sesiones de optimización.",
    "• Actualizaciones de seguridad y pruebas regresivas incluidas en los planes.",
    "Global Financial Group destaca nuestro monitoreo proactivo como diferenciador.",
    "¿Revisamos juntos los niveles de soporte y tiempos de respuesta?",
    ],
    language,
    {
      en: [servicesContent.en.title, CONVERSATIONS_DOC.en],
      es: [servicesContent.es.title, CONVERSATIONS_DOC.es],
    }
  )
}

function generateDifferentiators(language: Locale) {
  if (language === "en") {
    return formatResponse(
      [
      "Why VANGUARD-IA? We focus on business transformation, not just delivery:",
      "• Multidisciplinary squad blending AI, security, infrastructure, and branding.",
      "• Proven outcomes: +40% efficiency (TechNova), zero critical breaches (Global Financial Group), 3× digital reach (HealthPlus).",
      "• Co-creation model: discovery, design sprints, measurable pilots, continuous optimisation.",
      "Let’s schedule a tailored demo so you can meet the leads behind each capability.",
      ],
      language,
      {
        en: [aboutContent.en.title, CONVERSATIONS_DOC.en],
        es: [aboutContent.es.title, CONVERSATIONS_DOC.es],
      }
    )
  }

  return formatResponse(
    [
    "¿Por qué VANGUARD-IA? Transformamos el negocio, no solo entregamos proyectos:",
    "• Equipo multidisciplinario que combina IA, seguridad, infraestructura y branding.",
    "• Resultados probados: +40% eficiencia (TechNova), cero incidentes críticos (Global Financial Group), 3× alcance digital (HealthPlus).",
    "• Modelo de co-creación: discovery, sprints de diseño, pilotos medibles y optimización continua.",
    "Agendemos una demo personalizada para que conozcas a los líderes de cada capacidad.",
    ],
    language,
    {
      en: [aboutContent.en.title, CONVERSATIONS_DOC.en],
      es: [aboutContent.es.title, CONVERSATIONS_DOC.es],
    }
  )
}

function generateGettingStarted(language: Locale) {
  if (language === "en") {
    return formatResponse(
      [
      "Starting with VANGUARD-IA is straightforward:",
      "1) Initial consultation (30 min, no cost) to understand your role and goals.",
      "2) Needs analysis and documentation review.",
      "3) Custom proposal with investment and roadmap.",
      "4) Alignment workshop and negotiation.",
      "5) Kickoff with dedicated delivery squad.",
      "Could you share your role, the main challenge, and desired timeline so we lock step one?",
      ],
      language,
      {
        en: [faqContent.en.title, CONVERSATIONS_DOC.en],
        es: [faqContent.es.title, CONVERSATIONS_DOC.es],
      }
    )
  }

  return formatResponse(
    [
    "Arrancar con VANGUARD-IA es simple:",
    "1) Consulta inicial (30 min, sin costo) para entender tu rol y objetivos.",
    "2) Análisis de necesidades y revisión de documentación.",
    "3) Propuesta personalizada con inversión y roadmap.",
    "4) Taller de alineación y negociación.",
    "5) Kickoff con squad dedicado.",
    "¿Nos compartes tu rol, principal reto y timeline deseado para agendar el primer paso?",
    ],
    language,
    {
      en: [faqContent.en.title, CONVERSATIONS_DOC.en],
      es: [faqContent.es.title, CONVERSATIONS_DOC.es],
    }
  )
}

function generateContact(language: Locale) {
  if (language === "en") {
    return formatResponse(
      [
        `You can write to us at ${contactInfo.email}.`,
        `We operate from ${contactInfo.city}, ${contactInfo.country}.`,
      ],
      language,
      {
        en: [aboutContent.en.title, faqContent.en.title],
        es: [aboutContent.es.title, faqContent.es.title],
      }
    )
  }

  return formatResponse(
    [
      `Puedes escribirnos a ${contactInfo.email}.`,
      `Operamos desde ${contactInfo.city}, ${contactInfo.country}.`,
    ],
    language,
    {
      en: [aboutContent.en.title, faqContent.en.title],
      es: [aboutContent.es.title, faqContent.es.title],
    }
  )
}

function generateAbout(language: Locale) {
  const content = aboutContent[language]

  const lines =
    language === "en"
      ? [
          `${content.title}: ${content.subtitle}`,
          `${content.mission.title}: ${firstSentence(content.mission.content)}`,
          `${content.vision.title}: ${firstSentence(content.vision.content)}`,
          `Values: ${content.values.items.map((value) => value.title).join(", ")}`,
        ]
      : [
          `${content.title}: ${content.subtitle}`,
          `${content.mission.title}: ${firstSentence(content.mission.content)}`,
          `${content.vision.title}: ${firstSentence(content.vision.content)}`,
          `Valores: ${content.values.items.map((value) => value.title).join(", ")}`,
        ]

  return formatResponse(lines, language, {
    en: [aboutContent.en.title],
    es: [aboutContent.es.title],
  })
}

function firstSentence(text: string) {
  if (!text) return ""
  const sanitized = text.replace(/\s+/g, " ").trim()
  const match = sanitized.match(/(.+?[.!?])(\s|$)/)
  if (match) {
    return match[1].slice(0, 220)
  }
  return sanitized.slice(0, 220)
}

function formatResponse(lines: string[], _language: Locale, _sources?: Record<Locale, string[]>) {
  return lines.join("\n")
}
