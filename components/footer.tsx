"use client"

import { useLanguage } from "@/contexts/language-context"
import { useCookies } from "@/contexts/cookie-context"
import { Logo } from "@/components/logo"
import { Linkedin, Mail, Phone, MapPin, Settings } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"


export function Footer() {
  const { t, language } = useLanguage()
  const { setShowSettings } = useCookies()
  const currentYear = new Date().getFullYear()

  const contactInfo = [
    { icon: Mail, text: "contacto@vanguard-ia.tech", href: "mailto:contacto@vanguard-ia.tech" },
    { icon: Phone, text: "+34 644 059 040", href: "tel:+34644059040" },
    { icon: MapPin, text: "Barcelona, España", href: "#" },
    {
      icon: Linkedin,
      text: t("contact.linkedin.title") + "!",
      href: "https://www.linkedin.com/company/vanguard-lb-consulting"
    },
  ]

  const footerLinks = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.about"), href: "/about/" },
    { label: t("nav.services"), href: "/services/" },
    { label: t("nav.events"), href: "/events/" },
    { label: t("nav.contact"), href: "/contact/" },
    { label: t("footer.privacyPolicy"), href: "/privacy/" },
    { label: t("footer.cookiePolicy"), href: "/cookies/" },
    { label: t("footer.termsOfService"), href: "/terms/" },
    { label: t("footer.faq"), href: "/faq/" },
  ]

  return (
    <footer className="bg-gray-50 border-t border-gray-100" style={{ zIndex: 30, position: 'relative' }}>
      <div className="vanguard-container py-12" style={{ position: 'relative', zIndex: 31 }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Social */}
          <div className="space-y-6">
            <Logo />
            <p className="text-gray-600 max-w-xs">
              {t("footer.description")}
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-vanguard-blue mb-4">
              {t("footer.contact")}
            </h3>
            <div className="vanguard-divider"></div>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start group">
                  <div className="bg-gray-100 p-2 rounded-full mr-2 transition-all duration-300 group-hover:bg-vanguard-blue/10">
                    <item.icon className="h-5 w-5 text-vanguard-blue transition-all duration-300 group-hover:scale-110" />
                  </div>
                  <a
                    href={item.href}
                    className="text-gray-600 hover:text-vanguard-blue transition-all duration-300 vanguard-button-hover mt-1"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-vanguard-blue mb-4">
              {t("footer.quickLinks")}
            </h3>
            <div className="vanguard-divider"></div>
            <ul className="grid grid-cols-2 gap-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-vanguard-blue transition-all duration-300 vanguard-button-hover hover:-translate-y-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} VANGUARD-IA. {t("footer.rights")}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="text-gray-500 hover:text-vanguard-blue text-sm"
            >
              <Settings className="h-4 w-4 mr-2" />
              {t("footer.cookieSettings")}
            </Button>
            <p className="text-gray-500 text-sm">
              <a
                href="https://www.vanguard-ia.tech"
                className="hover:text-vanguard-blue transition-all duration-300 vanguard-button-hover"
              >
                www.vanguard-ia.tech
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
