"use client"

import { useLanguage } from "@/contexts/language-context"
import { CTAButton } from "@/components/cta-button"
import { SectionTitle } from "@/components/section-title"
import { aboutContent } from "@/lib/content/about"

export default function AboutPage() {
  const { language } = useLanguage()
  const currentContent = aboutContent[language]

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
                ? "Our Mission: Empowering Businesses"
                : "Nuestra Misión: Potenciar Empresas"
            ]}
            as="h1"
            className="mb-6 text-3xl text-slate-100 md:text-4xl"
            initialDelay={120}
          />
          <div className="vanguard-divider"></div>
          <CTAButton
            type="contact"
            className="border border-slate-700/60 bg-slate-950/70 text-slate-100 hover:border-slate-500 hover:bg-slate-900/80"
          />
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_rgba(2,6,23,0.92))]" />
        <div className="vanguard-container relative z-10 py-24">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <SectionTitle
                text={currentContent.mission.title}
                as="h2"
                className="mb-4 text-xl text-slate-100 sm:text-2xl"
                initialDelay={180}
              />
              <div className="mb-6 h-1 w-16 bg-vanguard-red"></div>
              <p className="text-slate-300">{currentContent.mission.content}</p>
            </div>
            <div>
              <SectionTitle
                text={currentContent.vision.title}
                as="h2"
                className="mb-4 text-xl text-slate-100 sm:text-2xl"
                initialDelay={220}
              />
              <div className="mb-6 h-1 w-16 bg-vanguard-red"></div>
              <p className="text-slate-300">{currentContent.vision.content}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_rgba(2,6,23,0.92))]" />
        <div className="vanguard-container relative z-10 py-24">
          <SectionTitle
            text={currentContent.values.title}
            as="h2"
            className="mb-4 text-center text-2xl text-slate-100 sm:text-3xl"
            initialDelay={200}
          />
          <div className="mx-auto mb-12 h-1 w-20 bg-vanguard-red"></div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {currentContent.values.items.map((value, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-sm transition-shadow hover:border-slate-600 hover:shadow-lg"
              >
                <h3 className="mb-3 text-xl font-semibold text-slate-100">{value.title}</h3>
                <p className="text-slate-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_rgba(2,6,23,0.92))]" />
        <div className="vanguard-container relative z-10 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <SectionTitle
              text={currentContent.team.title}
              as="h2"
              className="mb-4 text-2xl text-slate-100 sm:text-3xl"
              initialDelay={220}
            />
            <div className="vanguard-divider mx-auto mb-6"></div>
            <p className="mb-8 text-slate-300">{currentContent.team.content}</p>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_rgba(2,6,23,0.92))]" />
        <div className="vanguard-container relative z-10 py-24">
          <SectionTitle
            text={currentContent.approach.title}
            as="h2"
            className="mb-4 text-center text-2xl text-slate-100 sm:text-3xl"
            initialDelay={240}
          />
          <div className="mx-auto mb-12 h-1 w-20 bg-vanguard-red"></div>

          <div className="space-y-8">
            {currentContent.approach.steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-start gap-6 rounded-xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-sm transition-shadow hover:border-slate-600 hover:shadow-lg md:flex-row"
              >
                <div className="text-4xl font-bold text-slate-200">{step.number}</div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-slate-100">{step.title}</h3>
                  <p className="text-slate-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_rgba(2,6,23,0.92))]" />
        <div className="vanguard-container relative z-10 py-24 text-center">
          <SectionTitle
            text={language === "en" ? "Ready to transform your business?" : "¿Listo para transformar tu negocio?"}
            as="h2"
            className="mb-6 text-2xl text-slate-100 sm:text-3xl"
            initialDelay={260}
          />
          <p className="mx-auto mb-8 max-w-2xl text-slate-300">
            {language === "en"
              ? "Our team of experts is ready to help you implement innovative solutions that will take your business to the next level."
              : "Nuestro equipo de expertos está listo para ayudarte a implementar soluciones innovadoras que llevarán tu negocio al siguiente nivel."}
          </p>
          <CTAButton
            type="contact"
            className="border border-slate-700/60 bg-slate-950/70 text-slate-100 hover:border-slate-500 hover:bg-slate-900/80"
          />
        </div>
      </section>
    </>
  )
}
