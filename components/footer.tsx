"use client"

import { useLanguage } from "@/contexts/language-context"
import { Logo } from "@/components/logo"
import { Facebook, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

// Custom X (formerly Twitter) icon
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 4l11.5 11.5M4 20l16-16" />
      <path d="M19 4v16M5 4v16" />
    </svg>
  )
}

export function Footer() {
  const { t, language } = useLanguage()
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: XIcon, href: "#", label: "X" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ]

  const contactInfo = [
    { icon: Mail, text: "sales@vanguard-ia.tech", href: "mailto:sales@vanguard-ia.tech" },
    { icon: Phone, text: "+34 627 961 956", href: "tel:+34627961956" },
    { icon: MapPin, text: "Barcelona, España", href: "#" },
  ]

  const footerLinks = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.about"), href: "/about" },
    { label: t("nav.services"), href: "/services" },
    { label: t("nav.blog"), href: "/blog" },
    { label: t("nav.contact"), href: "/contact" },
    { label: language === "en" ? "Privacy Policy" : "Política de Privacidad", href: "/privacy" },
    { label: language === "en" ? "Terms of Service" : "Términos de Servicio", href: "/terms" },
    { label: language === "en" ? "FAQ" : "Preguntas Frecuentes", href: "/faq" },
  ]

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="vanguard-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Social */}
          <div className="space-y-6">
            <Logo />
            <p className="text-gray-600 max-w-xs">
              {language === "en"
                ? "Specialized consultancy in AI, Computer Services, web branding, infrastructure, and security."
                : "Consultoría especializada en IA, Servicios Informáticos, branding web, infraestructura y seguridad."}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-vanguard-blue hover:text-vanguard-blue/80 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-vanguard-blue mb-4">
              {language === "en" ? "Contact" : "Contacto"}
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
              {language === "en" ? "Quick Links" : "Enlaces Rápidos"}
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

        <div className="border-t border-gray-200 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} VANGUARD-IA. {language === "en" ? "All rights reserved." : "Todos los derechos reservados."}
          </p>
          <p className="text-gray-500 text-sm mt-2 md:mt-0">
            <a
              href="https://www.vanguard-ia.tech"
              className="hover:text-vanguard-blue transition-all duration-300 vanguard-button-hover"
            >
              www.vanguard-ia.tech
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
