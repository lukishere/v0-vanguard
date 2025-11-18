"use client"

import { useCookies } from "@/contexts/cookie-context"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Settings, X } from "lucide-react"
import Link from "next/link"

export function CookieBanner() {
  const { showBanner, acceptAll, rejectAll, setShowSettings } = useCookies()
  const { language } = useLanguage()

  if (!showBanner) return null

  const content = {
    en: {
      title: "Cookie Consent",
      message:
        "We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking 'Accept All', you consent to our use of cookies.",
      acceptAll: "Accept All",
      rejectAll: "Reject All",
      customize: "Customize",
      learnMore: "Learn More",
    },
    es: {
      title: "Consentimiento de Cookies",
      message:
        "Utilizamos cookies para mejorar su experiencia de navegación, mostrar contenido personalizado y analizar nuestro tráfico. Al hacer clic en 'Aceptar Todas', usted consiente nuestro uso de cookies.",
      acceptAll: "Aceptar Todas",
      rejectAll: "Rechazar Todas",
      customize: "Personalizar",
      learnMore: "Saber Más",
    },
  }

  const t = content[language]

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl animate-in slide-in-from-bottom duration-300"
      style={{ zIndex: 9999 }}
    >
      <div className="vanguard-container py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-vanguard-blue mb-2">{t.title}</h3>
            <p className="text-gray-600 text-sm mb-2">{t.message}</p>
            <Link
              href="/cookies/"
              className="text-vanguard-blue hover:underline text-sm"
            >
              {t.learnMore} →
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={rejectAll}
              className="w-full sm:w-auto"
            >
              {t.rejectAll}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSettings(true)}
              className="w-full sm:w-auto"
            >
              <Settings className="h-4 w-4 mr-2" />
              {t.customize}
            </Button>
            <Button
              onClick={acceptAll}
              className="w-full sm:w-auto bg-vanguard-blue hover:bg-vanguard-blue/90"
            >
              {t.acceptAll}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
