"use client";

import { CTAButton } from "@/components/cta-button";
import { SectionTitle } from "@/components/section-title";
import { useLanguage } from "@/contexts/language-context";
import { aboutContent } from "@/lib/content/about";
import Image from "next/image";

function AboutPage() {
  const { language, t } = useLanguage();
  const currentContent = aboutContent[language];

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
              t("about.mission.hero"),
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
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:items-start">
            <div className="flex flex-col">
              <SectionTitle
                text={currentContent.origin.title}
                as="h2"
                className="mb-4 text-xl text-slate-100 sm:text-2xl"
                initialDelay={160}
              />
              <div className="mb-6 h-1 w-16 bg-vanguard-red"></div>
              <p className="text-slate-300 leading-relaxed">
                {currentContent.origin.content}
              </p>
            </div>
            <div className="flex flex-col">
              <SectionTitle
                text={currentContent.mission.title}
                as="h2"
                className="mb-4 text-xl text-slate-100 sm:text-2xl"
                initialDelay={180}
              />
              <div className="mb-6 h-1 w-16 bg-vanguard-red"></div>
              <p className="text-slate-300 leading-relaxed">
                {currentContent.mission.content}
              </p>
            </div>
            <div className="flex flex-col">
              <SectionTitle
                text={currentContent.vision.title}
                as="h2"
                className="mb-4 text-xl text-slate-100 sm:text-2xl"
                initialDelay={200}
              />
              <div className="mb-6 h-1 w-16 bg-vanguard-red"></div>
              <p className="text-slate-300 leading-relaxed">
                {currentContent.vision.content}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_rgba(2,6,23,0.92))]" />
        <div className="vanguard-container relative z-10 py-24">
          <div className="mb-4 flex justify-center">
            <SectionTitle
              text={currentContent.values.title}
              as="h2"
              className="text-2xl text-slate-100 sm:text-3xl text-center"
              initialDelay={200}
            />
          </div>
          <div className="mx-auto mb-12 h-1 w-20 bg-vanguard-red"></div>

          <div className="mx-auto max-w-4xl">
            <div className="rounded-xl border border-slate-600/50 bg-gradient-to-br from-slate-700/80 to-slate-800/90 p-8 shadow-lg">
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                {currentContent.values.logos.map((logo, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-center"
                  >
                    <img
                      src={logo.imageUrl}
                      alt={logo.name}
                      width={120}
                      height={60}
                      className="h-12 w-auto max-w-[120px] object-contain transition-all duration-400"
                      style={{
                        filter:
                          "grayscale(80%) brightness(1.1) contrast(0.9) opacity(0.7)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter =
                          "grayscale(0%) brightness(1) contrast(1) opacity(1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter =
                          "grayscale(80%) brightness(1.1) contrast(0.9) opacity(0.7)";
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_rgba(2,6,23,0.92))]" />
        <div className="vanguard-container relative z-10 py-24">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <SectionTitle
              text={currentContent.team.title}
              as="h2"
              className="mb-4 text-2xl text-slate-100 sm:text-3xl"
              initialDelay={220}
            />
            <div className="vanguard-divider mx-auto mb-6"></div>
            <p className="mb-8 text-slate-300">{currentContent.team.content}</p>
          </div>

          {currentContent.team.members &&
            currentContent.team.members.length > 0 && (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 items-stretch max-w-4xl mx-auto">
                {currentContent.team.members.map((member, index) => (
                  <a
                    key={index}
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-2"
                  >
                    <div className="relative mb-4 overflow-hidden rounded-full border-2 border-slate-600/50 bg-gradient-to-br from-slate-700/80 to-slate-800/90 p-1 transition-all duration-300 group-hover:border-vanguard-red/70 group-hover:shadow-lg">
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        width={200}
                        height={200}
                        className="rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="mb-1 text-lg font-semibold text-slate-100">
                      {member.name}
                    </h3>
                    <p className="text-sm text-slate-300">{member.position}</p>
                  </a>
                ))}
              </div>
            )}
        </div>
      </section>

      {/* Approach */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_rgba(2,6,23,0.92))]" />
        <div className="vanguard-container relative z-10 py-24">
          <div className="mb-4 flex justify-center">
            <SectionTitle
              text={currentContent.approach.title}
              as="h2"
              className="text-2xl text-slate-100 sm:text-3xl text-center"
              initialDelay={240}
            />
          </div>
          <div className="mx-auto mb-12 h-1 w-20 bg-vanguard-red"></div>

          <div className="mx-auto max-w-4xl space-y-6">
            {currentContent.approach.steps.map((step, index) => (
              <div
                key={index}
                className="flex min-h-[140px] flex-col items-start gap-6 rounded-xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-sm transition-shadow hover:border-slate-600 hover:shadow-lg md:flex-row md:items-center"
              >
                <div className="flex-shrink-0 text-4xl font-bold text-slate-200 md:w-16">
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-xl font-semibold text-slate-100">
                    {step.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
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
            text={t("cta.ready")}
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
  );
}

export default AboutPage;
