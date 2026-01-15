"use client"

import type React from "react"
import { Suspense } from "react"

import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Linkedin, ShieldCheck } from "lucide-react"
import { SectionTitle } from "@/components/section-title"
import { contactInfo as defaultContactInfo } from "@/lib/content/contact"

function ContactPageContent() {
  const { t } = useLanguage()

  const contactInfo = [
    {
      icon: Mail,
      title: t("contact.email"),
      content: defaultContactInfo.email,
      href: `mailto:${defaultContactInfo.email}`,
    },
    {
      icon: Phone,
      title: t("contact.phone"),
      content: "Whatsapp Chat",
      href: "#",
    },
    {
      icon: MapPin,
      title: t("contact.address"),
      content: `${defaultContactInfo.address}, ${t("contact.country")}`,
      href: "#",
    },
    {
      icon: Linkedin,
      title: t("contact.linkedin.title"),
      content: t("contact.linkedin.content"),
      href: "https://www.linkedin.com/company/vanguard-lb-consulting",
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_rgba(2,6,23,0.92))] -z-0" />
        <div className="vanguard-container relative z-10 py-24">
          <SectionTitle
            text={[
              t("contact.title"),
              t("contact.subtitle"),
              "contacto@vanguard-ia.tech"
            ]}
            as="h1"
            className="mb-6 text-3xl text-white md:text-4xl"
            initialDelay={120}
          />
          <div className="vanguard-divider"></div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_rgba(2,6,23,0.92))] -z-0" />
        <div className="vanguard-container relative z-10 py-24">
          <div className="mx-auto max-w-4xl">
            {/* Contact Information */}
            <div className="relative">
              <div className="absolute inset-0 blur-3xl opacity-70 [background:radial-gradient(circle_at_top,_rgba(14,165,233,0.35),_rgba(15,23,42,0))] -z-10" />
              <div className="relative z-10 rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950/65 to-slate-950/90 p-[1px] shadow-[0_35px_65px_rgba(2,6,23,0.6)] backdrop-blur">
                <div className="rounded-[26px] border border-white/10 bg-slate-950/80">
                  <Card className="h-full border-0 bg-transparent text-slate-100">
                    <CardHeader className="space-y-4 border-b border-white/10 bg-gradient-to-br from-slate-900/60 via-slate-950/40 to-slate-950/80">
                      <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.4em] text-slate-300">
                        <ShieldCheck className="h-4 w-4 text-vanguard-blue" />
                        <span>{t("contact.info")}</span>
                      </div>
                      <CardTitle className="text-2xl font-semibold text-white md:text-3xl">
                        {t("contact.info")}
                      </CardTitle>
                      <CardDescription className="max-w-2xl text-sm leading-relaxed text-slate-300">
                        {t("contact.form.fill")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="grid gap-6">
                        {contactInfo.map((item, index) => {
                          const isNonClickable = item.href === "#" && item.content === "Whatsapp Chat"
                          const Component = isNonClickable ? "div" : "a"
                          const props = isNonClickable
                            ? { className: "group flex items-start gap-4 rounded-2xl border border-white/5 bg-white/5 p-5" }
                            : { href: item.href, className: "group flex items-start gap-4 rounded-2xl border border-white/5 bg-white/5 p-5 transition-all duration-300 hover:border-vanguard-blue/50 hover:bg-vanguard-blue/10" }

                          return (
                            <Component key={index} {...props}>
                              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-slate-900/60 transition-all duration-300 group-hover:border-vanguard-blue/50 group-hover:bg-vanguard-blue/20">
                                <item.icon className="h-6 w-6 text-vanguard-blue" />
                              </div>
                              <div>
                                <h3 className="text-base font-semibold text-white">{item.title}</h3>
                                <p className="text-sm text-slate-300 group-hover:text-slate-200">{item.content}</p>
                              </div>
                            </Component>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <>
        {/* Hero Section Fallback - matches exact structure */}
        <section className="relative overflow-hidden bg-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_rgba(2,6,23,0.92))] -z-0" />
          <div className="vanguard-container relative z-10 py-24">
            <h1 className="mb-6 text-3xl text-white md:text-4xl font-bold">Contáctanos</h1>
            <div className="vanguard-divider"></div>
          </div>
        </section>
        {/* Contact Information Section Fallback */}
        <section className="relative overflow-hidden bg-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_rgba(2,6,23,0.92))] -z-0" />
          <div className="vanguard-container relative z-10 py-24">
            <div className="mx-auto max-w-4xl">
              <div className="relative">
                <div className="absolute inset-0 blur-3xl opacity-70 [background:radial-gradient(circle_at_top,_rgba(14,165,233,0.35),_rgba(15,23,42,0))] -z-10" />
                <div className="relative z-10 rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950/65 to-slate-950/90 p-[1px] shadow-[0_35px_65px_rgba(2,6,23,0.6)] backdrop-blur">
                  <div className="rounded-[26px] border border-white/10 bg-slate-950/80 p-8 min-h-[400px]"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    }>
      <ContactPageContent />
    </Suspense>
  )
}
