"use client"

import { useLanguage } from "@/contexts/language-context"
import { useCookies } from "@/contexts/cookie-context"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { COOKIE_CATEGORIES } from "@/lib/cookies"

export default function CookiesPage() {
  const { language } = useLanguage()
  const { setShowSettings } = useCookies()

  const content = {
    en: {
      title: "Cookie Policy",
      lastUpdated: "Last Updated: December 12, 2025",
      introduction: {
        title: "Introduction",
        content:
          "This Cookie Policy explains how VANGUARD-IA uses cookies and similar technologies on our website. By using our website, you consent to the use of cookies in accordance with this policy.",
      },
      whatAreCookies: {
        title: "What Are Cookies?",
        content:
          "Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.",
      },
      howWeUseCookies: {
        title: "How We Use Cookies",
        content:
          "We use cookies to enhance your experience on our website, analyze site usage, and assist in our marketing efforts. Below you can find detailed information about each type of cookie we use.",
      },
      manageCookies: {
        title: "Manage Your Cookie Preferences",
        content:
          "You can manage your cookie preferences at any time by clicking the button below. You can enable or disable different types of cookies according to your preferences.",
        button: "Manage Cookie Preferences",
      },
      cookieTypes: {
        title: "Types of Cookies We Use",
      },
      browserSettings: {
        title: "Browser Settings",
        content:
          "You can also control cookies through your browser settings. Most browsers allow you to refuse or accept cookies, or to be notified when a cookie is being sent. However, please note that disabling cookies may affect the functionality of our website.",
      },
      updates: {
        title: "Updates to This Policy",
        content:
          "We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the 'Last Updated' date.",
      },
      contact: {
        title: "Contact Us",
        content:
          "If you have any questions about this Cookie Policy, please contact us at contacto@vanguard-ia.tech",
      },
    },
    es: {
      title: "Política de Cookies",
      lastUpdated: "Última Actualización: 12 de Diciembre, 2025",
      introduction: {
        title: "Introducción",
        content:
          "Esta Política de Cookies explica cómo VANGUARD-IA utiliza cookies y tecnologías similares en nuestro sitio web. Al utilizar nuestro sitio web, usted consiente el uso de cookies de acuerdo con esta política.",
      },
      whatAreCookies: {
        title: "¿Qué Son las Cookies?",
        content:
          "Las cookies son pequeños archivos de texto que se colocan en su computadora o dispositivo móvil cuando visita un sitio web. Se utilizan ampliamente para hacer que los sitios web funcionen de manera más eficiente y proporcionar información a los propietarios del sitio web.",
      },
      howWeUseCookies: {
        title: "Cómo Utilizamos las Cookies",
        content:
          "Utilizamos cookies para mejorar su experiencia en nuestro sitio web, analizar el uso del sitio y ayudar en nuestros esfuerzos de marketing. A continuación puede encontrar información detallada sobre cada tipo de cookie que utilizamos.",
      },
      manageCookies: {
        title: "Gestione Sus Preferencias de Cookies",
        content:
          "Puede gestionar sus preferencias de cookies en cualquier momento haciendo clic en el botón a continuación. Puede habilitar o deshabilitar diferentes tipos de cookies según sus preferencias.",
        button: "Gestionar Preferencias de Cookies",
      },
      cookieTypes: {
        title: "Tipos de Cookies que Utilizamos",
      },
      browserSettings: {
        title: "Configuración del Navegador",
        content:
          "También puede controlar las cookies a través de la configuración de su navegador. La mayoría de los navegadores le permiten rechazar o aceptar cookies, o ser notificado cuando se envía una cookie. Sin embargo, tenga en cuenta que deshabilitar las cookies puede afectar la funcionalidad de nuestro sitio web.",
      },
      updates: {
        title: "Actualizaciones de Esta Política",
        content:
          "Podemos actualizar esta Política de Cookies de vez en cuando. Le notificaremos cualquier cambio publicando la nueva política en esta página y actualizando la fecha de 'Última Actualización'.",
      },
      contact: {
        title: "Contáctenos",
        content:
          "Si tiene alguna pregunta sobre esta Política de Cookies, contáctenos en contacto@vanguard-ia.tech",
      },
    },
  }

  const t = content[language]

  return (
    <div className="py-12">
      <div className="vanguard-container">
        <h1 className="text-3xl font-bold text-vanguard-blue mb-2">{t.title}</h1>
        <p className="text-gray-500 mb-8">{t.lastUpdated}</p>

        <div className="space-y-8">
          {/* Introduction */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-vanguard-blue mb-3">
              {t.introduction.title}
            </h2>
            <p className="text-gray-600">{t.introduction.content}</p>
          </div>

          {/* What Are Cookies */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-vanguard-blue mb-3">
              {t.whatAreCookies.title}
            </h2>
            <p className="text-gray-600">{t.whatAreCookies.content}</p>
          </div>

          {/* How We Use Cookies */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-vanguard-blue mb-3">
              {t.howWeUseCookies.title}
            </h2>
            <p className="text-gray-600 mb-4">{t.howWeUseCookies.content}</p>
          </div>

          {/* Cookie Types */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-vanguard-blue mb-4">
              {t.cookieTypes.title}
            </h2>
            <div className="space-y-4">
              {Object.entries(COOKIE_CATEGORIES).map(([key, category]) => (
                <div key={key} className="border-l-4 border-vanguard-blue pl-4">
                  <h3 className="text-lg font-medium text-vanguard-blue mb-2">
                    {category.name[language]}
                  </h3>
                  <p className="text-gray-600">{category.description[language]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Manage Cookies */}
          <div className="bg-vanguard-blue/5 p-6 rounded-lg border border-vanguard-blue/20">
            <h2 className="text-xl font-semibold text-vanguard-blue mb-3">
              {t.manageCookies.title}
            </h2>
            <p className="text-gray-600 mb-4">{t.manageCookies.content}</p>
            <Button
              onClick={() => setShowSettings(true)}
              className="bg-vanguard-blue hover:bg-vanguard-blue/90"
            >
              <Settings className="h-4 w-4 mr-2" />
              {t.manageCookies.button}
            </Button>
          </div>

          {/* Browser Settings */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-vanguard-blue mb-3">
              {t.browserSettings.title}
            </h2>
            <p className="text-gray-600">{t.browserSettings.content}</p>
          </div>

          {/* Updates */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-vanguard-blue mb-3">{t.updates.title}</h2>
            <p className="text-gray-600">{t.updates.content}</p>
          </div>

          {/* Contact */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-vanguard-blue mb-3">{t.contact.title}</h2>
            <p className="text-gray-600">{t.contact.content}</p>
          </div>
        </div>
      </div>
    </div>
  )
}


