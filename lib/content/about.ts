export type AboutContent = {
  title: string
  subtitle: string
  mission: { title: string; content: string }
  vision: { title: string; content: string }
  values: {
    title: string
    items: { title: string; description: string }[]
  }
  team: { title: string; content: string }
  approach: {
    title: string
    steps: { number: string; title: string; description: string }[]
  }
}

export const aboutContent: Record<"en" | "es", AboutContent> = {
  en: {
    title: "About VANGUARD-IA",
    subtitle: "Innovation and creativity to transform your business",
    mission: {
      title: "Our Mission",
      content:
        "At VANGUARD-IA, our mission is to empower businesses through innovative technology solutions that drive growth, efficiency, and competitive advantage. We are committed to delivering exceptional value to our clients by combining cutting-edge expertise with a deep understanding of business challenges.",
    },
    vision: {
      title: "Our Vision",
      content:
        "To be the leading technology consultancy that transforms businesses through innovation, creativity, and strategic implementation of advanced technologies.",
    },
    values: {
      title: "Our Values",
      items: [
        {
          title: "Innovation",
          description:
            "We constantly seek new and better ways to solve problems and create opportunities.",
        },
        {
          title: "Excellence",
          description:
            "We are committed to delivering the highest quality in everything we do.",
        },
        {
          title: "Integrity",
          description:
            "We operate with honesty, transparency, and ethical standards in all our interactions.",
        },
        {
          title: "Collaboration",
          description:
            "We believe in the power of teamwork and partnership with our clients.",
        },
        {
          title: "Client Focus",
          description:
            "We prioritize understanding and meeting our clients' unique needs and goals.",
        },
      ],
    },
    team: {
      title: "Our Team",
      content:
        "Our team consists of experienced professionals with diverse backgrounds in technology, business strategy, and industry-specific expertise. We bring together the best talent to deliver comprehensive solutions for our clients.",
    },
    approach: {
      title: "Our Approach",
      steps: [
        {
          number: "01",
          title: "Discover",
          description:
            "We begin by understanding your business, challenges, and goals through in-depth consultation.",
        },
        {
          number: "02",
          title: "Analyze",
          description:
            "Our experts analyze your current systems, processes, and market position to identify opportunities.",
        },
        {
          number: "03",
          title: "Strategize",
          description:
            "We develop a tailored strategy that aligns technology solutions with your business objectives.",
        },
        {
          number: "04",
          title: "Implement",
          description:
            "Our team executes the strategy with precision, ensuring minimal disruption to your operations.",
        },
        {
          number: "05",
          title: "Optimize",
          description:
            "We continuously monitor and refine our solutions to maximize performance and ROI.",
        },
      ],
    },
  },
  es: {
    title: "Sobre VANGUARD-IA",
    subtitle: "Innovación y creatividad para transformar tu negocio",
    mission: {
      title: "Nuestra Misión",
      content:
        "En VANGUARD-IA, nuestra misión es potenciar a las empresas a través de soluciones tecnológicas innovadoras que impulsen el crecimiento, la eficiencia y la ventaja competitiva. Estamos comprometidos a ofrecer un valor excepcional a nuestros clientes combinando experiencia de vanguardia con una profunda comprensión de los desafíos empresariales.",
    },
    vision: {
      title: "Nuestra Visión",
      content:
        "Ser la consultora tecnológica líder que transforma empresas a través de la innovación, la creatividad y la implementación estratégica de tecnologías avanzadas.",
    },
    values: {
      title: "Nuestros Valores",
      items: [
        {
          title: "Innovación",
          description:
            "Buscamos constantemente nuevas y mejores formas de resolver problemas y crear oportunidades.",
        },
        {
          title: "Excelencia",
          description:
            "Estamos comprometidos a ofrecer la más alta calidad en todo lo que hacemos.",
        },
        {
          title: "Integridad",
          description:
            "Operamos con honestidad, transparencia y estándares éticos en todas nuestras interacciones.",
        },
        {
          title: "Colaboración",
          description:
            "Creemos en el poder del trabajo en equipo y la asociación con nuestros clientes.",
        },
        {
          title: "Enfoque en el Cliente",
          description:
            "Priorizamos entender y satisfacer las necesidades y objetivos únicos de nuestros clientes.",
        },
      ],
    },
    team: {
      title: "Nuestro Equipo",
      content:
        "Nuestro equipo está formado por profesionales experimentados con diversos antecedentes en tecnología, estrategia empresarial y experiencia específica de la industria. Reunimos al mejor talento para ofrecer soluciones integrales para nuestros clientes.",
    },
    approach: {
      title: "Nuestro Enfoque",
      steps: [
        {
          number: "01",
          title: "Descubrir",
          description:
            "Comenzamos por entender su negocio, desafíos y objetivos a través de una consulta en profundidad.",
        },
        {
          number: "02",
          title: "Analizar",
          description:
            "Nuestros expertos analizan sus sistemas actuales, procesos y posición en el mercado para identificar oportunidades.",
        },
        {
          number: "03",
          title: "Estrategizar",
          description:
            "Desarrollamos una estrategia personalizada que alinea las soluciones tecnológicas con sus objetivos empresariales.",
        },
        {
          number: "04",
          title: "Implementar",
          description:
            "Nuestro equipo ejecuta la estrategia con precisión, asegurando una mínima interrupción en sus operaciones.",
        },
        {
          number: "05",
          title: "Optimizar",
          description:
            "Monitoreamos y refinamos continuamente nuestras soluciones para maximizar el rendimiento y el ROI.",
        },
      ],
    },
  },
}

