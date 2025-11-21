export interface Resource {
  id: string
  title: string
  description: string
  type: "video" | "document" | "guide"
  url: string
  duration?: string // Para videos: "5:30"
  fileSize?: string // Para documentos: "2.5 MB"
  serviceId?: string // ID del servicio relacionado (opcional)
  category: "getting-started" | "advanced" | "troubleshooting" | "best-practices"
  thumbnail?: string // URL de thumbnail para videos
}

export interface ResourceCategory {
  id: string
  name: string
  description: string
  resources: Resource[]
}

// Mock data - En producción esto vendría de una base de datos o CMS
export const resourcesData: ResourceCategory[] = [
  {
    id: "videos",
    name: "Videos Tutoriales",
    description: "Guías visuales paso a paso para usar nuestros productos",
    resources: [
      {
        id: "intro-crm",
        title: "Introducción a Soluciones CRM con IA",
        description: "Aprende los conceptos básicos y cómo empezar con nuestro CRM inteligente",
        type: "video",
        url: "https://www.youtube.com/watch?v=example1", // Reemplazar con URL real
        duration: "12:45",
        serviceId: "crm-ia",
        category: "getting-started",
      },
      {
        id: "automation-setup",
        title: "Configuración de Automatización",
        description: "Configura tus primeros flujos de automatización en minutos",
        type: "video",
        url: "https://www.youtube.com/watch?v=example2",
        duration: "8:20",
        serviceId: "automation",
        category: "getting-started",
      },
      {
        id: "advanced-analytics",
        title: "Análisis Avanzado de Datos",
        description: "Domina las funciones avanzadas de análisis y reportes",
        type: "video",
        url: "https://www.youtube.com/watch?v=example3",
        duration: "15:30",
        serviceId: "crm-ia",
        category: "advanced",
      },
    ],
  },
  {
    id: "documents",
    name: "Documentación",
    description: "Guías escritas, manuales técnicos y documentación de referencia",
    resources: [
      {
        id: "user-manual",
        title: "Manual de Usuario Completo",
        description: "Documentación exhaustiva de todas las funcionalidades",
        type: "document",
        url: "https://drive.google.com/file/d/example1", // Reemplazar con URL real
        fileSize: "3.2 MB",
        category: "getting-started",
      },
      {
        id: "api-docs",
        title: "Documentación de API",
        description: "Referencia completa de endpoints y métodos disponibles",
        type: "document",
        url: "https://drive.google.com/file/d/example2",
        fileSize: "1.8 MB",
        category: "advanced",
      },
      {
        id: "troubleshooting-guide",
        title: "Guía de Solución de Problemas",
        description: "Soluciones a problemas comunes y preguntas frecuentes",
        type: "guide",
        url: "https://drive.google.com/file/d/example3",
        fileSize: "950 KB",
        category: "troubleshooting",
      },
    ],
  },
  {
    id: "guides",
    name: "Guías Rápidas",
    description: "Guías prácticas y mejores prácticas para optimizar tu uso",
    resources: [
      {
        id: "best-practices",
        title: "Mejores Prácticas de Implementación",
        description: "Aprende cómo otros clientes han optimizado sus procesos",
        type: "guide",
        url: "https://drive.google.com/file/d/example4",
        fileSize: "2.1 MB",
        category: "best-practices",
      },
      {
        id: "security-checklist",
        title: "Checklist de Seguridad",
        description: "Asegura que tu implementación cumpla con todos los estándares",
        type: "guide",
        url: "https://drive.google.com/file/d/example5",
        fileSize: "650 KB",
        category: "best-practices",
      },
    ],
  },
]




