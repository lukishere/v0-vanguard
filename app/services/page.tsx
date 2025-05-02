"use client"

import { useLanguage } from "@/contexts/language-context"
import { CTAButton } from "@/components/cta-button"
import { Brain, Server, Globe, Database, Shield, CheckCircle } from "lucide-react"

export default function ServicesPage() {
  const { language } = useLanguage()

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

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gray-50 py-16 relative overflow-hidden">
        <div className="vanguard-container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-vanguard-blue mb-6">{currentContent.title}</h1>
            <p className="text-xl text-gray-600 mb-8">{currentContent.subtitle}</p>
            <CTAButton type="quote" />
          </div>
        </div>
      </section>

      {/* Services */}
      {currentContent.services.map((service, index) => {
        const Icon = service.icon
        const isEven = index % 2 === 0

        return (
          <section key={index} className={`py-16 ${isEven ? "bg-white" : "bg-gray-50"} relative overflow-hidden`}>
            <div className="vanguard-container">
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isEven ? "" : "lg:flex-row-reverse"}`}
              >
                <div className={`order-2 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                  <div className="bg-gray-100 rounded-lg p-8 h-full flex items-center justify-center">
                    <Icon className="h-32 w-32 text-vanguard-blue" />
                  </div>
                </div>
                <div className={`order-1 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                  <h2 className="text-3xl font-bold text-vanguard-blue mb-4">{service.title}</h2>
                  <div className="w-16 h-1 bg-vanguard-red mb-6"></div>
                  <p className="text-gray-600 mb-8">{service.description}</p>

                  <div className="space-y-3 mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-vanguard-blue mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <CTAButton type="quote" />
                </div>
              </div>
            </div>
          </section>
        )
      })}

      {/* CTA Section */}
      <section className="py-16 bg-vanguard-blue relative overflow-hidden">
        <div className="vanguard-container text-center">
          <h2 className="text-3xl font-bold text-white mb-6">{currentContent.cta.getStarted}</h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8">{currentContent.cta.discuss}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <CTAButton type="quote" className="bg-white text-vanguard-blue hover:bg-gray-100" />
            <CTAButton type="contact" className="bg-transparent border-white text-white hover:bg-white/10" />
          </div>
        </div>
      </section>
    </>
  )
}
