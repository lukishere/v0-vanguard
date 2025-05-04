"use client"

import { useLanguage } from "@/contexts/language-context"
import { CTAButton } from "@/components/cta-button"
import { Brain, Server, Globe, Database, Shield, CheckCircle } from "lucide-react"
import { useState } from "react"
import AnimatedTextHeader from "@/components/animated-text-header"

export default function ServicesPage() {
  const { language } = useLanguage()
  const [selectedIndex, setSelectedIndex] = useState(0)

  const content = {
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
          icon: Brain,
          title: "AI Development",
          description:
            "Leverage the power of artificial intelligence to optimize your business processes and gain competitive advantage.",
          features: [
            "AI Strategy Development",
            "Machine Learning Implementation",
            "Natural Language Processing",
            "Computer Vision Solutions",
            "AI Integration with Existing Systems",
          ],
        },
        {
          icon: Server,
          title: "IT Consulting",
          description: "Strategic technology planning and implementation to align with your business goals.",
          features: [
            "IT Strategy & Planning",
            "System Architecture Design",
            "Technology Stack Optimization",
            "Digital Transformation",
            "IT Project Management",
          ],
        },
        {
          icon: Globe,
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
          icon: Globe,
          title: "Web Innovation",
          description: "Comprehensive web development and design services to create cutting-edge digital experiences.",
          features: [
            "Custom Web Application Development",
            "Responsive Design",
            "Progressive Web Apps",
            "E-commerce Solutions",
            "Interactive User Interfaces",
          ],
        },
        {
          icon: Database,
          title: "Infrastructure Consulting Design",
          description: "Design and implement robust, scalable infrastructure solutions for your business needs.",
          features: [
            "Cloud Infrastructure Design",
            "On-Premises Solutions",
            "Hybrid Cloud Strategies",
            "Infrastructure Optimization",
            "Scalability Planning",
          ],
        },
        {
          icon: Shield,
          title: "Security",
          description: "Protect your business with comprehensive security solutions and best practices.",
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
          icon: Brain,
          title: "Desarrollo de IA",
          description:
            "Aprovecha el poder de la inteligencia artificial para optimizar tus procesos de negocio y obtener ventaja competitiva.",
          features: [
            "Desarrollo de Estrategia de IA",
            "Implementación de Machine Learning",
            "Procesamiento de Lenguaje Natural",
            "Soluciones de Visión por Computadora",
            "Integración de IA con Sistemas Existentes",
          ],
        },
        {
          icon: Server,
          title: "Consultoría de TI",
          description:
            "Planificación e implementación estratégica de tecnología alineada con tus objetivos de negocio.",
          features: [
            "Estrategia y Planificación de TI",
            "Diseño de Arquitectura de Sistemas",
            "Optimización de Stack Tecnológico",
            "Transformación Digital",
            "Gestión de Proyectos de TI",
          ],
        },
        {
          icon: Globe,
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
          icon: Globe,
          title: "Innovación Web",
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
          icon: Database,
          title: "Diseño de Consultoría de Infraestructura",
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
          icon: Shield,
          title: "Seguridad",
          description: "Protege tu negocio con soluciones de seguridad integrales y mejores prácticas.",
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

  const currentContent = language === "en" ? content.en : content.es
  const services = currentContent.services
  const selectedService = services[selectedIndex]

  return (
    <>
      {/* Hero Section */}
      <section className="vanguard-section bg-white">
        <div className="vanguard-container">
          <h1 className="text-4xl md:text-5xl font-bold text-vanguard-blue mb-6">
            <AnimatedTextHeader
              phrases={[
                currentContent.title,
                currentContent.subtitle,
                language === "en"
                  ? "AI, IT, Web, Infrastructure, Security"
                  : "IA, TI, Web, Infraestructura, Seguridad"
              ]}
              className="text-vanguard-blue"
            />
          </h1>
          <div className="vanguard-divider"></div>
        </div>
      </section>

      {/* New Services Layout */}
      <section className="flex justify-center items-center py-1 bg-white">
        <div className="flex flex-col gap-8 items-center mr-8">
          {services.slice(0, 3).map((service, idx) => {
            const Icon = service.icon
            return (
              <button
                key={service.title}
                className={`service-circle ${selectedIndex === idx ? "active" : ""}`}
                onClick={() => setSelectedIndex(idx)}
                aria-label={service.title}
              >
                <Icon className="h-10 w-10" />
                <span className="sr-only">{service.title}</span>
              </button>
            )
          })}
        </div>
        <div className="service-info-area mx-4 p-10 rounded-2xl shadow-xl bg-gray-50 border-2 border-gray-200 min-w-[350px] max-w-[420px] min-h-[350px] flex flex-col justify-center items-center">
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <selectedService.icon className="h-16 w-16 text-vanguard-blue" />
            </div>
            <h2 className="text-2xl font-bold text-vanguard-blue mb-2">{selectedService.title}</h2>
            <div className="w-12 h-1 bg-vanguard-red mb-4"></div>
            <p className="text-gray-600 mb-6 text-center">{selectedService.description}</p>
            <ul className="text-left space-y-2 mb-6">
              {selectedService.features.map((feature, i) => (
                <li key={i} className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-vanguard-blue mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
            <CTAButton type="quote" />
          </div>
        </div>
        <div className="flex flex-col gap-4 items-center ml-8">
          {services.slice(3, 6).map((service, idx) => {
            const Icon = service.icon
            const realIdx = idx + 3
            return (
              <button
                key={service.title}
                className={`service-circle ${selectedIndex === realIdx ? "active" : ""}`}
                onClick={() => setSelectedIndex(realIdx)}
                aria-label={service.title}
              >
                <Icon className="h-10 w-10" />
                <span className="sr-only">{service.title}</span>
              </button>
            )
          })}
        </div>
      </section>
      <div className="mb-16"></div>
    </>
  )
}
