"use client"

import { useLanguage } from "@/contexts/language-context"
import { Brain, Server, Globe, Database, Shield } from "lucide-react"
import { useMemo } from "react"
import { SectionTitle } from "@/components/section-title"
import { servicesContent } from "@/lib/content/services"
import { MagicBento } from "@/components/magic-bento"

export default function ServicesPage() {
  const { language } = useLanguage()

  const currentContent = useMemo(() => servicesContent[language], [language])
  const services = useMemo(
    () =>
      currentContent.services.map((service, index) => ({
        ...service,
        icon: [Brain, Server, Globe, Globe, Database, Shield][index] ?? Brain,
      })),
    [currentContent.services]
  )
  const bentoCards = useMemo(
    () =>
      services.map(service => ({
        color: "#060010",
        title: service.title,
        description: service.description,
        icon: service.icon,
        features: service.features
      })),
    [language, services]
  )

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_rgba(2,6,23,0.92))]" />
        <div className="vanguard-container relative z-10 py-24">
          <SectionTitle
            text={[
              currentContent.title,
              currentContent.subtitle,
              language === "en"
                ? "AI, IT, Web Development, Infrastructure, Security"
                : "IA, TI, Desarrollo Web, Infraestructura, Seguridad"
            ]}
            as="h1"
            className="mb-6 text-3xl text-white md:text-4xl"
            initialDelay={120}
          />
          <div className="vanguard-divider"></div>
        </div>
      </section>

      {/* Services Highlights */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_rgba(2,6,23,0.92))]" />
        <div className="relative z-10 vanguard-container py-24">
          <div className="mb-16 text-center text-slate-100">
            <p className="uppercase tracking-[0.35em] text-xs md:text-sm text-slate-300">
              {language === "en" ? "Our Services" : "Nuestros Servicios"}
            </p>
            <SectionTitle
              text={
                language === "en"
                  ? "The AI does not replace, it accelerates"
                  : "La inteligencia artificial no reemplaza, acelera"
              }
              as="h2"
              className="mt-4 text-2xl font-bold text-slate-100 md:text-3xl"
              initialDelay={220}
            />
            <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-slate-300">
              {language === "en"
                ? "Each service delivers velocidad y progreso."
                : "Cada servicio genera velocidad y progreso."}
            </p>
          </div>
          <MagicBento
            className="mx-auto w-full max-w-5xl"
            cards={bentoCards}
            enableStars
            enableSpotlight
            enableBorderGlow
            particleCount={18}
            enableTilt
            glowColor="132, 0, 255"
            clickEffect={false}
            enableMagnetism
          />
        </div>
      </section>

      {/* Services Video Section */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_rgba(2,6,23,0.92))]" />
        <div className="vanguard-container relative z-10 py-24">
          <div className="mx-auto max-w-4xl">
            <div className="aspect-video overflow-hidden rounded-lg bg-black shadow-xl">
              <video
                className="h-full w-full object-contain"
                controls
                preload="metadata"
                aria-label={language === "en" ? "We invite you to watch our services video" : "Los invitamos a ver nuestro video de servicios"}
              >
                <source src="/videos/services-video.mp4" type="video/mp4" />
                {language === "en"
                  ? "Your browser does not support the video tag."
                  : "Su navegador no admite la etiqueta de video."}
              </video>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
