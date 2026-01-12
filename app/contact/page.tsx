"use client"

import type React from "react"
import { Suspense } from "react"

import { useLanguage } from "@/contexts/language-context"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Linkedin, ShieldCheck } from "lucide-react"
import { SectionTitle } from "@/components/section-title"
import { contactInfo as defaultContactInfo } from "@/lib/content/contact"
import Turnstile from "react-turnstile"

function ContactPageContent() {
  const { t, language } = useLanguage()
  const searchParams = useSearchParams()
  const isQuote = searchParams.get("quote") === "true"
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
    submitted: false,
    loading: false,
    honeypot: "",
    lastSubmittedAt: 0,
  })
  const [turnstileToken, setTurnstileToken] = useState<string>("")


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formState.honeypot.trim() !== "") {
      return
    }

    const now = Date.now()
    if (now - formState.lastSubmittedAt < 15000) {
      alert("Please wait a few seconds before submitting again.")
      return
    }

    // Verify Turnstile token is present (in production)
    if (process.env.NODE_ENV === 'production' && turnstileSiteKey && !turnstileToken) {
      alert("Please complete the security verification.")
      return
    }

    setFormState(prev => ({ ...prev, loading: true }))

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: formState.message,
          honeypot: formState.honeypot,
          captchaToken: turnstileToken,
        }),
      })

      if (response.ok) {
        setFormState({
          name: "",
          email: "",
          message: "",
          submitted: true,
          loading: false,
          honeypot: "",
          lastSubmittedAt: now,
        })
        setTurnstileToken("")
      } else {
        const errorData = await response.json().catch(() => ({}))
        setFormState(prev => ({ ...prev, loading: false }))
        setTurnstileToken("")
        alert(errorData.message || "There was an error sending your message. Please try again later.")
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setFormState(prev => ({ ...prev, loading: false }))
      setTurnstileToken("")
      alert("There was an error sending your message. Please try again later.")
    }
  }

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

      {/* Contact Form Section */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_rgba(2,6,23,0.92))] -z-0" />
        <div className="vanguard-container relative z-10 py-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div className="relative">
              <div className="absolute inset-0 blur-3xl opacity-70 [background:radial-gradient(circle_at_top,_rgba(14,165,233,0.35),_rgba(15,23,42,0))] -z-10" />
              <div className="relative z-10 rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950/65 to-slate-950/90 p-[1px] shadow-[0_35px_65px_rgba(2,6,23,0.6)] backdrop-blur">
                <div className="rounded-[26px] border border-white/10 bg-slate-950/80">
                  <Card className="h-full border-0 bg-transparent text-slate-100">
                    <CardHeader className="space-y-4 border-b border-white/10 bg-gradient-to-br from-slate-900/60 via-slate-950/40 to-slate-950/80">
                      <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.4em] text-slate-300">
                        <ShieldCheck className="h-4 w-4 text-vanguard-blue" />
                        <span>{t("contact.form.secureForm")}</span>
                      </div>
                      <CardTitle className="text-2xl font-semibold text-white md:text-3xl">
                        {isQuote ? t("contact.form.quote") : t("contact.form.message")}
                      </CardTitle>
                      <CardDescription className="max-w-2xl text-sm leading-relaxed text-slate-300">
                        {t("contact.form.fill")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                      {formState.submitted ? (
                        <div className="py-10 text-center">
                          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-vanguard-blue/40 bg-vanguard-blue/10 text-3xl text-vanguard-blue">
                            ✓
                          </div>
                          <h3 className="mb-2 text-2xl font-semibold text-white">{t("contact.form.thanks")}</h3>
                          <p className="text-base text-slate-300">{t("contact.form.sent")}</p>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="name" className="text-sm font-medium tracking-wide text-slate-200">
                                {t("contact.form.name")}
                              </Label>
                              <Input
                                id="name"
                                value={formState.name}
                                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                required
                                className="h-12 rounded-xl border-white/15 bg-slate-900/70 text-white placeholder:text-slate-500 transition-all duration-300 focus:border-vanguard-blue focus:ring-2 focus:ring-vanguard-blue/60"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email" className="text-sm font-medium tracking-wide text-slate-200">
                                {t("contact.form.email")}
                              </Label>
                              <Input
                                id="email"
                                type="email"
                                value={formState.email}
                                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                required
                                className="h-12 rounded-xl border-white/15 bg-slate-900/70 text-white placeholder:text-slate-500 transition-all duration-300 focus:border-vanguard-blue focus:ring-2 focus:ring-vanguard-blue/60"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="message" className="text-sm font-medium tracking-wide text-slate-200">
                              {t("contact.form.message")}
                            </Label>
                            <Textarea
                              id="message"
                              rows={6}
                              value={formState.message}
                              onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                              required
                              className="rounded-2xl border-white/15 bg-slate-900/70 text-white placeholder:text-slate-500 transition-all duration-300 focus:border-vanguard-blue focus:ring-2 focus:ring-vanguard-blue/60"
                            />
                          </div>
                          {turnstileSiteKey && (
                            <div className="flex justify-center">
                              <Turnstile
                                siteKey={turnstileSiteKey}
                                onSuccess={(token) => setTurnstileToken(token)}
                                onError={() => setTurnstileToken("")}
                                onExpire={() => setTurnstileToken("")}
                                theme="dark"
                              />
                            </div>
                          )}
                          <Button
                            type="submit"
                            className="group w-full h-12 rounded-xl bg-gradient-to-r from-vanguard-blue via-sky-500 to-cyan-500 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-[0_20px_40px_rgba(56,189,248,0.35)] transition-all duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                            disabled={formState.loading}
                          >
                            <span className="inline-flex items-center gap-2">
                              {formState.loading ? t("contact.form.sending") : t("contact.form.submit")}
                            </span>
                          </Button>
                          <p className="text-xs text-slate-400">
                            {t("contact.form.privacy")}
                          </p>
                          <div className="hidden" aria-hidden="true">
                            <Label htmlFor="company">Company</Label>
                            <Input
                              id="company"
                              name="company"
                              autoComplete="off"
                              tabIndex={-1}
                              value={formState.honeypot}
                              onChange={(e) => setFormState({ ...formState, honeypot: e.target.value })}
                            />
                          </div>
                        </form>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

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
        {/* Contact Form Section Fallback - matches exact structure */}
        <section className="relative overflow-hidden bg-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_rgba(2,6,23,0.92))] -z-0" />
          <div className="vanguard-container relative z-10 py-24">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              <div className="relative">
                <div className="absolute inset-0 blur-3xl opacity-70 [background:radial-gradient(circle_at_top,_rgba(14,165,233,0.35),_rgba(15,23,42,0))] -z-10" />
                <div className="relative z-10 rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950/65 to-slate-950/90 p-[1px] shadow-[0_35px_65px_rgba(2,6,23,0.6)] backdrop-blur">
                  <div className="rounded-[26px] border border-white/10 bg-slate-950/80 p-8 min-h-[400px]"></div>
                </div>
              </div>
              <div className="space-y-12 text-white">
                <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-950/60 to-slate-950/90 p-10 min-h-[300px]"></div>
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
