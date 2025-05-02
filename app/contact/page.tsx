"use client"

import type React from "react"

import { useLanguage } from "@/contexts/language-context"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const isQuote = searchParams.get("quote") === "true"

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
    submitted: false,
    loading: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState({ ...formState, loading: true })

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setFormState({
      name: "",
      email: "",
      message: "",
      submitted: true,
      loading: false,
    })
  }

  const contactInfo = [
    {
      icon: Mail,
      title: t("contact.email"),
      content: "negocios@vanguard.es",
      href: "mailto:negocios@vanguard.es",
    },
    {
      icon: Phone,
      title: t("contact.phone"),
      content: "+34 627 961 956",
      href: "tel:+34627961956",
    },
    {
      icon: MapPin,
      title: t("contact.address"),
      content: "Barcelona, Spain",
      href: "#",
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="vanguard-section bg-gray-50">
        <div className="vanguard-container">
          <h1 className="text-3xl md:text-4xl font-bold text-vanguard-blue mb-4">{t("contact.title")}</h1>
          <div className="vanguard-divider"></div>
          <p className="text-xl text-gray-600">{t("contact.subtitle")}</p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="vanguard-section">
        <div className="vanguard-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="vanguard-card border-0">
              <CardHeader>
                <CardTitle className="text-vanguard-blue">
                  {isQuote ? t("contact.form.quote") : t("contact.form.message")}
                </CardTitle>
                <div className="vanguard-divider"></div>
                <CardDescription>{t("contact.form.fill")}</CardDescription>
              </CardHeader>
              <CardContent>
                {formState.submitted ? (
                  <div className="text-center py-8">
                    <div className="text-vanguard-blue text-4xl mb-4">✓</div>
                    <h3 className="text-xl font-semibold mb-2">{t("contact.form.thanks")}</h3>
                    <p className="text-gray-600">{t("contact.form.sent")}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("contact.form.name")}</Label>
                      <Input
                        id="name"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        required
                        className="transition-all duration-300 focus:border-vanguard-blue focus:ring-vanguard-blue"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t("contact.form.email")}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        required
                        className="transition-all duration-300 focus:border-vanguard-blue focus:ring-vanguard-blue"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">{t("contact.form.message")}</Label>
                      <Textarea
                        id="message"
                        rows={5}
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        required
                        className="transition-all duration-300 focus:border-vanguard-blue focus:ring-vanguard-blue"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-vanguard-blue hover:bg-vanguard-blue/90 transition-all duration-300"
                      disabled={formState.loading}
                    >
                      {formState.loading ? t("contact.form.sending") : t("contact.form.submit")}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-vanguard-blue mb-4">{t("contact.info")}</h2>
                <div className="vanguard-divider"></div>
                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="bg-gray-100 p-3 rounded-full mr-4 transition-all duration-300 hover:bg-vanguard-blue/10">
                        <item.icon className="h-6 w-6 text-vanguard-blue" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <a
                          href={item.href}
                          className="text-gray-600 hover:text-vanguard-blue transition-all duration-300 vanguard-button-hover"
                        >
                          {item.content}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-vanguard-blue mb-4">{t("contact.hours")}</h2>
                <div className="vanguard-divider"></div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Monday - Friday:</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Saturday:</span>
                    <span>10:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Sunday:</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
