"use client"

import { useLanguage } from "@/contexts/language-context"
import { CTAButton } from "@/components/cta-button"
import { AIBackground } from "@/components/ai-background"
import { CircuitPattern } from "@/components/circuit-pattern"
import AnimatedTextHeader from "@/components/animated-text-header"

export default function AboutPage() {
  const { language, t } = useLanguage()

  const content = {
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
            description: "We constantly seek new and better ways to solve problems and create opportunities.",
          },
          {
            title: "Excellence",
            description: "We are committed to delivering the highest quality in everything we do.",
          },
          {
            title: "Integrity",
            description: "We operate with honesty, transparency, and ethical standards in all our interactions.",
          },
          {
            title: "Collaboration",
            description: "We believe in the power of teamwork and partnership with our clients.",
          },
          {
            title: "Client Focus",
            description: "We prioritize understanding and meeting our clients' unique needs and goals.",
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
            description: "We continuously monitor and refine our solutions to maximize performance and ROI.",
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
            description: "Buscamos constantemente nuevas y mejores formas de resolver problemas y crear oportunidades.",
          },
          {
            title: "Excelencia",
            description: "Estamos comprometidos a ofrecer la más alta calidad en todo lo que hacemos.",
          },
          {
            title: "Integridad",
            description: "Operamos con honestidad, transparencia y estándares éticos en todas nuestras interacciones.",
          },
          {
            title: "Colaboración",
            description: "Creemos en el poder del trabajo en equipo y la asociación con nuestros clientes.",
          },
          {
            title: "Enfoque en el Cliente",
            description: "Priorizamos entender y satisfacer las necesidades y objetivos únicos de nuestros clientes.",
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

  const currentContent = language === "en" ? content.en : content.es

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
                  ? "Our Mission: Empowering Businesses"
                  : "Nuestra Misión: Potenciar Empresas"
              ]}
              className="text-vanguard-blue"
            />
          </h1>
          <div className="vanguard-divider"></div>
          <CTAButton type="contact" />
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="vanguard-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-vanguard-blue mb-4">{currentContent.mission.title}</h2>
              <div className="w-16 h-1 bg-vanguard-red mb-6"></div>
              <p className="text-gray-600">{currentContent.mission.content}</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-vanguard-blue mb-4">{currentContent.vision.title}</h2>
              <div className="w-16 h-1 bg-vanguard-red mb-6"></div>
              <p className="text-gray-600">{currentContent.vision.content}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <CircuitPattern opacity={0.03} />
        <div className="vanguard-container">
          <h2 className="text-3xl font-bold text-vanguard-blue mb-4 text-center">{currentContent.values.title}</h2>
          <div className="w-20 h-1 bg-vanguard-red mx-auto mb-12"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentContent.values.items.map((value, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold text-vanguard-blue mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="vanguard-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-vanguard-blue mb-4">{currentContent.team.title}</h2>
            <div className="vanguard-divider mx-auto mb-6"></div>
            <p className="text-gray-600 mb-8">{currentContent.team.content}</p>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="py-20 bg-gray-50">
        <div className="vanguard-container">
          <h2 className="text-3xl font-bold text-vanguard-blue mb-4 text-center">{currentContent.approach.title}</h2>
          <div className="w-20 h-1 bg-vanguard-red mx-auto mb-12"></div>

          <div className="space-y-8">
            {currentContent.approach.steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-start gap-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="text-4xl font-bold text-vanguard-blue">{step.number}</div>
                <div>
                  <h3 className="text-xl font-semibold text-vanguard-blue mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-vanguard-blue relative overflow-hidden">
        <CircuitPattern color="#ffffff" opacity={0.05} />
        <div className="vanguard-container text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            {language === "en" ? "Ready to transform your business?" : "¿Listo para transformar tu negocio?"}
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8">
            {language === "en"
              ? "Our team of experts is ready to help you implement innovative solutions that will take your business to the next level."
              : "Nuestro equipo de expertos está listo para ayudarte a implementar soluciones innovadoras que llevarán tu negocio al siguiente nivel."}
          </p>
          <CTAButton type="contact" className="bg-white text-vanguard-blue hover:bg-gray-100" />
        </div>
      </section>
    </>
  )
}
