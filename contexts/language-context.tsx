"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Language = "en" | "es";

type TranslationKey = keyof typeof translations.en;

type Translations = {
  [K in Language]: {
    [key in TranslationKey]: string;
  };
};

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
};

const translations = {
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.events": "Events",
    "nav.contact": "Contact",
    "cta.learnMore": "Schedule Your Technical Audit",
    "cta.readNews": "Read News Articles",
    "cta.contactUs": "Contact Us",
    "cta.getQuote": "Client Access",
    "hero.title": "Innovation and creativity to transform your business",
    "hero.subtitle":
      "We design sovereign AI ecosystems with high-performance infrastructure where automated workflows coexist. Specialists in data sovereignty and protection.",
    "services.title": "Our Services",
    "services.ai.title": "AI Development",
    "services.ai.description":
      "Leverage the power of artificial intelligence to optimize your business processes and gain competitive advantage.",
    "services.it.title": "Computer Services",
    "services.it.description":
      "Strategic technology planning and implementation to align with your business goals.",
    "services.web.title": "Web Branding",
    "services.web.description":
      "Create a powerful online presence that reflects your brand's values and connects with your audience.",
    "services.webInnovation.title": "Web Innovation",
    "services.webInnovation.description":
      "Comprehensive web development and design services to create cutting-edge digital experiences.",
    "services.infrastructure.title": "Infrastructure Consulting Design",
    "services.infrastructure.description":
      "Design and implement robust, scalable infrastructure solutions for your business needs.",
    "services.security.title": "Security",
    "services.security.description":
      "Protect your business with comprehensive security solutions and best practices.",
    "contact.title": "Contact Us",
    "contact.subtitle": "Get in touch with our team of experts",
    "contact.form.name": "Name",
    "contact.form.email": "Email",
    "contact.form.message": "Message",
    "contact.form.submit": "Submit",
    "contact.address": "Location",
    "contact.phone": "Support",
    "contact.email": "Email",
    "footer.rights":
      "A brand of VANGUARD LB CONSULTING S.L.U. All rights reserved.",
    "events.title": "Latest Events",
    "events.subtitle":
      "Stay updated with our latest events and company updates",
    "about.team": "Our Team",
    "about.mission": "Our Mission",
    "about.mission.hero": "Our Mission: Empowering Businesses",
    "about.vision": "Our Vision",
    "about.values": "Our Values",
    "about.approach": "Our Approach",
    "cta.ready": "Ready to transform your business?",
    "cta.team":
      "Our team of experts is ready to help you implement innovative solutions that will take your business to the next level.",
    "cta.getStarted": "Ready to get started?",
    "cta.discuss":
      "Contact us today to discuss your project and how our services can help you achieve your business goals.",
    "contact.info": "Your connection with us matters",
    "contact.hours": "Office Hours",
    "contact.form.secureForm": "Secure Form",
    "contact.form.quote": "Request a Quote",
    "contact.form.fill":
      "To learn more about our services and products, audits or demos:",
    "contact.form.thanks": "Thank you!",
    "contact.form.sent":
      "Your message has been sent successfully. We'll get back to you shortly.",
    "contact.form.sending": "Sending...",
    "contact.form.captcha": "Security Verification",
    "contact.form.captchaRequired":
      "Please complete the security verification.",
    "contact.form.captchaError":
      "Security verification failed. Please try again.",
    "contact.form.captchaUnavailable":
      "Security verification is currently unavailable.",
    "contact.form.privacy":
      "Your information is secure and will only be used to contact you.",
    "faq.didntFind": "Didn't find what you're looking for?",
    "reviews.title": "What Our Clients Say",
    "reviews.subtitle": "Trusted by businesses across industries",
    "contact.country": "Spain",
    "contact.hours.weekdays": "Monday - Friday:",
    "contact.hours.saturday": "Saturday:",
    "contact.hours.sunday": "Sunday:",
    "contact.hours.closed": "AI Online",
    // Footer translations
    "footer.contact": "Contact",
    "footer.description": "Artisans of technology dedicated to innovation",
    "footer.quickLinks": "Quick Links",
    "footer.privacyPolicy": "Privacy Policy",
    "footer.cookiePolicy": "Cookie Policy",
    "footer.termsOfService": "Terms of Service",
    "footer.faq": "FAQ",
    "footer.cookieSettings": "Cookie Settings",
    // Contact LinkedIn
    "contact.linkedin.title": "Follow us",
    "contact.linkedin.content": "Connect with us on LinkedIn",
    // Hero section
    "hero.advancedSolutions": "Advanced AI Solutions",
    "hero.aiSolutions": "AI Solutions",
    "hero.technology": "Cutting-Edge Technology",
    // FAQ
    "faq.support": "Support & Information",
    // Reviews
    "reviews.client1.name": "Alex Martinez",
    "reviews.client1.position": "CTO",
    "reviews.client1.company": "TechNova Solutions",
    "reviews.client1.review":
      "VANGUARD-IA's AI implementation transformed our data processing capabilities. We've seen a 40% increase in efficiency and significant cost reduction in just three months.",
    "reviews.client2.name": "Elena Rodríguez",
    "reviews.client2.position": "Security Director",
    "reviews.client2.company": "Global Financial Group",
    "reviews.client2.review":
      "The security infrastructure VANGUARD-IA designed for us has proven robust against multiple threat vectors. Their ongoing support and proactive monitoring have been invaluable.",
    "reviews.client3.name": "Carlos Mendoza",
    "reviews.client3.position": "Marketing Director",
    "reviews.client3.company": "HealthPlus Systems",
    "reviews.client3.review":
      "Our web presence has completely transformed since working with VANGUARD-IA. The branding strategy they developed perfectly captures our mission and has resonated strongly with our target audience.",
    // Audit modal
    "audit.modal.title": "Schedule Your Technical Audit",
    "audit.modal.description":
      "Fill out this quick form and we'll contact you to schedule your technical audit.",
    "audit.modal.name": "Name",
    "audit.modal.email": "Email",
    "audit.modal.phone": "Phone",
    "audit.modal.position": "Position",
    "audit.modal.company": "Company",
    "audit.modal.sector": "Sector",
    "audit.modal.message": "Message (optional)",
    "audit.modal.submit": "Send Request",
    "audit.modal.sending": "Sending...",
    "audit.modal.success": "Thank you! We'll contact you soon.",
    "audit.modal.error": "There was an error. Please try again.",
    "audit.modal.validation.nameRequired": "Name is required",
    "audit.modal.validation.emailRequired": "Email is required",
    "audit.modal.validation.emailInvalid": "Please enter a valid email address",
    "audit.modal.validation.phoneRequired": "Phone number is required",
    // QUAN Partnership
    "quan.title": "Digital Experience & Branding",
    "quan.poweredBy": "Powered by QUAN LLC",
    "quan.description":
      "Strategic alliance in the Americas. Specialists in custom web application development with interactive user interfaces and e-commerce solutions. Brand identity updates and user experience optimization.",
  },
  es: {
    "nav.home": "Inicio",
    "nav.about": "Nosotros",
    "nav.services": "Servicios",
    "nav.events": "Eventos",
    "nav.contact": "Contacto",
    "cta.learnMore": "Agenda tu auditoría técnica",
    "cta.readNews": "Leer Artículos de Noticias",
    "cta.contactUs": "Contáctanos",
    "cta.getQuote": "Acceso Clientes",
    "hero.title": "Innovación y creatividad para transformar tu negocio",
    "hero.subtitle":
      "Especialistas en implementaciones tecnológicas potenciadas por la inteligencia artificial donde flujos de trabajo automatizados conviven.",
    "services.title": "Nuestros Servicios",
    "services.ai.title": "Desarrollo de IA",
    "services.ai.description":
      "Aprovecha el poder de la inteligencia artificial para optimizar tus procesos de negocio y obtener ventaja competitiva.",
    "services.it.title": "Servicios Informáticos",
    "services.it.description":
      "Planificación e implementación estratégica de tecnología alineada con tus objetivos de negocio.",
    "services.web.title": "Branding Web",
    "services.web.description":
      "Crea una poderosa presencia online que refleje los valores de tu marca y conecte con tu audiencia.",
    "services.webInnovation.title": "Desarrollo Web",
    "services.webInnovation.description":
      "Servicios completos de desarrollo y diseño web para crear experiencias digitales de vanguardia.",
    "services.infrastructure.title": "Diseño de Consultoría de Infraestructura",
    "services.infrastructure.description":
      "Diseño e implementación de soluciones de infraestructura robustas y escalables para las necesidades de tu negocio.",
    "services.security.title": "Seguridad",
    "services.security.description":
      "Protege tu negocio con soluciones de seguridad integrales y mejores prácticas.",
    "contact.title": "Contáctanos",
    "contact.subtitle": "Ponte en contacto con nuestro equipo de expertos",
    "contact.form.name": "Nombre",
    "contact.form.email": "Correo electrónico",
    "contact.form.message": "Mensaje",
    "contact.form.submit": "Enviar",
    "contact.address": "Ubicación",
    "contact.phone": "Soporte",
    "contact.email": "Correo electrónico",
    "footer.rights":
      "Una marca de VANGUARD LB CONSULTING S.L.U. Todos los derechos reservados.",
    "events.title": "Últimos Eventos",
    "events.subtitle": "Comparte una experiencia única con nosotros",
    "about.team": "Nuestro Equipo",
    "about.mission": "Nuestra Misión",
    "about.mission.hero": "Nuestra Misión: Potenciar Empresas",
    "about.vision": "Nuestra Visión",
    "about.values": "Nuestros Valores",
    "about.approach": "Nuestro Enfoque",
    "cta.ready": "¿Listo para transformar tu negocio?",
    "cta.team":
      "Nuestro equipo de expertos está listo para ayudarte a implementar soluciones innovadoras que llevarán tu negocio al siguiente nivel.",
    "cta.getStarted": "¿Listo para comenzar?",
    "cta.discuss":
      "Contáctanos hoy para discutir tu proyecto y cómo nuestros servicios pueden ayudarte a alcanzar tus objetivos empresariales.",
    "contact.info": "Tu conexión con nosotros importa",
    "contact.hours": "Horario de Oficina",
    "contact.form.secureForm": "Formulario Seguro",
    "contact.form.quote": "Solicitar un Presupuesto",
    "contact.form.fill":
      "Para saber más de nuestros servicios y productos, auditorías o demos:",
    "contact.form.thanks": "¡Gracias!",
    "contact.form.sent":
      "Tu mensaje ha sido enviado con éxito. Nos pondremos en contacto contigo en breve.",
    "contact.form.sending": "Enviando...",
    "contact.form.captcha": "Verificación de Seguridad",
    "contact.form.captchaRequired":
      "Por favor, completa la verificación de seguridad.",
    "contact.form.captchaError":
      "La verificación de seguridad falló. Por favor, inténtalo de nuevo.",
    "contact.form.captchaUnavailable":
      "La verificación de seguridad no está disponible actualmente.",
    "contact.form.privacy":
      "Tu información está segura y solo se utilizará para contactarte.",
    "faq.didntFind": "¿No encontraste lo que buscabas?",
    "reviews.title": "Lo Que Dicen Nuestros Clientes",
    "reviews.subtitle": "Confiado por empresas de diversas industrias",
    "contact.country": "España",
    "contact.hours.weekdays": "Lunes - Viernes:",
    "contact.hours.saturday": "Sábado:",
    "contact.hours.sunday": "Domingo:",
    "contact.hours.closed": "IA Activa",
    // Footer translations
    "footer.contact": "Contacto",
    "footer.description":
      "Artesanos de la tecnología dedicados a la innovación",
    "footer.quickLinks": "Enlaces Rápidos",
    "footer.privacyPolicy": "Política de Privacidad",
    "footer.cookiePolicy": "Política de Cookies",
    "footer.termsOfService": "Términos de Servicio",
    "footer.faq": "Preguntas Frecuentes",
    "footer.cookieSettings": "Configuración de Cookies",
    // Contact LinkedIn
    "contact.linkedin.title": "Síguenos",
    "contact.linkedin.content": "Conéctate con nosotros en LinkedIn",
    // Hero section
    "hero.advancedSolutions": "Soluciones avanzadas de IA",
    "hero.aiSolutions": "Soluciones de IA",
    "hero.technology": "Tecnología de vanguardia",
    // FAQ
    "faq.support": "Soporte e Información",
    // Reviews
    "reviews.client1.name": "Alex Martinez",
    "reviews.client1.position": "CTO",
    "reviews.client1.company": "TechNova Solutions",
    "reviews.client1.review":
      "La implementación de IA de VANGUARD-IA transformó nuestras capacidades de procesamiento de datos. Hemos visto un aumento del 40% en eficiencia y una reducción significativa de costos en solo tres meses.",
    "reviews.client2.name": "Elena Rodríguez",
    "reviews.client2.position": "Directora de Seguridad",
    "reviews.client2.company": "Global Financial Group",
    "reviews.client2.review":
      "La infraestructura de seguridad que VANGUARD-IA diseñó para nosotros ha demostrado ser robusta contra múltiples vectores de amenazas. Su soporte continuo y monitoreo proactivo han sido invaluables.",
    "reviews.client3.name": "Carlos Mendoza",
    "reviews.client3.position": "Director de Marketing",
    "reviews.client3.company": "HealthPlus Systems",
    "reviews.client3.review":
      "Nuestra presencia web se ha transformado completamente desde que trabajamos con VANGUARD-IA. La estrategia de marca que desarrollaron captura perfectamente nuestra misión y ha resonado fuertemente con nuestra audiencia objetivo.",
    // Modal de auditoría
    "audit.modal.title": "Agenda tu auditoría técnica",
    "audit.modal.description":
      "Completa este formulario rápido y nos pondremos en contacto contigo para agendar tu auditoría técnica.",
    "audit.modal.name": "Nombre",
    "audit.modal.email": "Correo electrónico",
    "audit.modal.phone": "Teléfono",
    "audit.modal.position": "Puesto",
    "audit.modal.company": "Empresa",
    "audit.modal.sector": "Sector",
    "audit.modal.message": "Mensaje (opcional)",
    "audit.modal.submit": "Enviar Solicitud",
    "audit.modal.sending": "Enviando...",
    "audit.modal.success":
      "¡Gracias! Nos pondremos en contacto contigo pronto.",
    "audit.modal.error": "Hubo un error. Por favor, inténtalo de nuevo.",
    "audit.modal.validation.nameRequired": "El nombre es obligatorio",
    "audit.modal.validation.emailRequired":
      "El correo electrónico es obligatorio",
    "audit.modal.validation.emailInvalid":
      "Por favor, ingresa un correo electrónico válido",
    "audit.modal.validation.phoneRequired": "El teléfono es obligatorio",
    // Asociación QUAN
    "quan.title": "Experiencia Digital & Branding",
    "quan.poweredBy": "Powered by QUAN LLC",
    "quan.description":
      "Alianza estratégica en Americas. Especialistas en desarrollo de aplicaciones web personalizadas con interfaces de usuario interactivas y soluciones de comercio electrónico. Actualización de identidad de marca y optimización de experiencia de usuario.",
  },
} as const;

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("es");

  // Function to get translation with improved type safety
  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  // Store language preference in localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem(
        "vanguard-language"
      ) as Language | null;
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "es")) {
        setLanguage(savedLanguage);
      }
    }
  }, []);

  // Update localStorage when language changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("vanguard-language", language);
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
