export type ServiceFeature = {
  title: string
  description: string
  features: string[]
}

export type ServicesContent = {
  title: string
  subtitle: string
  cta: {
    getStarted: string
    discuss: string
  }
  services: ServiceFeature[]
}

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
        title: "AI Development",
        description:
          "Leverage the power of artificial intelligence to optimize your business processes and gain competitive advantage.",
        features: [
          "AI Strategy Development",
          "Machine Learning Implementation",
          "Natural Language Processing",
          "Chatbots, Conversational AI Development",
          "AI Integration with Existing Systems (Automatization)",
        ],
      },
      {
        title: "AI-Powered CRM Solutions",
        description:
          "Strategic technology planning and implementation to align with your business goals.",
        features: [
          "Behavior Prediction",
          "Task Automation & Personalized Recommendations",
          "Automatic Analysis of Millions of Data Points",
          "Custom Reports",
          "RPA",
          "Intelligent Document Processing",
        ],
      },
      {
        title: "Web Branding",
        description:
          "Create a powerful online presence that reflects your brand's values and connects with your audience.",
        features: [
          "Brand Identity Development",
          "Website Design & Development",
          "User Experience Optimization",
          "Content Strategy",
          "SEO & Digital Marketing",
        ],
      },
      {
        title: "Web Development",
        description:
          "Comprehensive web development and design services to create cutting-edge digital experiences.",
        features: [
          "Custom Web Application Development",
          "Responsive Design",
          "Progressive Web Apps",
          "E-commerce Solutions",
          "Interactive User Interfaces",
        ],
      },
      {
        title: "Infrastructure Consulting Design",
        description:
          "Design and implement robust, scalable infrastructure solutions for your business needs.",
        features: [
          "Cloud Infrastructure Design",
          "On-Premises Solutions",
          "Hybrid Cloud Strategies",
          "Infrastructure Optimization",
          "Scalability Planning",
        ],
      },
      {
        title: "Security",
        description:
          "Protect your business with comprehensive security solutions and best practices.",
        features: [
          "Security Assessment & Auditing",
          "Threat Detection & Prevention",
          "Data Protection Strategies",
          "Compliance Management",
          "Security Training & Awareness",
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
        title: "Desarrollo de IA",
        description:
          "Aprovecha el poder de la inteligencia artificial para optimizar tus procesos de negocio y obtener ventaja competitiva.",
        features: [
          "Desarrollo de Estrategia de IA",
          "Implementación de Machine Learning",
          "Procesamiento de Lenguaje Natural",
          "Desarrollo de Chatbots, Agentes inteligentes conversacionales",
          "Integración de IA con Sistemas Existentes (Automatización)",
        ],
      },
      {
        title: "Soluciones CRM con IA",
        description:
          "Planificación e implementación estratégica de tecnología alineada con tus objetivos de negocio.",
        features: [
          "Predicción de comportamiento",
          "Automatización de tareas y recomendaciones personalizadas",
          "Análisis automáticos de millones de puntos de datos",
          "Reportes a medida",
          "RPA",
          "Procesamiento inteligente de documentos",
        ],
      },
      {
        title: "Branding Web",
        description:
          "Crea una poderosa presencia online que refleje los valores de tu marca y conecte con tu audiencia.",
        features: [
          "Desarrollo de Identidad de Marca",
          "Diseño y Desarrollo Web",
          "Optimización de Experiencia de Usuario",
          "Estrategia de Contenido",
          "SEO y Marketing Digital",
        ],
      },
      {
        title: "Desarrollo Web",
        description:
          "Servicios completos de desarrollo y diseño web para crear experiencias digitales de vanguardia.",
        features: [
          "Desarrollo de Aplicaciones Web Personalizadas",
          "Diseño Responsivo",
          "Aplicaciones Web Progresivas",
          "Soluciones de Comercio Electrónico",
          "Interfaces de Usuario Interactivas",
        ],
      },
      {
        title: "Consultoría de Infraestructura | Cloud",
        description:
          "Diseño e implementación de soluciones de infraestructura robustas y escalables para las necesidades de tu negocio.",
        features: [
          "Diseño de Infraestructura en la Nube",
          "Soluciones On-Premises",
          "Estrategias de Nube Híbrida",
          "Optimización de Infraestructura",
          "Planificación de Escalabilidad",
        ],
      },
      {
        title: "Seguridad",
        description:
          "Protege tu negocio con soluciones de seguridad integrales y mejores prácticas.",
        features: [
          "Evaluación y Auditoría de Seguridad",
          "Detección y Prevención de Amenazas",
          "Estrategias de Protección de Datos",
          "Gestión de Cumplimiento",
          "Capacitación y Concientización en Seguridad",
        ],
      },
    ],
  },
}
