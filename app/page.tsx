"use client"

import { useLanguage } from "@/contexts/language-context"
import { CTAButton } from "@/components/cta-button"
import { ServiceCard } from "@/components/service-card"
import { BlogCard } from "@/components/blog-card"
import { ClientReview } from "@/components/client-review"
import { CircuitPattern } from "@/components/circuit-pattern"
import { Brain, Server, Globe, Database, Shield } from "lucide-react"
import Image from "next/image"
import type { BusinessType } from "@/components/client-review"
import AnimatedTextHeader from "@/components/animated-text-header"
import LiveChat from '@/components/chatbot'
import LogoLoop from "@/components/LogoLoop"
import "@/components/LogoLoop.css"

export default function Home() {
  const { t, language } = useLanguage()

  const services = [
    {
      icon: Brain,
      title: t("services.ai.title"),
      description: t("services.ai.description"),
    },
    {
      icon: Server,
      title: t("services.it.title"),
      description: t("services.it.description"),
    },
    {
      icon: Globe,
      title: t("services.web.title"),
      description: t("services.web.description"),
    },
    {
      icon: Database,
      title: t("services.infrastructure.title"),
      description: t("services.infrastructure.description"),
    },
    {
      icon: Shield,
      title: t("services.security.title"),
      description: t("services.security.description"),
    },
    {
      icon: Globe,
      title: t("services.webInnovation.title"),
      description: t("services.webInnovation.description"),
    },
  ]

  const reviews = [
    {
      name: "Alex Martinez",
      position: "CTO",
      company: "TechNova Solutions",
      review:
        language === "en"
          ? "VANGUARD-IA's AI implementation transformed our data processing capabilities. We've seen a 40% increase in efficiency and significant cost reduction in just three months."
          : "La implementación de IA de VANGUARD-IA transformó nuestras capacidades de procesamiento de datos. Hemos visto un aumento del 40% en eficiencia y una reducción significativa de costos en solo tres meses.",
      rating: 5,
      businessType: "tech",
    },
    {
      name: "Elena Rodríguez",
      position: "Security Director",
      company: "Global Financial Group",
      review:
        language === "en"
          ? "The security infrastructure VANGUARD-IA designed for us has proven robust against multiple threat vectors. Their ongoing support and proactive monitoring have been invaluable."
          : "La infraestructura de seguridad que VANGUARD-IA diseñó para nosotros ha demostrado ser robusta contra múltiples vectores de amenazas. Su soporte continuo y monitoreo proactivo han sido invaluables.",
      rating: 5,
      businessType: "finance",
    },
    {
      name: "Carlos Mendoza",
      position: "Marketing Director",
      company: "HealthPlus Systems",
      review:
        language === "en"
          ? "Our web presence has completely transformed since working with VANGUARD-IA. The branding strategy they developed perfectly captures our mission and has resonated strongly with our target audience."
          : "Nuestra presencia web se ha transformado completamente desde que trabajamos con VANGUARD-IA. La estrategia de marca que desarrollaron captura perfectamente nuestra misión y ha resonado fuertemente con nuestra audiencia objetivo.",
      rating: 5,
      businessType: "healthcare",
    },
  ]

  const newsPosts = [
    {
      title: "Google's Latest AI Breakthroughs",
      description:
        "Discover how Google is pushing the boundaries of artificial intelligence with their latest research and developments.",
      image: "/placeholder.svg?height=400&width=600",
      date: "April 2, 2025",
      slug: "google-ai-breakthroughs",
      keywords: ["Google AI", "artificial intelligence", "machine learning", "AI research"],
    },
    {
      title: "ChatGPT's Evolution and Impact",
      description: "Explore how ChatGPT is transforming industries and revolutionizing human-AI interaction.",
      image: "/placeholder.svg?height=400&width=600",
      date: "March 28, 2025",
      slug: "chatgpt-evolution",
      keywords: ["ChatGPT", "AI integration", "digital transformation", "tech innovation"],
    },
    {
      title: "The Future of AI in Search Engines",
      description: "How Google and ChatGPT are revolutionizing search with artificial intelligence.",
      image: "/placeholder.svg?height=400&width=600",
      date: "March 15, 2025",
      slug: "ai-search-engines",
      keywords: ["AI search", "Google search", "ChatGPT", "search algorithms"],
    },
  ]

  return (
    <>
      {/* Hero Section with Original Image */}
      <section className="vanguard-section bg-white">
        <div className="vanguard-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="w-full min-h-[8rem] sm:min-h-[9rem] lg:min-h-[10rem] flex items-center justify-start">
                  <AnimatedTextHeader
                    phrases={[
                      language === "en"
                        ? "Innovation and creativity to transform your business"
                        : "Innovación y creatividad para transformar tu negocio",
                      language === "en"
                        ? "Advanced AI Solutions"
                        : "Soluciones avanzadas de IA",
                      language === "en"
                        ? "Cutting-Edge Technology"
                        : "Tecnología de vanguardia"
                    ]}
                    className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-vanguard-blue leading-tight"
                  />
                </div>
                <div className="vanguard-divider"></div>
              </div>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl">{t("hero.subtitle")}</p>
              <div className="flex flex-wrap gap-4">
                <CTAButton type="learn" />
              </div>
              <div className="mt-8">
                <LogoLoop 
                  logos={[
                    { 
                      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", 
                      alt: "GitHub",
                      href: "https://github.com"
                    },
                    { 
                      src: "https://cdn.simpleicons.org/perplexity/000000", 
                      alt: "Perplexity AI",
                      href: "https://www.perplexity.ai"
                    },
                    { 
                      src: "https://cdn.simpleicons.org/anthropic/000000", 
                      alt: "Claude Code",
                      href: "https://www.anthropic.com"
                    },
                    { 
                      src: "https://cursor.com/favicon.svg", 
                      alt: "Cursor AI",
                      href: "https://cursor.sh"
                    },
                    { 
                      src: "https://cdn.simpleicons.org/n8n/000000", 
                      alt: "N8N",
                      href: "https://n8n.io"
                    },
                    { 
                      src: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg", 
                      alt: "AWS",
                      href: "https://aws.amazon.com"
                    },
                    { 
                      src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg", 
                      alt: "Microsoft",
                      href: "https://www.microsoft.com"
                    },
                    { 
                      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg", 
                      alt: "Google",
                      href: "https://www.google.com"
                    },
                    { 
                      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg", 
                      alt: "Figma",
                      href: "https://www.figma.com"
                    },
                  ]}
                  speed={60}
                  logoHeight={40}
                  gap={48}
                  pauseOnHover={true}
                />
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-lg overflow-hidden shadow-md">
                <Image
                  src="/images/v-hero-new.jpg"
                  alt="VANGUARD-IA - Innovation and Creativity"
                  width={800}
                  height={450}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="vanguard-section bg-gray-50 relative overflow-hidden">
        <CircuitPattern opacity={0.03} />
        <div className="vanguard-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-vanguard-blue mb-4">{t("services.title")}</h2>
            <div className="vanguard-divider mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} icon={service.icon} title={service.title} description={service.description} />
            ))}
          </div>
        </div>
      </section>

      {/* Client Reviews Section */}
      <section className="vanguard-section bg-vanguard-blue relative overflow-hidden" style={{ zIndex: 30, position: 'relative' }}>
        <div className="vanguard-container" style={{ position: 'relative', zIndex: 31 }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">{t("reviews.title")}</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">{t("reviews.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <ClientReview
                key={index}
                name={review.name}
                position={review.position}
                company={review.company}
                review={review.review}
                rating={review.rating}
                businessType={review.businessType as BusinessType}
              />
            ))}
          </div>
        </div>
      </section>
      <LiveChat />
    </>
  )
}
