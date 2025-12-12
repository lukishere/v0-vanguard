export type AboutContent = {
  title: string;
  subtitle: string;
  origin: { title: string; content: string };
  mission: { title: string; content: string };
  vision: { title: string; content: string };
  values: {
    title: string;
    logos: {
      name: string;
      imageUrl: string;
    }[];
  };
  team: {
    title: string;
    content: string;
    members: {
      name: string;
      position: string;
      linkedinUrl: string;
      imageUrl: string;
    }[];
  };
  approach: {
    title: string;
    steps: { number: string; title: string; description: string }[];
  };
};

export const aboutContent: Record<"en" | "es", AboutContent> = {
  en: {
    title: "About VANGUARD-IA",
    subtitle: "Innovation and creativity to transform your business",
    origin: {
      title: "Origin",
      content:
        "Backed by certified expertise in Mission-Critical Infrastructure (IBM, HP, NetApp, Brocade, Cisco, Cohesity, Dell EMC). We bring 18+ years of enterprise data experience to the world of AI. While currently pursuing advanced AI certifications (NVIDIA and Data Governance), our practical approach focuses on the most neglected aspect of AI adoption: The Infrastructure & Security Layer.",
    },
    mission: {
      title: "Our Mission",
      content:
        "At VANGUARD-IA, our mission is to empower businesses/projects through innovative technology solutions that share our same values and objectives. Focusing on impact that is not only social but also ecological and sustainability.",
    },
    vision: {
      title: "Our Vision",
      content:
        "To be the leading technology consultancy in data governance and artificial intelligence infrastructure through constant innovation and strategic implementation of advanced technologies.",
    },
    values: {
      title: "Experience",
      logos: [
        {
          name: "IBM",
          imageUrl: "/images/logos/ibm.svg",
        },
        {
          name: "HP",
          imageUrl: "https://cdn.simpleicons.org/hp/FFFFFF",
        },
        {
          name: "EY",
          imageUrl: "/images/logos/ey.svg",
        },
        {
          name: "Logicalis",
          imageUrl: "/images/logos/logicalis.png",
        },
        {
          name: "Microsoft",
          imageUrl: "/images/logos/microsoft.svg",
        },
        {
          name: "Revolut",
          imageUrl: "/images/logos/revolut.png",
        },
        {
          name: "IESF",
          imageUrl:
            "https://mma.prnewswire.com/media/1971015/IESF_Logo.jpg?p=facebook",
        },
        {
          name: "Additional Partner",
          imageUrl: "/images/logos/additional-logo.png",
        },
      ],
    },
    team: {
      title: "Executive Team",
      content:
        "Our team consists of experienced professionals with diverse backgrounds in technology, business strategy, and industry-specific expertise. We bring together the best talent to deliver comprehensive solutions for our clients.",
      members: [
        {
          name: "Lucas Ballestero Lunghini",
          position: "Founder & General Director",
          linkedinUrl: "https://www.linkedin.com/in/luballest/",
          imageUrl: "/images/team/lucas-ballestero.jpg",
        },
        {
          name: "Nicolás Crespo",
          position: "QUAN LLC. Founder",
          linkedinUrl: "https://www.linkedin.com/in/nicolasmcrespo/",
          imageUrl: "/images/team/nicolas-crespo.jpg",
        },
        {
          name: "Diego Peccini",
          position: "Sales Manager",
          linkedinUrl: "https://www.linkedin.com/in/example",
          imageUrl: "/images/team/member3.jpg",
        },
        {
          name: "Javier García",
          position: "Financial Advisor",
          linkedinUrl: "https://www.linkedin.com/in/example",
          imageUrl: "/images/team/member4.jpg",
        },
        {
          name: "Gerardo Fernández",
          position: "Infrastructure/Cloud Computing Leader",
          linkedinUrl: "https://www.linkedin.com/in/example",
          imageUrl: "/images/team/member5.jpg",
        },
      ],
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
    origin: {
      title: "Origen",
      content:
        "Respaldados por experiencia certificada en Infraestructura de Misión Crítica (IBM, HP, NetApp, Brocade, Cisco, Cohesity, Dell EMC). Traemos más de 18 años de experiencia en datos empresariales al mundo de la IA. Mientras perseguimos actualmente certificaciones avanzadas en IA (NVIDIA y Gobernanza de Datos), nuestro enfoque práctico se centra en el aspecto más descuidado de la adopción de IA: La Capa de Infraestructura y Seguridad.",
    },
    mission: {
      title: "Nuestra Misión",
      content:
        "En VANGUARD-IA, nuestra misión es potenciar a las empresas/proyectos a través de soluciones tecnológicas innovadoras que compartan nuestros mismos valores y objetivos. Enfocándonos en el impacto no solo social sino también ecológico y sustentabilidad.",
    },
    vision: {
      title: "Nuestra Visión",
      content:
        "Ser la consultora tecnológica líder en gobernanza de datos e infraestructura de inteligencia artificial a través de la innovación constante y la implementación estratégica de tecnologías avanzadas.",
    },
    values: {
      title: "Experiencia",
      logos: [
        {
          name: "IBM",
          imageUrl: "/images/logos/ibm.svg",
        },
        {
          name: "HP",
          imageUrl: "https://cdn.simpleicons.org/hp/FFFFFF",
        },
        {
          name: "EY",
          imageUrl: "/images/logos/ey.svg",
        },
        {
          name: "Logicalis",
          imageUrl: "/images/logos/logicalis.png",
        },
        {
          name: "Microsoft",
          imageUrl: "/images/logos/microsoft.svg",
        },
        {
          name: "Revolut",
          imageUrl: "/images/logos/revolut.png",
        },
        {
          name: "IESF",
          imageUrl:
            "https://mma.prnewswire.com/media/1971015/IESF_Logo.jpg?p=facebook",
        },
        {
          name: "Additional Partner",
          imageUrl: "/images/logos/additional-logo.png",
        },
      ],
    },
    team: {
      title: "Equipo Directivo",
      content:
        "Nuestro equipo está formado por profesionales experimentados con diversos antecedentes en tecnología, estrategia empresarial y experiencia específica de la industria. Reunimos al mejor talento para ofrecer soluciones integrales para nuestros clientes.",
      members: [
        {
          name: "Lucas Ballestero Lunghini",
          position: "Fundador & Director General",
          linkedinUrl: "https://www.linkedin.com/in/luballest/",
          imageUrl: "/images/team/lucas-ballestero.jpg",
        },
        {
          name: "Nicolás Crespo",
          position: "Fundador QUAN LLC.",
          linkedinUrl: "https://www.linkedin.com/in/nicolasmcrespo/",
          imageUrl: "/images/team/nicolas-crespo.jpg",
        },
        {
          name: "Diego Peccini",
          position: "Gerente de Ventas",
          linkedinUrl: "https://www.linkedin.com/in/example",
          imageUrl: "/images/team/member3.jpg",
        },
        {
          name: "Javier García",
          position: "Asesor Financiero",
          linkedinUrl: "https://www.linkedin.com/in/example",
          imageUrl: "/images/team/member4.jpg",
        },
        {
          name: "Gerardo Fernández",
          position: "Líder de Infraestructura/Cloud Computing",
          linkedinUrl: "https://www.linkedin.com/in/example",
          imageUrl: "/images/team/member5.jpg",
        },
      ],
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
};
