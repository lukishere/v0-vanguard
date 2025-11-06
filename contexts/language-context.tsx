"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "es"

type TranslationKey = keyof typeof translations.en

type Translations = {
  [K in Language]: {
    [key in TranslationKey]: string
  }
}

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: TranslationKey) => string
}

const translations = {
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.events": "Events",
    "nav.contact": "Contact",
    "cta.learnMore": "Learn More",
    "cta.readNews": "Read News Articles",
    "cta.contactUs": "Contact Us",
    "cta.getQuote": "Get a Quote",
    "hero.title": "Innovation and creativity to transform your business",
    "hero.subtitle": "Specialized consulting in AI, Applications - Web Branding, IT Services, Infrastructure, and Security",
    "services.title": "Our Services",
    "services.ai.title": "AI Development",
    "services.ai.description":
      "Leverage the power of artificial intelligence to optimize your business processes and gain competitive advantage.",
    "services.it.title": "Computer Services",
    "services.it.description": "Strategic technology planning and implementation to align with your business goals.",
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
    "services.security.description": "Protect your business with comprehensive security solutions and best practices.",
    "contact.title": "Contact Us",
    "contact.subtitle": "Get in touch with our team of experts",
    "contact.form.name": "Name",
    "contact.form.email": "Email",
    "contact.form.message": "Message",
    "contact.form.submit": "Submit",
    "contact.address": "Location",
    "contact.phone": "Phone",
    "contact.email": "Email",
    "footer.rights": "All rights reserved",
    "events.title": "Latest Events",
    "events.subtitle": "Stay updated with our latest events and company updates",
    "about.team": "Our Team",
    "about.mission": "Our Mission",
    "about.vision": "Our Vision",
    "about.values": "Our Values",
    "about.approach": "Our Approach",
    "cta.ready": "Ready to transform your business?",
    "cta.team":
      "Our team of experts is ready to help you implement innovative solutions that will take your business to the next level.",
    "cta.getStarted": "Ready to get started?",
    "cta.discuss":
      "Contact us today to discuss your project and how our services can help you achieve your business goals.",
    "contact.info": "Contact Information",
    "contact.hours": "Office Hours",
    "contact.form.quote": "Request a Quote",
    "contact.form.fill": "Fill out the form below and we'll get back to you as soon as possible.",
    "contact.form.thanks": "Thank you!",
    "contact.form.sent": "Your message has been sent successfully. We'll get back to you shortly.",
    "contact.form.sending": "Sending...",
    "faq.didntFind": "Didn't find what you're looking for?",
    "reviews.title": "What Our Clients Say",
    "reviews.subtitle": "Trusted by businesses across industries",
    "contact.country": "Spain",
    "contact.hours.weekdays": "Monday - Friday:",
    "contact.hours.saturday": "Saturday:",
    "contact.hours.sunday": "Sunday:",
    "contact.hours.closed": "Closed",
  },
  es: {
    "nav.home": "Inicio",
    "nav.about": "Nosotros",
    "nav.services": "Servicios",
    "nav.events": "Eventos",
    "nav.contact": "Contacto",
    "cta.learnMore": "Saber Más",
    "cta.readNews": "Leer Artículos de Noticias",
    "cta.contactUs": "Contáctanos",
    "cta.getQuote": "Solicitar Presupuesto",
    "hero.title": "Innovación y creatividad para transformar tu negocio",
    "hero.subtitle": "Consultoría especializada en Agentes de IA, Automatizacion, Bots, Servicios Informáticos, Infraestructura y Seguridad",
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
    "services.webInnovation.title": "Innovación Web",
    "services.webInnovation.description":
      "Servicios completos de desarrollo y diseño web para crear experiencias digitales de vanguardia.",
    "services.infrastructure.title": "Diseño de Consultoría de Infraestructura",
    "services.infrastructure.description":
      "Diseño e implementación de soluciones de infraestructura robustas y escalables para las necesidades de tu negocio.",
    "services.security.title": "Seguridad",
    "services.security.description": "Protege tu negocio con soluciones de seguridad integrales y mejores prácticas.",
    "contact.title": "Contáctanos",
    "contact.subtitle": "Ponte en contacto con nuestro equipo de expertos",
    "contact.form.name": "Nombre",
    "contact.form.email": "Correo electrónico",
    "contact.form.message": "Mensaje",
    "contact.form.submit": "Enviar",
    "contact.address": "Ubicación",
    "contact.phone": "Teléfono",
    "contact.email": "Correo electrónico",
    "footer.rights": "Todos los derechos reservados",
    "events.title": "Últimos Eventos",
    "events.subtitle": "Mantente actualizado con nuestros últimos eventos y actualizaciones de la empresa",
    "about.team": "Nuestro Equipo",
    "about.mission": "Nuestra Misión",
    "about.vision": "Nuestra Visión",
    "about.values": "Nuestros Valores",
    "about.approach": "Nuestro Enfoque",
    "cta.ready": "¿Listo para transformar tu negocio?",
    "cta.team":
      "Nuestro equipo de expertos está listo para ayudarte a implementar soluciones innovadoras que llevarán tu negocio al siguiente nivel.",
    "cta.getStarted": "¿Listo para comenzar?",
    "cta.discuss":
      "Contáctanos hoy para discutir tu proyecto y cómo nuestros servicios pueden ayudarte a alcanzar tus objetivos empresariales.",
    "contact.info": "Información de Contacto",
    "contact.hours": "Horario de Oficina",
    "contact.form.quote": "Solicitar un Presupuesto",
    "contact.form.fill": "Completa el formulario a continuación y nos pondremos en contacto contigo lo antes posible.",
    "contact.form.thanks": "¡Gracias!",
    "contact.form.sent": "Tu mensaje ha sido enviado con éxito. Nos pondremos en contacto contigo en breve.",
    "contact.form.sending": "Enviando...",
    "faq.didntFind": "¿No encontraste lo que buscabas?",
    "reviews.title": "Lo Que Dicen Nuestros Clientes",
    "reviews.subtitle": "Confiado por empresas de diversas industrias",
    "contact.country": "España",
    "contact.hours.weekdays": "Lunes - Viernes:",
    "contact.hours.saturday": "Sábado:",
    "contact.hours.sunday": "Domingo:",
    "contact.hours.closed": "Cerrado",
  }
} as const

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  // Function to get translation with improved type safety
  const t = (key: TranslationKey): string => {
    return translations[language][key] || key
  }

  // Store language preference in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem("vanguard-language") as Language | null
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "es")) {
        setLanguage(savedLanguage)
      }
    }
  }, [])

  // Update localStorage when language changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("vanguard-language", language)
    }
  }, [language])

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
