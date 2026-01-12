export type ServiceFeature = {
  title: string;
  description: string;
  benefit: string;
  features: string[];
};

export type ServicesContent = {
  title: string;
  subtitle: string;
  cta: {
    getStarted: string;
    discuss: string;
  };
  services: ServiceFeature[];
};

export const servicesContent: Record<"en" | "es", ServicesContent> = {
  en: {
    title: "Our Services",
    subtitle: "Comprehensive technology solutions for your business",
    cta: {
      getStarted: "Ready to get started?",
      discuss:
        "Contact us today to discuss your project and how our services can help you achieve your business goals.",
    },
    services: [
      {
        title: "Sovereign AI",
        description:
          "Deploy Private AI models within your own perimeter. Maximum data privacy, zero data leakage to public clouds. Ideal for Government, Legal, and Healthcare sectors.",
        benefit: "AI power without compliance risks.",
        features: [
          "Private AI Model Deployment",
          "Local LLM Implementation",
          "Data Sovereignty Solutions",
          "Compliance & Privacy Assurance",
          "On-Premises AI Infrastructure",
        ],
      },
      {
        title: "High-Performance Infrastructure",
        description:
          "Architecting critical storage and compute environments for AI workloads. Expertise in Hybrid Cloud, Disaster Recovery, and Ransomware Protection.",
        benefit: "Build the foundation your AI needs to scale.",
        features: [
          "AI-Optimized Infrastructure",
          "Hybrid Cloud Architecture",
          "Disaster Recovery Solutions",
          "Ransomware Protection",
          "High-Performance Storage",
        ],
      },
      {
        title: "Business Process Automation",
        description:
          "End-to-end workflow automation using code development and orchestration. We integrate legacy ERPs or Cloud computing with modern AI agents to reduce operational costs.",
        benefit: "Transform manual tasks into automated profit.",
        features: [
          "Workflow Automation",
          "ERP Integration",
          "AI Agent Development",
          "Process Optimization",
          "Cost Reduction Solutions",
        ],
      },
      {
        title: "Specialized Training",
        description:
          "Certified by EXIN.com to guide in Regulation (EU) 2024/1689 of the European Parliament on Artificial Intelligence and ISO 42001.",
        benefit: "Stay compliant with the latest AI regulations.",
        features: [
          "EU AI Act (2024/1689) Training",
          "ISO 42001 Certification Guidance",
          "EXIN Certified Training",
          "Regulatory Compliance Consulting",
          "AI Governance Best Practices",
        ],
      },
    ],
  },
  es: {
    title: "Nuestros Servicios",
    subtitle: "Soluciones tecnológicas integrales para su negocio",
    cta: {
      getStarted: "¿Listo para comenzar?",
      discuss:
        "Contáctanos hoy para discutir tu proyecto y cómo nuestros servicios pueden ayudarte a alcanzar tus objetivos empresariales.",
    },
    services: [
      {
        title: "IA Soberana",
        description:
          "Despliega modelos de IA privados dentro de tu propio perímetro. Máxima privacidad de datos, cero fugas de datos a nubes públicas. Ideal para sectores Gubernamental, Legal y Sanitario.",
        benefit: "Poder de IA sin riesgos de cumplimiento.",
        features: [
          "Despliegue de Modelos de IA Privados",
          "Implementación de LLMs Locales",
          "Soluciones de Soberanía de Datos",
          "Garantía de Cumplimiento y Privacidad",
          "Infraestructura de IA On-Premises",
        ],
      },
      {
        title: "Infraestructura de Alto Rendimiento",
        description:
          "Arquitectura de entornos críticos de almacenamiento y computación para cargas de trabajo de IA. Experiencia en Nube Híbrida, Recuperación ante Desastres y Protección contra Ransomware.",
        benefit: "Construye la base que tu IA necesita para escalar.",
        features: [
          "Infraestructura Optimizada para IA",
          "Arquitectura de Nube Híbrida",
          "Soluciones de Recuperación ante Desastres",
          "Protección contra Ransomware",
          "Almacenamiento de Alto Rendimiento",
        ],
      },
      {
        title: "Automatización de Procesos de Negocio",
        description:
          "Automatización de flujos de trabajo de extremo a extremo usando desarrollo de código y orquestación. Integramos ERPs legacy o computación en la nube con agentes de IA modernos para reducir costos operativos.",
        benefit: "Transforma tareas manuales en ganancias automatizadas.",
        features: [
          "Automatización de Flujos de Trabajo",
          "Integración de ERPs",
          "Desarrollo de Agentes de IA",
          "Optimización de Procesos",
          "Soluciones de Reducción de Costos",
        ],
      },
      {
        title: "Capacitaciones especializadas",
        description:
          "Capacitados por EXIN.com para orientar en Reglamento (UE) 2024/1689 del Parlamento Europeo sobre Inteligencia Artificial e ISO 42001.",
        benefit: "Auditores en Gobernanza de IA.",
        features: [
          "Capacitación en Ley de IA de la UE (2024/1689)",
          "Orientación en Certificación ISO 42001",
          "Capacitación Certificada por EXIN",
          "Consultoría en Cumplimiento Normativo",
          "Mejores Prácticas de Gobernanza de IA",
        ],
      },
    ],
  },
};
